using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
namespace DataAccess.Repositories.Implementations
{
    public class MessageBlockingRepo : Repository<MessageBlocking>,IMessageBlockingRepo
    {
        public MessageBlockingRepo(AppDbContext context) : base(context) 
        {
            
        }
    }
}
