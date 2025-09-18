using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Helpers;
namespace DataAccess.Entities
{
    public class StoryView : BaseEntity,IBaseEntity
    {
        [Required]
        public string StoryId { get; set; }

        [Required]
        public string ViewerId { get; set; }

        public bool IsLiked { get; set; }

        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("StoryId")]
        public virtual Story Story { get; set; }

        [ForeignKey("ViewerId")]
        public virtual AppUser Viewer { get; set; }
        public virtual ICollection<StoryReaction> StorieReactions { get; set; } = new List<StoryReaction>();

    }
}
