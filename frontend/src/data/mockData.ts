import type {
  User, Challenge, LeaderboardEntry, TeamProgress,
  ChallengeDetail, AdminUser, Team, Profile, DockerImage, Submission,
} from '../types';

// ── Users ──

export const MOCK_USER: User = {
  id: 1,
  username: "Pavel_Admin",
  email: "admin@dotflag.md",
  role: "Admin",
  currentPoints: 1337,
  teamId: 1,
  teamName: "Cyber Elite",
};

// ── Challenges ──

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 1, title: "Hello World", description: "Find the flag in this simple web challenge.", points: 100, category: "Web", difficulty: "Easy", isActive: true, isSolved: false },
  { id: 2, title: "Base64 Madness", description: "Decode the Base64 string to find the flag.", points: 200, category: "Crypto", difficulty: "Medium", isActive: true, isSolved: false },
  { id: 3, title: "Buffer Overflow 101", description: "Exploit the buffer overflow vulnerability to get the flag.", points: 300, category: "Pwn", difficulty: "Hard", isActive: true, isSolved: false },
  { id: 4, title: "SQL Injection Lab", description: "Bypass authentication using SQL injection techniques.", points: 250, category: "Web", difficulty: "Medium", isActive: true, isSolved: true },
  { id: 5, title: "Caesar Cipher", description: "Break the Caesar cipher to reveal the hidden message.", points: 100, category: "Crypto", difficulty: "Easy", isActive: true, isSolved: true },
  { id: 6, title: "Hidden Strings", description: "Use reverse engineering tools to find hidden strings in the binary.", points: 200, category: "Reverse", difficulty: "Medium", isActive: true, isSolved: false },
  { id: 7, title: "Packet Capture", description: "Analyze the network capture file to find the leaked credentials.", points: 150, category: "Forensics", difficulty: "Easy", isActive: true, isSolved: false },
  { id: 8, title: "Docker Escape", description: "Escape the containerized environment and read the flag.", points: 400, category: "Pwn", difficulty: "Hard", isActive: true, isSolved: false },
];

// ── Challenge Details ──

export const MOCK_CHALLENGE_DETAILS: ChallengeDetail[] = [
  {
    id: 1, title: "Hello World", description: "Find the flag in this simple web challenge. The flag is hidden somewhere in the source code of a basic web application. Inspect the HTML, CSS, and JavaScript to find it.", points: 100, category: "Web", difficulty: "Easy", isActive: true, isSolved: false,
    files: [{ id: 1, name: "challenge.zip", size: "2.3 KB" }],
    hints: [
      { id: 1, text: "Check the HTML comments in the source code", isUnlocked: true, cost: 0 },
      { id: 2, text: "The flag is in a hidden div element", isUnlocked: false, cost: 20 },
    ],
    solveCount: 42, author: "Pavel_Admin",
  },
  {
    id: 2, title: "Base64 Madness", description: "Decode the Base64 string to find the flag. But be careful - it's not just one layer of encoding. You'll need to decode multiple layers to reveal the final flag.", points: 200, category: "Crypto", difficulty: "Medium", isActive: true, isSolved: false,
    files: [{ id: 2, name: "encoded.txt", size: "512 B" }, { id: 3, name: "hint.pdf", size: "45 KB" }],
    hints: [
      { id: 3, text: "There are exactly 3 layers of encoding", isUnlocked: true, cost: 0 },
      { id: 4, text: "The second layer uses Base32, not Base64", isUnlocked: false, cost: 40 },
    ],
    solveCount: 28, author: "Pavel_Admin",
  },
  {
    id: 3, title: "Buffer Overflow 101", description: "Exploit the buffer overflow vulnerability to get the flag. A vulnerable C program is running on the remote server. Connect to it and exploit the buffer overflow to spawn a shell.", points: 300, category: "Pwn", difficulty: "Hard", isActive: true, isSolved: false,
    files: [{ id: 4, name: "vuln.c", size: "1.1 KB" }, { id: 5, name: "vuln", size: "8.2 KB" }],
    dockerImage: { id: 1, challengeId: 3, name: "dotflag/pwn-bof101", status: "running", ip: "10.0.13.37", port: 1337, uptime: "2h 15m", expiresAt: "2026-02-17T18:00:00Z" },
    hints: [
      { id: 5, text: "Look at the stack layout carefully", isUnlocked: true, cost: 0 },
      { id: 6, text: "The buffer is 64 bytes, return address is at offset 72", isUnlocked: false, cost: 50 },
      { id: 7, text: "There's a win() function at 0x08048456", isUnlocked: false, cost: 75 },
    ],
    solveCount: 12, author: "h4ck3r_pro",
  },
  {
    id: 4, title: "SQL Injection Lab", description: "Bypass authentication using SQL injection techniques. The login form is vulnerable to classic SQL injection. Can you log in as admin without knowing the password?\n\nThis challenge teaches basic SQLi concepts.", points: 250, category: "Web", difficulty: "Medium", isActive: true, isSolved: true,
    files: [{ id: 6, name: "app.py", size: "3.1 KB" }],
    hints: [
      { id: 8, text: "Try classic payloads in the username field", isUnlocked: true, cost: 0 },
      { id: 9, text: "' OR 1=1 -- is a good starting point", isUnlocked: false, cost: 50 },
    ],
    solveCount: 35, author: "Pavel_Admin",
  },
  {
    id: 5, title: "Caesar Cipher", description: "Break the Caesar cipher to reveal the hidden message. The encrypted text uses a simple shift cipher. Find the right shift value to decode the flag.", points: 100, category: "Crypto", difficulty: "Easy", isActive: true, isSolved: true,
    files: [{ id: 7, name: "cipher.txt", size: "256 B" }],
    hints: [
      { id: 10, text: "The shift value is between 1 and 25", isUnlocked: true, cost: 0 },
    ],
    solveCount: 56, author: "Pavel_Admin",
  },
  {
    id: 6, title: "Hidden Strings", description: "Use reverse engineering tools to find hidden strings in the binary. The flag is embedded somewhere in the executable. Use tools like strings, objdump, or Ghidra to find it.", points: 200, category: "Reverse", difficulty: "Medium", isActive: true, isSolved: false,
    files: [{ id: 8, name: "mystery_bin", size: "12.4 KB" }],
    dockerImage: { id: 3, challengeId: 6, name: "dotflag/reverse-strings", status: "running", ip: "10.0.13.39", port: 9090, uptime: "45m", expiresAt: "2026-02-17T16:30:00Z" },
    hints: [
      { id: 11, text: "Try running 'strings' on the binary first", isUnlocked: true, cost: 0 },
      { id: 12, text: "The flag is XOR'd with key 0x42", isUnlocked: false, cost: 40 },
    ],
    solveCount: 19, author: "h4ck3r_pro",
  },
  {
    id: 7, title: "Packet Capture", description: "Analyze the network capture file to find the leaked credentials. Someone accidentally sent their password in plain text over HTTP. Find it in the pcap file.", points: 150, category: "Forensics", difficulty: "Easy", isActive: true, isSolved: false,
    files: [{ id: 9, name: "capture.pcap", size: "1.8 MB" }, { id: 10, name: "readme.txt", size: "412 B" }],
    hints: [
      { id: 13, text: "Filter for HTTP POST requests", isUnlocked: false, cost: 30 },
    ],
    solveCount: 31, author: "Pavel_Admin",
  },
  {
    id: 8, title: "Docker Escape", description: "Escape the containerized environment and read the flag. You are dropped into a Docker container with limited privileges. Find a way to escape and read /flag.txt on the host.", points: 400, category: "Pwn", difficulty: "Hard", isActive: true, isSolved: false,
    files: [],
    dockerImage: { id: 2, challengeId: 8, name: "dotflag/docker-escape", status: "stopped", ip: "10.0.13.38", port: 4444, uptime: "0m", expiresAt: "2026-02-17T20:00:00Z" },
    hints: [
      { id: 14, text: "Check what capabilities the container has", isUnlocked: false, cost: 50 },
      { id: 15, text: "CAP_SYS_ADMIN is your friend here", isUnlocked: false, cost: 75 },
      { id: 16, text: "Mount the host filesystem using nsenter", isUnlocked: false, cost: 100 },
    ],
    solveCount: 3, author: "Pavel_Admin",
  },
];

// ── Submissions ──

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 1, userId: 1, challengeId: 1, isCorrect: true, timestamp: "2026-02-01T12:00:00Z" },
  { id: 2, userId: 1, challengeId: 1, isCorrect: false, timestamp: "2026-02-01T11:45:00Z" },
  { id: 3, userId: 2, challengeId: 1, isCorrect: true, timestamp: "2026-02-01T14:00:00Z" },
  { id: 4, userId: 1, challengeId: 2, isCorrect: true, timestamp: "2026-02-07T18:45:00Z" },
  { id: 5, userId: 3, challengeId: 2, isCorrect: false, timestamp: "2026-02-06T10:20:00Z" },
  { id: 6, userId: 2, challengeId: 3, isCorrect: true, timestamp: "2026-02-02T20:00:00Z" },
  { id: 7, userId: 1, challengeId: 4, isCorrect: true, timestamp: "2026-02-03T15:30:00Z" },
  { id: 8, userId: 1, challengeId: 5, isCorrect: true, timestamp: "2026-02-05T09:00:00Z" },
  { id: 9, userId: 5, challengeId: 3, isCorrect: false, timestamp: "2026-02-03T22:10:00Z" },
  { id: 10, userId: 4, challengeId: 6, isCorrect: true, timestamp: "2026-02-08T14:30:00Z" },
];

// ── Leaderboard ──

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 1, username: "Pavel_Admin", email: "admin@dotflag.md", role: "Admin", currentPoints: 1337, teamId: 1, teamName: "Cyber Elite", rank: 1, solvedChallenges: 15, lastSolveTime: "2026-02-09T14:30:00Z" },
  { id: 2, username: "h4ck3r_pro", email: "hacker@dotflag.md", role: "User", currentPoints: 1200, teamId: 1, teamName: "Cyber Elite", rank: 2, solvedChallenges: 12, lastSolveTime: "2026-02-09T13:15:00Z" },
  { id: 3, username: "cyber_ninja", email: "ninja@dotflag.md", role: "User", currentPoints: 1050, teamId: 2, teamName: "Script Kiddies", rank: 3, solvedChallenges: 11, lastSolveTime: "2026-02-09T12:00:00Z" },
  { id: 4, username: "crypto_king", email: "king@dotflag.md", role: "User", currentPoints: 980, rank: 4, solvedChallenges: 10, lastSolveTime: "2026-02-08T22:45:00Z" },
  { id: 5, username: "pwn_master", email: "pwn@dotflag.md", role: "User", currentPoints: 875, teamId: 2, teamName: "Script Kiddies", rank: 5, solvedChallenges: 9, lastSolveTime: "2026-02-08T20:30:00Z" },
  { id: 6, username: "web_wizard", email: "wizard@dotflag.md", role: "User", currentPoints: 750, teamId: 3, teamName: "Code Breakers", rank: 6, solvedChallenges: 8, lastSolveTime: "2026-02-08T18:00:00Z" },
  { id: 7, username: "rev_engineer", email: "reverse@dotflag.md", role: "User", currentPoints: 650, rank: 7, solvedChallenges: 7, lastSolveTime: "2026-02-08T15:20:00Z" },
  { id: 8, username: "forensic_fox", email: "fox@dotflag.md", role: "User", currentPoints: 580, teamId: 3, teamName: "Code Breakers", rank: 8, solvedChallenges: 6, lastSolveTime: "2026-02-08T10:10:00Z" },
  { id: 9, username: "script_kiddie", email: "script@dotflag.md", role: "User", currentPoints: 420, rank: 9, solvedChallenges: 5, lastSolveTime: "2026-02-07T19:40:00Z" },
  { id: 10, username: "newbie_hacker", email: "newbie@dotflag.md", role: "User", currentPoints: 300, rank: 10, solvedChallenges: 3, lastSolveTime: "2026-02-07T16:25:00Z" },
];

// ── Admin Users ──

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 1, username: "Pavel_Admin", email: "admin@dotflag.md", role: "Admin", currentPoints: 1337, teamId: 1, teamName: "Cyber Elite", isBanned: false, lastLogin: "2026-02-17T10:00:00Z", sessionActive: true },
  { id: 2, username: "h4ck3r_pro", email: "hacker@dotflag.md", role: "User", currentPoints: 1200, teamId: 1, teamName: "Cyber Elite", isBanned: false, lastLogin: "2026-02-17T09:30:00Z", sessionActive: true },
  { id: 3, username: "cyber_ninja", email: "ninja@dotflag.md", role: "User", currentPoints: 1050, teamId: 2, teamName: "Script Kiddies", isBanned: false, lastLogin: "2026-02-16T22:00:00Z", sessionActive: false },
  { id: 4, username: "crypto_king", email: "king@dotflag.md", role: "User", currentPoints: 980, isBanned: true, lastLogin: "2026-02-15T14:00:00Z", sessionActive: false },
  { id: 5, username: "pwn_master", email: "pwn@dotflag.md", role: "User", currentPoints: 875, teamId: 2, teamName: "Script Kiddies", isBanned: false, lastLogin: "2026-02-17T08:15:00Z", sessionActive: true },
  { id: 6, username: "web_wizard", email: "wizard@dotflag.md", role: "User", currentPoints: 750, teamId: 3, teamName: "Code Breakers", isBanned: false, lastLogin: "2026-02-17T07:45:00Z", sessionActive: false },
];

// ── Docker Images ──

export const MOCK_DOCKER_IMAGES: DockerImage[] = [
  { id: 1, challengeId: 3, name: "dotflag/pwn-bof101", status: "running", ip: "10.0.13.37", port: 1337, uptime: "2h 15m", expiresAt: "2026-02-17T18:00:00Z" },
  { id: 2, challengeId: 8, name: "dotflag/docker-escape", status: "stopped", ip: "10.0.13.38", port: 4444, uptime: "0m", expiresAt: "2026-02-17T20:00:00Z" },
  { id: 3, challengeId: 6, name: "dotflag/reverse-strings", status: "running", ip: "10.0.13.39", port: 9090, uptime: "45m", expiresAt: "2026-02-17T16:30:00Z" },
  { id: 4, challengeId: 1, name: "dotflag/web-hello", status: "error", ip: "10.0.13.40", port: 8080, uptime: "0m", expiresAt: "2026-02-17T15:00:00Z" },
];

// ── Teams ──

export const MOCK_TEAM: Team = {
  id: 1,
  name: "Cyber Elite",
  inviteCode: "CE-X7K9-M2P4",
  members: [
    { id: 1, username: "Pavel_Admin", role: "Admin", points: 1337, joinedAt: "2026-01-15T10:00:00Z" },
    { id: 2, username: "h4ck3r_pro", role: "User", points: 1200, joinedAt: "2026-01-16T14:30:00Z" },
    { id: 11, username: "silent_storm", role: "User", points: 450, joinedAt: "2026-02-01T09:00:00Z" },
  ],
  totalPoints: 2987,
  createdAt: "2026-01-15T10:00:00Z",
};

// ── Profiles ──

export const MOCK_PROFILES: Profile[] = [
  {
    id: 1, username: "Pavel_Admin", email: "admin@dotflag.md", role: "Admin", currentPoints: 1337, teamId: 1, teamName: "Cyber Elite",
    bio: "CTF enthusiast and platform administrator.", joinedAt: "2026-01-15T10:00:00Z",
    flagHistory: [
      { challengeId: 1, challengeTitle: "Hello World", points: 100, solvedAt: "2026-02-01T12:00:00Z", category: "Web", isCorrect: true, isFirstBlood: true },
      { challengeId: 4, challengeTitle: "SQL Injection Lab", points: 250, solvedAt: "2026-02-03T15:30:00Z", category: "Web", isCorrect: true },
      { challengeId: 5, challengeTitle: "Caesar Cipher", points: 100, solvedAt: "2026-02-05T09:00:00Z", category: "Crypto", isCorrect: true, isFirstBlood: true },
      { challengeId: 2, challengeTitle: "Base64 Madness", points: 0, solvedAt: "2026-02-06T14:20:00Z", category: "Crypto", isCorrect: false },
      { challengeId: 2, challengeTitle: "Base64 Madness", points: 0, solvedAt: "2026-02-06T16:45:00Z", category: "Crypto", isCorrect: false },
      { challengeId: 2, challengeTitle: "Base64 Madness", points: 200, solvedAt: "2026-02-07T18:45:00Z", category: "Crypto", isCorrect: true },
    ],
  },
  {
    id: 2, username: "h4ck3r_pro", email: "hacker@dotflag.md", role: "User", currentPoints: 1200, teamId: 1, teamName: "Cyber Elite",
    bio: "Pwn all the things.", joinedAt: "2026-01-16T14:30:00Z",
    flagHistory: [
      { challengeId: 3, challengeTitle: "Buffer Overflow 101", points: 300, solvedAt: "2026-02-02T20:00:00Z", category: "Pwn", isCorrect: true, isFirstBlood: true },
      { challengeId: 1, challengeTitle: "Hello World", points: 100, solvedAt: "2026-02-01T14:00:00Z", category: "Web", isCorrect: true },
    ],
  },
  {
    id: 3, username: "cyber_ninja", email: "ninja@dotflag.md", role: "User", currentPoints: 1050, teamId: 2, teamName: "Script Kiddies",
    bio: "Stealthy pentester.", joinedAt: "2026-01-20T08:00:00Z",
    flagHistory: [
      { challengeId: 5, challengeTitle: "Caesar Cipher", points: 100, solvedAt: "2026-02-04T11:00:00Z", category: "Crypto", isCorrect: true },
    ],
  },
];

// ── Recent Activity (for Dashboard) ──

export const MOCK_RECENT_ACTIVITY = [
  { username: 'h4ck3r_pro', challenge: 'Buffer Overflow 101', points: 300, time: '12m ago', isFirstBlood: true, category: 'Pwn' as const },
  { username: 'Pavel_Admin', challenge: 'SQL Injection Lab', points: 250, time: '2h ago', isFirstBlood: false, category: 'Web' as const },
  { username: 'cyber_ninja', challenge: 'Caesar Cipher', points: 100, time: '3h ago', isFirstBlood: false, category: 'Crypto' as const },
  { username: 'pwn_master', challenge: 'Docker Escape', points: 400, time: '5h ago', isFirstBlood: true, category: 'Pwn' as const },
  { username: 'web_wizard', challenge: 'Hello World', points: 100, time: '8h ago', isFirstBlood: false, category: 'Web' as const },
  { username: 'forensic_fox', challenge: 'Packet Capture', points: 150, time: '1d ago', isFirstBlood: false, category: 'Forensics' as const },
];

// ── Team Progress (for Chart) ──

export const MOCK_TEAM_PROGRESS: TeamProgress[] = [
  {
    teamId: 1, teamName: "Cyber Elite", color: "#6366f1",
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
    ],
  },
  {
    teamId: 2, teamName: "Script Kiddies", color: "#ec4899",
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
    ],
  },
  {
    teamId: 3, teamName: "Code Breakers", color: "#10b981",
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
    ],
  },
];
