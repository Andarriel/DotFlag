import { useState } from 'react';
import { Shield } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import FilterBar from '../../components/challenges/FilterBar';
import ChallengeStats from '../../components/challenges/ChallengeStats';
import ChallengeCard from '../../components/challenges/ChallengeCard';
import ChallengeModal from '../../components/challenges/ChallengeModal';
import { useChallenges } from '../../hooks/useChallenges';
import { MOCK_CHALLENGE_DETAILS } from '../../data/mockData';
import type { ChallengeDetail } from '../../types';

export default function ChallengePage() {
  const { selectedCategory, setSelectedCategory, selectedDifficulty, setSelectedDifficulty, filteredChallenges, stats } = useChallenges();
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeDetail | null>(null);

  const openChallenge = (id: number) => {
    const detail = MOCK_CHALLENGE_DETAILS.find(c => c.id === id) ?? null;
    setSelectedChallenge(detail);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<img src="/challenges.png" alt="Challenges" className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl" />}
        rawIcon={true}
        title="Challenges"
        description="Test your skills with real-world cybersecurity challenges."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <FilterBar
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
        />

        <ChallengeStats solvedCount={stats.solvedCount} availableCount={stats.availableCount} totalPoints={stats.totalPoints} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => openChallenge(challenge.id)} />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <EmptyState icon={Shield} title="No challenges found" description="Try adjusting your filters" />
        )}
      </div>

      <ChallengeModal challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} />
    </div>
  );
}
