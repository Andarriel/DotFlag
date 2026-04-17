using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Models.Audit;
using DotFlag.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.BusinessLayer.Core
{
    public class AuditActions
    {
        protected readonly IMapper _mapper;

        protected AuditActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected AuditLogPageDto GetAllExecution(AuditLogFilterDto filter)
        {
            using var context = new AppDbContext();

            var query = context.AuditLogs
                .Include(a => a.Actor)
                .AsQueryable();

            if (filter.Action.HasValue)
                query = query.Where(a => a.Action == filter.Action.Value);

            if (filter.ActorId.HasValue)
                query = query.Where(a => a.ActorId == filter.ActorId.Value);

            if (filter.From.HasValue)
                query = query.Where(a => a.CreatedOn >= filter.From.Value);

            if (filter.To.HasValue)
                query = query.Where(a => a.CreatedOn <= filter.To.Value);

            var total = query.Count();

            var page = Math.Max(filter.Page, 1);
            var pageSize = Math.Clamp(filter.PageSize, 1, 200);

            var rows = query
                .OrderByDescending(a => a.CreatedOn)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var items = rows.Select(a => new AuditLogDto
            {
                Id = a.Id,
                ActorId = a.ActorId,
                ActorUsername = a.Actor?.Username,
                Action = a.Action,
                TargetType = a.TargetType,
                TargetId = a.TargetId,
                Metadata = a.Metadata,
                IpAddress = a.IpAddress,
                CreatedOn = a.CreatedOn
            }).ToList();

            return new AuditLogPageDto
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };
        }

        protected ActionResponse DeleteOlderThanExecution(DateTime cutoff)
        {
            using var context = new AppDbContext();

            var deleted = context.AuditLogs
                .Where(a => a.CreatedOn < cutoff)
                .ExecuteDelete();

            return new ActionResponse
            {
                IsSuccess = true,
                Message = $"Deleted {deleted} audit log entries older than {cutoff:O}."
            };
        }

        protected ActionResponse DeleteByIdExecution(int id)
        {
            using var context = new AppDbContext();

            var entry = context.AuditLogs.FirstOrDefault(a => a.Id == id);
            if (entry == null)
                return new ActionResponse { IsSuccess = false, Message = "Audit log entry not found." };

            context.AuditLogs.Remove(entry);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Audit log entry deleted." };
        }
    }
}
