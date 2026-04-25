using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Docker
{
    public class ChallengeInstanceData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ChallengeId { get; set; }
        public ChallengeData Challenge { get; set; } = null!;

        public int UserId { get; set; }
        public UserData User { get; set; } = null!;

        [StringLength(64)]
        public string ContainerId { get; set; } = string.Empty;

        public int HostPort { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ExpiresAt { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "running";
    }
}
