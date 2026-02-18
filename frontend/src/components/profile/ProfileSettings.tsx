import { useState } from 'react';
import { Key, UserX, AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';

function InputField({ type = 'text', placeholder }: { type?: string; placeholder: string }) {
  return (
    <input type={type} placeholder={placeholder}
      className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" />
  );
}

export default function ProfileSettings() {
  const [showDisband, setShowDisband] = useState(false);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="glass rounded-xl p-5 gradient-border">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" /> Change Password
        </h4>
        <div className="space-y-3 max-w-sm">
          <InputField type="password" placeholder="Current password" />
          <InputField type="password" placeholder="New password" />
          <InputField type="password" placeholder="Confirm new password" />
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]">
            Update Password
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-5 border-red-500/10">
        <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h4>
        <p className="text-xs text-slate-500 mb-3">Destructive actions that cannot be undone.</p>
        <button onClick={() => setShowDisband(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all active:scale-[0.98]">
          <UserX className="w-4 h-4" /> Disband Team
        </button>
      </div>

      <Modal isOpen={showDisband} onClose={() => setShowDisband(false)} title="Disband Team" onConfirm={() => setShowDisband(false)} confirmLabel="Disband" confirmVariant="danger">
        <p className="text-sm text-slate-400">Are you sure you want to disband your team? This action cannot be undone and all members will be removed.</p>
      </Modal>
    </div>
  );
}
