using Helpers;

namespace DataAccess.Entities
{
    public class Conversation : BaseEntity, IBaseEntity
    {
        public string? Name { get; set; } // Nullable for 1-on-1 chats
        public bool IsGroup { get; set; } = false;
        public bool IsE2EE { get; set; } = false; // End-to-end encrypted flag
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatorId { get; set; }
        public AppUser Creator { get; set; } = null!;
        public ICollection<ConversationMember> Members { get; set; } = new List<ConversationMember>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
