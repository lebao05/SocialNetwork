using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace DataAccess.EntityConfigurations
{
    public class CommunityGroupMemberConfig : IEntityTypeConfiguration<CommunityGroupMember>
    {
        public void Configure(EntityTypeBuilder<CommunityGroupMember> builder)
        {


            // Relationship with Group
            builder.HasOne(m => m.Group)
                   .WithMany(g => g.Members)
                   .HasForeignKey(m => m.GroupId)
                   .OnDelete(DeleteBehavior.Restrict); 

            // Relationship with User
            builder.HasOne(m => m.User)
                   .WithMany(u => u.JoinedCommGroups) 
                   .HasForeignKey(m => m.UserId)
                   .OnDelete(DeleteBehavior.Restrict); 

            // Relationship with Role
            builder.HasOne(m => m.Role)
                   .WithMany()
                   .HasForeignKey(m => m.RoleId)
                   .OnDelete(DeleteBehavior.Restrict); 

        }
    }
}
