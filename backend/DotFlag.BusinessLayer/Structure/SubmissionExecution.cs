using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.Submission;

namespace DotFlag.BusinessLayer.Structure;

public class SubmissionExecution : SubmissionActions, ISubmissionActions
{
    public SubmissionExecution(IMapper mapper) : base(mapper) {}
    
    public ActionResponse SubmitFlag(int challengeId, int userId, string flag)
    {
        return SubmitFlagExecution(challengeId, userId, flag);
    }

    public List<SubmissionDto> GetByChallenge(int challengeId, int userId)
    {
        return GetByChallengeExecution(challengeId, userId);
    }

    public List<SubmissionDto> GetRecent(int count)
    {
        return GetRecentExecution(count);
    }

    public List<SubmissionDto> GetByUser(int userId)
    {
        return GetByUserExecution(userId);
    }
}