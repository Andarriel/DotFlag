import type { ChallengeCategory, ChallengeDifficulty } from './types';

export const CHALLENGE_CATEGORIES: readonly ChallengeCategory[] = [
  'Web',
  'Crypto', 
  'Pwn',
  'Reverse',
  'Misc',
  'Forensics'
] as const;

export const CHALLENGE_DIFFICULTIES: readonly ChallengeDifficulty[] = [
  'Easy',
  'Medium',
  'Hard'
] as const;