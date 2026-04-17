using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DotFlag.Api.Extensions;
using DotFlag.Api.Filters;

namespace DotFlag.Api.Controller
{
    [ApiController]
    [Authorize]
    [Route("api/challenges/{id}")]
    public class ChallengeSubmissionController : ControllerBase
    {
        private readonly ISubmissionActions _submissionActions;

        public ChallengeSubmissionController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _submissionActions = bl.GetSubmissionActions();
        }

        [HttpPost("submit")]
        [RequireCtfRunning]
        public IActionResult SubmitFlag(int id, [FromBody] SubmitFlagDto dto)
        {
            int userId = User.GetId();

            var result = _submissionActions.SubmitFlag(id, userId, dto.Flag);
            return Ok(result);
        }
        
        [HttpGet("submissions")]
        [RequireCtfRunning]
        public IActionResult GetSubmissions(int id)
        {
            int userId = User.GetId();
            var result = _submissionActions.GetByChallenge(id, userId);
            return Ok(result);
        }
    }
}