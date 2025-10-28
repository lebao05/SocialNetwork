using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Chat
{
    public class MessageBlockingDto
    {
        public string UserBlockedId { get; set; } = string.Empty!;
    }
}
