namespace DotFlag.Domain.Models.Docker
{
    public class ChallengeInstanceDto
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
