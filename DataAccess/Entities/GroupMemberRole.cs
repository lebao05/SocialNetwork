using Helpers;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    public class GroupMemberRole : BaseEntity, IBaseEntity
    {
        [Required]
        public string Name { get; set; }
    }
}
