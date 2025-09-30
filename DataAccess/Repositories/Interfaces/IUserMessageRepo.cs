using DataAccess.Entities;

namespace DataAccess.Repositories.Interfaces
{
    public interface IUserMessageRepo:IRepository<UserMessage>
    {
        Task<UserMessage?> GetUserMessageAsync(string userId, string messageId);
        Task<List<UserMessage>> GetUnreadMessagesAsync(string userId, string conversationId);
        Task MarkAsReadAsync(string userId, string messageId);
        Task BulkCreateAsync(List<UserMessage> userMessages);
    }
}
