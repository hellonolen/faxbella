'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
}

interface TableHeaderProps {
  columns: Column[];
  className?: string;
}

interface TableRowProps {
  columns: Column[];
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function buildGridTemplate(columns: Column[]): string {
  return columns.map((col) => col.width ?? '1fr').join(' ');
}

export function TableHeader({ columns, className }: TableHeaderProps) {
  const gridTemplate = buildGridTemplate(columns);

  return (
    <div
      className={cn(
        'grid items-center px-4 py-3',
        'bg-[var(--color-vc-surface)]',
        'border-b border-[var(--color-vc-border)]',
        className,
      )}
      style={{ gridTemplateColumns: gridTemplate }}
      role="row"
    >
      {columns.map((col) => (
        <span
          key={col.key}
          className={cn(
            'font-mono text-[10px] uppercase tracking-[0.15em]',
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

export function TableRow({ columns, children, onClick, className }: TableRowProps) {
  const gridTemplate = buildGridTemplate(columns);

  return (
    <div
      className={cn(
        'grid items-center px-4 py-3',
        'border-b border-[var(--color-vc-border)] last:border-b-0',
        'transition-colors duration-150 ease-out',
        'hover:bg-[var(--color-vc-surface)]',
        onClick && 'cursor-pointer',
        className,
      )}
      style={{ gridTemplateColumns: gridTemplate }}
      role="row"
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function DataTable<T>({
  columns,
  data,
  renderRow,
  onRowClick,
  emptyMessage = 'No data to display',
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'border border-[var(--color-vc-border)]',
        'rounded-[var(--radius-lg)]',
        'overflow-hidden bg-white',
        className,
      )}
      role="table"
    >
      <TableHeader columns={columns} />

      <div role="rowgroup">
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-12 px-4">
            <p className="font-mono text-xs text-[var(--color-vc-text-tertiary)]">
              {emptyMessage}
            </p>
          </div>
        ) : (
          data.map((item, index) => (
            <TableRow
              key={index}
              columns={columns}
              onClick={onRowClick ? () => onRowClick(item, index) : undefined}
            >
              {renderRow(item, index)}
            </TableRow>
          ))
        )}
      </div>
    </div>
  );
}
