using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;
using DotFlag.Domain.Settings;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DotFlag.BusinessLayer.Core
{
    public class AuthActions
    {
        protected readonly IMapper _mapper;

        protected AuthActions(IMapper mapper) 
        { 
            _mapper = mapper;
        }

        protected string GenerateToken(UserData user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(JwtSettings.Key));

            var token = new JwtSecurityToken(
                issuer: JwtSettings.Issuer,
                audience: JwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(JwtSettings.ExpireMinutes),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        protected (LoginResponseDto? Data, string? Error) LoginExecution(UserLoginDto dto, string? ipAddress = null)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                AuditLog.Log(null, AuditAction.LoginFailed, "User", user?.Id, $"email={dto.Email}", ipAddress);
                return (null, "Invalid email or password.");
            }

            if (user.IsBanned)
            {
                AuditLog.Log(user.Id, AuditAction.LoginFailed, "User", user.Id, "reason=banned", ipAddress);
                return (null, "Your account has been banned.");
            }

            var token = GenerateToken(user);

            int score = context.Submissions
                .Where(s => s.UserId == user.Id && s.IsCorrect && s.Challenge.IsActive)
                .Sum(s => s.Challenge.CurrentPoints + s.BonusPoints);

            var userDto = _mapper.Map<UserDto>(user);
            userDto.CurrentPoints = score;

            AuditLog.Log(user.Id, AuditAction.LoginSuccess, "User", user.Id, null, ipAddress);

            return (new LoginResponseDto { Token = token, User = userDto }, null);
        }

        protected ActionResponse RegisterExecution(UserRegisterDto dto, string? ipAddress = null)
        {
            using var context = new AppDbContext();

            if (context.Users.Any(u => u.Username == dto.Username))
                return new ActionResponse { IsSuccess = false, Message = "Username already exists." };

            if (context.Users.Any(u => u.Email == dto.Email))
                return new ActionResponse { IsSuccess = false, Message = "Email already exists." };

            var user = _mapper.Map<UserData>(dto);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            context.Users.Add(user);
            context.SaveChanges();

            AuditLog.Log(user.Id, AuditAction.UserRegistered, "User", user.Id, $"username={user.Username}", ipAddress);

            return new ActionResponse { IsSuccess = true, Message = "Registration successful." };
        }
    }
}
