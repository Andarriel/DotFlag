import { useEffect } from 'react';
import { X } from 'lucide-react';
import ChallengeInfo from '../../pages/ChallengeDetailPage/ChallengeInfo';
import FileAttachments from '../../pages/ChallengeDetailPage/FileAttachments';
import DockerInstance from '../../pages/ChallengeDetailPage/DockerInstance';
import SubmissionHistory from '../../pages/ChallengeDetailPage/SubmissionHistory';
import { MOCK_SUBMISSIONS } from '../../data/mockData';
import type { ChallengeDetail } from '../../types';

interface ChallengeModalProps {
  challenge: ChallengeDetail | null;
  onClose: () => void;
}

export default function ChallengeModal({ challenge, onClose }: ChallengeModalProps) {
  useEffect(() => {
    if (!challenge) return;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [challenge, onClose]);

  if (!challenge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] mx-4 overflow-y-auto rounded-2xl glass-strong gradient-border animate-fade-in-up scrollbar-none"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 p-5 sm:p-6">
          <ChallengeInfo challenge={challenge} />
          <FileAttachments files={challenge.files} />
          {challenge.dockerImage && <DockerInstance docker={challenge.dockerImage} />}
          <SubmissionHistory submissions={MOCK_SUBMISSIONS.filter(s => s.challengeId === challenge.id)} />
        </div>
      </div>
    </div>
  );
}
