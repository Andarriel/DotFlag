using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;
using DotFlag.Domain.Enums;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IUserActions
    {
        UserProfileDto? GetById(int id);
        List<UserDto> GetAll();
        UserDto? GetMyProfile(int userId);

        ActionResponse Create(CreateUserDto dto);
        ActionResponse Update(int id, UpdateUserDto dto);
        ActionResponse UpdateProfile(int id, UpdateUserProfileDto dto);
        ActionResponse Delete (int id);
        ActionResponse Ban(int id, int currentUserId, UserRole currentUserRole);
        ActionResponse Unban(int id, int currentUserId, UserRole currentUserRole);
        ActionResponse Promote(int id, int currentUserId, UserRole currentUserRole);
        ActionResponse Demote(int id, int currentUserId, UserRole currentUserRole);
    }
}
