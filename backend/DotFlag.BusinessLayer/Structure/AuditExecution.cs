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

    public ActionResponse DeleteOlderThan(DateTime cutoff)
    {
        return DeleteOlderThanExecution(cutoff);
    }

    public ActionResponse DeleteById(int id)
    {
        return DeleteByIdExecution(id);
    }
}
