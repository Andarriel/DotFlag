import { Link } from 'react-router-dom';
import { Crown, Zap, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useChallenges } from '../../hooks/useChallenges';
import type { ChallengeCategory } from '../../types';

const CATEGORY_CONFIG: Record<string, { color: string; bar: string; icon: string }> = {
  Web:       { color: 'text-blue-400',    bar: 'from-blue-500 to-blue-400',       icon: '>' },
  Crypto:    { color: 'text-yellow-400',   bar: 'from-yellow-500 to-amber-400',    icon: '#' },
  Pwn:       { color: 'text-red-400',      bar: 'from-red-500 to-rose-400',        icon: '$' },
  Reverse:   { color: 'text-purple-400',   bar: 'from-purple-500 to-violet-400',   icon: '&' },
  Forensics: { color: 'text-emerald-400',  bar: 'from-emerald-500 to-green-400',   icon: '%' },
  Misc:      { color: 'text-slate-400',    bar: 'from-slate-500 to-slate-400',     icon: '~' },
  OSINT:     { color: 'text-cyan-400',     bar: 'from-cyan-500 to-sky-400',        icon: '@' },
};

const RANK_COLORS = [
  { gradient: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/25', text: 'text-yellow-400', ring: 'ring-yellow-500/20', bg: 'bg-yellow-500/5' },
  { gradient: 'from-slate-300 to-slate-500',  shadow: 'shadow-slate-400/15',  text: 'text-slate-300',  ring: 'ring-slate-400/15',  bg: 'bg-slate-400/5' },
  { gradient: 'from-amber-600 to-amber-800',  shadow: 'shadow-amber-600/15',  text: 'text-amber-500',  ring: 'ring-amber-600/15',  bg: 'bg-amber-600/5' },
];

export default function FeaturesSection() {
  const { leaderboard } = useLeaderboard();
  const { challenges } = useChallenges();

  const top5 = leaderboard.slice(0, 5);
  const activeChallenges = challenges.filter(c => c.isActive);

  const categoryMap = new Map<ChallengeCategory, number>();
  for (const c of activeChallenges) {
    categoryMap.set(c.category, (categoryMap.get(c.category) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);
  const maxCount = categories.length > 0 ? categories[0][1] : 1;

  return (
    <div id="arena" className="relative py-20 sm:py-28 bg-slate-950">
      {/* Section background */}
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          <span className="font-mono text-[11px] text-indigo-400/70 uppercase tracking-[0.2em]">The Arena</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            What's waiting for you
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* Left: Challenges — 2 columns */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 border border-white/[0.04] p-6 sm:p-7 card-shine border-glow-indigo">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h3 className="font-display text-lg font-bold text-white">Challenges</h3>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">{activeChallenges.length} active</p>
              </div>
              <Link
                to={ROUTES.CHALLENGES}
                className="group flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition font-mono"
              >
                browse
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="space-y-5">
                {categories.map(([cat, count]) => {
                  const config = CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG.Misc;
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs ${config.color} opacity-50`}>{config.icon}</span>
                          <span className={`text-sm font-medium ${config.color}`}>{cat}</span>
                        </div>
                        <span className="font-mono text-xs text-slate-600">{count}</span>
                      </div>
                      <div className="h-1 bg-slate-800/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${config.bar} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-slate-600 font-mono">// challenges loading...</p>
              </div>
            )}
          </div>

          {/* Right: Hall of Fame — 3 columns */}
          <div className="lg:col-span-3 rounded-2xl bg-slate-900/50 border border-white/[0.04] p-6 sm:p-7 card-shine relative overflow-hidden">
            {/* Subtle gold ambiance for #1 */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-7 relative z-10">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="font-display text-lg font-bold text-white">Hall of Fame</h3>
              </div>
              <Link
                to={ROUTES.LEADERBOARD}
                className="group flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition font-mono"
              >
                leaderboard
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {top5.length > 0 ? (
              <div className="space-y-2 relative z-10">
                {top5.map((player, i) => {
                  const isTopThree = i < 3;
                  const rankColor = RANK_COLORS[i];

                  return (
                    <Link
                      key={player.id}
                      to={`/profile/${player.id}`}
                      className={`group flex items-center gap-4 p-3 sm:p-3.5 rounded-xl transition-all duration-300 ${
                        i === 0
                          ? 'champion-glow bg-gradient-to-r from-yellow-500/[0.06] via-amber-500/[0.03] to-transparent ring-1 ring-yellow-500/15 hover:ring-yellow-500/25'
                          : isTopThree
                          ? `${rankColor.bg} ring-1 ${rankColor.ring} hover:bg-slate-800/30`
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Rank number */}
                      <div className="w-7 flex justify-center shrink-0">
                        <span className={`font-mono text-sm font-bold ${
                          isTopThree ? rankColor.text : 'text-slate-600'
                        }`}>
                          {i + 1}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-lg ${
                        isTopThree ? `bg-gradient-to-br ${rankColor.gradient} ${rankColor.shadow}` : 'bg-gradient-to-br from-slate-700 to-slate-800'
                      }`}>
                        <span className="text-white font-display font-bold text-sm">{player.username.charAt(0).toUpperCase()}</span>
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold font-display truncate transition-colors ${
                          i === 0 ? 'text-yellow-50 group-hover:text-yellow-300' : 'text-white group-hover:text-indigo-400'
                        }`}>
                          {player.username}
                        </p>
                        <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                          {player.solvedChallenges} solves
                        </p>
                      </div>

                      {/* Points */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Zap className={`w-3.5 h-3.5 ${i === 0 ? 'text-yellow-400' : 'text-indigo-400/70'}`} />
                        <span className={`font-mono text-sm font-bold ${
                          i === 0 ? 'text-yellow-400 text-glow-gold' : 'text-indigo-400'
                        }`}>
                          {player.currentPoints.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 relative z-10">
                <p className="font-mono text-sm text-slate-600">// no players yet</p>
                <p className="text-xs text-slate-700 mt-1">Be the first to claim the throne</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
