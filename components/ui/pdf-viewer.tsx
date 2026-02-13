'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { ExternalLink, Download, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const DEFAULT_HEIGHT = 600;

const TOOLBAR_BUTTON_CLASSES = [
  'inline-flex items-center gap-1.5',
  'px-2.5 py-1.5',
  'text-xs font-medium',
  'text-[var(--color-vc-text-secondary)]',
  'bg-transparent',
  'rounded-[var(--radius-sm)]',
  'transition-colors duration-150 ease-out',
  'hover:bg-[var(--color-vc-bg)]',
  'hover:text-[var(--color-vc-text)]',
  'active:bg-[var(--color-vc-border)]',
  'cursor-pointer',
].join(' ');

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PdfViewerProps {
  url: string;
  fileName?: string;
  height?: number;
  className?: string;
  onDownload?: () => void;
}

type ViewerState = 'loading' | 'ready' | 'error';

/* ----------------------------------------
   Sub-components
   ---------------------------------------- */

function ToolbarButton({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={TOOLBAR_BUTTON_CLASSES}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

function LoadingSkeleton({ height }: { height: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 bg-white"
      style={{ height }}
      role="status"
      aria-label="Loading PDF"
    >
      <Loader2
        size={28}
        className="animate-spin text-[var(--color-vc-text-tertiary)]"
        aria-hidden="true"
      />
      <p className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.1em] uppercase text-[var(--color-vc-text-tertiary)]">
        Loading document
      </p>
    </div>
  );
}

function ErrorFallback({
  url,
  height,
  onDownload,
}: {
  url: string;
  height: number;
  onDownload?: () => void;
}) {
  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url, onDownload]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 bg-white px-6"
      style={{ height }}
      role="alert"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-error-light)]">
        <AlertTriangle size={22} className="text-[var(--color-error)]" aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[var(--color-vc-text)] mb-1">
          Unable to display PDF
        </p>
        <p className="text-xs text-[var(--color-vc-text-tertiary)] max-w-[280px]">
          Your browser may not support inline PDF viewing. Download the file to view it instead.
        </p>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        className={cn(
          'inline-flex items-center gap-2',
          'px-4 py-2 text-sm font-medium',
          'bg-[var(--color-vc-accent)] text-white',
          'rounded-[var(--radius-sm)]',
          'transition-colors duration-150 ease-out',
          'hover:bg-[var(--color-vc-accent-light)]',
          'cursor-pointer',
        )}
      >
        <Download size={14} aria-hidden="true" />
        Download PDF
      </button>
    </div>
  );
}

/* ----------------------------------------
   PdfViewer
   ---------------------------------------- */

export function PdfViewer({
  url,
  fileName,
  height = DEFAULT_HEIGHT,
  className,
  onDownload,
}: PdfViewerProps) {
  const [state, setState] = useState<ViewerState>('loading');

  const handleLoad = useCallback(() => {
    setState('ready');
  }, []);

  const handleError = useCallback(() => {
    setState('error');
  }, []);

  const handleOpenNewTab = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    }
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName ?? 'document.pdf';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, [url, fileName, onDownload]);

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)]',
        'border border-[var(--color-vc-border)]',
        'overflow-hidden',
        'shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      {/* Toolbar */}
      <div
        className={cn(
          'flex items-center justify-between',
          'bg-[var(--color-vc-surface)]',
          'border-b border-[var(--color-vc-border)]',
          'px-4 py-2',
          'min-h-[44px]',
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText
            size={14}
            className="shrink-0 text-[var(--color-vc-text-tertiary)]"
            aria-hidden="true"
          />
          {fileName && (
            <span
              className={cn(
                'font-[family-name:var(--font-jetbrains)]',
                'text-xs',
                'text-[var(--color-vc-text-secondary)]',
                'truncate',
              )}
              title={fileName}
            >
              {fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ToolbarButton onClick={handleOpenNewTab} title="Open in new tab">
            <ExternalLink size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Open</span>
          </ToolbarButton>
          <ToolbarButton onClick={handleDownload} title="Download PDF">
            <Download size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Download</span>
          </ToolbarButton>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {state === 'loading' && <LoadingSkeleton height={height} />}

        {state === 'error' && (
          <ErrorFallback url={url} height={height} onDownload={onDownload} />
        )}

        {state !== 'error' && (
          <iframe
            src={url}
            title={fileName ?? 'PDF Document'}
            className={cn(
              'w-full bg-white border-0',
              state === 'loading' && 'absolute inset-0 opacity-0',
            )}
            style={{ height }}
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        )}
      </div>
    </div>
  );
}
