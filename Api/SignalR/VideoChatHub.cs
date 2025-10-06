using Microsoft.AspNetCore.SignalR;

namespace Api.SignalR
{
    public class VideoChatHub : Hub
    {
        private readonly ILogger<VideoChatHub> _logger;
        private readonly IPresenceTracker _presenceTracker;
        public VideoChatHub(IPresenceTracker presenTracker)
        {
            _presenceTracker = presenTracker;
        }
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }
    }
}
