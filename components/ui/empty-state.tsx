'use client';

import { type ElementType } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-16 px-6 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center',
          'w-14 h-14 rounded-full',
          'bg-[var(--color-vc-surface)]',
          'mb-5',
        )}
      >
        <Icon
          size={24}
          className="text-[var(--color-vc-text-tertiary)]"
          aria-hidden="true"
        />
      </div>

      <h3 className="text-base font-bold text-[var(--color-vc-text)] mb-2">
        {title}
      </h3>

      <p className="text-sm text-[var(--color-vc-text-secondary)] max-w-xs leading-relaxed mb-6">
        {message}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
