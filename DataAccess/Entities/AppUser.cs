using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

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

        public string? Bio { get; set; }

        [StringLength(255)]
        public string? CurrentLocation { get; set; }

        [StringLength(255)]
        public string? HomeTown { get; set; }
        [StringLength(255)]
        public string? Work { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty;
        public virtual RelationshipType? RelationshipType { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastSeen { get; set; }
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
        public virtual ICollection<CommunityGroupMember> JoinedCommGroups { get; set; } = new List<CommunityGroupMember>();
        public virtual ICollection<FriendRequest> FriendRequests { get; set; } = new List<FriendRequest>();
        public virtual ICollection<FriendShip> FriendRequesters { get; set; } = new List<FriendShip>();
        public virtual ICollection<FriendShip> FriendAddressees { get; set; } = new List<FriendShip>();

        public virtual ICollection<Education> Educations { get; set; } = new List<Education>();

        public virtual ICollection<Work> Works { get; set; } = new List<Work>();

    }
}
