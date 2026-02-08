import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '../types';
import { Code, Lock, Globe, Shield, Search, FileText } from 'lucide-react';

export const getDifficultyColor = (difficulty: ChallengeDifficulty): string => {
  const colors: Record<ChallengeDifficulty, string> = {
    Easy: "text-green-400 bg-green-400/10 border-green-400/20",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Hard: "text-red-400 bg-red-400/10 border-red-400/20"
  };
  return colors[difficulty];
};

export const getCategoryIcon = (category: ChallengeCategory) => {
  const icons: Record<ChallengeCategory, typeof Globe> = {
    Web: Globe,
    Crypto: Lock,
    Pwn: Code,
    Reverse: Shield,
    Misc: FileText,
    Forensics: Search
  };
  return icons[category];
};

export const calculateChallengeStats = (challenges: Challenge[]) => {
  const solvedCount = challenges.filter(c => c.isSolved).length;
  const availableCount = challenges.filter(c => !c.isSolved && c.isActive).length;
  const totalPoints = challenges.filter(c => c.isSolved).reduce((sum, c) => sum + c.points, 0);

  return {
    solvedCount,
    availableCount,
    totalPoints
  };
};

export const filterChallenges = (
  challenges: Challenge[],
  category: ChallengeCategory | "All",
  difficulty: ChallengeDifficulty | "All"
): Challenge[] => {
  return challenges.filter(challenge => {
    const categoryMatch = category === "All" || challenge.category === category;
    const difficultyMatch = difficulty === "All" || challenge.difficulty === difficulty;
    return categoryMatch && difficultyMatch;
  });
};