using AutoMapper;
using BusinessLogic.DTOs.EducationWork;
using BusinessLogic.DTOs.User;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }


        [HttpPost("uploadavatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("OK");
            bool IsAvatar = true;
            var url = await _userService.UploadPerImageAsync(userId, IsAvatar, file);

            return Ok(new
            {
                Message = "Avatar uploaded successfully",
                Data = new { avatarUrl = url }
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
                Message = "Cover uploaded successfully",
                Data = new { coverUrl = url }
            });
        }
        // ✅ Add Work
        [HttpPost("work")]
        [Authorize]
        public async Task<IActionResult> AddWork([FromBody] AddWorkDto dto)
        {

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var work = await _userService.AddWork(dto, userId!);
            return Ok(new { Message = "Successfully", Data = _mapper.Map<WorkDto>(work) });
        }

        // ✅ Update Work
        [HttpPut("work")]
        [Authorize]
        public async Task<IActionResult> UpdateWork([FromBody] WorkDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var work = await _userService.UpdateWork(dto, userId!);
            return Ok(new { Message = "Successfully", Data = _mapper.Map<WorkDto>(work) });
        }

        // ✅ Delete Work
        [HttpDelete("work/{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveWork(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _userService.RemoveWork(id, userId!);
            if (!result) return NotFound(new { Message = "Work not found" });
            return NoContent();
        }

        // ✅ Add Education
        [HttpPost("education")]
        [Authorize]
        public async Task<IActionResult> AddEducation([FromBody] AddEducationDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var edu = await _userService.AddEducation(dto, userId!);
            return Ok(new { Message = "Successfully", Data = _mapper.Map<EducationDto>(edu) });
        }

        // ✅ Update Education
        [HttpPut("education")]
        [Authorize]
        public async Task<IActionResult> UpdateEducation([FromBody] EducationDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var edu = await _userService.UpdateEducation(dto, userId!);
            return Ok(new { Message = "Successfully", Data = _mapper.Map<EducationDto>(edu) });
        }

        // ✅ Delete Education
        [HttpDelete("education/{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveEducation(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _userService.RemoveEducation(id, userId!);
            if (!result) return NotFound(new { Message = "Education not found" });
            return NoContent();
        }
        [HttpGet("work/all")]
        [Authorize]
        public async Task<IActionResult> GetAllWorks()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var works = await _userService.GetAllWorks(userId!);
            var workdtos = works.Select(w => _mapper.Map<WorkDto>(w)).ToList();
            return Ok(new { Message = "Successfully", Data = workdtos });
        }

        // ✅ Get all educations
        [HttpGet("education/all")]
        [Authorize]
        public async Task<IActionResult> GetAllEducations()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var educations = await _userService.GetAllEducations(userId!);
            var edcationdtos = educations.Select(s => _mapper.Map<EducationDto>(s)).ToList();
            return Ok(new { Message = "Successfully", Data = edcationdtos });
        }
        [HttpPut("info")]
        [Authorize]
        public async Task<IActionResult> UpdateBasicInfo(UpdateInfoDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userService.UpdateBasicInfo(userId, dto);
            return Ok(new { Message = "Successfully" , Data = _mapper.Map<UpdateInfoResponseDto>(user) });
        }
        [HttpGet("getme")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var res = await _userService.GetProfile(userId);
            return Ok(new { Message = "Succesfully", Data = _mapper.Map<UserDto>(res) });
        }
        [HttpGet("profile/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetProfile(string userId)
        {
            var res = await _userService.GetProfile(userId);
            return Ok(new { Message = "Succesfully", Data = _mapper.Map<UserDto>(res) });
        }
    }
}
