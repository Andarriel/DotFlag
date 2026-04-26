using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Models.Leaderboard;

namespace DotFlag.BusinessLayer.Core
{
    public class LeaderboardActions
    {
        protected List<LeaderboardEntryDto> GetLeaderboardExecution()
        {
            using var context = new AppDbContext();

            // Materialise so we can use the conditional score formula safely
            var raw = context.Submissions
                .Where(s => s.IsCorrect && !s.User.IsBanned)
                .Select(s => new
                {
                    s.UserId,
                    Username      = s.User.Username,
                    ActivePoints  = s.Challenge.IsActive ? s.Challenge.CurrentPoints + s.BonusPoints : 0,
                    s.CompensationPoints,
                    IsActiveSolve = s.Challenge.IsActive,
                    Timestamp     = s.CreatedOn
                })
                .ToList();

            var entries = raw
                .GroupBy(s => s.UserId)
                .Select(g => new
                {
                    UserId      = g.Key,
                    Username    = g.First().Username,
                    Score       = g.Sum(s => s.ActivePoints + s.CompensationPoints),
                    SolvesCount = g.Count(s => s.IsActiveSolve),
                    LastSolveAt = g.Where(s => s.IsActiveSolve).Select(s => (DateTime?)s.Timestamp).Max()
                                  ?? g.Max(s => s.Timestamp)
                })
                .Where(e => e.Score > 0)
                .OrderByDescending(e => e.Score)
                .ThenBy(e => e.LastSolveAt)
                .ToList()
                .Select((e, i) => new LeaderboardEntryDto
                {
                    Rank        = i + 1,
                    UserId      = e.UserId,
                    Username    = e.Username,
                    Score       = e.Score,
                    SolvesCount = e.SolvesCount,
                    LastSolveAt = e.LastSolveAt
                })
                .ToList();

            return entries;
        }

        protected List<LeaderboardProgressDto> GetProgressExecution()
        {
            using var context = new AppDbContext();

            // Progress chart shows only active-challenge solves (compensation has no solve timestamp)
            var submissions = context.Submissions
                .Where(s => s.IsCorrect && s.Challenge.IsActive && !s.User.IsBanned)
                .OrderBy(s => s.CreatedOn)
                .Select(s => new
                {
                    s.UserId,
                    Username        = s.User.Username,
                    Points          = s.Challenge.CurrentPoints + s.BonusPoints,
                    ChallengeName   = s.Challenge.Name,
                    ChallengePoints = s.Challenge.CurrentPoints + s.BonusPoints,
                    Timestamp       = s.CreatedOn
                })
                .ToList();

            var grouped = submissions
                .GroupBy(s => s.UserId)
                .Select(g =>
                {
                    int cumulative = 0;
                    var progress = g.Select(s =>
                    {
                        cumulative += s.Points;
                        return new LeaderboardProgressPointDto
                        {
                            Timestamp       = s.Timestamp,
                            Points          = cumulative,
                            ChallengeName   = s.ChallengeName,
                            ChallengePoints = s.ChallengePoints
                        };
                    }).ToList();

                    return new LeaderboardProgressDto
                    {
                        UserId   = g.Key,
                        Username = g.First().Username,
                        Progress = progress
                    };
                })
                .ToList();

            return grouped;
        }

        protected List<LeaderboardProgressDto> GetTeamProgressExecution()
        {
            using var context = new AppDbContext();

            var submissions = context.Submissions
                .Where(s => s.IsCorrect && s.Challenge.IsActive && !s.User.IsBanned && s.User.TeamId != null)
                .OrderBy(s => s.CreatedOn)
                .Select(s => new
                {
                    TeamId          = s.User.TeamId!.Value,
                    TeamName        = s.User.Team!.Name,
                    Points          = s.Challenge.CurrentPoints + s.BonusPoints,
                    ChallengeName   = s.Challenge.Name,
                    ChallengePoints = s.Challenge.CurrentPoints + s.BonusPoints,
                    Timestamp       = s.CreatedOn
                })
                .ToList();

            var grouped = submissions
                .GroupBy(s => s.TeamId)
                .Select(g =>
                {
                    int cumulative = 0;
                    var progress = g.Select(s =>
                    {
                        cumulative += s.Points;
                        return new LeaderboardProgressPointDto
                        {
                            Timestamp       = s.Timestamp,
                            Points          = cumulative,
                            ChallengeName   = s.ChallengeName,
                            ChallengePoints = s.ChallengePoints
                        };
                    }).ToList();

                    return new LeaderboardProgressDto
                    {
                        UserId   = g.Key,
                        Username = g.First().TeamName,
                        Progress = progress
                    };
                })
                .ToList();

            return grouped;
        }

        protected List<TeamLeaderboardEntryDto> GetTeamLeaderboardExecution()
        {
            using var context = new AppDbContext();

            var raw = context.Submissions
                .Where(s => s.IsCorrect && !s.User.IsBanned && s.User.TeamId != null)
                .Select(s => new
                {
                    TeamId        = s.User.TeamId!.Value,
                    TeamName      = s.User.Team!.Name,
                    s.UserId,
                    ActivePoints  = s.Challenge.IsActive ? s.Challenge.CurrentPoints + s.BonusPoints : 0,
                    s.CompensationPoints,
                    IsActiveSolve = s.Challenge.IsActive,
                    Timestamp     = s.CreatedOn
                })
                .ToList();

            var entries = raw
                .GroupBy(s => s.TeamId)
                .Select(g => new
                {
                    TeamId      = g.Key,
                    TeamName    = g.First().TeamName,
                    Score       = g.Sum(s => s.ActivePoints + s.CompensationPoints),
                    SolvesCount = g.Count(s => s.IsActiveSolve),
                    MemberCount = g.Select(s => s.UserId).Distinct().Count(),
                    LastSolveAt = g.Where(s => s.IsActiveSolve).Select(s => (DateTime?)s.Timestamp).Max()
                                  ?? g.Max(s => s.Timestamp)
                })
                .Where(e => e.Score > 0)
                .OrderByDescending(e => e.Score)
                .ThenBy(e => e.LastSolveAt)
                .ToList()
                .Select((e, i) => new TeamLeaderboardEntryDto
                {
                    Rank        = i + 1,
                    TeamId      = e.TeamId,
                    TeamName    = e.TeamName,
                    Score       = e.Score,
                    SolvesCount = e.SolvesCount,
                    MemberCount = e.MemberCount,
                    LastSolveAt = e.LastSolveAt
                })
                .ToList();

            return entries;
        }
    }
}
