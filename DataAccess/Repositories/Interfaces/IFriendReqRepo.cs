
using DataAccess.Entities;

namespace DataAccess.Repositories.Interfaces
{
    public interface IFriendReqRepo : IRepository<FriendRequest>
    {
        Task<List<FriendRequest>> GetFriendRequestWithUser(string userId);
    }
}
