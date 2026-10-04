import type { ConfidenceLevel } from '@/types';

const config: Record<ConfidenceLevel, { color: string; bg: string; border: string; icon: string }> = {
  VERIFIED: {
    color: 'text-verdict-verified',
    bg: 'bg-verdict-verified/10',
    border: 'border-verdict-verified/30',
    icon: '✓',
  },
  SUPPORTED: {
    color: 'text-cosmos-400',
    bg: 'bg-cosmos-500/10',
    border: 'border-cosmos-500/30',
    icon: '✓',
  },
  PARTIAL: {
    color: 'text-amber-glow',
    bg: 'bg-amber-glow/10',
    border: 'border-amber-glow/30',
    icon: '◐',
  },
  CONFLICTED: {
    color: 'text-verdict-conflicted',
    bg: 'bg-verdict-conflicted/10',
    border: 'border-verdict-conflicted/30',
    icon: '⚠',
  },
  INSUFFICIENT: {
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    icon: '?',
  },
};

export function ConfidenceBadge({
  level,
  size = 'md',
  showIcon = true,
}: {
  level: ConfidenceLevel;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}) {
  const c = config[level];
  const sizeCls = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-mono font-semibold uppercase tracking-wider ${sizeCls} ${c.color} ${c.bg} ${c.border}`}
    >
      {showIcon && <span className="text-sm leading-none">{c.icon}</span>}
      {level}
    </span>
  );
}

export function StatusBadge({
  label,
  color = 'cyan',
  icon,
}: {
  label: string;
  color?: 'cyan' | 'blue' | 'amber' | 'red' | 'green' | 'gray';
  icon?: string;
}) {
  const colors: Record<string, string> = {
    cyan: 'text-cyan-glow bg-cyan-glow/10 border-cyan-glow/20',
    blue: 'text-cosmos-400 bg-cosmos-500/10 border-cosmos-500/20',
    amber: 'text-amber-glow bg-amber-glow/10 border-amber-glow/20',
    red: 'text-verdict-conflicted bg-verdict-conflicted/10 border-verdict-conflicted/20',
    green: 'text-verdict-verified bg-verdict-verified/10 border-verdict-verified/20',
    gray: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${colors[color]}`}
    >
      {icon && <span className="text-xs leading-none">{icon}</span>}
      {label}
    </span>
  );
}
