using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class FriendshipRequestConfig : IEntityTypeConfiguration<FriendShip>
    {
        public void Configure(EntityTypeBuilder<FriendShip> builder)
        {
            // Requester relationship
            builder.HasOne(r => r.Requester)
                   .WithMany(f=>f.FriendRequesters) 
                   .HasForeignKey(r => r.RequesterId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Addressee relationship
            builder.HasOne(r => r.Addressee)
                   .WithMany(f=>f.FriendAddressees) 
                   .HasForeignKey(r => r.AddresseeId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
