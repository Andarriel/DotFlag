export type UserRole = 'Admin' | 'User' | 'Guest';
export type ChallengeCategory = 'Web' | 'Crypto' | 'Pwn' | 'Reverse' | 'Misc' | 'Forensics';
export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  currentPoints: number;
  teamId?: number;
  teamName?: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  isActive: boolean;
  isSolved?: boolean;
}

export interface Submission {
  id: number;
  userId: number;
  challengeId: number;
  submittedFlag: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface LeaderboardEntry extends User {
  rank: number;
  solvedChallenges: number;
  lastSolveTime?: string;
}