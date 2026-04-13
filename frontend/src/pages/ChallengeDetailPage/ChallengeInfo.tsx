import { useState } from 'react';
import { Users, User, Lock, Unlock, Coins } from 'lucide-react';
import { getCategoryIcon, getDifficultyColor } from '../../utils/challengeUtils';
import { challengeService } from '../../services/challengeService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import { USE_MOCK } from '../../config';
import type { ChallengeDetail, ChallengeHint } from '../../types';

function HintItem({ hint, index, onUnlock }: { hint: ChallengeHint; index: number; onUnlock: (id: number) => void }) {
  if (hint.isUnlocked) {
    return (
      <div className="bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-3.5">
        <div className="flex items-center gap-2 mb-1">
          <Unlock className="w-3.5 h-3.5 text-amber-400" />
          <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Hint {index + 1}</p>
        </div>
        <p className="text-sm text-amber-200/70">{hint.text}</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => onUnlock(hint.id)}
      className="w-full bg-slate-800/30 border border-white/[0.04] rounded-xl p-3.5 flex items-center justify-between group hover:bg-slate-800/50 hover:border-white/[0.08] transition-all"
    >
      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition" />
        <p className="text-sm text-slate-500 group-hover:text-slate-400 transition">Hint {index + 1}</p>
      </div>
      {hint.cost > 0 ? (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400/70 bg-amber-500/[0.08] px-2 py-0.5 rounded-md border border-amber-500/10">
          <Coins className="w-3 h-3" /> {hint.cost} pts
        </span>
      ) : (
        <span className="text-[11px] text-slate-600">Locked by admin</span>
      )}
    </button>
  );
}

export default function ChallengeInfo({ challenge, onSubmit }: { challenge: ChallengeDetail; onSubmit?: () => void }) {
  const api = useAxios();
  const toast = useToast();
  const Icon = getCategoryIcon(challenge.category);
  const [hints, setHints] = useState(challenge.hints);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUnlock = (hintId: number) => {
    const hint = hints.find(h => h.id === hintId);
    if (!hint || hint.isUnlocked) return;

    if (hint.cost > 0) {
      // TODO: call API to deduct points and unlock
      // For now, just unlock locally for demo
    }

    setHints(prev => prev.map(h => h.id === hintId ? { ...h, isUnlocked: true } : h));
  };

  const handleSubmitFlag = async () => {
    if (!flag.trim() || submitting) return;
    setSubmitting(true);

    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      const correct = flag === 'dotflag{test}';
      correct ? toast.success('Correct flag!') : toast.error('Wrong flag, try again.');
      onSubmit?.();
      setSubmitting(false);
      if (correct) setFlag('');
      return;
    }

    try {
      const res = await challengeService.submitFlag(api, challenge.id, flag);
      if (res.isSuccess) {
        res.message.includes('First blood') ? toast.firstBlood(res.message) : toast.success(res.message);
        setFlag('');
      } else {
        toast.error(res.message);
      }
      onSubmit?.();
    } catch {
      toast.error('Failed to submit flag.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-2xl gradient-border noise overflow-hidden">
      <div className="relative p-5 sm:p-6">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start gap-4 mb-5">
          <div className="w-14 h-14 bg-indigo-600/15 border border-indigo-500/20 rounded-xl flex items-center justify-center glow-indigo shrink-0">
            <Icon className="w-7 h-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md">{challenge.category}</span>
              <span className="text-sm font-bold text-indigo-400">{challenge.points} pts</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-4 mb-4">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">{challenge.description}</p>
        </div>

        <div className="flex items-center gap-5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {challenge.solveCount} solves</span>
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {challenge.author}</span>
        </div>

        {hints.length > 0 && (
          <div className="mt-4 space-y-2">
            {hints.map((hint, i) => (
              <HintItem key={hint.id} hint={hint} index={i} onUnlock={handleUnlock} />
            ))}
          </div>
        )}

        <div className="mt-5 flex gap-2.5 flex-col sm:flex-row">
          <input
            type="text"
            value={flag}
            onChange={e => setFlag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmitFlag()}
            placeholder="dotflag{your_flag_here}"
            className="flex-1 bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
          <button
            onClick={handleSubmitFlag}
            disabled={submitting || !flag.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Flag'}
          </button>
        </div>
      </div>
    </div>
  );
}
