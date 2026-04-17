using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IAuthActions
    {
        ActionResponse Register(UserRegisterDto dto, string? ipAddress = null);
        (LoginResponseDto? Data, string? Error) Login(UserLoginDto dto, string? ipAddress = null);
    }
}
