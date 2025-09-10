using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DataAccess.Entities
{
    public class UserRelationshipRequest:BaseEntity
    {
        [Required]
        public string RequesterId { get; set; }

        [Required]
        public string AddresseeId { get; set; }

        public virtual RelationshipStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("RequesterId")]
        public virtual AppUser Requester { get; set; }

        [ForeignKey("AddresseeId")]
        public virtual AppUser Addressee { get; set; }
    }
}
