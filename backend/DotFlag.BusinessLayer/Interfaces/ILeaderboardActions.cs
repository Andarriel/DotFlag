using DotFlag.Domain.Models.Leaderboard;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface ILeaderboardActions
    {
        List<LeaderboardEntryDto> GetLeaderboard();
        List<LeaderboardProgressDto> GetProgress();
        List<LeaderboardProgressDto> GetTeamProgress();
        List<TeamLeaderboardEntryDto> GetTeamLeaderboard();
    }
}
