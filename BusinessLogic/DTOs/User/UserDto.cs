using BusinessLogic.DTOs.EducationWork;
using DataAccess.Entities;

namespace BusinessLogic.DTOs.User
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? CurrentLocation { get; set; }
        public string AvatarUrl { get; set; }
        public string CoverUrl { get; set; }
        public string? HomeTown { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual RelationshipType? RelationshipType { get; set; }
        public virtual ICollection<EducationDto> Educations { get; set; } = new List<EducationDto>();
        public virtual ICollection<WorkDto> Works { get; set; } = new List<WorkDto>();
    }
}
