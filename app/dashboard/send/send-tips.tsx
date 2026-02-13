'use client';

import Link from 'next/link';
import {
  Lightbulb,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

/* ----------------------------------------
   Tips Sidebar
   ---------------------------------------- */

const TIPS = [
  'Include area code in the phone number',
  'Add a subject line for easier tracking',
  'Attach a PDF to send as a fax document',
  'Messages are converted to a standard fax format',
] as const;

export function SendTips() {
  return (
    <aside className="space-y-4" aria-label="Send fax tips">
      {/* Tips card */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb
            size={14}
            className="text-[var(--color-vc-accent)]"
            aria-hidden="true"
          />
          <h3
            className={cn(
              'font-[family-name:var(--font-jetbrains)]',
              'text-[10px] uppercase tracking-[0.15em]',
              'text-[var(--color-vc-text-tertiary)]',
            )}
          >
            Tips
          </h3>
        </div>
        <ul className="space-y-2">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="text-[13px] text-[var(--color-vc-text-secondary)] leading-relaxed pl-3 border-l-2 border-[var(--color-vc-border)]"
            >
              {tip}
            </li>
          ))}
        </ul>
      </Card>

      {/* Need help card */}
      <Card className="space-y-3">
        <h3
          className={cn(
            'font-[family-name:var(--font-jetbrains)]',
            'text-[10px] uppercase tracking-[0.15em]',
            'text-[var(--color-vc-text-tertiary)]',
          )}
        >
          Need help?
        </h3>
        <div className="space-y-2">
          <a
            href="mailto:support@faxbella.com"
            className={cn(
              'flex items-center gap-2',
              'text-[13px] text-[var(--color-vc-accent)]',
              'hover:underline transition-colors',
            )}
          >
            <Mail size={13} aria-hidden="true" />
            support@faxbella.com
          </a>
          <Link
            href={ROUTES.sent}
            className={cn(
              'flex items-center gap-2',
              'text-[13px] text-[var(--color-vc-accent)]',
              'hover:underline transition-colors',
            )}
          >
            <ArrowUpRight size={13} aria-hidden="true" />
            View sent fax history
          </Link>
        </div>
      </Card>
    </aside>
  );
}
