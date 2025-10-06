using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Chat
{
    public class AttachmentDto
    {
        public string BlobUrl { get; set; }
        public string OriginalName { get; set; }
        public string FileType { get; set; }
        public long Size { get; set; }
    }
}
