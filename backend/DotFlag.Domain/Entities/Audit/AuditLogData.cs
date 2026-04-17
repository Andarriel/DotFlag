using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Audit
{
    public class AuditLogData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int? ActorId { get; set; }

        [ForeignKey("ActorId")]
        public UserData? Actor { get; set; }

        [Required]
        public AuditAction Action { get; set; }

        [StringLength(50)]
        public string? TargetType { get; set; }

        public int? TargetId { get; set; }

        [StringLength(1000)]
        public string? Metadata { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
