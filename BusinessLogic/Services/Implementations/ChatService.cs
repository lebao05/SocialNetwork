using AutoMapper;
using BusinessLogic.DTOs.Chat;
using BusinessLogic.DTOs.User;
using BusinessLogic.Services.Interfaces;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
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
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
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
            IBlobService blobService,
            UserManager<AppUser> userManager,
            IMapper mapper)
        {
            _mapper = mapper;
            _conversationRepo = conversationRepo;
            _messageRepo = messageRepo;
            _userMessageRepo = userMessageRepo;
            _conversationMemberRepo = conversationMemberRepo;
            _logger = logger;
            _blobService = blobService;
            _messageAttachmentRepo = messageAttachmentRepo;
            _azureStorageOptions = azureStorageOption.Value;
            _userManager = userManager;
        }
        public async Task<MessageResponseDto> SendMessageAsync(string userId, SendMessageDto dto, bool isSystemMessage = false)
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
            var attachment = await _messageAttachmentRepo.FindOneByBlobName(dto.Attachment);
            if( attachment == null && dto.Content == null)
            {
                throw new Exception("Message must have content or attachment");
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
                Deleted = false,
                IsSystemMessage = isSystemMessage,
            };

            await _messageRepo.AddAsync(message);
            if( attachment != null)
            {
                attachment.MessageId = message.Id; 
                await _messageAttachmentRepo.UpdateAsync(attachment);
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
                Attachment = MapToAttachmentDtos(attachment),
                IsSystemMessage = isSystemMessage
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
            var result = new List<ConversationResponseDto>();
            foreach (var conv in conversations)
            {
                result.Add(await MapToConversationDto(conv, userId)); // sequential - safe
            }
            return result;
        }

        public async Task<MessageResponseDto> GetMessageById(string messageId)
        {
            var message = await _messageRepo.GetMessageWithDetailsAsync(messageId);
            if (message == null)
            {
                throw new Exception("Message not found");
            }
            return new MessageResponseDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                SenderName = $"{message.Sender.FirstName} {message.Sender.LastName}",
                SenderAvatar = message.Sender.AvatarUrl,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                Deleted = message.Deleted,
                IsEdited = message.IsEdited,
                Attachment = MapToAttachmentDtos(message.MessageAttachment),
            };
        }
        public async Task<List<MessageResponseDto>> GetConversationMessagesAsync(string conversationId, int page = 1, int pageSize = 50)
        {
            var messages = await _messageRepo.GetConversationMessagesAsync(conversationId, page, pageSize);

            var messageDtos = messages.Select(m => new MessageResponseDto
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                SenderId = m.SenderId,
                SenderName = $"{m.Sender.FirstName} {m.Sender.LastName}",
                SenderAvatar = m.Sender.AvatarUrl,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
                IsEdited = m.IsEdited,
                Deleted = m.Deleted,
                IsSystemMessage = m.IsSystemMessage,
                Attachment = MapToAttachmentDtos(m.MessageAttachment),
                UserMessageDtos = m.UserMessages
                    .Select(um => _mapper.Map<UserMessageDto>(um))
                    .ToList()
            })
            .Reverse()
            .ToList();

            return messageDtos;
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
        public async Task<bool> DeleteMessage(string userId,string messageId)
        {
            var message = await _messageRepo.GetMessageWithDetailsAsync(messageId);
            if ( message == null)
                throw new Exception("Message not found");
            if (message.SenderId != userId)
                throw new UnauthorizedAccessException("You do not have permission to delete the message;");
            return await _messageRepo.DeleteAsync(message);
        }
        public async Task<bool> DeleteAttachment(string userId,string attachmentId)
        {
            var attachment = await _messageAttachmentRepo.GetByIdAsync(attachmentId);
            if( attachment == null)
                throw new Exception("Attachment not found");
            if( attachment.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to delete the attachment;");
            var message = await _messageRepo.GetMessageWithDetailsAsync(attachment.MessageId);
            if( message == null)
                throw new Exception("Message not found");
            // Delete blob from storage
            // Delete record from database
            return await _messageAttachmentRepo.DeleteAsync(attachment);
        }
        public async Task<AttachmentDto> GetAttachmentById(string userId,string attachmentId)
        {
            var attachment = await _messageAttachmentRepo.GetByIdAsync(attachmentId);
            if( attachment == null)
                throw new Exception("Attachment not found");
            if( attachment.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to access the attachment;");
            return MapToAttachmentDtos(attachment);
        }
        public async Task<ConversationResponseDto> ChangeConversationDetails(string userId,UpdateConversationDto dto)
        {
            var conversation = await _conversationRepo.GetConversationWithMembersAsync(dto.ConversationId);
            if( conversation == null )
                throw new Exception("Conversation not found");
            var member = await _conversationMemberRepo.GetMemberAsync(dto.ConversationId,userId);
            if( member == null )
                throw new UnauthorizedAccessException("You are not a member of this conversation");
            conversation.Name = dto.Name;
            conversation.IsE2EE = dto.IsE2EE;
            conversation.PictureUrl = dto.PictureUrl;
            await _conversationRepo.UpdateAsync(conversation);
            return await MapToConversationDto(conversation,userId);
        }
        public async Task<List<UserMessageDto>> MarkMessageAsReaded(string userId, string ConversationId)
        {
            var isMember = await _conversationMemberRepo.IsMemberAsync(ConversationId, userId);
            if (isMember == false)
                throw new UnauthorizedAccessException("You are not a member of this conversation");
            var um = await _userMessageRepo.GetUserMessageByConversationId(userId, ConversationId);
            if (um == null || um.Count == 0) 
                throw new Exception("You already read all");
            for (int i = 0; i < um.Count; i++)
                um[i].ReadAt = DateTime.UtcNow;
            await _userMessageRepo.UpdateRangeAsnyc(um);
            return um.Select(u => _mapper.Map<UserMessageDto>(u)).ToList();
        }
        public async Task<UserMessageDto> ReactToMessage(string userId, ReactToMessageDto dto)
        {
            var message = await _messageRepo.GetByIdAsync(dto.MessageId);
            if( message == null)
                throw new Exception("Message not found");
            var isMember = await _conversationMemberRepo.IsMemberAsync(message.ConversationId, userId);
            if( !isMember )
                throw new UnauthorizedAccessException("You are not a member of this conversation");
            var userMessage = await _userMessageRepo.GetUserMessageAsync(userId,dto.MessageId);
            
            if( userMessage == null)
                throw new Exception("UserMessage not found");

            if (userMessage.Reaction == dto.Reaction)
                userMessage.Reaction = null;
            else
                userMessage.Reaction = dto.Reaction;
            await _userMessageRepo.UpdateAsync(userMessage);
            return _mapper.Map<UserMessageDto>(userMessage);
        }
        public async Task<ConversationMemberDto> LeaveChatGroup(string userId,string conversationId)
        {
            var member = await _conversationMemberRepo.GetMemberAsync(conversationId,userId);
            if (member == null)
                throw new HttpResponseException(404,"User is not a member of this conversation");
            if( !member.Conversation.IsGroup)
                throw new HttpResponseException(400,"Cannot leave a one-on-one conversation");
            var IsSuccessfull = await _conversationMemberRepo.DeleteAsync(member);
            if(!IsSuccessfull)
                throw new HttpResponseException(500,"Failed to leave the group");
            return _mapper.Map<ConversationMemberDto>(member);
        }

        public async Task<UpdateConversationDto> UpdateConversationDetails(string userId,UpdateConversationDto dto)
        {
            var member = await _conversationMemberRepo.GetMemberAsync(dto.ConversationId, userId);
            if (member == null)
                throw new Exception("You are not member of this conversation");
            var conversation = await _conversationRepo.GetByIdAsync(dto.ConversationId);
            if( dto.DefaultReaction != null )
                conversation.DefaultReaction = dto.DefaultReaction;
            if( dto.PictureUrl != null )
                conversation.PictureUrl = dto.PictureUrl;
            if (dto.Name != null)
                conversation.Name = dto.Name;
            await _conversationRepo.UpdateAsync(conversation);
            return dto;
        }
        public async Task<ConversationMemberDto> AddToConversation(string userId, AddToConversationDto dto)
        {
            var isMember = await _conversationMemberRepo.IsMemberAsync(dto.ConversationId, userId);
            if( !isMember )
                throw new Exception("You are not a member of this conversation");
            var member = await _conversationMemberRepo.GetMemberAsync(dto.ConversationId, dto.UserId);
            if (member != null)
                throw new Exception("This user is already a member of the conversation!");
            var User = await _userManager.FindByIdAsync(dto.UserId);
            if( User == null )
                throw new Exception("User not found");
            var conversation = await _conversationRepo.GetConversationWithMembersAsync(dto.ConversationId);
            if (conversation == null)
                throw new Exception("Conversation not found");
            var memb = new ConversationMember
            {
                ConversationId = dto.ConversationId,
                UserId = dto.UserId,
                Role = "Member",
                JoinedAt = DateTime.UtcNow
            };
            await _conversationMemberRepo.AddAsync(memb);
            var memberRes = await _conversationMemberRepo.GetMemberAsync(dto.ConversationId, dto.UserId);
            return _mapper.Map<ConversationMemberDto>(memberRes);
        }
        public async Task<bool> ChangeAlias(string userId, ChaneAliasDto dto)
        {
            var member = await _conversationMemberRepo.GetMemberAsync(dto.ConversationId, userId);
            if (member == null)
                throw new Exception("You aren't a member of this conversation");
            var memberChanged = await _conversationMemberRepo.GetMemberAsync(dto.ConversationId, dto.UserId);
            if (memberChanged == null)
                throw new Exception("The User isn't a member of this conversation");
            if (dto.Alias == null || dto.Alias == string.Empty)
                throw new Exception("Alias is invalid");
            memberChanged.Alias = dto.Alias;
            await _conversationMemberRepo.UpdateAsync(memberChanged);
            return true;
        }
        private async Task<ConversationResponseDto> MapToConversationDto(Conversation conv, string? currentUserId = null)
        {
            // Get last message
            var lastMessage = await _messageRepo.GetLastMessageAsync(conv.Id);

            // Map members
            var members = conv.Members.Select(m => new ConversationMemberDto
            {
                User = _mapper.Map<UserDto>(m.User),
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
        private AttachmentDto MapToAttachmentDtos(MessageAttachment a)
        {
            if( a == null)
                return null;
            return new AttachmentDto
            {
                BlobUrl = _blobService.GenerateDownloadSasUrl(_azureStorageOptions.ConversationContainer, a.BlobName),
                OriginalName = a.OriginalName,
                FileType = a.FileType,
                Size = a.Size,
                Deleted = a.Deleted,
            };
        }
    }
}
