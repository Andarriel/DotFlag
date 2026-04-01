using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface ISubmissionActions
    {
        ActionResponse SubmitFlag(int challengeId, int userId, string flag);
    }
}
