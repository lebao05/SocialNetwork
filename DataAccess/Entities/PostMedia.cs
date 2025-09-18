using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Helpers;

namespace DataAccess.Entities
{
    public class PostMedia:BaseEntity,IBaseEntity
    {

        [Required]
        public string PostId { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        [StringLength(500)]
        public string MediaUrl { get; set; }

        public long? FileSize { get; set; }

        public int? Duration { get; set; } 

        [StringLength(20)]
        public string Dimensions { get; set; } 

        public int UploadOrder { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }
    }
}
