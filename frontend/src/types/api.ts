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
  lastLoginAt: string | null;
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

export interface ApiHint {
  id: number;
  content: string;
  order: number;
}

export interface ApiChallengeFile {
  id: number;
  fileName: string;
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
  hasInstance: boolean;
  dockerImage: string | null;
  containerPort: number | null;
  hints: ApiHint[];
  files: ApiChallengeFile[];
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
  hasInstance?: boolean;
  dockerImage?: string;
  containerPort?: number;
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
  hasInstance?: boolean;
  dockerImage?: string;
  containerPort?: number;
}

export interface ApiChallengeInstance {
  id: number;
  challengeId: number;
  host: string;
  port: number;
  createdAt: string;
  expiresAt: string | null;
  status: string;
}

export interface ApiDockerContainer {
  instanceId: number;
  containerId: string;
  challengeId: number;
  challengeName: string;
  userId: number;
  username: string;
  hostPort: number;
  status: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface ApiDockerSettings {
  id: number;
  host: string;
  maxGlobalInstances: number;
  instanceTimeoutMinutes: number;
}

export interface UpdateDockerSettingsPayload {
  host: string;
  maxGlobalInstances: number;
  instanceTimeoutMinutes: number;
}

export interface ApiDockerPing {
  reachable: boolean;
  latencyMs: number | null;
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

export enum AuditAction {
  ChallengeCreated = 'ChallengeCreated',
  ChallengeUpdated = 'ChallengeUpdated',
  ChallengeDisabled = 'ChallengeDisabled',
  ChallengeEnabled = 'ChallengeEnabled',
  FlagChanged = 'FlagChanged',
  HintAdded = 'HintAdded',
  HintRemoved = 'HintRemoved',
  FileUploaded = 'FileUploaded',
  FileRemoved = 'FileRemoved',
  UserBanned = 'UserBanned',
  UserUnbanned = 'UserUnbanned',
  UserPromoted = 'UserPromoted',
  UserDemoted = 'UserDemoted',
  LoginSuccess = 'LoginSuccess',
  LoginFailed = 'LoginFailed',
  PasswordChanged = 'PasswordChanged',
  UserRegistered = 'UserRegistered',
  TeamDisbanded = 'TeamDisbanded',
  DockerInstanceStarted = 'DockerInstanceStarted',
  DockerInstanceStopped = 'DockerInstanceStopped',
  DockerInstanceKilled = 'DockerInstanceKilled',
  SystemCleanup = 'SystemCleanup',
}

export interface ApiAuditLog {
  id: number;
  actorId: number | null;
  actorUsername: string | null;
  action: AuditAction;
  targetType: string | null;
  targetId: number | null;
  metadata: string | null;
  ipAddress: string | null;
  createdOn: string;
}

export interface AuditLogFilter {
  page?: number;
  pageSize?: number;
  action?: AuditAction;
  actorId?: number;
  from?: string;
  to?: string;
}

export interface ApiAuditLogPage {
  items: ApiAuditLog[];
  total: number;
  page: number;
  pageSize: number;
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

export type CtfState = 'Upcoming' | 'Running' | 'Ended' | 'ComingSoon';

export interface ApiCtfStatus {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  state: CtfState;
}

export interface UpdateCtfEventPayload {
  name: string;
  startTime: string;
  endTime: string;
  isComingSoon: boolean;
}
