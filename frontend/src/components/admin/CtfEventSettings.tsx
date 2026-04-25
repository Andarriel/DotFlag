import { useEffect, useState } from 'react';
import { Save, CalendarClock, Hourglass, Flag, Swords, Sparkles } from 'lucide-react';
import { ctfEventService } from '../../services/ctfEventService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import { useCtfStatus } from '../../context/CtfStatusContext';
import type { CtfState } from '../../types/api';

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function STATE_STYLE(state: CtfState) {
  switch (state) {
    case 'Running':
      return { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', Icon: Swords, label: 'Live' };
    case 'Upcoming':
      return { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', Icon: Hourglass, label: 'Upcoming' };
    case 'Ended':
      return { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', Icon: Flag, label: 'Ended' };
    case 'ComingSoon':
      return { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', Icon: Sparkles, label: 'Coming Soon' };
  }
}

export default function CtfEventSettings() {
  const api = useAxios();
  const toast = useToast();
  const { status, refresh } = useCtfStatus();

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!status) return;
    setName(status.name);
    setStartTime(toLocalInput(status.startTime));
    setEndTime(toLocalInput(status.endTime));
    setIsComingSoon(status.state === 'ComingSoon');
  }, [status]);

  const handleSave = async () => {
    if (!name.trim() || (!isComingSoon && (!startTime || !endTime)) || saving) return;
    setSaving(true);
    try {
      const res = await ctfEventService.update(api, {
        name,
        startTime: new Date(startTime || Date.now()).toISOString(),
        endTime: new Date(endTime || Date.now()).toISOString(),
        isComingSoon,
      });
      if (res.isSuccess) {
        toast.success('CTF event updated');
        refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to update CTF event');
    } finally {
      setSaving(false);
    }
  };

  if (!status) {
    return (
      <div className="glass rounded-2xl p-6 gradient-border">
        <p className="text-sm text-slate-500">Loading CTF event...</p>
      </div>
    );
  }

  const s = STATE_STYLE(status.state);
  const Icon = s.Icon;

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">CTF Event</h2>
            <p className="text-sm text-slate-500">Configure the event window. Only the Owner can change these.</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${s.bg}`}>
            <Icon className={`w-3.5 h-3.5 ${s.color}`} />
            <span className={`font-mono text-[11px] uppercase tracking-[0.15em] ${s.color}`}>{s.label}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. DotFlag Spring 2026"
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 cursor-pointer select-none hover:bg-amber-500/10 transition-colors">
            <input
              type="checkbox"
              checked={isComingSoon}
              onChange={e => setIsComingSoon(e.target.checked)}
              className="w-4 h-4 accent-amber-400 shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-amber-300">Coming Soon mode</p>
              <p className="text-[11px] text-slate-500 mt-0.5">No start date — shows a teaser to users and directs them to social media for updates.</p>
            </div>
          </label>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity ${isComingSoon ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" />
                Start
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" />
                End
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-600 font-mono">
            Stored in UTC. Input is interpreted in your local time.
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || (!isComingSoon && (!startTime || !endTime))}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
