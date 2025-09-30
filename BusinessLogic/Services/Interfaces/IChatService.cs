using BusinessLogic.DTOs.Chat;

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
        Task DeleteMessageAsync(string userId, string messageId);
    }
}
