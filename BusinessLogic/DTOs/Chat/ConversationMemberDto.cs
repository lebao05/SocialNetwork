using BusinessLogic.DTOs.User;

namespace BusinessLogic.DTOs.Chat
{
    public class ConversationMemberDto
    {
        public UserDto User { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = "Member";
    }
}
