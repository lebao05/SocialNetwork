namespace BusinessLogic.DTOs.User
{
    public class AuthResponseDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AvatarUrl {  get; set; } = string.Empty;
        public string CoverUrl {  get; set; } = string.Empty;

    }
}
