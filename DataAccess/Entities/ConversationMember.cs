using Helpers;

namespace DataAccess.Entities
{
    public class ConversationMember : BaseEntity, IBaseEntity
    {
        public string ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        public string UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public string Role { get; set; } = string.Empty;
        public string? Alias { get; set; }
        public bool NotificationEnabled { get; set; } = true;
        public bool DeletedConversation { get; set; } = false;
        public bool IsSpamming { get; set; } = false;
        public DateTime? DeletedConversationAt { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
