using BusinessLogic.DTOs.Chat;
using BusinessLogic.Services.Interfaces;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Shared.Configs;
using Shared.Errors;
using Shared.Services.Interfaces;
using System.Linq;

namespace BusinessLogic.Services.Implementations
{
    public class ChatService : IChatService
    {
        private readonly IConversationRepo _conversationRepo;
        private readonly IMessageRepo _messageRepo;
        private readonly IUserMessageRepo _userMessageRepo;
        private readonly IConversationMemberRepo _conversationMemberRepo;
        private readonly IMessageAttachmentRepo _messageAttachmentRepo;
        private readonly IBlobService _blobService;
        private readonly AzureStorageOptions _azureStorageOptions;
        private readonly ILogger<ChatService> _logger; 
        public ChatService(
            IConversationRepo conversationRepo,
            IMessageRepo messageRepo,
            IUserMessageRepo userMessageRepo,
            IConversationMemberRepo conversationMemberRepo,
            AppDbContext context,
            ILogger<ChatService> logger,
            IMessageAttachmentRepo messageAttachmentRepo,
            IOptions<AzureStorageOptions> azureStorageOption,
            IBlobService blobService)
        {
            _conversationRepo = conversationRepo;
            _messageRepo = messageRepo;
            _userMessageRepo = userMessageRepo;
            _conversationMemberRepo = conversationMemberRepo;
            _logger = logger;
            _blobService = blobService;
            _messageAttachmentRepo = messageAttachmentRepo;
            _azureStorageOptions = azureStorageOption.Value;
        }
        public async Task<MessageResponseDto> SendMessageAsync(string userId, SendMessageDto dto)
        {
            // Verify user is member of conversation
            var isMember = await _conversationMemberRepo.IsMemberAsync(dto.ConversationId, userId);
            if (!isMember)
            {
                throw new UnauthorizedAccessException("User is not a member of this conversation");
            }

            // Get conversation members
            var members = await _conversationMemberRepo.GetConversationMembersAsync(dto.ConversationId);
            if (members.Count == 0)
            {
                throw new Exception("Conversation has no members");
            }

            // Create message
            var message = new Message
            {
                Id = Guid.NewGuid().ToString(),
                ConversationId = dto.ConversationId,
                SenderId = userId,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                IsEdited = false,
                Deleted = false
            };

            await _messageRepo.AddAsync(message);
            if (dto.AttachmentIds != null && dto.AttachmentIds.Any())
            {
                var attachments = await _messageAttachmentRepo.FindByClause(a =>
                    dto.AttachmentIds.Contains(a.BlobName) && a.UserId == userId
                    && a.MessageId == null && !a.Deleted
                    );

                foreach (var attachment in attachments)
                {
                    attachment.MessageId = message.Id; 
                    await _messageAttachmentRepo.UpdateAsync(attachment);
                }
            }
            // Create UserMessage records for all members
            var userMessages = members.Select(member => new UserMessage
            {
                Id = Guid.NewGuid().ToString(),
                MessageId = message.Id,
                UserId = member.UserId,
                ReadAt = member.UserId == userId ? DateTime.UtcNow : null
            }).ToList();

            await _userMessageRepo.BulkCreateAsync(userMessages);

            // Get sender details
            var sender = members.FirstOrDefault(m => m.UserId == userId)?.User;
            var attachmentsList = await _messageAttachmentRepo.FindByClause(a=>a.MessageId == message.Id && !a.Deleted);
            return new MessageResponseDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = userId,
                SenderName = sender != null ? $"{sender.FirstName} {sender.LastName}" : "Unknown",
                SenderAvatar = sender?.AvatarUrl,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                IsEdited = message.IsEdited,
                Attachments = MapToAttachmentDtos(attachmentsList),
            };
        }

        public async Task<ConversationResponseDto> CreateConversationAsync(string creatorId, CreateConversationDto dto)
        {
            // Check if 1-on-1 conversation already exists
            if (!dto.IsGroup && dto.MemberIds.Count == 1)
            {
                var otherUserId = dto.MemberIds.First();
                var existing = await _conversationRepo.FindOneOnOneConversationAsync(creatorId, otherUserId);

                if (existing != null)
                {
                    return await MapToConversationDto(existing, creatorId);
                }
            }

            // Create new conversation
            var conversation = new Conversation
            {
                Id = Guid.NewGuid().ToString(),
                Name = dto.Name,
                IsGroup = dto.IsGroup,
                IsE2EE = dto.IsE2EE,
                CreatorId = creatorId,
                CreatedAt = DateTime.UtcNow
            };

            await _conversationRepo.AddAsync(conversation);

            // Add creator as admin
            var creatorMember = new ConversationMember
            {
                ConversationId = conversation.Id,
                UserId = creatorId,
                Role = "Admin",
                JoinedAt = DateTime.UtcNow
            };
            await _conversationMemberRepo.AddAsync(creatorMember);

            // Add other members
            foreach (var memberId in dto.MemberIds.Where(id => id != creatorId))
            {
                var member = new ConversationMember
                {
                    ConversationId = conversation.Id,
                    UserId = memberId,
                    Role = "Member",
                    JoinedAt = DateTime.UtcNow
                };
                await _conversationMemberRepo.AddAsync(member);
            }
            var createdConversation = await _conversationRepo.GetConversationWithMembersAsync(conversation.Id);
            return await MapToConversationDto(createdConversation!, creatorId);
        }

        public async Task<List<ConversationResponseDto>> GetUserConversationsAsync(string userId)
        {
            var conversations = await _conversationRepo.GetUserConversationsAsync(userId);

            var result = conversations.Select(conv =>
            {
                string? pictureUrl = conv.IsGroup
                    ? conv.PictureUrl 
                    : conv.Members
                          .FirstOrDefault(m => m.UserId != userId)?
                          .User.AvatarUrl; 
                return new ConversationResponseDto
                {
                    Id = conv.Id,
                    Name = conv.IsGroup
                    ? conv.Name
                    : conv.Members
                          .FirstOrDefault(m => m.UserId != userId) is { User: var otherUser }
                              ? $"{otherUser.FirstName} {otherUser.LastName}"
                              : "Unknown",
                    IsGroup = conv.IsGroup,
                    IsE2EE = conv.IsE2EE,
                    PictureUrl = pictureUrl,
                    CreatedAt = conv.CreatedAt,
                    Members = conv.Members.Select(m => new ConversationMemberDto
                    {
                        UserId = m.UserId,
                        Name = $"{m.User.FirstName} {m.User.LastName}",
                        Role = m.Role,
                    }).ToList(),
                    LastMessage = conv.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => new MessageResponseDto
                        {
                            Id = m.Id,
                            Content = m.Content,
                            SenderName = $"{m.Sender.FirstName} {m.Sender.LastName}",
                            CreatedAt = m.CreatedAt
                        })
                        .FirstOrDefault()
                };
            }).ToList();

            return result;
        }
        public async Task<List<MessageResponseDto>> GetConversationMessagesAsync(string conversationId, int page = 1, int pageSize = 50)
        {
            var messages = await _messageRepo.GetConversationMessagesAsync(conversationId, page, pageSize);
            
            return messages.Select(m => new MessageResponseDto
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                SenderId = m.SenderId,
                SenderName = $"{m.Sender.FirstName} {m.Sender.LastName}",
                SenderAvatar = m.Sender.AvatarUrl,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
                IsEdited = m.IsEdited,
                Attachments = MapToAttachmentDtos(m.MessageAttachments.Where(a=>!a.Deleted).ToList()),
            }).Reverse().ToList();
        }
        public async Task<ConversationResponseDto> GetConversationByIdAsync(string conversationId, string userId)
        {
            var conversation = await _conversationRepo.GetConversationWithMembersAsync(conversationId);
            if (conversation == null)
            {
                throw new HttpResponseException(400, "Conversation not found");
            }
            var isMember = conversation.Members.Any(m => m.UserId == userId);
            if (!isMember)
            {
                throw new HttpResponseException(401,"User is not a member of this conversation");
            }
            return await MapToConversationDto(conversation, userId);
        }
        public async Task<bool> IsConversationMember(string conversationId, string userId)
        {
            return await _conversationMemberRepo.IsMemberAsync(conversationId, userId);
        }

        public async Task<List<string>> GetUserConversationIds(string userId)
        {
            return await _conversationMemberRepo.GetUserConversationIdsAsync(userId);
        }

        public async Task DeleteMessageAsync(string userId, string messageId)
        {
            var userMessage = await _userMessageRepo.GetUserMessageAsync(userId, messageId);

            if (userMessage == null)
            {
                throw new Exception("Message not found for this user");
            }

            if (userMessage.Message.SenderId == userId)
            {
                // Sender can delete for everyone
                userMessage.Message.Deleted = true;
                await _messageRepo.UpdateAsync(userMessage.Message);
            }
            else
            {
                // Others can only delete for themselves
                userMessage.DeleteAt = DateTime.UtcNow;
                await _userMessageRepo.UpdateAsync(userMessage);
            }
        }


        private async Task<ConversationResponseDto> MapToConversationDto(Conversation conv, string? currentUserId = null)
        {
            // Get last message
            var lastMessage = await _messageRepo.GetLastMessageAsync(conv.Id);

            // Map members
            var members = conv.Members.Select(m => new ConversationMemberDto
            {
                UserId = m.UserId,
                Name = $"{m.User.FirstName} {m.User.LastName}",
                Role = m.Role,
            }).ToList();

            return new ConversationResponseDto
            {
                Id = conv.Id,
                Name = conv.Name,
                IsGroup = conv.IsGroup,
                IsE2EE = conv.IsE2EE,
                CreatedAt = conv.CreatedAt,
                LastMessage = lastMessage != null ? new MessageResponseDto
                {
                    Id = lastMessage.Id,
                    Content = lastMessage.Content,
                    SenderName = $"{lastMessage.Sender.FirstName} {lastMessage.Sender.LastName}",
                    CreatedAt = lastMessage.CreatedAt
                } : null,
                Members = members
            };
        }
        private List<AttachmentDto> MapToAttachmentDtos(List<MessageAttachment> attachments)
        {
            return attachments.Select(
             a => new AttachmentDto
             {
                 BlobUrl = _blobService.GenerateDownloadSasUrl(_azureStorageOptions.ConversationContainer, a.BlobName),
                 OriginalName = a.OriginalName,
                 FileType = a.FileType,
                 Size = a.Size
             }
            ).ToList();
        }
    }
}
