using Microsoft.AspNetCore.Mvc;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;

namespace DotFlag.Api.Controller
{
    [Route("api/challenges")]
    [ApiController]
    public class ChallengeController : ControllerBase
    {
        private IChallengeActions _challengeActions;

        public ChallengeController()
        {
            var bl = new BusinessLogic();
            _challengeActions = bl.GetChallengeActions();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var result = _challengeActions.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _challengeActions.GetById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create(CreateChallengeDto dto)
        {
            var result = _challengeActions.Create(dto);
            if (!result.IsSuccess) return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ChallengeDto dto)
        {
            var result = _challengeActions.Update(id, dto);
            if (!result.IsSuccess) return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _challengeActions.Delete(id);
            if (!result.IsSuccess) return BadRequest(result.Message);
            return Ok(result);
        }
    }
}
