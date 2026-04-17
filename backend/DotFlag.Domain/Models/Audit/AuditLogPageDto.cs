namespace DotFlag.Domain.Models.Audit
{
    public class AuditLogPageDto
    {
        public List<AuditLogDto> Items { get; set; } = new();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
