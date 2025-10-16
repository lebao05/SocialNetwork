using BusinessLogic.DTOs.User;
using DataAccess.Entities;

namespace BusinessLogic.DTOs.Chat
{
    public class UserMessageDto
    {
        public string MessageId { get; set; }
        public string UserId { get; set; }
        public string? Reaction { get; set; }
        public DateTime? ReadAt { get; set; }
    }
}
