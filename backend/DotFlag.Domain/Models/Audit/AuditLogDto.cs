using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Audit
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public int? ActorId { get; set; }
        public string? ActorUsername { get; set; }
        public AuditAction Action { get; set; }
        public string? TargetType { get; set; }
        public int? TargetId { get; set; }
        public string? Metadata { get; set; }
        public string? IpAddress { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
