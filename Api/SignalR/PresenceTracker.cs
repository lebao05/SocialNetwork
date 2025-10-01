using Api.SignalR;

namespace API.SignalR
{
    public class PresenceTracker : IPresenceTracker
    {
        // Key: UserId, Value: List of ConnectionIds
        private static readonly Dictionary<string, List<string>> _onlineUsers = new();

        // Key: GroupName (ConversationId), Value: HashSet of UserIds
        private static readonly Dictionary<string, HashSet<string>> _groups = new();

        // Key: UserId, Value: HashSet of GroupNames
        private static readonly Dictionary<string, HashSet<string>> _userGroups = new();

        private static readonly object _lock = new object();
        private readonly ILogger<PresenceTracker> _logger;

        public PresenceTracker(ILogger<PresenceTracker> logger)
        {
            _logger = logger;
        }

        #region User Connection Management

        public Task<bool> UserConnected(string userId, string connectionId)
        {
            bool isOnline = false;

            lock (_lock)
            {
                if (_onlineUsers.ContainsKey(userId))
                {
                    _onlineUsers[userId].Add(connectionId);
                }
                else
                {
                    _onlineUsers.Add(userId, new List<string> { connectionId });
                    isOnline = true; // User just came online
                }

                _logger.LogInformation($"User {userId} connected with ConnectionId: {connectionId}. Total connections: {_onlineUsers[userId].Count}");
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string userId, string connectionId)
        {
            bool isOffline = false;

            lock (_lock)
            {
                if (!_onlineUsers.ContainsKey(userId))
                {
                    return Task.FromResult(isOffline);
                }

                _onlineUsers[userId].Remove(connectionId);

                if (_onlineUsers[userId].Count == 0)
                {
                    _onlineUsers.Remove(userId);

                    // Remove user from all groups
                    if (_userGroups.ContainsKey(userId))
                    {
                        foreach (var groupName in _userGroups[userId].ToList())
                        {
                            if (_groups.ContainsKey(groupName))
                            {
                                _groups[groupName].Remove(userId);
                                if (_groups[groupName].Count == 0)
                                {
                                    _groups.Remove(groupName);
                                }
                            }
                        }
                        _userGroups.Remove(userId);
                    }

                    isOffline = true; // User went offline
                    _logger.LogInformation($"User {userId} disconnected completely and removed from all groups");
                }
                else
                {
                    _logger.LogInformation($"User {userId} connection {connectionId} removed. Remaining connections: {_onlineUsers[userId].Count}");
                }
            }

            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (_lock)
            {
                onlineUsers = _onlineUsers.Keys.ToArray();
            }
            return Task.FromResult(onlineUsers);
        }

        public Task<string[]> GetConnectionsForUser(string userId)
        {
            string[] connections;
            lock (_lock)
            {
                connections = _onlineUsers.ContainsKey(userId)
                    ? _onlineUsers[userId].ToArray()
                    : Array.Empty<string>();
            }
            return Task.FromResult(connections);
        }

        public Task<bool> IsUserOnline(string userId)
        {
            bool isOnline;
            lock (_lock)
            {
                isOnline = _onlineUsers.ContainsKey(userId);
            }
            return Task.FromResult(isOnline);
        }

        public Task<int> GetOnlineUserCount()
        {
            int count;
            lock (_lock)
            {
                count = _onlineUsers.Count;
            }
            return Task.FromResult(count);
        }

        #endregion

        #region Group Management

        public Task AddToGroup(string groupName, string userId)
        {
            lock (_lock)
            {
                // Add user to group
                if (_groups.ContainsKey(groupName))
                {
                    _groups[groupName].Add(userId);
                }
                else
                {
                    _groups.Add(groupName, new HashSet<string> { userId });
                }

                // Track groups for user
                if (_userGroups.ContainsKey(userId))
                {
                    _userGroups[userId].Add(groupName);
                }
                else
                {
                    _userGroups.Add(userId, new HashSet<string> { groupName });
                }

                _logger.LogInformation($"User {userId} added to group {groupName}. Group size: {_groups[groupName].Count}");
            }

            return Task.CompletedTask;
        }

        public Task RemoveFromGroup(string groupName, string userId)
        {
            lock (_lock)
            {
                // Remove user from group
                if (_groups.ContainsKey(groupName))
                {
                    _groups[groupName].Remove(userId);

                    if (_groups[groupName].Count == 0)
                    {
                        _groups.Remove(groupName);
                        _logger.LogInformation($"Group {groupName} removed (empty)");
                    }
                    else
                    {
                        _logger.LogInformation($"User {userId} removed from group {groupName}. Group size: {_groups[groupName].Count}");
                    }
                }

                // Remove group from user's groups
                if (_userGroups.ContainsKey(userId))
                {
                    _userGroups[userId].Remove(groupName);

                    if (_userGroups[userId].Count == 0)
                    {
                        _userGroups.Remove(userId);
                    }
                }
            }

            return Task.CompletedTask;
        }

        public Task<string[]> GetUsersInGroup(string groupName)
        {
            string[] users;
            lock (_lock)
            {
                users = _groups.ContainsKey(groupName)
                    ? _groups[groupName].ToArray()
                    : Array.Empty<string>();
            }
            return Task.FromResult(users);
        }

        public Task<string[]> GetGroupsForUser(string userId)
        {
            string[] groups;
            lock (_lock)
            {
                groups = _userGroups.ContainsKey(userId)
                    ? _userGroups[userId].ToArray()
                    : Array.Empty<string>();
            }
            return Task.FromResult(groups);
        }

        public Task<bool> IsUserInGroup(string groupName, string userId)
        {
            bool isInGroup;
            lock (_lock)
            {
                isInGroup = _groups.ContainsKey(groupName) && _groups[groupName].Contains(userId);
            }
            return Task.FromResult(isInGroup);
        }

        #endregion

        #region Debug/Monitoring Methods

        public Task<Dictionary<string, int>> GetGroupStatistics()
        {
            Dictionary<string, int> stats;
            lock (_lock)
            {
                stats = _groups.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Count);
            }
            return Task.FromResult(stats);
        }

        public Task<(int TotalUsers, int TotalGroups, int TotalConnections)> GetOverallStatistics()
        {
            lock (_lock)
            {
                var totalUsers = _onlineUsers.Count;
                var totalGroups = _groups.Count;
                var totalConnections = _onlineUsers.Values.Sum(connections => connections.Count);

                return Task.FromResult((totalUsers, totalGroups, totalConnections));
            }
        }

        #endregion
    }
}
