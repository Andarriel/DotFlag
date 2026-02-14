import { Trophy, Target, Zap, TrendingUp, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/paths';
import type { Challenge, LeaderboardEntry } from '../../types';


interface UserStatsCardProps {
  rank: number;
  points: number;
  solved: number;
  weeklyProgress: number;
}

export function UserStatsCard({ rank, points, solved, weeklyProgress }: UserStatsCardProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Rank */}
        <div className="bg-slate-950/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Your Rank</p>
          <p className="text-3xl font-bold text-white">#{rank}</p>
        </div>

        {/* Points */}
        <div className="bg-slate-950/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Points</p>
          <p className="text-3xl font-bold text-white">{points}</p>
        </div>

        {/* Solved */}
        <div className="bg-slate-950/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Challenges Solved</p>
          <p className="text-3xl font-bold text-white">{solved}</p>
        </div>

        {/* Progress */}
        <div className="bg-slate-950/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">This Week</p>
          <p className="text-3xl font-bold text-white">+{weeklyProgress}</p>
        </div>
      </div>
    </div>
  );
}

/* Recommended Challenges Section */

interface RecommendedChallengesProps {
  challenges: Challenge[];
}

export function RecommendedChallenges({ challenges }: RecommendedChallengesProps) {
  return (
    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Recommended for You
        </h2>
        <Link to={ROUTES.CHALLENGES} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {challenges.map(challenge => (
          <Link
            key={challenge.id}
            to={ROUTES.CHALLENGES}
            className="block bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-indigo-400 transition">
                  {challenge.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {challenge.category}
                  </span>
                  <span>•</span>
                  <span>{challenge.difficulty}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-400">{challenge.points}</p>
                <p className="text-xs text-slate-500">points</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* Recent Activity Section */

interface ActivityItem {
  action: 'Solved' | 'Attempted';
  challenge: string;
  points: number;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div key={idx} className="border-l-2 border-slate-700 pl-4">
              <p className="text-sm text-white font-medium">{activity.challenge}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  activity.action === 'Solved' 
                    ? 'bg-green-400/10 text-green-400' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {activity.action}
                </span>
                {activity.points > 0 && (
                  <span className="text-xs text-indigo-400">+{activity.points}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No activity yet</p>
            <p className="text-xs text-slate-600 mt-1">Start solving challenges to see your history</p>
          </div>
        )}
      </div>

      <Link
        to={ROUTES.LEADERBOARD}
        className="mt-6 block text-center text-sm text-slate-400 hover:text-indigo-400 transition"
      >
        View Full History →
      </Link>
    </div>
  );
}