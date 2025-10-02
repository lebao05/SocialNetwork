using BusinessLogic.DTOs.User;
using DataAccess.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessLogic.DTOs.Friend
{
    public class FriendShipDto
    {
        public string Id { get; set; }
        public string ConversationId { get; set; }
        public UserDto Friend { get; set; }
    }
}
