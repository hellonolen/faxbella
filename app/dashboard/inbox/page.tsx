'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { Inbox, Filter, ChevronDown } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { usePasskey } from '@/hooks/use-passkey';
import { StatusBadge, UrgencyBadge, DocumentTypeBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import {
  cn,
  formatRelativeTime,
  formatPhoneNumber,
  formatConfidence,
} from '@/lib/utils';
import { DOCUMENT_TYPE_MAP, MOCK_INBOUND_FAXES } from '@/lib/constants';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface InboundFax {
  id: string;
  fromNumber: string;
  toNumber: string;
  numPages: number;
  status: string;
  routedTo?: string;
  routingConfidence?: number;
  routingReason?: string;
  documentType?: string;
  urgency?: string;
  urgencyReason?: string;
  receivedAt: number;
  processedAt?: number;
}

interface InboundFaxListResult {
  faxes: InboundFax[];
  total: number;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'routed', label: 'Routed' },
  { value: 'unroutable', label: 'Unroutable' },
  { value: 'error', label: 'Error' },
] as const;

const URGENCY_OPTIONS = [
  { value: '', label: 'All Urgency' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'routine', label: 'Routine' },
  { value: 'low', label: 'Low' },
] as const;

const TABLE_HEADERS = ['From', 'Pages', 'Status', 'Type', 'Urgency', 'Confidence', 'Time'] as const;

/* ----------------------------------------
   Filter Dropdown
   ---------------------------------------- */

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  ariaLabel: string;
}

function FilterSelect({ value, onChange, options, ariaLabel }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={cn(
          'appearance-none',
          'pl-3 pr-8 py-2',
          'text-xs',
          'font-[family-name:var(--font-jetbrains)]',
          'bg-white',
          'border border-[var(--color-vc-border)]',
          'rounded-[var(--radius-md)]',
          'text-[var(--color-vc-text)]',
          'cursor-pointer',
          'transition-all duration-150',
          'hover:border-[var(--color-vc-text-tertiary)]',
          'focus:outline-none focus-ring',
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-vc-text-tertiary)] pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function InboxSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width={130} height={36} />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="dash-card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-vc-border)]">
          <Skeleton width={200} height={12} />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-vc-border)] last:border-0"
          >
            <Skeleton width={120} height={14} />
            <Skeleton width={30} height={14} />
            <Skeleton width={70} height={22} />
            <Skeleton width={80} height={22} />
            <Skeleton width={60} height={22} />
            <Skeleton width={40} height={14} />
            <Skeleton width={50} height={14} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Fax Table Row
   ---------------------------------------- */

interface FaxRowData {
  id: string;
  fromNumber: string;
  numPages: number;
  status: string;
  documentType?: string;
  urgency?: string;
  routingConfidence?: number;
  receivedAt: number;
}

function FaxRow({ fax }: { fax: FaxRowData }) {
  return (
    <Link href={`/dashboard/inbox/${fax.id}`} className="contents">
      <tr
        className={cn(
          'border-b border-[var(--color-vc-border)] last:border-0',
          'hover:bg-[var(--color-vc-surface)]',
          'cursor-pointer',
          'transition-colors duration-100',
          'group',
        )}
      >
        <td className="py-3 px-4 text-sm font-[family-name:var(--font-jetbrains)] text-[var(--color-vc-text)] group-hover:text-[var(--color-vc-accent)] transition-colors duration-100">
          {formatPhoneNumber(fax.fromNumber)}
        </td>
        <td className="py-3 px-4 text-sm font-[family-name:var(--font-jetbrains)] text-[var(--color-vc-text-secondary)] text-center">
          {fax.numPages}
        </td>
        <td className="py-3 px-4">
          <StatusBadge status={fax.status} />
        </td>
        <td className="py-3 px-4">
          {fax.documentType ? (
            <DocumentTypeBadge type={fax.documentType} />
          ) : (
            <span className="text-xs text-[var(--color-vc-text-tertiary)]">--</span>
          )}
        </td>
        <td className="py-3 px-4">
          {fax.urgency ? (
            <UrgencyBadge urgency={fax.urgency} />
          ) : (
            <span className="text-xs text-[var(--color-vc-text-tertiary)]">--</span>
          )}
        </td>
        <td className="py-3 px-4 text-sm font-[family-name:var(--font-jetbrains)] text-[var(--color-vc-text-secondary)]">
          {formatConfidence(fax.routingConfidence)}
        </td>
        <td className="py-3 px-4 text-xs text-[var(--color-vc-text-tertiary)]">
          {formatRelativeTime(fax.receivedAt)}
        </td>
      </tr>
    </Link>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function InboxPage() {
  const { session, isLoading: sessionLoading } = usePasskey();
  const email = session?.email;

  /* Filter state */
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');

  /* Build query args based on active filters */
  const queryArgs = useMemo(() => {
    if (!email) return 'skip' as const;

    const args: {
      customerEmail: string;
      status?: string;
      urgency?: string;
      documentType?: string;
    } = { customerEmail: email };

    if (statusFilter) args.status = statusFilter;
    if (urgencyFilter) args.urgency = urgencyFilter;
    if (docTypeFilter) args.documentType = docTypeFilter;

    return args;
  }, [email, statusFilter, urgencyFilter, docTypeFilter]);

  const result = useQuery(
    api.inboundFaxes.listInboundFaxes,
    queryArgs,
  ) as InboundFaxListResult | undefined;

  /* Demo mode: show mock data when no authenticated session */
  const demoMode = !sessionLoading && !email;

  const filteredMockFaxes = useMemo(() => {
    if (!demoMode) return [];
    return MOCK_INBOUND_FAXES.filter((fax) => {
      if (statusFilter && fax.status !== statusFilter) return false;
      if (urgencyFilter && fax.urgency !== urgencyFilter) return false;
      if (docTypeFilter && fax.documentType !== docTypeFilter) return false;
      return true;
    });
  }, [demoMode, statusFilter, urgencyFilter, docTypeFilter]);

  const effectiveResult: InboundFaxListResult = demoMode
    ? { faxes: filteredMockFaxes as unknown as InboundFax[], total: filteredMockFaxes.length }
    : (result ?? { faxes: [], total: 0 });

  /* Build document type options from constant map */
  const docTypeOptions = useMemo(() => {
    const entries = Object.entries(DOCUMENT_TYPE_MAP).map(([key, label]) => ({
      value: key,
      label,
    }));
    return [{ value: '', label: 'All Types' }, ...entries];
  }, []);

  /* Reset all filters */
  const handleClearFilters = useCallback(() => {
    setStatusFilter('');
    setUrgencyFilter('');
    setDocTypeFilter('');
  }, []);

  const hasActiveFilters = statusFilter || urgencyFilter || docTypeFilter;
  const isLoading = !demoMode && (sessionLoading || (!!email && result === undefined));

  /* Loading state */
  if (isLoading) {
    return <InboxSkeleton />;
  }

  const faxes = effectiveResult.faxes;
  const total = effectiveResult.total;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cn(
            'flex items-center gap-2',
            'text-[var(--color-vc-text-tertiary)]',
          )}
        >
          <Filter size={14} aria-hidden="true" />
          <span className="mono-label">Filters</span>
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          ariaLabel="Filter by status"
        />

        <FilterSelect
          value={urgencyFilter}
          onChange={setUrgencyFilter}
          options={URGENCY_OPTIONS}
          ariaLabel="Filter by urgency"
        />

        <FilterSelect
          value={docTypeFilter}
          onChange={setDocTypeFilter}
          options={docTypeOptions}
          ariaLabel="Filter by document type"
        />

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className={cn(
              'text-xs font-medium',
              'text-[var(--color-vc-accent)]',
              'hover:underline',
              'cursor-pointer',
              'transition-colors duration-100',
            )}
          >
            Clear all
          </button>
        )}

        {/* Result count */}
        <span className="ml-auto mono-label">
          {total} {total === 1 ? 'fax' : 'faxes'}
        </span>
      </div>

      {/* Fax Table */}
      {faxes.length === 0 ? (
        <Card>
          <EmptyState
            icon={Inbox}
            title="No faxes found"
            message={
              hasActiveFilters
                ? 'No faxes match your current filters. Try adjusting or clearing filters.'
                : 'Once your fax number is connected, incoming faxes will appear here.'
            }
            actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
            onAction={hasActiveFilters ? handleClearFilters : undefined}
          />
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
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
                        'font-normal',
                        header === 'Pages' && 'text-center',
                      )}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faxes.map((fax) => (
                  <FaxRow key={fax.id} fax={fax} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
