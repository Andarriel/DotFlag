import type { User, Challenge } from '../types';

export const MOCK_USER: User = {
  id: 1,
  username: "Pavel_Admin",
  email: "admin@dotflag.md",
  role: "Admin",
  currentPoints: 1337,
  teamId: 1
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