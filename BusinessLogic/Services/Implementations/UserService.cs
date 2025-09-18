using BusinessLogic.Services.Interfaces;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Shared.Services.Interfaces;

namespace BusinessLogic.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IBlobService _blobService;
        private readonly IPersonalImageRepo _personalImageRepo;

        public UserService(IBlobService blobService, IPersonalImageRepo personalImageRepo)
        {
            _blobService = blobService;
            _personalImageRepo = personalImageRepo;
        }
        public async Task<string> UploadPerImageAsync(string userId,bool IsAvatar, IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded.");

            // 1. Upload to Azure Blob
            var blobUrl = await _blobService.UploadFileAsync(file);

            // 2. Save record in DB
            var personalImage = new PersonalImage
            {
                UserId = userId,
                Url = blobUrl,
                IsAvatar = IsAvatar,
                IsCurrent = true,
                CreatedAt = DateTime.UtcNow
            };

            await _personalImageRepo.AddAsync(personalImage);

            return blobUrl;
        }
    }
}
