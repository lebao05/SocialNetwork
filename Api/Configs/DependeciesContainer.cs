using BusinessLogic.Services.Implementations;
using BusinessLogic.Services.Interfaces;

namespace Api.Configs
{
    public static class DependeciesContainer
    {
        public static void AddDependencies(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<IAuthService, AuthService>(); 
        }
    }
}
