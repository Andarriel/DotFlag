namespace DotFlag.Domain.Models.Docker
{
    public class DockerContainerDto
    {
        public int InstanceId { get; set; }
        public string ContainerId { get; set; } = string.Empty;
        public int ChallengeId { get; set; }
        public string ChallengeName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int HostPort { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
