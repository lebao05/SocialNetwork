using Microsoft.AspNetCore.Http;

namespace Shared.Services.Interfaces
{
    public interface IBlobService
    {
        Task<string> UploadFileAsync(IFormFile file);
        string GenerateUploadSasUrl(string containerName, string blobName, int validMinutes = 10);
        string GenerateDownloadSasUrl(string containerName, string blobName, int validMinutes = 10);

    }
}
