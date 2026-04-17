using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Enums;
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

        protected List<AuditLogDto> GetForExportExecution(AuditLogFilterDto filter)
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

            var rows = query
                .OrderByDescending(a => a.CreatedOn)
                .Take(10000)
                .ToList();

            return rows.Select(a => new AuditLogDto
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
        }

        protected ActionResponse DeleteOlderThanExecution(DateTime cutoff, int actorId)
        {
            using var context = new AppDbContext();

            var cutoffUtc = cutoff.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(cutoff, DateTimeKind.Utc)
                : cutoff.ToUniversalTime();

            var deleted = context.AuditLogs
                .Where(a => a.CreatedOn < cutoffUtc)
                .ExecuteDelete();

            AuditLog.Log(actorId, AuditAction.SystemCleanup, "AuditLog", null,
                $"op=deleteOlderThan;cutoff={cutoffUtc:O};deleted={deleted}");

            return new ActionResponse
            {
                IsSuccess = true,
                Message = $"Deleted {deleted} audit log {(deleted == 1 ? "entry" : "entries")} older than {cutoffUtc:yyyy-MM-dd HH:mm} UTC."
            };
        }

        protected ActionResponse DeleteByIdExecution(int id, int actorId)
        {
            using var context = new AppDbContext();

            var entry = context.AuditLogs.FirstOrDefault(a => a.Id == id);
            if (entry == null)
                return new ActionResponse { IsSuccess = false, Message = "Audit log entry not found." };

            var snapshot = $"targetAction={entry.Action};targetCreatedOn={entry.CreatedOn:O}";

            context.AuditLogs.Remove(entry);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.SystemCleanup, "AuditLog", id,
                $"op=deleteById;{snapshot}");

            return new ActionResponse { IsSuccess = true, Message = "Audit log entry deleted." };
        }
    }
}
