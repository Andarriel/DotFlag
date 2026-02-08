import type { User, Challenge, LeaderboardEntry } from '../types';

export const MOCK_USER: User = {
  id: 1,
  username: "Pavel_Admin",
  email: "admin@dotflag.md",
  role: "Admin",
  currentPoints: 1337,
  teamId: 1,
  teamName: "Cyber Elite"
};

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Hello World",
    description: "Find the flag in this simple web challenge.",
    points: 100,
    category: "Web",
    difficulty: "Easy",
    isActive: true,
    isSolved: false
  },
  {
    id: 2,
    title: "Base64 Madness",
    description: "Decode the Base64 string to find the flag.",
    points: 200, 
    category: "Crypto",
    difficulty: "Medium",
    isActive: true,
    isSolved: false
  },
  {
    id: 3,
    title: "Buffer Overflow 101",
    description: "Exploit the buffer overflow vulnerability to get the flag.",
    points: 300,
    category: "Pwn",
    difficulty: "Hard",
    isActive: true,
    isSolved: false
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 1,
    username: "Pavel_Admin",
    email: "admin@dotflag.md",
    role: "Admin",
    currentPoints: 1337,
    teamId: 1,
    teamName: "Cyber Elite",
    rank: 1,
    solvedChallenges: 15,
    lastSolveTime: "2026-02-09T14:30:00Z"
  },
  {
    id: 2,
    username: "h4ck3r_pro",
    email: "hacker@dotflag.md",
    role: "User",
    currentPoints: 1200,
    teamId: 1,
    teamName: "Cyber Elite",
    rank: 2,
    solvedChallenges: 12,
    lastSolveTime: "2026-02-09T13:15:00Z"
  },
  {
    id: 3,
    username: "cyber_ninja",
    email: "ninja@dotflag.md",
    role: "User",
    currentPoints: 1050,
    teamId: 2,
    teamName: "Script Kiddies",
    rank: 3,
    solvedChallenges: 11,
    lastSolveTime: "2026-02-09T12:00:00Z"
  },
  {
    id: 4,
    username: "crypto_king",
    email: "king@dotflag.md",
    role: "User",
    currentPoints: 980,
    rank: 4,
    solvedChallenges: 10,
    lastSolveTime: "2026-02-08T22:45:00Z"
  },
  {
    id: 5,
    username: "pwn_master",
    email: "pwn@dotflag.md",
    role: "User",
    currentPoints: 875,
    teamId: 2,
    teamName: "Script Kiddies",
    rank: 5,
    solvedChallenges: 9,
    lastSolveTime: "2026-02-08T20:30:00Z"
  },
  {
    id: 6,
    username: "web_wizard",
    email: "wizard@dotflag.md",
    role: "User",
    currentPoints: 750,
    teamId: 3,
    teamName: "Code Breakers",
    rank: 6,
    solvedChallenges: 8,
    lastSolveTime: "2026-02-08T18:00:00Z"
  },
  {
    id: 7,
    username: "rev_engineer",
    email: "reverse@dotflag.md",
    role: "User",
    currentPoints: 650,
    rank: 7,
    solvedChallenges: 7,
    lastSolveTime: "2026-02-08T15:20:00Z"
  },
  {
    id: 8,
    username: "forensic_fox",
    email: "fox@dotflag.md",
    role: "User",
    currentPoints: 580,
    teamId: 3,
    teamName: "Code Breakers",
    rank: 8,
    solvedChallenges: 6,
    lastSolveTime: "2026-02-08T10:10:00Z"
  },
  {
    id: 9,
    username: "script_kiddie",
    email: "script@dotflag.md",
    role: "User",
    currentPoints: 420,
    rank: 9,
    solvedChallenges: 5,
    lastSolveTime: "2026-02-07T19:40:00Z"
  },
  {
    id: 10,
    username: "newbie_hacker",
    email: "newbie@dotflag.md",
    role: "User",
    currentPoints: 300,
    rank: 10,
    solvedChallenges: 3,
    lastSolveTime: "2026-02-07T16:25:00Z"
  }
];

// Mock data for team progress over time
export interface TeamProgressPoint {
  timestamp: string;
  points: number;
}

export interface TeamProgress {
  teamId: number;
  teamName: string;
  color: string;
  progress: TeamProgressPoint[];
}

export const MOCK_TEAM_PROGRESS: TeamProgress[] = [
  {
    teamId: 1,
    teamName: "Cyber Elite",
    color: "#6366f1", // indigo
    progress: [
      { timestamp: "2026-02-09T01:00:00Z", points: 0 },
      { timestamp: "2026-02-09T02:00:00Z", points: 300 },
      { timestamp: "2026-02-09T03:00:00Z", points: 800 },
      { timestamp: "2026-02-09T04:00:00Z", points: 1200 },
      { timestamp: "2026-02-09T05:00:00Z", points: 1800 },
      { timestamp: "2026-02-09T06:00:00Z", points: 2200 },
      { timestamp: "2026-02-09T07:00:00Z", points: 2537 }
    ]
  },
  {
    teamId: 2,
    teamName: "Script Kiddies",
    color: "#ec4899", // pink
    progress: [
      { timestamp: "2026-02-09T01:00:00Z", points: 0 },
      { timestamp: "2026-02-09T02:00:00Z", points: 200 },
      { timestamp: "2026-02-09T03:00:00Z", points: 650 },
      { timestamp: "2026-02-09T04:00:00Z", points: 900 },
      { timestamp: "2026-02-09T05:00:00Z", points: 1300 },
      { timestamp: "2026-02-09T06:00:00Z", points: 1650 },
      { timestamp: "2026-02-09T07:00:00Z", points: 1925 }
    ]
  },
  {
    teamId: 3,
    teamName: "Code Breakers",
    color: "#10b981", // green
    progress: [
      { timestamp: "2026-02-09T01:00:00Z", points: 0 },
      { timestamp: "2026-02-09T02:00:00Z", points: 150 },
      { timestamp: "2026-02-09T03:00:00Z", points: 500 },
      { timestamp: "2026-02-09T04:00:00Z", points: 750 },
      { timestamp: "2026-02-09T05:00:00Z", points: 900 },
      { timestamp: "2026-02-09T06:00:00Z", points: 1150 },
      { timestamp: "2026-02-09T07:00:00Z", points: 1330 }
    ]
  }
];