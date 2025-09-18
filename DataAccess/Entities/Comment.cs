using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Helpers;
namespace DataAccess.Entities
{
    public class Comment:BaseEntity,IBaseEntity
    {

        [Required]
        public string PostId { get; set; }

        [Required]
        public string UserId { get; set; }

        public string? ParentCommentId { get; set; } 

        [Required]
        public string? Content { get; set; }

        [StringLength(500)]
        public string? MediaUrl { get; set; } 

        public bool IsEdited { get; set; } = false;

        public DateTime? EditedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }

        [ForeignKey("UserId")]
        public virtual AppUser User { get; set; }

        [ForeignKey("ParentCommentId")]
        public virtual Comment? ParentComment { get; set; }

        public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
    }
}
