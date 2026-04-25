using DotFlag.Domain.Models.Docker;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IChallengeInstanceActions
    {
        Task<(ActionResponse, ChallengeInstanceDto?)> StartInstance(int challengeId, int userId);
        Task<ActionResponse> StopInstance(int challengeId, int userId);
        ChallengeInstanceDto? GetInstance(int challengeId, int userId);
    }
}
