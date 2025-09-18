using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class PersonalImageRepo : IPersonalImageRepo
    {
        private readonly AppDbContext _context;
        public PersonalImageRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PersonalImage> AddAsync(PersonalImage entity)
        {
            var oldImages = _context.PersonalImages
                .Where(pi => pi.UserId == entity.UserId && pi.IsCurrent & entity.IsAvatar == pi.IsAvatar );

            foreach (var oldImage in oldImages)
            {
                oldImage.IsCurrent = false;
            }

            // 2. Mark the new one as current
            entity.IsCurrent = true;

            // 3. Add the new image
            await _context.PersonalImages.AddAsync(entity);

            // 4. Save changes
            await _context.SaveChangesAsync();

            return entity;
        }


        public Task<bool> DeleteAvatarAsync()
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteCoverAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<PersonalImage> GetCurrenCoverAsync(string userId)
        {
            return await _context.PersonalImages
                                 .Where(pi => pi.UserId == userId && !pi.IsAvatar && pi.IsCurrent)
                                 .OrderByDescending(pi => pi.CreatedAt)
                                 .FirstOrDefaultAsync();
        }

        public async Task<PersonalImage> GetCurrentAvatarAsync(string userId)
        {
            return await _context.PersonalImages
                                 .Where(pi => pi.UserId == userId && pi.IsAvatar && pi.IsCurrent)
                                 .OrderByDescending(pi => pi.CreatedAt)
                                 .FirstOrDefaultAsync();
        }
    }
}
