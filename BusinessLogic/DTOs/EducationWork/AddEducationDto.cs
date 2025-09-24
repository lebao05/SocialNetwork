namespace BusinessLogic.DTOs.EducationWork
{
    public class AddEducationDto
    {
        public string SchoolName { get; set; } = string.Empty;
        public string? Major { get; set; }
        public bool IsStudying { get; set; } = true;
    }
}
