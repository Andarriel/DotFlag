using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IAuthActions
    {
        ActionResponse Register(UserRegisterDto dto);
        (LoginResponseDto? Data, string? Error) Login(UserLoginDto dto);
    }
}
