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
        <div className="max-w-4xl mx-auto px-6">
          <EmptyState title="Challenge not found" description="The challenge you're looking for doesn't exist." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/challenges" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>

        <div className="space-y-6">
          <ChallengeInfo challenge={challenge} />
          <FileAttachments files={challenge.files} />
          {challenge.dockerImage && <DockerInstance docker={challenge.dockerImage} />}
        </div>
      </div>
    </div>
  );
}
