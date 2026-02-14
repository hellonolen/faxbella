'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  ListChecks,
  Eye,
  PlayCircle,
  CheckCircle2,
  XCircle,
  StickyNote,
  Workflow,
  Phone,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { DocumentTypeBadge } from '@/components/ui/badge';
import { cn, formatPhoneNumber, formatRelativeTime } from '@/lib/utils';
import { ROUTES, DOCUMENT_TYPE_MAP } from '@/lib/constants';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const SESSION_STORAGE_KEY = 'faxbella_session';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_review', label: 'In Review' },
  { key: 'completed', label: 'Completed' },
  { key: 'dismissed', label: 'Dismissed' },
] as const;

type QueueStatus = 'pending' | 'in_review' | 'completed' | 'dismissed';

const STATUS_STYLES: Record<QueueStatus, { color: string; bg: string; label: string }> = {
  pending: {
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-light)',
    label: 'Pending',
  },
  in_review: {
    color: 'var(--color-info)',
    bg: 'var(--color-info-light)',
    label: 'In Review',
  },
  completed: {
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
    label: 'Completed',
  },
  dismissed: {
    color: 'var(--color-vc-text-tertiary)',
    bg: 'var(--color-vc-surface)',
    label: 'Dismissed',
  },
};

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface QueueItem {
  _id: string;
  faxId: string;
  fromNumber?: string;
  documentType?: string;
  workflowName?: string;
  status: QueueStatus;
  notes?: string;
  assignedAt: number;
}

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

/* ----------------------------------------
   QueueStatusBadge
   ---------------------------------------- */

function QueueStatusBadge({ status }: { status: QueueStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center',
        'font-[family-name:var(--font-jetbrains)]',
        'text-[11px]',
        'rounded-full',
        'px-2.5 py-0.5',
        'whitespace-nowrap',
      )}
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {style.label}
    </span>
  );
}

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function QueueSkeleton() {
  return (
    <Card>
      <div className="space-y-3">
        <Skeleton width={140} height={18} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={120} className="w-full" />
        ))}
      </div>
    </Card>
  );
}

/* ----------------------------------------
   Filter Bar
   ---------------------------------------- */

function FilterBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Filter queue by status">
      <Filter
        size={14}
        className="text-[var(--color-vc-text-tertiary)] mr-1"
        aria-hidden="true"
      />
      {STATUS_FILTERS.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f.key)}
            className={cn(
              'font-[family-name:var(--font-jetbrains)]',
              'text-[11px] uppercase tracking-[0.12em]',
              'px-3 py-1.5 rounded-full',
              'transition-all duration-150 ease-out',
              'cursor-pointer',
              isActive
                ? 'bg-[var(--color-vc-primary)] text-white'
                : 'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-secondary)] hover:bg-[var(--color-vc-border)]',
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------
   Notes Editor
   ---------------------------------------- */

function NotesEditor({
  itemId,
  initialNotes,
  sessionToken,
}: {
  itemId: string;
  initialNotes: string;
  sessionToken: string;
}) {
  const [value, setValue] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const updateItem = useMutation(api.workflows.updateQueueItem);

  const handleSave = useCallback(async () => {
    if (value === initialNotes) return;
    setSaving(true);
    try {
      await updateItem({
        sessionToken,
        queueItemId: itemId,
        notes: value,
      });
    } finally {
      setSaving(false);
    }
  }, [value, initialNotes, updateItem, sessionToken, itemId]);

  return (
    <div className="flex items-start gap-2 mt-3">
      <StickyNote
        size={13}
        className="text-[var(--color-vc-text-tertiary)] mt-1.5 shrink-0"
        aria-hidden="true"
      />
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        placeholder="Add notes..."
        rows={2}
        className={cn(
          'flex-1 text-sm text-[var(--color-vc-text)]',
          'bg-[var(--color-vc-surface)] border border-[var(--color-vc-border)]',
          'rounded-[var(--radius-md)] px-3 py-2',
          'placeholder:text-[var(--color-vc-text-tertiary)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-vc-accent)]/30 focus:border-[var(--color-vc-accent)]',
          'transition-colors duration-150',
          'resize-none',
        )}
        aria-label="Notes for this queue item"
      />
      {saving && (
        <span
          className={cn(
            'font-[family-name:var(--font-jetbrains)]',
            'text-[10px] uppercase tracking-[0.12em]',
            'text-[var(--color-vc-text-tertiary)]',
            'mt-2 shrink-0',
          )}
        >
          Saving...
        </span>
      )}
    </div>
  );
}

/* ----------------------------------------
   Queue Item Card
   ---------------------------------------- */

function QueueItemCard({
  item,
  sessionToken,
}: {
  item: QueueItem;
  sessionToken: string;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const updateItem = useMutation(api.workflows.updateQueueItem);

  const handleStatusChange = useCallback(
    async (newStatus: QueueStatus) => {
      setUpdating(newStatus);
      try {
        await updateItem({
          sessionToken,
          queueItemId: item._id,
          status: newStatus,
        });
      } finally {
        setUpdating(null);
      }
    },
    [updateItem, sessionToken, item._id],
  );

  const isPending = item.status === 'pending';
  const isInReview = item.status === 'in_review';
  const isTerminal = item.status === 'completed' || item.status === 'dismissed';

  return (
    <div
      className={cn(
        'border border-[var(--color-vc-border)]',
        'rounded-[var(--radius-md)]',
        'p-4',
        'transition-all duration-150 ease-out',
        'hover:border-[var(--color-vc-accent)]/30',
        isTerminal && 'opacity-60',
      )}
    >
      {/* Top row: source, type badge, status */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              'flex items-center justify-center',
              'w-9 h-9 rounded-full shrink-0',
              'bg-[var(--color-vc-surface)]',
            )}
          >
            <Phone
              size={16}
              className="text-[var(--color-vc-text-secondary)]"
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                'font-[family-name:var(--font-jetbrains)]',
                'text-sm text-[var(--color-vc-text)]',
              )}
            >
              {item.fromNumber ? formatPhoneNumber(item.fromNumber) : 'Unknown sender'}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {item.documentType && (
                <DocumentTypeBadge type={item.documentType} />
              )}
              {item.workflowName && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1',
                    'font-[family-name:var(--font-jetbrains)]',
                    'text-[10px] text-[var(--color-vc-text-tertiary)]',
                  )}
                >
                  <Workflow size={10} aria-hidden="true" />
                  {item.workflowName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <QueueStatusBadge status={item.status} />
          <span
            className={cn(
              'font-[family-name:var(--font-jetbrains)]',
              'text-[10px] text-[var(--color-vc-text-tertiary)]',
            )}
          >
            {formatRelativeTime(item.assignedAt)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {!isTerminal && (
        <NotesEditor
          itemId={item._id}
          initialNotes={item.notes ?? ''}
          sessionToken={sessionToken}
        />
      )}

      {isTerminal && item.notes && (
        <p className="mt-3 text-sm text-[var(--color-vc-text-secondary)] pl-11">
          {item.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pl-11 flex-wrap">
        {isPending && (
          <button
            type="button"
            onClick={() => handleStatusChange('in_review')}
            disabled={updating !== null}
            className={cn(
              'inline-flex items-center gap-1.5',
              'text-xs font-medium',
              'text-[var(--color-info)]',
              'bg-[var(--color-info-light)]',
              'px-3 py-1.5 rounded-full',
              'hover:opacity-80 transition-opacity duration-100',
              'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <PlayCircle size={13} aria-hidden="true" />
            {updating === 'in_review' ? 'Starting...' : 'Start Review'}
          </button>
        )}

        {isInReview && (
          <button
            type="button"
            onClick={() => handleStatusChange('completed')}
            disabled={updating !== null}
            className={cn(
              'inline-flex items-center gap-1.5',
              'text-xs font-medium',
              'text-[var(--color-success)]',
              'bg-[var(--color-success-light)]',
              'px-3 py-1.5 rounded-full',
              'hover:opacity-80 transition-opacity duration-100',
              'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <CheckCircle2 size={13} aria-hidden="true" />
            {updating === 'completed' ? 'Completing...' : 'Complete'}
          </button>
        )}

        {!isTerminal && (
          <button
            type="button"
            onClick={() => handleStatusChange('dismissed')}
            disabled={updating !== null}
            className={cn(
              'inline-flex items-center gap-1.5',
              'text-xs font-medium',
              'text-[var(--color-vc-text-tertiary)]',
              'bg-[var(--color-vc-surface)]',
              'px-3 py-1.5 rounded-full',
              'hover:opacity-80 transition-opacity duration-100',
              'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <XCircle size={13} aria-hidden="true" />
            {updating === 'dismissed' ? 'Dismissing...' : 'Dismiss'}
          </button>
        )}

        <Link
          href={`/dashboard/inbox/${item.faxId}`}
          className={cn(
            'inline-flex items-center gap-1.5',
            'text-xs font-medium',
            'text-[var(--color-vc-accent)]',
            'hover:underline',
            'ml-auto',
          )}
        >
          <Eye size={12} aria-hidden="true" />
          View Fax
        </Link>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function QueuePage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const sessionToken = getSessionToken();

  const queueItems = useQuery(
    api.workflows.listQueueItems,
    sessionToken
      ? {
          sessionToken,
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        }
      : 'skip',
  ) as QueueItem[] | undefined;

  const isLoading = !!sessionToken && queueItems === undefined;

  if (isLoading) {
    return <QueueSkeleton />;
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3
          className={cn(
            'font-[family-name:var(--font-jetbrains)]',
            'text-[10px] uppercase tracking-[0.15em]',
            'text-[var(--color-vc-text-tertiary)]',
          )}
        >
          Review Queue
        </h3>
        <span
          className={cn(
            'font-[family-name:var(--font-jetbrains)]',
            'text-[10px] text-[var(--color-vc-text-tertiary)]',
          )}
        >
          {queueItems?.length ?? 0} item{(queueItems?.length ?? 0) !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter Row */}
      <div className="mb-5">
        <FilterBar active={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Queue Items */}
      {!queueItems || queueItems.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nothing in your queue"
          message="When faxes are assigned to you via workflow rules, they will appear here for review."
        />
      ) : (
        <div className="space-y-3">
          {queueItems.map((item) => (
            <QueueItemCard
              key={item._id}
              item={item}
              sessionToken={sessionToken!}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
