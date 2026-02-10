import { useState } from 'react';
import { Shield, CheckCircle, Clock, Zap } from 'lucide-react';
import { MOCK_CHALLENGES } from '../data/mockData';
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from '../constants';
import { 
  getDifficultyColor, 
  getCategoryIcon, 
  calculateChallengeStats,
  filterChallenges 
} from '../utils/challengeUtils';
import type { ChallengeCategory, ChallengeDifficulty } from '../types';

export default function ChallengePage() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | ChallengeCategory>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | ChallengeDifficulty>("All");

  const filteredChallenges = filterChallenges(MOCK_CHALLENGES, selectedCategory, selectedDifficulty);
  const { solvedCount, availableCount, totalPoints } = calculateChallengeStats(MOCK_CHALLENGES);

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <img src="/challenges.png" alt="Challenges icon" className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold text-white">Challenges</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Test your skills with real-world cybersecurity challenges. Solve them to earn points and climb the leaderboard.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                All
              </button>
              {CHALLENGE_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty filter */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDifficulty("All")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDifficulty === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                All
              </button>
              {CHALLENGE_DIFFICULTIES.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDifficulty === difficulty
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Challenge cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => {
            const Icon = getCategoryIcon(challenge.category);
            return (
              <div
                key={challenge.id}
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
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <img src="/challenges.png" alt="Challenges icon" className="w-6 h-6" />
                  </div>
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
          })}
        </div>

        {/* Empty state */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No challenges found</h3>
            <p className="text-slate-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}