import { X, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
}

export default function Modal({
  isOpen, onClose, title, children,
  onConfirm, confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  confirmDisabled = false,
  confirmLoading = false,
}: ModalProps) {
  if (!isOpen) return null;

  const confirmClass = confirmVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20';

  const handleClose = () => { if (!confirmLoading) onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative glass-strong rounded-2xl shadow-2xl w-full max-w-md mx-4 gradient-border animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={handleClose}
            disabled={confirmLoading}
            className="p-1 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {onConfirm && (
          <div className="flex justify-end gap-3 p-5 border-t border-white/[0.06]">
            <button
              onClick={handleClose}
              disabled={confirmLoading}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmDisabled || confirmLoading}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${confirmClass}`}
            >
              {confirmLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
