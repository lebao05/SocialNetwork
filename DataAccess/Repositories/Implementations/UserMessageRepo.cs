using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class UserMessageRepo : Repository<UserMessage>, IUserMessageRepo
    {
        private readonly AppDbContext _context;

        public UserMessageRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<UserMessage?> GetUserMessageAsync(string userId, string messageId)
        {
            return await _context.UserMessages
                .Include(um => um.Message)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(um => um.UserId == userId && um.MessageId == messageId && !um.Deleted);
        }
        // Plan:
        // 1. The method `GetUserMessageByConversationId` is incorrectly implemented and contains a syntax error.
        // 2. The method signature in the interface expects a return type of `Task<List<UserMessage>?>` but the implementation is broken and has an invalid statement.
        // 3. The method should return the awaited result of a properly constructed LINQ query.
        // 4. Remove the stray `return await _context.UserMessages` and fix the method body to be a single return statement.

        public async Task<List<UserMessage>?> GetUserMessageByConversationId(string userId, string conversationId)
        {
            return await _context.UserMessages
                .Include(um => um.Message)
                .Where(um => um.UserId == userId && um.ReadAt == null && um.Message.ConversationId == conversationId && !um.Deleted)
                .ToListAsync();
        }
        public async Task<List<UserMessage>> GetUnreadMessagesAsync(string userId, string conversationId)
        {
            return await _context.UserMessages
                .Include(um => um.Message)
                .Where(um => um.UserId == userId &&
                            um.Message.ConversationId == conversationId &&
                            um.ReadAt == null &&
                            !um.Deleted)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(string userId, string messageId)
        {
            var userMessage = await _context.UserMessages
                .FirstOrDefaultAsync(um => um.UserId == userId && um.MessageId == messageId);

            if (userMessage != null && userMessage.ReadAt == null)
            {
                userMessage.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task BulkCreateAsync(List<UserMessage> userMessages)
        {
            await _context.UserMessages.AddRangeAsync(userMessages);
            await _context.SaveChangesAsync();
        }
    }
}
