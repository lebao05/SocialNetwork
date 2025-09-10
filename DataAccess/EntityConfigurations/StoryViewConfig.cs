using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class StoryViewConfig : IEntityTypeConfiguration<StoryView>
    {
        public void Configure(EntityTypeBuilder<StoryView> builder)
        {
            // Story → StoryView
            builder.HasOne(sv => sv.Story)
                   .WithMany(s => s.Viewers)
                   .HasForeignKey(sv => sv.StoryId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Viewer → StoryView
            builder.HasOne(sv => sv.Viewer)
                   .WithMany()
                   .HasForeignKey(sv => sv.ViewerId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
