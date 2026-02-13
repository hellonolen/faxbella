'use client';

import { cn } from '@/lib/utils';

/* ------------------------------------------------
   Skeleton
   ------------------------------------------------ */

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ width, height, className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------
   Spinner
   ------------------------------------------------ */

const SPINNER_SIZES = {
  sm: 16,
  md: 24,
  lg: 40,
} as const;

interface SpinnerProps {
  size?: keyof typeof SPINNER_SIZES;
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const px = SPINNER_SIZES[size];

  return (
    <svg
      className={cn('animate-spin', className)}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="var(--color-vc-accent)"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="var(--color-vc-accent)"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ------------------------------------------------
   PageLoader
   ------------------------------------------------ */

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message = 'Loading...', className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'min-h-[60vh] gap-4',
        className,
      )}
      role="status"
    >
      <Spinner size="lg" />
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
        {message}
      </p>
    </div>
  );
}
