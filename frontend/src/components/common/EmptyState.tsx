import type { LucideIcon } from 'lucide-react';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon = FileX, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-16 h-16 bg-slate-800/50 border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-5">{description}</p>}
      {action && (
        <button onClick={action.onClick}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
          {action.label}
        </button>
      )}
    </div>
  );
}
