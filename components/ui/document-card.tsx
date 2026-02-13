'use client';

import { useState, useCallback } from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';

/* ----------------------------------------
   Document Card
   Shared viewer for inbound and outbound fax documents.
   ---------------------------------------- */

interface DocumentCardProps {
  faxId: string;
  email: string;
  hasFile: boolean;
  fileName?: string;
  direction: 'inbound' | 'outbound';
}

export function DocumentCard({
  faxId,
  email,
  hasFile,
  fileName,
  direction,
}: DocumentCardProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const getDownloadUrl = useAction(api.fileAccess.getDownloadUrl);

  const fetchUrl = useCallback(async () => {
    if (!hasFile || !email) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getDownloadUrl({
        email,
        faxId,
        direction,
      });
      setDownloadUrl(result.downloadUrl);
      return result.downloadUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasFile, email, faxId, direction, getDownloadUrl]);

  const handleDownload = useCallback(async () => {
    const url = downloadUrl || (await fetchUrl());
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [downloadUrl, fetchUrl]);

  const handleViewToggle = useCallback(async () => {
    if (!showViewer && !downloadUrl) {
      await fetchUrl();
    }
    setShowViewer((prev) => !prev);
  }, [showViewer, downloadUrl, fetchUrl]);

  if (!hasFile) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText
            size={16}
            className="text-[var(--color-vc-text-tertiary)]"
            aria-hidden="true"
          />
          <span className="mono-label">Document</span>
          {fileName && (
            <span className="text-xs text-[var(--color-vc-text-tertiary)]">
              {fileName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            loading={loading && !showViewer}
            onClick={handleViewToggle}
          >
            <Eye size={14} aria-hidden="true" />
            {showViewer ? 'Hide' : 'View'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            loading={loading && !showViewer}
            onClick={handleDownload}
          >
            <Download size={14} aria-hidden="true" />
            Download
          </Button>
        </div>
      </div>
      <div className="accent-line mb-4" />

      {error && (
        <p className="text-sm text-[var(--color-error)] mb-3">{error}</p>
      )}

      {showViewer && downloadUrl && (
        <div
          className={cn(
            'w-full rounded-[var(--radius-md)]',
            'border border-[var(--color-vc-border)]',
            'overflow-hidden',
          )}
        >
          <iframe
            src={downloadUrl}
            title="Fax PDF Viewer"
            className="w-full bg-white"
            style={{ height: '600px' }}
            sandbox="allow-same-origin"
          />
        </div>
      )}

      {showViewer && !downloadUrl && !loading && (
        <p className="text-sm text-[var(--color-vc-text-tertiary)] italic">
          Unable to load document preview.
        </p>
      )}

      {showViewer && loading && (
        <Skeleton height={600} className="w-full rounded-[var(--radius-md)]" />
      )}
    </Card>
  );
}
