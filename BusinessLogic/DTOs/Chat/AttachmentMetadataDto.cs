using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTOs.Chat
{
    public class AttachmentMetadataDto
    {
        public string OriginalName { get; set; } = null!;
        public string FileType { get; set; } = null!;
        public long Size { get; set; }
    }
}
