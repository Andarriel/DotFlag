using System.Globalization;
using System.Text;
using DotFlag.Api.Extensions;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Audit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/admin/logs")]
    [ApiController]
    [Authorize(Roles = "Admin,Owner")]
    public class AuditController : ControllerBase
    {
        private readonly IAuditActions _auditActions;

        public AuditController()
        {
            var bl = new BusinessLogic();
            _auditActions = bl.GetAuditActions();
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] AuditLogFilterDto filter)
        {
            var result = _auditActions.GetAll(filter);
            return Ok(result);
        }

        [HttpGet("export")]
        public IActionResult Export([FromQuery] AuditLogFilterDto filter)
        {
            var rows = _auditActions.GetForExport(filter);

            var sb = new StringBuilder();
            sb.AppendLine("Id,CreatedOn,ActorId,ActorUsername,Action,TargetType,TargetId,IpAddress,Metadata");
            foreach (var r in rows)
            {
                sb.Append(r.Id).Append(',')
                  .Append(r.CreatedOn.ToString("O", CultureInfo.InvariantCulture)).Append(',')
                  .Append(r.ActorId?.ToString(CultureInfo.InvariantCulture)).Append(',')
                  .Append(Csv(r.ActorUsername)).Append(',')
                  .Append(r.Action).Append(',')
                  .Append(Csv(r.TargetType)).Append(',')
                  .Append(r.TargetId?.ToString(CultureInfo.InvariantCulture)).Append(',')
                  .Append(Csv(r.IpAddress)).Append(',')
                  .Append(Csv(r.Metadata)).AppendLine();
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var fileName = $"audit-logs-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
            return File(bytes, "text/csv", fileName);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner")]
        public IActionResult Delete(int id)
        {
            var result = _auditActions.DeleteById(id, User.GetId());
            if (!result.IsSuccess)
                return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("older-than")]
        [Authorize(Roles = "Owner")]
        public IActionResult DeleteOlderThan([FromQuery] DateTime cutoff)
        {
            var result = _auditActions.DeleteOlderThan(cutoff, User.GetId());
            return Ok(result);
        }

        private static string Csv(string? value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
                return "\"" + value.Replace("\"", "\"\"") + "\"";
            return value;
        }
    }
}
