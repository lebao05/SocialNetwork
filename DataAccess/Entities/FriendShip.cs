using Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DataAccess.Entities
{
    public class FriendShip : BaseEntity, IBaseEntity
    {
        [Required]
        public string RequesterId { get; set; }

        [Required]
        public string AddresseeId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("RequesterId")]
        public virtual AppUser Requester { get; set; }

        [ForeignKey("AddresseeId")]
        public virtual AppUser Addressee { get; set; }
    }
}
