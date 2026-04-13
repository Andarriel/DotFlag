import { useState, useEffect } from 'react';
import { MOCK_PROFILES } from '../data/mockData';
import { userService } from '../services/userService';
import { submissionService } from '../services/submissionService';
import { challengeService } from '../services/challengeService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { USE_MOCK } from '../config';
import type { Profile, FlagEntry } from '../types';

function authToProfile(user: { id: number; email: string; username: string; role: string; currentPoints?: number }): Profile {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as Profile['role'],
    currentPoints: user.currentPoints ?? 0,
    bio: '',
    joinedAt: '',
    flagHistory: [],
  };
}

export function useProfile(userId: number): { profile: Profile | null; isOwnProfile: boolean; loading: boolean } {
  const api = useAxios();
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;

  const [profile, setProfile] = useState<Profile | null>(() => {
    if (USE_MOCK) return MOCK_PROFILES.find(p => p.id === userId) ?? null;
    if (isOwnProfile && user) return authToProfile(user);
    return null;
  });
  const [loading, setLoading] = useState(!USE_MOCK && !isOwnProfile);

  useEffect(() => {
    if (USE_MOCK) return;

    const fetchFlagHistory = async (): Promise<FlagEntry[]> => {
      try {
        const [subs, challenges] = await Promise.all([
          submissionService.getMy(api),
          challengeService.getAll(api),
        ]);
        const challengeMap = new Map(challenges.map(c => [c.id, c]));
        return subs.map(s => {
            const ch = challengeMap.get(s.challengeId);
            const basePoints = ch?.currentPoints ?? 0;
            return {
              challengeId: s.challengeId,
              challengeTitle: s.challengeName,
              points: s.isCorrect ? basePoints + (s.bonusPoints || 0) : 0,
              solvedAt: s.timestamp,
              category: (ch?.category as unknown as string ?? 'Misc') as FlagEntry['category'],
              isCorrect: s.isCorrect,
              isFirstBlood: s.bonusPoints > 0,
            };
          });
      } catch {
        return [];
      }
    };

    if (isOwnProfile) {
      Promise.all([userService.getMyProfile(api), fetchFlagHistory()])
        .then(([apiUser, flagHistory]) => {
          setProfile({
            id: apiUser.id,
            username: apiUser.username,
            email: apiUser.email,
            role: apiUser.role,
            currentPoints: apiUser.currentPoints,
            bio: '',
            joinedAt: apiUser.registeredOn || new Date().toISOString(),
            flagHistory,
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        userService.getById(api, userId),
        submissionService.getByUser(api, userId).catch(() => []),
        challengeService.getAll(api).catch(() => []),
      ])
        .then(([publicUser, subs, challenges]) => {
          const challengeMap = new Map(challenges.map(c => [c.id, c]));
          setProfile({
            id: publicUser.id,
            username: publicUser.username,
            email: '',
            role: 'User',
            currentPoints: publicUser.currentPoints,
            bio: '',
            joinedAt: publicUser.registeredOn || new Date().toISOString(),
            flagHistory: subs.map(s => {
              const ch = challengeMap.get(s.challengeId);
              const basePoints = ch?.currentPoints ?? 0;
              return {
                challengeId: s.challengeId,
                challengeTitle: s.challengeName,
                points: s.isCorrect ? basePoints + (s.bonusPoints || 0) : 0,
                solvedAt: s.timestamp,
                category: (ch?.category as unknown as string ?? 'Misc') as FlagEntry['category'],
                isCorrect: s.isCorrect,
                isFirstBlood: s.bonusPoints > 0,
              };
            }),
          });
        })
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    }
  }, [api, userId, isOwnProfile]);

  return { profile, isOwnProfile, loading };
}
