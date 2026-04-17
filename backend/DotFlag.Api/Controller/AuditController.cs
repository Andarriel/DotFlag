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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner")]
        public IActionResult Delete(int id)
        {
            var result = _auditActions.DeleteById(id);
            if (!result.IsSuccess)
                return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("older-than")]
        [Authorize(Roles = "Owner")]
        public IActionResult DeleteOlderThan([FromQuery] DateTime cutoff)
        {
            var result = _auditActions.DeleteOlderThan(cutoff);
            return Ok(result);
        }
    }
}
