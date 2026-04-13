import { Globe, Lock, Cpu, Search, Binary, Blocks, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryStyle {
  icon: LucideIcon;
  gradient: string;
  glow: string;
  accent: string;
  iconBg: string;
  symbol: string;
  bar: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Web: {
    icon: Globe,
    gradient: 'from-blue-500/10 via-blue-600/5 to-transparent',
    glow: 'group-hover:shadow-blue-500/10',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-500/15 border-blue-500/20',
    symbol: '</>',
    bar: 'from-blue-500 to-blue-400',
  },
  Crypto: {
    icon: Lock,
    gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
    glow: 'group-hover:shadow-yellow-500/10',
    accent: 'text-yellow-400',
    iconBg: 'bg-yellow-500/15 border-yellow-500/20',
    symbol: '#!',
    bar: 'from-yellow-500 to-amber-400',
  },
  Pwn: {
    icon: Cpu,
    gradient: 'from-red-500/10 via-rose-500/5 to-transparent',
    glow: 'group-hover:shadow-red-500/10',
    accent: 'text-red-400',
    iconBg: 'bg-red-500/15 border-red-500/20',
    symbol: '0x',
    bar: 'from-red-500 to-rose-400',
  },
  Reverse: {
    icon: Binary,
    gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    glow: 'group-hover:shadow-purple-500/10',
    accent: 'text-purple-400',
    iconBg: 'bg-purple-500/15 border-purple-500/20',
    symbol: '>>',
    bar: 'from-purple-500 to-violet-400',
  },
  Forensics: {
    icon: Search,
    gradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
    glow: 'group-hover:shadow-emerald-500/10',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/20',
    symbol: '??',
    bar: 'from-emerald-500 to-green-400',
  },
  Misc: {
    icon: Blocks,
    gradient: 'from-slate-500/10 via-slate-400/5 to-transparent',
    glow: 'group-hover:shadow-slate-500/10',
    accent: 'text-slate-400',
    iconBg: 'bg-slate-500/15 border-slate-500/20',
    symbol: '**',
    bar: 'from-slate-500 to-slate-400',
  },
  OSINT: {
    icon: Eye,
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    glow: 'group-hover:shadow-cyan-500/10',
    accent: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 border-cyan-500/20',
    symbol: '@@',
    bar: 'from-cyan-500 to-sky-400',
  },
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Web: 'SQL injection, XSS, CSRF, and more. Break into web applications.',
  Crypto: 'Ciphers, hashing, RSA, and encoding. Crack the codes.',
  Pwn: 'Buffer overflows, ROP chains, format strings. Own the binary.',
  Reverse: 'Disassembly, decompilation, debugging. Understand the machine.',
  Forensics: 'Packet captures, memory dumps, file analysis. Find the evidence.',
  Misc: 'Everything else. Expect the unexpected.',
  OSINT: 'Open source intelligence. Find what\'s hidden in plain sight.',
};

export const RANK_COLORS = [
  { gradient: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/25', text: 'text-yellow-400', ring: 'ring-yellow-500/20', bg: 'bg-yellow-500/5' },
  { gradient: 'from-slate-300 to-slate-500', shadow: 'shadow-slate-400/15', text: 'text-slate-300', ring: 'ring-slate-400/15', bg: 'bg-slate-400/5' },
  { gradient: 'from-amber-600 to-amber-800', shadow: 'shadow-amber-600/15', text: 'text-amber-500', ring: 'ring-amber-600/15', bg: 'bg-amber-600/5' },
];
