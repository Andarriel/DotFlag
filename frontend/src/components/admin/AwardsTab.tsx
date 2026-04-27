import { useState, useEffect } from 'react';
import { X, Plus, Search, Award, Loader2 } from 'lucide-react';
import { useAdminContext } from '../../context/AdminContext';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import { badgeService } from '../../services/badgeService';
import { BadgeIcon } from '../common/BadgeDisplay';
import type { ApiBadge, BadgeType, ApiCtfEventSummary } from '../../types/api';

const BADGE_OPTIONS: { value: BadgeType; label: string; emoji: string }[] = [
  { value: 'Bronze',              label: 'Bronze',               emoji: '🥉' },
  { value: 'Silver',              label: 'Silver',               emoji: '🥈' },
  { value: 'Gold',                label: 'Gold',                 emoji: '🥇' },
  { value: 'Platinum',            label: 'Platinum',             emoji: '💎' },
  { value: 'FirstBlood',          label: 'First Blood',          emoji: '🔥' },
  { value: 'GeniusPerfectionist', label: 'Genius Perfectionist', emoji: '🧠' },
  { value: 'Veteran1',            label: '1st CTF',              emoji: '🎖' },
  { value: 'Veteran5',            label: '5 CTFs',               emoji: '🏅' },
  { value: 'Veteran10',           label: '10 CTFs',              emoji: '🏆' },
  { value: 'Custom',              label: 'Custom Award',         emoji: '⭐' },
];

const PRESET_COLORS = ['#f59e0b','#ef4444','#3b82f6','#a855f7','#10b981','#06b6d4','#ec4899','#f97316'];
const PRESET_ICONS  = ['⭐','🎯','🛡','⚔️','🔑','💡','🌟','🎪','🚀','🎨','🏴‍☠️','🦊'];

const inputClass = "w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all";
const selectClass = `${inputClass} appearance-none cursor-pointer`;
const labelClass  = "block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1";

export default function AwardsTab() {
  const { users } = useAdminContext();
  const api   = useAxios();
  const toast = useToast();

  const [search, setSearch]               = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userBadges, setUserBadges]       = useState<ApiBadge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(false);
  const [ctfEvents, setCtfEvents]         = useState<ApiCtfEventSummary[]>([]);

  // Award form
  const [mode, setMode]               = useState<'existing' | 'custom'>('existing');
  const [badgeType, setBadgeType]     = useState<BadgeType>('Bronze');
  const [ctfEventId, setCtfEventId]   = useState<string>('');
  const [note, setNote]               = useState('');
  const [isManual, setIsManual]       = useState(true);
  const [customName, setCustomName]   = useState('');
  const [customColor, setCustomColor] = useState('#f59e0b');
  const [customIcon, setCustomIcon]   = useState('⭐');
  const [submitting, setSubmitting]   = useState(false);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8);

  const selectedUser = users.find(u => u.id === selectedUserId);

  useEffect(() => {
    // Fetch CTF events list
    api.get<ApiCtfEventSummary[]>('/ctf/all').then(r => setCtfEvents(r.data)).catch(() => {});
  }, [api]);

  const loadBadges = async (userId: number) => {
    setBadgesLoading(true);
    try {
      const data = await badgeService.getForUser(api, userId);
      setUserBadges(data);
    } catch {
      setUserBadges([]);
    }
    setBadgesLoading(false);
  };

  const selectUser = (userId: number) => {
    setSelectedUserId(userId);
    setSearch('');
    loadBadges(userId);
  };

  const handleRevoke = async (badgeId: number) => {
    try {
      const res = await badgeService.revoke(api, badgeId);
      if (res.isSuccess) {
        toast.success('Badge revoked');
        setUserBadges(prev => prev.filter(b => b.id !== badgeId));
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to revoke badge');
    }
  };

  const handleAward = async () => {
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      const isCustomMode = mode === 'custom' || badgeType === 'Custom';
      const res = await badgeService.award(api, {
        userId: selectedUserId,
        type: isCustomMode ? 'Custom' : badgeType,
        ctfEventId: ctfEventId ? +ctfEventId : null,
        note: note || undefined,
        isManuallyAwarded: isManual,
        customName: isCustomMode ? customName : undefined,
        customColor: isCustomMode ? customColor : undefined,
        customIcon: isCustomMode ? customIcon : undefined,
      });
      if (res.isSuccess) {
        toast.success('Badge awarded');
        await loadBadges(selectedUserId);
        setNote(''); setCtfEventId(''); setCustomName('');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to award badge');
    }
    setSubmitting(false);
  };

  const isCustom = mode === 'custom' || badgeType === 'Custom';
  const canSubmit = selectedUserId != null && (!isCustom || customName.trim().length > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Awards & Badges</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — User selection + badge list */}
        <div className="glass rounded-2xl gradient-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Select Player</h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>

          {/* Suggestions */}
          {search.length > 0 && (
            <div className="border border-white/[0.06] rounded-xl overflow-hidden">
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-500 px-4 py-3">No users found</p>
              ) : filtered.map(u => (
                <button
                  key={u.id}
                  onClick={() => selectUser(u.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/50 transition text-left border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-sm text-white font-medium">{u.username}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </div>
                  <span className="text-xs text-slate-500">{u.role}</span>
                </button>
              ))}
            </div>
          )}

          {/* Selected user + their badges */}
          {selectedUser && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-white font-medium">{selectedUser.username}</span>
                <button onClick={() => { setSelectedUserId(null); setUserBadges([]); }}
                  className="ml-auto p-0.5 text-slate-500 hover:text-slate-300 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {badgesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              ) : userBadges.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-3">No badges yet</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {userBadges.map(b => (
                    <div key={b.id} className="flex items-center gap-3 px-3 py-2 bg-slate-800/30 border border-white/[0.04] rounded-xl">
                      <BadgeIcon badge={b} size="sm"
                        />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{b.customName ?? b.type}</p>
                        {b.ctfEventName && <p className="text-[11px] text-slate-500 truncate">{b.ctfEventName}</p>}
                      </div>
                      {b.isManuallyAwarded && <span className="text-[10px] text-slate-600">✍</span>}
                      <button onClick={() => handleRevoke(b.id)}
                        className="p-1 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — Award form */}
        <div className="glass rounded-2xl gradient-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Award Badge</h3>

          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl">
            {(['existing','custom'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}>
                {m === 'existing' ? 'Existing Medal' : 'Custom Award'}
              </button>
            ))}
          </div>

          {mode === 'existing' ? (
            <div>
              <label className={labelClass}>Medal Type</label>
              <select value={badgeType} onChange={e => setBadgeType(e.target.value as BadgeType)}
                className={selectClass} style={{ colorScheme: 'dark' }}>
                {BADGE_OPTIONS.filter(o => o.value !== 'Custom').map(o => (
                  <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Award Name <span className="text-red-400">*</span></label>
                <input type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                  className={inputClass} placeholder="e.g. Bug Hunter, Staff Pick" />
              </div>
              <div>
                <label className={labelClass}>Icon</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_ICONS.map(icon => (
                    <button key={icon} onClick={() => setCustomIcon(icon)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition border ${
                        customIcon === icon ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/[0.06] bg-slate-800/50 hover:border-white/20'
                      }`}>{icon}</button>
                  ))}
                  <input type="text" value={customIcon} onChange={e => setCustomIcon(e.target.value)}
                    className="w-10 h-8 bg-slate-800/50 border border-white/[0.06] rounded-lg px-2 text-center text-base focus:outline-none focus:border-indigo-500/50"
                    maxLength={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Color</label>
                <div className="flex gap-1.5 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button key={c} onClick={() => setCustomColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition ${customColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ background: c }} />
                  ))}
                  <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* CTF Event dropdown */}
          <div>
            <label className={labelClass}>Linked CTF Event (optional)</label>
            <select value={ctfEventId} onChange={e => setCtfEventId(e.target.value)}
              className={selectClass} style={{ colorScheme: 'dark' }}>
              <option value="">— None —</option>
              {ctfEvents.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.isFinalized ? ' ✓' : ''}</option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className={labelClass}>Note (shown on hover)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              className={inputClass} placeholder="Reason for this award..." />
          </div>

          {/* Manual indicator toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isManual} onChange={e => setIsManual(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30" />
            <span className="text-sm text-slate-300">Mark as manually awarded <span className="text-slate-500">(shows ✍)</span></span>
          </label>

          <button
            onClick={handleAward}
            disabled={!canSubmit || !selectedUserId || submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Award Badge
          </button>

          {!selectedUserId && (
            <p className="text-[11px] text-slate-600 text-center">Select a player first</p>
          )}
        </div>
      </div>
    </div>
  );
}
