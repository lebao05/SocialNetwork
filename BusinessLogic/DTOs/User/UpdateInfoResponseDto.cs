using BusinessLogic.DTOs.EducationWork;
using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.User
{
    public class UpdateInfoResponseDto
    {
        public string Gender { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? CurrentLocation { get; set; }
        public string? HomeTown { get; set; }
        public virtual RelationshipType? RelationshipType { get; set; }
    }
}
