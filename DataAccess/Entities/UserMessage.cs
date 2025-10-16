using Helpers;
namespace DataAccess.Entities
{
    public class UserMessage : BaseEntity, IBaseEntity
    {
        public string MessageId { get; set; }
        public Message Message { get; set; } = null!;
        public string UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public string? Reaction { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime? DeleteAt { get; set; }
    }
}
