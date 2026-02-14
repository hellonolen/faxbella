'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import {
  FolderOpen,
  Search,
  Filter,
  ChevronDown,
  Star,
  Tag,
  Mail,
  Phone,
  Download,
  X,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
} from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { usePasskey } from '@/hooks/use-passkey';
import { DocumentTypeBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatRelativeTime } from '@/lib/utils';
import { DOCUMENT_TYPE_MAP } from '@/lib/constants';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface LibraryDocument {
  _id: string;
  title: string;
  documentType?: string;
  sourceType: 'inbound' | 'outbound';
  starred: boolean;
  tags: string[];
  pageCount: number;
  createdAt: number;
  storageUrl?: string;
}

type SourceFilter = 'all' | 'inbound' | 'outbound';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const SOURCE_TABS: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
];

const TABLE_HEADERS = ['Document', 'Type', 'Source', 'Pages', 'Date', 'Actions'] as const;

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
   Source Toggle
   ---------------------------------------- */

function SourceToggle({
  value,
  onChange,
}: {
  value: SourceFilter;
  onChange: (v: SourceFilter) => void;
}) {
  return (
    <div
      className={cn(
        'inline-flex',
        'border border-[var(--color-vc-border)]',
        'rounded-[var(--radius-md)]',
        'overflow-hidden',
      )}
      role="tablist"
      aria-label="Filter by source"
    >
      {SOURCE_TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-3 py-1.5',
            'text-xs',
            'font-[family-name:var(--font-jetbrains)]',
            'transition-all duration-150',
            'cursor-pointer',
            value === tab.value
              ? 'bg-[var(--color-vc-primary)] text-white'
              : 'bg-white text-[var(--color-vc-text-secondary)] hover:bg-[var(--color-vc-surface)]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Search Bar
   ---------------------------------------- */

function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative flex-1 min-w-[200px] max-w-sm">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-vc-text-tertiary)] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents..."
        aria-label="Search documents"
        className={cn(
          'w-full',
          'pl-9 pr-8 py-2',
          'text-sm',
          'bg-white',
          'border border-[var(--color-vc-border)]',
          'rounded-[var(--radius-md)]',
          'text-[var(--color-vc-text)]',
          'placeholder:text-[var(--color-vc-text-tertiary)]',
          'transition-all duration-150',
          'hover:border-[var(--color-vc-text-tertiary)]',
          'focus:outline-none focus-ring',
        )}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className={cn(
            'absolute right-2.5 top-1/2 -translate-y-1/2',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:text-[var(--color-vc-text)]',
            'cursor-pointer',
            'transition-colors duration-100',
          )}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Tag Input (inline add tag)
   ---------------------------------------- */

function TagInput({
  documentId,
  sessionToken,
}: {
  documentId: string;
  sessionToken: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagValue, setTagValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tagDocument = useMutation(api.documentLibrary.tagDocument);

  const handleSubmit = useCallback(async () => {
    const trimmed = tagValue.trim().toLowerCase();
    if (!trimmed) return;

    try {
      await tagDocument({
        sessionToken,
        documentId,
        tag: trimmed,
        action: 'add',
      });
      setTagValue('');
      setIsOpen(false);
    } catch {
      // Silently handle — tag may already exist
    }
  }, [tagValue, tagDocument, sessionToken, documentId]);

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        title="Add tag"
        aria-label="Add tag"
        className={cn(
          'p-1.5 rounded-[var(--radius-sm)]',
          'text-[var(--color-vc-text-tertiary)]',
          'hover:bg-[var(--color-vc-surface)]',
          'hover:text-[var(--color-vc-text-secondary)]',
          'transition-all duration-100',
          'cursor-pointer',
        )}
      >
        <Tag size={14} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="text"
        value={tagValue}
        onChange={(e) => setTagValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') {
            setIsOpen(false);
            setTagValue('');
          }
        }}
        placeholder="tag"
        aria-label="Enter tag name"
        className={cn(
          'w-20 px-2 py-1',
          'text-xs',
          'font-[family-name:var(--font-jetbrains)]',
          'bg-white',
          'border border-[var(--color-vc-border)]',
          'rounded-[var(--radius-sm)]',
          'text-[var(--color-vc-text)]',
          'focus:outline-none focus-ring',
        )}
      />
      <button
        onClick={handleSubmit}
        aria-label="Confirm tag"
        className={cn(
          'p-1 rounded-[var(--radius-sm)]',
          'text-[var(--color-success)]',
          'hover:bg-[var(--color-success-light)]',
          'transition-all duration-100',
          'cursor-pointer',
        )}
      >
        <Plus size={12} aria-hidden="true" />
      </button>
      <button
        onClick={() => {
          setIsOpen(false);
          setTagValue('');
        }}
        aria-label="Cancel"
        className={cn(
          'p-1 rounded-[var(--radius-sm)]',
          'text-[var(--color-vc-text-tertiary)]',
          'hover:bg-[var(--color-vc-surface)]',
          'transition-all duration-100',
          'cursor-pointer',
        )}
      >
        <X size={12} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Tag Badge (removable)
   ---------------------------------------- */

function TagBadge({
  tag,
  documentId,
  sessionToken,
}: {
  tag: string;
  documentId: string;
  sessionToken: string;
}) {
  const tagDocument = useMutation(api.documentLibrary.tagDocument);

  const handleRemove = useCallback(async () => {
    try {
      await tagDocument({
        sessionToken,
        documentId,
        tag,
        action: 'remove',
      });
    } catch {
      // Silently handle
    }
  }, [tagDocument, sessionToken, documentId, tag]);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'px-1.5 py-0.5',
        'text-[10px]',
        'font-[family-name:var(--font-jetbrains)]',
        'bg-[var(--color-vc-surface)]',
        'text-[var(--color-vc-text-secondary)]',
        'rounded-[var(--radius-sm)]',
        'group/tag',
      )}
    >
      {tag}
      <button
        onClick={handleRemove}
        aria-label={`Remove tag ${tag}`}
        className={cn(
          'opacity-0 group-hover/tag:opacity-100',
          'text-[var(--color-vc-text-tertiary)]',
          'hover:text-[var(--color-error)]',
          'transition-all duration-100',
          'cursor-pointer',
        )}
      >
        <X size={10} aria-hidden="true" />
      </button>
    </span>
  );
}

/* ----------------------------------------
   Action Buttons
   ---------------------------------------- */

function DocumentActions({
  doc,
  sessionToken,
}: {
  doc: LibraryDocument;
  sessionToken: string;
}) {
  const starDocument = useMutation(api.documentLibrary.starDocument);
  const reshareDocument = useAction(api.documentLibrary.reshareDocument);
  const resendDocument = useAction(api.documentLibrary.resendDocument);

  const handleStar = useCallback(async () => {
    try {
      await starDocument({ sessionToken, documentId: doc._id });
    } catch {
      // Silently handle
    }
  }, [starDocument, sessionToken, doc._id]);

  const handleReshare = useCallback(async () => {
    const email = window.prompt('Enter email address to share this document:');
    if (!email) return;

    try {
      await reshareDocument({
        sessionToken,
        documentId: doc._id,
        toEmail: email,
      });
    } catch {
      // Silently handle
    }
  }, [reshareDocument, sessionToken, doc._id]);

  const handleResend = useCallback(async () => {
    const faxNumber = window.prompt('Enter fax number to resend:');
    if (!faxNumber) return;

    try {
      await resendDocument({
        sessionToken,
        documentId: doc._id,
        toFaxNumber: faxNumber,
      });
    } catch {
      // Silently handle
    }
  }, [resendDocument, sessionToken, doc._id]);

  const handleDownload = useCallback(() => {
    if (doc.storageUrl) {
      window.open(doc.storageUrl, '_blank', 'noopener');
    }
  }, [doc.storageUrl]);

  const actionButtonClass = cn(
    'p-1.5 rounded-[var(--radius-sm)]',
    'text-[var(--color-vc-text-tertiary)]',
    'hover:bg-[var(--color-vc-surface)]',
    'hover:text-[var(--color-vc-text-secondary)]',
    'transition-all duration-100',
    'cursor-pointer',
  );

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={handleStar}
        title={doc.starred ? 'Unstar' : 'Star'}
        aria-label={doc.starred ? 'Unstar document' : 'Star document'}
        className={cn(
          actionButtonClass,
          doc.starred && 'text-[var(--color-warning)] hover:text-[var(--color-warning)]',
        )}
      >
        <Star
          size={14}
          fill={doc.starred ? 'var(--color-warning)' : 'none'}
          aria-hidden="true"
        />
      </button>

      <TagInput documentId={doc._id} sessionToken={sessionToken} />

      <button
        onClick={handleReshare}
        title="Reshare via email"
        aria-label="Reshare via email"
        className={actionButtonClass}
      >
        <Mail size={14} aria-hidden="true" />
      </button>

      <button
        onClick={handleResend}
        title="Resend via fax"
        aria-label="Resend via fax"
        className={actionButtonClass}
      >
        <Phone size={14} aria-hidden="true" />
      </button>

      <button
        onClick={handleDownload}
        title="Download"
        aria-label="Download document"
        className={actionButtonClass}
      >
        <Download size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Source Indicator
   ---------------------------------------- */

function SourceIndicator({ source }: { source: 'inbound' | 'outbound' }) {
  const isInbound = source === 'inbound';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'text-[11px]',
        'font-[family-name:var(--font-jetbrains)]',
        isInbound
          ? 'text-[var(--color-info)]'
          : 'text-[var(--color-vc-text-tertiary)]',
      )}
    >
      {isInbound ? (
        <ArrowDownToLine size={12} aria-hidden="true" />
      ) : (
        <ArrowUpFromLine size={12} aria-hidden="true" />
      )}
      {isInbound ? 'In' : 'Out'}
    </span>
  );
}

/* ----------------------------------------
   Document Row
   ---------------------------------------- */

function DocumentRow({
  doc,
  sessionToken,
}: {
  doc: LibraryDocument;
  sessionToken: string;
}) {
  return (
    <tr
      className={cn(
        'border-b border-[var(--color-vc-border)] last:border-0',
        'hover:bg-[var(--color-vc-surface)]',
        'transition-colors duration-100',
        'group',
      )}
    >
      {/* Document title + tags */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {doc.starred && (
            <Star
              size={12}
              fill="var(--color-warning)"
              className="text-[var(--color-warning)] shrink-0"
              aria-label="Starred"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-vc-text)] truncate max-w-[280px]">
              {doc.title}
            </p>
            {doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {doc.tags.map((tag) => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    documentId={doc._id}
                    sessionToken={sessionToken}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="py-3 px-4">
        {doc.documentType ? (
          <DocumentTypeBadge type={doc.documentType} />
        ) : (
          <span className="text-xs text-[var(--color-vc-text-tertiary)]">--</span>
        )}
      </td>

      {/* Source */}
      <td className="py-3 px-4">
        <SourceIndicator source={doc.sourceType} />
      </td>

      {/* Pages */}
      <td className="py-3 px-4 text-sm font-[family-name:var(--font-jetbrains)] text-[var(--color-vc-text-secondary)] text-center">
        {doc.pageCount}
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-xs text-[var(--color-vc-text-tertiary)]">
        {formatRelativeTime(doc.createdAt)}
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <DocumentActions doc={doc} sessionToken={sessionToken} />
      </td>
    </tr>
  );
}

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function LibrarySkeleton() {
  return (
    <div className="space-y-4">
      {/* Search + filter bar skeleton */}
      <div className="flex gap-3">
        <Skeleton width={240} height={36} />
        <Skeleton width={160} height={36} />
        <Skeleton width={130} height={36} />
        <Skeleton width={100} height={36} />
      </div>

      {/* Table skeleton */}
      <div className="dash-card space-y-0 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-vc-border)]">
          <Skeleton width={200} height={12} />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-vc-border)] last:border-0"
          >
            <Skeleton width={180} height={14} />
            <Skeleton width={80} height={22} />
            <Skeleton width={40} height={14} />
            <Skeleton width={30} height={14} />
            <Skeleton width={50} height={14} />
            <Skeleton width={120} height={28} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function LibraryPage() {
  const { session, isLoading: sessionLoading } = usePasskey();
  const sessionToken = session?.sessionToken ?? '';

  /* Filter + search state */
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [starredFilter, setStarredFilter] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  /* Determine if searching */
  const isSearching = searchText.trim().length >= 2;

  /* Build query args for list */
  const listArgs = useMemo(() => {
    if (!sessionToken) return 'skip' as const;

    const args: {
      sessionToken: string;
      documentType?: string;
      starred?: boolean;
      sourceType?: string;
      tag?: string;
      limit?: number;
    } = { sessionToken, limit: 100 };

    if (docTypeFilter) args.documentType = docTypeFilter;
    if (starredFilter) args.starred = true;
    if (sourceFilter !== 'all') args.sourceType = sourceFilter;
    if (tagFilter) args.tag = tagFilter;

    return args;
  }, [sessionToken, docTypeFilter, starredFilter, sourceFilter, tagFilter]);

  /* Build query args for search */
  const searchArgs = useMemo(() => {
    if (!sessionToken || !isSearching) return 'skip' as const;
    return { sessionToken, searchText: searchText.trim(), limit: 100 };
  }, [sessionToken, isSearching, searchText]);

  /* Queries */
  const listResult = useQuery(
    api.documentLibrary.listDocuments,
    isSearching ? 'skip' : listArgs,
  ) as LibraryDocument[] | undefined;

  const searchResult = useQuery(
    api.documentLibrary.searchDocuments,
    searchArgs,
  ) as LibraryDocument[] | undefined;

  const documents = isSearching ? searchResult : listResult;

  /* Build document type dropdown options */
  const docTypeOptions = useMemo(() => {
    const entries = Object.entries(DOCUMENT_TYPE_MAP).map(([key, label]) => ({
      value: key,
      label,
    }));
    return [{ value: '', label: 'All Types' }, ...entries];
  }, []);

  /* Build starred filter options */
  const starredOptions = useMemo(
    () => [
      { value: '', label: 'All Documents' },
      { value: 'starred', label: 'Starred Only' },
    ],
    [],
  );

  /* Clear all filters */
  const handleClearFilters = useCallback(() => {
    setSourceFilter('all');
    setDocTypeFilter('');
    setStarredFilter(false);
    setTagFilter('');
    setSearchText('');
  }, []);

  const hasActiveFilters =
    sourceFilter !== 'all' || docTypeFilter || starredFilter || tagFilter || searchText;

  const isLoading = sessionLoading || (!!sessionToken && documents === undefined);

  /* Loading state */
  if (isLoading) {
    return <LibrarySkeleton />;
  }

  const docs = documents ?? [];

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          onClear={() => setSearchText('')}
        />

        <div
          className={cn(
            'flex items-center gap-2',
            'text-[var(--color-vc-text-tertiary)]',
          )}
        >
          <Filter size={14} aria-hidden="true" />
          <span className="mono-label">Filters</span>
        </div>

        <SourceToggle value={sourceFilter} onChange={setSourceFilter} />

        <FilterSelect
          value={docTypeFilter}
          onChange={setDocTypeFilter}
          options={docTypeOptions}
          ariaLabel="Filter by document type"
        />

        <FilterSelect
          value={starredFilter ? 'starred' : ''}
          onChange={(v) => setStarredFilter(v === 'starred')}
          options={starredOptions}
          ariaLabel="Filter by starred"
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
          {docs.length} {docs.length === 1 ? 'document' : 'documents'}
        </span>
      </div>

      {/* Document Table */}
      {docs.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderOpen}
            title="No documents found"
            message={
              hasActiveFilters
                ? 'No documents match your current filters. Try adjusting or clearing filters.'
                : 'Your document library is empty. Once faxes are sent or received, they will be archived here.'
            }
            actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
            onAction={hasActiveFilters ? handleClearFilters : undefined}
          />
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Document library">
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
                {docs.map((doc) => (
                  <DocumentRow
                    key={doc._id}
                    doc={doc}
                    sessionToken={sessionToken}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
