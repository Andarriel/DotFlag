import { useState, useEffect } from 'react';
import { MOCK_PROFILES } from '../data/mockData';
import { userService } from '../services/userService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { USE_MOCK } from '../config';
import type { Profile } from '../types';

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

    if (isOwnProfile) {
      userService.getMyProfile(api)
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
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      userService.getById(api, userId)
        .then(publicUser => {
          setProfile({
            id: publicUser.id,
            username: publicUser.username,
            email: '',
            role: 'User',
            currentPoints: publicUser.currentPoints,
            bio: '',
            joinedAt: publicUser.registeredOn || new Date().toISOString(),
            flagHistory: [],
          });
        })
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    }
  }, [api, userId, isOwnProfile]);

  return { profile, isOwnProfile, loading };
}
