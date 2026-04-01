using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IUserActions
    {
        UserDto GetById(int id);
        List<UserDto> GetAll();

        ActionResponse Create(CreateUserDto dto);
        ActionResponse Update(int id, UpdateUserDto dto);
        ActionResponse UpdateProfile(int id, UpdateUserProfileDto dto);
        ActionResponse Delete (int id);

    }
}
