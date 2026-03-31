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
            using var context = new AppDbContext();
            var user = context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                CurrentPoints = user.CurrentPoints,
                Role = user.Role
            };
        }

        public List<UserDto> GetAll()
        { 
            using var context = new AppDbContext();
            return context.Users.Select(user => new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                CurrentPoints = user.CurrentPoints,
                Role = user.Role
            }).ToList();
        }
        
        public ActionResponse Create(UserRegisterDto dto)
        {
            using var context = new AppDbContext();
            var user = new UserData
            {
                Username = dto.Username,
                Email = dto.Email,
                // TODO: Hashing aici
                PasswordHash = dto.Password,
                RegisteredOn = DateTime.UtcNow
            };
            context.Users.Add(user);
            context.SaveChanges();
            return new ActionResponse { IsSuccess = true, Message = "User created successfully." };
        }
      
        public ActionResponse Update(int id, UserDto dto)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return new ActionResponse { IsSuccess = false, Message = "User not found." };
            }

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Role = dto.Role;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "User updated successfully." };

        }

        public ActionResponse Delete(int id)
        {
            using var context = new AppDbContext();

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
}
