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
    <div className="w-full lg:w-64 bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Admin Panel</h3>
      <nav className="space-y-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
