import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MOCK_CHALLENGE_DETAILS } from '../../data/mockData';
import { challengeService } from '../../services/challengeService';
import { useAxios } from '../../context/AxiosContext';
import { USE_MOCK } from '../../config';
import EmptyState from '../../components/common/EmptyState';
import ChallengeInfo from './ChallengeInfo';
import FileAttachments from './FileAttachments';
import DockerInstance from './DockerInstance';
import type { ChallengeDetail } from '../../types';

interface ChallengeDetailWithDocker extends ChallengeDetail {
  hasInstance?: boolean;
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const api = useAxios();
  const [challenge, setChallenge] = useState<ChallengeDetailWithDocker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    if (USE_MOCK) {
      setChallenge(MOCK_CHALLENGE_DETAILS.find(c => c.id === Number(id)) ?? null);
      setLoading(false);
      return;
    }
    challengeService.getById(api, Number(id)).then(apiChallenge => {
      const hints = (apiChallenge.hints ?? []).map(h => ({ id: h.id, content: h.content, order: h.order }));
      const files = (apiChallenge.files ?? []).map(f => ({ id: f.id, fileName: f.fileName }));
      setChallenge({
        id: apiChallenge.id,
        title: apiChallenge.name,
        description: apiChallenge.description,
        points: apiChallenge.currentPoints,
        category: apiChallenge.category as unknown as ChallengeDetail['category'],
        difficulty: apiChallenge.difficulty as unknown as ChallengeDetail['difficulty'],
        isActive: apiChallenge.isActive,
        isSolved: apiChallenge.isSolved,
        solveCount: apiChallenge.solveCount,
        firstBloodBonus: apiChallenge.firstBloodBonus,
        hasInstance: apiChallenge.hasInstance,
        files,
        hints,
        author: '',
      });
    }).catch(() => setChallenge(null)).finally(() => setLoading(false));
  }, [api, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <EmptyState title="Challenge not found" description="The challenge you're looking for doesn't exist." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/challenges" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-6 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Challenges
        </Link>

        <div className="space-y-4">
          <ChallengeInfo challenge={challenge} />
          <FileAttachments files={challenge.files} challengeId={challenge.id} />
          {challenge.hasInstance && <DockerInstance challengeId={challenge.id} />}
        </div>
      </div>
    </div>
  );
}
