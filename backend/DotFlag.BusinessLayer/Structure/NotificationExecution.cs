using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Notification;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure;

public class NotificationExecution : NotificationActions, INotificationActions
{
    public List<NotificationDto> GetByUser(int userId)
    {
        return GetByUserExecution(userId);
    }

    public int GetUnreadCount(int userId)
    {
        return GetUnreadCountExecution(userId);
    }

    public ActionResponse MarkAsRead(int notificationId, int userId)
    {
        return MarkAsReadExecution(notificationId, userId);
    }

    public ActionResponse MarkAllAsRead(int userId)
    {
        return MarkAllAsReadExecution(userId);
    }

    public ActionResponse Create(CreateNotificationDto dto)
    {
        return CreateExecution(dto);
    }
}
