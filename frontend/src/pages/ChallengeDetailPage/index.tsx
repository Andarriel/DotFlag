import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MOCK_CHALLENGE_DETAILS } from '../../data/mockData';
import EmptyState from '../../components/common/EmptyState';
import ChallengeInfo from './ChallengeInfo';
import FileAttachments from './FileAttachments';
import DockerInstance from './DockerInstance';

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const challenge = MOCK_CHALLENGE_DETAILS.find(c => c.id === Number(id));

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
          <FileAttachments files={challenge.files} />
          {challenge.dockerImage && <DockerInstance docker={challenge.dockerImage} />}
        </div>
      </div>
    </div>
  );
}
