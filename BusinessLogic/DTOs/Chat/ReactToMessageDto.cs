using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Chat
{
    public class ReactToMessageDto
    {
        public string MessageId { get; set; } = string.Empty;
        public string Reaction { get; set; } = string.Empty;
    }
}
