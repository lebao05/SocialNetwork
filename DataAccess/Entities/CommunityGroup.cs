using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DataAccess.Entities
{
    public class CommunityGroup : BaseEntity, IBaseEntity
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        public string Description { get; set; }
        public GroupType GroupType { get; set; }
        [StringLength(500)]
        public string CoverPhotoUrl { get; set; }

        [StringLength(500)]
        public string ProfilePictureUrl { get; set; }

        [StringLength(255)]
        public string Location { get; set; }

        [StringLength(255)]
        public string Website { get; set; }

        public string Rules { get; set; }

        [Required]
        public string CreatedBy { get; set; }

        public int MemberCount { get; set; } = 0;

        public int PostCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CreatedBy")]
        public virtual AppUser Creator { get; set; }

        public virtual ICollection<CommunityGroupMember> Members { get; set; } = new List<CommunityGroupMember>();
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}
