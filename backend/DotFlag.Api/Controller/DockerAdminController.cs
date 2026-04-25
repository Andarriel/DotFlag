using DotFlag.Api.Extensions;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Docker;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/admin/docker")]
    [ApiController]
    [Authorize(Roles = "Admin,Owner")]
    public class DockerAdminController : ControllerBase
    {
        private readonly IDockerAdminActions _dockerAdmin;

        public DockerAdminController()
        {
            var bl = new BusinessLogic();
            _dockerAdmin = bl.GetDockerAdminActions();
        }

        [HttpGet("containers")]
        public IActionResult GetContainers()
        {
            return Ok(_dockerAdmin.GetAllInstances());
        }

        [HttpDelete("containers/{instanceId}")]
        public async Task<IActionResult> KillContainer(int instanceId)
        {
            var result = await _dockerAdmin.KillInstance(instanceId);
            if (!result.IsSuccess)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("containers/{instanceId}/restart")]
        public async Task<IActionResult> RestartContainer(int instanceId)
        {
            var result = await _dockerAdmin.RestartInstance(instanceId);
            if (!result.IsSuccess)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("containers/{instanceId}/logs")]
        public async Task<IActionResult> GetLogs(int instanceId)
        {
            var (response, logs) = await _dockerAdmin.GetLogs(instanceId);
            if (!response.IsSuccess)
                return BadRequest(response);
            return Ok(new { logs });
        }

        [HttpGet("settings")]
        public IActionResult GetSettings()
        {
            return Ok(_dockerAdmin.GetSettings());
        }

        [HttpPut("settings")]
        [Authorize(Roles = "Owner")]
        public IActionResult UpdateSettings([FromBody] UpdateDockerSettingsDto dto)
        {
            var result = _dockerAdmin.UpdateSettings(dto);
            if (!result.IsSuccess)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
