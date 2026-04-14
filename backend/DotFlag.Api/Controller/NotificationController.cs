using DotFlag.Api.Extensions;
using DotFlag.BusinessLayer;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotFlag.Api.Controller
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationActions _notificationActions;
        public NotificationController()
        {
            var bl = new BusinessLogic();
            _notificationActions = bl.GetNotificationActions();
        }

        [HttpGet]
        public IActionResult GetNotifications()
        {
            int userId = User.GetId();
            var result = _notificationActions.GetByUser(userId);
            return Ok(result);
        }

        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount()
        {
            int userId = User.GetId();
            var count = _notificationActions.GetUnreadCount(userId);
            return Ok(new { count });
        }

        [HttpPut("{id}/read")]
        public IActionResult MarkAsRead(int id)
        {
            int userId = User.GetId();
            var result = _notificationActions.MarkAsRead(id, userId);
            return Ok(result);
        }

        [HttpPut("read-all")]
        public IActionResult MarkAllAsRead()
        {
            int userId = User.GetId();
            var result = _notificationActions.MarkAllAsRead(userId);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateNotificationDto dto)
        {
            var role = User.GetRole();
            if (role != DotFlag.Domain.Enums.UserRole.Admin && role != DotFlag.Domain.Enums.UserRole.Owner)
                return Forbid();

            var result = _notificationActions.Create(dto);
            return Ok(result);
        }
    }
}
