using DataAccess.Entities;

namespace DataAccess.Repositories.Interfaces
{
    public interface IUserRepo
    {
        Task<AppUser> GetProfileAsync(string profileUserId);

    }
}
