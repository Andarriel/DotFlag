import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { teamService } from '../services/teamService';
import { useAxios } from './AxiosContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { USE_MOCK } from '../config';
import { MOCK_TEAM } from '../data/mockData';
import type { Team } from '../types';

interface TeamContextType {
  team: Team | null;
  loading: boolean;
  isLeader: boolean;
  refresh: () => void;
  inviteCode: string;
  setInviteCode: (code: string) => void;
  copied: boolean;
  copyInviteCode: () => void;
  joinTeam: () => Promise<void>;
  createTeam: (name: string) => Promise<void>;
  leaveTeam: () => Promise<void>;
  disbandTeam: () => Promise<void>;
  regenerateInvite: () => Promise<void>;
  removeMember: (memberId: number) => Promise<void>;
  renameTeam: (name: string) => Promise<boolean>;
  transferLeadership: (memberId: number) => Promise<boolean>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const api = useAxios();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const [team, setTeam] = useState<Team | null>(USE_MOCK ? MOCK_TEAM : null);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTeam = useCallback(() => {
    if (USE_MOCK || !isAuthenticated) return;
    setLoading(true);
    teamService.get(api)
      .then(data => {
        setTeam({
          id: data.id,
          name: data.name,
          inviteCode: (data as any).inviteCode || '',
          members: (data.members || []).map((m: any) => ({
            id: m.id,
            username: m.username,
            role: 'User' as const,
            teamRole: m.teamRole === 'Leader' ? 'Leader' : 'Member',
            points: m.currentPoints || 0,
            joinedAt: m.registeredOn || '',
          })),
          totalPoints: (data.members || []).reduce((sum: number, m: any) => sum + (m.currentPoints || 0), 0),
          createdAt: (data as any).createdOn || '',
        });
      })
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [api, isAuthenticated]);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  useEffect(() => {
    if (!isAuthenticated) setTeam(null);
  }, [isAuthenticated]);

  const copyInviteCode = () => {
    if (team) {
      navigator.clipboard.writeText(team.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const joinTeam = async () => {
    if (!inviteCode.trim()) return;
    if (USE_MOCK) { toast.success('Joined team (mock)'); return; }
    try {
      const res = await teamService.join(api, inviteCode);
      if (res.isSuccess) {
        toast.success('Joined team!');
        setInviteCode('');
        fetchTeam();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to join team');
    }
  };

  const createTeam = async (name: string) => {
    if (USE_MOCK) { toast.success('Team created (mock)'); return; }
    try {
      await teamService.create(api, name);
      toast.success('Team created!');
      fetchTeam();
    } catch {
      toast.error('Failed to create team');
    }
  };

  const leaveTeam = async () => {
    if (!team) return;
    if (USE_MOCK) { setTeam(null); toast.info('Left team'); return; }
    try {
      const res = await teamService.leave(api, team.id);
      if (res.isSuccess) {
        setTeam(null);
        toast.success('Left team');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to leave team');
    }
  };

  const disbandTeam = async () => {
    if (!team) return;
    if (USE_MOCK) { setTeam(null); toast.info('Team disbanded'); return; }
    try {
      const res = await teamService.disband(api, team.id);
      if (res.isSuccess) {
        setTeam(null);
        toast.success('Team disbanded');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to disband team');
    }
  };

  const regenerateInvite = async () => {
    if (!team) return;
    if (USE_MOCK) { toast.success('Invite code regenerated (mock)'); return; }
    try {
      const res = await teamService.regenerateInvite(api, team.id);
      if (res.isSuccess) {
        toast.success('Invite code regenerated');
        fetchTeam();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to regenerate invite code');
    }
  };

  const isLeader = !!team && !!user &&
    team.members.some(m => m.id === user.id && m.teamRole === 'Leader');

  const renameTeam = async (name: string): Promise<boolean> => {
    if (!team) return false;
    if (USE_MOCK) { setTeam(prev => prev ? { ...prev, name } : null); toast.success('Team renamed (mock)'); return true; }
    try {
      const res = await teamService.rename(api, team.id, name);
      if (res.isSuccess) {
        toast.success('Team renamed');
        setTeam(prev => prev ? { ...prev, name } : null);
        return true;
      } else {
        toast.error(res.message);
        return false;
      }
    } catch {
      toast.error('Failed to rename team');
      return false;
    }
  };

  const transferLeadership = async (memberId: number): Promise<boolean> => {
    if (!team) return false;
    if (USE_MOCK) { toast.success('Leadership transferred (mock)'); return true; }
    try {
      const res = await teamService.transferLeadership(api, team.id, memberId);
      if (res.isSuccess) {
        toast.success('Leadership transferred');
        fetchTeam();
        return true;
      } else {
        toast.error(res.message);
        return false;
      }
    } catch {
      toast.error('Failed to transfer leadership');
      return false;
    }
  };

  const removeMember = async (memberId: number) => {
    if (!team) return;
    if (USE_MOCK) { toast.success('Member removed (mock)'); return; }
    try {
      const res = await teamService.removeMember(api, team.id, memberId);
      if (res.isSuccess) {
        toast.success('Member removed');
        fetchTeam();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to remove member');
    }
  };

  return (
    <TeamContext.Provider value={{ team, loading, isLeader, refresh: fetchTeam, inviteCode, setInviteCode, copied, copyInviteCode, joinTeam, createTeam, leaveTeam, disbandTeam, regenerateInvite, removeMember, renameTeam, transferLeadership }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeamContext must be used within TeamProvider');
  return ctx;
};
