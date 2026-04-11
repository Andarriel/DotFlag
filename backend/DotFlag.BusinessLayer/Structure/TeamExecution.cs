using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.Team;

namespace DotFlag.BusinessLayer.Structure;

public class TeamExecution : TeamActions, ITeamActions
{
    public TeamExecution(IMapper mapper) : base(mapper) {}

    public TeamDto GetById(int id)
    {
        return GetByIdExecution(id);
    }

    public TeamDetailsDto GetTeamDetails(int userId)
    {
        return GetTeamDetailsExecution(userId);
    }

    public List<TeamDto> GetAll(bool includeInactive)
    {
        return  GetAllExecution(includeInactive);
    }

    public ActionResponse Join(int userId, JoinTeamDto dto)
    {
        return JoinExecution(userId, dto);
    }

    public ActionResponse Create(int userId, CreateTeamDto dto)
    {
        return CreateExecution(userId, dto);
    }

    public ActionResponse Update(int userId, UpdateTeamDto dto)
    {
        return UpdateExecution(userId, dto);
    }

    public ActionResponse Disband(int id, int userId, bool isAdmin)
    {
        return DisbandExecution(id, userId, isAdmin);
    }

    public ActionResponse RegenerateInvite(int teamId, int userId)
    {
        return  RegenerateInviteExecution(teamId, userId);
    }

    public ActionResponse Leave(int teamId, int userId)
    {
        return LeaveExecution(teamId, userId);
    }
}