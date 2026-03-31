using DotFlag.BusinessLayer.Interfaces;
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
    public class AuthActions : IAuthActions
    {
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
            using (var context = new AppDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Email == dto.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                    return null;

                if (user.IsBanned)
                    return null;

                var token = GenerateToken(user);

                return new LoginResponseDto
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.Role,
                        CurrentPoints = user.CurrentPoints
                    }
                };
            }
        }

        public ActionResponse Register(UserRegisterDto dto)
        {
            using (var context = new AppDbContext())
            {
                if (context.Users.Any(u => u.Username == dto.Username))
                    return new ActionResponse { IsSuccess = false, Message = "Username already exists." };

                if (context.Users.Any(u => u.Email == dto.Email))
                    return new ActionResponse { IsSuccess = false, Message = "Email already exists." };

                var user = new UserData
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = UserRole.User,
                    CurrentPoints = 0,
                    RegisteredOn = DateTime.UtcNow,
                    IsBanned = false
                };

                context.Users.Add(user);
                context.SaveChanges();
            }

            return new ActionResponse { IsSuccess = true, Message = "Registration successful." };
        }
    }
}
