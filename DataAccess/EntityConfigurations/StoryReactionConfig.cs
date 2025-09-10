using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class StoryReactionConfig : IEntityTypeConfiguration<StoryReaction>
    {
        public void Configure(EntityTypeBuilder<StoryReaction> builder)
        {
            builder.HasOne(sr => sr.View)
                   .WithMany(v => v.StorieReactions)
                   .HasForeignKey(sr => sr.ViewId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
