using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Structure;

public class UserExecution : UserActions, IUserActions
{
    public UserExecution(IMapper mapper) : base(mapper) {}

    public UserProfileDto GetById(int id)
    {
        return GetByIdExecution(id);
    }

    public List<UserDto> GetAll()
    {
        return GetAllExecution();
    }

    public UserDto GetMyProfile(int userId)
    {
        return GetMyProfileExecution(userId);
    }

    public ActionResponse Create(CreateUserDto dto)
    {
        return CreateExecution(dto);
    }

    public ActionResponse Update(int id, UpdateUserDto dto)
    {
        return UpdateExecution(id, dto);
    }

    public ActionResponse UpdateProfile(int id, UpdateUserProfileDto dto)
    {
        return UpdateProfileExecution(id, dto);
    }

    public ActionResponse Delete(int id)
    {
        return DeleteExecution(id);
    }

    public ActionResponse Ban(int id, int currentUserId, UserRole currentUserRole)
    {
        return BanExecution(id, currentUserId, currentUserRole);
    }

    public ActionResponse Unban(int id, int currentUserId, UserRole currentUserRole)
    {
        return  UnbanExecution(id, currentUserId, currentUserRole);
    }

    public ActionResponse Promote(int id, int currentUserId)
    {
        return PromoteExecution(id, currentUserId);
    }

    public ActionResponse Demote(int id, int currentUserId)
    {
        return DemoteExecution(id, currentUserId);
    }
}