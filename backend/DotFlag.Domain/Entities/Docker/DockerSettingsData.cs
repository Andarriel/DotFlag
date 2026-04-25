using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Docker
{
    public class DockerSettingsData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Host { get; set; } = "tcp://localhost:2375";

        public int MaxGlobalInstances { get; set; } = 20;

        public int InstanceTimeoutMinutes { get; set; } = 60;
    }
}
