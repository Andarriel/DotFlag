import { Plus, Edit, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { useState } from 'react';
import { getDifficultyColor } from '../../utils/challengeUtils';
import Modal from '../common/Modal';
import type { Challenge } from '../../types';

function ChallengeRow({ challenge, onToggleActive }: { challenge: Challenge; onToggleActive: () => void }) {
  return (
    <tr className="hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-white">{challenge.title}</p>
        <p className="text-[11px] text-slate-600 line-clamp-1">{challenge.description}</p>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-[11px] text-slate-400 bg-slate-800/50 border border-white/[0.04] px-2 py-0.5 rounded-md">{challenge.category}</span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-bold text-indigo-400">{challenge.points}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          <button onClick={onToggleActive} title={challenge.isActive ? 'Deactivate' : 'Activate'}
            className={`p-1.5 rounded-lg transition ${challenge.isActive ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-600 hover:bg-slate-800/50'}`}>
            {challenge.isActive ? <ToggleRight className="w-4.5 h-4.5" /> : <ToggleLeft className="w-4.5 h-4.5" />}
          </button>
          <button title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button title="Upload file" className="p-1.5 text-slate-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition">
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface ChallengeManagementTableProps {
  challenges: Challenge[];
  onToggleActive: (id: number) => void;
}

export default function ChallengeManagementTable({ challenges, onToggleActive }: ChallengeManagementTableProps) {
  const [showModal, setShowModal] = useState(false);
  const headers = [
    { label: 'Challenge', className: '' },
    { label: 'Category', className: 'hidden sm:table-cell' },
    { label: 'Difficulty', className: 'hidden md:table-cell' },
    { label: 'Points', className: '' },
    { label: 'Actions', className: '' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Challenge Management</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Create Challenge
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden gradient-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/30 border-b border-white/[0.04]">
              <tr>
                {headers.map(h => (
                  <th key={h.label} className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${h.className}`}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {challenges.map(c => <ChallengeRow key={c.id} challenge={c} onToggleActive={() => onToggleActive(c.id)} />)}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Challenge" onConfirm={() => setShowModal(false)} confirmLabel="Create">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
            <input type="text" className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" placeholder="Challenge title" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea rows={3} className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none" placeholder="Challenge description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
              <select className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all">
                {['Web', 'Crypto', 'Pwn', 'Reverse', 'Misc', 'Forensics'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Difficulty</label>
              <select className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all">
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Points</label>
            <input type="number" className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" placeholder="100" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Files</label>
            <button type="button" className="flex items-center gap-2 px-4 py-2.5 glass border-dashed rounded-xl text-sm text-slate-500 hover:text-white hover:border-indigo-500/30 transition w-full justify-center">
              <Upload className="w-4 h-4" /> Upload Challenge Files
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
