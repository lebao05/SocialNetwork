using Helpers;

namespace DataAccess.Entities
{
    public class Message : BaseEntity, IBaseEntity
    {
        public string ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        public string SenderId { get; set; }
        public AppUser Sender { get; set; } = null!;

        public string? Content { get; set; }
        public DateTime? EditedAt { get; set; }
        public bool IsEdited { get; set; }
        public string? ReplyToMessageId { get; set; }
        public Message? ReplyToMessage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public MessageAttachment MessageAttachment { get; set; }
        public ICollection<UserMessage> UserMessages { get; set; } = new List<UserMessage>();

    }
}
