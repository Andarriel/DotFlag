import { Users, Flag, Container } from 'lucide-react';
import type { AdminTab } from '../../hooks/useAdmin';

const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'challenges', label: 'Challenges', icon: Flag },
  { id: 'docker', label: 'Docker', icon: Container },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <div className="w-full lg:w-60 glass rounded-2xl p-3 gradient-border">
      <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Navigation</h3>
      <nav className="space-y-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onTabChange(id)}
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
