import { useState, useRef, useEffect } from 'react';
import { Zap, Target, Clock } from 'lucide-react';
import { formatTimeAgo, getRankBadgeColor, getRankIcon } from '../../utils/leaderboardUtils';
import type { LeaderboardEntry } from '../../types';
import type { TeamProgress } from '../../data/mockData';

/* Reusable blocks */

interface UserStatsCardProps {
  rank: number;
  points: number;
  solved: number;
}

export function UserStatsCard({ rank, points, solved }: UserStatsCardProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">Your Ranking</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white">#{rank}</span>
            <span className="text-2xl">{getRankIcon(rank)}</span>
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-slate-400 mb-1">Points</p>
            <p className="text-xl font-bold text-indigo-400">{points}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Solved</p>
            <p className="text-xl font-bold text-purple-400">{solved}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Chart helpers */

function smoothCurve(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function formatChartTime(date: Date): string {
  return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}

/* Chart */

interface TooltipState {
  x: number;
  y: number;
  teamName: string;
  teamColor: string;
  points: number;
  challengeName?: string;
  challengePoints?: number;
  timestamp: string;
}

interface TeamProgressChartProps {
  teamProgress: TeamProgress[];
  maxPoints: number;
}

export function TeamProgressChart({ teamProgress, maxPoints }: TeamProgressChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartW, setChartW] = useState(900);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hiddenTeams, setHiddenTeams] = useState<Set<number>>(new Set());
  const [hoveredPoint, setHoveredPoint] = useState<{ teamId: number; index: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      if (w > 0) setChartW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 320;
  const pad = { top: 20, right: 25, bottom: 45, left: 60 };
  const innerW = chartW - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const chartMax = Math.ceil(maxPoints * 1.1 / 100) * 100;

  const allTs = teamProgress.flatMap(t => t.progress.map(p => new Date(p.timestamp).getTime()));
  const minT = Math.min(...allTs);
  const maxT = Math.max(...allTs);
  const rangeT = maxT - minT || 1;

  const xScale = (ts: string) => pad.left + ((new Date(ts).getTime() - minT) / rangeT) * innerW;
  const yScale = (pts: number) => pad.top + innerH * (1 - pts / chartMax);

  const tickCount = 7;
  const timeTicks = Array.from({ length: tickCount }, (_, i) => new Date(minT + (rangeT / (tickCount - 1)) * i));
  const yTickValues = [0, 0.25, 0.5, 0.75, 1].map(r => Math.round(chartMax * r));

  const visibleTeams = teamProgress.filter(t => !hiddenTeams.has(t.teamId));

  const toggleTeam = (id: number) => {
    setHiddenTeams(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleEnter = (team: TeamProgress, idx: number) => {
    const p = team.progress[idx];
    setHoveredPoint({ teamId: team.teamId, index: idx });
    setTooltip({
      x: xScale(p.timestamp),
      y: yScale(p.points),
      teamName: team.teamName,
      teamColor: team.color,
      points: p.points,
      challengeName: p.challengeName,
      challengePoints: p.challengePoints,
      timestamp: p.timestamp,
    });
  };

  const handleLeave = () => {
    setHoveredPoint(null);
    setTooltip(null);
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!tooltip) return {};
    const showBelow = tooltip.y < 100;
    let tx = '-50%';
    if (tooltip.x < 110) tx = '0px';
    else if (tooltip.x > chartW - 110) tx = '-100%';
    return {
      left: `${tooltip.x}px`,
      top: `${tooltip.y}px`,
      transform: `translate(${tx}, ${showBelow ? '16px' : 'calc(-100% - 16px)'})`,
    };
  };

  return (
    <div className="mb-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      {/* Header + Legend */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">Team Progress</h2>
        <div className="flex gap-2 flex-wrap">
          {teamProgress.map(team => {
            const hidden = hiddenTeams.has(team.teamId);
            return (
              <button
                key={team.teamId}
                onClick={() => toggleTeam(team.teamId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  hidden
                    ? 'bg-slate-900 border-slate-800 text-slate-600'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/80'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full transition-opacity duration-200"
                  style={{ backgroundColor: team.color, opacity: hidden ? 0.25 : 1 }}
                />
                {team.teamName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div ref={containerRef} className="relative">
          <svg width={chartW} height={H} className="overflow-hidden">
            <defs>
              <filter id="dot-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {teamProgress.map(team => (
                <linearGradient key={team.teamId} id={`area-${team.teamId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={team.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={team.color} stopOpacity="0.01" />
                </linearGradient>
              ))}
            </defs>

            {/* Horizontal grid + Y labels */}
            {yTickValues.map((val, i) => {
              const y = yScale(val);
              return (
                <g key={`y-${i}`}>
                  <line x1={pad.left} y1={y} x2={chartW - pad.right} y2={y} stroke="#1e293b" strokeWidth="1" />
                  <text x={pad.left - 10} y={y + 4} textAnchor="end" fill="#64748b" fontSize="11">{val}</text>
                </g>
              );
            })}

            {/* Vertical grid + X labels */}
            {timeTicks.map((tick, i) => {
              const x = pad.left + (i / (tickCount - 1)) * innerW;
              return (
                <g key={`x-${i}`}>
                  <line x1={x} y1={pad.top} x2={x} y2={H - pad.bottom} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={x} y={H - pad.bottom + 20} textAnchor="middle" fill="#64748b" fontSize="11">
                    {formatChartTime(tick)}
                  </text>
                </g>
              );
            })}

            {/* Crosshair */}
            {hoveredPoint && (() => {
              const team = teamProgress.find(t => t.teamId === hoveredPoint.teamId);
              if (!team) return null;
              const cx = xScale(team.progress[hoveredPoint.index].timestamp);
              return (
                <line
                  x1={cx} y1={pad.top} x2={cx} y2={H - pad.bottom}
                  stroke={team.color} strokeWidth="1" strokeDasharray="6 3" opacity="0.35"
                />
              );
            })()}

            {/* Team lines */}
            {visibleTeams.map(team => {
              const coords = team.progress.map(p => ({ x: xScale(p.timestamp), y: yScale(p.points) }));
              const curve = smoothCurve(coords);
              const first = coords[0];
              const last = coords[coords.length - 1];
              const bottom = H - pad.bottom;
              const area = curve + ` L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
              const isHoveredTeam = hoveredPoint?.teamId === team.teamId;
              const isDimmed = hoveredPoint !== null && !isHoveredTeam;

              return (
                <g key={team.teamId} opacity={isDimmed ? 0.2 : 1} style={{ transition: 'opacity 0.25s ease' }}>
                  <path d={area} fill={`url(#area-${team.teamId})`} />
                  <path
                    d={curve}
                    fill="none"
                    stroke={team.color}
                    strokeWidth={isHoveredTeam ? 2.5 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {team.progress.map((_point, i) => {
                    const { x: cx, y: cy } = coords[i];
                    const isActive = hoveredPoint?.teamId === team.teamId && hoveredPoint?.index === i;

                    return (
                      <g key={i}>
                        {/* Glow (behind everything) */}
                        {isActive && (
                          <>
                            <circle cx={cx} cy={cy} r="14" fill={team.color} opacity="0.12" filter="url(#dot-glow)" pointerEvents="none" />
                            <circle cx={cx} cy={cy} r="9" fill="none" stroke={team.color} strokeWidth="1.5" opacity="0.3" pointerEvents="none" />
                          </>
                        )}
                        {/* Dot */}
                        <circle
                          cx={cx} cy={cy}
                          r={isActive ? 5 : 3}
                          fill={isActive ? team.color : '#0f172a'}
                          stroke={team.color}
                          strokeWidth="2"
                          pointerEvents="none"
                        />
                        {/* Hit area (on top, captures mouse) */}
                        <circle
                          cx={cx} cy={cy} r="18"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => handleEnter(team, i)}
                          onMouseLeave={handleLeave}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute pointer-events-none z-20"
              style={getTooltipStyle()}
            >
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="h-1" style={{ backgroundColor: tooltip.teamColor }} />
                <div className="px-4 py-3 min-w-[200px]">
                  {/* Team */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tooltip.teamColor }} />
                    <span className="text-sm font-semibold text-white">{tooltip.teamName}</span>
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total Points</span>
                    <span className="text-white font-bold">{tooltip.points}</span>
                  </div>

                  {/* Challenge */}
                  {tooltip.challengeName && (
                    <div className="border-t border-slate-700/50 mt-2.5 pt-2.5">
                      <div className="text-xs text-slate-500 mb-1.5">Challenge Solved</div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-white font-medium">{tooltip.challengeName}</span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                          style={{ backgroundColor: tooltip.teamColor + '20', color: tooltip.teamColor }}
                        >
                          +{tooltip.challengePoints}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Time */}
                  <div className="border-t border-slate-700/50 mt-2.5 pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formatChartTime(new Date(tooltip.timestamp))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Table */

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: number;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Player</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Points</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Solved</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className={`transition-colors hover:bg-slate-800/30 ${
                  entry.id === currentUserId ? 'bg-indigo-600/5' : ''
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

                {/* Player */}
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
  );
}
