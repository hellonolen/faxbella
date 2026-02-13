'use client';

import { Phone, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from './form-field';
import {
  type FormState,
  INPUT_CLASSES,
  PHONE_PLACEHOLDER,
  PHONE_HINT,
} from './types';

/* ----------------------------------------
   RecipientSection -- Phone, name, subject fields
   ---------------------------------------- */

interface RecipientSectionProps {
  form: FormState;
  onFieldChange: (
    field: keyof FormState,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function RecipientSection({ form, onFieldChange }: RecipientSectionProps) {
  return (
    <>
      {/* Recipient Phone (prominent) */}
      <div className="border-l-2 border-[var(--color-vc-accent)] pl-3">
        <FormField
          label="Recipient Number"
          icon={Phone}
          hint={PHONE_HINT}
          required
          htmlFor="send-recipient-number"
        >
          <input
            id="send-recipient-number"
            type="tel"
            className={cn(INPUT_CLASSES, 'py-3')}
            placeholder={PHONE_PLACEHOLDER}
            value={form.recipientNumber}
            onChange={onFieldChange('recipientNumber')}
            required
            autoComplete="tel"
            aria-required="true"
          />
        </FormField>
      </div>

      {/* Recipient Name */}
      <FormField label="Recipient Name" icon={User} htmlFor="send-recipient-name">
        <input
          id="send-recipient-name"
          type="text"
          className={INPUT_CLASSES}
          placeholder="Jane Smith"
          value={form.recipientName}
          onChange={onFieldChange('recipientName')}
          autoComplete="name"
        />
      </FormField>

      {/* Subject */}
      <FormField label="Subject" icon={FileText} htmlFor="send-subject">
        <input
          id="send-subject"
          type="text"
          className={INPUT_CLASSES}
          placeholder="Regarding patient referral"
          value={form.subject}
          onChange={onFieldChange('subject')}
        />
      </FormField>
    </>
  );
}
