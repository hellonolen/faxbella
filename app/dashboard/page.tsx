'use client';

import Link from 'next/link';
import {
  FileText,
  Users,
  Target,
  HardDrive,
  ChevronRight,
  Send,
  Inbox,
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useDashboard } from '@/hooks/use-dashboard';
import { usePasskey } from '@/hooks/use-passkey';
import { StatCard } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/badge';
import { cn, formatRelativeTime, formatConfidence, formatPhoneNumber } from '@/lib/utils';
import { ROUTES, PLANS } from '@/lib/constants';

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

function calculateAccuracy(
  faxes: Array<{ status: string; confidence?: number }>,
): string {
  const routed = faxes.filter((f) => f.status === 'routed');
  if (routed.length === 0) return '--';

  const sum = routed.reduce(
    (acc, f) => acc + (f.confidence ?? 0),
    0,
  );
  return `${Math.round((sum / routed.length) * 100)}%`;
}

function getRecipientLimit(plan: string): string {
  const planKey = plan.toLowerCase() as keyof typeof PLANS;
  const planData = PLANS[planKey];
  if (!planData) return '5';
  const limit = planData.recipientLimit;
  return limit === Infinity ? 'Unlimited' : String(limit);
}

function formatStorageSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${Math.round(mb)} MB`;
}

/* ----------------------------------------
   Loading State
   ---------------------------------------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dash-card space-y-3">
            <Skeleton width={36} height={36} />
            <Skeleton width={80} height={28} />
            <Skeleton width={120} height={14} />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="dash-card space-y-3">
        <Skeleton width={160} height={18} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={44} className="w-full" />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Recent Faxes Table
   ---------------------------------------- */

function RecentFaxesTable({
  faxes,
}: {
  faxes: Array<{
    id: string;
    fromNumber: string;
    status: string;
    confidence?: number;
    receivedAt: number;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-vc-border)]">
            {['From', 'Status', 'Confidence', 'Time'].map((header) => (
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
              key={fax.id}
              className="border-b border-[var(--color-vc-border)] last:border-0 hover:bg-[var(--color-vc-surface)] transition-colors duration-100"
            >
              <td className="py-3 px-4 text-sm text-[var(--color-vc-text)] font-[family-name:var(--font-jetbrains)]">
                {formatPhoneNumber(fax.fromNumber)}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={fax.status} />
              </td>
              <td className="py-3 px-4 text-sm font-[family-name:var(--font-jetbrains)] text-[var(--color-vc-text-secondary)]">
                {formatConfidence(fax.confidence)}
              </td>
              <td className="py-3 px-4 text-xs text-[var(--color-vc-text-tertiary)]">
                {formatRelativeTime(fax.receivedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------
   Quick Actions
   ---------------------------------------- */

function QuickActions() {
  const actions = [
    {
      label: 'Add Recipient',
      href: ROUTES.recipients,
      icon: Users,
    },
    {
      label: 'View Inbox',
      href: ROUTES.inbox,
      icon: Inbox,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <div
            className={cn(
              'dash-card',
              'flex items-center justify-between',
              'group cursor-pointer',
              'hover:border-[var(--color-vc-accent)] hover:shadow-[var(--shadow-md)]',
              'transition-all duration-200 ease-out',
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center justify-center',
                  'w-9 h-9 rounded-[var(--radius-md)]',
                  'bg-[var(--color-vc-surface)]',
                  'text-[var(--color-vc-text-secondary)]',
                  'group-hover:bg-[var(--color-vc-accent)] group-hover:text-white',
                  'transition-all duration-200',
                )}
              >
                <action.icon size={16} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-[var(--color-vc-text)]">
                {action.label}
              </span>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--color-vc-text-tertiary)] group-hover:text-[var(--color-vc-accent)] group-hover:translate-x-0.5 transition-all duration-200"
              aria-hidden="true"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { session } = usePasskey();
  const sessionToken = session?.sessionToken;
  const storageData = useQuery(
    api.customers.getStorageUsage,
    sessionToken ? { sessionToken } : 'skip',
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <EmptyState
        icon={Inbox}
        title="No account found"
        message="We could not find your account. Please sign up for a plan to get started."
      />
    );
  }

  const { customer, recipientsCount, recentFaxes } = data;
  const accuracy = calculateAccuracy(recentFaxes);
  const recipientLimit = getRecipientLimit(customer.plan);

  return (
    <div className="space-y-6">
      {/* Send Fax Hero Banner */}
      <div
        className={cn(
          'relative overflow-hidden',
          'rounded-[var(--radius-lg)]',
          'bg-gradient-to-r from-[var(--color-vc-surface-dark)] to-[#2a1a17]',
          'p-6 sm:p-8',
        )}
      >
        {/* Accent top line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-vc-accent)]" />

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'inline-flex items-center justify-center shrink-0',
                'w-12 h-12 rounded-full',
                'bg-[var(--color-vc-accent)]',
                'text-white',
              )}
            >
              <Send size={20} aria-hidden="true" />
            </span>
            <div>
              <h2
                className={cn(
                  'font-[family-name:var(--font-inter)]',
                  'text-lg sm:text-xl font-medium',
                  'text-[var(--color-vc-text-on-dark)]',
                )}
              >
                Send a Fax
              </h2>
              <p className="text-sm text-[var(--color-vc-text-on-dark)] opacity-70 mt-0.5">
                Deliver documents to any US fax number in seconds
              </p>
            </div>
          </div>

          <Link href={ROUTES.send}>
            <span
              className={cn(
                'inline-flex items-center gap-2 shrink-0',
                'px-6 py-3 rounded-full',
                'bg-white text-[var(--color-vc-surface-dark)]',
                'text-sm font-medium',
                'hover:shadow-[var(--shadow-glow-accent)]',
                'transition-shadow duration-200 ease-out',
              )}
            >
              Compose Fax
              <ChevronRight size={16} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText size={18} />}
          value={String(customer.faxesThisMonth)}
          label="Faxes This Month"
          limit={String(customer.faxesLimit)}
        />
        <StatCard
          icon={<Users size={18} />}
          value={String(recipientsCount)}
          label="Recipients"
          limit={recipientLimit}
        />
        <StatCard
          icon={<Target size={18} />}
          value={accuracy}
          label="Routing Accuracy"
        />
        <StatCard
          icon={<HardDrive size={18} />}
          value={storageData ? formatStorageSize(storageData.totalMb) : '--'}
          label="Storage Used"
          limit={storageData ? formatStorageSize(storageData.storageLimitMb) : undefined}
        />
      </div>

      {/* Storage Usage */}
      {storageData && (
        <Card>
          <div className="space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-vc-text)]">
                {formatStorageSize(storageData.totalMb)} of{' '}
                {formatStorageSize(storageData.storageLimitMb)} used
              </span>
              <span
                className={cn(
                  'font-[family-name:var(--font-jetbrains)]',
                  'text-[10px] uppercase tracking-[0.15em]',
                  'text-[var(--color-vc-text-tertiary)]',
                )}
              >
                {storageData.documentCount} documents
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="h-2 w-full rounded-full bg-[var(--color-vc-surface)]"
              role="progressbar"
              aria-valuenow={storageData.usagePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Storage usage"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  storageData.usagePercent < 60 && 'bg-[var(--color-success)]',
                  storageData.usagePercent >= 60 &&
                    storageData.usagePercent < 80 &&
                    'bg-[var(--color-warning)]',
                  storageData.usagePercent >= 80 && 'bg-[var(--color-error)]',
                )}
                style={{ width: `${Math.min(storageData.usagePercent, 100)}%` }}
              />
            </div>

            {/* Detail row */}
            <div className="flex items-center justify-between text-xs text-[var(--color-vc-text-tertiary)]">
              <span>
                Retention: {storageData.retentionDays >= 365
                  ? `${Math.round(storageData.retentionDays / 365)} year${Math.round(storageData.retentionDays / 365) === 1 ? '' : 's'}`
                  : `${storageData.retentionDays} days`}
              </span>
              {storageData.oldestDocAt && (
                <span>
                  Oldest document: {Math.round(
                    (Date.now() - storageData.oldestDocAt) / (1000 * 60 * 60 * 24),
                  )}{' '}
                  days ago
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Two-column: Recent Faxes + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Faxes (2/3 width) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn(
                'font-[family-name:var(--font-jetbrains)]',
                'text-[10px] uppercase tracking-[0.15em]',
                'text-[var(--color-vc-text-tertiary)]',
              )}
            >
              Recent Faxes
            </h3>
            <Link
              href={ROUTES.inbox}
              className={cn(
                'flex items-center gap-1',
                'text-xs font-medium',
                'text-[var(--color-vc-accent)]',
                'hover:underline',
              )}
            >
              View All
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {recentFaxes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No faxes yet"
              message="Once your fax number is connected, incoming faxes will appear here."
            />
          ) : (
            <RecentFaxesTable faxes={recentFaxes} />
          )}
        </Card>

        {/* Quick Actions (1/3 width) */}
        <div>
          <h3
            className={cn(
              'font-[family-name:var(--font-jetbrains)]',
              'text-[10px] uppercase tracking-[0.15em]',
              'text-[var(--color-vc-text-tertiary)]',
              'mb-4',
            )}
          >
            Quick Actions
          </h3>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
