using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DotFlag.Api.Extensions;

namespace DotFlag.Api.Controller
{
    [Route("api/challenges/{id}/submit")]
    [ApiController]
    [Authorize]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionActions _submissionActions;

        public SubmissionController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _submissionActions = bl.GetSubmissionActions();
        }

        [HttpPost]
        public IActionResult SubmitFlag(int id, [FromBody] SubmitFlagDto dto)
        {
            int userId = User.GetId();

            var result = _submissionActions.SubmitFlag(id, userId, dto.Flag);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
        
        [HttpGet]
        public IActionResult GetSubmissions(int id)
        {
            int userId = User.GetId();
            var result = _submissionActions.GetByChallenge(id, userId);
            return Ok(result);
        }
    }
}
