using Api.SignalR;
using BusinessLogic.DTOs.Chat;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Shared.Errors;
using Shared.Helpers;
using System.Security.Claims;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException();
        }

        [HttpPost("conversations")]
        public async Task<ActionResult<ConversationResponseDto>> CreateConversation(
            [FromBody] CreateConversationDto dto,
            [FromServices] IHubContext<ChatHub> chatHub,
            [FromServices] IPresenceTracker presenceTracker) // inject hub context
        {
            var userId = GetUserId();
            var result = await _chatService.CreateConversationAsync(userId, dto);
            foreach (var memberId in dto.MemberIds)
            {
                var connections = await presenceTracker.GetConnectionsForUser(memberId);
                foreach (var connectionId in connections)
                {
                    await chatHub.Groups.AddToGroupAsync(connectionId, result.Id);
                }
            }
            return Ok(new ApiResponse(200, "Successfully", result));
        }

        [HttpGet("conversations")]
        public async Task<ActionResult<List<ConversationResponseDto>>> GetConversations()
        {
            var userId = GetUserId();
            var conversations = await _chatService.GetUserConversationsAsync(userId);
            return Ok(new ApiResponse(200, "Successfully", conversations));

        }
        [HttpGet("conversations/{id}")]
        public async Task<ActionResult<List<ConversationResponseDto>>> GetConversation(string id)
        {
            var userId = GetUserId();
            var conversations = await _chatService.GetConversationByIdAsync(id,userId);
            return Ok(new ApiResponse(200, "Successfully", conversations));

        }
        [HttpGet("conversations/{conversationId}/messages")]
        public async Task<ActionResult<List<MessageResponseDto>>> GetMessages(
            string conversationId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 15)
        {
            var userId = GetUserId();
            var isMember = await _chatService.IsConversationMember(conversationId, userId);

            if (!isMember)
            {
               throw new HttpResponseException(StatusCodes.Status403Forbidden, "You are not a member of this conversation.");
            }

            var messages = await _chatService.GetConversationMessagesAsync(
                conversationId, page, pageSize);
            return Ok(new ApiResponse(200, "Successfully", messages));
        }
    }
}
