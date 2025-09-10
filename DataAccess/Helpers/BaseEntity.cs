using System.ComponentModel.DataAnnotations;

namespace Helpers
{
    public interface IBaseEntity
    {
        string Id { get; set; }
        bool Deleted { get; set; }
    }

    public class BaseEntity
    {
        [Key]
        public string Id { get; set; }
        public bool Deleted { get; set; }
    }
}
