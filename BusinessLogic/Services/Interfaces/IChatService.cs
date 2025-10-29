using BusinessLogic.DTOs.Chat;
using DataAccess.Entities;

namespace BusinessLogic.Services.Interfaces
{
    public interface IChatService
    {
        Task<MessageResponseDto> SendMessageAsync(string userId, SendMessageDto dto,bool isSystemMessage = false);
        Task<ConversationResponseDto> CreateConversationAsync(string creatorId, CreateConversationDto dto);
        Task<List<ConversationResponseDto>> GetUserConversationsAsync(string userId);
        Task<List<MessageResponseDto>> GetConversationMessagesAsync(string userId, string conversationId, int page = 1, int pageSize = 15);
        Task<bool> IsConversationMember(string conversationId, string userId);
        Task<List<string>> GetUserConversationIds(string userId);
        Task<ConversationResponseDto> GetConversationByIdAsync(string conversationId, string userId);
        Task<bool> DeleteMessage(string userId, string messageId);
        Task<ConversationMemberDto> AddToConversation(string userId,AddToConversationDto dto);
        Task<MessageResponseDto> GetMessageById(string messageId);
        Task<bool> DeleteAttachment(string userId, string attachmentId);
        Task<AttachmentDto> GetAttachmentById(string userId, string attachmentId);
        Task<List<UserMessageDto>> MarkMessageAsReaded(string userId, string ConversationId);
        Task<UserMessageDto> ReactToMessage(string userId, ReactToMessageDto dto);
        Task<UpdateConversationDto> UpdateConversationDetails(string userId, UpdateConversationDto dto);
        Task<bool> ChangeAlias(string userId, ChaneAliasDto dto);
        Task<ConversationMember> EnableNotification(string userId, string conversationId);
        Task<MessageBlocking> BlockUser(string userId, string userBlockedId);
        Task<ConversationMember> LeaveConversation(string userId, string conversationId);
        Task<bool> DeleteConversation(string userId, string conversationId);
        Task<Conversation> GetConversationBetweenTwoUsers(string user1, string user2);
        Task<List<MessageBlocking>> GetBlockedUsers(string userId);
        Task<ConversationMember> MarkConversationAsSpam(string userId, string conversationId);
        Task<ConversationMember> AssginAMemberToAdmin(string userId, string conversationId, string memberId);
        Task<bool> RemoveAMemberFromConversation(string userId, string conversationId, string memberId);

    }
}
