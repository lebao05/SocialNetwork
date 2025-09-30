using DataAccess.Entities;
namespace DataAccess.Repositories.Interfaces
{
    public interface IConversationMemberRepo : IRepository<ConversationMember>
    {
        Task<List<string>> GetUserConversationIdsAsync(string userId);
        Task<List<ConversationMember>> GetConversationMembersAsync(string conversationId);
        Task<ConversationMember?> GetMemberAsync(string conversationId, string userId);
        Task<bool> IsMemberAsync(string conversationId, string userId);
    }
}
