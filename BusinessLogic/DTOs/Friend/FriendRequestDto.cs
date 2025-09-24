using BusinessLogic.DTOs.User;
using DataAccess.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessLogic.DTOs.Friend
{
    public class FriendRequestDto
    {
        public string Id { get; set; }
        public string RequesterId { get; set; }
        public string AddresseeId { get; set; }
        public UserDto Requester { get; set; }
        public UserDto Addressee { get; set; }
        public bool IsAccepted { get; set; }
    }
}
