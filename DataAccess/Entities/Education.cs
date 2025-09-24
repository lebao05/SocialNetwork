using Helpers;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    public class Education : BaseEntity, IBaseEntity
    {
        public bool IsStudying { get; set; } = true;
        [Required]
        public string SchoolName { get; set; }
        public string Major { get; set; }
        [Required]
        public string UserId { get; set; }
        public AppUser User { get; set; }
    }
}
