import { Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getDifficultyColor } from '../../utils/challengeUtils';
import Modal from '../common/Modal';
import { useAdminContext } from '../../context/AdminContext';
import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '../../types';

const CATEGORIES: ChallengeCategory[] = ['Web', 'Crypto', 'Pwn', 'Reverse', 'Misc', 'Forensics', 'OSINT'];
const DIFFICULTIES: ChallengeDifficulty[] = ['Easy', 'Medium', 'Hard', 'Impossible'];

function ChallengeRow({ challenge, onToggleActive, onDelete }: { challenge: Challenge; onToggleActive: () => void; onDelete: () => void }) {
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
          <button onClick={onDelete} title="Delete" className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

const inputClass = "w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";
const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white`;
const labelClass = "block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

const INITIAL_FORM = {
  name: '', description: '', category: 'Web' as ChallengeCategory,
  difficulty: 'Easy' as ChallengeDifficulty,
  minPoints: 50, maxPoints: 500, decayRate: 30, firstBloodBonus: 10, flag: '',
};

export default function ChallengeManagementTable() {
  const { challenges, toggleChallengeActive, createChallenge, deleteChallenge } = useAdminContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const handleCreate = () => {
    if (!form.name || !form.description || !form.flag) return;
    createChallenge({
      name: form.name,
      description: form.description,
      category: CATEGORIES.indexOf(form.category),
      difficulty: DIFFICULTIES.indexOf(form.difficulty),
      minPoints: form.minPoints,
      maxPoints: form.maxPoints,
      decayRate: form.decayRate,
      firstBloodBonus: form.firstBloodBonus,
      flag: form.flag,
    });
    setForm(INITIAL_FORM);
    setShowModal(false);
  };

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
              {challenges.map(c => (
                <ChallengeRow key={c.id} challenge={c} onToggleActive={() => toggleChallengeActive(c.id)} onDelete={() => deleteChallenge(c.id)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Challenge" onConfirm={handleCreate} confirmLabel="Create">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="Challenge title" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputClass} resize-none`} placeholder="Challenge description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ChallengeCategory }))} className={selectClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as ChallengeDifficulty }))} className={selectClass}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Min Points</label>
              <input type="number" value={form.minPoints} onChange={e => setForm(f => ({ ...f, minPoints: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Points</label>
              <input type="number" value={form.maxPoints} onChange={e => setForm(f => ({ ...f, maxPoints: +e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Decay Rate</label>
              <input type="number" value={form.decayRate} onChange={e => setForm(f => ({ ...f, decayRate: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>First Blood Bonus</label>
              <input type="number" value={form.firstBloodBonus} onChange={e => setForm(f => ({ ...f, firstBloodBonus: +e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Flag</label>
            <input type="text" value={form.flag} onChange={e => setForm(f => ({ ...f, flag: e.target.value }))} className={`${inputClass} font-mono`} placeholder="dotflag{your_flag_here}" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
