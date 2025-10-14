namespace BusinessLogic.DTOs.Chat
{
    public class SendMessageDto
    {
        public string ConversationId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Attachment { get; set; }
    }
}
