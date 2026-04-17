using DotFlag.Api.Filters;
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
        [RequireCtfRunning]
        public IActionResult GetLeaderboard()
        {
            var result = _leaderboardActions.GetLeaderboard();
            return Ok(result);
        }

        [HttpGet("progress")]
        [AllowAnonymous]
        [RequireCtfRunning]
        public IActionResult GetProgress()
        {
            var result = _leaderboardActions.GetProgress();
            return Ok(result);
        }

        [HttpGet("teams/progress")]
        [AllowAnonymous]
        [RequireCtfRunning]
        public IActionResult GetTeamProgress()
        {
            var result = _leaderboardActions.GetTeamProgress();
            return Ok(result);
        }

        [HttpGet("teams")]
        [AllowAnonymous]
        [RequireCtfRunning]
        public IActionResult GetTeamLeaderboard()
        {
            var result = _leaderboardActions.GetTeamLeaderboard();
            return Ok(result);
        }
    }
}
