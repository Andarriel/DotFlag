using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;
using DotFlag.Domain.Enums;
using System.Runtime.InteropServices;

namespace DotFlag.BusinessLayer.Core
{
    public class UserActions
    {
        protected readonly IMapper _mapper;

        protected UserActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected UserProfileDto GetByIdExecution(int id)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return null;

            int score = context.Submissions
                .Where(s => s.UserId == id && s.IsCorrect && s.Challenge.IsActive)
                .Select(s => s.Challenge.CurrentPoints)
                .Sum();

            var dto = _mapper.Map<UserProfileDto>(user);
            dto.CurrentPoints = score;
            return dto;
        }

        protected UserDto GetMyProfileExecution(int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return null;

            int score = context.Submissions
                .Where(s => s.UserId == userId && s.IsCorrect && s.Challenge.IsActive)
                .Select(s => s.Challenge.CurrentPoints)
                .Sum();

            var dto = _mapper.Map<UserDto>(user);
            dto.CurrentPoints = score;
            return dto;
        }

        protected List<UserDto> GetAllExecution()
        {
            using var context = new AppDbContext();

            var users = context.Users.ToList();

            var scores = context.Submissions
                .Where(s => s.IsCorrect && s.Challenge.IsActive)
                .GroupBy(s => s.UserId)
                .Select(g => new { UserId = g.Key, Score = g.Sum(s => s.Challenge.CurrentPoints) })
                .ToDictionary(x => x.UserId, x => x.Score);

            return users.Select(u =>
            {
                var dto = _mapper.Map<UserDto>(u);
                dto.CurrentPoints = scores.GetValueOrDefault(u.Id, 0);
                return dto;
            }).ToList();
        }

        protected ActionResponse CreateExecution(CreateUserDto dto)
        {
            using var context = new AppDbContext();

            var user = _mapper.Map<UserData>(dto);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.RegisteredOn = DateTime.UtcNow;

            context.Users.Add(user);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User created successfully." };
        }

        protected ActionResponse UpdateExecution(int id, UpdateUserDto dto)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Role = dto.Role;

            if (!string.IsNullOrEmpty(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User updated successfully." };
        }

        protected ActionResponse DeleteExecution(int id)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            context.Users.Remove(user);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User deleted successfully." };
        }

        protected ActionResponse UpdateProfileExecution(int id, UpdateUserProfileDto dto)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return new ActionResponse { IsSuccess = false, Message = "Current password is incorrect." };

            user.Username = dto.Username;
            user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.NewPassword))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Profile updated successfully." };
        }

        protected ActionResponse BanExecution(int id, int currentUserId, UserRole currentUserRole)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (id == currentUserId)
                return new ActionResponse { IsSuccess = false, Message = "You cannot ban yourself." };

            if (user.Role >= currentUserRole)
                return new ActionResponse { IsSuccess = false, Message = "You cannot ban a user with equal or higher role." };

            if (user.IsBanned)
                return new ActionResponse { IsSuccess = true, Message = "User is already banned." };

            user.IsBanned = true;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User banned successfully." };
        }

        protected ActionResponse UnbanExecution(int id, int currentUserId, UserRole currentUserRole)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (id == currentUserId)
                return new ActionResponse { IsSuccess = false, Message = "You cannot unban yourself." };

            if (user.Role >= currentUserRole)
                return new ActionResponse { IsSuccess = false, Message = "You cannot unban a User with equal or higher role." };

            if (!user.IsBanned)
                return new ActionResponse { IsSuccess = true, Message = "User is not banned." };

            user.IsBanned = false;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User unbanned successfully." };
        }

        protected ActionResponse PromoteExecution(int id, int currentUserId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (id == currentUserId)
                return new ActionResponse { IsSuccess = false, Message = "You cannot promote yourself." };

            if (user.Role == UserRole.Admin)
                return new ActionResponse { IsSuccess = true, Message = "User is already an Admin." };
            if (user.Role == UserRole.Owner)
                return new ActionResponse { IsSuccess = false, Message = "Cannot promote Owner." };

            user.Role = UserRole.Admin;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User promoted to Admin successfully." };
        }

        protected ActionResponse DemoteExecution(int id, int currentUserId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (id == currentUserId)
                return new ActionResponse { IsSuccess = false, Message = "You cannot demote yourself." };

            if (user.Role == UserRole.User)
                return new ActionResponse { IsSuccess = true, Message = "User is already a regular User." };

            if (user.Role == UserRole.Owner)
                return new ActionResponse { IsSuccess = false, Message = "Cannot demote Owner." };

            user.Role = UserRole.User;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User demoted to regular User successfully." };
        }
    }
}
