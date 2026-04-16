import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Flame, Megaphone, Info, CheckCheck, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const TYPE_CONFIG: Record<string, { icon: typeof Flame; color: string; bg: string }> = {
  firstBlood: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  announcement: { icon: Megaphone, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  system: { icon: Info, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const panelWidth = 288;
    let left = rect.left + rect.width / 2 - panelWidth / 2;
    left = Math.min(left, window.innerWidth - panelWidth - 12);
    left = Math.max(12, left);
    setPos({ top: rect.bottom + 8, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const panel = open ? createPortal(
    <div
      ref={panelRef}
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
      className="w-72 glass rounded-xl gradient-border shadow-2xl shadow-black/50 overflow-hidden animate-fade-in"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <h3 className="text-xs font-bold text-white">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition">
              <CheckCheck className="w-3 h-3" /> Read all
            </button>
          )}
          <button onClick={() => setOpen(false)} className="text-slate-600 hover:text-white transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="w-6 h-6 text-slate-800 mx-auto mb-1.5" />
            <p className="text-[11px] text-slate-600">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => {
            const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={`px-3 py-2 flex items-center gap-2.5 border-b border-white/[0.03] last:border-0 ${
                  !n.isRead ? 'bg-indigo-500/[0.04]' : ''
                }`}
              >
                <div className={`w-7 h-7 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                    {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{n.message}</p>
                </div>
                <span className="text-[10px] text-slate-600 shrink-0">{timeAgo(n.createdOn)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/40" />
        )}
      </button>
      {panel}
    </>
  );
}
