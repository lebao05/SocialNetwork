using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class ConversationMemberRepo : Repository<ConversationMember>, IConversationMemberRepo
    {
        private readonly AppDbContext _context;

        public ConversationMemberRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<string>> GetUserConversationIdsAsync(string userId)
        {
            return await _context.ConversationMembers
                .Where(cm => cm.UserId == userId)
                .Select(cm => cm.ConversationId)
                .ToListAsync();
        }

        public async Task<List<ConversationMember>> GetConversationMembersAsync(string conversationId)
        {
            return await _context.ConversationMembers
                .Include(cm => cm.User)
                .Where(cm => cm.ConversationId == conversationId)
                .ToListAsync();
        }

        public async Task<ConversationMember?> GetMemberAsync(string conversationId, string userId)
        {
            return await _context.ConversationMembers
                .Include(cm => cm.User)
                .FirstOrDefaultAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);
        }

        public async Task<bool> IsMemberAsync(string conversationId, string userId)
        {
            return await _context.ConversationMembers
                .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);
        }
    }
}
