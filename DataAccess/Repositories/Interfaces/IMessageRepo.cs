using DataAccess.Entities;
namespace DataAccess.Repositories.Interfaces
{
    public interface IMessageRepo: IRepository<Message>
    {
        Task<List<Message>> GetConversationMessagesAsync(string conversationId, int page, int pageSize);
        Task<Message?> GetMessageWithDetailsAsync(string messageId);
        Task<int> GetUnreadCountAsync(string conversationId, string userId);
        Task<Message?> GetLastMessageAsync(string conversationId);
    }
}
