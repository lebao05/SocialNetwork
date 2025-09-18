using BusinessLogic.Services.Implementations;
using BusinessLogic.Services.Interfaces;
using DataAccess.Repositories.Implementations;
using DataAccess.Repositories.Interfaces;
using Shared.Services.Implementations;
using Shared.Services.Interfaces;

namespace Api.Configs
{
    public static class DependeciesContainer
    {
        public static void AddDependencies(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            //Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IBlobService, BlobService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFriendService, FriendService>();

            //Repositories
            services.AddScoped<IPersonalImageRepo,PersonalImageRepo>();
            services.AddScoped<IFriendShipRepo,FriendShipRepo>();
            services.AddScoped<IFriendReqRepo,FriendReqRepo>();
        }
    }
}
