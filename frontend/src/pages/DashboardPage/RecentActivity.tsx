import { Activity, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';

export interface GlobalActivityItem {
  username: string;
  challenge: string;
  points: number;
  time: string;
  isFirstBlood: boolean;
  category: string;
}

function ActivityEntry({ activity }: { activity: GlobalActivityItem }) {
  return (
    <div className={`relative rounded-lg px-3.5 py-3 transition-all ${
      activity.isFirstBlood
        ? 'bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-500/15'
        : 'hover:bg-slate-800/30'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white truncate">{activity.username}</span>
            {activity.isFirstBlood && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                <Flame className="w-3 h-3" />
                First Blood
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400 truncate">solved <span className="text-slate-300">{activity.challenge}</span></span>
            <span className="text-[10px] text-slate-600 bg-slate-800/80 px-1.5 py-0.5 rounded">{activity.category}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm font-bold text-indigo-400">+{activity.points}</span>
          <p className="text-[10px] text-slate-600 mt-0.5">{activity.time}</p>
        </div>
      </div>
    </div>
  );
}

export default function RecentActivity({ activities }: { activities: GlobalActivityItem[] }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 gradient-border">
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-slate-500" />
        Live Feed
      </h2>

      <div className="space-y-1">
        {activities.length > 0 ? (
          activities.map((activity, idx) => <ActivityEntry key={idx} activity={activity} />)
        ) : (
          <div className="text-center py-8">
            <Activity className="w-10 h-10 text-slate-800 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No solves yet</p>
            <p className="text-xs text-slate-600 mt-1">Be the first to capture a flag</p>
          </div>
        )}
      </div>

      <Link to={ROUTES.LEADERBOARD} className="mt-4 block text-center text-xs text-slate-500 hover:text-indigo-400 transition">
        View Leaderboard
      </Link>
    </div>
  );
}
