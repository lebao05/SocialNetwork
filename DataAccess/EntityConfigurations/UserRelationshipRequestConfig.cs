using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfigurations
{
    public class UserRelationshipRequestConfig : IEntityTypeConfiguration<UserRelationshipRequest>
    {
        public void Configure(EntityTypeBuilder<UserRelationshipRequest> builder)
        {
            // Requester relationship
            builder.HasOne(r => r.Requester)
                   .WithMany() 
                   .HasForeignKey(r => r.RequesterId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Addressee relationship
            builder.HasOne(r => r.Addressee)
                   .WithMany() 
                   .HasForeignKey(r => r.AddresseeId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Status)
                   .WithMany()
                   .HasForeignKey("StatusId") 
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
