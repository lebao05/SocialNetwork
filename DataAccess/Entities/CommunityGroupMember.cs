using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Entities
{
    public class CommunityGroupMember : BaseEntity, IBaseEntity
    {

        [Required]
        public string GroupId { get; set; }

        [Required]
        public string UserId { get; set; }

        public string RoleId { get; set; }
        public virtual GroupMemberRole Role { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("GroupId")]
        public virtual CommunityGroup Group { get; set; }

        [ForeignKey("UserId")]
        public virtual AppUser User { get; set; }
    }
}
