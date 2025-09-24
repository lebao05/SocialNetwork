namespace BusinessLogic.DTOs.EducationWork
{
    public class AddWorkDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? Position { get; set; }
        public bool IsWorking { get; set; } = true;
    }
}
