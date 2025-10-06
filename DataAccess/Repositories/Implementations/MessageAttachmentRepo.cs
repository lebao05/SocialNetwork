using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementations
{
    public class MessageAttachmentRepo : Repository<MessageAttachment>, IMessageAttachmentRepo
    {
        public MessageAttachmentRepo(AppDbContext context) : base(context)
        {
        }
    }
}
