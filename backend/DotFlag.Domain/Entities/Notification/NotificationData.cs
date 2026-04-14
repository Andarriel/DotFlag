using DotFlag.Domain.Entities.User;


namespace DotFlag.Domain.Entities.Notification
{
    public class NotificationData
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public int? UserId { get; set; }
        public UserData? User { get; set; }
    }
}
