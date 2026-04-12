import { useState, useEffect } from 'react';
import { Timer, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

interface CompetitionInfo {
  isActive: boolean;
  name: string;
  endsAt?: string;
  startsAt?: string;
}

// TODO: replace with real data from backend
const MOCK_COMPETITION: CompetitionInfo = {
  isActive: true,
  name: 'DotFlag Spring 2026',
  endsAt: '2026-04-15T23:59:00Z',
};

function useCountdown(target?: string) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!target) return null;
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    ended: diff <= 0,
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{label}</span>
    </div>
  );
}

export default function StatsSection() {
  const comp = MOCK_COMPETITION;
  const countdown = useCountdown(comp.endsAt);

  if (comp.isActive && countdown && !countdown.ended) {
    return (
      <div className="relative border-y border-white/[0.04] bg-slate-950/90 backdrop-blur-sm z-10 overflow-hidden">
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: status + name */}
            <div className="flex items-center gap-4">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <div>
                <span className="font-mono text-[10px] font-medium text-green-400 uppercase tracking-[0.15em]">Competition Live</span>
                <p className="text-base sm:text-lg font-display font-bold text-white">{comp.name}</p>
              </div>
            </div>

            {/* Center: countdown */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Timer className="w-4 h-4 text-slate-600 hidden sm:block" />
              <div className="flex items-center gap-3">
                <CountdownUnit value={countdown.days} label="Days" />
                <span className="text-slate-600 font-mono text-lg mt-[-12px]">:</span>
                <CountdownUnit value={countdown.hours} label="Hrs" />
                <span className="text-slate-600 font-mono text-lg mt-[-12px]">:</span>
                <CountdownUnit value={countdown.minutes} label="Min" />
                <span className="text-slate-600 font-mono text-lg mt-[-12px]">:</span>
                <CountdownUnit value={countdown.seconds} label="Sec" />
              </div>
            </div>

            {/* Right: CTA */}
            <Link
              to={ROUTES.CHALLENGES}
              className="group flex items-center gap-2 rounded-xl bg-green-600/90 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-all shadow-lg shadow-green-500/10 hover:shadow-green-500/20"
            >
              Enter Arena
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Inactive state
  return (
    <div className="border-y border-white/[0.04] bg-slate-950/80 backdrop-blur-sm relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-700/30 border border-white/[0.06] flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-slate-500" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.15em]">Upcoming</span>
              {comp.startsAt ? (
                <p className="text-base font-display font-semibold text-white">
                  <span className="text-indigo-400">{comp.name}</span>
                  <span className="text-slate-500 ml-2 text-sm">
                    {new Date(comp.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-slate-400">Stay tuned for upcoming events</p>
              )}
            </div>
          </div>
          <Link
            to={ROUTES.REGISTER}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
