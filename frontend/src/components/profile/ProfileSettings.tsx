import { useState } from 'react';
import { Key, UserX } from 'lucide-react';
import Modal from '../common/Modal';

export default function ProfileSettings() {
  const [showDisband, setShowDisband] = useState(false);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Settings</h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-400" /> Change Password
          </h4>
          <div className="space-y-3 max-w-sm">
            <input type="password" placeholder="Current password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            <input type="password" placeholder="New password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            <input type="password" placeholder="Confirm new password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
              Update Password
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <UserX className="w-4 h-4" /> Danger Zone
          </h4>
          <button onClick={() => setShowDisband(true)} className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-600/20 transition">
            Disband Team
          </button>
        </div>
      </div>

      <Modal isOpen={showDisband} onClose={() => setShowDisband(false)} title="Disband Team" onConfirm={() => setShowDisband(false)} confirmLabel="Disband" confirmVariant="danger">
        <p className="text-sm text-slate-400">Are you sure you want to disband your team? This action cannot be undone and all members will be removed.</p>
      </Modal>
    </div>
  );
}
