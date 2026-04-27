using DotFlag.Domain.Entities.CtfEvent;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Badge
{
    public class UserBadgeData
    {
        [Key][DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserData User { get; set; } = null!;
        public BadgeType Type { get; set; }
        public int? CtfEventId { get; set; }
        public CtfEventData? CtfEvent { get; set; }
        public int? Placement { get; set; }
        public int? Points { get; set; }
        public string? CustomName { get; set; }
        public string? CustomColor { get; set; }
        public string? CustomIcon { get; set; }
        public string? Note { get; set; }
        public bool IsManuallyAwarded { get; set; } = false;
        public int? AwardedByUserId { get; set; }
        public DateTime AwardedAt { get; set; } = DateTime.UtcNow;
    }
}
