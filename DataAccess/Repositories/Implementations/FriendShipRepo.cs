using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementations
{
    public class FriendShipRepo : Repository<FriendShip>, IFriendShipRepo
    {
        private readonly AppDbContext _context;
        public FriendShipRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
