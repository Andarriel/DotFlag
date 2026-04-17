using DotFlag.BusinessLayer;
using DotFlag.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DotFlag.Api.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public class RequireCtfRunningAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (user.IsInRole("Admin") || user.IsInRole("Owner"))
                return;

            var bl = new BusinessLogic();
            var state = bl.GetCtfEventActions().Get().State;

            if (state != CtfState.Running)
            {
                context.Result = new ObjectResult(new
                {
                    isSuccess = false,
                    message = $"CTF is {state}, action not allowed"
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }
    }
}
