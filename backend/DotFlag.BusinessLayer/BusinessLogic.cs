using DotFlag.BusinessLayer.UserActions;

namespace DotFlag.BusinessLayer
{
    public class BusinessLogic
    {
       public IUserActions GetUserActions() => new UserActions.UserActions();
    }
}
