import { MOCK_PROFILES } from '../data/mockData';
import type { Profile } from '../types';

export function useProfile(userId: number): { profile: Profile | null; isOwnProfile: boolean } {
  const profile = MOCK_PROFILES.find(p => p.id === userId) ?? null;
  return { profile, isOwnProfile: userId === 1 };
}
