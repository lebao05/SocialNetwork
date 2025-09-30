using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Api.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(IChatService chatService, ILogger<ChatHub> logger)
        {
            _chatService = chatService;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await _chatService.UserConnected(userId, Context.ConnectionId);

                // Join user's conversation groups
                var conversationIds = await _chatService.GetUserConversationIds(userId);
                foreach (var convId in conversationIds)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, convId);
                }

                // Notify friends about online status
                await Clients.Others.SendAsync("UserOnline", userId);
                _logger.LogInformation($"User {userId} connected with ConnectionId: {Context.ConnectionId}");
            }
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await base.OnDisconnectedAsync(exception);
        }
    }
}
