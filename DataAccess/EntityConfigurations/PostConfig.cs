using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class PostConfig : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            // Relationships

            // Post → AppUser
            builder.HasOne(p => p.User)
                   .WithMany(u => u.Posts)
                   .HasForeignKey(p => p.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Post → CommunityGroup
            builder.HasOne(p => p.Group)
                   .WithMany(g => g.Posts)
                   .HasForeignKey(p => p.GroupId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
