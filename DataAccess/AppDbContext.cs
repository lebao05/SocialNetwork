using DataAccess.Entities;
using DataAccess.EntityConfigurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace DataAccess
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        // Groups
        public DbSet<CommunityGroup> Groups { get; set; }
        public DbSet<GroupType> GroupTypes { get; set; }

        // Posts
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostMedia> PostMedias { get; set; }
        public DbSet<PostReaction> PostReactions { get; set; }

        // Comments
        public DbSet<Comment> Comments { get; set; }

        // Stories
        public DbSet<Story> Stories { get; set; }
        public DbSet<StoryView> StoryViews { get; set; }
        public DbSet<StoryReaction> StoryReactions { get; set; }

        // Notifications
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationType> NotificationTypes { get; set; }

        // Privacy
        public DbSet<PrivacyLevel> PrivacyLevels { get; set; }
        public DbSet<PrivacySetting> PrivacySettings { get; set; }
        public DbSet<SelectedPrivacyUser> SelectedPrivacyUsers { get; set; }

        // Reactions
        public DbSet<ReactionType> ReactionTypes { get; set; }

        // Friends
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<FriendShip> FriendShips { get; set; }
        public DbSet<RelationshipType> RelationshipTypes { get; set; }

        //Education And Work
        public DbSet<Education> Educations { get; set; }

        public DbSet<Work> Works { get; set; }
        //Message and Conversation
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserMessage> UserMessages { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<MessageAttachment> MessageAttachments { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

       
        protected override void OnModelCreating(ModelBuilder builder)
        {
            var cascadeFKs = builder.Model.GetEntityTypes()
                .SelectMany(t => t.GetForeignKeys())
                .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

            foreach (var fk in cascadeFKs)
                fk.DeleteBehavior = DeleteBehavior.Restrict;
            base.OnModelCreating(builder);

            AddMyFilters(ref builder);

            builder.ApplyConfiguration(new CommentConfig());
            builder.ApplyConfiguration(new CommunityGroupConfig());
            builder.ApplyConfiguration(new CommunityGroupMemberConfig());
            builder.ApplyConfiguration(new NotificationConfig());
            builder.ApplyConfiguration(new PostConfig());
            builder.ApplyConfiguration(new StoryConfig());
            builder.ApplyConfiguration(new StoryReactionConfig());
            builder.ApplyConfiguration(new StoryViewConfig());
            builder.ApplyConfiguration(new FriendshipConfig());
            builder.ApplyConfiguration(new FriendshipRequestConfig());
            builder.ApplyConfiguration(new AppUserConfiguration());


            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }
            ;
        }

        private void AddMyFilters(ref ModelBuilder modelBuilder)
        {

            #region SoftDeleted
            modelBuilder.Entity<Post>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<CommunityGroup>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<CommunityGroupMember>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<GroupType>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<PrivacySetting>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<FriendRequest>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<FriendShip>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<Work>().HasQueryFilter(x => !x.Deleted);
            modelBuilder.Entity<Education>().HasQueryFilter(x => !x.Deleted);

            #endregion
        }
    }
}
