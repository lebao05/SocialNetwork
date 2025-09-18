using AutoMapper;
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
            CreateMap<AppUser, AuthResponseDto>();

            CreateMap<FriendShip,FriendShipDto>();
            CreateMap<FriendRequest,FriendRequestDto>();
        }
    }
}
