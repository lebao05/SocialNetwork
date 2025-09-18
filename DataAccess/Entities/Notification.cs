using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Entities
{
    public class Notification : BaseEntity,IBaseEntity
    {

        [Required]
        public string UserId { get; set; }

        [Required]
        public NotificationType NotificationType { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        public string Message { get; set; }

        public bool IsRead { get; set; }

        public string? RelatedUserId { get; set; }          
        public string? RelatedPostId { get; set; }          
        public string? RelatedCommunityGroupId { get; set; }  
        public string? RelatedPostingGroupPostId { get; set; }
        public string? RelatedCommentId { get; set; }        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }


        [ForeignKey("UserId")]
        public virtual AppUser User { get; set; }

        [ForeignKey("RelatedUserId")]
        public virtual AppUser RelatedUser { get; set; }

        [ForeignKey("RelatedPostId")]
        public virtual Post RelatedPost { get; set; }

        [ForeignKey("RelatedGroupId")]
        public virtual CommunityGroup RelatedGroup { get; set; }

        [ForeignKey("RelatedCommentId")]
        public virtual Comment RelatedComment { get; set; }
    }
}
