using System.Security.Claims;
using DotFlag.Domain.Enums;

namespace DotFlag.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static UserRole GetRole(this ClaimsPrincipal user)
    {
        var role = user.FindFirst(ClaimTypes.Role)?.Value;
        return Enum.TryParse<UserRole>(role, out var parsed) ? parsed : UserRole.User;
    }
    
    public static int GetId(this ClaimsPrincipal user) =>
        int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    
}