using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DataAccess.Entities
{
    public class StoryReaction : BaseEntity, IBaseEntity
    {
        [Required]
        public ReactionType ReactionType { get; set; }

        [Required]
        public string StoryId { get; set; }

        [Required]
        public string ViewId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ViewId")]
        public StoryView View { get; set; }
    }
}
