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
  return (
    <div className="border-l-2 border-slate-700 pl-4">
      <p className="text-sm text-white font-medium">{activity.challenge}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-xs px-2 py-0.5 rounded ${
          activity.action === 'Solved' ? 'bg-green-400/10 text-green-400' : 'bg-slate-800 text-slate-400'
        }`}>
          {activity.action}
        </span>
        {activity.points > 0 && <span className="text-xs text-indigo-400">+{activity.points}</span>}
      </div>
      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
    </div>
  );
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, idx) => <ActivityEntry key={idx} activity={activity} />)
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No activity yet</p>
            <p className="text-xs text-slate-600 mt-1">Start solving challenges to see your history</p>
          </div>
        )}
      </div>

      <Link to={ROUTES.LEADERBOARD} className="mt-6 block text-center text-sm text-slate-400 hover:text-indigo-400 transition">
        View Full History
      </Link>
    </div>
  );
}
