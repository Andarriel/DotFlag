import { Link } from 'react-router-dom';
import { Crown, Zap, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../router/paths';
import { useLeaderboard } from '../../hooks/useLeaderboard';

function PlayerOnStep({
  player,
  rank,
}: {
  player: { id: number; username: string; currentPoints: number; solvedChallenges: number };
  rank: number;
}) {
  const isFirst = rank === 1;
  const gradients = [
    'from-yellow-400 via-amber-500 to-yellow-600',
    'from-slate-300 via-slate-400 to-slate-500',
    'from-amber-600 via-amber-700 to-amber-800',
  ];
  const pointColor = ['text-yellow-400', 'text-slate-300', 'text-amber-500'];
  const zapColor = ['text-yellow-400', 'text-slate-400', 'text-amber-500'];

  return (
    <Link to={`/profile/${player.id}`} className="group flex flex-col items-center text-center">
      {isFirst && (
        <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] mb-1 animate-float" />
      )}
      <div className="relative mb-1">
        <div className={`${isFirst ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-11 sm:h-11'} rounded-xl bg-gradient-to-br ${gradients[rank - 1]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
          isFirst ? 'shadow-yellow-500/25 ring-2 ring-yellow-400/20' : ''
        }`}>
          <span className={`text-white font-display font-bold ${isFirst ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
            {player.username.charAt(0).toUpperCase()}
          </span>
        </div>
        {isFirst && <div className="absolute -inset-2 rounded-xl bg-yellow-400/8 blur-lg -z-10 animate-pulse-slow" />}
      </div>
      <p className={`font-display font-bold truncate max-w-[100px] sm:max-w-[130px] transition-colors ${
        isFirst ? 'text-xs sm:text-sm text-yellow-50 group-hover:text-yellow-300' : 'text-[11px] sm:text-xs text-white group-hover:text-indigo-400'
      }`}>
        {player.username}
      </p>
      <div className="flex items-center gap-1 mt-0.5">
        <Zap className={`w-3 h-3 ${zapColor[rank - 1]}`} />
        <span className={`font-mono text-[10px] sm:text-[11px] font-bold ${pointColor[rank - 1]}`}>{player.currentPoints.toLocaleString()}</span>
      </div>
      <p className="font-mono text-[9px] text-slate-600">{player.solvedChallenges} solves</p>
    </Link>
  );
}

export default function HallOfFame() {
  const { leaderboard } = useLeaderboard();
  const top3 = leaderboard.slice(0, 3);

  if (top3.length < 3) {
    return (
      <div id="arena" className="relative py-20 sm:py-28 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-10 h-10 text-yellow-500/30 mx-auto mb-4" />
          <p className="font-display text-lg text-slate-500">The throne awaits its champions...</p>
        </div>
      </div>
    );
  }

  const stepColor = [
    'bg-yellow-500/25',
    'bg-slate-400/20',
    'bg-amber-600/20',
  ];

  const players = [
    { player: top3[0], rank: 1, side: 'right' as const },
    { player: top3[1], rank: 2, side: 'left' as const },
    { player: top3[2], rank: 3, side: 'right' as const },
  ];

  return (
    <div id="arena" className="relative py-16 sm:py-24 bg-slate-950 overflow-hidden">
      {/* Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* Dragon — positioned near #1 player, on the left side */}
      <img
        src="/dragon.svg"
        alt=""
        className="hidden md:block absolute left-[4%] lg:left-[10%] top-[28%] w-40 lg:w-56 opacity-[0.04] select-none pointer-events-none"
        style={{ filter: 'invert(1)' }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-lg sm:max-w-xl px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="font-mono text-[11px] text-yellow-500/50 uppercase tracking-[0.2em]">The Champions</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">Hall of Fame</h2>
        </div>

        {/* Staircase */}
        <div className="relative mx-auto" style={{ maxWidth: '400px' }}>

          {/* Central vertical spine — rendered BEHIND everything, starts below chest, ends above ground */}
          <div
            className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-yellow-500/20 via-slate-500/12 to-slate-700/8"
            style={{ top: '56px', bottom: '0' }}
          />

          {/* Chest at top */}
          <div className="relative flex justify-center pb-6 z-10">
            <div className="relative">
              <img
                src="/treasure-chest.svg"
                alt=""
                className="w-11 h-11 sm:w-13 sm:h-13 opacity-30"
                style={{ filter: 'invert(1)' }}
              />
              <div className="absolute -inset-5 bg-yellow-400/5 rounded-full blur-xl -z-10" />
            </div>
          </div>

          {/* Steps */}
          {players.map(({ player, rank, side }, i) => (
            <div key={player.id} className="relative mb-8 sm:mb-10 last:mb-8">
              {/* Player on their side */}
              <div className={`flex ${side === 'right' ? 'justify-end pr-2 sm:pr-4' : 'justify-start pl-2 sm:pl-4'} pb-1 relative z-10`}>
                <PlayerOnStep player={player} rank={rank} />
              </div>

              {/* Platform line — only on the player's half, doesn't cross the spine */}
              <div className="relative z-[5]">
                {side === 'right' ? (
                  <div className={`h-[3px] rounded-r-full ml-[calc(50%+1px)] ${stepColor[i]}`} />
                ) : (
                  <div className={`h-[3px] rounded-l-full mr-[calc(50%+1px)] ${stepColor[i]}`} />
                )}
              </div>
            </div>
          ))}

          {/* Ground line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-600/15 to-transparent" />
        </div>

        {/* Leaderboard link */}
        <div className="text-center mt-10 sm:mt-14">
          <Link
            to={ROUTES.LEADERBOARD}
            className="group inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-indigo-400 transition"
          >
            view full leaderboard
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
