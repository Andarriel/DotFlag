import { Trophy, Target, Zap, Flame, Flag, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { Profile, ChallengeCategory } from '../../types';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Web:       { bg: 'bg-blue-500/10',   text: 'text-blue-400',   bar: 'bg-blue-500' },
  Crypto:    { bg: 'bg-yellow-500/10',  text: 'text-yellow-400', bar: 'bg-yellow-500' },
  Pwn:       { bg: 'bg-red-500/10',     text: 'text-red-400',    bar: 'bg-red-500' },
  Reverse:   { bg: 'bg-purple-500/10',  text: 'text-purple-400', bar: 'bg-purple-500' },
  Forensics: { bg: 'bg-emerald-500/10', text: 'text-emerald-400',bar: 'bg-emerald-500' },
  Misc:      { bg: 'bg-slate-500/10',   text: 'text-slate-400',  bar: 'bg-slate-500' },
  OSINT:     { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',   bar: 'bg-cyan-500' },
};

function StatCard({ icon: Icon, color, bg, label, value }: { icon: typeof Trophy; color: string; bg: string; label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-4 gradient-border group hover:bg-slate-800/40 transition-all">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function ProfileOverview({ profile }: { profile: Profile }) {
  const navigate = useNavigate();
  const solves = profile.flagHistory.filter(f => f.isCorrect);
  const totalPoints = solves.reduce((sum, f) => sum + f.points, 0);
  const firstBloods = solves.filter(f => f.isFirstBlood);

  // Category breakdown
  const categoryMap = new Map<ChallengeCategory, { count: number; points: number }>();
  for (const s of solves) {
    const existing = categoryMap.get(s.category) ?? { count: 0, points: 0 };
    categoryMap.set(s.category, { count: existing.count + 1, points: existing.points + s.points });
  }
  const categories = [...categoryMap.entries()]
    .sort((a, b) => b[1].points - a[1].points);
  const categoryTotalPoints = categories.reduce((sum, [, d]) => sum + d.points, 0) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Trophy} color="text-yellow-400" bg="bg-yellow-400/10" label="Total Points" value={totalPoints} />
        <StatCard icon={Target} color="text-green-400" bg="bg-green-400/10" label="Flags Captured" value={solves.length} />
        <StatCard icon={Flame} color="text-red-400" bg="bg-red-400/10" label="First Bloods" value={firstBloods.length} />
        <StatCard icon={Zap} color="text-purple-400" bg="bg-purple-400/10" label="Categories" value={categories.length} />
      </div>

      {solves.length > 1 && (() => {
        const sorted = [...solves].sort((a, b) => new Date(a.solvedAt).getTime() - new Date(b.solvedAt).getTime());
        const firstT = new Date(sorted[0].solvedAt).getTime();
        const points: { t: number; cum: number; isFirstBlood: boolean }[] = [{ t: firstT, cum: 0, isFirstBlood: false }];
        let cum = 0;
        for (const s of sorted) {
          cum += s.points;
          points.push({ t: new Date(s.solvedAt).getTime(), cum, isFirstBlood: s.isFirstBlood });
        }
        const W = 600, H = 120, PAD = 8;
        const minT = points[0].t, maxT = points[points.length - 1].t;
        const maxCum = points[points.length - 1].cum;
        const tSpan = Math.max(1, maxT - minT);
        const scaleX = (t: number) => PAD + ((t - minT) / tSpan) * (W - PAD * 2);
        const scaleY = (c: number) => H - PAD - (c / maxCum) * (H - PAD * 2);
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${scaleX(p.t).toFixed(1)},${scaleY(p.cum).toFixed(1)}`).join(' ');
        const area = `${path} L${scaleX(maxT).toFixed(1)},${H - PAD} L${scaleX(minT).toFixed(1)},${H - PAD} Z`;
        const sameDay = new Date(minT).toDateString() === new Date(maxT).toDateString();
        const labelOpts: Intl.DateTimeFormatOptions = sameDay
          ? { hour: '2-digit', minute: '2-digit' }
          : { month: 'short', day: 'numeric' };
        const startLabel = new Date(minT).toLocaleString(undefined, labelOpts);
        const endLabel = new Date(maxT).toLocaleString(undefined, labelOpts);
        return (
          <div className="glass rounded-xl p-5 gradient-border">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Solve Timeline
            </h3>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
              <defs>
                <linearGradient id="solveAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#solveAreaGradient)" />
              <path d={path} fill="none" stroke="rgb(129 140 248)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
              {sorted.map((s, i) => {
                const p = points[i + 1];
                return (
                  <circle
                    key={i}
                    cx={scaleX(p.t)}
                    cy={scaleY(p.cum)}
                    r={p.isFirstBlood ? 3 : 2}
                    fill={p.isFirstBlood ? 'rgb(248 113 113)' : 'rgb(165 180 252)'}
                  >
                    <title>{`+${s.points} · ${s.challengeTitle} · ${new Date(p.t).toLocaleString()}`}</title>
                  </circle>
                );
              })}
            </svg>
            <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
              <span>{startLabel}</span>
              <span className="text-slate-500">{maxCum} pts over {solves.length} solves</span>
              <span>{endLabel}</span>
            </div>
          </div>
        );
      })()}

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="glass rounded-xl p-5 gradient-border">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {categories.map(([cat, data]) => {
              const colors = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Misc;
              const pct = Math.round((data.points / categoryTotalPoints) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${colors.text}`}>{cat}</span>
                      <span className="text-[11px] text-slate-600">{data.count} solve{data.count !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{data.points} pts <span className="text-slate-600 font-normal">· {pct}%</span></span>
                  </div>
                  <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent solves */}
      <div className="glass rounded-xl p-5 gradient-border">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Flag className="w-3.5 h-3.5" />
          Recent Solves
        </h3>
        {solves.length > 0 ? (
          <div className="space-y-1">
            {solves.slice(0, 5).map(flag => {
              const colors = CATEGORY_COLORS[flag.category] ?? CATEGORY_COLORS.Misc;
              return (
                <div
                  key={flag.challengeId + flag.solvedAt}
                  onClick={() => navigate(`/challenges?open=${flag.challengeId}`)}
                  className={`relative flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
                    flag.isFirstBlood
                      ? 'bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-500/10 hover:border-red-500/25'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm text-white font-medium truncate">{flag.challengeTitle}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>{flag.category}</span>
                    {flag.isFirstBlood && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                        <Flame className="w-3 h-3" />
                        1st
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-[11px] text-slate-600">{formatTimeAgo(flag.solvedAt)}</span>
                    <span className="text-sm font-semibold text-indigo-400">+{flag.points}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No challenges solved yet</p>
        )}
      </div>
    </div>
  );
}
