using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Leaderboard;

namespace DotFlag.BusinessLayer.Structure;

public class LeaderboardExecution : LeaderboardActions, ILeaderboardActions
{
    public List<LeaderboardEntryDto> GetLeaderboard()
    {
        return GetLeaderboardExecution();
    }

    public List<LeaderboardProgressDto> GetProgress()
    {
        return GetProgressExecution();
    }

    public List<LeaderboardProgressDto> GetTeamProgress()
    {
        return GetTeamProgressExecution();
    }

    public List<TeamLeaderboardEntryDto> GetTeamLeaderboard()
    {
        return GetTeamLeaderboardExecution();
    }
}
