using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Interfaces
{
    public interface IPersonalImageRepo
    {
        Task<PersonalImage> GetCurrentAvatarAsync(string userId);
        Task<PersonalImage> GetCurrenCoverAsync(string userId);

        Task<PersonalImage> AddAsync(PersonalImage entity);
        Task<bool> DeleteAvatarAsync();
        Task<bool> DeleteCoverAsync();


    }
}
