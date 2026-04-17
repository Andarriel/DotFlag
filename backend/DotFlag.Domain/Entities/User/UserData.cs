using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Entities.Team;

namespace DotFlag.Domain.Entities.User
{
    public class UserData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(30,MinimumLength = 5, ErrorMessage = "Username cannot be longer than 30 characters")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;

        [DataType(DataType.DateTime)]
        public DateTime RegisteredOn { get; set; } = DateTime.UtcNow;

        public bool IsBanned { get; set; }

        public int? TeamId { get; set; }
        
        [ForeignKey("TeamId")]
        public TeamData? Team { get; set; }

        public TeamRole? TeamRole { get; set; }

        public DateTime? NotificationsReadAt { get; set; }

        public DateTime? LastLoginAt { get; set; }

        [InverseProperty("User")]
        public ICollection<SubmissionData> Submissions { get; set; } = new List<SubmissionData>();
    }
}
