using DotFlag.Domain.Models.Notification;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface INotificationActions
    {
        List<NotificationDto> GetByUser(int userId);
        int GetUnreadCount(int userId);
        ActionResponse MarkAllAsRead(int userId);
        ActionResponse Create(CreateNotificationDto dto);
    }
}
