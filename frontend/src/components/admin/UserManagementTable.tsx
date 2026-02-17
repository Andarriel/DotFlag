import { ShieldCheck, Ban, LogOut, UserPlus } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import type { AdminUser } from '../../types';
import { formatTimeAgo } from '../../utils/leaderboardUtils';

function UserRow({ user, onToggleBan, onKick, onPromote }: { user: AdminUser; onToggleBan: () => void; onKick: () => void; onPromote: () => void }) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.username}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded">{user.role}</span>
      </td>
      <td className="px-4 py-3">
        {user.isBanned ? <StatusBadge status="banned" /> : user.sessionActive ? <StatusBadge status="online" /> : <StatusBadge status="offline" />}
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">{formatTimeAgo(user.lastLogin)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {user.role !== 'Admin' && user.role !== 'Owner' && (
            <button onClick={onPromote} title="Promote to Admin" className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition">
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
          <button onClick={onToggleBan} title={user.isBanned ? 'Unban' : 'Ban'} className={`p-1.5 rounded transition ${user.isBanned ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-400 hover:text-red-400 hover:bg-slate-800'}`}>
            <Ban className="w-4 h-4" />
          </button>
          {user.sessionActive && (
            <button onClick={onKick} title="Kick from session" className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded transition">
              <LogOut className="w-4 h-4" />
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
          <UserPlus className="w-4 h-4" /> Register User
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
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
            <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="Enter email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
              <option>User</option>
              <option>Moderator</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
