interface StatusBadgeProps {
  status: 'online' | 'offline' | 'banned' | 'active' | 'running' | 'stopped' | 'error';
  label?: string;
}

const STATUS_STYLES: Record<StatusBadgeProps['status'], string> = {
  online: 'bg-green-400/10 text-green-400 border-green-400/20',
  active: 'bg-green-400/10 text-green-400 border-green-400/20',
  running: 'bg-green-400/10 text-green-400 border-green-400/20',
  offline: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  stopped: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  banned: 'bg-red-400/10 text-red-400 border-red-400/20',
  error: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const DOT_COLORS: Record<StatusBadgeProps['status'], string> = {
  online: 'bg-green-400',
  active: 'bg-green-400',
  running: 'bg-green-400',
  offline: 'bg-slate-400',
  stopped: 'bg-yellow-400',
  banned: 'bg-red-400',
  error: 'bg-red-400',
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[status]}`} />
      {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
