using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class CommunityGroupConfig : IEntityTypeConfiguration<CommunityGroup> 
    {
        public void Configure(EntityTypeBuilder<CommunityGroup> builder)
        {
            // Creator relationship
            builder.HasOne(g => g.Creator)
                   .WithMany() 
                   .HasForeignKey(g => g.CreatedBy)
                   .OnDelete(DeleteBehavior.Restrict); 

            // GroupType relationship
            builder.HasOne(g => g.GroupType)
                   .WithMany()
                   .HasForeignKey("GroupTypeId") 
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
