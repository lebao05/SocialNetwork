using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Helpers;

namespace DataAccess.Entities
{
    public class Story : BaseEntity,IBaseEntity
    {

        [Required]
        public string UserId { get; set; }

        [Required]
        public bool IsOnlyText { get; set; }

        public virtual PrivacySetting PrivacySetting { get; set; }

        [Required]
        [StringLength(500)]
        public string MediaUrl { get; set; }

        public string Caption { get; set; }

        [StringLength(7)]
        public string BackgroundColor { get; set; } 

        [StringLength(7)]
        public string TextColor { get; set; } 

        public int Duration { get; set; } = 24; 

        [Required]
        public DateTime ExpiresAt { get; set; }

        public int ViewCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual AppUser User { get; set; }

        public virtual ICollection<StoryView> Viewers { get; set; } = new List<StoryView>();
    }
}
