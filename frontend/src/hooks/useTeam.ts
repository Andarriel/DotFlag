import { useState } from 'react';
import { MOCK_TEAM } from '../data/mockData';
import type { Team } from '../types';

export function useTeam(hasTeam: boolean) {
  const [team] = useState<Team | null>(hasTeam ? MOCK_TEAM : null);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (team) {
      navigator.clipboard.writeText(team.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return { team, inviteCode, setInviteCode, copied, copyInviteCode };
}
