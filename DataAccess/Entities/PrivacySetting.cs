using Helpers;
namespace DataAccess.Entities
{
    public class PrivacySetting : BaseEntity, IBaseEntity
    {
        public virtual PrivacyLevel PrivacyLevel { get; set; }
        public virtual ICollection<SelectedPrivacyUser> SelectedPrivacyUsers { get; set; } = new List<SelectedPrivacyUser>();

    }
}
