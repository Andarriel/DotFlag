using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Notification;
using DotFlag.Domain.Models.Notification;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class NotificationActions
    {
        protected List<NotificationDto> GetByUserExecution(int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return new List<NotificationDto>();

            var notifications = context.Notifications
                .Where(n => n.UserId == null || n.UserId == userId)
                .OrderByDescending(n => n.CreatedOn)
                .Take(50)
                .ToList();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                CreatedOn = n.CreatedOn,
                IsRead = user.NotificationsReadAt.HasValue && n.CreatedOn <= user.NotificationsReadAt.Value
            }).ToList();
        }

        protected int GetUnreadCountExecution(int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return 0;

            var query = context.Notifications
                .Where(n => n.UserId == null || n.UserId == userId);

            if (user.NotificationsReadAt.HasValue)
                query = query.Where(n => n.CreatedOn > user.NotificationsReadAt.Value);

            return query.Count();
        }

        protected ActionResponse MarkAllAsReadExecution(int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            user.NotificationsReadAt = DateTime.UtcNow;
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "All notifications marked as read." };
        }

        protected ActionResponse CreateExecution(CreateNotificationDto dto)
        {
            using var context = new AppDbContext();
            var notification = new NotificationData
            {
                Title = dto.Title,
                Message = dto.Message,
                Type = dto.Type,
                CreatedOn = DateTime.UtcNow
            };
            context.Notifications.Add(notification);
            context.SaveChanges();
            return new ActionResponse { IsSuccess = true, Message = "Notification created successfully." };
        }
    }
}
