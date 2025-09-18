using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Http; // for IFormFile
using Microsoft.Extensions.Options;
using Shared.Configs;
using Shared.Services.Interfaces;

namespace Shared.Services.Implementations
{
    public class BlobService : IBlobService
    {
        private readonly AzureStorageOptions _options;
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _personalImageUrl;
        public BlobService(IOptions<AzureStorageOptions> options)
        {
            _options = options.Value;
            _blobServiceClient = new BlobServiceClient(_options.ConnectionString);
            _personalImageUrl = "personalimage";
        }

        /// <summary>
        /// Upload IFormFile directly to Azure Blob Storage
        /// </summary>
        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_personalImageUrl);
            await containerClient.CreateIfNotExistsAsync();

            // Use GUID + original extension to avoid collisions
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            var blobClient = containerClient.GetBlobClient(fileName);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new Azure.Storage.Blobs.Models.BlobHttpHeaders
                {
                    ContentType = file.ContentType
                });
            }

            return blobClient.Uri.ToString();
        }
    }
}
