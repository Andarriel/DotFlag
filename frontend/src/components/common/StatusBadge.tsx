interface StatusBadgeProps {
  status: 'online' | 'offline' | 'banned' | 'active' | 'running' | 'stopped' | 'error';
  label?: string;
}

const STATUS_STYLES: Record<StatusBadgeProps['status'], string> = {
  online: 'bg-green-500/10 text-green-400 border-green-500/15',
  active: 'bg-green-500/10 text-green-400 border-green-500/15',
  running: 'bg-green-500/10 text-green-400 border-green-500/15',
  offline: 'bg-slate-500/10 text-slate-400 border-slate-500/15',
  stopped: 'bg-amber-500/10 text-amber-400 border-amber-500/15',
  banned: 'bg-red-500/10 text-red-400 border-red-500/15',
  error: 'bg-red-500/10 text-red-400 border-red-500/15',
};

const DOT_COLORS: Record<StatusBadgeProps['status'], string> = {
  online: 'bg-green-400', active: 'bg-green-400', running: 'bg-green-400',
  offline: 'bg-slate-500', stopped: 'bg-amber-400',
  banned: 'bg-red-400', error: 'bg-red-400',
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const isAlive = status === 'online' || status === 'active' || status === 'running';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[status]} ${isAlive ? 'animate-pulse' : ''}`} />
      {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
