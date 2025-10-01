namespace Api.SignalR
{
    public interface IPresenceTracker
    {
        Task<bool> UserConnected(string userId, string connectionId);
        Task<bool> UserDisconnected(string userId, string connectionId);
        Task<string[]> GetOnlineUsers();
        Task<string[]> GetConnectionsForUser(string userId);
        Task<bool> IsUserOnline(string userId);
        Task<int> GetOnlineUserCount();

        // Group-based tracking
        Task AddToGroup(string groupName, string userId);
        Task RemoveFromGroup(string groupName, string userId);
        Task<string[]> GetUsersInGroup(string groupName);
        Task<string[]> GetGroupsForUser(string userId);
        Task<bool> IsUserInGroup(string groupName, string userId);
    }
}
