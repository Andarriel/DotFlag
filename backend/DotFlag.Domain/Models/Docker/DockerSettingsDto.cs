namespace DotFlag.Domain.Models.Docker
{
    public class DockerSettingsDto
    {
        public int Id { get; set; }
        public string Host { get; set; } = string.Empty;
        public int MaxGlobalInstances { get; set; }
        public int InstanceTimeoutMinutes { get; set; }
    }
}
