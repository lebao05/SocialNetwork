using Helpers;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    public class MessageBlocking : BaseEntity,IBaseEntity
    {
        public string UserId { get; set; } = string.Empty!;
        public AppUser User { get; set; }
        public string UserBlockedId { get; set; } = string.Empty!;
        public AppUser UserBlocker { get; set; }
    }
}
