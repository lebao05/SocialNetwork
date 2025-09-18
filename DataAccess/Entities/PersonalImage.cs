using Helpers;
using System;

namespace DataAccess.Entities
{
    public class PersonalImage : BaseEntity, IBaseEntity
    {
        public string UserId { get; set; }

        public string Url { get; set; }
        public bool IsAvatar { get; set; }

        public bool IsCurrent { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual AppUser User { get; set; }
    }
}
