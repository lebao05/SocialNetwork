using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;

namespace DataAccess.Repositories.Implementations
{
    public class EducationRepo : Repository<Education>, IEducationRepo
    {
        private readonly AppDbContext _context;
        public EducationRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
