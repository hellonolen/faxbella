'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled = false, className }: ToggleProps) {
  const id = useId();

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0',
          'w-[44px] h-[24px] rounded-full',
          'transition-colors duration-200 ease-out',
          'cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-vc-accent)] focus-visible:ring-offset-2',
          checked ? 'bg-[var(--color-vc-accent)]' : 'bg-[var(--color-vc-border)]',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block',
            'w-[18px] h-[18px] rounded-full',
            'bg-white shadow-[var(--shadow-sm)]',
            'transition-transform duration-200 ease-out',
            'translate-y-[3px]',
            checked ? 'translate-x-[23px]' : 'translate-x-[3px]',
          )}
          aria-hidden="true"
        />
      </button>

      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm text-[var(--color-vc-text)]',
            'select-none',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
