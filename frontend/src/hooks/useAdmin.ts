import { useState, useEffect, useCallback } from 'react';
import { MOCK_ADMIN_USERS, MOCK_CHALLENGES, MOCK_DOCKER_IMAGES } from '../data/mockData';
import { userService } from '../services/userService';
import { challengeService } from '../services/challengeService';
import { useAxios } from '../context/AxiosContext';
import { useToast } from '../context/ToastContext';
import { USE_MOCK } from '../config';
import type { ApiUser, ApiChallenge, CreateChallengePayload, UpdateChallengePayload, UserRole } from '../types/api';
import type { AdminUser, Challenge, DockerImage, ChallengeCategory, ChallengeDifficulty } from '../types';

export type AdminTab = 'users' | 'challenges' | 'notifications' | 'docker' | 'logs' | 'ctf';

const CATEGORY_MAP: Record<string, ChallengeCategory> = {
  Web: 'Web', Pwn: 'Pwn', Crypto: 'Crypto', Reverse: 'Reverse',
  Forensics: 'Forensics', Misc: 'Misc', OSINT: 'OSINT',
};

const DIFFICULTY_MAP: Record<string, ChallengeDifficulty> = {
  Easy: 'Easy', Medium: 'Medium', Hard: 'Hard', Impossible: 'Hard',
};

function mapApiUserToAdmin(u: ApiUser): AdminUser {
  return {
    id: u.id, username: u.username, email: u.email, role: u.role,
    currentPoints: u.currentPoints, isBanned: u.isBanned, lastLogin: u.lastLoginAt,
  };
}

function mapApiChallenge(c: ApiChallenge): Challenge {
  return {
    id: c.id, title: c.name, description: c.description, points: c.currentPoints,
    category: CATEGORY_MAP[c.category] ?? 'Misc',
    difficulty: DIFFICULTY_MAP[c.difficulty] ?? 'Medium',
    isActive: c.isActive,
    isTimeLimited: c.isTimeLimited ?? true,
    solveCount: c.solveCount ?? 0,
    firstBloodBonus: c.firstBloodBonus ?? 0,
  };
}

export function useAdmin() {
  const api = useAxios();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<AdminUser[]>(USE_MOCK ? MOCK_ADMIN_USERS : []);
  const [challenges, setChallenges] = useState<Challenge[]>(USE_MOCK ? MOCK_CHALLENGES : []);
  const [dockerImages] = useState<DockerImage[]>(MOCK_DOCKER_IMAGES);
  const [loading, setLoading] = useState(!USE_MOCK);

  const refresh = useCallback(() => {
    if (USE_MOCK) return;
    setLoading(true);
    Promise.all([
      userService.getAll(api).then(data => setUsers(data.map(mapApiUserToAdmin))),
      challengeService.getAll(api).then(data => setChallenges(data.map(mapApiChallenge))),
    ]).finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);

  const promote = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (USE_MOCK) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'Admin' as const } : u));
      return;
    }
    try {
      const res = await userService.promote(api, userId);
      if (res.isSuccess) {
        toast.success(`${user.username} promoted to Admin`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'Admin' as const } : u));
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to promote user');
    }
  };

  const demote = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (USE_MOCK) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'User' as const } : u));
      return;
    }
    try {
      const res = await userService.demote(api, userId);
      if (res.isSuccess) {
        toast.success(`${user.username} demoted to User`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'User' as const } : u));
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to demote user');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!USE_MOCK) {
      try {
        await userService.delete(api, userId);
        toast.success('User deleted');
      } catch {
        toast.error('Failed to delete user');
        return;
      }
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const createChallenge = async (data: CreateChallengePayload) => {
    if (!USE_MOCK) {
      try {
        const res = await challengeService.create(api, data);
        if (!res.isSuccess) { toast.error(res.message); return; }
        toast.success('Challenge created');
        refresh();
      } catch {
        toast.error('Failed to create challenge');
      }
      return;
    }
    toast.success('Challenge created (mock)');
  };

  const updateChallenge = async (challengeId: number, data: UpdateChallengePayload) => {
    if (USE_MOCK) {
      toast.success('Challenge updated (mock)');
      return;
    }
    try {
      const res = await challengeService.update(api, challengeId, data);
      if (res.isSuccess) {
        toast.success('Challenge updated');
        refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to update challenge');
    }
  };

  const toggleChallengeActive = async (challengeId: number) => {
    if (USE_MOCK) {
      setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, isActive: !c.isActive } : c));
      return;
    }
    try {
      const full = await challengeService.getById(api, challengeId);
      const res = await challengeService.update(api, challengeId, {
        name: full.name,
        description: full.description,
        category: full.category,
        difficulty: full.difficulty,
        minPoints: full.minPoints,
        maxPoints: full.maxPoints,
        decayRate: full.decayRate,
        firstBloodBonus: full.firstBloodBonus,
        flag: '',
        isActive: !full.isActive,
        isTimeLimited: full.isTimeLimited ?? true,
      });
      if (res.isSuccess) {
        toast.success(full.isActive ? 'Challenge deactivated' : 'Challenge activated');
        setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, isActive: !c.isActive } : c));
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to toggle challenge');
    }
  };

  const cloneChallenge = async (challengeId: number) => {
    if (USE_MOCK) {
      toast.success('Challenge cloned (mock)');
      return;
    }
    try {
      const res = await challengeService.clone(api, challengeId);
      if (res.isSuccess) {
        toast.success('Challenge cloned');
        refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to clone challenge');
    }
  };

  const deleteChallenge = async (challengeId: number) => {
    if (!USE_MOCK) {
      try {
        await challengeService.delete(api, challengeId);
        toast.success('Challenge deleted');
      } catch {
        toast.error('Failed to delete challenge');
        return;
      }
    }
    setChallenges(prev => prev.filter(c => c.id !== challengeId));
  };

  const toggleBan = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (USE_MOCK) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
      return;
    }
    try {
      const res = user.isBanned
        ? await userService.unban(api, userId)
        : await userService.ban(api, userId);
      if (res.isSuccess) {
        toast.success(user.isBanned ? `${user.username} unbanned` : `${user.username} banned`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update ban status');
    }
  };

  const registerUser = async (data: { username: string; email: string; password: string; role: UserRole }) => {
    if (USE_MOCK) {
      toast.success('User registered (mock)');
      return;
    }
    try {
      const res = await userService.create(api, data);
      if (res.isSuccess) {
        toast.success('User registered');
        refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to register user');
    }
  };

  return {
    activeTab, setActiveTab,
    users, challenges, dockerImages,
    toggleBan, promote, demote, deleteUser,
    createChallenge, updateChallenge, toggleChallengeActive, deleteChallenge, cloneChallenge,
    registerUser, loading, refresh,
  };
}
