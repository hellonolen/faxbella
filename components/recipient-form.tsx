'use client';

import { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { TextInput, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface RecipientFormData {
  name: string;
  email: string;
  company: string;
  keywords: string[];
  deliveryMethod: string;
  webhookUrl: string;
}

interface RecipientFormProps {
  initialData?: Partial<RecipientFormData>;
  onSubmit: (data: RecipientFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const DELIVERY_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'webhook', label: 'Webhook' },
] as const;

const EMPTY_FORM: RecipientFormData = {
  name: '',
  email: '',
  company: '',
  keywords: [],
  deliveryMethod: 'email',
  webhookUrl: '',
};

/* ----------------------------------------
   Keyword Tag Input
   ---------------------------------------- */

interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

function KeywordInput({ keywords, onChange }: KeywordInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addKeyword = useCallback(
    (raw: string) => {
      const keyword = raw.trim().toLowerCase();
      if (keyword && !keywords.includes(keyword)) {
        onChange([...keywords, keyword]);
      }
      setInputValue('');
    },
    [keywords, onChange],
  );

  const removeKeyword = useCallback(
    (index: number) => {
      onChange(keywords.filter((_, i) => i !== index));
    },
    [keywords, onChange],
  );

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(inputValue);
    }
    if (e.key === 'Backspace' && inputValue === '' && keywords.length > 0) {
      removeKeyword(keywords.length - 1);
    }
  }

  function handleBlur() {
    if (inputValue.trim()) {
      addKeyword(inputValue);
    }
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor="keywords"
        className={cn(
          'font-[family-name:var(--font-jetbrains)]',
          'tracking-[0.15em] uppercase text-[10px]',
          'text-[var(--color-vc-text-tertiary)]',
          'mb-1.5 block',
        )}
      >
        Keywords
      </label>

      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5',
          'w-full bg-white border border-[var(--color-vc-border)]',
          'rounded-[var(--radius-lg)] px-3 py-2',
          'transition-all duration-150 ease-out',
          'focus-within:ring-2 focus-within:ring-[var(--color-vc-accent)]',
          'focus-within:border-[var(--color-vc-accent)]',
          'min-h-[42px]',
        )}
      >
        {keywords.map((keyword, index) => (
          <span
            key={keyword}
            className={cn(
              'inline-flex items-center gap-1',
              'bg-[var(--color-vc-surface)] text-[var(--color-vc-text)]',
              'text-xs px-2.5 py-1 rounded-full',
              'font-[family-name:var(--font-jetbrains)]',
            )}
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className={cn(
                'inline-flex items-center justify-center',
                'w-3.5 h-3.5 rounded-full',
                'text-[var(--color-vc-text-tertiary)]',
                'hover:text-[var(--color-vc-accent)] hover:bg-[var(--color-vc-border)]',
                'transition-colors duration-100',
                'cursor-pointer',
              )}
              aria-label={`Remove ${keyword}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}

        <input
          id="keywords"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={keywords.length === 0 ? 'Type and press Enter...' : ''}
          className={cn(
            'flex-1 min-w-[100px] bg-transparent',
            'text-sm text-[var(--color-vc-text)]',
            'placeholder:text-[var(--color-vc-text-tertiary)]',
            'outline-none border-none p-0',
          )}
        />
      </div>

      <p className="mt-1 text-[10px] text-[var(--color-vc-text-tertiary)] font-[family-name:var(--font-jetbrains)]">
        Press Enter or comma to add. Used for AI routing.
      </p>
    </div>
  );
}

/* ----------------------------------------
   RecipientForm
   ---------------------------------------- */

export function RecipientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: RecipientFormProps) {
  const [formData, setFormData] = useState<RecipientFormData>({
    ...EMPTY_FORM,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RecipientFormData, string>>>({});

  const isWebhook = formData.deliveryMethod === 'webhook';
  const isEditing = !!initialData?.name;

  function updateField<K extends keyof RecipientFormData>(
    key: K,
    value: RecipientFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof RecipientFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (isWebhook && !formData.webhookUrl.trim()) {
      newErrors.webhookUrl = 'Webhook URL is required when delivery method is webhook';
    } else if (isWebhook && formData.webhookUrl.trim()) {
      try {
        new URL(formData.webhookUrl);
      } catch {
        newErrors.webhookUrl = 'Invalid URL format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        webhookUrl: isWebhook ? formData.webhookUrl.trim() : '',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Name"
        placeholder="Dr. Sarah Chen"
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        error={errors.name}
        required
        autoFocus
      />

      <TextInput
        label="Email"
        type="email"
        placeholder="sarah@clinic.com"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={errors.email}
        required
      />

      <TextInput
        label="Company"
        placeholder="Cityview Medical (optional)"
        value={formData.company}
        onChange={(e) => updateField('company', e.target.value)}
      />

      <KeywordInput
        keywords={formData.keywords}
        onChange={(kw) => updateField('keywords', kw)}
      />

      <Select
        label="Delivery Method"
        value={formData.deliveryMethod}
        onChange={(e) => updateField('deliveryMethod', e.target.value)}
      >
        {DELIVERY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {isWebhook && (
        <TextInput
          label="Webhook URL"
          type="url"
          placeholder="https://api.example.com/fax-webhook"
          value={formData.webhookUrl}
          onChange={(e) => updateField('webhookUrl', e.target.value)}
          error={errors.webhookUrl}
          required
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isLoading}
        >
          {isEditing ? 'Save Changes' : 'Add Recipient'}
        </Button>
      </div>
    </form>
  );
}
