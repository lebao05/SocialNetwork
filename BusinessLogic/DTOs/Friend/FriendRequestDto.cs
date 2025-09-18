using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Friend
{
    public class FriendRequestDto
    {
        public string Id { get; set; }
        public string RequesterId { get; set; }
        public string AddresseeId { get; set; }
        public bool IsAccepted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
