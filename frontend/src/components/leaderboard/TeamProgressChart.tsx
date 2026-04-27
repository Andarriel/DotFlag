import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { smoothCurve, formatChartTime } from './chartUtils';
import type { TeamProgress } from '../../types';

interface TooltipState {
  x: number; y: number;
  teamName: string; teamColor: string;
  points: number; timestamp: string;
  challengeName?: string; challengePoints?: number;
}

interface TeamProgressChartProps {
  teamProgress: TeamProgress[];
  maxPoints: number;
}

const PAD = { top: 20, right: 25, bottom: 45, left: 60 };
const HEIGHT = 320;
const TICK_COUNT = 7;

export default function TeamProgressChart({ teamProgress, maxPoints }: TeamProgressChartProps) {
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

  const innerW = chartW - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const chartMax = Math.ceil(maxPoints * 1.1 / 100) * 100;

  const allTs = teamProgress.flatMap(t => t.progress.map(p => new Date(p.timestamp).getTime()));
  const minT = Math.min(...allTs);
  const maxT = Math.max(...allTs);
  const rangeT = maxT - minT || 1;

  const xScale = (ts: string) => PAD.left + ((new Date(ts).getTime() - minT) / rangeT) * innerW;
  const yScale = (pts: number) => PAD.top + innerH * (1 - pts / chartMax);

  const timeTicks = Array.from({ length: TICK_COUNT }, (_, i) => new Date(minT + (rangeT / (TICK_COUNT - 1)) * i));
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
    setTooltip({ x: xScale(p.timestamp), y: yScale(p.points), teamName: team.teamName, teamColor: team.color, points: p.points, challengeName: p.challengeName, challengePoints: p.challengePoints, timestamp: p.timestamp });
  };

  const handleLeave = () => { setHoveredPoint(null); setTooltip(null); };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!tooltip) return {};
    const showBelow = tooltip.y < 100;
    let tx = '-50%';
    if (tooltip.x < 110) tx = '0px';
    else if (tooltip.x > chartW - 110) tx = '-100%';
    return { left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: `translate(${tx}, ${showBelow ? '16px' : 'calc(-100% - 16px)'})` };
  };

  return (
    <div className="mb-8 glass rounded-2xl p-5 sm:p-6 gradient-border noise">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-white">Score Progress</h2>
        <div className="flex gap-1.5 flex-wrap">
          {teamProgress.map(team => {
            const hidden = hiddenTeams.has(team.teamId);
            return (
              <button key={team.teamId} onClick={() => toggleTeam(team.teamId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${hidden ? 'bg-slate-900/50 border-white/[0.04] text-slate-600' : 'glass text-slate-200 hover:bg-slate-800/50'}`}>
                <div className="w-2 h-2 rounded-full transition-opacity duration-200" style={{ backgroundColor: team.color, opacity: hidden ? 0.25 : 1 }} />
                {team.teamName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        <svg width={chartW} height={HEIGHT} className="overflow-hidden">
          <defs>
            <filter id="dot-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            {teamProgress.map(t => (
              <linearGradient key={t.teamId} id={`area-${t.teamId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={t.color} stopOpacity="0.10" /><stop offset="100%" stopColor={t.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {yTickValues.map((val, i) => { const y = yScale(val); return (<g key={`y-${i}`}><line x1={PAD.left} y1={y} x2={chartW - PAD.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" /><text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#475569" fontSize="11">{val}</text></g>); })}
          {timeTicks.map((tick, i) => { const x = PAD.left + (i / (TICK_COUNT - 1)) * innerW; return (<g key={`x-${i}`}><line x1={x} y1={PAD.top} x2={x} y2={HEIGHT - PAD.bottom} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" /><text x={x} y={HEIGHT - PAD.bottom + 20} textAnchor="middle" fill="#475569" fontSize="11">{formatChartTime(tick)}</text></g>); })}

          {hoveredPoint && (() => { const team = teamProgress.find(t => t.teamId === hoveredPoint.teamId); if (!team) return null; const cx = xScale(team.progress[hoveredPoint.index].timestamp); return <line x1={cx} y1={PAD.top} x2={cx} y2={HEIGHT - PAD.bottom} stroke={team.color} strokeWidth="1" strokeDasharray="6 3" opacity="0.3" />; })()}

          {visibleTeams.map(team => {
            const coords = team.progress.map(p => ({ x: xScale(p.timestamp), y: yScale(p.points) }));
            const first = coords[0];
            const bottom = HEIGHT - PAD.bottom;
            const chartRight = chartW - PAD.right;

            // Line starts from first real solve (skip synthetic origin) so late-starting
            // users don't show a flat line crawling along y≈0 for most of the chart.
            // Area fill still includes the synthetic origin for a proper baseline.
            const last = coords[coords.length - 1];
            const areaCurve = smoothCurve(coords);
            const lineCoords = coords.slice(1);
            const lineCurve = lineCoords.length >= 2
              ? smoothCurve(lineCoords)
              : lineCoords.length === 1
                ? `M ${lineCoords[0].x.toFixed(1)} ${lineCoords[0].y.toFixed(1)}`
                : '';
            const linePath = lineCurve ? `${lineCurve} L ${chartRight} ${last.y.toFixed(1)}` : '';
            const areaPath = areaCurve + ` L ${chartRight} ${last.y.toFixed(1)} V ${bottom} H ${first.x.toFixed(1)} Z`;

            const isHoveredTeam = hoveredPoint?.teamId === team.teamId;
            const isDimmed = hoveredPoint !== null && !isHoveredTeam;
            return (
              <g key={team.teamId} opacity={isDimmed ? 0.2 : 1} style={{ transition: 'opacity 0.25s ease' }}>
                <path d={areaPath} fill={`url(#area-${team.teamId})`} />
                {linePath && <path d={linePath} fill="none" stroke={team.color} strokeWidth={isHoveredTeam ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />}
                {team.progress.map((_, i) => {
                  if (i === 0) return null; // skip synthetic origin — no real solve event
                  const { x: cx, y: cy } = coords[i];
                  const isActive = hoveredPoint?.teamId === team.teamId && hoveredPoint?.index === i;
                  return (
                    <g key={i}>
                      {isActive && (<><circle cx={cx} cy={cy} r="14" fill={team.color} opacity="0.12" filter="url(#dot-glow)" pointerEvents="none" /><circle cx={cx} cy={cy} r="9" fill="none" stroke={team.color} strokeWidth="1.5" opacity="0.3" pointerEvents="none" /></>)}
                      <circle cx={cx} cy={cy} r={isActive ? 5 : 3} fill={isActive ? team.color : '#0f172a'} stroke={team.color} strokeWidth="2" pointerEvents="none" />
                      <circle cx={cx} cy={cy} r="18" fill="transparent" className="cursor-pointer" onMouseEnter={() => handleEnter(team, i)} onMouseLeave={handleLeave} />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {tooltip && (
          <div className="absolute pointer-events-none z-20" style={getTooltipStyle()}>
            <div className="glass-strong rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="h-1" style={{ backgroundColor: tooltip.teamColor }} />
              <div className="px-4 py-3 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tooltip.teamColor }} />
                  <span className="text-sm font-semibold text-white">{tooltip.teamName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Points</span>
                  <span className="text-white font-bold">{tooltip.points}</span>
                </div>
                {tooltip.challengeName && (
                  <div className="border-t border-white/[0.06] mt-2.5 pt-2.5">
                    <div className="text-xs text-slate-500 mb-1.5">Challenge Solved</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-white font-medium">{tooltip.challengeName}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0" style={{ backgroundColor: tooltip.teamColor + '20', color: tooltip.teamColor }}>+{tooltip.challengePoints}</span>
                    </div>
                  </div>
                )}
                <div className="border-t border-white/[0.06] mt-2.5 pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />{formatChartTime(new Date(tooltip.timestamp))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
