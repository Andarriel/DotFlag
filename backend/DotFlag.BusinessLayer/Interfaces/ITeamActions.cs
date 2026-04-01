using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.Team;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface ITeamActions
    {
        TeamDto GetById(int id);
        TeamDetailsDto GetTeamDetails(int userId);
        List<TeamDto> GetAll(bool includeInactive = false);

        ActionResponse Join(int userId, JoinTeamDto dto);
        ActionResponse Create(int userId, CreateTeamDto dto);
        ActionResponse Update(int id, UpdateTeamDto dto);
        ActionResponse Disband(int id, int userId, bool isAdmin);
        ActionResponse RegenerateInvite(int teamId, int userId);
        ActionResponse Leave(int teamId, int userId);
    }
}
