'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { SendHorizontal, Send, Eye, FileText } from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { usePasskey } from '@/hooks/use-passkey';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/badge';
import { cn, formatPhoneNumber, formatRelativeTime } from '@/lib/utils';
import { ROUTES, MOCK_OUTBOUND_FAXES } from '@/lib/constants';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface OutboundFax {
  _id: string;
  customerId: string;
  recipientNumber: string;
  recipientName?: string;
  subject?: string;
  message?: string;
  status: string;
  providerFaxId?: string;
  error?: string;
  storageId?: string;
  r2ObjectKey?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  hasCoverPage?: boolean;
  originalFaxId?: string;
  createdAt: number;
  sentAt?: number;
}

/* ----------------------------------------
   Table Headers
   ---------------------------------------- */

const TABLE_HEADERS = ['Recipient', 'Subject', 'Status', 'Sent At', ''] as const;

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function SentSkeleton() {
  return (
    <Card>
      <div className="space-y-3">
        <Skeleton width={140} height={18} />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={52} className="w-full" />
        ))}
      </div>
    </Card>
  );
}

/* ----------------------------------------
   Sent Faxes Table
   ---------------------------------------- */

function SentFaxesTable({ faxes }: { faxes: OutboundFax[] }) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="w-full" aria-label="Sent fax history">
        <thead>
          <tr className="border-b border-[var(--color-vc-border)]">
            {TABLE_HEADERS.map((header) => (
              <th
                key={header}
                className={cn(
                  'text-left py-3 px-4',
                  'font-[family-name:var(--font-jetbrains)]',
                  'text-[10px] uppercase tracking-[0.15em]',
                  'text-[var(--color-vc-text-tertiary)]',
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {faxes.map((fax) => (
            <tr
              key={fax._id}
              className="border-b border-[var(--color-vc-border)] last:border-0 hover:bg-[var(--color-vc-surface)] transition-colors duration-100 cursor-pointer"
              onClick={() => router.push(`/dashboard/sent/${fax._id}`)}
            >
              {/* Recipient */}
              <td className="py-3 px-4">
                {fax.recipientName && (
                  <p className="text-sm font-medium text-[var(--color-vc-text)]">
                    {fax.recipientName}
                  </p>
                )}
                <p
                  className={cn(
                    'font-[family-name:var(--font-jetbrains)] text-[var(--color-vc-text-secondary)]',
                    fax.recipientName ? 'text-xs' : 'text-sm',
                  )}
                >
                  {formatPhoneNumber(fax.recipientNumber)}
                </p>
                {fax.r2ObjectKey && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-vc-text-tertiary)] mt-0.5">
                    <FileText size={10} aria-hidden="true" />
                    Attachment
                  </span>
                )}
              </td>

              {/* Subject */}
              <td className="py-3 px-4 text-sm text-[var(--color-vc-text-secondary)]">
                {fax.subject || '--'}
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <StatusBadge status={fax.status} />
                {fax.error && (
                  <p className="mt-1 text-[11px] text-[var(--color-error)] leading-tight max-w-[200px]">
                    {fax.error}
                  </p>
                )}
              </td>

              {/* Sent At */}
              <td className="py-3 px-4 text-xs text-[var(--color-vc-text-tertiary)]">
                {formatRelativeTime(fax.sentAt ?? fax.createdAt)}
              </td>

              {/* View */}
              <td className="py-3 px-4 text-right">
                <Link
                  href={`/dashboard/sent/${fax._id}`}
                  className={cn(
                    'inline-flex items-center gap-1.5',
                    'text-xs font-medium',
                    'text-[var(--color-vc-accent)]',
                    'hover:underline',
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye size={12} aria-hidden="true" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function SentPage() {
  const router = useRouter();
  const { data, isLoading: dashboardLoading } = useDashboard();
  const { session } = usePasskey();

  const customerId = data?.customer?._id;
  const demoMode = customerId === 'demo_customer_001';

  const outboundFaxes = useQuery(
    api.outboundFax.listOutboundFaxes,
    !demoMode && session?.sessionToken ? { sessionToken: session.sessionToken } : 'skip',
  ) as OutboundFax[] | undefined;

  const effectiveFaxes = demoMode
    ? (MOCK_OUTBOUND_FAXES as unknown as OutboundFax[])
    : outboundFaxes;

  const isLoading = !demoMode && (dashboardLoading || (!!customerId && outboundFaxes === undefined));

  if (isLoading) {
    return <SentSkeleton />;
  }

  if (!effectiveFaxes || effectiveFaxes.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={SendHorizontal}
          title="No sent faxes yet"
          message="Once you send a fax, it will appear here with its delivery status."
          actionLabel="Send a Fax"
          onAction={() => router.push(ROUTES.send)}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            'font-[family-name:var(--font-jetbrains)]',
            'text-[10px] uppercase tracking-[0.15em]',
            'text-[var(--color-vc-text-tertiary)]',
          )}
        >
          Sent Faxes
        </h3>
        <button
          type="button"
          onClick={() => router.push(ROUTES.send)}
          className={cn(
            'inline-flex items-center gap-1.5',
            'text-xs font-medium',
            'text-[var(--color-vc-accent)]',
            'hover:underline cursor-pointer',
          )}
        >
          <Send size={12} aria-hidden="true" />
          Send New
        </button>
      </div>

      <SentFaxesTable faxes={effectiveFaxes} />
    </Card>
  );
}
