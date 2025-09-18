using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementations
{
    public class FriendReqRepo : Repository<FriendRequest>,IFriendReqRepo 
    {
        private readonly AppDbContext _context;
        public FriendReqRepo(AppDbContext context) : base(context) 
        {
            _context = context;
        }

   

        // ✅ Delete Friendship (soft delete or remove)
        public async Task<FriendShip?> DeleteFriend(string userId1, string userId2)
        {
            var friendship = await _context.FriendShips
                .FirstOrDefaultAsync(f =>
                    (f.RequesterId == userId1 && f.AddresseeId == userId2) ||
                    (f.RequesterId == userId2 && f.AddresseeId == userId1));

            if (friendship == null)
                return null;

            friendship.UpdatedAt = DateTime.UtcNow;
            friendship.Deleted = true;
            _context.FriendShips.Update(friendship);
            await _context.SaveChangesAsync();
            return friendship;
        }

        // ✅ Get All Friends of a User
        public async Task<List<AppUser>> GetFriends(string userId)
        {
            var friendships = await _context.FriendShips
                .Where(f => f.RequesterId == userId || f.AddresseeId == userId)
                .Include(f => f.Requester)
                .Include(f => f.Addressee)
                .ToListAsync();

            return friendships
                .Select(f => f.RequesterId == userId ? f.Addressee : f.Requester)
                .ToList();
        }

        // ✅ Get Pending Friend Requests for a User
        public async Task<List<FriendRequest>> GetFriendRequests(string userId)
        {
            return await _context.FriendRequests
                .Where(fr => fr.AddresseeId == userId && !fr.IsAccepted )
                .Include(fr => fr.Requester) // include requester user details
                .ToListAsync();
        }

        public async Task<List<FriendRequest>> GetRequestSent(string userId)
        {
            return await _context.FriendRequests
                .Where(fr => fr.RequesterId == userId && !fr.IsAccepted)
                .Include(fr => fr.Addressee) 
                .ToListAsync();
        }
    }
}
