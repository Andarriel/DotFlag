import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Gem, Flame, Brain, Trophy, Medal, Star, Shield, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { ApiBadge, BadgeType } from '../../types/api';

// ── Meta ─────────────────────────────────────────────────────────────────────

interface BadgeMeta {
  emoji: string;
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  boxGlow?: string;
  iconFilter?: string;
  pulse?: boolean;
}

const BADGE_META: Record<BadgeType, BadgeMeta> = {
  Bronze:             { emoji: '🥉', icon: Medal,       label: 'Bronze',               color: 'text-amber-700',  bg: 'bg-amber-900/30' },
  Silver:             { emoji: '🥈', icon: Medal,       label: 'Silver',               color: 'text-slate-300',  bg: 'bg-slate-700/30' },
  Gold:               { emoji: '🥇', icon: Medal,       label: 'Gold',                 color: 'text-amber-400',  bg: 'bg-amber-500/20',
    boxGlow: 'shadow-[0_0_8px_2px_rgba(251,191,36,0.4)]',
    iconFilter: 'drop-shadow(0 0 3px rgba(251,191,36,0.9))' },
  Platinum:           { emoji: '💎', icon: Gem,         label: 'Platinum',             color: 'text-cyan-300',   bg: 'bg-cyan-500/20',
    boxGlow: 'shadow-[0_0_10px_3px_rgba(103,232,249,0.45)]',
    iconFilter: 'drop-shadow(0 0 4px rgba(103,232,249,0.95))',
    pulse: true },
  FirstBlood:         { emoji: '🔥', icon: Flame,       label: 'First Blood',          color: 'text-red-400',    bg: 'bg-red-500/20' },
  GeniusPerfectionist:{ emoji: '🧠', icon: Brain,       label: 'Genius Perfectionist', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  Veteran1:           { emoji: '🎖', icon: Shield,      label: 'Participated',         color: 'text-slate-400',  bg: 'bg-slate-600/30' },
  Veteran5:           { emoji: '🏅', icon: ShieldCheck, label: '5 CTFs',               color: 'text-blue-400',   bg: 'bg-blue-500/20' },
  Veteran10:          { emoji: '🏆', icon: Trophy,      label: '10 CTFs',              color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  Custom:             { emoji: '⭐', icon: Star,        label: 'Award',                color: 'text-yellow-300', bg: 'bg-white/10' },
};

function getBadgeMeta(badge: ApiBadge): BadgeMeta {
  if (badge.type === 'Custom') {
    return { ...BADGE_META.Custom, emoji: badge.customIcon || '⭐', label: badge.customName || 'Award' };
  }
  return BADGE_META[badge.type] ?? BADGE_META.Custom;
}

// Sort priority: higher = shown first / more important
const TYPE_PRIORITY: Partial<Record<BadgeType, number>> = {
  GeniusPerfectionist: 100,
  Veteran10:  90,
  Platinum:   80,
  Gold:       70,
  Silver:     60,
  Bronze:     50,
  FirstBlood: 40,
  Custom:     30,
  Veteran5:   20,
  Veteran1:   10,
};

// ── Stacked Tooltip (portal) ─────────────────────────────────────────────────

interface StackedTooltipProps {
  stack: ApiBadge[];
  meta: BadgeMeta;
  anchorPos: { top: number; bottom: number; left: number };
}

function StackedTooltip({ stack, meta, anchorPos }: StackedTooltipProps) {
  const isFirstBlood = stack[0]?.type === 'FirstBlood';
  const isVeteran1   = stack[0]?.type === 'Veteran1';
  const showBelow    = anchorPos.top < 260;

  return createPortal(
    <div
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top:  showBelow ? anchorPos.bottom + 8 : anchorPos.top - 8,
        left: anchorPos.left,
        transform: showBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
        zIndex: 9999,
        width: '15rem',
      }}
    >
      <div className="bg-slate-900 border border-white/[0.08] rounded-xl p-3 shadow-xl text-left">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{meta.emoji}</span>
          <span className={`text-sm font-bold ${meta.color}`}>{meta.label}</span>
          {stack.length > 1 && (
            <span className="ml-auto text-[10px] font-semibold text-slate-500">×{stack.length}</span>
          )}
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {isFirstBlood ? (
            // First Blood: group by CTF, show count per CTF
            <>
              <p className="text-[11px] text-red-400 font-semibold mb-1">
                🔥 {stack.length} total first blood{stack.length !== 1 ? 's' : ''}
              </p>
              {stack[0]?.firstBloodBreakdown?.map(b => (
                <div key={b.ctfEventName} className="flex justify-between text-[11px] text-slate-400">
                  <span className="truncate mr-2">{b.ctfEventName}</span>
                  <span className="shrink-0 text-red-400">×{b.count}</span>
                </div>
              ))}
            </>
          ) : isVeteran1 ? (
            // Veteran1: list each CTF participation
            <>
              <p className="text-[11px] text-slate-400 mb-1">
                {stack.length} CTF{stack.length !== 1 ? 's' : ''} participated
              </p>
              {stack.map(b => (
                <div key={b.id} className="text-[11px] text-slate-500 flex justify-between">
                  <span className="truncate mr-2">{b.ctfEventName ?? '—'}</span>
                  <span className="shrink-0">{new Date(b.awardedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </>
          ) : (
            // All other types: one entry per badge
            stack.map(b => (
              <div key={b.id} className="border-t border-white/[0.05] pt-1.5 first:border-0 first:pt-0">
                {b.ctfEventName && (
                  <p className="text-[11px] text-slate-300 font-medium truncate">{b.ctfEventName}</p>
                )}
                <div className="flex flex-wrap gap-x-2 mt-0.5">
                  {b.placement && (
                    <span className="text-[11px] text-slate-400">
                      {b.placement === 1 ? '🥇 1st' : b.placement === 2 ? '🥈 2nd' : '🥉 3rd'} place
                    </span>
                  )}
                  {b.points != null && (
                    <span className="text-[11px] text-slate-400">{b.points.toLocaleString()} pts</span>
                  )}
                  {b.isManuallyAwarded && (
                    <span className="text-[10px] text-slate-500">✍ Manual</span>
                  )}
                </div>
                {b.note && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5">"{b.note}"</p>
                )}
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {new Date(b.awardedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      {showBelow
        ? <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
        : <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      }
    </div>,
    document.body
  );
}

// ── BadgeTypeIcon (one icon = one stacked type) ───────────────────────────────

interface BadgeTypeIconProps {
  stack: ApiBadge[];
  size?: 'sm' | 'md';
}

export function BadgeTypeIcon({ stack, size = 'sm' }: BadgeTypeIconProps) {
  const [anchorPos, setAnchorPos] = useState<{ top: number; bottom: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const meta = getBadgeMeta(stack[0]);
  const count = stack.length;

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAnchorPos({ top: rect.top, bottom: rect.bottom, left: rect.left + rect.width / 2 });
    }
  };

  if (size === 'sm') {
    const Icon = meta.icon;
    return (
      <div
        ref={ref}
        className="relative inline-flex items-center justify-center cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setAnchorPos(null)}
      >
        <Icon
          className={`w-4 h-4 flex-none transition-transform hover:scale-125 ${meta.color} ${meta.pulse ? 'animate-pulse' : ''}`}
          style={meta.iconFilter ? { filter: meta.iconFilter } : undefined}
        />
        {count > 1 && (
          <span className="absolute -top-1.5 -right-1.5 bg-slate-700 text-slate-300 text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center leading-none border border-slate-600">
            {count > 9 ? '9+' : count}
          </span>
        )}
        {anchorPos && <StackedTooltip stack={stack} meta={meta} anchorPos={anchorPos} />}
      </div>
    );
  }

  // md: emoji box (admin panels)
  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setAnchorPos(null)}
    >
      <div className={`w-9 h-9 text-lg rounded-lg ${meta.bg} border border-white/[0.08]
        flex items-center justify-center cursor-default select-none transition-transform
        hover:scale-110 ${meta.boxGlow ?? ''} ${meta.pulse ? 'animate-pulse' : ''}`}>
        <span>{meta.emoji}</span>
        {count > 1 && (
          <span className="absolute -top-1 -right-1 bg-slate-700 text-slate-300 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none border border-slate-600">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      {anchorPos && <StackedTooltip stack={stack} meta={meta} anchorPos={anchorPos} />}
    </div>
  );
}

// Keep old BadgeIcon export for backwards compatibility (single badge)
export function BadgeIcon({ badge, size = 'sm' }: { badge: ApiBadge; size?: 'sm' | 'md' }) {
  return <BadgeTypeIcon stack={[badge]} size={size} />;
}

// ── BadgeRow ─────────────────────────────────────────────────────────────────

const VISIBLE_SLOTS = 5;

interface BadgeRowProps {
  badges: ApiBadge[];
  size?: 'sm' | 'md';
}

export function BadgeRow({ badges, size = 'sm' }: BadgeRowProps) {
  const [showAll, setShowAll] = useState(false);

  if (!badges.length) return null;

  // Group badges by type
  const groups = new Map<BadgeType, ApiBadge[]>();
  for (const b of badges) {
    const existing = groups.get(b.type) ?? [];
    groups.set(b.type, [...existing, b]);
  }

  // Sort groups by priority (highest first)
  const sortedGroups = [...groups.entries()].sort(
    ([a], [b]) => (TYPE_PRIORITY[b] ?? 0) - (TYPE_PRIORITY[a] ?? 0)
  );

  const visibleGroups = sortedGroups.slice(0, VISIBLE_SLOTS);
  const hiddenGroups  = sortedGroups.slice(VISIBLE_SLOTS);

  return (
    <div className="flex items-center gap-1.5">
      {visibleGroups.map(([type, stack]) => (
        <BadgeTypeIcon key={type} stack={stack} size={size} />
      ))}

      {hiddenGroups.length > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] text-slate-500 hover:text-slate-300 bg-slate-800/50 border border-white/[0.06] transition leading-none">
          +{hiddenGroups.length}
        </button>
      )}

      {showAll && hiddenGroups.map(([type, stack]) => (
        <BadgeTypeIcon key={type} stack={stack} size={size} />
      ))}
    </div>
  );
}
