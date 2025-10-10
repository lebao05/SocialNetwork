using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Chat
{
    public class UpdateConversationDto
    {
        public string ConversationId { get; set; }
        public string? Name { get; set; } 
        public string? PictureUrl { get; set; }
        public bool IsE2EE { get; set; } = true;
    }
}
