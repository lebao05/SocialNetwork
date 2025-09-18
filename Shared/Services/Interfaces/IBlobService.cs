using Microsoft.AspNetCore.Http;

namespace Shared.Services.Interfaces
{
    public interface IBlobService
    {
        Task<string> UploadFileAsync(IFormFile file);
    }
}
