using DataAccess.Repositories.Interfaces;
using Helpers;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Implementations
{
    public class Repository<TEntity> : IRepository<TEntity>
            where TEntity : class, IBaseEntity
    {
        private readonly AppDbContext _context;

        public Repository(AppDbContext context)
        {
            _context = context;
        }


        public async Task CreateAsync(TEntity entity)
        {
            _context.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {

            _context.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(TEntity entity)
        {
            entity.Deleted = true;
            _context.Update(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(TEntity entity)
        {
            _context.Update(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> ExistAsync(string id)
        {
            return await _context.Set<TEntity>().AnyAsync(e => e.Id == id);
        }


        public Task<List<TEntity>> FindByClause(Func<TEntity, bool> selector = null)
        {
            var models = _context.Set<TEntity>()
                .Where(selector ?? (s => true));

            return Task.Run(() => models.ToList());
        }

        public async Task<TEntity> FindByIdAsync(string key)
        {
            var entity = await _context.Set<TEntity>().FindAsync(key);
            return entity;
        }

        public IQueryable<TEntity> GetAll()
        {
            // return this.context.Set<T>().AsNoTracking();
            return _context.Set<TEntity>().AsNoTracking();
        }

        public Task<TEntity> GetByClause(Func<TEntity, bool> selector = null)
        {
            var models = _context.Set<TEntity>()
                .Where(selector ?? (s => true));

            return Task.Run(() => models.FirstOrDefault());
        }

        public async Task<TEntity> GetByIdAsync(string id)
        {
            var entity = await _context.Set<TEntity>().FindAsync(id);
            return entity;
        }


    }
}
