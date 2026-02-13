'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import {
  ArrowLeft,
  FileText,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { usePasskey } from '@/hooks/use-passkey';
import { StatusBadge, UrgencyBadge, DocumentTypeBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { DocumentCard } from '@/components/ui/document-card';
import {
  cn,
  formatPhoneNumber,
  formatConfidence,
  formatDateTime,
} from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton width={100} height={16} />

      {/* Header card */}
      <div className="dash-card-accent space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton width={160} height={20} />
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
   Structured Data Grid
   ---------------------------------------- */

interface StructuredDataEntry {
  key: string;
  value: string;
}

function StructuredDataGrid({
  data,
}: {
  data: Record<string, string | StructuredDataEntry[] | undefined>;
}) {
  const FIELD_LABELS: Record<string, string> = {
    patientName: 'Patient Name',
    patientDOB: 'Date of Birth',
    patientPhone: 'Patient Phone',
    patientMRN: 'MRN',
    senderName: 'Sender Name',
    senderOrganization: 'Sender Org',
    senderPhone: 'Sender Phone',
    senderFax: 'Sender Fax',
    referralType: 'Referral Type',
    prescriptionDrug: 'Prescription',
    invoiceNumber: 'Invoice #',
    invoiceAmount: 'Invoice Amount',
    dateOfService: 'Date of Service',
    insuranceProvider: 'Insurance',
    authorizationNumber: 'Auth #',
  };

  /* Separate standard fields from custom fields */
  const standardEntries = Object.entries(data).filter(
    ([key, val]) => key !== 'customFields' && val !== undefined && val !== null && val !== '',
  ) as Array<[string, string]>;

  const customFields = (data.customFields ?? []) as StructuredDataEntry[];

  if (standardEntries.length === 0 && customFields.length === 0) {
    return (
      <p className="text-sm text-[var(--color-vc-text-tertiary)] italic">
        No structured data extracted.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {standardEntries.map(([key, value]) => (
        <DetailField
          key={key}
          label={FIELD_LABELS[key] ?? key}
          value={value}
        />
      ))}
      {customFields.map((field) => (
        <DetailField
          key={field.key}
          label={field.key}
          value={field.value}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------
   Splits List
   ---------------------------------------- */

interface SplitFax {
  id: string;
  splitIndex?: number;
  status: string;
  documentType?: string;
}

function SplitsList({ splits }: { splits: SplitFax[] }) {
  return (
    <div className="space-y-2">
      {splits.map((split) => (
        <Link
          key={split.id}
          href={`/dashboard/inbox/${split.id}`}
          className={cn(
            'flex items-center justify-between',
            'p-3',
            'border border-[var(--color-vc-border)]',
            'rounded-[var(--radius-md)]',
            'hover:bg-[var(--color-vc-surface)]',
            'transition-colors duration-100',
            'group',
          )}
        >
          <div className="flex items-center gap-3">
            <span className="mono-label">
              Split {split.splitIndex ?? '?'}
            </span>
            <StatusBadge status={split.status} />
            {split.documentType && (
              <DocumentTypeBadge type={split.documentType} />
            )}
          </div>
          <ExternalLink
            size={14}
            className="text-[var(--color-vc-text-tertiary)] group-hover:text-[var(--color-vc-accent)] transition-colors duration-100"
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function FaxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { session, isLoading: sessionLoading } = usePasskey();
  const email = session?.email;

  const fax = useQuery(
    api.inboundFaxes.getInboundFax,
    email
      ? { faxId: id as Id<'inboundFaxes'>, customerEmail: email }
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
          href="/dashboard/inbox"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-vc-accent)] hover:underline"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Inbox
        </Link>
        <Card>
          <EmptyState
            icon={FileText}
            title="Fax not found"
            message="This fax does not exist or you do not have access to it."
          />
        </Card>
      </div>
    );
  }

  const hasStructuredData =
    fax.structuredData && Object.values(fax.structuredData).some((v) => v !== undefined && v !== null);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/inbox"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-vc-accent)] hover:underline"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Inbox
      </Link>

      {/* Header Card */}
      <Card accent>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-[var(--color-vc-text)]">
            Fax from {formatPhoneNumber(fax.fromNumber)}
          </h2>
          <StatusBadge status={fax.status} />
          {fax.urgency && <UrgencyBadge urgency={fax.urgency} />}
          {fax.documentType && <DocumentTypeBadge type={fax.documentType} />}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          <DetailField label="To Number" value={formatPhoneNumber(fax.toNumber)} mono />
          <DetailField label="Pages" value={String(fax.numPages)} mono />
          <DetailField label="Received" value={formatDateTime(fax.receivedAt)} />
          <DetailField
            label="Processed"
            value={fax.processedAt ? formatDateTime(fax.processedAt) : undefined}
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
          direction="inbound"
        />
      )}

      {/* Routing Info + Urgency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Routing Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User
              size={16}
              className="text-[var(--color-vc-text-tertiary)]"
              aria-hidden="true"
            />
            <span className="mono-label">Routing</span>
          </div>
          <div className="accent-line mb-4" />

          <div className="space-y-3">
            {fax.routedTo ? (
              <>
                <DetailField label="Routed To" value={fax.routedTo.name} />
                <DetailField label="Email" value={fax.routedTo.email} />
                {fax.routedTo.company && (
                  <DetailField label="Company" value={fax.routedTo.company} />
                )}
              </>
            ) : (
              <p className="text-sm text-[var(--color-vc-text-tertiary)] italic">
                Not routed to a recipient.
              </p>
            )}

            <DetailField
              label="Confidence"
              value={formatConfidence(fax.routingConfidence)}
              mono
            />

            {fax.routingReason && (
              <div>
                <span className="mono-label block mb-1">Reason</span>
                <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed">
                  {fax.routingReason}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Urgency Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            {fax.urgency === 'urgent' ? (
              <AlertTriangle
                size={16}
                className="text-[var(--color-vc-accent)]"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle
                size={16}
                className="text-[var(--color-vc-text-tertiary)]"
                aria-hidden="true"
              />
            )}
            <span className="mono-label">Urgency & Status</span>
          </div>
          <div className="accent-line mb-4" />

          <div className="space-y-3">
            <div>
              <span className="mono-label block mb-1">Urgency Level</span>
              {fax.urgency ? (
                <UrgencyBadge urgency={fax.urgency} />
              ) : (
                <span className="text-sm text-[var(--color-vc-text-tertiary)]">--</span>
              )}
            </div>

            {fax.urgencyReason && (
              <div>
                <span className="mono-label block mb-1">Urgency Reason</span>
                <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed">
                  {fax.urgencyReason}
                </p>
              </div>
            )}

            {fax.webhookDelivered !== undefined && (
              <DetailField
                label="Webhook Delivered"
                value={fax.webhookDelivered ? 'Yes' : 'No'}
              />
            )}

            {fax.webhookDeliveredAt && (
              <DetailField
                label="Webhook Sent"
                value={formatDateTime(fax.webhookDeliveredAt)}
              />
            )}

            {fax.error && (
              <div>
                <span className="mono-label block mb-1">Error</span>
                <p className="text-sm text-[var(--color-error)] leading-relaxed">
                  {fax.error}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Structured Data */}
      {hasStructuredData && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Clock
              size={16}
              className="text-[var(--color-vc-text-tertiary)]"
              aria-hidden="true"
            />
            <span className="mono-label">Extracted Data</span>
          </div>
          <div className="accent-line mb-4" />
          <StructuredDataGrid
            data={fax.structuredData as Record<string, string | StructuredDataEntry[] | undefined>}
          />
        </Card>
      )}

      {/* Extracted Text */}
      {fax.extractedText && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FileText
              size={16}
              className="text-[var(--color-vc-text-tertiary)]"
              aria-hidden="true"
            />
            <span className="mono-label">Extracted Text (OCR)</span>
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
            <code>{fax.extractedText}</code>
          </pre>
        </Card>
      )}

      {/* Splits */}
      {fax.splits && fax.splits.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FileText
              size={16}
              className="text-[var(--color-vc-text-tertiary)]"
              aria-hidden="true"
            />
            <span className="mono-label">
              Document Splits ({fax.splits.length})
            </span>
          </div>
          <div className="accent-line mb-4" />
          <SplitsList splits={fax.splits} />
        </Card>
      )}
    </div>
  );
}
