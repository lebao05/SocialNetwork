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
        private readonly string _conversationContainer;
        public BlobService(IOptions<AzureStorageOptions> options)
        {
            _options = options.Value;
            _blobServiceClient = new BlobServiceClient(_options.ConnectionString);
            _personalImageUrl = _options.ContainerName;
            _conversationContainer = _options.ConversationContainer;
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
        public string GenerateUploadSasUrl(string containerName, string blobName, int validMinutes = 10)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            containerClient.CreateIfNotExists();

            var blobClient = containerClient.GetBlobClient(blobName);

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = containerName,
                BlobName = blobName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(validMinutes)
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Create | BlobSasPermissions.Write);

            return blobClient.GenerateSasUri(sasBuilder).ToString();
        }

        // Generate SAS token for downloading
        public string GenerateDownloadSasUrl(string containerName, string blobName, int validMinutes = 5)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = containerName,
                BlobName = blobName,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(validMinutes)
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            return blobClient.GenerateSasUri(sasBuilder).ToString();
        }
    }
}
