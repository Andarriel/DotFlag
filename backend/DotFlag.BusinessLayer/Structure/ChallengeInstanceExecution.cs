using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Docker;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure
{
    public class ChallengeInstanceExecution : ChallengeInstanceActions, IChallengeInstanceActions
    {
        public Task<(ActionResponse, ChallengeInstanceDto?)> StartInstance(int challengeId, int userId) =>
            StartInstanceExecution(challengeId, userId);

        public Task<ActionResponse> StopInstance(int challengeId, int userId) =>
            StopInstanceExecution(challengeId, userId);

        public ChallengeInstanceDto? GetInstance(int challengeId, int userId) =>
            GetInstanceExecution(challengeId, userId);
    }
}
