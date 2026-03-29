using Microsoft.AspNetCore.Mvc;
using DotFlag.Domain.Models.User;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.UserActions;

namespace DotFlag.Api.Controller
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserActions _userActions;

        public UserController()
        {
            var bl = new BusinessLogic();
            _userActions = bl.GetUserActions();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var result = _userActions.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _userActions.GetById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create(UserRegisterDto dto)
        {
            var result = _userActions.Create(dto);
            if (!result.IsSuccess) return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, UserDto dto)
        {
            var result = _userActions.Update(id, dto);
            if (!result.IsSuccess) return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _userActions.Delete(id);
            if (!result.IsSuccess) return BadRequest(result.Message);
            return Ok(result);
        }
    }
}
