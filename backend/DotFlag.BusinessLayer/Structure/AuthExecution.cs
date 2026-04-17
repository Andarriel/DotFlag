using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Structure;

public class AuthExecution : AuthActions, IAuthActions
{
    public AuthExecution(IMapper mapper) : base(mapper) {}

    public ActionResponse Register(UserRegisterDto dto)
    {
        return RegisterExecution(dto);
    }

    public (LoginResponseDto? Data, string? Error) Login(UserLoginDto dto, string? ipAddress = null)
    {
        return LoginExecution(dto, ipAddress);
    }
}