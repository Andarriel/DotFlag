
namespace DotFlag.Domain.Models.Leaderboard
{
    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Score { get; set; }
        public int SolvesCount { get; set; }
        public DateTime LastSolveAt { get; set; }
    }
}
