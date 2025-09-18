using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Entities
{
    public class PostReaction : BaseEntity,IBaseEntity
    {
        [Required]
        public string PostId { get; set; }
        [Required]
        public string ActorId { get; set; }

        public ReactionType ReactionType { get; set; }
        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }

        [ForeignKey("ActorId")]
        public virtual AppUser Actor { get; set; }
    }
}
