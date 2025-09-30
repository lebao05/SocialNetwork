namespace BusinessLogic.DTOs.Chat
{
    public class CreateConversationDto
    {
        public string? Name { get; set; }
        public bool IsGroup { get; set; }
        public bool IsE2EE { get; set; }
        public List<string> MemberIds { get; set; } = new();
    }
}
