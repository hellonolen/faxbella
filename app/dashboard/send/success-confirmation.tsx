'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

/* ----------------------------------------
   Success Confirmation
   ---------------------------------------- */

interface SuccessConfirmationProps {
  faxId: string;
  onSendAnother: () => void;
}

export function SuccessConfirmation({
  faxId,
  onSendAnother,
}: SuccessConfirmationProps) {
  return (
    <Card className="max-w-lg mx-auto text-center py-12">
      <div
        className={cn(
          'flex items-center justify-center',
          'w-14 h-14 rounded-full mx-auto mb-5',
          'bg-[var(--color-success-light)]',
        )}
      >
        <CheckCircle2
          size={24}
          className="text-[var(--color-success)]"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-lg font-bold text-[var(--color-vc-text)] mb-2">
        Fax Queued
      </h2>

      <p className="text-sm text-[var(--color-vc-text-secondary)] max-w-xs mx-auto leading-relaxed mb-2">
        Your fax has been queued for delivery. You will receive an email
        confirmation once it is sent.
      </p>

      <p
        className={cn(
          'font-[family-name:var(--font-jetbrains)]',
          'text-[10px] uppercase tracking-[0.15em]',
          'text-[var(--color-vc-text-tertiary)] mb-6',
        )}
      >
        Fax ID: {faxId}
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link href={ROUTES.sent}>
          <Button variant="secondary" size="sm">
            View Sent History
          </Button>
        </Link>
        <Button variant="primary" size="sm" onClick={onSendAnother}>
          Send Another
        </Button>
      </div>
    </Card>
  );
}
