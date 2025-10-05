using Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class MessageAttachment : BaseEntity, IBaseEntity
    {
        [Required]
        public long MessageId { get; set; }

        [ForeignKey(nameof(MessageId))]
        public virtual Message Message { get; set; }

        [Required]
        [MaxLength(255)]
        public string BlobName { get; set; }

        [Required]
        [MaxLength(255)]
        public string OriginalName { get; set; } 

        [Required]
        [MaxLength(50)]
        public string FileType { get; set; } 

        [Required]
        public long Size { get; set; } 

        [Required]
        public long UserId { get; set; } 

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;
    }
}
