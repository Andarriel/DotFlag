import { useEffect, useState, type ReactNode } from 'react';
import { Hourglass, Swords, Flag } from 'lucide-react';
import { useCtfStatus } from '../../context/CtfStatusContext';
import { useAuth } from '../../context/AuthContext';

interface CtfGateProps {
  children: ReactNode;
}

function formatCountdown(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const s = Math.floor(diff / 1000) % 60;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  return { d, h, m, s, done: false };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function CtfGate({ children }: CtfGateProps) {
  const { status, loading, refresh } = useCtfStatus();
  const { user } = useAuth();
  const isStaff = user?.role === 'Admin' || user?.role === 'Owner';

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!status || status.state === 'Running') return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (!status || status.state !== 'Upcoming') return;
    const ms = new Date(status.startTime).getTime() - Date.now();
    if (ms <= 0) {
      refresh();
      return;
    }
    const id = setTimeout(refresh, ms + 500);
    return () => clearTimeout(id);
  }, [status, refresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!status) return <>{children}</>;
  if (status.state === 'Running') return <>{children}</>;
  if (isStaff) {
    return (
      <>
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
          <div className="glass gradient-border rounded-full px-4 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <p className="font-mono text-[10px] text-amber-300 uppercase tracking-[0.2em]">
              Admin preview · CTF {status.state}
            </p>
          </div>
        </div>
        {children}
      </>
    );
  }

  const isUpcoming = status.state === 'Upcoming';
  const targetDate = new Date(isUpcoming ? status.startTime : status.endTime);
  const c = formatCountdown(targetDate);

  return (
    <div className="min-h-screen bg-slate-950 hero-gradient grid-overlay relative overflow-hidden flex items-center justify-center pt-24 pb-12">
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none ${
          isUpcoming ? 'bg-indigo-500/[0.08]' : 'bg-rose-500/[0.05]'
        }`}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center glass gradient-border ${
              isUpcoming ? 'text-indigo-300' : 'text-rose-300'
            }`}>
              {isUpcoming ? (
                <Hourglass className="w-6 h-6 animate-float" />
              ) : (
                <Flag className="w-6 h-6" />
              )}
            </div>
            <div className={`absolute -inset-4 rounded-2xl blur-xl -z-10 animate-pulse-slow ${
              isUpcoming ? 'bg-indigo-500/10' : 'bg-rose-500/8'
            }`} />
          </div>
        </div>

        <p className={`font-mono text-[11px] uppercase tracking-[0.3em] mb-4 ${
          isUpcoming ? 'text-indigo-400/70' : 'text-rose-400/70'
        }`}>
          {isUpcoming ? 'The battle begins in' : 'The gauntlet has closed'}
        </p>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-glow mb-3">
          {isUpcoming ? (
            <span className="text-gradient">{status.name}</span>
          ) : (
            <span>Game Over</span>
          )}
        </h1>

        <p className="text-sm text-slate-500 mb-10 sm:mb-14">
          {isUpcoming
            ? 'Sharpen your blades. The arena is sealed until start.'
            : `${status.name} has ended. Hall of Fame is etched in stone.`}
        </p>

        {isUpcoming ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto mb-12">
            {[
              { label: 'days', value: c.d },
              { label: 'hours', value: c.h },
              { label: 'minutes', value: c.m },
              { label: 'seconds', value: c.s },
            ].map(({ label, value }) => (
              <div key={label} className="glass gradient-border rounded-2xl p-3 sm:p-5 relative">
                <div className="absolute inset-0 rounded-2xl border-glow-indigo pointer-events-none" />
                <p className="font-display text-3xl sm:text-5xl font-bold text-white tabular-nums">
                  {pad(value)}
                </p>
                <p className="font-mono text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 glass gradient-border rounded-full px-5 py-2.5 mb-12">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-[0.2em]">
              Ended {new Date(status.endTime).toLocaleDateString()}
            </span>
          </div>
        )}

        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.2em]">
          {isUpcoming ? `Starts ${new Date(status.startTime).toLocaleString()}` : ''}
        </p>
      </div>
    </div>
  );
}
