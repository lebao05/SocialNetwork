using AutoMapper;
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
        }
    }
}
