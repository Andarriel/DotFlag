using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DotFlag.Api.Controller
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserActions _userActions;

        public UserController()
        {
            var bl = new BusinessLogic();
            _userActions = bl.GetUserActions();
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult GetAll()
        {
            var result = _userActions.GetAll();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var result = _userActions.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("my")]
        public IActionResult GetMyProfile()
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = _userActions.GetMyProfile(currentUserId);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Create([FromBody] CreateUserDto dto)
        {
            var result = _userActions.Create(dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Update([FromBody] UpdateUserDto dto, int id)
        {
            var result = _userActions.Update(id, dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Delete(int id)
        {
            var result = _userActions.Delete(id);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}/profile")]
        [Authorize]
        public IActionResult UpdateProfile(int id, [FromBody] UpdateUserProfileDto dto)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (currentUserId != id)
                return Forbid();

            var result = _userActions.UpdateProfile(id, dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/ban")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Ban(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var currentUserRole = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);

            var result = _userActions.Ban(id, currentUserId, currentUserRole);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/unban")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Unban(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var currentUserRole = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);

            var result = _userActions.Unban(id, currentUserId, currentUserRole);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/promote")]
        [Authorize(Roles = "Owner")]
        public IActionResult Promote(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = _userActions.Promote(id, currentUserId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/demote")]
        [Authorize(Roles = "Owner")]
        public IActionResult Demote(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = _userActions.Demote(id, currentUserId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
