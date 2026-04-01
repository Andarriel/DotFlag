using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.User;
using DotFlag.BusinessLayer.Interfaces;

namespace DotFlag.BusinessLayer.Core
{
    public class UserActions : IUserActions
    {
        public UserDto GetById(int id)
        {
            using (var context = new AppDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                    return null;

                return new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username,
                    CurrentPoints = user.CurrentPoints,
                    Role = user.Role
                };
            }
        }

        public List<UserDto> GetAll()
        {
            using (var context = new AppDbContext())
            {
                return context.Users.Select
                    (user => new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Username = user.Username,
                        CurrentPoints = user.CurrentPoints,
                        Role = user.Role
                    }
                    ).ToList();
            }
        }

        public ActionResponse Create(CreateUserDto dto)
        {
            using (var context = new AppDbContext())
            {
                var user = new UserData
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = dto.Role,
                    RegisteredOn = DateTime.UtcNow
                };

                context.Users.Add(user);
                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "User created successfully." };
            }
        }

        public ActionResponse Update(int id, UpdateUserDto dto)
        {
            using (var context = new AppDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return new ActionResponse { IsSuccess = false, Message = "User not found." };
                }

                user.Username = dto.Username;
                user.Email = dto.Email;
                user.Role = dto.Role;

                if (!string.IsNullOrEmpty(dto.Password))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                }

                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "User updated successfully." };
            }
        }

        public ActionResponse Delete(int id)
        {
            using (var context = new AppDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return new ActionResponse { IsSuccess = false, Message = "User not found." };
                }

                context.Users.Remove(user);
                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "User deleted successfully." };
            }
        }

        public ActionResponse UpdateProfile(int id, UpdateUserProfileDto dto)
        {
            using (var context = new AppDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                    return new ActionResponse { IsSuccess = false, Message = "User not found." };

                if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                {
                    return new ActionResponse { IsSuccess = false, Message = "Current password is incorrect." };
                }

                user.Username = dto.Username;
                user.Email = dto.Email;

                if (!string.IsNullOrEmpty(dto.NewPassword))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
                }

                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "Profile updated successfully." };
            }
        }
    }
}
