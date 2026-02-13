'use client';

import { cn } from '@/lib/utils';
import {
  FAX_STATUS_MAP,
  URGENCY_MAP,
  DOCUMENT_TYPE_MAP,
} from '@/lib/constants';

const BADGE_BASE = [
  'inline-flex items-center',
  'font-[family-name:var(--font-jetbrains)]',
  'text-[11px]',
  'rounded-full',
  'px-2.5 py-0.5',
  'whitespace-nowrap',
].join(' ');

/* ----------------------------------------
   StatusBadge
   ---------------------------------------- */

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const mapped = FAX_STATUS_MAP[status.toLowerCase()];

  if (!mapped) {
    return (
      <span
        className={cn(
          BADGE_BASE,
          'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-tertiary)]',
          className,
        )}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={cn(BADGE_BASE, className)}
      style={{ color: mapped.color, backgroundColor: mapped.bg }}
    >
      {mapped.label}
    </span>
  );
}

/* ----------------------------------------
   UrgencyBadge
   ---------------------------------------- */

interface UrgencyBadgeProps {
  urgency: string;
  className?: string;
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const mapped = URGENCY_MAP[urgency.toLowerCase()];

  if (!mapped) {
    return (
      <span
        className={cn(
          BADGE_BASE,
          'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-tertiary)]',
          className,
        )}
      >
        {urgency}
      </span>
    );
  }

  return (
    <span
      className={cn(BADGE_BASE, className)}
      style={{ color: mapped.color, backgroundColor: mapped.bg }}
    >
      {mapped.label}
    </span>
  );
}

/* ----------------------------------------
   DocumentTypeBadge
   ---------------------------------------- */

interface DocumentTypeBadgeProps {
  type: string;
  className?: string;
}

export function DocumentTypeBadge({ type, className }: DocumentTypeBadgeProps) {
  const label = DOCUMENT_TYPE_MAP[type.toLowerCase()] ?? type;

  return (
    <span
      className={cn(
        BADGE_BASE,
        'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-secondary)]',
        className,
      )}
    >
      {label}
    </span>
  );
}
