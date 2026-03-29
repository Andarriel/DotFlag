using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.UserActions
{
    public interface IUserActions
    {
        UserDto GetById(int id);
        List<UserDto> GetAll();

        ActionResponse Create(UserRegisterDto dto);
        ActionResponse Update(int id, UserDto dto);
        ActionResponse Delete (int id);

    }
}
