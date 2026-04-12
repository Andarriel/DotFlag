using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.Submission;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface ISubmissionActions
    {
        ActionResponse SubmitFlag(int challengeId, int userId, string flag);
        List<SubmissionDto> GetByChallenge(int challengeId, int userId);
        List<SubmissionDto> GetRecent(int count);
        List<SubmissionDto> GetByUser(int userId);
        List<SubmissionDto> GetByUserId(int userId);
    }
}
