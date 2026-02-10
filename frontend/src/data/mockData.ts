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

export interface TeamProgressPoint {
  timestamp: string;
  points: number;
  challengeName?: string;
  challengePoints?: number;
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
    color: "#6366f1",
    progress: [
      { timestamp: "2026-02-09T01:00:00Z", points: 0 },
      { timestamp: "2026-02-09T01:25:00Z", points: 100, challengeName: "Hello World", challengePoints: 100 },
      { timestamp: "2026-02-09T01:55:00Z", points: 300, challengeName: "Base64 Madness", challengePoints: 200 },
      { timestamp: "2026-02-09T02:20:00Z", points: 500, challengeName: "SQL Injection 101", challengePoints: 200 },
      { timestamp: "2026-02-09T02:50:00Z", points: 700, challengeName: "XSS Hunter", challengePoints: 200 },
      { timestamp: "2026-02-09T03:25:00Z", points: 1000, challengeName: "Buffer Overflow 101", challengePoints: 300 },
      { timestamp: "2026-02-09T04:00:00Z", points: 1300, challengeName: "RSA Basics", challengePoints: 300 },
      { timestamp: "2026-02-09T04:40:00Z", points: 1500, challengeName: "Packet Sniff", challengePoints: 200 },
      { timestamp: "2026-02-09T05:15:00Z", points: 1800, challengeName: "Kernel Panic", challengePoints: 300 },
      { timestamp: "2026-02-09T05:50:00Z", points: 2100, challengeName: "Memory Forensics", challengePoints: 300 },
      { timestamp: "2026-02-09T06:30:00Z", points: 2337, challengeName: "Hidden Service", challengePoints: 237 },
      { timestamp: "2026-02-09T07:00:00Z", points: 2537, challengeName: "Final Boss", challengePoints: 200 },
    ]
  },
  {
    teamId: 2,
    teamName: "Script Kiddies",
    color: "#ec4899",
    progress: [
      { timestamp: "2026-02-09T01:00:00Z", points: 0 },
      { timestamp: "2026-02-09T01:45:00Z", points: 100, challengeName: "Hello World", challengePoints: 100 },
      { timestamp: "2026-02-09T02:25:00Z", points: 250, challengeName: "Robots.txt", challengePoints: 150 },
      { timestamp: "2026-02-09T03:05:00Z", points: 500, challengeName: "Base64 Madness", challengePoints: 250 },
      { timestamp: "2026-02-09T03:35:00Z", points: 700, challengeName: "Directory Traversal", challengePoints: 200 },
      { timestamp: "2026-02-09T04:20:00Z", points: 950, challengeName: "XSS Hunter", challengePoints: 250 },
      { timestamp: "2026-02-09T05:00:00Z", points: 1200, challengeName: "SQL Injection 101", challengePoints: 250 },
      { timestamp: "2026-02-09T05:35:00Z", points: 1450, challengeName: "Packet Sniff", challengePoints: 250 },
      { timestamp: "2026-02-09T06:10:00Z", points: 1650, challengeName: "Cookie Monster", challengePoints: 200 },
      { timestamp: "2026-02-09T06:40:00Z", points: 1800, challengeName: "JWT Cracker", challengePoints: 150 },
      { timestamp: "2026-02-09T07:00:00Z", points: 1925, challengeName: "Log Analysis", challengePoints: 125 },
    ]
  },
  {
    teamId: 3,
    teamName: "Code Breakers",
    color: "#10b981",
    progress: [
      { timestamp: "2026-02-09T01:00:00Z", points: 0 },
      { timestamp: "2026-02-09T02:10:00Z", points: 100, challengeName: "Hello World", challengePoints: 100 },
      { timestamp: "2026-02-09T02:40:00Z", points: 200, challengeName: "Robots.txt", challengePoints: 100 },
      { timestamp: "2026-02-09T03:20:00Z", points: 400, challengeName: "Base64 Madness", challengePoints: 200 },
      { timestamp: "2026-02-09T04:05:00Z", points: 600, challengeName: "Caesar Cipher", challengePoints: 200 },
      { timestamp: "2026-02-09T04:50:00Z", points: 800, challengeName: "Simple Overflow", challengePoints: 200 },
      { timestamp: "2026-02-09T05:35:00Z", points: 1000, challengeName: "Log Analysis", challengePoints: 200 },
      { timestamp: "2026-02-09T06:20:00Z", points: 1150, challengeName: "Steganography", challengePoints: 150 },
      { timestamp: "2026-02-09T07:00:00Z", points: 1330, challengeName: "Network Recon", challengePoints: 180 },
    ]
  }
];