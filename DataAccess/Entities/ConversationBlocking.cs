using Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class ConversationBlocking:BaseEntity,IBaseEntity
    {
        [Required]
        public string BlockerId { get; set; }
        public AppUser Blocker { get; set; }
        [Required]
        public string BLockeeId { get; set; }
        public AppUser BLockee { get; set; }
        public DateTime BlockedAt { get; set; } = DateTime.UtcNow;
    }
}
