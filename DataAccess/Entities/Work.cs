using Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class Work:BaseEntity,IBaseEntity
    {
        [Required]
        public string CompanyName;

        public bool IsWorking = true;

        [Required]
        public string UserId { get; set; }

        public virtual AppUser User { get; set; }
    }
}
