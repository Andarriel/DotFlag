using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Models.Leaderboard;

namespace DotFlag.BusinessLayer.Core
{
    public class LeaderboardActions : ILeaderboardActions
    {
        public List<LeaderboardEntryDto> GetLeaderboard()
        {
            using var context = new AppDbContext();

            var entries = context.Submissions
                .Where(s => s.IsCorrect && s.Challenge.IsActive && !s.User.IsBanned)
                .GroupBy(s => s.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Username = g.First().User.Username,
                    Score = g.Sum(s => s.Challenge.CurrentPoints),
                    SolvesCount = g.Count(),
                    LastSolveAt = g.Max(s => s.CreatedOn)
                })
                .OrderByDescending(e => e.Score)
                .ThenBy(e => e.LastSolveAt)
                .ToList()
                .Select((e, i) => new LeaderboardEntryDto
                {
                    Rank = i + 1,
                    UserId = e.UserId,
                    Username = e.Username,
                    Score = e.Score,
                    SolvesCount = e.SolvesCount,
                    LastSolveAt = e.LastSolveAt
                })
                .ToList();

            return entries;
        }
    }
}
