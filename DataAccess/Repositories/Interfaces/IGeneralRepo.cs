namespace DataAccess.Repositories.Interfaces
{
    public interface IGeneralRepo
    {
        Task<bool> RelationshipTypeExist(string relationshipName);
        Task UpdateRelationshipForUser(string userId, string relationshipName);
    }
}
