using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Audit;
using DotFlag.Domain.Enums;

namespace DotFlag.BusinessLayer.Core
{
    public static class AuditLog
    {
        public static void Log(
            int? actorId,
            AuditAction action,
            string? targetType = null,
            int? targetId = null,
            string? metadata = null,
            string? ipAddress = null)
        {
            var entry = new AuditLogData
            {
                ActorId = actorId,
                Action = action,
                TargetType = targetType,
                TargetId = targetId,
                Metadata = metadata,
                IpAddress = ipAddress,
                CreatedOn = DateTime.UtcNow
            };

            _ = Task.Run(() =>
            {
                try
                {
                    using var context = new AppDbContext();
                    context.AuditLogs.Add(entry);
                    context.SaveChanges();
                }
                catch
                {
                }
            });
        }
    }
}
