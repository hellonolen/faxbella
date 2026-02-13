'use client';

import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/lib/utils';

const LABEL_CLASSES = [
  'font-[family-name:var(--font-jetbrains)]',
  'tracking-[0.15em]',
  'uppercase',
  'text-[10px]',
  'text-[var(--color-vc-text-tertiary)]',
  'mb-1.5',
  'block',
].join(' ');

const BASE_INPUT_CLASSES = [
  'w-full',
  'bg-white',
  'border',
  'border-[var(--color-vc-border)]',
  'rounded-[var(--radius-lg)]',
  'px-3.5',
  'py-2.5',
  'text-sm',
  'text-[var(--color-vc-text)]',
  'placeholder:text-[var(--color-vc-text-tertiary)]',
  'outline-none',
  'transition-all duration-150 ease-out',
  'focus:ring-2',
  'focus:ring-[var(--color-vc-accent)]',
  'focus:border-[var(--color-vc-accent)]',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
].join(' ');

const ERROR_CLASSES = [
  'border-[var(--color-error)]',
  'focus:ring-[var(--color-error)]',
  'focus:border-[var(--color-error)]',
].join(' ');

/* ----------------------------------------
   TextInput
   ---------------------------------------- */

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className={LABEL_CLASSES}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(BASE_INPUT_CLASSES, error && ERROR_CLASSES, className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
TextInput.displayName = 'TextInput';

/* ----------------------------------------
   TextArea
   ---------------------------------------- */

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={textareaId} className={LABEL_CLASSES}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            BASE_INPUT_CLASSES,
            'min-h-[100px] resize-y',
            error && ERROR_CLASSES,
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1 text-xs text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
TextArea.displayName = 'TextArea';

/* ----------------------------------------
   Select
   ---------------------------------------- */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={selectId} className={LABEL_CLASSES}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            BASE_INPUT_CLASSES,
            'appearance-none',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")]',
            'bg-[length:16px]',
            'bg-[position:right_12px_center]',
            'bg-no-repeat',
            'pr-10',
            error && ERROR_CLASSES,
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1 text-xs text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
