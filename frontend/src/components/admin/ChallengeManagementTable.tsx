import { Plus, Edit, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { useState } from 'react';
import { getDifficultyColor } from '../../utils/challengeUtils';
import Modal from '../common/Modal';
import type { Challenge } from '../../types';

function ChallengeRow({ challenge, onToggleActive }: { challenge: Challenge; onToggleActive: () => void }) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-white">{challenge.title}</p>
        <p className="text-xs text-slate-500 line-clamp-1">{challenge.description}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">{challenge.category}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-indigo-400">{challenge.points}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={onToggleActive} title={challenge.isActive ? 'Deactivate' : 'Activate'}
            className={`p-1.5 rounded transition ${challenge.isActive ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-500 hover:bg-slate-800'}`}>
            {challenge.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
          <button title="Edit" className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition">
            <Edit className="w-4 h-4" />
          </button>
          <button title="Upload file" className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded transition">
            <Upload className="w-4 h-4" />
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Challenge Management</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
          <Plus className="w-4 h-4" /> Create Challenge
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                {['Challenge', 'Category', 'Difficulty', 'Points', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {challenges.map(c => <ChallengeRow key={c.id} challenge={c} onToggleActive={() => onToggleActive(c.id)} />)}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Challenge" onConfirm={() => setShowModal(false)} confirmLabel="Create">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="Challenge title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" placeholder="Challenge description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {['Web', 'Crypto', 'Pwn', 'Reverse', 'Misc', 'Forensics'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Points</label>
            <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Files</label>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 border-dashed rounded-lg text-sm text-slate-400 hover:text-white hover:border-slate-600 transition w-full justify-center">
              <Upload className="w-4 h-4" /> Upload Challenge Files
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
