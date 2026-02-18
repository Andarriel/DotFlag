import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

interface ActivityItem {
  action: 'Solved' | 'Attempted';
  challenge: string;
  points: number;
  time: string;
}

function ActivityEntry({ activity }: { activity: ActivityItem }) {
  const isSolved = activity.action === 'Solved';
  return (
    <div className={`border-l-2 pl-4 ${isSolved ? 'border-indigo-500/40' : 'border-white/[0.06]'}`}>
      <p className="text-sm text-white font-medium">{activity.challenge}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[11px] px-2 py-0.5 rounded-md border ${
          isSolved ? 'bg-green-400/10 text-green-400 border-green-500/15' : 'bg-slate-800/50 text-slate-500 border-white/[0.04]'
        }`}>
          {activity.action}
        </span>
        {activity.points > 0 && <span className="text-[11px] font-semibold text-indigo-400">+{activity.points}</span>}
      </div>
      <p className="text-[11px] text-slate-600 mt-1">{activity.time}</p>
    </div>
  );
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 gradient-border">
      <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-500" />
        Recent Activity
      </h2>

      <div className="space-y-3.5">
        {activities.length > 0 ? (
          activities.map((activity, idx) => <ActivityEntry key={idx} activity={activity} />)
        ) : (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-slate-800 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No activity yet</p>
            <p className="text-xs text-slate-600 mt-1">Start solving challenges</p>
          </div>
        )}
      </div>

      <Link to={ROUTES.LEADERBOARD} className="mt-5 block text-center text-xs text-slate-500 hover:text-indigo-400 transition">
        View Full History
      </Link>
    </div>
  );
}
