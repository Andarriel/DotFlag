import { Users, ArrowRight } from 'lucide-react';

interface JoinTeamPanelProps {
  inviteCode: string;
  onCodeChange: (code: string) => void;
  onJoin: () => void;
}

export default function JoinTeamPanel({ inviteCode, onCodeChange, onJoin }: JoinTeamPanelProps) {
  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Join a Team</h2>
        <p className="text-slate-400 mb-8">Enter a team invitation code to join an existing team and start competing together.</p>

        <div className="flex gap-3">
          <input
            type="text"
            value={inviteCode}
            onChange={e => onCodeChange(e.target.value)}
            placeholder="Enter invite code (e.g. CE-X7K9-M2P4)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={onJoin}
            disabled={!inviteCode.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
