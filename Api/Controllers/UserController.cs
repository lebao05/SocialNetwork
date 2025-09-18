using BusinessLogic.Services.Interfaces;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("uploadavatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("OK");
            bool IsAvatar = true;
            var url = await _userService.UploadPerImageAsync(userId, IsAvatar , file);

            return Ok(new
            {
                Message = "Avatar uploaded successfully",
                Url = url
            });
        }
        [HttpPost("uploadcover")]
        [Authorize]
        public async Task<IActionResult> UploadCover(IFormFile file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("OK");
            bool IsAvatar = false;
            var url = await _userService.UploadPerImageAsync(userId, IsAvatar, file);

            return Ok(new
            {
                Message = "Avatar uploaded successfully",
                Url = url
            });
        }
    }
}
