using DotFlag.Domain.Entities.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DotFlag.Domain.Entities.Notification
{
    public class UserNotificationData
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int NotificationId { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public UserData User { get; set; }
        public NotificationData Notification { get; set; }
    }
}
