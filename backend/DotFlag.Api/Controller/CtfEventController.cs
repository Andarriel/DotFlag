using DotFlag.Api.Extensions;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.CtfEvent;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/ctf")]
    [ApiController]
    public class CtfEventController : ControllerBase
    {
        private ICtfEventActions _ctfEventActions;

        public CtfEventController()
        {
            var bl = new BusinessLogic();
            _ctfEventActions = bl.GetCtfEventActions();
        }

        [HttpGet("status")]
        [AllowAnonymous]
        public IActionResult GetStatus()
        {
            var result = _ctfEventActions.Get();
            return Ok(result);
        }

        [HttpPut("event")]
        [Authorize(Roles = "Owner")]
        public IActionResult Update([FromBody] UpdateCtfEventDto dto)
        {
            var result = _ctfEventActions.Update(dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult GetAll()
        {
            var result = _ctfEventActions.GetAll();
            return Ok(result);
        }

        [HttpPost("{id}/finalize")]
        [Authorize(Roles = "Owner")]
        public IActionResult Finalize(int id)
        {
            var result = _ctfEventActions.FinalizeCTF(id, User.GetId());
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }
    }
}
