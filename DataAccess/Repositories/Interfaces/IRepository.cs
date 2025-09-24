using Helpers;

namespace DataAccess.Repositories.Interfaces
{

    public interface IRepository<TEntity>
        where TEntity : class, IBaseEntity
    {
        IQueryable<TEntity> GetAll();

        Task<TEntity> GetByIdAsync(string id);

        Task CreateAsync(TEntity entity);
        Task<bool> ExistAsync(string id);
        Task<TEntity> AddAsync(TEntity entity);
        Task<bool> DeleteAsync(TEntity entity);
        Task<bool> UpdateAsync(TEntity entity);
        Task<TEntity> FindByIdAsync(string key);
        Task<List<TEntity>> FindByClause(Func<TEntity, bool> selector = null);
        Task<TEntity> GetByClause(Func<TEntity, bool> selector = null);

    }
}
