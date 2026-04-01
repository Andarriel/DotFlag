using AutoMapper;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Core
{
    public class UserActions : IUserActions
    {
        private readonly IMapper _mapper;

        public UserActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        public UserDto GetById(int id)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null) 
                return null;

            int score = context.Submissions
                .Where(s => s.UserId == id && s.IsCorrect && s.Challenge.IsActive)
                .Select(s => s.Challenge.CurrentPoints)
                .Sum();

            var dto = _mapper.Map<UserDto>(user);
            dto.CurrentPoints = score;
            return dto;
        }

        public List<UserDto> GetAll()
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

        public ActionResponse Create(CreateUserDto dto)
        {
            using var context = new AppDbContext();

            var user = _mapper.Map<UserData>(dto);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.RegisteredOn = DateTime.UtcNow;

            context.Users.Add(user);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User created successfully." };
        }

        public ActionResponse Update(int id, UpdateUserDto dto)
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

        public ActionResponse Delete(int id)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            context.Users.Remove(user);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User deleted successfully." };
        }

        public ActionResponse UpdateProfile(int id, UpdateUserProfileDto dto)
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
    }
}
