import { Shield, CheckCircle, Clock, Zap, Globe, Lock, Terminal, Code, HelpCircle, Search, type LucideIcon } from 'lucide-react';
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from '../../constants';
import { getDifficultyColor, getCategoryIcon } from '../../utils/challengeUtils';
import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '../../types';

const CATEGORY_ICON: Record<ChallengeCategory, LucideIcon> = {
  Web: Globe,
  Crypto: Lock,
  Pwn: Terminal,
  Reverse: Code,
  Misc: HelpCircle,
  Forensics: Search,
};

/* Reusable blocks */

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

/* Page sections */

interface FilterBarProps {
  selectedCategory: "All" | ChallengeCategory;
  selectedDifficulty: "All" | ChallengeDifficulty;
  onCategoryChange: (category: "All" | ChallengeCategory) => void;
  onDifficultyChange: (difficulty: "All" | ChallengeDifficulty) => void;
}

export function FilterBar({ selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">

      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
        <div className="flex gap-2">
          <FilterButton active={selectedCategory === "All"} onClick={() => onCategoryChange("All")}>All</FilterButton>
          {CHALLENGE_CATEGORIES.map(category => (
            <FilterButton key={category} active={selectedCategory === category} onClick={() => onCategoryChange(category)}>
              {category}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Difficulty filter */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
        <div className="flex gap-2">
          <FilterButton active={selectedDifficulty === "All"} onClick={() => onDifficultyChange("All")}>All</FilterButton>
          {CHALLENGE_DIFFICULTIES.map(difficulty => (
            <FilterButton key={difficulty} active={selectedDifficulty === difficulty} onClick={() => onDifficultyChange(difficulty)}>
              {difficulty}
            </FilterButton>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChallengeStatsProps {
  solvedCount: number;
  availableCount: number;
  totalPoints: number;
}

export function ChallengeStats({ solvedCount, availableCount, totalPoints }: ChallengeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-2xl font-bold text-white">{solvedCount}</p>
            <p className="text-sm text-slate-400">Solved</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-indigo-400" />
          <div>
            <p className="text-2xl font-bold text-white">{availableCount}</p>
            <p className="text-sm text-slate-400">Available</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-purple-400" />
          <div>
            <p className="text-2xl font-bold text-white">{totalPoints}</p>
            <p className="text-sm text-slate-400">Total Points</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const CategoryIcon = getCategoryIcon(challenge.category);

  return (
    <div
      className={`bg-slate-900/50 border rounded-xl p-6 transition-all hover:border-indigo-500/50 cursor-pointer group ${
        challenge.isSolved
          ? "border-green-500/30"
          : !challenge.isActive
          ? "border-slate-800 opacity-60"
          : "border-slate-800"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {(() => {
          const Icon = CATEGORY_ICON[challenge.category];
          return (
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          );
        })()}
        {challenge.isSolved && (
          <CheckCircle className="w-5 h-5 text-green-400" />
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{challenge.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
        <span className="text-xs text-slate-500">{challenge.category}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <span className="text-sm font-semibold text-indigo-400">{challenge.points} pts</span>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <Shield className="w-16 h-16 text-slate-700 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">No challenges found</h3>
      <p className="text-slate-400">Try adjusting your filters</p>
    </div>
  );
}
