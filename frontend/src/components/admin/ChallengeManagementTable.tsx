import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil, Settings2, Upload, X, Lightbulb, File, Copy, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDifficultyColor } from '../../utils/challengeUtils';
import Modal from '../common/Modal';
import { useAdminContext } from '../../context/AdminContext';
import { challengeService } from '../../services/challengeService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import { dockerAdminService } from '../../services/dockerAdminService';
import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '../../types';
import type { ApiHint, ApiChallengeFile } from '../../types/api';

const CATEGORIES: ChallengeCategory[] = ['Web', 'Crypto', 'Pwn', 'Reverse', 'Misc', 'Forensics', 'OSINT'];
const DIFFICULTIES: ChallengeDifficulty[] = ['Easy', 'Medium', 'Hard', 'Impossible'];

function ChallengeRow({ challenge, onToggleActive, onDelete, onEdit, onManage, onClone }: { challenge: Challenge; onToggleActive: () => void; onDelete: () => void; onEdit: () => void; onManage: () => void; onClone: () => void }) {
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
          <button onClick={onManage} title="Manage Hints & Files" className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition">
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit} title="Edit" className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClone} title="Clone" className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition">
            <Copy className="w-3.5 h-3.5" />
          </button>
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

const inputClass = "w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const selectClass = `w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 cursor-pointer`;
const labelClass = "block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

type FormState = {
  name: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  minPoints: string;
  maxPoints: string;
  decayRate: string;
  firstBloodBonus: string;
  flag: string;
  hasInstance: boolean;
  dockerImage: string;
  containerPort: string;
  containerTtl: string;
};

const INITIAL_FORM: FormState = {
  name: '', description: '', category: 'Web',
  difficulty: 'Easy',
  minPoints: '50', maxPoints: '500', decayRate: '30', firstBloodBonus: '10', flag: '',
  hasInstance: false, dockerImage: '', containerPort: '', containerTtl: '',
};

export default function ChallengeManagementTable() {
  const { challenges, toggleChallengeActive, createChallenge, updateChallenge, deleteChallenge, cloneChallenge } = useAdminContext();
  const api = useAxios();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dockerImages, setDockerImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [manualImage, setManualImage] = useState(false);

  // Manage modal state
  const [manageId, setManageId] = useState<number | null>(null);
  const [manageHints, setManageHints] = useState<ApiHint[]>([]);
  const [manageFiles, setManageFiles] = useState<ApiChallengeFile[]>([]);
  const [manageLoading, setManageLoading] = useState(false);
  const [newHintContent, setNewHintContent] = useState('');

  const fetchImages = async () => {
    setImagesLoading(true);
    try {
      const imgs = await dockerAdminService.getImages(api);
      setDockerImages(imgs);
    } catch {
      setDockerImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (form.hasInstance && showModal) fetchImages();
  }, [form.hasInstance, showModal]);

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setManualImage(false);
    setShowModal(true);
  };

  const openEdit = async (challenge: Challenge) => {
    setManualImage(false);
    setEditingId(challenge.id);
    setForm({
          name: challenge.title,
          description: challenge.description,
          category: challenge.category,
          difficulty: challenge.difficulty,
          minPoints: '',
          maxPoints: '',
          decayRate: '',
          firstBloodBonus: '',
          flag: '',
          hasInstance: false,
          dockerImage: '',
          containerPort: '',
          containerTtl: '',
        });
    setShowModal(true);
    setLoadingEdit(true);
    try {
      const full = await challengeService.getById(api, challenge.id);
      setForm(f => ({
        ...f,
        minPoints: String(full.minPoints),
        maxPoints: String(full.maxPoints),
        decayRate: String(full.decayRate),
        firstBloodBonus: String(full.firstBloodBonus),
        hasInstance: full.hasInstance ?? false,
        dockerImage: full.dockerImage ?? '',
        containerPort: full.containerPort != null ? String(full.containerPort) : '',
        containerTtl: full.containerTimeoutMinutes != null ? String(full.containerTimeoutMinutes) : '',
      }));
    } catch {}
    setLoadingEdit(false);
  };

  const openManage = async (challenge: Challenge) => {
    setManageId(challenge.id);
    setManageLoading(true);
    setManageHints([]);
    setManageFiles([]);
    setNewHintContent('');
    try {
      const full = await challengeService.getById(api, challenge.id);
      setManageHints(full.hints ?? []);
      setManageFiles(full.files ?? []);
    } catch {
      toast.error('Failed to load challenge details');
    }
    setManageLoading(false);
  };

  const handleAddHint = async () => {
    if (!manageId || !newHintContent.trim()) return;
    const nextOrder = manageHints.length > 0 ? Math.max(...manageHints.map(h => h.order)) + 1 : 1;
    try {
      const res = await challengeService.addHint(api, manageId, { content: newHintContent.trim(), order: nextOrder });
      if (res.isSuccess) {
        toast.success('Hint added');
        setNewHintContent('');
        const full = await challengeService.getById(api, manageId);
        setManageHints(full.hints ?? []);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to add hint');
    }
  };

  const handleRemoveHint = async (hintId: number) => {
    if (!manageId) return;
    try {
      const res = await challengeService.removeHint(api, manageId, hintId);
      if (res.isSuccess) {
        toast.success('Hint removed');
        setManageHints(prev => prev.filter(h => h.id !== hintId));
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to remove hint');
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!manageId || !e.target.files?.length) return;
    const file = e.target.files[0];
    try {
      const res = await challengeService.uploadFile(api, manageId, file);
      if (res.isSuccess) {
        toast.success('File uploaded');
        const full = await challengeService.getById(api, manageId);
        setManageFiles(full.files ?? []);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to upload file');
    }
    e.target.value = '';
  };

  const handleRemoveFile = async (fileId: number) => {
    if (!manageId) return;
    try {
      const res = await challengeService.removeFile(api, manageId, fileId);
      if (res.isSuccess) {
        toast.success('File removed');
        setManageFiles(prev => prev.filter(f => f.id !== fileId));
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to remove file');
    }
  };

  const isFormValid = () => {
    if (!form.name || !form.description) return false;
    if (editingId === null && !form.flag) return false;
    if (form.hasInstance && !form.containerPort) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || submitting) return;
    setSubmitting(true);
    const ttl = form.hasInstance && form.containerTtl ? +form.containerTtl : undefined;
    let ok: boolean;
    if (editingId !== null) {
      ok = await updateChallenge(editingId, {
        name: form.name,
        description: form.description,
        category: CATEGORIES.indexOf(form.category),
        difficulty: DIFFICULTIES.indexOf(form.difficulty),
        minPoints: +form.minPoints || 0,
        maxPoints: +form.maxPoints || 0,
        decayRate: +form.decayRate || 0,
        firstBloodBonus: +form.firstBloodBonus || 0,
        flag: form.flag,
        isActive: challenges.find(c => c.id === editingId)?.isActive ?? true,
        hasInstance: form.hasInstance,
        dockerImage: form.hasInstance ? form.dockerImage : undefined,
        containerPort: form.hasInstance && form.containerPort ? +form.containerPort : undefined,
        containerTimeoutMinutes: ttl,
      });
    } else {
      ok = await createChallenge({
        name: form.name,
        description: form.description,
        category: CATEGORIES.indexOf(form.category),
        difficulty: DIFFICULTIES.indexOf(form.difficulty),
        minPoints: +form.minPoints || 0,
        maxPoints: +form.maxPoints || 0,
        decayRate: +form.decayRate || 0,
        firstBloodBonus: +form.firstBloodBonus || 0,
        flag: form.flag,
        hasInstance: form.hasInstance,
        dockerImage: form.hasInstance ? form.dockerImage : undefined,
        containerPort: form.hasInstance && form.containerPort ? +form.containerPort : undefined,
        containerTimeoutMinutes: ttl,
      });
    }
    setSubmitting(false);
    if (ok) {
      setForm(INITIAL_FORM);
      setEditingId(null);
      setShowModal(false);
    }
  };

  const headers = [
    { label: 'Challenge', className: '' },
    { label: 'Category', className: 'hidden sm:table-cell' },
    { label: 'Difficulty', className: 'hidden md:table-cell' },
    { label: 'Points', className: '' },
    { label: 'Actions', className: '' },
  ];

  const sortedManageHints = [...manageHints].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Challenge Management</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
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
                <ChallengeRow key={c.id} challenge={c} onToggleActive={() => toggleChallengeActive(c.id)} onDelete={() => deleteChallenge(c.id)} onEdit={() => openEdit(c)} onManage={() => openManage(c)} onClone={() => cloneChallenge(c.id)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { if (!submitting) { setShowModal(false); setEditingId(null); } }} title={editingId !== null ? 'Edit Challenge' : 'Create New Challenge'} onConfirm={handleSubmit} confirmLabel={editingId !== null ? 'Save' : 'Create'} confirmDisabled={!isFormValid()} confirmLoading={submitting}>
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
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ChallengeCategory }))} className={selectClass} style={{ colorScheme: 'dark' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as ChallengeDifficulty }))} className={selectClass} style={{ colorScheme: 'dark' }}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Min Points</label>
              <input type="number" value={form.minPoints} onChange={e => setForm(f => ({ ...f, minPoints: e.target.value }))} min={0} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Points</label>
              <input type="number" value={form.maxPoints} onChange={e => setForm(f => ({ ...f, maxPoints: e.target.value }))} min={0} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Decay Rate</label>
              <input type="number" value={form.decayRate} onChange={e => setForm(f => ({ ...f, decayRate: e.target.value }))} min={0} className={inputClass} />
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                Solves until points hit the floor. Lower = faster decay.
              </p>
            </div>
            <div>
              <label className={labelClass}>First Blood Bonus</label>
              <input type="number" value={form.firstBloodBonus} onChange={e => setForm(f => ({ ...f, firstBloodBonus: e.target.value }))} min={0} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>
              Flag {editingId === null && <span className="text-red-400">*</span>}
              {editingId !== null && <span className="text-slate-600 normal-case tracking-normal font-normal ml-1">(leave blank to keep existing)</span>}
            </label>
            <input type="text" value={form.flag} onChange={e => setForm(f => ({ ...f, flag: e.target.value }))} className={`${inputClass} font-mono`} placeholder={editingId !== null ? 'Unchanged' : 'dotflag{your_flag_here}'} />
          </div>
          <div className="border-t border-white/[0.06] pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.hasInstance} onChange={e => setForm(f => ({ ...f, hasInstance: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30 cursor-pointer" />
              <span className="text-sm font-medium text-slate-300">Has Docker Instance</span>
            </label>
            {form.hasInstance && (
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelClass} style={{ marginBottom: 0 }}>Docker Image</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={fetchImages} disabled={imagesLoading}
                        className="p-1 text-slate-600 hover:text-slate-300 transition disabled:opacity-40">
                        <RefreshCw className={`w-3 h-3 ${imagesLoading ? 'animate-spin' : ''}`} />
                      </button>
                      <button type="button" onClick={() => setManualImage(m => !m)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 transition uppercase tracking-wider">
                        {manualImage ? 'Pick from list' : 'Type manually'}
                      </button>
                    </div>
                  </div>
                  {manualImage ? (
                    <input type="text" value={form.dockerImage}
                      onChange={e => setForm(f => ({ ...f, dockerImage: e.target.value }))}
                      className={inputClass} placeholder="myimage:latest" />
                  ) : imagesLoading ? (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800/50 border border-white/[0.06] rounded-xl">
                      <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                      <span className="text-sm text-slate-500">Loading images...</span>
                    </div>
                  ) : dockerImages.length === 0 ? (
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/50 border border-white/[0.06] rounded-xl">
                      <span className="text-sm text-slate-500">No images found on Docker host</span>
                      <button type="button" onClick={() => setManualImage(true)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 transition">
                        Type manually
                      </button>
                    </div>
                  ) : (
                    <select value={form.dockerImage}
                      onChange={e => setForm(f => ({ ...f, dockerImage: e.target.value }))}
                      className={selectClass} style={{ colorScheme: 'dark' }}>
                      <option value="">— Select an image —</option>
                      {dockerImages.map(img => (
                        <option key={img} value={img}>{img}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Container Port <span className="text-red-400">*</span></label>
                  <input type="number" value={form.containerPort}
                    onChange={e => setForm(f => ({ ...f, containerPort: e.target.value }))}
                    className={inputClass} placeholder="1337" min={1} max={65535} />
                  <p className="text-[10px] text-slate-600 mt-1">
                    Port the service listens on <em>inside</em> the container (e.g. 1337). Users connect to a mapped host port.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>TTL (minutes)</label>
                  <input type="number" value={form.containerTtl}
                    onChange={e => setForm(f => ({ ...f, containerTtl: e.target.value }))}
                    className={inputClass} placeholder="60 (global default)" min={1} max={1440} />
                  <p className="text-[10px] text-slate-600 mt-1">
                    Leave empty to use the global Docker timeout setting.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Manage Hints & Files Modal */}
      <Modal isOpen={manageId !== null} onClose={() => setManageId(null)} title="Manage Hints & Files">
        {manageLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Hints Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white">Hints</h4>
              </div>

              {sortedManageHints.length > 0 && (
                <div className="space-y-2 mb-3">
                  {sortedManageHints.map((hint, i) => (
                    <div key={hint.id} className="flex items-start gap-2 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-amber-400 font-semibold mb-0.5">Hint #{hint.order}</p>
                        <p className="text-sm text-amber-200/70">{hint.content}</p>
                      </div>
                      <button onClick={() => handleRemoveHint(hint.id)} className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHintContent}
                  onChange={e => setNewHintContent(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddHint()}
                  className={`${inputClass} flex-1`}
                  placeholder="Enter hint text..."
                />
                <button
                  onClick={handleAddHint}
                  disabled={!newHintContent.trim()}
                  className="px-3 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Files Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <File className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-white">Files</h4>
              </div>

              {manageFiles.length > 0 && (
                <div className="space-y-2 mb-3">
                  {manageFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between bg-slate-800/30 border border-white/[0.04] rounded-xl p-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <File className="w-4 h-4 text-slate-400 shrink-0" />
                        <p className="text-sm text-white truncate">{file.fileName}</p>
                      </div>
                      <button onClick={() => handleRemoveFile(file.id)} className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-indigo-500/30 hover:bg-slate-800/70 transition">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Upload file...</span>
                <input type="file" className="hidden" onChange={handleUploadFile} />
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
