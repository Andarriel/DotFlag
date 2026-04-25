import { useState, useEffect } from 'react';
import { Timer, Calendar, ChevronRight, Flag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';
import { useCtfStatus } from '../../context/CtfStatusContext';

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
  const { status } = useCtfStatus();
  const target = status?.state === 'Running' ? status.endTime : status?.state === 'Upcoming' ? status.startTime : undefined;
  const countdown = useCountdown(target);

  if (!status) {
    return (
      <div className="border-y border-white/[0.04] bg-slate-950/80 backdrop-blur-sm relative z-10 h-[88px]" />
    );
  }

  if (status.state === 'Running' && countdown && !countdown.ended) {
    return (
      <div className="relative border-y border-white/[0.04] bg-slate-950/90 backdrop-blur-sm z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <div>
                <span className="font-mono text-[10px] font-medium text-green-400 uppercase tracking-[0.15em]">Competition Live</span>
                <p className="text-base sm:text-lg font-display font-bold text-white">{status.name}</p>
              </div>
            </div>

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

  if (status.state === 'Upcoming' && countdown) {
    return (
      <div className="relative border-y border-white/[0.04] bg-slate-950/90 backdrop-blur-sm z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center">
                <Calendar className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-indigo-400/70 uppercase tracking-[0.15em]">Starts In</span>
                <p className="text-base sm:text-lg font-display font-bold text-white">{status.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
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

  if (status.state === 'ComingSoon') {
    return (
      <div className="relative border-y border-white/[0.04] bg-slate-950/90 backdrop-blur-sm z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-amber-400/70 uppercase tracking-[0.15em]">Coming Soon</span>
                <p className="text-base font-display font-semibold text-white">{status.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Follow our social media for the start announcement.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-y border-white/[0.04] bg-slate-950/80 backdrop-blur-sm relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
              <Flag className="w-4.5 h-4.5 text-rose-400" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-rose-400/70 uppercase tracking-[0.15em]">Ended</span>
              <p className="text-base font-display font-semibold text-white">
                <span>{status.name}</span>
                <span className="text-slate-500 ml-2 text-sm">
                  closed {new Date(status.endTime).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.LEADERBOARD}
            className="rounded-xl bg-slate-700/50 hover:bg-slate-700/70 border border-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition-all"
          >
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
}
