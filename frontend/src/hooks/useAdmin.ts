import { useState, useEffect } from 'react';
import { MOCK_ADMIN_USERS, MOCK_CHALLENGES, MOCK_DOCKER_IMAGES } from '../data/mockData';
import { userService } from '../services/userService';
import { challengeService } from '../services/challengeService';
import { useAxios } from '../context/AxiosContext';
import { USE_MOCK } from '../config';
import type { ApiUser, ApiChallenge } from '../types/api';
import type { AdminUser, Challenge, DockerImage, ChallengeCategory } from '../types';

export type AdminTab = 'users' | 'challenges' | 'docker';

const CATEGORY_MAP: Record<number, ChallengeCategory> = {
  0: 'Web', 1: 'Pwn', 2: 'Crypto', 3: 'Reverse', 4: 'Forensics', 5: 'Misc', 6: 'OSINT',
};

function mapApiUserToAdmin(u: ApiUser): AdminUser {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    currentPoints: u.currentPoints,
    isBanned: false,
    lastLogin: '',
    sessionActive: false,
  };
}

function mapApiChallenge(c: ApiChallenge): Challenge {
  return {
    id: c.id,
    title: c.name,
    description: c.description,
    points: c.currentPoints,
    category: CATEGORY_MAP[c.category] ?? 'Misc',
    difficulty: c.maxPoints <= 200 ? 'Easy' : c.maxPoints <= 400 ? 'Medium' : 'Hard',
    isActive: c.isActive,
  };
}

export function useAdmin() {
  const api = useAxios();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<AdminUser[]>(USE_MOCK ? MOCK_ADMIN_USERS : []);
  const [challenges, setChallenges] = useState<Challenge[]>(USE_MOCK ? MOCK_CHALLENGES : []);
  const [dockerImages] = useState<DockerImage[]>(MOCK_DOCKER_IMAGES);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;
    setLoading(true);
    Promise.all([
      userService.getAll(api).then(data => setUsers(data.map(mapApiUserToAdmin))),
      challengeService.getAll(api).then(data => setChallenges(data.map(mapApiChallenge))),
    ]).finally(() => setLoading(false));
  }, [api]);

  const toggleBan = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const kickSession = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, sessionActive: false } : u));
  };

  const promoteToAdmin = (userId: number) => {
    if (!USE_MOCK) {
      const user = users.find(u => u.id === userId);
      if (user) {
        userService.update(api, userId, {
          username: user.username,
          email: user.email,
          role: 'Admin',
        });
      }
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'Admin' as const } : u));
  };

  const toggleChallengeActive = (challengeId: number) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, isActive: !c.isActive } : c));
  };

  return {
    activeTab, setActiveTab,
    users, challenges, dockerImages,
    toggleBan, kickSession, promoteToAdmin, toggleChallengeActive,
    loading,
  };
}
