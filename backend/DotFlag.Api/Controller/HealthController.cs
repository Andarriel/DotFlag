using DotFlag.Api.Services;
using DotFlag.DataAccessLayer.Context;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly SystemStatusService _statusService;
        public HealthController(SystemStatusService statusService) => _statusService = statusService;
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is healthy");
        }

        [HttpGet("db")]
        public IActionResult GetDb()
        {
            try
            {
                using var context = new AppDbContext();
                if (!context.Database.CanConnect())
                    return StatusCode(503, "Database is unavailable");
                return Ok("Database is healthy");
            }
            catch
            {
                return StatusCode(503, "Database is unavailable");
            }
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            var s = _statusService.Latest;
            return Ok(new
            {
                db = new { online = s?.DbOnline ?? false, latencyMs = s?.DbLatencyMs },
                docker = new { online = s?.DockerOnline ?? false, latencyMs = s?.DockerLatencyMs },
            });
        }
    }
}
