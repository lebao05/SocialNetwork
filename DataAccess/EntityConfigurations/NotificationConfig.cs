using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class NotificationConfig : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            // Required: User
            builder.HasOne(n => n.User)
                   .WithMany(u => u.Notifications)
                   .HasForeignKey(n => n.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Optional: Related User
            builder.HasOne(n => n.RelatedUser)
                   .WithMany()
                   .HasForeignKey(n => n.RelatedUserId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Optional: Related Post
            builder.HasOne(n => n.RelatedPost)
                   .WithMany()
                   .HasForeignKey(n => n.RelatedPostId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Optional: Related Group
            builder.HasOne(n => n.RelatedGroup)
                   .WithMany()
                   .HasForeignKey("RelatedCommunityGroupId") 
                   .OnDelete(DeleteBehavior.Restrict);

            // Optional: Related Comment
            builder.HasOne(n => n.RelatedComment)
                   .WithMany()
                   .HasForeignKey(n => n.RelatedCommentId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
