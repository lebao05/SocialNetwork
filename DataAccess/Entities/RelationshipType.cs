using Helpers;
using System.ComponentModel.DataAnnotations;
namespace DataAccess.Entities
{
    public class RelationshipType : BaseEntity,IBaseEntity
    {
        [Required]
        public string Name { get; set; }
    }
}
