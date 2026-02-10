import PageHeader from '../../components/common/PageHeader';
import { useChallenges } from '../../hooks/useChallenges';
import { FilterBar, ChallengeStats, ChallengeCard, EmptyState } from './components';

export default function ChallengePage() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredChallenges,
    stats,
  } = useChallenges();

  return (
    <div className="min-h-screen bg-slate-950">
      <PageHeader
        icon={<img src="/challenges.png" alt="Challenges" className="w-6 h-6" />}
        title="Challenges"
        description="Test your skills with real-world cybersecurity challenges. Solve them to earn points and climb the leaderboard."
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterBar
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
        />

        <ChallengeStats
          solvedCount={stats.solvedCount}
          availableCount={stats.availableCount}
          totalPoints={stats.totalPoints}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {filteredChallenges.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
