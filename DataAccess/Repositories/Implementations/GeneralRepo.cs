using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared.Errors;

namespace DataAccess.Repositories.Implementations
{
    public class GeneralRepo : IGeneralRepo
    {
        private readonly AppDbContext _context;

        public GeneralRepo(AppDbContext context)
        {
            _context = context;
        }

        // Check if a relationship type exists
        public async Task<bool> RelationshipTypeExist(string relationshipName)
        {
            var res = await _context.RelationshipTypes
                .FirstOrDefaultAsync(r => r.Name == relationshipName);
            return res != null;
        }

        // Update user's relationship
        public async Task UpdateRelationshipForUser(string userId, string relationshipName)
        {
            // 1. Find the user
            var user = await _context.Users
                .Include(u => u.RelationshipType) // include current relationship if needed
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new HttpResponseException(404, "User not found");

            // 2. Find the relationship type
            var relationship = await _context.RelationshipTypes
                .FirstOrDefaultAsync(r => r.Name == relationshipName);

            if (relationship == null) throw new HttpResponseException(400, "Relationship invalid");
            ;

            // 3. Update user's relationship
            user.RelationshipType = relationship;


            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}
