import { useState } from 'react';
import { Send, Megaphone, Flame, Info } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';

const TYPES = [
  { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/20' },
  { value: 'firstBlood', label: 'First Blood', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/20' },
  { value: 'system', label: 'System', icon: Info, color: 'text-slate-400', bg: 'bg-slate-500/15 border-slate-500/20' },
];

export default function NotificationBroadcast() {
  const api = useAxios();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim() || sending) return;
    setSending(true);
    try {
      await notificationService.create(api, { title, message, type });
      toast.success('Notification sent to all users');
      setTitle('');
      setMessage('');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 gradient-border">
        <h2 className="text-lg font-bold text-white mb-1">Broadcast Notification</h2>
        <p className="text-sm text-slate-500 mb-5">Send a notification to all platform users.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
                      type === t.value
                        ? `${t.bg} ${t.color}`
                        : 'border-white/[0.04] text-slate-500 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. New challenges available!"
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              rows={3}
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sending || !title.trim() || !message.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>
    </div>
  );
}
