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

            var notifications = context.Notifications
                .Where(n => n.UserId == null || n.UserId == userId)
                .OrderByDescending(n => n.CreatedOn)
                .Take(50)
                .ToList();

            var readIds = context.UserNotifications
                .Where(un => un.UserId == userId && un.IsRead)
                .Select(un => un.NotificationId)
                .ToHashSet();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                CreatedOn = n.CreatedOn,
                IsRead = readIds.Contains(n.Id)
            }).ToList();
        }

        protected int GetUnreadCountExecution(int userId)
        {
            using var context = new AppDbContext();

            var readIds = context.UserNotifications
                .Where(un => un.UserId == userId && un.IsRead)
                .Select(un => un.NotificationId)
                .ToHashSet();

            return context.Notifications
                .Where(n => n.UserId == null || n.UserId == userId)
                .Count(n => !readIds.Contains(n.Id));
        }

        protected ActionResponse MarkAsReadExecution(int notificationId, int userId)
        {
            using var context = new AppDbContext();

            var userNotification = context.UserNotifications
                .FirstOrDefault(un => un.UserId == userId && un.NotificationId == notificationId);

            if (userNotification == null)
            {
                userNotification = new UserNotificationData
                {
                    UserId = userId,
                    NotificationId = notificationId,
                    IsRead = true
                };
                context.UserNotifications.Add(userNotification);
            }
            else
            {
                userNotification.IsRead = true;
            }

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Notification marked as read." };
        }

        protected ActionResponse MarkAllAsReadExecution(int userId)
        {
            using var context = new AppDbContext();

            var notifications = context.Notifications
                .Where(n => n.UserId == null || n.UserId == userId)
                .Select(n => n.Id)
                .ToList();

            var existingUserNotifications = context.UserNotifications
                .Where(un => un.UserId == userId && notifications.Contains(un.NotificationId))
                .ToList();

            var existingNotificationIds = existingUserNotifications
                .Select(un => un.NotificationId)
                .ToHashSet();

            foreach (var notificationId in notifications)
            {
                if (!existingNotificationIds.Contains(notificationId))
                {
                    context.UserNotifications.Add(new UserNotificationData
                    {
                        UserId = userId,
                        NotificationId = notificationId,
                        IsRead = true
                    });
                }
                else
                {
                    var userNotification = existingUserNotifications.First(un => un.NotificationId == notificationId);
                    userNotification.IsRead = true;
                }
            }

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
