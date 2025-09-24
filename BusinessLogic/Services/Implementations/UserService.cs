using AutoMapper;
using BusinessLogic.DTOs.EducationWork;
using BusinessLogic.DTOs.User;
using BusinessLogic.Services.Interfaces;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Shared.Errors;
using Shared.Services.Interfaces;

namespace BusinessLogic.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IBlobService _blobService;
        private readonly IWorkRepo _workRepo;
        private readonly IEducationRepo _educationRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IGeneralRepo _generalRepo;
        private readonly AppDbContext _context;
        private readonly IUserRepo _userRepo;
        private readonly IMapper _mapper;
        public UserService(IBlobService blobService, IWorkRepo workRepo, IEducationRepo educationRepo,
        UserManager<AppUser> userManager, IGeneralRepo generalRepo, AppDbContext context, IUserRepo userRepo, IMapper mapper)
        {
            _userManager = userManager;
            _blobService = blobService;
            _workRepo=workRepo;
            _educationRepo=educationRepo;
            _generalRepo=generalRepo;
            _context=context;
            _userRepo=userRepo;
            _mapper = mapper;
        }
        public async Task<string> UploadPerImageAsync(string userId, bool IsAvatar, IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new HttpResponseException(400,"No file uploaded.");

            // 1. Upload to Azure Blob
            var blobUrl = await _blobService.UploadFileAsync(file);

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new HttpResponseException(404, "User not found");
            
            if( IsAvatar )
                user.AvatarUrl = blobUrl;
            else
                user.CoverUrl = blobUrl;

                return blobUrl;
        }
        public async Task<Work> AddWork(AddWorkDto dto, string userId)
        {
            if (dto.CompanyName == null && dto.Position == null)
            {
                throw new HttpResponseException(400, "Field empty!");
            }
            var work = new Work
            {
                CompanyName = dto.CompanyName,
                Position = dto.Position,
                IsWorking = dto.IsWorking,
                UserId = userId,
            };
            return await _workRepo.AddAsync(work);
        }

        public async Task<Work> UpdateWork(WorkDto dto, string userId)
        {
            var existing = await _workRepo.GetByIdAsync(dto.Id!);
            if (existing == null)
                throw new HttpResponseException(404, "Instance not found");

            if (existing.UserId != userId)
            {
                throw new HttpResponseException(403, "You don't have permission!");
            }
            existing.CompanyName = dto.CompanyName;
            existing.Position = dto.Position;
            existing.IsWorking = dto.IsWorking;

            await _workRepo.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> RemoveWork(string id, string userId)
        {
            var existing = await _workRepo.GetByIdAsync(id);
            if (existing.UserId != userId)
            {
                throw new HttpResponseException(403, "You don't have permission!");
            }
            if (existing == null) return false;
            return await _workRepo.DeleteAsync(existing);
        }
        public async Task<Education> AddEducation(AddEducationDto dto, string userId)
        {
            if (dto.SchoolName == null && dto.Major == null)
                throw new HttpResponseException(400, "Field empty");
            var education = new Education
            {
                SchoolName = dto.SchoolName,
                Major = dto.Major,
                IsStudying = dto.IsStudying,
                UserId = userId,
            };
            return await _educationRepo.AddAsync(education);
        }

        public async Task<Education> UpdateEducation(EducationDto dto, string userId)
        {
            var existing = await _educationRepo.GetByIdAsync(dto.Id);
            if (existing == null)
                throw new HttpResponseException(404, "Instance not found");
            if (existing.UserId != userId)
            {
                throw new HttpResponseException(403, "You don't have permission!");
            }
            existing.SchoolName = dto.SchoolName;
            existing.Major = dto.Major;
            existing.IsStudying = dto.IsStudying;
            await _educationRepo.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> RemoveEducation(string id, string userId)
        {
            var existing = await _educationRepo.GetByIdAsync(id);
            if (existing == null) return false;
            if (existing.UserId != userId)
            {
                throw new HttpResponseException(403, "You don't have permission!");
            }
            return await _educationRepo.DeleteAsync(existing);
        }
        public async Task<List<Work>> GetAllWorks(string userId)
        {
            return await _workRepo.FindByClause(w => w.UserId == userId);
        }

        public async Task<List<Education>> GetAllEducations(string userId)
        {
            return await _educationRepo.FindByClause(e => e.UserId == userId);
        }

        public async Task<AppUser> UpdateBasicInfo(string userId, UpdateInfoDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new HttpResponseException(404, "User not found");
            if (await _generalRepo.RelationshipTypeExist(dto.RelationshipType))
            {
                await _generalRepo.UpdateRelationshipForUser(userId, dto.RelationshipType);
            }
            if (dto.RelationshipType == null)
                user.RelationshipType = null;
            user.Bio = dto.Bio;
            user.CurrentLocation = dto.CurrentLocation;
            user.HomeTown = dto.HomeTown;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new HttpResponseException(400, string.Join(", ", result.Errors.Select(e => e.Description)));
            return user;
        }
        public async Task<AppUser> GetProfile(string userId)
        {
            var user = await _userRepo.GetProfileAsync(userId);
            if (user == null)
                throw new HttpResponseException(404, "User not found");
            return user;
        }
    }
}
