'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Webhook,
  AlertTriangle,
} from 'lucide-react';
import { usePasskey } from '@/hooks/use-passkey';
import { useDashboard } from '@/hooks/use-dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Toggle } from '@/components/ui/toggle';
import { RecipientForm, type RecipientFormData } from '@/components/recipient-form';
import { cn } from '@/lib/utils';
import { MOCK_RECIPIENTS } from '@/lib/constants';
import type { Id } from '@/convex/_generated/dataModel';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Recipient {
  id: Id<'recipients'>;
  name: string;
  email: string;
  company?: string;
  keywords: string[];
  deliveryMethod: string;
  active: boolean;
  createdAt: number;
}

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; recipient: Recipient }
  | { type: 'delete'; recipient: Recipient };

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const TABLE_COLUMNS = [
  { key: 'name', label: 'Name', width: '1.4fr' },
  { key: 'email', label: 'Email', width: '1.4fr' },
  { key: 'company', label: 'Company', width: '1fr' },
  { key: 'keywords', label: 'Keywords', width: '1.2fr' },
  { key: 'delivery', label: 'Delivery', width: '0.7fr' },
  { key: 'active', label: 'Active', width: '0.6fr' },
  { key: 'actions', label: '', width: '80px' },
] as const;

const GRID_TEMPLATE = TABLE_COLUMNS.map((c) => c.width).join(' ');

/* ----------------------------------------
   Slot Usage Indicator
   ---------------------------------------- */

function SlotUsage({ used, limit }: { used: number; limit: number }) {
  const isUnlimited = limit >= 999999;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isAtLimit = !isUnlimited && used >= limit;
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 max-w-[200px]">
        <div className="flex items-baseline justify-between mb-1.5">
          <span
            className={cn(
              'font-[family-name:var(--font-jetbrains)]',
              'text-[10px] uppercase tracking-[0.15em]',
              'text-[var(--color-vc-text-tertiary)]',
            )}
          >
            Recipient Slots
          </span>
          <span
            className={cn(
              'font-[family-name:var(--font-jetbrains)] text-sm font-bold',
              isAtLimit
                ? 'text-[var(--color-error)]'
                : isNearLimit
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-vc-text)]',
            )}
          >
            {used}
            <span className="text-[var(--color-vc-text-tertiary)] font-normal">
              {' / '}
              {isUnlimited ? 'Unlimited' : limit}
            </span>
          </span>
        </div>

        {!isUnlimited && (
          <div className="w-full h-1.5 rounded-full bg-[var(--color-vc-surface)] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300 ease-out',
                isAtLimit
                  ? 'bg-[var(--color-error)]'
                  : isNearLimit
                    ? 'bg-[var(--color-warning)]'
                    : 'bg-[var(--color-vc-accent)]',
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Table Header
   ---------------------------------------- */

function RecipientTableHeader() {
  return (
    <div
      className={cn(
        'grid items-center px-4 py-3',
        'bg-[var(--color-vc-surface)]',
        'border-b border-[var(--color-vc-border)]',
      )}
      style={{ gridTemplateColumns: GRID_TEMPLATE }}
      role="row"
    >
      {TABLE_COLUMNS.map((col) => (
        <span
          key={col.key}
          className={cn(
            'font-[family-name:var(--font-jetbrains)]',
            'text-[10px] uppercase tracking-[0.15em]',
            'text-[var(--color-vc-text-tertiary)]',
            'select-none',
          )}
          role="columnheader"
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Table Row
   ---------------------------------------- */

interface RecipientRowProps {
  recipient: Recipient;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (active: boolean) => void;
  isToggling: boolean;
}

function RecipientRow({
  recipient,
  onEdit,
  onDelete,
  onToggleActive,
  isToggling,
}: RecipientRowProps) {
  const deliveryIcon =
    recipient.deliveryMethod === 'webhook' ? (
      <Webhook size={13} aria-hidden="true" />
    ) : (
      <Mail size={13} aria-hidden="true" />
    );

  return (
    <div
      className={cn(
        'grid items-center px-4 py-3',
        'border-b border-[var(--color-vc-border)] last:border-b-0',
        'transition-colors duration-150 ease-out',
        'hover:bg-[var(--color-vc-surface)]',
      )}
      style={{ gridTemplateColumns: GRID_TEMPLATE }}
      role="row"
    >
      {/* Name */}
      <span className="text-sm font-medium text-[var(--color-vc-text)] truncate pr-2">
        {recipient.name}
      </span>

      {/* Email */}
      <span
        className={cn(
          'text-sm text-[var(--color-vc-text-secondary)]',
          'font-[family-name:var(--font-jetbrains)]',
          'truncate pr-2',
        )}
      >
        {recipient.email}
      </span>

      {/* Company */}
      <span className="text-sm text-[var(--color-vc-text-tertiary)] truncate pr-2">
        {recipient.company || '\u2014'}
      </span>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1 overflow-hidden max-h-[28px]">
        {recipient.keywords.length === 0 ? (
          <span className="text-xs text-[var(--color-vc-text-tertiary)]">
            None
          </span>
        ) : (
          recipient.keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className={cn(
                'inline-flex items-center',
                'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-secondary)]',
                'text-[11px] px-2 py-0.5 rounded-full',
                'font-[family-name:var(--font-jetbrains)]',
                'whitespace-nowrap',
              )}
            >
              {kw}
            </span>
          ))
        )}
        {recipient.keywords.length > 3 && (
          <span className="text-[11px] text-[var(--color-vc-text-tertiary)] font-[family-name:var(--font-jetbrains)]">
            +{recipient.keywords.length - 3}
          </span>
        )}
      </div>

      {/* Delivery */}
      <span
        className={cn(
          'inline-flex items-center gap-1.5',
          'text-xs text-[var(--color-vc-text-secondary)]',
        )}
      >
        {deliveryIcon}
        <span className="capitalize">{recipient.deliveryMethod}</span>
      </span>

      {/* Active */}
      <Toggle
        checked={recipient.active}
        onChange={onToggleActive}
        disabled={isToggling}
        label={recipient.active ? 'Active' : 'Inactive'}
      />

      {/* Actions */}
      <div className="flex items-center gap-1 justify-end">
        <button
          type="button"
          onClick={onEdit}
          className={cn(
            'inline-flex items-center justify-center',
            'w-8 h-8 rounded-[var(--radius-md)]',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:bg-[var(--color-vc-surface)] hover:text-[var(--color-vc-text)]',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label={`Edit ${recipient.name}`}
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'inline-flex items-center justify-center',
            'w-8 h-8 rounded-[var(--radius-md)]',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)]',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label={`Delete ${recipient.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function RecipientsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Slot usage skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton width={200} height={32} />
        <Skeleton width={140} height={36} />
      </div>

      {/* Table skeleton */}
      <div className="dash-card !p-0 overflow-hidden">
        <div className="px-4 py-3 bg-[var(--color-vc-surface)] border-b border-[var(--color-vc-border)]">
          <Skeleton width={400} height={12} />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-vc-border)] last:border-b-0"
          >
            <Skeleton width={120} height={16} />
            <Skeleton width={160} height={16} />
            <Skeleton width={100} height={16} />
            <Skeleton width={80} height={20} />
            <Skeleton width={60} height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Delete Confirmation
   ---------------------------------------- */

interface DeleteConfirmProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function DeleteConfirmation({
  name,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex items-center justify-center shrink-0',
            'w-10 h-10 rounded-full',
            'bg-[var(--color-error-light)]',
          )}
        >
          <AlertTriangle
            size={18}
            className="text-[var(--color-error)]"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-sm text-[var(--color-vc-text)] leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-bold">{name}</span>? Faxes will no longer be
            routed to this recipient. This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          loading={isLoading}
          onClick={onConfirm}
          className="!bg-[var(--color-error)] !shadow-none hover:!bg-red-700"
        >
          Delete Recipient
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function RecipientsPage() {
  const { session } = usePasskey();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard();

  const demoMode = dashboardData?.customer?._id === 'demo_customer_001';

  const recipients = useQuery(
    api.recipients.listRecipients,
    !demoMode && session?.email ? { customerEmail: session.email } : 'skip',
  );

  const effectiveRecipients = demoMode ? MOCK_RECIPIENTS : recipients;

  const addRecipient = useMutation(api.recipients.addRecipient);
  const updateRecipient = useMutation(api.recipients.updateRecipient);
  const deleteRecipient = useMutation(api.recipients.deleteRecipient);

  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });
  const [mutationLoading, setMutationLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<Id<'recipients'> | null>(null);

  const recipientLimit = dashboardData?.customer.recipientLimit ?? 5;
  const recipientsCount = demoMode
    ? MOCK_RECIPIENTS.length
    : (dashboardData?.recipientsCount ?? 0);
  const isAtLimit = recipientsCount >= recipientLimit;
  const isLoading = !demoMode && (dashboardLoading || recipients === undefined);

  /* ---- Handlers ---- */

  const handleAdd = useCallback(async (data: RecipientFormData) => {
    if (!session?.email) return;
    setMutationLoading(true);
    try {
      await addRecipient({
        customerEmail: session.email,
        name: data.name,
        email: data.email,
        company: data.company || undefined,
        keywords: data.keywords.length > 0 ? data.keywords : undefined,
        deliveryMethod: data.deliveryMethod,
        webhookUrl: data.deliveryMethod === 'webhook' ? data.webhookUrl : undefined,
      });
      setModalState({ type: 'closed' });
    } catch (err) {
      // Let Convex error propagate to user via console for now
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [session?.email, addRecipient]);

  const handleEdit = useCallback(
    async (data: RecipientFormData) => {
      if (modalState.type !== 'edit') return;
      setMutationLoading(true);
      try {
        await updateRecipient({
          recipientId: modalState.recipient.id,
          name: data.name,
          email: data.email,
          company: data.company || undefined,
          keywords: data.keywords,
          deliveryMethod: data.deliveryMethod,
          webhookUrl:
            data.deliveryMethod === 'webhook' ? data.webhookUrl : undefined,
        });
        setModalState({ type: 'closed' });
      } catch (err) {
        throw err;
      } finally {
        setMutationLoading(false);
      }
    },
    [modalState, updateRecipient],
  );

  const handleDelete = useCallback(async () => {
    if (modalState.type !== 'delete') return;
    setMutationLoading(true);
    try {
      await deleteRecipient({ recipientId: modalState.recipient.id });
      setModalState({ type: 'closed' });
    } catch (err) {
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [modalState, deleteRecipient]);

  const handleToggleActive = useCallback(
    async (recipient: Recipient, active: boolean) => {
      setTogglingId(recipient.id);
      try {
        await updateRecipient({
          recipientId: recipient.id,
          active,
        });
      } finally {
        setTogglingId(null);
      }
    },
    [updateRecipient],
  );

  const closeModal = useCallback(() => {
    if (!mutationLoading) {
      setModalState({ type: 'closed' });
    }
  }, [mutationLoading]);

  /* ---- Loading ---- */

  if (isLoading) {
    return <RecipientsSkeleton />;
  }

  interface RecipientQueryResult {
    id: string;
    name: string;
    email: string;
    company?: string;
    keywords?: string[];
    deliveryMethod: string;
    active: boolean;
    createdAt: number;
  }

  const recipientList: Recipient[] = ((effectiveRecipients ?? []) as RecipientQueryResult[]).map(
    (r) => ({
      id: r.id as Id<'recipients'>,
      name: r.name,
      email: r.email,
      company: r.company ?? undefined,
      keywords: r.keywords ?? [],
      deliveryMethod: r.deliveryMethod,
      active: r.active,
      createdAt: r.createdAt,
    }),
  );

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header: Slot usage + Add button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <SlotUsage used={recipientsCount} limit={recipientLimit} />

        <Button
          variant="primary"
          size="sm"
          disabled={isAtLimit}
          onClick={() => setModalState({ type: 'add' })}
        >
          <Plus size={16} aria-hidden="true" />
          Add Recipient
        </Button>
      </div>

      {/* Recipients Table */}
      {recipientList.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No recipients yet"
            message="Add your first recipient to start routing faxes automatically with AI."
            actionLabel={isAtLimit ? undefined : 'Add Recipient'}
            onAction={
              isAtLimit
                ? undefined
                : () => setModalState({ type: 'add' })
            }
          />
        </Card>
      ) : (
        <div
          className={cn(
            'border border-[var(--color-vc-border)]',
            'rounded-[var(--radius-lg)]',
            'overflow-hidden bg-white',
            'overflow-x-auto',
          )}
          role="table"
          aria-label="Recipients"
        >
          <RecipientTableHeader />

          <div role="rowgroup">
            {recipientList.map((recipient) => (
              <RecipientRow
                key={recipient.id}
                recipient={recipient}
                onEdit={() =>
                  setModalState({ type: 'edit', recipient })
                }
                onDelete={() =>
                  setModalState({ type: 'delete', recipient })
                }
                onToggleActive={(active) =>
                  handleToggleActive(recipient, active)
                }
                isToggling={togglingId === recipient.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={modalState.type === 'add'}
        onClose={closeModal}
        title="Add Recipient"
      >
        <RecipientForm
          onSubmit={handleAdd}
          onCancel={closeModal}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      {modalState.type === 'edit' && (
        <Modal
          isOpen
          onClose={closeModal}
          title="Edit Recipient"
        >
          <RecipientForm
            initialData={{
              name: modalState.recipient.name,
              email: modalState.recipient.email,
              company: modalState.recipient.company ?? '',
              keywords: modalState.recipient.keywords,
              deliveryMethod: modalState.recipient.deliveryMethod,
              webhookUrl: '',
            }}
            onSubmit={handleEdit}
            onCancel={closeModal}
            isLoading={mutationLoading}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {modalState.type === 'delete' && (
        <Modal
          isOpen
          onClose={closeModal}
          title="Delete Recipient"
        >
          <DeleteConfirmation
            name={modalState.recipient.name}
            onConfirm={handleDelete}
            onCancel={closeModal}
            isLoading={mutationLoading}
          />
        </Modal>
      )}
    </div>
  );
}
