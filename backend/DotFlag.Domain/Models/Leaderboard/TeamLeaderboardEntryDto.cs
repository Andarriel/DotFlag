namespace DotFlag.Domain.Models.Leaderboard
{
    public class TeamLeaderboardEntryDto
    {
        public int Rank { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int Score { get; set; }
        public int SolvesCount { get; set; }
        public int MemberCount { get; set; }
        public DateTime LastSolveAt { get; set; }
    }
}
