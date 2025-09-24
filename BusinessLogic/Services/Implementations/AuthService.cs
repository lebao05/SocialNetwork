using AutoMapper;
using BusinessLogic.DTOs.User;
using BusinessLogic.Services.Interfaces;
using DataAccess.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shared.Errors;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessLogic.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        public AuthService(
            UserManager<AppUser> userManager,
            IConfiguration config,
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper,
            IUserService userService)
        {
            _userManager = userManager;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _userService=userService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Map DTO to AppUser
            var user = _mapper.Map<AppUser>(dto);
            user.UserName = dto.Email; // Identity requires username
            var validGenders = new[] { "Male", "Female", "Other" };
            if (!validGenders.Contains(user.Gender, StringComparer.OrdinalIgnoreCase))
            {
                throw new HttpResponseException(StatusCodes.Status400BadRequest,
                    "Gender must be either 'Male', 'Female', or 'Other'.");
            }
            // Check if email already exists
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new HttpResponseException(StatusCodes.Status404NotFound, "Email already exists.");

            // Create user
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                // Take only the first error
                var firstError = result.Errors.FirstOrDefault()?.Description ?? "Registration failed.";
                throw new HttpResponseException(StatusCodes.Status400BadRequest, firstError);
            }
            user = await _userManager.FindByEmailAsync(dto.Email);
            // Generate JWT and set cookie
            string token = GenerateJwtToken(user);
            SetCookie("AccessToken", token);

            // Map user to AuthResponseDto
            return _mapper.Map<AuthResponseDto>(user);
        }



        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                throw new HttpResponseException(StatusCodes.Status401Unauthorized, "Invalid login credentials.");
            }

            string token = GenerateJwtToken(user);
            SetCookie("AccessToken", token);

            var response = _mapper.Map<AuthResponseDto>(user);
            return response;
        }

        public Task LogoutAsync()
        {
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("AccessToken");
            return Task.CompletedTask;
        }

        public string GenerateJwtToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SigningKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SetCookie(string name, string token)
        {
            var response = _httpContextAccessor.HttpContext?.Response;

            if (response != null)
            {
                response.Cookies.Append(name, token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,              // allow HTTP in dev
                    SameSite = SameSiteMode.None, // allow cross-origin cookies
                    Expires = DateTime.UtcNow.AddHours(1)
                });
            }
        }

        void IAuthService.SetCookie(string name, string token)
        {
            SetCookie(name, token);
        }
    }
}
