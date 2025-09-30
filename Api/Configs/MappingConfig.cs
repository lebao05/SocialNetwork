using AutoMapper;
using BusinessLogic.DTOs.EducationWork;
using BusinessLogic.DTOs.Friend;
using BusinessLogic.DTOs.User;
using DataAccess.Entities;

namespace Api.Configs
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<LoginDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<AppUser, AuthResponseDto>().ReverseMap();
            CreateMap<UserDto, AppUser>().ReverseMap();
            CreateMap<AppUser, UpdateInfoResponseDto>().ReverseMap();

            CreateMap<FriendShip, FriendShipDto>().ReverseMap();
            CreateMap<FriendRequest, FriendRequestDto>().ReverseMap();

            CreateMap<WorkDto, Work>().ReverseMap();
            CreateMap<EducationDto, Education>().ReverseMap();


            

        }
    }
}
