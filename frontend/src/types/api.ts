export type UserRole = 'Guest' | 'User' | 'Admin' | 'Owner';

export enum ChallengeCategory {
  Web = 0,
  Pwn = 1,
  Crypto = 2,
  Reverse = 3,
  Forensics = 4,
  Misc = 5,
  OSINT = 6,
}

export enum ChallengeDifficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
  Impossible = 3,
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  currentPoints: number;
  role: UserRole;
  isBanned: boolean;
  registeredOn: string;
}

export interface ApiUserProfile {
  id: number;
  username: string;
  currentPoints: number;
  registeredOn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface UpdateProfilePayload {
  username: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface ApiChallenge {
  id: number;
  name: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  minPoints: number;
  maxPoints: number;
  currentPoints: number;
  decayRate: number;
  firstBloodBonus: number;
  isActive: boolean;
  isSolved: boolean;
  solveCount: number;
  createdOn: string;
}

export interface CreateChallengePayload {
  name: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  minPoints: number;
  maxPoints: number;
  decayRate: number;
  firstBloodBonus: number;
  flag: string;
}

export interface UpdateChallengePayload {
  name: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  minPoints: number;
  maxPoints: number;
  decayRate: number;
  firstBloodBonus: number;
  flag: string;
  isActive: boolean;
}

export interface FlagSubmission {
  flag: string;
}

export interface ActionResponse {
  isSuccess: boolean;
  message: string;
}

export interface ApiLeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  score: number;
  solvesCount: number;
  lastSolveAt: string;
}

export interface ApiProgressPoint {
  timestamp: string;
  points: number;
  challengeName: string;
  challengePoints: number;
}

export interface ApiLeaderboardProgress {
  userId: number;
  username: string;
  progress: ApiProgressPoint[];
}

export interface ApiTeamLeaderboardEntry {
  rank: number;
  teamId: number;
  teamName: string;
  score: number;
  solvesCount: number;
  memberCount: number;
  lastSolveAt: string;
}
