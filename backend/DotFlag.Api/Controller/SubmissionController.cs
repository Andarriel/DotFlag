using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DotFlag.Api.Controller
{
    [Route("api/challenges/{id}/submit")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionActions _submissionActions;

        public SubmissionController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _submissionActions = bl.GetSubmissionActions();
        }

        [HttpPost]
        [Authorize]
        public IActionResult SubmitFlag(int id, [FromBody] SubmitFlagDto dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = _submissionActions.SubmitFlag(id, userId, dto.Flag);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
