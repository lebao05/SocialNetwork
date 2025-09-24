using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;

namespace DataAccess.Repositories.Implementations
{
    public class WorkRepo : Repository<Work>, IWorkRepo
    {
        public WorkRepo(AppDbContext _context) : base(_context)
        {

        }
    }
}
