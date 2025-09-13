using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Entities
{
    public class AppUser : IdentityUser
    {
        [Required, StringLength(50, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [Required, StringLength(50, MinimumLength = 2)]
        public string LastName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        [Required]
        public string Gender { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ProfilePictureUrl { get; set; }

        [StringLength(500)]
        public string? CoverPhotoUrl { get; set; }

        public string? Bio { get; set; }

        [StringLength(255)]
        public string? Location { get; set; }

        [StringLength(255)]
        public string? HomeTown { get; set; }
        [StringLength(255)]
        public string? Work { get; set; }

        [StringLength(255)]
        public string? Education { get; set; }

        public virtual RelationshipStatus? RelationshipStatus { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastSeen { get; set; }
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
        public virtual ICollection<CommunityGroupMember> JoinedCommGroups { get; set; } = new List<CommunityGroupMember>();
    }
}
