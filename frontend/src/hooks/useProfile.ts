import { useState, useEffect } from 'react';
import { MOCK_PROFILES } from '../data/mockData';
import { userService } from '../services/userService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { USE_MOCK } from '../config';
import type { Profile } from '../types';

export function useProfile(userId: number): { profile: Profile | null; isOwnProfile: boolean; loading: boolean } {
  const api = useAxios();
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;

  const [profile, setProfile] = useState<Profile | null>(
    USE_MOCK ? (MOCK_PROFILES.find(p => p.id === userId) ?? null) : null
  );
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;
    setLoading(true);
    userService.getById(api, userId)
      .then(apiUser => {
        setProfile({
          id: apiUser.id,
          username: apiUser.username,
          email: apiUser.email,
          role: apiUser.role,
          currentPoints: apiUser.currentPoints,
          bio: '',
          joinedAt: apiUser.registeredOn || new Date().toISOString(),
          flagHistory: [],
        });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [api, userId]);

  return { profile, isOwnProfile, loading };
}
