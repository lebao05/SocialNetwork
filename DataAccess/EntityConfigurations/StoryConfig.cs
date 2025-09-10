using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class StoryConfig : IEntityTypeConfiguration<Story>
    {
        public void Configure(EntityTypeBuilder<Story> builder)
        {

            // Relationship: User
            builder.HasOne(s => s.User)
                   .WithMany(u => u.Stories)
                   .HasForeignKey(s => s.UserId)
                   .OnDelete(DeleteBehavior.Restrict); 

            // Relationship: PrivacySetting (optional)
            builder.HasOne(s => s.PrivacySetting)
                   .WithMany()
                   .HasForeignKey("PrivacySettingId") 
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
