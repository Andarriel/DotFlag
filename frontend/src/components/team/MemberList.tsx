import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, UserMinus, Crown } from 'lucide-react';
import { formatTimeAgo } from '../../utils/leaderboardUtils';
import Modal from '../common/Modal';
import type { TeamMember } from '../../types';

interface MemberListProps {
  members: TeamMember[];
  isLeader?: boolean;
  currentUserId?: number;
  onRemove?: (memberId: number) => void;
  onTransfer?: (memberId: number) => Promise<boolean>;
}

export default function MemberList({ members, isLeader, currentUserId, onRemove, onTransfer }: MemberListProps) {
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const pendingRemoveMember = members.find(m => m.id === pendingRemoveId);

  const [pendingTransferId, setPendingTransferId] = useState<number | null>(null);
  const pendingTransferMember = members.find(m => m.id === pendingTransferId);
  const [transferring, setTransferring] = useState(false);

  const handleRemoveConfirm = () => {
    if (pendingRemoveId != null) onRemove?.(pendingRemoveId);
    setPendingRemoveId(null);
  };

  const handleTransferConfirm = async () => {
    if (!pendingTransferId) return;
    setTransferring(true);
    await onTransfer?.(pendingTransferId);
    setTransferring(false);
    setPendingTransferId(null);
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
                  {member.id === currentUserId && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/60 border border-white/[0.06] px-1.5 py-0.5 rounded-md shrink-0">You</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Joined {formatTimeAgo(member.joinedAt)}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-sm font-bold text-white">{member.points}</span>
              {isLeader && member.id !== currentUserId && (
                <>
                  {member.teamRole !== 'Leader' && onTransfer && (
                    <button
                      onClick={() => setPendingTransferId(member.id)}
                      title="Transfer leadership"
                      className="ml-1 p-1 text-slate-600 hover:text-amber-400 transition">
                      <Crown className="w-4 h-4" />
                    </button>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => setPendingRemoveId(member.id)}
                      title="Remove member"
                      className="p-1 text-slate-600 hover:text-red-400 transition">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={pendingRemoveId != null}
        onClose={() => setPendingRemoveId(null)}
        title="Remove Member"
        onConfirm={handleRemoveConfirm}
        confirmLabel="Remove"
        confirmVariant="danger"
      >
        <p className="text-sm text-slate-400">
          Are you sure you want to remove <span className="text-white font-semibold">{pendingRemoveMember?.username}</span> from the team?
        </p>
      </Modal>

      <Modal
        isOpen={pendingTransferId != null}
        onClose={() => setPendingTransferId(null)}
        title="Transfer Leadership"
        onConfirm={handleTransferConfirm}
        confirmLabel="Transfer"
        confirmLoading={transferring}
      >
        <p className="text-sm text-slate-400">
          Transfer team leadership to <span className="text-white font-semibold">{pendingTransferMember?.username}</span>?
          You will become a regular member.
        </p>
      </Modal>
    </>
  );
}
