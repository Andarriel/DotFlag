using DotFlag.Api.Extensions;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/challenges/{challengeId}/instance")]
    [ApiController]
    [Authorize]
    public class ChallengeInstanceController : ControllerBase
    {
        private readonly IChallengeInstanceActions _instanceActions;

        public ChallengeInstanceController()
        {
            var bl = new BusinessLogic();
            _instanceActions = bl.GetChallengeInstanceActions();
        }

        [HttpGet]
        public IActionResult GetInstance(int challengeId)
        {
            var result = _instanceActions.GetInstance(challengeId, User.GetId());
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> StartInstance(int challengeId)
        {
            var (response, dto) = await _instanceActions.StartInstance(challengeId, User.GetId());
            if (!response.IsSuccess)
                return BadRequest(response);
            return Ok(dto);
        }

        [HttpDelete]
        public async Task<IActionResult> StopInstance(int challengeId)
        {
            var response = await _instanceActions.StopInstance(challengeId, User.GetId());
            if (!response.IsSuccess)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("restart")]
        public async Task<IActionResult> RestartInstance(int challengeId)
        {
            var response = await _instanceActions.RestartInstance(challengeId, User.GetId());
            if (!response.IsSuccess)
                return BadRequest(response);
            return Ok(response);
        }
    }
}
