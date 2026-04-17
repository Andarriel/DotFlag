using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Audit;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure;

public class AuditExecution : AuditActions, IAuditActions
{
    public AuditExecution(IMapper mapper) : base(mapper) { }

    public AuditLogPageDto GetAll(AuditLogFilterDto filter)
    {
        return GetAllExecution(filter);
    }

    public List<AuditLogDto> GetForExport(AuditLogFilterDto filter)
    {
        return GetForExportExecution(filter);
    }

    public ActionResponse DeleteOlderThan(DateTime cutoff, int actorId)
    {
        return DeleteOlderThanExecution(cutoff, actorId);
    }

    public ActionResponse DeleteById(int id, int actorId)
    {
        return DeleteByIdExecution(id, actorId);
    }
}
