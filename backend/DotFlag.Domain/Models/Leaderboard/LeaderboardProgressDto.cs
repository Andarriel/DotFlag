namespace DotFlag.Domain.Models.Leaderboard
{
    public class LeaderboardProgressPointDto
    {
        public DateTime Timestamp { get; set; }
        public int Points { get; set; }
        public string ChallengeName { get; set; } = string.Empty;
        public int ChallengePoints { get; set; }
    }

    public class LeaderboardProgressDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<LeaderboardProgressPointDto> Progress { get; set; } = new();
    }
}
