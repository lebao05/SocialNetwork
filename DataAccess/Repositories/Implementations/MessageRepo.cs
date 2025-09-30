using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class MessageRepo : Repository<Message>, IMessageRepo
    {
        private readonly AppDbContext _context;

        public MessageRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Message>> GetConversationMessagesAsync(string conversationId, int page, int pageSize)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.UserMessages)
                .Where(m => m.ConversationId == conversationId && !m.Deleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Message?> GetMessageWithDetailsAsync(string messageId)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.UserMessages)
                .Include(m => m.Conversation)
                .FirstOrDefaultAsync(m => m.Id == messageId && !m.Deleted);
        }

        public async Task<int> GetUnreadCountAsync(string conversationId, string userId)
        {
            return await _context.UserMessages
                .Include(um => um.Message)
                .Where(um => um.UserId == userId &&
                            um.Message.ConversationId == conversationId &&
                            um.ReadAt == null &&
                            !um.Message.Deleted)
                .CountAsync();
        }

        public async Task<Message?> GetLastMessageAsync(string conversationId)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Where(m => m.ConversationId == conversationId && !m.Deleted)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
        }
    }
}
