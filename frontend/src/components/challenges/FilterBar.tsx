import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from '../../constants';
import type { ChallengeCategory, ChallengeDifficulty } from '../../types';

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  );
}

interface FilterBarProps {
  selectedCategory: 'All' | ChallengeCategory;
  selectedDifficulty: 'All' | ChallengeDifficulty;
  onCategoryChange: (category: 'All' | ChallengeCategory) => void;
  onDifficultyChange: (difficulty: 'All' | ChallengeDifficulty) => void;
}

export default function FilterBar({ selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
        <div className="flex gap-2 flex-wrap">
          <FilterButton active={selectedCategory === 'All'} onClick={() => onCategoryChange('All')}>All</FilterButton>
          {CHALLENGE_CATEGORIES.map(c => (
            <FilterButton key={c} active={selectedCategory === c} onClick={() => onCategoryChange(c)}>{c}</FilterButton>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
        <div className="flex gap-2 flex-wrap">
          <FilterButton active={selectedDifficulty === 'All'} onClick={() => onDifficultyChange('All')}>All</FilterButton>
          {CHALLENGE_DIFFICULTIES.map(d => (
            <FilterButton key={d} active={selectedDifficulty === d} onClick={() => onDifficultyChange(d)}>{d}</FilterButton>
          ))}
        </div>
      </div>
    </div>
  );
}
