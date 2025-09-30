using Helpers;

namespace DataAccess.Entities
{
    public class ConversationMember : BaseEntity, IBaseEntity
    {
        public string ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        public string UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public GroupMemberRole Role { get; set; } = null!;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
