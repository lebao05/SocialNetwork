namespace BusinessLogic.DTOs.Chat
{
    public class UpdateConversationDto
    {
        public string ConversationId { get; set; } = null!;
        public string? Name { get; set; } 
        public string? PictureUrl { get; set; }
        public string? DefaultReaction { get;set;  }
    }
}
