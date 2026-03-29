using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.User
{
    public class UserData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(35)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Password { get; set; } = string.Empty;
        public UserRole Role { get; set; }

        public int CurrentPoints { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime RegisteredOn { get; set; }

        public bool IsBanned { get; set; }

        // public int? TeamId { get; set; }
        // [ForeignKey("TeamId")]
        // public TeamData? Team { get; set; }
        // public ICollection<SubmissionData> Submissions { get; set; } = new List<SubmissionData>();
    }
}
