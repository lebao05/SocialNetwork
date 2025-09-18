using Microsoft.AspNetCore.Http;

namespace BusinessLogic.Services.Interfaces
{
    public interface IUserService
    {
        Task<string> UploadPerImageAsync(string userId,bool IsAvatar, IFormFile file);

    }
}
