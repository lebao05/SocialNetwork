using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class FriendshipConfig : IEntityTypeConfiguration<FriendRequest>
    {
        public void Configure(EntityTypeBuilder<FriendRequest> builder)
        {

            builder.HasOne(ur => ur.Requester)
                   .WithMany()
                   .HasForeignKey(ur => ur.RequesterId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Addressee relationship
            builder.HasOne(ur => ur.Addressee)
                   .WithMany(f => f.FriendRequests)
                   .HasForeignKey(ur => ur.AddresseeId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
