using Helpers;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    public class SelectedPrivacyUser : BaseEntity,IBaseEntity
    {
        [Required]
        public string PrivacyId { get; set; }
        [Required]
        public string UserId { get; set; }
        public virtual PrivacySetting PrivacySetting { get; set; }

        public bool IsIncluded { get; set; } = true;

        public virtual AppUser User { get; set; }
    }
}
