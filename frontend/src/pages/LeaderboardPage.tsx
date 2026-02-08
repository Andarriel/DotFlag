import { Trophy, Zap, Target, Clock, Medal } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_USER, MOCK_TEAM_PROGRESS } from '../data/mockData';
import { formatTimeAgo, getRankBadgeColor, getRankIcon } from '../utils/leaderboardUtils';

export default function LeaderboardPage() {
  const currentUserRank = MOCK_LEADERBOARD.find(entry => entry.id === MOCK_USER.id);

  // Calculate max points for chart scaling
  const maxPoints = Math.max(...MOCK_TEAM_PROGRESS.flatMap(team => team.progress.map(p => p.points)));
  const chartWidth = 800;
  const chartHeight = 200;
  const padding = { top: 10, right: 10, bottom: 10, left: 10 };

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Compete with the best hackers and climb your way to the top. Rankings update in real-time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Current User Stats */}
        {currentUserRank && (
          <div className="mb-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Your Ranking</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-white">#{currentUserRank.rank}</span>
                  <span className="text-2xl">{getRankIcon(currentUserRank.rank)}</span>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Points</p>
                  <p className="text-xl font-bold text-indigo-400">{currentUserRank.currentPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Solved</p>
                  <p className="text-xl font-bold text-purple-400">{currentUserRank.solvedChallenges}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Progress Chart */}
        <div className="mb-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Team Progress</h2>
          
          <div className="relative overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Y-axis labels */}
              <div className="flex mb-2">
                <div className="w-16 flex flex-col-reverse justify-between text-xs text-slate-500" style={{ height: `${chartHeight}px` }}>
                  <span>0</span>
                  <span>{Math.round(maxPoints * 0.25)}</span>
                  <span>{Math.round(maxPoints * 0.5)}</span>
                  <span>{Math.round(maxPoints * 0.75)}</span>
                  <span>{maxPoints}</span>
                </div>

                {/* Chart */}
                <div className="flex-1 relative">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full"
                    style={{ height: `${chartHeight}px` }}
                  >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                      <line
                        key={i}
                        x1={padding.left}
                        y1={padding.top + (chartHeight - padding.top - padding.bottom) * ratio}
                        x2={chartWidth - padding.right}
                        y2={padding.top + (chartHeight - padding.top - padding.bottom) * ratio}
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Team lines and areas */}
                    {MOCK_TEAM_PROGRESS.map(team => {
                      const numPoints = team.progress.length;
                      const xStep = (chartWidth - padding.left - padding.right) / (numPoints - 1);
                      
                      // Create path for line
                      const linePath = team.progress.map((point, i) => {
                        const x = padding.left + i * xStep;
                        const yRatio = point.points / maxPoints;
                        const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - yRatio);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');

                      // Create path for area
                      const areaPath = team.progress.map((point, i) => {
                        const x = padding.left + i * xStep;
                        const yRatio = point.points / maxPoints;
                        const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - yRatio);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ') + ` L ${padding.left + (numPoints - 1) * xStep} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

                      return (
                        <g key={team.teamId}>
                          {/* Gradient definition */}
                          <defs>
                            <linearGradient id={`gradient-${team.teamId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={team.color} stopOpacity="0.2" />
                              <stop offset="100%" stopColor={team.color} stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          
                          {/* Area fill */}
                          <path
                            d={areaPath}
                            fill={`url(#gradient-${team.teamId})`}
                          />
                          
                          {/* Line */}
                          <path
                            d={linePath}
                            fill="none"
                            stroke={team.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Points */}
                          {team.progress.map((point, i) => {
                            const x = padding.left + i * xStep;
                            const yRatio = point.points / maxPoints;
                            const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - yRatio);
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill={team.color}
                              />
                            );
                          })}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex">
                <div className="w-16"></div>
                <div className="flex-1 flex justify-between text-xs text-slate-500 px-2">
                  {MOCK_TEAM_PROGRESS[0].progress.map((p, i) => (
                    <span key={i}>{new Date(p.timestamp).getHours().toString().padStart(2, '0')}:00</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {MOCK_TEAM_PROGRESS.map(team => (
              <div key={team.teamId} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                <span className="text-sm text-slate-300">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Solved
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_LEADERBOARD.map((entry) => (
                  <tr 
                    key={entry.id}
                    className={`transition-colors hover:bg-slate-800/30 ${
                      entry.id === MOCK_USER.id ? 'bg-indigo-600/5' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg ${getRankBadgeColor(entry.rank)} flex items-center justify-center text-sm font-bold`}>
                          {entry.rank}
                        </span>
                        {entry.rank <= 3 && (
                          <span className="text-xl">{getRankIcon(entry.rank)}</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Username */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {entry.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{entry.username}</p>
                          {entry.teamName && (
                            <span className="text-xs text-slate-400">{entry.teamName}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Points */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold text-white">{entry.currentPoints}</span>
                      </div>
                    </td>
                    
                    {/* Solved */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">{entry.solvedChallenges}</span>
                      </div>
                    </td>
                    
                    {/* Last Activity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.lastSolveTime ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-400">
                            {formatTimeAgo(entry.lastSolveTime)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <Medal className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">{MOCK_LEADERBOARD.length}</p>
            <p className="text-sm text-slate-400">Total Players</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {MOCK_LEADERBOARD.reduce((sum, e) => sum + e.currentPoints, 0)}
            </p>
            <p className="text-sm text-slate-400">Total Points Earned</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {MOCK_LEADERBOARD.reduce((sum, e) => sum + e.solvedChallenges, 0)}
            </p>
            <p className="text-sm text-slate-400">Challenges Solved</p>
          </div>
        </div>
      </div>
    </div>
  );
}