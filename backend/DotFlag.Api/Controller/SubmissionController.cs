using DotFlag.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DotFlag.Api.Extensions;
using DotFlag.Api.Filters;

namespace DotFlag.Api.Controller
{
    [ApiController]
    [Authorize]
    [Route("api/submissions")]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionActions _submissionActions;

        public SubmissionController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _submissionActions = bl.GetSubmissionActions();
        }

        [HttpGet]
        [Route("recent")]
        [RequireCtfRunning]
        public IActionResult GetRecentSubmissions([FromQuery] int count = 20)
        {
            var result = _submissionActions.GetRecent(count);

            return Ok(result);
        }

        [HttpGet]
        [Route("my")]
        [RequireCtfRunning]
        public IActionResult GetSubmissions()
        {
            int userId = User.GetId();

            var result = _submissionActions.GetByUser(userId);

            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        [RequireCtfRunning]
        public IActionResult GetByUserId(int userId)
        {
            var result = _submissionActions.GetByUserId(userId);
            return Ok(result);
        }

    }
}
