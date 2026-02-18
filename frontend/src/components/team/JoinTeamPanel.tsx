import { Users, ArrowRight } from 'lucide-react';

interface JoinTeamPanelProps {
  inviteCode: string;
  onCodeChange: (code: string) => void;
  onJoin: () => void;
}

export default function JoinTeamPanel({ inviteCode, onCodeChange, onJoin }: JoinTeamPanelProps) {
  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-12">
      <div className="glass rounded-2xl p-6 sm:p-8 text-center gradient-border noise">
        <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Users className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Join a Team</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Enter a team invitation code to join an existing team and start competing together.
        </p>

        <div className="flex gap-2.5 flex-col sm:flex-row">
          <input type="text" value={inviteCode} onChange={e => onCodeChange(e.target.value)}
            placeholder="e.g. CE-X7K9-M2P4"
            className="flex-1 bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" />
          <button onClick={onJoin} disabled={!inviteCode.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
            Join <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
