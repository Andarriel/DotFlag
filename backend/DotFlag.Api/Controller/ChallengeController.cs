using DotFlag.Api.Extensions;
using DotFlag.Api.Filters;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        [AllowAnonymous]
        [RequireCtfRunning]
        public IActionResult GetAll()
        {
            var isAuthenticated = User.Identity?.IsAuthenticated == true;
            var role = isAuthenticated ? User.GetRole() : DotFlag.Domain.Enums.UserRole.User;
            int? userId = isAuthenticated ? User.GetId() : null;

            var result = _challengeActions.GetAll(role, userId);

            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize]
        [RequireCtfRunning]
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
            var result = _challengeActions.Create(dto, User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Update(int id, [FromBody] UpdateChallengeDto dto)
        {
            var result = _challengeActions.Update(id, dto, User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/deactivate")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Deactivate(int id, [FromBody] DeactivateChallengeDto dto)
        {
            var result = _challengeActions.Deactivate(id, User.GetId(), dto ?? new DeactivateChallengeDto());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Delete(int id, [FromBody] DeactivateChallengeDto dto = null)
        {
            var result = _challengeActions.Delete(id, User.GetId(), dto ?? new DeactivateChallengeDto());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/clone")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult Clone(int id)
        {
            var result = _challengeActions.Clone(id, User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/hints")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult AddHint(int id,[FromBody] CreateHintDto dto)
        {
            var result = _challengeActions.AddHint(id, dto, User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}/hints/{hintId}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult DeleteHint(int hintId, int id)
        {
            var result = _challengeActions.RemoveHint(id, hintId, User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("{id}/files")]
        [Authorize(Roles = "Admin,Owner")]
        public async Task<IActionResult> UploadFile(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new ActionResponse { IsSuccess = false, Message = "No file provided." });

            var result = await _challengeActions.AddFile(id, file.FileName, file.OpenReadStream(), User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpGet("{id}/files/{fileId}/download")]
        [Authorize]
        [RequireCtfRunning]
        public IActionResult DownloadFile(int id, int fileId)
        {
            var file = _challengeActions.GetFile(id, fileId);

            if (file == null)
                return NotFound();

            return PhysicalFile(file.StoredPath, "application/octet-stream", file.FileName);
        }

        [HttpDelete("{id}/files/{fileId}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult RemoveFile(int id, int fileId)
        {
            var result = _challengeActions.RemoveFile(id, fileId, User.GetId());

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
