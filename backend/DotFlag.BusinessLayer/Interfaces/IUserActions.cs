using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IUserActions
    {
        UserDto GetById(int id);
        List<UserDto> GetAll();

        ActionResponse Create(CreateUserDto dto);
        ActionResponse Update(int id, UserDto dto);
        ActionResponse Delete (int id);

    }
}
