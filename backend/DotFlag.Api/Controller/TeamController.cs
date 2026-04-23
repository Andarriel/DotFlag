using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Team;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DotFlag.Api.Extensions;

namespace DotFlag.Api.Controller
{
    [Route("api/teams")]
    [ApiController]
    [Authorize]
    public class TeamController : ControllerBase
    {
        private readonly ITeamActions _teamActions;

        public TeamController()
        {
            var bl = new BusinessLogic();
            _teamActions = bl.GetTeamActions();
        }
        
        [HttpGet]
        public IActionResult GetAll()
        {
            var role = User.GetRole();
            
            var result = _teamActions.GetAll(role);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _teamActions.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("my")]
        public IActionResult GetMyTeam()
        {
            int userId = User.GetId();
            var result = _teamActions.GetTeamDetails(userId);

            if (result == null)
                return NotFound(new { IsSuccess = false, Message = "You are not in a team." });

            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateTeamDto dto)
        {
            int userId = User.GetId();
            var result = _teamActions.Create(userId, dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("join")]
        public IActionResult Join([FromBody] JoinTeamDto dto)
        {
            int userId = User.GetId();
            var result = _teamActions.Join(userId, dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/leave")]
        public IActionResult Leave(int id)
        {
            int userId = User.GetId();
            var result = _teamActions.Leave(id, userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/regenerate-invite")]
        public IActionResult RegenerateInvite(int id)
        {
            int userId = User.GetId();
            var result = _teamActions.RegenerateInvite(id, userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Update(int id, [FromBody] UpdateTeamDto dto)
        {
            var result = _teamActions.Update(id, dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{teamId}/members/{memberId}")]
        public IActionResult RemoveMember(int teamId, int memberId)
        {
            int actorId = User.GetId();
            var result = _teamActions.RemoveMember(teamId, actorId, memberId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Disband(int id)
        {
            int userId = User.GetId();
            var role =  User.GetRole();
            
            var result = _teamActions.Disband(id, userId, role);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
