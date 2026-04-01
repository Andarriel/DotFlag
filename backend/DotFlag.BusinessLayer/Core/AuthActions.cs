using AutoMapper;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;
using DotFlag.Domain.Settings;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DotFlag.BusinessLayer.Core
{
    public class AuthActions : IAuthActions
    {
        private readonly IMapper _mapper;

        public AuthActions(IMapper mapper) 
        { 
            _mapper = mapper;
        }

        private string GenerateToken(UserData user)
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

        public LoginResponseDto? Login(UserLoginDto dto)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return null;

            if (user.IsBanned)
                return null;

            var token = GenerateToken(user);

            int score = context.Submissions
                .Where(s => s.UserId == user.Id && s.IsCorrect && s.Challenge.IsActive)
                .Select(s => s.Challenge.CurrentPoints)
                .Sum();

            var userDto = _mapper.Map<UserDto>(user);
            userDto.CurrentPoints = score;

            return new LoginResponseDto { Token = token, User = userDto };
        }

        public ActionResponse Register(UserRegisterDto dto)
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

            return new ActionResponse { IsSuccess = true, Message = "Registration successful." };
        }
    }
}
