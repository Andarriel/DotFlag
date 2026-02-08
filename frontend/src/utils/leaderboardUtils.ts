export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  if (diffMs < 0) return "just now";
  
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
};

export const getRankBadgeColor = (rank: number): string => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
  if (rank === 2) return "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900";
  if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
  return "bg-slate-800 text-slate-300";
};

export const getRankIcon = (rank: number): string => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
};