namespace BusinessLogic.Utils
{
    public static class Enums
    {
        public enum RelationshipStatus
        {
            Single,
            InRelationship,
            Married,
            Complicated,
            Divorced,
            Widowed
        }
        public enum FriendshipStatus
        {
            Pending,
            Accepted,
            Declined
        }
        public enum MediaType
        {
            Image,
            Video,
        }

        public enum PostType
        {
            Text,
            PhotoAndVideo,
            Poll,
            Shared
        }

        public enum StoryType
        {
            Image,
            Video,
            OnlyText
        }
        public enum PrivacyLevel
        {
            Public,
            Friends,
            FriendsExcept,
            OnlyMe,
            SpecificFriends
        }

        public enum PrivacyUserType
        {
            Excluded,
            Specific
        }
        public enum MediaReactionType
        {
            Like,
            Love,
            Haha,
            Wow,
            Sad,
            Angry
        }

        // Removed duplicate ReactionType definitions
        public enum ReactionType
        {
            Like,
            Love,
            Haha,
            Wow,
            Sad,
            Angry
        }
    }
}
