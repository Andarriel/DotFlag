using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Audit
{
    public class AuditLogFilterDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public AuditAction? Action { get; set; }
        public int? ActorId { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
