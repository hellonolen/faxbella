'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import { useQuery, useAction } from 'convex/react';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { usePasskey } from '@/hooks/use-passkey';
import { StatusBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { DocumentCard } from '@/components/ui/document-card';
import { cn, formatPhoneNumber, formatDateTime } from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton width={140} height={16} />

      {/* Header card */}
      <div className="dash-card-accent space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton width={180} height={20} />
          <Skeleton width={70} height={22} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton width={60} height={10} />
              <Skeleton width={100} height={16} />
            </div>
          ))}
        </div>
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="dash-card space-y-3">
          <Skeleton width={120} height={12} />
          <Skeleton height={120} className="w-full" />
        </div>
        <div className="dash-card space-y-3">
          <Skeleton width={140} height={12} />
          <Skeleton height={120} className="w-full" />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Detail Field
   ---------------------------------------- */

interface DetailFieldProps {
  label: string;
  value: string | undefined | null;
  mono?: boolean;
}

function DetailField({ label, value, mono = false }: DetailFieldProps) {
  return (
    <div>
      <span className="mono-label block mb-1">{label}</span>
      <span
        className={cn(
          'text-sm text-[var(--color-vc-text)]',
          mono && 'font-[family-name:var(--font-jetbrains)]',
        )}
      >
        {value || '--'}
      </span>
    </div>
  );
}

/* ----------------------------------------
   Status Timeline
   ---------------------------------------- */

interface TimelineStep {
  label: string;
  icon: typeof Clock;
  completed: boolean;
  time?: number;
  isError?: boolean;
}

function StatusTimeline({
  status,
  createdAt,
  sentAt,
  error,
}: {
  status: string;
  createdAt: number;
  sentAt?: number;
  error?: string;
}) {
  const isFailed = status === 'failed';
  const isDelivered = status === 'delivered';

  const steps: TimelineStep[] = [
    {
      label: 'Queued',
      icon: Clock,
      completed: true,
      time: createdAt,
    },
    {
      label: 'Sending',
      icon: Send,
      completed: ['sending', 'delivered', 'failed'].includes(status),
      time: sentAt,
    },
    {
      label: isFailed ? 'Failed' : 'Delivered',
      icon: isFailed ? XCircle : CheckCircle,
      completed: isDelivered || isFailed,
      time: isDelivered || isFailed ? sentAt : undefined,
      isError: isFailed,
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Clock
          size={16}
          className="text-[var(--color-vc-text-tertiary)]"
          aria-hidden="true"
        />
        <span className="mono-label">Status Timeline</span>
      </div>
      <div className="accent-line mb-4" />

      <div className="space-y-0">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.label} className="flex gap-3">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center',
                    'w-8 h-8 rounded-full',
                    'border-2',
                    step.completed
                      ? step.isError
                        ? 'border-[var(--color-error)] bg-[var(--color-error-light)]'
                        : 'border-[var(--color-success)] bg-[var(--color-success)]/10'
                      : 'border-[var(--color-vc-border)] bg-[var(--color-vc-surface)]',
                  )}
                >
                  <StepIcon
                    size={14}
                    className={cn(
                      step.completed
                        ? step.isError
                          ? 'text-[var(--color-error)]'
                          : 'text-[var(--color-success)]'
                        : 'text-[var(--color-vc-text-tertiary)]',
                    )}
                    aria-hidden="true"
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 h-8',
                      step.completed
                        ? step.isError
                          ? 'bg-[var(--color-error)]/30'
                          : 'bg-[var(--color-success)]/30'
                        : 'bg-[var(--color-vc-border)]',
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className={cn('pb-4', isLast && 'pb-0')}>
                <p
                  className={cn(
                    'text-sm font-medium',
                    step.completed
                      ? step.isError
                        ? 'text-[var(--color-error)]'
                        : 'text-[var(--color-vc-text)]'
                      : 'text-[var(--color-vc-text-tertiary)]',
                  )}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="text-xs text-[var(--color-vc-text-tertiary)] mt-0.5">
                    {formatDateTime(step.time)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {isFailed && error && (
        <div className="mt-4 pt-4 border-t border-[var(--color-vc-border)]">
          <span className="mono-label block mb-1">Error</span>
          <p className="text-sm text-[var(--color-error)] leading-relaxed">
            {error}
          </p>
        </div>
      )}
    </Card>
  );
}

/* ----------------------------------------
   Resend Section
   ---------------------------------------- */

function ResendSection({
  faxId,
  email,
  originalFaxId,
}: {
  faxId: string;
  email: string;
  originalFaxId?: string;
}) {
  const [resending, setResending] = useState(false);
  const [resendResult, setResendResult] = useState<{
    success: boolean;
    newFaxId?: string;
    error?: string;
  } | null>(null);
  const resendFax = useAction(api.outboundFax.resendFax);

  const handleResend = useCallback(async () => {
    setResending(true);
    setResendResult(null);
    try {
      const result = await resendFax({
        originalFaxId: faxId as Id<'outboundFaxes'>,
        customerEmail: email,
      });
      setResendResult(result);
    } catch (err) {
      setResendResult({
        success: false,
        error: err instanceof Error ? err.message : 'Failed to resend fax',
      });
    } finally {
      setResending(false);
    }
  }, [faxId, email, resendFax]);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw
          size={16}
          className="text-[var(--color-vc-text-tertiary)]"
          aria-hidden="true"
        />
        <span className="mono-label">Actions</span>
      </div>
      <div className="accent-line mb-4" />

      <div className="space-y-4">
        {/* Resent from original link */}
        {originalFaxId && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-vc-text-secondary)]">
              Resent from
            </span>
            <Link
              href={`/dashboard/sent/${originalFaxId}`}
              className="text-[var(--color-vc-accent)] hover:underline inline-flex items-center gap-1"
            >
              original fax
              <ArrowLeft size={12} className="rotate-180" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Resend button */}
        <Button
          variant="ghost"
          size="sm"
          loading={resending}
          onClick={handleResend}
          disabled={resending || resendResult?.success === true}
        >
          <RefreshCw size={14} aria-hidden="true" />
          Resend Fax
        </Button>

        {/* Success message */}
        {resendResult?.success && resendResult.newFaxId && (
          <div
            className={cn(
              'p-3',
              'bg-[var(--color-success)]/10',
              'border border-[var(--color-success)]/30',
              'rounded-[var(--radius-md)]',
            )}
          >
            <p className="text-sm text-[var(--color-success)] font-medium mb-1">
              Fax resent successfully
            </p>
            <Link
              href={`/dashboard/sent/${resendResult.newFaxId}`}
              className="text-xs text-[var(--color-vc-accent)] hover:underline inline-flex items-center gap-1"
            >
              View new fax
              <ArrowLeft size={10} className="rotate-180" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Error message */}
        {resendResult?.success === false && resendResult.error && (
          <div
            className={cn(
              'p-3',
              'bg-[var(--color-error-light)]',
              'border border-[var(--color-error)]/30',
              'rounded-[var(--radius-md)]',
            )}
          >
            <p className="text-sm text-[var(--color-error)]">
              {resendResult.error}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function SentFaxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { session, isLoading: sessionLoading } = usePasskey();
  const email = session?.email;

  const fax = useQuery(
    api.outboundFax.getOutboundFax,
    email
      ? { faxId: id as Id<'outboundFaxes'>, customerEmail: email }
      : 'skip',
  );

  const isLoading = sessionLoading || (!!email && fax === undefined);

  /* Loading */
  if (isLoading) {
    return <DetailSkeleton />;
  }

  /* Not found */
  if (fax === null) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/sent"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-vc-accent)] hover:underline"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Sent History
        </Link>
        <Card>
          <EmptyState
            icon={Send}
            title="Fax not found"
            message="This fax does not exist or you do not have access to it."
          />
        </Card>
      </div>
    );
  }

  const recipientDisplay =
    fax.recipientName || formatPhoneNumber(fax.recipientNumber);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/sent"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-vc-accent)] hover:underline"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Sent History
      </Link>

      {/* Header Card */}
      <Card accent>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-[var(--color-vc-text)]">
            Fax to {recipientDisplay}
          </h2>
          <StatusBadge status={fax.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          <DetailField
            label="Recipient Number"
            value={formatPhoneNumber(fax.recipientNumber)}
            mono
          />
          <DetailField label="Subject" value={fax.subject} />
          <DetailField label="Created" value={formatDateTime(fax.createdAt)} />
          <DetailField
            label="Sent At"
            value={fax.sentAt ? formatDateTime(fax.sentAt) : 'Pending'}
          />
        </div>
      </Card>

      {/* Document Viewer */}
      {fax.hasFile && email && (
        <DocumentCard
          faxId={String(fax.id)}
          email={email}
          hasFile={fax.hasFile}
          fileName={fax.fileName}
          direction="outbound"
        />
      )}

      {/* Message Card */}
      {fax.message && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare
              size={16}
              className="text-[var(--color-vc-text-tertiary)]"
              aria-hidden="true"
            />
            <span className="mono-label">Fax Message</span>
          </div>
          <div className="accent-line mb-4" />
          <pre
            className={cn(
              'text-xs leading-relaxed',
              'font-[family-name:var(--font-jetbrains)]',
              'text-[var(--color-vc-text-secondary)]',
              'bg-[var(--color-vc-surface)]',
              'border border-[var(--color-vc-border)]',
              'rounded-[var(--radius-md)]',
              'p-4',
              'overflow-x-auto',
              'max-h-80 overflow-y-auto',
              'whitespace-pre-wrap break-words',
            )}
          >
            <code>{fax.message}</code>
          </pre>
        </Card>
      )}

      {/* Status Timeline + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusTimeline
          status={fax.status}
          createdAt={fax.createdAt}
          sentAt={fax.sentAt}
          error={fax.error}
        />

        {email && (
          <ResendSection
            faxId={String(fax.id)}
            email={email}
            originalFaxId={
              fax.originalFaxId ? String(fax.originalFaxId) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
