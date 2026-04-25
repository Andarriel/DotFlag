import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ChallengeInfo from '../../pages/ChallengeDetailPage/ChallengeInfo';
import FileAttachments from '../../pages/ChallengeDetailPage/FileAttachments';
import DockerInstance from '../../pages/ChallengeDetailPage/DockerInstance';
import SubmissionHistory from '../../pages/ChallengeDetailPage/SubmissionHistory';
import { MOCK_SUBMISSIONS } from '../../data/mockData';
import { challengeService } from '../../services/challengeService';
import { useAxios } from '../../context/AxiosContext';
import { USE_MOCK } from '../../config';
import type { ChallengeDetail, Submission } from '../../types';

interface ChallengeModalProps {
  challenge: ChallengeDetail | null;
  onClose: () => void;
}

export default function ChallengeModal({ challenge, onClose }: ChallengeModalProps) {
  const api = useAxios();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const refetchSubmissions = useCallback(() => {
    if (!challenge) return;
    if (USE_MOCK) {
      setSubmissions(MOCK_SUBMISSIONS.filter(s => s.challengeId === challenge.id));
      return;
    }
    challengeService.getSubmissions(api, challenge.id).then(setSubmissions).catch(() => {});
  }, [api, challenge]);

  useEffect(() => {
    refetchSubmissions();
  }, [refetchSubmissions]);

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
        className="relative w-full max-w-2xl max-h-[85vh] mx-4 overflow-hidden rounded-2xl glass-strong gradient-border animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close challenge modal"
          className="absolute top-3 right-3 z-20 p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="space-y-4 p-5 pt-12 sm:p-6 sm:pt-14">
          <ChallengeInfo challenge={challenge} onSubmit={refetchSubmissions} />
          <FileAttachments files={challenge.files} challengeId={challenge.id} />
          {challenge.dockerImage && <DockerInstance challengeId={challenge.id} />}
          <SubmissionHistory submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
