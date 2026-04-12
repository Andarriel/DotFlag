using DotFlag.DataAccessLayer.Context;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
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
                context.Database.CanConnect();
                return Ok("Database is healthy");
            }
            catch
            {
                return StatusCode(503, "Database is unavailable");
            }
        }
    }
}
