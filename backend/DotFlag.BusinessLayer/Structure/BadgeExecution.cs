using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Badge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure
{
    public class BadgeExecution : BadgeActions, IBadgeActions
    {
        public List<BadgeDto> GetForUser(int userId) => GetForUserExecution(userId);
        public ActionResponse Award(AwardBadgeDto dto, int actorId) => AwardExecution(dto, actorId);
        public ActionResponse Revoke(int badgeId, int actorId) => RevokeExecution(badgeId, actorId);
    }
}
