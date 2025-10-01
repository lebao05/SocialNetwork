using Api.SignalR;
using API.SignalR;
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
        public static void AddDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            //Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IBlobService, BlobService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFriendService, FriendService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddSingleton<IPresenceTracker, PresenceTracker>();

            //Repositories
            services.AddScoped<IFriendShipRepo, FriendShipRepo>();
            services.AddScoped<IFriendReqRepo, FriendReqRepo>();
            services.AddScoped<IEducationRepo, EducationRepo>();
            services.AddScoped<IEducationRepo, EducationRepo>();
            services.AddScoped<IWorkRepo, WorkRepo>();
            services.AddScoped<IUserRepo, UserRepo>();
            services.AddScoped<IConversationRepo, ConversationRepo>();
            services.AddScoped<IMessageRepo, MessageRepo>();
            services.AddScoped<IUserMessageRepo, UserMessageRepo>();
            services.AddScoped<IConversationRepo, ConversationRepo>();
            services.AddScoped<IConversationMemberRepo, ConversationMemberRepo>();

            services.AddSignalR();
            //Helpers
            services.AddScoped<IGeneralRepo, GeneralRepo>();


        }
    }
}
