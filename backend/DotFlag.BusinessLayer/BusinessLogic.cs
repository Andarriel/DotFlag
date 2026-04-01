using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;

namespace DotFlag.BusinessLayer
{
    public class BusinessLogic
    {
        public IUserActions GetUserActions() => new UserActions();
        public IAuthActions GetAuthActions() => new AuthActions();
        public IChallengeActions GetChallengeActions() => new ChallengeActions();
        public ISubmissionActions GetSubmissionActions() => new SubmissionActions();
    }
}
