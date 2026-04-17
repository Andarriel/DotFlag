import { Users, Flag, Container, Megaphone, ScrollText, CalendarClock } from 'lucide-react';
import { useAdminContext } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import type { AdminTab } from '../../hooks/useAdmin';

type TabConfig = { id: AdminTab; label: string; icon: typeof Users; ownerOnly?: boolean };

const TABS: TabConfig[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'challenges', label: 'Challenges', icon: Flag },
  { id: 'notifications', label: 'Notifications', icon: Megaphone },
  { id: 'docker', label: 'Docker', icon: Container },
  { id: 'logs', label: 'Audit Logs', icon: ScrollText },
  { id: 'ctf', label: 'CTF Event', icon: CalendarClock, ownerOnly: true },
];

export default function AdminSidebar() {
  const { activeTab, setActiveTab } = useAdminContext();
  const { user } = useAuth();
  const isOwner = user?.role === 'Owner';
  const visibleTabs = TABS.filter(t => !t.ownerOnly || isOwner);

  return (
    <div className="w-full lg:w-60 glass rounded-2xl p-3 gradient-border">
      <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Navigation</h3>
      <nav className="space-y-1">
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/10'
                : 'text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
