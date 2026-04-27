using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Badge
{
    public class BadgeDto
    {
        public int Id { get; set; }
        public BadgeType Type { get; set; }
        public int? CtfEventId { get; set; }
        public string? CtfEventName { get; set; }
        public int? Placement { get; set; }
        public int? Points { get; set; }
        public string? CustomName { get; set; }
        public string? CustomColor { get; set; }
        public string? CustomIcon { get; set; }
        public string? Note { get; set; }
        public bool IsManuallyAwarded { get; set; }
        public DateTime AwardedAt { get; set; }
        public List<FirstBloodBreakdownDto>? FirstBloodBreakdown { get; set; }
    }

    public class FirstBloodBreakdownDto
    {
        public string CtfEventName { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
