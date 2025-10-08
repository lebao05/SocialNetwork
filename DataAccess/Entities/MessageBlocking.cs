using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class MessageBlocking
    {
        [Required]
        public string UserId { get; set; }
        public AppUser User { get; set; }
        [Required]
        public string UserBlockedId { get; set; } = null!;
        public AppUser UserBlocker { get; set; }
    }
}
