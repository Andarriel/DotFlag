using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
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

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            //Daca nu e admin sau owner, poate vedea doar propriul profil..
            if (currentUserId != id && !User.IsInRole("Admin") && !User.IsInRole("Owner"))
                return Forbid();

            var result = _userActions.GetById(id);

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
    }
}
