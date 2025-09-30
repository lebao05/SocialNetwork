namespace BusinessLogic.DTOs.Chat
{
    public class ConversationMemberDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public string Role { get; set; } = "Member";
        public bool IsOnline { get; set; }
    }
}
