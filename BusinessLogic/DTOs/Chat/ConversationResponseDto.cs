namespace BusinessLogic.DTOs.Chat
{
    public class ConversationResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string? Name { get; set; }
        public bool IsGroup { get; set; }
        public string? PictureUrl { get; set; }
        public bool IsE2EE { get; set; }
        public DateTime CreatedAt { get; set; }
        public MessageResponseDto? LastMessage { get; set; }
        public List<ConversationMemberDto> Members { get; set; } = new();
    }
}
