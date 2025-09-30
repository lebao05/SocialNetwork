using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class ConversationRepo : Repository<Conversation>, IConversationRepo
    {
        private readonly AppDbContext _context;

        public ConversationRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<Conversation?> GetConversationWithMembersAsync(string conversationId)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Creator)
                .FirstOrDefaultAsync(c => c.Id == conversationId && !c.Deleted);
        }

        public async Task<List<Conversation>> GetUserConversationsAsync(string userId)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                    .ThenInclude(m => m.Sender)
                .Where(c => c.Members.Any(m => m.UserId == userId) && !c.Deleted)
                .OrderByDescending(c => c.Messages.Max(m => (DateTime?)m.CreatedAt) ?? c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Conversation?> FindOneOnOneConversationAsync(string userId1, string userId2)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                .Where(c => !c.IsGroup && !c.Deleted && c.Members.Count == 2)
                .FirstOrDefaultAsync(c =>
                    c.Members.Any(m => m.UserId == userId1) &&
                    c.Members.Any(m => m.UserId == userId2));
        }

        public async Task<bool> IsUserMemberAsync(string conversationId, string userId)
        {
            return await _context.ConversationMembers
                .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);
        }
    }
}
