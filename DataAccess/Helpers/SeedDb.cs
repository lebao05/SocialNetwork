using DataAccess.Entities;

namespace DataAccess.Helpers
{
    public class SeedDb
    {
        private readonly AppDbContext _context;

        public SeedDb(AppDbContext context)
        {
            _context = context;
        }

        public void Seed()
        {
            AddRelationship("Single");
            AddRelationship("In a relationship");
            AddRelationship("Engaged");
            AddRelationship("Married");
            AddRelationship("Divorced");
            AddRelationship("It's complicated");

            _context.SaveChanges(); // ✅ persist to DB
        }

        private void AddRelationship(string name)
        {
            // EF can translate this to SQL
            if (!_context.RelationshipTypes.Any(r => r.Name == name))
            {
                _context.RelationshipTypes.Add(new RelationshipType { Name = name });
            }
        }
    }
}
