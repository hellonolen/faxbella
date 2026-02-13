'use client';

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import {
  Upload,
  File,
  FileText,
  Image,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const DEFAULT_ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
] as const;

const DEFAULT_MAX_SIZE_MB = 20;

const BYTES_PER_MB = 1024 * 1024;

const MIME_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/tiff': 'TIFF',
};

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < BYTES_PER_MB) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`;
}

function getFileTypeLabel(mimeType: string): string {
  return MIME_LABELS[mimeType] ?? mimeType.split('/').pop()?.toUpperCase() ?? 'FILE';
}

function getFileIcon(mimeType: string) {
  if (mimeType === 'application/pdf') return FileText;
  if (mimeType.startsWith('image/')) return Image;
  return File;
}

/* ----------------------------------------
   Shared Styles
   ---------------------------------------- */

const LABEL_CLASSES = [
  'font-[family-name:var(--font-jetbrains)]',
  'text-[10px]',
  'uppercase',
  'tracking-[0.15em]',
].join(' ');

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onFileRemoved: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  uploadProgress?: number;
  uploadedFileName?: string;
  disabled?: boolean;
  error?: string;
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function FileUpload({
  onFileSelected,
  onFileRemoved,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES as unknown as string[],
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  uploadProgress,
  uploadedFileName,
  disabled = false,
  error: externalError,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isUploading = uploadProgress !== undefined;
  const hasUploadedFile = Boolean(uploadedFileName);
  const hasSelectedFile = selectedFile !== null;
  const displayError = externalError ?? validationError;

  const acceptString = useMemo(() => acceptedTypes.join(','), [acceptedTypes]);

  const acceptedTypeLabels = useMemo(
    () => acceptedTypes.map((t) => getFileTypeLabel(t)).join(', '),
    [acceptedTypes],
  );

  /* Validation */
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `Invalid file type. Accepted: ${acceptedTypeLabels}`;
      }
      if (file.size > maxSizeMB * BYTES_PER_MB) {
        return `File too large. Maximum size: ${maxSizeMB} MB`;
      }
      return null;
    },
    [acceptedTypes, acceptedTypeLabels, maxSizeMB],
  );

  /* Process a file from drop or input */
  const processFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        return;
      }
      setValidationError(null);
      setSelectedFile(file);
      onFileSelected(file);
    },
    [validateFile, onFileSelected],
  );

  /* Remove the selected file */
  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setValidationError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileRemoved();
  }, [onFileRemoved]);

  /* Drag events */
  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounter.current += 1;
      if (e.dataTransfer.items.length > 0) {
        setIsDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragOver(false);
      }
    },
    [disabled],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounter.current = 0;

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [disabled, processFile],
  );

  /* Click-to-browse */
  const handleZoneClick = useCallback(() => {
    if (disabled || hasSelectedFile || hasUploadedFile || isUploading) return;
    inputRef.current?.click();
  }, [disabled, hasSelectedFile, hasUploadedFile, isUploading]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  /* Keyboard support */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleZoneClick();
      }
    },
    [handleZoneClick],
  );

  /* ---- Already uploaded state ---- */
  if (hasUploadedFile) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4',
          'bg-[var(--color-success-light)]',
          'border border-[var(--color-success)]',
          'rounded-[var(--radius-lg)]',
          'transition-all duration-200',
        )}
      >
        <CheckCircle2
          size={20}
          className="shrink-0 text-[var(--color-success)]"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <p className={cn(LABEL_CLASSES, 'text-[var(--color-success)] mb-0.5')}>
            Uploaded
          </p>
          <p className="text-sm text-[var(--color-vc-text)] truncate">
            {uploadedFileName}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center',
            'w-7 h-7 rounded-full shrink-0',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:bg-white/60 hover:text-[var(--color-error)]',
            'transition-all duration-150',
            'disabled:opacity-50 disabled:pointer-events-none',
          )}
          aria-label="Remove uploaded file"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  /* ---- File selected / uploading state ---- */
  if (hasSelectedFile && selectedFile) {
    const IconComponent = getFileIcon(selectedFile.type);

    return (
      <div
        className={cn(
          'rounded-[var(--radius-lg)]',
          'border border-[var(--color-vc-border)]',
          'bg-white',
          'overflow-hidden',
          'transition-all duration-200',
          displayError && 'border-[var(--color-error)]',
        )}
      >
        {/* File info row */}
        <div className="flex items-center gap-3 p-4">
          <div
            className={cn(
              'flex items-center justify-center',
              'w-10 h-10 shrink-0',
              'rounded-[var(--radius-md)]',
              'bg-[var(--color-vc-surface)]',
            )}
          >
            <IconComponent
              size={18}
              className="text-[var(--color-vc-accent)]"
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-vc-text)] truncate">
              {selectedFile.name}
            </p>
            <p className={cn(LABEL_CLASSES, 'text-[var(--color-vc-text-tertiary)] mt-0.5')}>
              {formatFileSize(selectedFile.size)} &middot; {getFileTypeLabel(selectedFile.type)}
            </p>
          </div>

          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className={cn(
                'flex items-center justify-center',
                'w-7 h-7 rounded-full shrink-0',
                'text-[var(--color-vc-text-tertiary)]',
                'hover:bg-[var(--color-vc-surface)] hover:text-[var(--color-error)]',
                'transition-all duration-150',
                'disabled:opacity-50 disabled:pointer-events-none',
              )}
              aria-label="Remove selected file"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Upload progress bar */}
        {isUploading && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn(LABEL_CLASSES, 'text-[var(--color-vc-text-tertiary)]')}>
                Uploading
              </span>
              <span className={cn(LABEL_CLASSES, 'text-[var(--color-vc-accent)]')}>
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <div
              className="w-full h-1.5 bg-[var(--color-vc-surface)] rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(uploadProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  'bg-gradient-to-r from-[var(--color-vc-accent)] to-[var(--color-vc-accent-light)]',
                  'transition-[width] duration-300 ease-out',
                )}
                style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
              />
            </div>
          </div>
        )}

        {/* Error under file preview */}
        {displayError && (
          <div
            role="alert"
            className={cn(
              'flex items-center gap-2 px-4 py-2.5',
              'bg-[var(--color-error-light)]',
              'border-t border-[var(--color-error)]',
              'text-xs text-[var(--color-error)]',
            )}
          >
            <AlertTriangle size={12} className="shrink-0" aria-hidden="true" />
            {displayError}
          </div>
        )}
      </div>
    );
  }

  /* ---- Drop zone (empty state) ---- */
  return (
    <div className="flex flex-col">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleZoneClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-label="File upload drop zone. Click or drag a file to upload."
        aria-disabled={disabled}
        className={cn(
          'relative flex flex-col items-center justify-center',
          'gap-3 p-8',
          'border-2 border-dashed',
          'rounded-[var(--radius-lg)]',
          'cursor-pointer',
          'transition-all duration-200 ease-out',
          'outline-none',

          /* Default state */
          !isDragOver && !displayError && [
            'border-[var(--color-vc-border)]',
            'bg-[var(--color-vc-bg)]',
            'hover:border-[var(--color-vc-accent)]',
            'hover:bg-[rgba(232,85,61,0.02)]',
          ],

          /* Drag over state */
          isDragOver && [
            'border-[var(--color-vc-accent)]',
            'bg-[rgba(232,85,61,0.04)]',
            'scale-[1.01]',
          ],

          /* Error state */
          displayError && [
            'border-[var(--color-error)]',
            'bg-[var(--color-error-light)]',
          ],

          /* Disabled state */
          disabled && [
            'opacity-50',
            'pointer-events-none',
            'cursor-not-allowed',
          ],

          /* Focus visible */
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--color-vc-accent)]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[var(--color-vc-bg)]',
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center',
            'w-12 h-12 rounded-full',
            'transition-all duration-200',
            isDragOver
              ? 'bg-[rgba(232,85,61,0.1)] text-[var(--color-vc-accent)]'
              : 'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-tertiary)]',
          )}
        >
          <Upload
            size={20}
            className={cn(
              'transition-transform duration-200',
              isDragOver && '-translate-y-0.5',
            )}
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm text-[var(--color-vc-text)]">
            <span className="font-medium text-[var(--color-vc-accent)]">
              Click to browse
            </span>
            {' '}or drag and drop
          </p>
          <p className={cn(LABEL_CLASSES, 'text-[var(--color-vc-text-tertiary)] mt-1.5')}>
            {acceptedTypeLabels} &middot; Max {maxSizeMB} MB
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Validation error below drop zone */}
      {displayError && (
        <div
          role="alert"
          className={cn(
            'flex items-center gap-2 mt-2',
            'text-xs text-[var(--color-error)]',
          )}
        >
          <AlertTriangle size={12} className="shrink-0" aria-hidden="true" />
          {displayError}
        </div>
      )}
    </div>
  );
}
