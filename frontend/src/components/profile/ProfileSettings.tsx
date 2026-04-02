import { useState } from 'react';
import { Key, UserX, AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import { userService } from '../../services/userService';
import { useAxios } from '../../context/AxiosContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { USE_MOCK } from '../../config';

export default function ProfileSettings() {
  const api = useAxios();
  const { user } = useAuth();
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDisband, setShowDisband] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword) {
      toast.error('Fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (USE_MOCK) {
      toast.success('Password updated (mock)');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      return;
    }

    try {
      const res = await userService.updateProfile(api, user!.id, {
        username: user!.username,
        email: user!.email,
        currentPassword,
        newPassword,
      });
      if (res.isSuccess) {
        toast.success('Password updated');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to update password');
    }
  };

  const inputClass = "w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="glass rounded-xl p-5 gradient-border">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" /> Change Password
        </h4>
        <div className="space-y-3 max-w-sm">
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className={inputClass} />
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min. 8 chars)" className={inputClass} />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className={inputClass} />
          <button onClick={handleChangePassword} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]">
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
