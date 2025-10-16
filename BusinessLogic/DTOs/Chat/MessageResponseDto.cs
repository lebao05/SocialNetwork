namespace BusinessLogic.DTOs.Chat
{
    public class MessageResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string ConversationId { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string? SenderName { get; set; }
        public string? SenderAvatar { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsEdited { get; set; }
        public bool IsSystemMessage { get; set; } = false;
        public bool Deleted { get; set; }
        public AttachmentDto Attachment { get; set; }
        public List<UserMessageDto> UserMessageDtos { get; set; } = new List<UserMessageDto>();
    }
}
