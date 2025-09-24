using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class FriendReqRepo : Repository<FriendRequest>, IFriendReqRepo
    {
        private readonly AppDbContext _context;
        public FriendReqRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<List<FriendRequest>> GetFriendRequestWithUser(string userId)
        {
            return await _context.FriendRequests.Include(u=>u.Requester).Include(u=>u.Addressee)
            .Where(u => (u.AddresseeId == userId ||
            u.RequesterId == userId) && u.IsAccepted == false).ToListAsync();
        }
    }
}
