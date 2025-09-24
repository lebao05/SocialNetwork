using DataAccess.Entities;

namespace BusinessLogic.Services.Interfaces
{
    public interface IFriendService
    {
        Task<FriendRequest> SendFriendRequestAsync(string requesterId, string addresseeId);
        Task<FriendShip> AcceptFriendRequestAsync(string requestId, string userId);
        Task<bool> DeleteFriendRequestAsync(string requestId, string userId);
        Task<bool> DeleteFriendAsync(string userId1, string userId2);
        Task<List<FriendShip>> GetFriendsAsync(string userId);
        Task<List<FriendRequest>> GetFriendRequestsAsync(string userId);
    }
}
