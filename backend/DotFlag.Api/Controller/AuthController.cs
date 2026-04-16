using DotFlag.Api.Filters;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthActions _authActions;

        public AuthController()
        {
            var businessLogic = new BusinessLogic();
            _authActions = businessLogic.GetAuthActions();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto dto)
        {
            var (data, error) = _authActions.Login(dto);

            if (data == null)
                return Unauthorized(new ActionResponse
                {
                    IsSuccess = false,
                    Message = error ?? "Invalid email or password."
                });

            return Ok(data);
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto dto)
        {
            var result = _authActions.Register(dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
