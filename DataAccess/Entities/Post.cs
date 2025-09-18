using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Helpers;


namespace DataAccess.Entities
{
    public class Post : BaseEntity,IBaseEntity
    {

        [Required]
        public string UserId { get; set; }

        public string? Content { get; set; }

        [StringLength(255)]
        public string? Location { get; set; }

        public string? GroupId { get; set; }

        [StringLength(100)]
        public string? Feeling { get; set; }

        public bool IsEdited { get; set; } = false;

        public DateTime? EditedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        
        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual AppUser User { get; set; }


        [ForeignKey("GroupId")]
        public virtual CommunityGroup Group { get; set; }


        public virtual ICollection<PostMedia> PostMedias { get; set; } = new List<PostMedia>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
