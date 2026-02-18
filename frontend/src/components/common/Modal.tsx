import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
}

export default function Modal({ isOpen, onClose, title, children, onConfirm, confirmLabel = 'Confirm', confirmVariant = 'primary' }: ModalProps) {
  if (!isOpen) return null;

  const confirmClass = confirmVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl shadow-2xl w-full max-w-md mx-4 gradient-border animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {onConfirm && (
          <div className="flex justify-end gap-3 p-5 border-t border-white/[0.06]">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-lg active:scale-[0.98] ${confirmClass}`}>
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
