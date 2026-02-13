'use client';

import { Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type PageStatus } from './types';

/* ----------------------------------------
   SendFormActions – Error banner + submit button
   ---------------------------------------- */

interface SendFormActionsProps {
  status: PageStatus;
  errorMessage: string;
  isRecipientEmpty: boolean;
}

export function SendFormActions({
  status,
  errorMessage,
  isRecipientEmpty,
}: SendFormActionsProps) {
  return (
    <>
      {/* Error banner */}
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className={cn(
            'flex items-start gap-3 p-3',
            'bg-[var(--color-error-light)]',
            'border border-[var(--color-error)]',
            'rounded-[var(--radius-md)]',
            'text-sm text-[var(--color-error)]',
          )}
        >
          <AlertTriangle
            size={16}
            className="shrink-0 mt-0.5"
            aria-hidden="true"
          />
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={status === 'submitting'}
          disabled={isRecipientEmpty}
        >
          <Send size={16} aria-hidden="true" />
          Send Fax
        </Button>
      </div>
    </>
  );
}
