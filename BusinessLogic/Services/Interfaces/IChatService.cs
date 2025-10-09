using BusinessLogic.DTOs.Chat;
using DataAccess.Entities;

namespace BusinessLogic.Services.Interfaces
{
    public interface IChatService
    {
        Task<MessageResponseDto> SendMessageAsync(string userId, SendMessageDto dto);
        Task<ConversationResponseDto> CreateConversationAsync(string creatorId, CreateConversationDto dto);
        Task<List<ConversationResponseDto>> GetUserConversationsAsync(string userId);
        Task<List<MessageResponseDto>> GetConversationMessagesAsync(string conversationId, int page = 1, int pageSize = 15);
        Task<bool> IsConversationMember(string conversationId, string userId);
        Task<List<string>> GetUserConversationIds(string userId);
        Task<ConversationResponseDto> GetConversationByIdAsync(string conversationId, string userId);
        Task DeleteMessageAsync(string userId, string messageId);
        Task<bool> LeaveChatGroup(string userId, string conversationId);
        Task<bool> DeleteMessage(string userId, string messageId);
        Task<bool> DeleteAttachment(string userId, string attachmentId);
    }
}
