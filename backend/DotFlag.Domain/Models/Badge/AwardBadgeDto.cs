using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Badge
{
    public class AwardBadgeDto
    {
        public int UserId { get; set; }
        public BadgeType Type { get; set; }
        public int? CtfEventId { get; set; }
        public string? CustomName { get; set; }
        public string? CustomColor { get; set; }
        public string? CustomIcon { get; set; }
        public string? Note { get; set; }
        public bool IsManuallyAwarded { get; set; } = true;
    }
}
