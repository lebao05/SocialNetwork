using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class MessageAttachmentRepo : Repository<MessageAttachment>, IMessageAttachmentRepo
    {
        private readonly AppDbContext _context;
        public MessageAttachmentRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<MessageAttachment> FindOneByBlobName(string blobName)
        {
            return await _context.MessageAttachments.FirstOrDefaultAsync(ma=>ma.BlobName == blobName);
        }
    }
}
