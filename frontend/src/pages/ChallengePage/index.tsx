import { useState } from 'react';
import { Shield } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import FilterBar from '../../components/challenges/FilterBar';
import ChallengeStats from '../../components/challenges/ChallengeStats';
import ChallengeCard from '../../components/challenges/ChallengeCard';
import ChallengeModal from '../../components/challenges/ChallengeModal';
import { useChallenges } from '../../hooks/useChallenges';
import { challengeService } from '../../services/challengeService';
import { useAxios } from '../../context/AxiosContext';
import { USE_MOCK } from '../../config';
import { MOCK_CHALLENGE_DETAILS } from '../../data/mockData';
import type { ChallengeDetail, Challenge } from '../../types';

function challengeToDetail(c: Challenge, solveCount?: number): ChallengeDetail {
  return { ...c, files: [], hints: [], solveCount: solveCount ?? 0, author: '' };
}

export default function ChallengePage() {
  const api = useAxios();
  const { selectedCategory, setSelectedCategory, selectedDifficulty, setSelectedDifficulty, filteredChallenges, stats, loading, challenges } = useChallenges();
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeDetail | null>(null);

  const openChallenge = async (id: number) => {
    if (USE_MOCK) {
      setSelectedChallenge(MOCK_CHALLENGE_DETAILS.find(c => c.id === id) ?? null);
      return;
    }
    const local = challenges.find(c => c.id === id);
    if (local) setSelectedChallenge(challengeToDetail(local));
    try {
      const apiChallenge = await challengeService.getById(api, id);
      const detail = challengeToDetail(
        { id: apiChallenge.id, title: apiChallenge.name, description: apiChallenge.description, points: apiChallenge.currentPoints, category: (apiChallenge.category as unknown as string) as Challenge['category'], difficulty: (apiChallenge.difficulty as unknown as string) as Challenge['difficulty'], isActive: apiChallenge.isActive },
        apiChallenge.solveCount,
      );
      setSelectedChallenge(detail);
    } catch { /* keep local data if fetch fails */ }
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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => openChallenge(challenge.id)} />
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <EmptyState icon={Shield} title="No challenges found" description="Try adjusting your filters" />
            )}
          </>
        )}
      </div>

      <ChallengeModal challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} />
    </div>
  );
}
