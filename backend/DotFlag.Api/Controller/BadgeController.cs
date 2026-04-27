using DotFlag.Api.Extensions;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Badge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/badges")]
    [ApiController]
    public class BadgeController : ControllerBase
    {
        private IBadgeActions _badgeActions;

        public BadgeController()
        {
            var bl = new BusinessLogic();
            _badgeActions = bl.GetBadgeActions();
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        public IActionResult GetForUser(int userId)
        {
            var result = _badgeActions.GetForUser(userId);
            return Ok(result);
        }

        [HttpPost("award")]
        [Authorize(Roles = "Owner")]
        public IActionResult Award([FromBody] AwardBadgeDto dto)
        {
            var result = _badgeActions.Award(dto, User.GetId());
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner")]
        public IActionResult Revoke(int id)
        {
            var result = _badgeActions.Revoke(id, User.GetId());
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }
    }
}
