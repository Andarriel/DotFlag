import { ShieldCheck, Ban, LogOut, UserPlus } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import type { AdminUser } from '../../types';
import { formatTimeAgo } from '../../utils/leaderboardUtils';

function UserRow({ user, onToggleBan, onKick, onPromote }: { user: AdminUser; onToggleBan: () => void; onKick: () => void; onPromote: () => void }) {
  return (
    <tr className="hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.username}</p>
            <p className="text-[11px] text-slate-600">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/50 border border-white/[0.04] px-2 py-0.5 rounded-md">{user.role}</span>
      </td>
      <td className="px-4 py-3">
        {user.isBanned ? <StatusBadge status="banned" /> : user.sessionActive ? <StatusBadge status="online" /> : <StatusBadge status="offline" />}
      </td>
      <td className="px-4 py-3 text-[11px] text-slate-500 hidden md:table-cell">{formatTimeAgo(user.lastLogin)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          {user.role !== 'Admin' && user.role !== 'Owner' && (
            <button onClick={onPromote} title="Promote to Admin" className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition">
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onToggleBan} title={user.isBanned ? 'Unban' : 'Ban'} className={`p-1.5 rounded-lg transition ${user.isBanned ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'}`}>
            <Ban className="w-3.5 h-3.5" />
          </button>
          {user.sessionActive && (
            <button onClick={onKick} title="Kick from session" className="p-1.5 text-slate-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

interface UserManagementTableProps {
  users: AdminUser[];
  onToggleBan: (id: number) => void;
  onKickSession: (id: number) => void;
  onPromote: (id: number) => void;
}

export default function UserManagementTable({ users, onToggleBan, onKickSession, onPromote }: UserManagementTableProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">User Management</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
          <UserPlus className="w-4 h-4" /> Register User
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden gradient-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/30 border-b border-white/[0.04]">
              <tr>
                {['User', 'Role', 'Status', 'Last Login', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${i === 3 ? 'hidden md:table-cell' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {users.map(user => (
                <UserRow key={user.id} user={user} onToggleBan={() => onToggleBan(user.id)} onKick={() => onKickSession(user.id)} onPromote={() => onPromote(user.id)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register New User" onConfirm={() => setShowModal(false)} confirmLabel="Register">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
            <input type="text" className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" placeholder="Enter email" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
            <select className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all">
              <option>Guest</option>
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
