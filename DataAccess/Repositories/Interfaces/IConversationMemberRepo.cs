using DataAccess.Entities;
namespace DataAccess.Repositories.Interfaces
{
    internal interface IConversationMemberRepo : IRepository<ConversationMember>
    {
        Task<List<string>> GetUserConversationIdsAsync(string userId);
        Task<List<ConversationMember>> GetConversationMembersAsync(string conversationId);
        Task<ConversationMember?> GetMemberAsync(string conversationId, string userId);
        Task<bool> IsMemberAsync(string conversationId, string userId);
    }
}
