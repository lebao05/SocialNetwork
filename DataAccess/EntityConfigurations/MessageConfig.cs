using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.EntityConfigurations
{
    public class MessageConfig : IEntityTypeConfiguration<Message>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Message> builder)
        {
            builder.HasOne(m => m.Conversation)
                   .WithMany(c => c.Messages)
                   .HasForeignKey(m => m.ConversationId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(m => m.Sender)
                   .WithMany()
                   .HasForeignKey(m => m.SenderId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(m => m.UserMessages)
                   .WithOne(u => u.Message)
                   .HasForeignKey(u => u.MessageId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
