import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, UserMinus } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import Modal from '../common/Modal';
import type { TeamMember } from '../../types';

interface MemberListProps {
  members: TeamMember[];
  isLeader?: boolean;
  currentUserId?: number;
  onRemove?: (memberId: number) => void;
}

export default function MemberList({ members, isLeader, currentUserId, onRemove }: MemberListProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const pendingMember = members.find(m => m.id === pendingId);

  const handleConfirm = () => {
    if (pendingId != null) onRemove?.(pendingId);
    setPendingId(null);
  };

  return (
    <>
      <div className="space-y-2">
        {members.map((member, i) => (
          <div key={member.id} className={`flex items-center justify-between p-3.5 glass rounded-xl animate-fade-in-up opacity-0 stagger-${Math.min(i + 1, 5)}`}>
            <Link to={`/profile/${member.id}`} className="flex items-center gap-3 min-w-0 flex-1 group hover:opacity-80 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">{member.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition truncate">{member.username}</p>
                  {member.teamRole === 'Leader' && (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md shrink-0">Leader</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-sm font-bold text-white">{member.points}</span>
              {isLeader && member.id !== currentUserId && onRemove && (
                <button
                  onClick={() => setPendingId(member.id)}
                  title="Remove member"
                  className="ml-1 p-1 text-slate-600 hover:text-red-400 transition">
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={pendingId != null}
        onClose={() => setPendingId(null)}
        title="Remove Member"
        onConfirm={handleConfirm}
        confirmLabel="Remove"
        confirmVariant="danger"
      >
        <p className="text-sm text-slate-400">
          Are you sure you want to remove <span className="text-white font-semibold">{pendingMember?.username}</span> from the team?
        </p>
      </Modal>
    </>
  );
}
