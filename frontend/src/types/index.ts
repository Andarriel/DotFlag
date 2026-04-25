export type UserRole = 'Owner' | 'Admin' | 'User' | 'Guest';
export type ChallengeCategory = 'Web' | 'Crypto' | 'Pwn' | 'Reverse' | 'Misc' | 'Forensics' | 'OSINT';
export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Impossible';
export type DockerStatus = 'running' | 'stopped' | 'error';

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
  solveCount: number;
  firstBloodBonus: number;
  hasInstance?: boolean;
}

export interface ChallengeFile {
  id: number;
  fileName: string;
}

export interface DockerImage {
  id: number;
  challengeId: number;
  name: string;
  status: DockerStatus;
  ip: string;
  port: number;
  uptime: string;
  expiresAt: string;
}

export interface ChallengeHint {
  id: number;
  content: string;
  order: number;
}

export interface ChallengeDetail extends Challenge {
  files: ChallengeFile[];
  dockerImage?: DockerImage;
  hints: ChallengeHint[];
  solveCount: number;
  author: string;
}

export interface Submission {
  id: number;
  userId: number;
  challengeId: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface LeaderboardEntry extends User {
  rank: number;
  solvedChallenges: number;
  lastSolveTime?: string;
}

export interface TeamMember {
  id: number;
  username: string;
  role: UserRole;
  teamRole?: 'Leader' | 'Member';
  points: number;
  joinedAt: string;
}

export interface Team {
  id: number;
  name: string;
  inviteCode: string;
  members: TeamMember[];
  totalPoints: number;
  createdAt: string;
}

export interface FlagEntry {
  challengeId: number;
  challengeTitle: string;
  points: number;
  solvedAt: string;
  category: ChallengeCategory;
  isCorrect: boolean;
  isFirstBlood?: boolean;
}

export interface Profile extends User {
  bio: string;
  joinedAt: string;
  flagHistory: FlagEntry[];
}

export interface AdminUser extends User {
  isBanned: boolean;
  lastLogin: string | null;
}

export interface TeamProgressPoint {
  timestamp: string;
  points: number;
  challengeName?: string;
  challengePoints?: number;
}

export interface TeamProgress {
  teamId: number;
  teamName: string;
  color: string;
  progress: TeamProgressPoint[];
}
