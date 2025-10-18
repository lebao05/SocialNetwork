using Api.Utils;
using AutoMapper.Execution;
using BusinessLogic.DTOs.Chat;
using BusinessLogic.Services.Interfaces;
using DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Shared.Errors;
using System.Runtime.InteropServices;
using System.Security.Claims;

namespace Api.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly ILogger<ChatHub> _logger;
        private readonly IPresenceTracker _presenceTracker;
        private readonly UserManager<AppUser> _userManager;
        public ChatHub(IChatService chatService, 
            ILogger<ChatHub> logger, 
            IPresenceTracker presenceTracker,
            UserManager<AppUser> userManager)
        {
            _chatService = chatService;
            _logger = logger;
            _presenceTracker = presenceTracker;
            _userManager = userManager;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                // Join user's conversation groups
                var conversationIds = await _chatService.GetUserConversationIds(userId);
                foreach (var convId in conversationIds)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, convId);
                }

                _logger.LogInformation($"User {userId} connected with ConnectionId: {Context.ConnectionId}");
            }
            bool isOnline = await _presenceTracker.UserConnected(userId, Context.ConnectionId);
            var userOnlines = await _presenceTracker.GetOnlineUsers();
            await Clients.Client(Context.ConnectionId).SendAsync("IntialUsersOnline", userOnlines);
            if( isOnline )
            {
                await Clients.Others.SendAsync("UserIsOnline", userId);
            }
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                _logger.LogInformation($"User {userId} disconnected (ConnectionId: {Context.ConnectionId})");
            }
            bool isOnline = await _presenceTracker.UserDisconnected(userId, Context.ConnectionId);
            if (!isOnline)
            {
                await Clients.Others.SendAsync("UserIsOffline", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }
        public async Task SendMessage(SendMessageDto dto)
        {
            try
            {
                var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    throw new HubException("Unauthorized");
                }

                var message = await _chatService.SendMessageAsync(userId, dto);

                // Send to all users in the conversation group
                await Clients.Group(dto.ConversationId)
                    .SendAsync("ReceiveMessage", message);
            }
            catch (Exception ex)
            {
                throw new HubException("Failed to send message");
            }
        }   
        public async Task DeleteMessage(string messageId)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if (string.IsNullOrEmpty(userId))
                throw new Exception("Unauthorized");
            try
            {
                var isSuccess = await _chatService.DeleteMessage(userId, messageId);
                if (!isSuccess)
                {
                    throw new HubException("Failed to delete message");
                }
                var message = await _chatService.GetMessageById(messageId);
                await Clients.Group(message.ConversationId).SendAsync("DeleteMessage", messageId);
            }
            catch (Exception ex)
            {
                throw new HubException("Failed to delete message");
            }
        }
        public async Task LeaveConversation(string conversationID)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if(string.IsNullOrEmpty(userId))
            {
                throw new HubException("Unauthorized");
            }
            try
            {
                var member = await _chatService.LeaveChatGroup(userId, conversationID);
                var message = new SendMessageDto
                {
                    ConversationId = conversationID,
                    Content = $"A {member.User.FirstName} {member.User.LastName} has left the conversation.",
                }; 
                var messageRes = await _chatService.SendMessageAsync(userId, message,true);
                var connections = await _presenceTracker.GetConnectionsForUser(userId);
                foreach(var connectionId in connections)
                    await Groups.RemoveFromGroupAsync(connectionId, conversationID);
                await Clients.Group(conversationID).SendAsync("ReceiveMessage", messageRes);
                await Clients.Group(conversationID).SendAsync("LeaveGroup", userId);
            }
            catch(HttpResponseException ex) 
            {
                throw new HubException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new HubException("Failed to leave group");
            }
        }
        public async Task AddToGroup(AddToConversationDto dto)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if (string.IsNullOrEmpty(userId))
            {
                throw new HubException("Unauthorized");
            }
            try
            {
                var member = await _chatService.AddToConversation(userId, dto);
                var message = new SendMessageDto
                {
                    ConversationId = dto.ConversationId,
                    Content = $"{member.User.FirstName} {member.User.LastName} has been added to the conversation.",
                };
                var messageRes = await _chatService.SendMessageAsync(userId, message,true);
                var connections = await _presenceTracker.GetConnectionsForUser(member.User.Id);
                foreach (var connectionId in connections)
                    await Groups.AddToGroupAsync(connectionId, dto.ConversationId);
                await Clients.Group(dto.ConversationId).SendAsync("ReceiveMessage", messageRes);
                await Clients.Group(dto.ConversationId).SendAsync("AddToGroup", member);
            }
            catch(Exception ex)
            {
                throw new HubException(ex.Message);
            }
        }
        public async Task ReactToMessage(ReactToMessageDto dto)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if (string.IsNullOrEmpty(userId))
                throw new HubException("Unauthorized");
            try
            {
                UserMessageDto res = await _chatService.ReactToMessage(userId, dto);
                if( res != null )
                {
                    var message = await _chatService.GetMessageById(dto.MessageId);
                    await Clients.Group(message.ConversationId).SendAsync("ReactToMessage", res);
                }
            }
            catch (Exception ex)
            {
                throw new HubException(ex.Message);
            }
        }
        public async Task MarkMessageAsReaded(string conversationId)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if (string.IsNullOrEmpty(userId))
                throw new HubException("Unauthorized");
            try
            {
                var res = await _chatService.MarkMessageAsReaded(userId, conversationId);
                if(res != null && res.Count > 0)
                    await Clients.Group(conversationId).SendAsync("MarkAsRead", res);
            }
            catch (Exception ex)
            {
                throw new HubException(ex.Message);
            }
        }
        public async Task ChangeAlias(ChaneAliasDto dto)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if (userId == null)
                throw new HubException("Unauthorized");
            try
            {
                var isSuccess = await _chatService.ChangeAlias(userId,dto);
                var user = await _userManager.FindByIdAsync(dto.UserId);
                if( isSuccess )
                {
                    var message = new SendMessageDto
                    {
                        ConversationId = dto.ConversationId,
                        Content = $"{user.FirstName} {user.LastName} has changed alias for {user.FirstName} {user.LastName} to {dto.Alias}.",
                    };
                    var messageRes = await _chatService.SendMessageAsync(userId, message, true);
                    await Clients.Group(dto.ConversationId).SendAsync("ReceiveMessage", messageRes);
                }
            }
            catch(Exception ex)
            {
                throw new HubException(ex.Message);
            }
        }
        public async Task ChangeConversationDetail(UpdateConversationDto dto)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User);
            if (userId == null)
                throw new HubException("Unauthorized");
            try
            {
                if (dto.PictureUrl == null && dto.Name == null && dto.DefaultReaction == null)
                    return;
                var res = await _chatService.UpdateConversationDetails(userId, dto);
                var user = await _userManager.FindByIdAsync(userId);
                await Clients.Group(dto.ConversationId).SendAsync("ChangeConversationDetail", res);
                if( dto.Name != null )
                {
                    var message = new SendMessageDto
                    {
                        ConversationId = dto.ConversationId,
                        Content = $"{user.FirstName} {user.LastName} has changed the conversation name to {dto.Name}.",
                    };
                    var messageRes = await _chatService.SendMessageAsync(userId, message, true);
                    await Clients.Group(dto.ConversationId).SendAsync("ReceiveMessage", messageRes);
                }
                if (dto.PictureUrl != null)
                {
                    var message = new SendMessageDto
                    {
                        ConversationId = dto.ConversationId,
                        Content = $"{user.FirstName} {user.LastName} has uploaded a new conversation image.",
                    };
                    var messageRes = await _chatService.SendMessageAsync(userId, message, true);
                    await Clients.Group(dto.ConversationId).SendAsync("ReceiveMessage", messageRes);
                }
                if (dto.DefaultReaction != null)
                {
                    var message = new SendMessageDto
                    {
                        ConversationId = dto.ConversationId,
                        Content = $"{user.FirstName} {user.LastName} has been change conversaion emotion to {dto.DefaultReaction}.",
                    };
                    var messageRes = await _chatService.SendMessageAsync(userId, message, true);
                    await Clients.Group(dto.ConversationId).SendAsync("ReceiveMessage", messageRes);
                }
            }
            catch(Exception ex)
            {
                throw new HubException(ex.Message);
            }
        }
    }
}
