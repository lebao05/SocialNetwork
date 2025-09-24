using Helpers;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    public class Work : BaseEntity, IBaseEntity
    {
        [Required]
        public string CompanyName { get; set; }
        [Required]
        public string Position { get; set; }

        public bool IsWorking { get; set; } = true;

        [Required]
        public string UserId { get; set; }

        public virtual AppUser User { get; set; }
    }
}
