using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.Docker
{
    public class UpdateDockerSettingsDto
    {
        [Required]
        [StringLength(200)]
        public string Host { get; set; } = string.Empty;

        public int MaxGlobalInstances { get; set; }

        public int InstanceTimeoutMinutes { get; set; }
    }
}
