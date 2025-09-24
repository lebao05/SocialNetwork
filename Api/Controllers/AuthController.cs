using BusinessLogic.DTOs.User;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Helpers;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {

            var result = await _authService.RegisterAsync(dto);
            return Ok(new ApiResponse(200, "Registered successfully!", result));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(new ApiResponse(200, "Logged in successfully!", result));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {

            await _authService.LogoutAsync();
            return Ok(new ApiResponse(200, "Logged in successfully!"));
        }
    }
}
