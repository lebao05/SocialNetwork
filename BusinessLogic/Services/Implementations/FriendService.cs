using AutoMapper;
using BusinessLogic.DTOs.Friend;
using BusinessLogic.DTOs.User;
using BusinessLogic.Services.Interfaces;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Shared.Errors;

namespace BusinessLogic.Services.Implementations
{
    public class FriendService : IFriendService
    {
        private readonly IFriendReqRepo _friendReqRepo;
        private readonly IFriendShipRepo _friendShipRepo;
        private readonly IMapper _mapper;
        public FriendService(
            IFriendShipRepo friendshipRepo, 
            IFriendReqRepo friendreqRepo,
            IMapper mapper
            )
        {
            _mapper = mapper;
            _friendReqRepo = friendreqRepo;
            _friendShipRepo = friendshipRepo;
        }
        public async Task<FriendRequest> SendFriendRequestAsync(string requesterId, string addresseeId)
        {
            var friend = await _friendShipRepo.GetByClause(fr => (fr.RequesterId == requesterId && fr.AddresseeId == addresseeId)
                || (fr.RequesterId == addresseeId && fr.AddresseeId == requesterId));
            if (friend != null)
                throw new HttpResponseException(400, "This person are already your friend");
            // Check if a request already exists
            var exists = await _friendReqRepo.GetByClause(
                fr => (fr.RequesterId == requesterId && fr.AddresseeId == addresseeId && !fr.IsAccepted)
                || (fr.RequesterId == addresseeId && fr.AddresseeId == requesterId && !fr.IsAccepted)
            );

            if (exists != null)
                throw new HttpResponseException(400, "Friend request already exists.");

            var request = new FriendRequest
            {
                RequesterId = requesterId,
                AddresseeId = addresseeId,
                IsAccepted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _friendReqRepo.AddAsync(request);
            return request;
        }
        public async Task<FriendShip> AcceptFriendRequestAsync(string requestId, string userId)
        {
            var request = await _friendReqRepo.FindByIdAsync(requestId);
            if (request == null)
                throw new HttpResponseException(404, "Friend request not found.");
            if (request.AddresseeId != userId)
                throw new HttpResponseException(401, "You do not have permission");
            request.IsAccepted = true;
            request.UpdatedAt = DateTime.UtcNow;
            await _friendReqRepo.UpdateAsync(request);

            var friendship = new FriendShip
            {
                RequesterId = request.RequesterId,
                AddresseeId = request.AddresseeId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _friendShipRepo.AddAsync(friendship);
            return friendship;
        }
        public async Task<bool> DeleteFriendRequestAsync(string requestId, string userId)
        {
            var request = await _friendReqRepo.FindByIdAsync(requestId);
            if (request.AddresseeId != userId && request.RequesterId != userId)
                throw new HttpResponseException(401, "You do not have permission");
            if (request == null) return false;

            return await _friendReqRepo.DeleteAsync(request);
        }
        public async Task<bool> DeleteFriendAsync(string userId1, string userId2)
        {
            var friendship = await _friendShipRepo.GetByClause(
                f => (f.RequesterId == userId1 && f.AddresseeId == userId2) ||
                     (f.RequesterId == userId2 && f.AddresseeId == userId1)
            );
            var request = await _friendReqRepo.GetByClause(
                f => (f.RequesterId == userId1 && f.AddresseeId == userId2) ||
                     (f.RequesterId == userId2 && f.AddresseeId == userId1));

            await _friendReqRepo.DeleteAsync(request);
            if (friendship == null) return false;

            return await _friendShipRepo.DeleteAsync(friendship);
        }
        public async Task<List<FriendShipDto>> GetFriendsAsync(string userId)
        {
            var friendships = await _friendShipRepo.GetFriendWithUser(userId
            );
            var list = friendships.Select(
                f => new FriendShipDto
                {
                    Id = f.Id,
                    Friend = f.RequesterId == userId 
                    ? _mapper.Map<UserDto>(f.Addressee) 
                    :
                    _mapper.Map<UserDto>(f.Requester),
                }).ToList();
       
            return list;
        }
        public async Task<List<FriendRequest>> GetFriendRequestsAsync(string userId)
        {
            var requests = await _friendReqRepo.GetFriendRequestWithUser(userId);

            return requests;
        }
    }
}
