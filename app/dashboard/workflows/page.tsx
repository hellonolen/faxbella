'use client';

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Workflow,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Zap,
  FileText,
  AlertCircle,
  Search,
  ArrowRight,
  Mail,
  UserPlus,
  Tag,
  Send,
  Globe,
  Brain,
  Clock,
  GitBranch,
  GripVertical,
  X,
  Play,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { DOCUMENT_TYPE_MAP, URGENCY_MAP } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const SESSION_STORAGE_KEY = 'faxbella_session';

const TRIGGER_TYPES = {
  on_receive: { label: 'When any fax arrives', icon: Zap, color: 'var(--color-vc-accent)' },
  on_type: { label: 'When document type matches', icon: FileText, color: 'var(--color-info)' },
  on_urgency: { label: 'When urgency is', icon: AlertCircle, color: 'var(--color-warning)' },
  on_keyword: { label: 'When text contains', icon: Search, color: 'var(--color-success)' },
} as const;

type TriggerType = keyof typeof TRIGGER_TYPES;

const ACTION_TYPES = {
  route_to: { label: 'Route to recipient', icon: ArrowRight },
  email_to: { label: 'Send email', icon: Mail },
  assign_to: { label: 'Assign to team member', icon: UserPlus },
  tag: { label: 'Add tag', icon: Tag },
  forward_fax: { label: 'Forward fax', icon: Send },
  webhook: { label: 'Call webhook', icon: Globe },
  ai_summarize: { label: 'AI summarize', icon: Brain },
  delay: { label: 'Wait / delay', icon: Clock },
  condition: { label: 'Condition check', icon: GitBranch },
} as const;

type ActionType = keyof typeof ACTION_TYPES;

const CONDITION_OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'contains', label: 'contains' },
  { value: 'starts_with', label: 'starts with' },
] as const;

const CONDITION_FIELDS = [
  { value: 'document_type', label: 'Document type' },
  { value: 'urgency', label: 'Urgency' },
  { value: 'sender_number', label: 'Sender number' },
  { value: 'page_count', label: 'Page count' },
  { value: 'extracted_text', label: 'Extracted text' },
] as const;

const URGENCY_OPTIONS = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'routine', label: 'Routine' },
  { value: 'low', label: 'Low' },
] as const;

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface WorkflowStep {
  id: string;
  actionType: ActionType;
  config: Record<string, string>;
}

interface TriggerConfig {
  types?: string[];
  urgencyLevels?: string[];
  keywords?: string[];
}

interface WorkflowData {
  _id: Id<'workflows'>;
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  steps: WorkflowStep[];
  enabled: boolean;
  priority: number;
  totalRuns?: number;
  lastRunAt?: number;
  createdAt: number;
}

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; workflow: WorkflowData }
  | { type: 'delete'; workflow: WorkflowData };

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

function generateStepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function createEmptyStep(): WorkflowStep {
  return { id: generateStepId(), actionType: 'route_to', config: {} };
}

/* ----------------------------------------
   Trigger Badge
   ---------------------------------------- */

function TriggerBadge({ triggerType }: { triggerType: TriggerType }) {
  const trigger = TRIGGER_TYPES[triggerType];
  if (!trigger) return null;
  const Icon = trigger.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2.5 py-1 rounded-full',
        'text-[11px] font-medium',
        'font-[family-name:var(--font-jetbrains)]',
        'whitespace-nowrap',
      )}
      style={{
        color: trigger.color,
        backgroundColor: `color-mix(in srgb, ${trigger.color} 8%, transparent)`,
      }}
    >
      <Icon size={12} aria-hidden="true" />
      {triggerType.replace('on_', '').replace('_', ' ')}
    </span>
  );
}

/* ----------------------------------------
   Step Icon Row
   ---------------------------------------- */

function StepIcons({ steps }: { steps: WorkflowStep[] }) {
  const displaySteps = steps.slice(0, 5);
  const remaining = steps.length - displaySteps.length;

  return (
    <div className="flex items-center gap-1">
      {displaySteps.map((step, idx) => {
        const action = ACTION_TYPES[step.actionType];
        if (!action) return null;
        const Icon = action.icon;
        return (
          <span key={step.id}>
            <span className="flex items-center gap-0.5">
              <span
                className={cn(
                  'inline-flex items-center justify-center',
                  'w-6 h-6 rounded-[var(--radius-sm)]',
                  'bg-[var(--color-vc-surface)]',
                  'text-[var(--color-vc-text-secondary)]',
                )}
                title={action.label}
              >
                <Icon size={12} aria-hidden="true" />
              </span>
              {idx < displaySteps.length - 1 && (
                <ChevronDown
                  size={10}
                  className="text-[var(--color-vc-text-tertiary)] -rotate-90"
                  aria-hidden="true"
                />
              )}
            </span>
          </span>
        );
      })}
      {remaining > 0 && (
        <span className="text-[10px] text-[var(--color-vc-text-tertiary)] font-[family-name:var(--font-jetbrains)]">
          +{remaining}
        </span>
      )}
    </div>
  );
}

/* ----------------------------------------
   Trigger Config Details
   ---------------------------------------- */

function TriggerDetails({
  triggerType,
  triggerConfig,
}: {
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
}) {
  if (triggerType === 'on_receive') return null;

  const items: string[] = [];

  if (triggerType === 'on_type' && triggerConfig.types) {
    items.push(
      ...triggerConfig.types.map((t) => DOCUMENT_TYPE_MAP[t] ?? t),
    );
  }

  if (triggerType === 'on_urgency' && triggerConfig.urgencyLevels) {
    items.push(
      ...triggerConfig.urgencyLevels.map(
        (u) => URGENCY_MAP[u]?.label ?? u,
      ),
    );
  }

  if (triggerType === 'on_keyword' && triggerConfig.keywords) {
    items.push(...triggerConfig.keywords);
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {items.slice(0, 4).map((item) => (
        <span
          key={item}
          className={cn(
            'inline-flex items-center',
            'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-secondary)]',
            'text-[10px] px-2 py-0.5 rounded-full',
            'font-[family-name:var(--font-jetbrains)]',
            'whitespace-nowrap',
          )}
        >
          {item}
        </span>
      ))}
      {items.length > 4 && (
        <span className="text-[10px] text-[var(--color-vc-text-tertiary)] font-[family-name:var(--font-jetbrains)]">
          +{items.length - 4}
        </span>
      )}
    </div>
  );
}

/* ----------------------------------------
   Workflow Card
   ---------------------------------------- */

interface WorkflowCardProps {
  workflow: WorkflowData;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isToggling: boolean;
}

function WorkflowCard({
  workflow,
  onEdit,
  onDelete,
  onToggle,
  isToggling,
}: WorkflowCardProps) {
  return (
    <div
      className={cn(
        'border border-[var(--color-vc-border)]',
        'rounded-[var(--radius-lg)]',
        'bg-white',
        'transition-all duration-200 ease-out',
        'hover:shadow-[var(--shadow-sm)]',
        !workflow.enabled && 'opacity-60',
      )}
    >
      <div className="p-5">
        {/* Top row: name + toggle */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-sm font-medium text-[var(--color-vc-text)] truncate">
                {workflow.name}
              </h3>
              <TriggerBadge triggerType={workflow.triggerType} />
            </div>
            {workflow.description && (
              <p className="text-xs text-[var(--color-vc-text-secondary)] leading-relaxed line-clamp-2">
                {workflow.description}
              </p>
            )}
          </div>
          <Toggle
            checked={workflow.enabled}
            onChange={onToggle}
            disabled={isToggling}
          />
        </div>

        {/* Trigger config details */}
        <TriggerDetails
          triggerType={workflow.triggerType}
          triggerConfig={workflow.triggerConfig}
        />

        {/* Steps + priority + stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-vc-border)]">
          <div className="flex items-center gap-4">
            {/* Steps */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-[family-name:var(--font-jetbrains)]',
                  'text-[10px] uppercase tracking-[0.15em]',
                  'text-[var(--color-vc-text-tertiary)]',
                )}
              >
                Steps
              </span>
              <StepIcons steps={workflow.steps} />
              <span className="text-xs text-[var(--color-vc-text-tertiary)] font-[family-name:var(--font-jetbrains)]">
                ({workflow.steps.length})
              </span>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'font-[family-name:var(--font-jetbrains)]',
                  'text-[10px] uppercase tracking-[0.15em]',
                  'text-[var(--color-vc-text-tertiary)]',
                )}
              >
                Priority
              </span>
              <span className="text-xs font-medium text-[var(--color-vc-text)] font-[family-name:var(--font-jetbrains)]">
                {workflow.priority}
              </span>
            </div>
          </div>

          {/* Execution stats */}
          <div className="flex items-center gap-4">
            {(workflow.totalRuns ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <Play
                  size={11}
                  className="text-[var(--color-vc-text-tertiary)]"
                  aria-hidden="true"
                />
                <span className="text-[11px] text-[var(--color-vc-text-secondary)] font-[family-name:var(--font-jetbrains)]">
                  {workflow.totalRuns} runs
                </span>
              </div>
            )}
            {workflow.lastRunAt && (
              <span className="text-[11px] text-[var(--color-vc-text-tertiary)] font-[family-name:var(--font-jetbrains)]">
                {formatRelativeTime(workflow.lastRunAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions footer */}
      <div
        className={cn(
          'flex items-center justify-end gap-1',
          'px-4 py-2.5',
          'border-t border-[var(--color-vc-border)]',
          'bg-[var(--color-vc-surface)]/40',
        )}
      >
        <button
          type="button"
          onClick={onEdit}
          className={cn(
            'inline-flex items-center justify-center gap-1.5',
            'px-3 py-1.5 rounded-[var(--radius-md)]',
            'text-xs text-[var(--color-vc-text-secondary)]',
            'hover:bg-[var(--color-vc-surface)] hover:text-[var(--color-vc-text)]',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label={`Edit ${workflow.name}`}
        >
          <Pencil size={13} aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'inline-flex items-center justify-center gap-1.5',
            'px-3 py-1.5 rounded-[var(--radius-md)]',
            'text-xs text-[var(--color-vc-text-tertiary)]',
            'hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)]',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label={`Delete ${workflow.name}`}
        >
          <Trash2 size={13} aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function WorkflowsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton width={160} height={28} />
        <Skeleton width={140} height={36} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton width={180} height={16} />
              <Skeleton width={44} height={24} />
            </div>
            <Skeleton width={260} height={12} className="mb-3" />
            <div className="flex gap-2 mb-4">
              <Skeleton width={60} height={20} />
              <Skeleton width={60} height={20} />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-vc-border)]">
              <Skeleton width={120} height={14} />
              <Skeleton width={80} height={14} />
            </div>
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
            Are you sure you want to delete the workflow{' '}
            <span className="font-medium">{name}</span>? Any active
            automations will stop running immediately. This action cannot
            be undone.
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
          Delete Workflow
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Step Config Fields
   ---------------------------------------- */

interface StepConfigProps {
  step: WorkflowStep;
  onUpdateConfig: (key: string, value: string) => void;
}

function StepConfigFields({ step, onUpdateConfig }: StepConfigProps) {
  const inputClasses = cn(
    'w-full px-3 py-2 text-sm',
    'bg-white border border-[var(--color-vc-border)]',
    'rounded-[var(--radius-md)]',
    'text-[var(--color-vc-text)]',
    'placeholder:text-[var(--color-vc-text-tertiary)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-vc-accent)]/30 focus:border-[var(--color-vc-accent)]',
    'transition-colors duration-150',
  );

  const selectClasses = cn(inputClasses, 'appearance-none cursor-pointer');

  switch (step.actionType) {
    case 'route_to':
      return (
        <input
          type="text"
          placeholder="Recipient name or ID"
          value={step.config.recipient ?? ''}
          onChange={(e) => onUpdateConfig('recipient', e.target.value)}
          className={inputClasses}
        />
      );
    case 'email_to':
      return (
        <input
          type="email"
          placeholder="Email address"
          value={step.config.email ?? ''}
          onChange={(e) => onUpdateConfig('email', e.target.value)}
          className={inputClasses}
        />
      );
    case 'assign_to':
      return (
        <input
          type="email"
          placeholder="Team member email"
          value={step.config.assignee ?? ''}
          onChange={(e) => onUpdateConfig('assignee', e.target.value)}
          className={inputClasses}
        />
      );
    case 'tag':
      return (
        <input
          type="text"
          placeholder="Tag name"
          value={step.config.tag ?? ''}
          onChange={(e) => onUpdateConfig('tag', e.target.value)}
          className={inputClasses}
        />
      );
    case 'forward_fax':
      return (
        <input
          type="tel"
          placeholder="Fax number (e.g. +15551234567)"
          value={step.config.faxNumber ?? ''}
          onChange={(e) => onUpdateConfig('faxNumber', e.target.value)}
          className={inputClasses}
        />
      );
    case 'webhook':
      return (
        <input
          type="url"
          placeholder="https://example.com/webhook"
          value={step.config.url ?? ''}
          onChange={(e) => onUpdateConfig('url', e.target.value)}
          className={inputClasses}
        />
      );
    case 'ai_summarize':
      return (
        <p className="text-xs text-[var(--color-vc-text-tertiary)] italic">
          No configuration needed. AI will generate a summary of the fax content.
        </p>
      );
    case 'delay':
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="1440"
            placeholder="Minutes"
            value={step.config.minutes ?? ''}
            onChange={(e) => onUpdateConfig('minutes', e.target.value)}
            className={cn(inputClasses, 'w-24')}
          />
          <span className="text-xs text-[var(--color-vc-text-secondary)]">minutes</span>
        </div>
      );
    case 'condition':
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={step.config.field ?? ''}
            onChange={(e) => onUpdateConfig('field', e.target.value)}
            className={cn(selectClasses, 'w-36')}
            aria-label="Condition field"
          >
            <option value="">Field</option>
            {CONDITION_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <select
            value={step.config.operator ?? ''}
            onChange={(e) => onUpdateConfig('operator', e.target.value)}
            className={cn(selectClasses, 'w-28')}
            aria-label="Condition operator"
          >
            <option value="">Operator</option>
            {CONDITION_OPERATORS.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Value"
            value={step.config.value ?? ''}
            onChange={(e) => onUpdateConfig('value', e.target.value)}
            className={cn(inputClasses, 'flex-1 min-w-[100px]')}
          />
        </div>
      );
    default:
      return null;
  }
}

/* ----------------------------------------
   Step Builder Row
   ---------------------------------------- */

interface StepRowProps {
  step: WorkflowStep;
  index: number;
  onUpdate: (updated: WorkflowStep) => void;
  onRemove: () => void;
}

function StepRow({ step, index, onUpdate, onRemove }: StepRowProps) {
  const handleActionChange = useCallback(
    (actionType: ActionType) => {
      onUpdate({ ...step, actionType, config: {} });
    },
    [step, onUpdate],
  );

  const handleConfigChange = useCallback(
    (key: string, value: string) => {
      onUpdate({ ...step, config: { ...step.config, [key]: value } });
    },
    [step, onUpdate],
  );

  const selectClasses = cn(
    'w-full px-3 py-2 text-sm',
    'bg-white border border-[var(--color-vc-border)]',
    'rounded-[var(--radius-md)]',
    'text-[var(--color-vc-text)]',
    'appearance-none cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-vc-accent)]/30 focus:border-[var(--color-vc-accent)]',
    'transition-colors duration-150',
  );

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3',
        'bg-[var(--color-vc-surface)]/50',
        'border border-[var(--color-vc-border)]',
        'rounded-[var(--radius-md)]',
      )}
    >
      {/* Step number */}
      <div className="flex items-center gap-1.5 pt-2 shrink-0">
        <GripVertical
          size={14}
          className="text-[var(--color-vc-text-tertiary)]"
          aria-hidden="true"
        />
        <span
          className={cn(
            'inline-flex items-center justify-center',
            'w-5 h-5 rounded-full',
            'bg-[var(--color-vc-accent)]',
            'text-white text-[10px] font-medium',
          )}
        >
          {index + 1}
        </span>
      </div>

      {/* Step body */}
      <div className="flex-1 space-y-2">
        <select
          value={step.actionType}
          onChange={(e) =>
            handleActionChange(e.target.value as ActionType)
          }
          className={selectClasses}
          aria-label={`Step ${index + 1} action type`}
        >
          {Object.entries(ACTION_TYPES).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        <StepConfigFields step={step} onUpdateConfig={handleConfigChange} />
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'inline-flex items-center justify-center shrink-0',
          'w-7 h-7 rounded-[var(--radius-sm)] mt-1.5',
          'text-[var(--color-vc-text-tertiary)]',
          'hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)]',
          'transition-colors duration-150',
          'cursor-pointer',
        )}
        aria-label={`Remove step ${index + 1}`}
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Multi-Select Chip Input
   ---------------------------------------- */

interface ChipSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

function ChipSelect({ options, selected, onChange, label }: ChipSelectProps) {
  const handleToggle = useCallback(
    (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(next);
    },
    [selected, onChange],
  );

  return (
    <fieldset>
      <legend
        className={cn(
          'font-[family-name:var(--font-jetbrains)]',
          'text-[10px] uppercase tracking-[0.15em]',
          'text-[var(--color-vc-text-tertiary)]',
          'mb-2',
        )}
      >
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleToggle(opt.value)}
              className={cn(
                'inline-flex items-center',
                'px-2.5 py-1 rounded-full',
                'text-[11px] font-medium',
                'transition-all duration-150',
                'cursor-pointer',
                'border',
                isActive
                  ? 'border-[var(--color-vc-accent)] bg-[var(--color-vc-accent)]/8 text-[var(--color-vc-accent)]'
                  : 'border-[var(--color-vc-border)] bg-white text-[var(--color-vc-text-secondary)] hover:border-[var(--color-vc-text-tertiary)]',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ----------------------------------------
   Workflow Form
   ---------------------------------------- */

interface WorkflowFormProps {
  initialData?: {
    name: string;
    description: string;
    triggerType: TriggerType;
    triggerConfig: TriggerConfig;
    steps: WorkflowStep[];
    priority: number;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    triggerType: TriggerType;
    triggerConfig: TriggerConfig;
    steps: WorkflowStep[];
    priority: number;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function WorkflowForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: WorkflowFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [triggerType, setTriggerType] = useState<TriggerType>(
    initialData?.triggerType ?? 'on_receive',
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialData?.triggerConfig.types ?? [],
  );
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>(
    initialData?.triggerConfig.urgencyLevels ?? [],
  );
  const [keywords, setKeywords] = useState(
    initialData?.triggerConfig.keywords?.join(', ') ?? '',
  );
  const [steps, setSteps] = useState<WorkflowStep[]>(
    initialData?.steps ?? [createEmptyStep()],
  );
  const [priority, setPriority] = useState(initialData?.priority ?? 10);

  const docTypeOptions = useMemo(
    () =>
      Object.entries(DOCUMENT_TYPE_MAP).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

  const urgencyOptions = useMemo(
    () => URGENCY_OPTIONS.map((u) => ({ value: u.value, label: u.label })),
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const triggerConfig: TriggerConfig = {};
      if (triggerType === 'on_type') {
        triggerConfig.types = selectedTypes;
      }
      if (triggerType === 'on_urgency') {
        triggerConfig.urgencyLevels = selectedUrgency;
      }
      if (triggerType === 'on_keyword') {
        triggerConfig.keywords = keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean);
      }

      onSubmit({
        name,
        description,
        triggerType,
        triggerConfig,
        steps,
        priority,
      });
    },
    [
      name,
      description,
      triggerType,
      selectedTypes,
      selectedUrgency,
      keywords,
      steps,
      priority,
      onSubmit,
    ],
  );

  const handleUpdateStep = useCallback(
    (index: number, updated: WorkflowStep) => {
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? updated : s)),
      );
    },
    [],
  );

  const handleRemoveStep = useCallback((index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddStep = useCallback(() => {
    setSteps((prev) => [...prev, createEmptyStep()]);
  }, []);

  const inputClasses = cn(
    'w-full px-3 py-2 text-sm',
    'bg-white border border-[var(--color-vc-border)]',
    'rounded-[var(--radius-md)]',
    'text-[var(--color-vc-text)]',
    'placeholder:text-[var(--color-vc-text-tertiary)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-vc-accent)]/30 focus:border-[var(--color-vc-accent)]',
    'transition-colors duration-150',
  );

  const labelClasses = cn(
    'font-[family-name:var(--font-jetbrains)]',
    'text-[10px] uppercase tracking-[0.15em]',
    'text-[var(--color-vc-text-tertiary)]',
    'mb-1.5 block',
  );

  const isValid = name.trim().length > 0 && steps.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="wf-name" className={labelClasses}>
          Workflow Name
        </label>
        <input
          id="wf-name"
          type="text"
          placeholder="e.g. Urgent Lab Alert"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="wf-desc" className={labelClasses}>
          Description
        </label>
        <textarea
          id="wf-desc"
          placeholder="What does this workflow do?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={cn(inputClasses, 'resize-none')}
        />
      </div>

      {/* Trigger */}
      <div>
        <span className={labelClasses}>Trigger</span>
        <div className="space-y-2">
          {(
            Object.entries(TRIGGER_TYPES) as [
              TriggerType,
              (typeof TRIGGER_TYPES)[TriggerType],
            ][]
          ).map(([key, trigger]) => {
            const Icon = trigger.icon;
            return (
              <label
                key={key}
                className={cn(
                  'flex items-center gap-3',
                  'px-3 py-2.5 rounded-[var(--radius-md)]',
                  'border cursor-pointer',
                  'transition-all duration-150',
                  triggerType === key
                    ? 'border-[var(--color-vc-accent)] bg-[var(--color-vc-accent)]/4'
                    : 'border-[var(--color-vc-border)] bg-white hover:border-[var(--color-vc-text-tertiary)]',
                )}
              >
                <input
                  type="radio"
                  name="triggerType"
                  value={key}
                  checked={triggerType === key}
                  onChange={() => setTriggerType(key)}
                  className="sr-only"
                />
                <Icon
                  size={15}
                  style={{ color: trigger.color }}
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--color-vc-text)]">
                  {trigger.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Trigger config */}
      {triggerType === 'on_type' && (
        <ChipSelect
          options={docTypeOptions}
          selected={selectedTypes}
          onChange={setSelectedTypes}
          label="Document Types"
        />
      )}

      {triggerType === 'on_urgency' && (
        <ChipSelect
          options={urgencyOptions}
          selected={selectedUrgency}
          onChange={setSelectedUrgency}
          label="Urgency Levels"
        />
      )}

      {triggerType === 'on_keyword' && (
        <div>
          <label htmlFor="wf-keywords" className={labelClasses}>
            Keywords (comma-separated)
          </label>
          <input
            id="wf-keywords"
            type="text"
            placeholder="e.g. stat, critical, urgent refill"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={inputClasses}
          />
        </div>
      )}

      {/* Priority */}
      <div>
        <label htmlFor="wf-priority" className={labelClasses}>
          Priority (lower number = higher priority)
        </label>
        <input
          id="wf-priority"
          type="number"
          min="1"
          max="100"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className={cn(inputClasses, 'w-24')}
        />
      </div>

      {/* Steps */}
      <div>
        <span className={labelClasses}>Steps</span>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <StepRow
              key={step.id}
              step={step}
              index={idx}
              onUpdate={(updated) => handleUpdateStep(idx, updated)}
              onRemove={() => handleRemoveStep(idx)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddStep}
          className={cn(
            'inline-flex items-center gap-1.5',
            'mt-2 px-3 py-1.5',
            'text-xs font-medium',
            'text-[var(--color-vc-accent)]',
            'rounded-[var(--radius-md)]',
            'hover:bg-[var(--color-vc-accent)]/6',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
        >
          <Plus size={14} aria-hidden="true" />
          Add Step
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-vc-border)]">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="submit"
          loading={isLoading}
          disabled={!isValid}
        >
          {initialData ? 'Save Changes' : 'Create Workflow'}
        </Button>
      </div>
    </form>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function WorkflowsPage() {
  const sessionToken = getSessionToken();

  const workflows = useQuery(
    api.workflows.listWorkflows,
    sessionToken ? { sessionToken } : 'skip',
  );

  const createWorkflow = useMutation(api.workflows.createWorkflow);
  const updateWorkflow = useMutation(api.workflows.updateWorkflow);
  const deleteWorkflowMut = useMutation(api.workflows.deleteWorkflow);
  const toggleWorkflowMut = useMutation(api.workflows.toggleWorkflow);

  const [modalState, setModalState] = useState<ModalState>({
    type: 'closed',
  });
  const [mutationLoading, setMutationLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<Id<'workflows'> | null>(
    null,
  );

  const isLoading = workflows === undefined;

  /* ---- Handlers ---- */

  const handleCreate = useCallback(
    async (data: {
      name: string;
      description: string;
      triggerType: TriggerType;
      triggerConfig: TriggerConfig;
      steps: WorkflowStep[];
      priority: number;
    }) => {
      if (!sessionToken) return;
      setMutationLoading(true);
      try {
        await createWorkflow({
          sessionToken,
          name: data.name,
          description: data.description || undefined,
          triggerType: data.triggerType,
          triggerConfig: data.triggerConfig,
          steps: data.steps,
          priority: data.priority,
        });
        setModalState({ type: 'closed' });
      } catch (err) {
        throw err;
      } finally {
        setMutationLoading(false);
      }
    },
    [sessionToken, createWorkflow],
  );

  const handleEdit = useCallback(
    async (data: {
      name: string;
      description: string;
      triggerType: TriggerType;
      triggerConfig: TriggerConfig;
      steps: WorkflowStep[];
      priority: number;
    }) => {
      if (modalState.type !== 'edit' || !sessionToken) return;
      setMutationLoading(true);
      try {
        await updateWorkflow({
          sessionToken,
          workflowId: modalState.workflow._id,
          name: data.name,
          description: data.description || undefined,
          triggerType: data.triggerType,
          triggerConfig: data.triggerConfig,
          steps: data.steps,
          priority: data.priority,
        });
        setModalState({ type: 'closed' });
      } catch (err) {
        throw err;
      } finally {
        setMutationLoading(false);
      }
    },
    [modalState, sessionToken, updateWorkflow],
  );

  const handleDelete = useCallback(async () => {
    if (modalState.type !== 'delete' || !sessionToken) return;
    setMutationLoading(true);
    try {
      await deleteWorkflowMut({
        sessionToken,
        workflowId: modalState.workflow._id,
      });
      setModalState({ type: 'closed' });
    } catch (err) {
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [modalState, sessionToken, deleteWorkflowMut]);

  const handleToggle = useCallback(
    async (workflow: WorkflowData) => {
      if (!sessionToken) return;
      setTogglingId(workflow._id);
      try {
        await toggleWorkflowMut({
          sessionToken,
          workflowId: workflow._id,
        });
      } finally {
        setTogglingId(null);
      }
    },
    [sessionToken, toggleWorkflowMut],
  );

  const closeModal = useCallback(() => {
    if (!mutationLoading) {
      setModalState({ type: 'closed' });
    }
  }, [mutationLoading]);

  /* ---- Loading ---- */

  if (isLoading) {
    return <WorkflowsSkeleton />;
  }

  const workflowList = (workflows ?? []) as unknown as WorkflowData[];

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-medium text-[var(--color-vc-text)]">
            Workflows
          </h1>
          <p className="text-xs text-[var(--color-vc-text-tertiary)] mt-0.5">
            Automated actions triggered when faxes arrive
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalState({ type: 'add' })}
        >
          <Plus size={16} aria-hidden="true" />
          Create Workflow
        </Button>
      </div>

      {/* Workflow list */}
      {workflowList.length === 0 ? (
        <Card>
          <EmptyState
            icon={Workflow}
            title="No workflows yet"
            message="Create your first workflow to automate actions when faxes arrive. Route, tag, notify, and more."
            actionLabel="Create Workflow"
            onAction={() => setModalState({ type: 'add' })}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workflowList.map((workflow) => (
            <WorkflowCard
              key={workflow._id}
              workflow={workflow}
              onEdit={() =>
                setModalState({ type: 'edit', workflow })
              }
              onDelete={() =>
                setModalState({ type: 'delete', workflow })
              }
              onToggle={() => handleToggle(workflow)}
              isToggling={togglingId === workflow._id}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={modalState.type === 'add'}
        onClose={closeModal}
        title="Create Workflow"
        className="!max-w-2xl"
      >
        <WorkflowForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      {modalState.type === 'edit' && (
        <Modal
          isOpen
          onClose={closeModal}
          title="Edit Workflow"
          className="!max-w-2xl"
        >
          <WorkflowForm
            initialData={{
              name: modalState.workflow.name,
              description: modalState.workflow.description ?? '',
              triggerType: modalState.workflow.triggerType,
              triggerConfig: modalState.workflow.triggerConfig,
              steps: modalState.workflow.steps,
              priority: modalState.workflow.priority,
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
          title="Delete Workflow"
        >
          <DeleteConfirmation
            name={modalState.workflow.name}
            onConfirm={handleDelete}
            onCancel={closeModal}
            isLoading={mutationLoading}
          />
        </Modal>
      )}
    </div>
  );
}
