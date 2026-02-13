/* ----------------------------------------
   Send Page – Shared Types & Constants
   ---------------------------------------- */

import { cn } from '@/lib/utils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FormState {
  recipientNumber: string;
  recipientName: string;
  subject: string;
  message: string;
}

export type PageStatus = 'idle' | 'submitting' | 'success' | 'error';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

export const SEND_ELIGIBLE_PLANS = ['business', 'enterprise'] as const;

export const PHONE_PLACEHOLDER = '+1 (555) 123-4567';
export const PHONE_HINT = 'US format: 10 digits or +1 followed by 10 digits';

export const INITIAL_FORM: FormState = {
  recipientNumber: '',
  recipientName: '',
  subject: '',
  message: '',
};

/* ----------------------------------------
   Input Styles
   ---------------------------------------- */

export const INPUT_CLASSES = cn(
  'w-full px-4 py-2.5',
  'text-sm text-[var(--color-vc-text)]',
  'bg-[var(--color-vc-bg)]',
  'border border-[var(--color-vc-border)]',
  'rounded-[var(--radius-md)]',
  'placeholder:text-[var(--color-vc-text-tertiary)]',
  'transition-all duration-200',
  'outline-none',
  'focus:border-[var(--color-vc-accent)]',
  'focus:shadow-[0_0_0_2px_var(--color-vc-bg),0_0_0_4px_var(--color-vc-accent)]',
);

export const TEXTAREA_CLASSES = cn(
  INPUT_CLASSES,
  'min-h-[120px] resize-y',
);

/* ----------------------------------------
   Validation
   ---------------------------------------- */

export function isValidUSPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}
