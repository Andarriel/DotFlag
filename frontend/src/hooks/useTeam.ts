import { useState, useEffect, useCallback } from 'react';
import { MOCK_TEAM } from '../data/mockData';
import { teamService } from '../services/teamService';
import { useAxios } from '../context/AxiosContext';
import { useToast } from '../context/ToastContext';
import { USE_MOCK } from '../config';
import type { Team } from '../types';

export function useTeam() {
  const api = useAxios();
  const toast = useToast();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTeam = useCallback(() => {
    if (USE_MOCK) {
      setTeam(MOCK_TEAM);
      return;
    }
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
            points: m.currentPoints || 0,
            joinedAt: m.createdOn || '',
          })),
          totalPoints: (data.members || []).reduce((sum: number, m: any) => sum + (m.currentPoints || 0), 0),
          createdAt: (data as any).createdOn || '',
        });
      })
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

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
      const res = await teamService.leave(api);
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

  return { team, loading, inviteCode, setInviteCode, copied, copyInviteCode, joinTeam, createTeam, leaveTeam };
}
