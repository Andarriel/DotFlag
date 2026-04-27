using DotFlag.Domain.Models.Badge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IBadgeActions
    {
        List<BadgeDto> GetForUser(int userId);
        ActionResponse Award(AwardBadgeDto dto, int actorId);
        ActionResponse Revoke(int badgeId, int actorId);
    }
}
