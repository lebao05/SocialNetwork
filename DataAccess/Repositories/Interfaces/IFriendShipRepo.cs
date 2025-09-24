

using DataAccess.Entities;

namespace DataAccess.Repositories.Interfaces
{
    public interface IFriendShipRepo : IRepository<FriendShip>
    {
        Task<List<FriendShip>> GetFriendWithUser(string userId);
    }

}
