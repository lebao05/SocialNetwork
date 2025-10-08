using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Chat
{
    public class AddToConversationDto
    {
        string conversationId { get; set; } = string.Empty;
        string userId { get; set; } = string.Empty;
    }
}
