using BusinessLogic.DTOs.EducationWork;
using BusinessLogic.DTOs.User;
using DataAccess.Entities;
using Microsoft.AspNetCore.Http;

namespace BusinessLogic.Services.Interfaces
{
    public interface IUserService
    {
        Task<string> UploadPerImageAsync(string userId, bool IsAvatar, IFormFile file);
        // ✅ Work
        Task<Work> AddWork(AddWorkDto dto, string userId);
        Task<Work> UpdateWork(WorkDto dto, string userId);
        Task<bool> RemoveWork(string id, string userId);

        // ✅ Education
        Task<Education> AddEducation(AddEducationDto dto, string userId);
        Task<Education> UpdateEducation(EducationDto dto, string userId);
        Task<bool> RemoveEducation(string id, string userId);
        Task<List<Work>> GetAllWorks(string userId);
        Task<List<Education>> GetAllEducations(string userId);
        Task<AppUser> UpdateBasicInfo(string userId, UpdateInfoDto dto);
        Task<AppUser> GetProfile(string userId);


    }
}
