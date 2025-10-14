﻿using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Interfaces
{
    public interface IMessageAttachmentRepo : IRepository<MessageAttachment>
    {
        Task<MessageAttachment> FindOneByBlobName(string blobName);

    }
}
