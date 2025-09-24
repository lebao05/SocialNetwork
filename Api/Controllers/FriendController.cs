using AutoMapper;
using BusinessLogic.DTOs.Friend;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Helpers;
using System.Security.Claims;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IFriendService _friendService;
        public FriendController(IFriendService friendService, IMapper mapper)
        {
            _mapper = mapper;
            _friendService = friendService;
        }
        // POST: api/friend/send
        [HttpPost("send/{userId}")]
        public async Task<ActionResult<FriendRequestDto>> SendFriendRequest(string userId)
        {

            var RequesterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (RequesterId == null)
            {
                return Unauthorized();
            }
            var request = await _friendService.SendFriendRequestAsync(RequesterId, userId);
            return Ok(new ApiResponse(200, "Successfully", _mapper.Map<FriendRequestDto>(request)));

        }

        // POST: api/friend/accept/{requestId}
        [HttpPost("accept/{requestId}")]
        public async Task<ActionResult<FriendShipDto>> AcceptFriendRequest(string requestId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            var friendship = await _friendService.AcceptFriendRequestAsync(requestId, userId);
            return Ok(new ApiResponse(200, "Successfully", _mapper.Map<FriendShipDto>(friendship)));
        }

        // DELETE: api/friend/request/{requestId}
        [HttpDelete("request/{requestId}")]
        public async Task<IActionResult> DeleteFriendRequest(string requestId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            var deleted = await _friendService.DeleteFriendRequestAsync(requestId, userId);
            if (!deleted) return NotFound(new { Message = "Friend request not found" });
            return Ok(new { Message = "Friend request deleted" });
        }

        // DELETE: api/friend/{userId}
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteFriend(string userId)
        {
            var RequesterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var deleted = await _friendService.DeleteFriendAsync(RequesterId, userId);
            if (!deleted) return NotFound(new { Message = "Friendship not found" });
            return Ok(new { Message = "Friendship deleted" });
        }

        // Fix for CA1806, CS1002, CS1513 in GetFriends method
        [HttpGet("")]
        public async Task<ActionResult> GetFriends()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var friends = await _friendService.GetFriendsAsync(userId);
            var friendDtos = friends.Select(r => _mapper.Map<FriendShipDto>(r)).ToList();
            return Ok(new
            {
                Message = "Successfully",
                Data = friendDtos
            });
        }

        // GET: api/friend/requests/{userId}
        [HttpGet("requests")]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> GetFriendRequests()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var requests = await _friendService.GetFriendRequestsAsync(userId);
            var requestDtos = requests.Select(r => _mapper.Map<FriendRequestDto>(r)).ToList();
            return Ok(new
            {
                Message = "Successfully",
                Data = requestDtos
            });
        }
    }
}
