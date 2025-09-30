namespace API.SignalR
{
    public class PresenceTracker
    {
        // groupId -> set of connectionIds
        private static readonly Dictionary<string, HashSet<string>> GroupConnections = new();

        public Task<bool> ConnectionAdded(string groupId, string connectionId)
        {
            bool becameOnline = false;

            lock (GroupConnections)
            {
                if (GroupConnections.ContainsKey(groupId))
                {
                    GroupConnections[groupId].Add(connectionId);
                }
                else
                {
                    GroupConnections[groupId] = new HashSet<string> { connectionId };
                    becameOnline = true; // first connection in this group
                }
            }

            return Task.FromResult(becameOnline);
        }

        public Task<bool> ConnectionRemoved(string groupId, string connectionId)
        {
            bool becameOffline = false;

            lock (GroupConnections)
            {
                if (!GroupConnections.ContainsKey(groupId))
                    return Task.FromResult(false);

                GroupConnections[groupId].Remove(connectionId);

                if (GroupConnections[groupId].Count == 0)
                {
                    GroupConnections.Remove(groupId);
                    becameOffline = true; // last connection left
                }
            }

            return Task.FromResult(becameOffline);
        }

        public Task<bool> IsGroupOnline(string groupId)
        {
            lock (GroupConnections)
            {
                return Task.FromResult(GroupConnections.ContainsKey(groupId));
            }
        }

        public Task<string[]> GetOnlineGroups()
        {
            string[] groups;
            lock (GroupConnections)
            {
                groups = GroupConnections.Keys.OrderBy(k => k).ToArray();
            }
            return Task.FromResult(groups);
        }
    }
}
