'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Card
   ---------------------------------------- */

interface CardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export function Card({ children, className, accent = false }: CardProps) {
  return (
    <div
      className={cn(
        accent ? 'dash-card-accent' : 'dash-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   StatCard
   ---------------------------------------- */

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  limit?: string;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  limit,
  className,
}: StatCardProps) {
  return (
    <div className={cn('dash-card', className)}>
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            'inline-flex items-center justify-center',
            'w-9 h-9 rounded-[var(--radius-md)]',
            'bg-[var(--color-vc-surface)]',
            'text-[var(--color-vc-text-secondary)]',
          )}
        >
          {icon}
        </span>
        {limit && (
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[0.15em] uppercase text-[var(--color-vc-text-tertiary)]">
            / {limit}
          </span>
        )}
      </div>
      <p className="font-[family-name:var(--font-jetbrains)] text-2xl font-black text-[var(--color-vc-text)] leading-none mb-1">
        {value}
      </p>
      <p className="text-xs text-[var(--color-vc-text-tertiary)]">
        {label}
      </p>
    </div>
  );
}
