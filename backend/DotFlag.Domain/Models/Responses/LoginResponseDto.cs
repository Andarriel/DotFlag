using DotFlag.Domain.Models.User;

namespace DotFlag.Domain.Models.Responses
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; }
    }
}
