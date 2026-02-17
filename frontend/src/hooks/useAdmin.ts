import { useState } from 'react';
import { MOCK_ADMIN_USERS, MOCK_CHALLENGES, MOCK_DOCKER_IMAGES } from '../data/mockData';
import type { AdminUser, Challenge, DockerImage } from '../types';

export type AdminTab = 'users' | 'challenges' | 'docker';

export function useAdmin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [dockerImages] = useState<DockerImage[]>(MOCK_DOCKER_IMAGES);

  const toggleBan = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const kickSession = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, sessionActive: false } : u));
  };

  const promoteToAdmin = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'Admin' as const } : u));
  };

  const toggleChallengeActive = (challengeId: number) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, isActive: !c.isActive } : c));
  };

  return {
    activeTab, setActiveTab,
    users, challenges, dockerImages,
    toggleBan, kickSession, promoteToAdmin, toggleChallengeActive,
  };
}
