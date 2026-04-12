using DotFlag.Api.Extensions;
using Microsoft.AspNetCore.Mvc;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;
using Microsoft.AspNetCore.Authorization;

namespace DotFlag.Api.Controller
{
    [Route("api/challenges")]
    [ApiController]
    [Authorize]
    public class ChallengeController : ControllerBase
    {
        private IChallengeActions _challengeActions;

        public ChallengeController()
        {
            var bl = new BusinessLogic();
            _challengeActions = bl.GetChallengeActions();
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAll()
        {
            var role = User.GetRole();
            var userId = User.GetId();

            var result = _challengeActions.GetAll(role, userId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById(int id)
        {
            var role = User.GetRole();
            var userId = User.GetId();

            var result = _challengeActions.GetById(id, role, userId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Create([FromBody] CreateChallengeDto dto)
        {
            var result = _challengeActions.Create(dto);

            if (!result.IsSuccess) 
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Update(int id, [FromBody] UpdateChallengeDto dto)
        {
            var result = _challengeActions.Update(id, dto);

            if (!result.IsSuccess) 
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Delete(int id)
        {
            var result = _challengeActions.Delete(id);

            if (!result.IsSuccess) 
                return BadRequest(result);

            return Ok(result);
        }
    }
}
