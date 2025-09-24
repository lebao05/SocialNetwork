namespace BusinessLogic.DTOs.EducationWork
{
    public class EducationDto
    {
        public string? Id { get; set; }
        public string SchoolName { get; set; } = string.Empty;
        public string? Major { get; set; }
        public bool IsStudying { get; set; } = true;
    }
}
