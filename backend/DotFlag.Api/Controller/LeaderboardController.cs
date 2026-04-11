using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/leaderboard")]
    [ApiController]
    [Authorize]
    public class LeaderboardController : ControllerBase
    {
        private readonly ILeaderboardActions _leaderboardActions;

        public LeaderboardController()
        {
            var bl = new BusinessLogic();
            _leaderboardActions = bl.GetLeaderboardActions();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetLeaderboard()
        {
            var result = _leaderboardActions.GetLeaderboard();
            return Ok(result);
        }
    }
}
