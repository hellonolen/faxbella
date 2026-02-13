'use client';

import { Phone, MessageSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Step Indicators
   ---------------------------------------- */

const STEPS = [
  { number: 1, label: 'Enter number', icon: Phone },
  { number: 2, label: 'Add content', icon: MessageSquare },
  { number: 3, label: 'Hit send', icon: Send },
] as const;

export function StepIndicators() {
  return (
    <div className="flex items-start gap-0" aria-label="Send flow steps">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex items-start">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'flex items-center justify-center',
                'w-7 h-7 rounded-full',
                'border-2 border-[var(--color-vc-accent)]',
                'text-[10px] font-bold text-[var(--color-vc-accent)]',
              )}
            >
              {step.number}
            </div>
            <span
              className={cn(
                'font-[family-name:var(--font-jetbrains)]',
                'text-[10px] uppercase tracking-[0.1em]',
                'text-[var(--color-vc-text-tertiary)]',
                'whitespace-nowrap',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'w-8 border-t-2 border-dotted',
                'border-[var(--color-vc-border)]',
                'mt-3.5 mx-1',
              )}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
