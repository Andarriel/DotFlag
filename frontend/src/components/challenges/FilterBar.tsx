import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from '../../constants';
import type { ChallengeCategory, ChallengeDifficulty } from '../../types';

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
        active
          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 shadow-sm shadow-indigo-500/10'
          : 'bg-slate-800/30 text-slate-500 border-white/[0.04] hover:text-slate-300 hover:bg-slate-800/50'
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
    <div className="glass rounded-xl p-4 sm:p-5 mb-6 gradient-border">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Category</label>
          <div className="flex gap-1.5 flex-wrap">
            <FilterButton active={selectedCategory === 'All'} onClick={() => onCategoryChange('All')}>All</FilterButton>
            {CHALLENGE_CATEGORIES.map(c => (
              <FilterButton key={c} active={selectedCategory === c} onClick={() => onCategoryChange(c)}>{c}</FilterButton>
            ))}
          </div>
        </div>
        <div className="sm:border-l sm:border-white/[0.04] sm:pl-5">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Difficulty</label>
          <div className="flex gap-1.5 flex-wrap">
            <FilterButton active={selectedDifficulty === 'All'} onClick={() => onDifficultyChange('All')}>All</FilterButton>
            {CHALLENGE_DIFFICULTIES.map(d => (
              <FilterButton key={d} active={selectedDifficulty === d} onClick={() => onDifficultyChange(d)}>{d}</FilterButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
