using Helpers;

namespace DataAccess.Entities
{
    public class Message : BaseEntity, IBaseEntity
    {
        public long ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        public long SenderId { get; set; }
        public AppUser Sender { get; set; } = null!;

        public string? Content { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<UserMessage> UserMessages { get; set; } = new List<UserMessage>();
    }
}
