using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared.Errors;

namespace DataAccess.Repositories.Implementations
{
    public class UserRepo : IUserRepo
    {
        private readonly AppDbContext _context;
        public UserRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<AppUser> GetProfileAsync(string profileUserId)
        {
            var user = await _context.Users
                .Include(u => u.RelationshipType)
                .Include(u => u.Works)
                .Include(u => u.Educations)
                .FirstOrDefaultAsync(u => u.Id == profileUserId);

            if (user == null)
                throw new HttpResponseException(404, "Profile not found");
            return (user);
        }
    }
}
