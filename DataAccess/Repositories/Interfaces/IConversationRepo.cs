using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Interfaces
{
    public interface IConversationRepo : IRepository<Conversation>
    {
        Task<Conversation?> GetConversationWithMembersAsync(string conversationId);
        Task<List<Conversation>> GetUserConversationsAsync(string userId);
        Task<Conversation?> FindOneOnOneConversationAsync(string userId1, string userId2);
        Task<bool> IsUserMemberAsync(string conversationId, string userId);
        Task<Conversation> GetUserConversationAsync(string conversationId);
    }
}
