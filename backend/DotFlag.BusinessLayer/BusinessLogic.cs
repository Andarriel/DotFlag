using DotFlag.BusinessLayer.UserActions;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.BusinessLayer.Core;

namespace DotFlag.BusinessLayer
{
    public class BusinessLogic
    {
       public IUserActions GetUserActions() => new UserActions.UserActions();
       public IChallengeActions GetChallengeActions() => new ChallengeActions();
    }
}
