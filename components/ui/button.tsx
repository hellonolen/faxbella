'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const VARIANT_CLASSES = {
  primary: [
    'bg-[var(--color-vc-accent)]',
    'text-white',
    'shadow-[var(--shadow-glow-accent)]',
    'rounded-full',
    'hover:bg-[var(--color-vc-accent-light)]',
    'hover:shadow-[0_12px_50px_var(--color-vc-accent-glow)]',
    'active:scale-[0.97]',
  ].join(' '),
  secondary: [
    'border-2',
    'border-[var(--color-vc-primary)]',
    'text-[var(--color-vc-primary)]',
    'bg-transparent',
    'rounded-full',
    'hover:bg-[var(--color-vc-primary)]',
    'hover:text-white',
    'active:scale-[0.97]',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-[var(--color-vc-text)]',
    'rounded-[var(--radius-md)]',
    'hover:bg-[var(--color-vc-surface)]',
    'active:bg-[var(--color-vc-border)]',
  ].join(' '),
  circular: 'circular-cta',
} as const;

const SIZE_CLASSES = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
} as const;

const CIRCULAR_SIZE_CLASSES = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-18 h-18',
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASSES;
type ButtonSize = keyof typeof SIZE_CLASSES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isCircular = variant === 'circular';
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-medium tracking-wide',
        'transition-all duration-200 ease-out',
        'cursor-pointer',
        'disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_CLASSES[variant],
        isCircular ? CIRCULAR_SIZE_CLASSES[size] : SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {!isCircular && <span>{children}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}
