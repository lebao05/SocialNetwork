using Api.SignalR;
using Api.Utils;
using BusinessLogic.DTOs.Chat;
using BusinessLogic.Services.Interfaces;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Shared.Configs;
using Shared.Errors;
using Shared.Helpers;
using Shared.Services.Interfaces;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly AppDbContext _context;
        private readonly AzureStorageOptions _options;
        private readonly IBlobService _blobService;
        private readonly IMessageAttachmentRepo _messageAttachmentRepo;
        public ChatController(
            IChatService chatService,
            AppDbContext context,
            IOptions<AzureStorageOptions> options,
            IBlobService blobservice,
            IMessageAttachmentRepo messageAttachmentRepo)
        {
            _context = context;
            _chatService = chatService;
            _options = options.Value;
            _blobService = blobservice;
            _messageAttachmentRepo = messageAttachmentRepo;
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
            dto.MemberIds.Add(userId);
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
        [HttpDelete("conversations/{id}")]
        public async Task<ActionResult> DeleteConversation(string id)
        {
            var conversation = await _context.Conversations.FindAsync(id);
            if (conversation == null)
                return NotFound(new ApiResponse(404, "Conversation not found", null));

            // Soft delete
            conversation.Deleted = true;

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse(200, "Successfully deleted", null));
        }
        [HttpGet("conversations/{id}")]
        public async Task<ActionResult> GetConversation(string id)
        {
            var conversation = await _chatService.GetConversationByIdAsync(id, GetUserId());
            return Ok(new ApiResponse(200, "Successfully deleted", conversation));
        }
        [HttpGet("conversations")]
        public async Task<ActionResult<List<ConversationResponseDto>>> GetConversations()
        {
            // Safely get user ID
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new ApiResponse(401, "User is not authenticated"));

            var conversations = await _chatService.GetUserConversationsAsync(userId);
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
        [HttpPut("conversations/member/{conversationId}/")]
        public async Task<IActionResult> EnableNotification(string conversationId)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                throw new HttpResponseException(401, "Unauthorized");
            }
            bool isSuccess = await _chatService.EnableNotification(userId, conversationId);
            if (isSuccess)
                return Ok(new ApiResponse(200, "Successfully"));
            throw new HttpResponseException(500, "Something went wrong");
        }
        [HttpPost("get-sas-upload")]
        public async Task<ActionResult> GetSasUpload([FromBody] AttachmentMetadataDto dto)
        {
            if (dto.Equals(null) || string.IsNullOrEmpty(dto.OriginalName)
                || string.IsNullOrEmpty(dto.FileType) || dto.Size <=0)
            {
                return BadRequest(new ApiResponse(400, "Invalid attachment metadata", null));
            }
            var userId = GetUserId();
            if (User == null)
                return Unauthorized(new ApiResponse(401, "Unauthorized", null));
            var blobname = $"{Guid.NewGuid()}{Path.GetExtension(dto.OriginalName)}";
            var sasUrl = _blobService.GenerateUploadSasUrl(
                _options.ConversationContainer, blobname, 10);
            var uri = new Uri(sasUrl);
            var blobUrl = uri.GetLeftPart(UriPartial.Path); // removes query string
            var attachment = await _messageAttachmentRepo.AddAsync(new MessageAttachment
            {
                BlobName = blobname,
                BlobUrl =  blobUrl,
                UserId = userId,
                FileType = dto.FileType,
                OriginalName = dto.OriginalName,
                Size = dto.Size,
                CreatedAt = DateTime.UtcNow
            });
            return Ok(new ApiResponse(200, "Successfully", new { sasUrl = sasUrl, blobname = blobname }));
        }

    }
}
