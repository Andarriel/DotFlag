using DotFlag.Domain.Models.Audit;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IAuditActions
    {
        AuditLogPageDto GetAll(AuditLogFilterDto filter);
        ActionResponse DeleteOlderThan(DateTime cutoff);
        ActionResponse DeleteById(int id);
    }
}
