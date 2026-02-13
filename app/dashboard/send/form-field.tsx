'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   FormField -- Reusable labeled field wrapper
   ---------------------------------------- */

interface FormFieldProps {
  label: string;
  icon: React.ElementType;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({
  label,
  icon: Icon,
  hint,
  required,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className={cn(
          'flex items-center gap-2',
          'font-[family-name:var(--font-jetbrains)]',
          'text-[10px] uppercase tracking-[0.15em]',
          'text-[var(--color-vc-text-tertiary)]',
        )}
      >
        <Icon size={12} aria-hidden="true" />
        {label}
        {required && (
          <span className="text-[var(--color-vc-accent)]">*</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[var(--color-vc-text-tertiary)] pl-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}
