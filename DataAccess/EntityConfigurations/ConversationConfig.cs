using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class ConversationConfig : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.HasMany(c => c.Members)
                   .WithOne(cm => cm.Conversation)
                   .HasForeignKey(cm => cm.ConversationId)
                   .OnDelete(DeleteBehavior.Restrict);
            // Relationship with Messages
            builder.HasMany(c => c.Messages)
                   .WithOne(m => m.Conversation)
                   .HasForeignKey(m => m.ConversationId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c=>c.Creator)
                   .WithMany()
                   .HasForeignKey(c=>c.CreatorId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
