using Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class Education:BaseEntity,IBaseEntity
    {
        public bool IsStudying = false;
        [Required]
        public string SchoolName {  get; set; }
        [Required]
        public string UserId { get; set; }
        public AppUser User { get; set; }
    }
}
