import { ShieldCheck, ShieldOff, Ban, UserPlus, Trash2, Flag, Flame, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import { useAdminContext } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import type { AdminUser } from '../../types';
import type { UserRole } from '../../types/api';
import type { ApiSubmission } from '../../services/submissionService';

const ROLES: UserRole[] = ['Guest', 'User', 'Admin'];

function UserSolvesModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const { getUserSolves, deleteSolve } = useAdminContext();
  const [solves, setSolves] = useState<ApiSubmission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getUserSolves(user.id).then(data => {
      setSolves(data);
      setLoading(false);
    });
  }, [user.id]);

  const handleDelete = async (submissionId: number) => {
    setDeleting(true);
    const ok = await deleteSolve(submissionId);
    if (ok) setSolves(prev => prev ? prev.filter(s => s.id !== submissionId) : null);
    setConfirmId(null);
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 glass rounded-2xl gradient-border w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white">Solves — {user.username}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Delete a solve to restore points and remove first blood</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-500 text-sm">Loading solves…</div>
          ) : !solves || solves.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-slate-600 text-sm">No solves found</div>
          ) : (
            <div className="space-y-1.5">
              {solves.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 px-3.5 py-3 bg-slate-800/40 hover:bg-slate-800/60 rounded-xl transition group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white truncate">{s.challengeName}</span>
                      {s.bonusPoints > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                          <Flame className="w-3 h-3" /> First Blood
                        </span>
                      )}
                      {!s.isChallengeActive && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded-md">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-indigo-400 font-semibold">+{s.challengeCurrentPoints} pts</span>
                      {s.bonusPoints > 0 && (
                        <span className="text-xs text-amber-500/70">+{s.bonusPoints} bonus</span>
                      )}
                      <span className="text-[11px] text-slate-600">
                        {new Date(s.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {confirmId === s.id ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-700/50 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition disabled:opacity-50"
                      >
                        {deleting ? '…' : 'Confirm'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(s.id)}
                      title="Delete solve"
                      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserRow({
  user, onToggleBan, onPromote, onDemote, onDelete, onViewSolves,
}: {
  user: AdminUser;
  onToggleBan: () => void;
  onPromote?: () => void;
  onDemote?: () => void;
  onDelete: () => void;
  onViewSolves: () => void;
}) {
  return (
    <tr className="hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3">
        <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">{user.username}</p>
            <p className="text-[11px] text-slate-600">{user.email}</p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3">
        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/50 border border-white/[0.04] px-2 py-0.5 rounded-md">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-[11px] text-slate-500 hidden md:table-cell">
        {user.lastLogin ? formatTimeAgo(user.lastLogin) : <span className="text-slate-700">never</span>}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          <button
            onClick={onViewSolves}
            title="View solves"
            className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
          {user.role === 'User' && onPromote && (
            <button
              onClick={onPromote}
              title="Promote to Admin"
              className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          )}
          {user.role === 'Admin' && onDemote && (
            <button
              onClick={onDemote}
              title="Demote to User"
              className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition"
            >
              <ShieldOff className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onToggleBan}
            title={user.isBanned ? 'Unban' : 'Ban'}
            className={`p-1.5 rounded-lg transition ${user.isBanned ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'}`}
          >
            <Ban className="w-3.5 h-3.5" />
          </button>
          {user.role !== 'Owner' && (
            <button
              onClick={onDelete}
              title="Delete user"
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

const inputClass = "w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";
const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 cursor-pointer`;

export default function UserManagementTable() {
  const { user } = useAuth();
  const isOwner = user?.role === 'Owner';
  const { users, toggleBan, promote, demote, deleteUser, registerUser } = useAdminContext();
  const [showModal, setShowModal] = useState(false);
  const [solvesUser, setSolvesUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<{ username: string; email: string; password: string; role: UserRole }>({
    username: '', email: '', password: '', role: 'User',
  });

  const handleRegister = async () => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) return;
    await registerUser(formData);
    setFormData({ username: '', email: '', password: '', role: 'User' });
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" /> Register User
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden gradient-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/30 border-b border-white/[0.04]">
              <tr>
                {['User', 'Role', 'Last Login', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${i === 2 ? 'hidden md:table-cell' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {users.map(u => (
                <UserRow
                  key={u.id}
                  user={u}
                  onViewSolves={() => setSolvesUser(u)}
                  onToggleBan={() => toggleBan(u.id)}
                  onPromote={isOwner ? () => promote(u.id) : undefined}
                  onDemote={isOwner ? () => demote(u.id) : undefined}
                  onDelete={() => deleteUser(u.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {solvesUser && <UserSolvesModal user={solvesUser} onClose={() => setSolvesUser(null)} />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register New User" onConfirm={handleRegister} confirmLabel="Register">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData(p => ({ ...p, username: e.target.value }))}
              className={inputClass}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              className={inputClass}
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
              className={inputClass}
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData(p => ({ ...p, role: e.target.value as UserRole }))}
              className={selectClass}
              style={{ colorScheme: 'dark' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
