using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class FriendShipRepo : Repository<FriendShip>, IFriendShipRepo
    {
        private readonly AppDbContext _context;
        public FriendShipRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<List<FriendShip>> GetFriendWithUser(string userId)
        {
            return await _context.FriendShips
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => f.RequesterId == userId || f.AddresseeId == userId)
            .ToListAsync();
        }
    }
}
