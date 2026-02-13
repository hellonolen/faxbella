'use client';

import Link from 'next/link';
import { Menu, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface DashboardTopbarProps {
  title: string;
  email?: string;
  currentPath?: string;
  onMenuClick: () => void;
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function DashboardTopbar({
  title,
  email,
  currentPath,
  onMenuClick,
}: DashboardTopbarProps) {
  const showSendFax = currentPath !== '/dashboard/send';
  return (
    <header
      className={cn(
        'flex items-center justify-between',
        'h-16 px-6',
        'bg-white',
        'border-b border-[var(--color-vc-border)]',
      )}
    >
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className={cn(
            'lg:hidden',
            'flex items-center justify-center',
            'w-9 h-9 rounded-[var(--radius-md)]',
            'text-[var(--color-vc-text-secondary)]',
            'hover:bg-[var(--color-vc-surface)]',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h2
          className={cn(
            'font-[family-name:var(--font-inter)]',
            'font-bold text-xl',
            'text-[var(--color-vc-primary)]',
          )}
        >
          {title}
        </h2>
      </div>

      {/* Right: send fax CTA + user email */}
      <div className="flex items-center gap-3">
        {showSendFax && (
          <Link
            href="/dashboard/send"
            className={cn(
              'hidden sm:inline-flex items-center gap-1.5',
              'bg-[var(--color-vc-accent)] text-white',
              'rounded-full px-4 py-1.5',
              'text-xs font-medium',
              'hover:brightness-110',
              'transition-all duration-150',
            )}
          >
            <Send size={14} aria-hidden="true" />
            Send Fax
          </Link>
        )}

        {email && (
          <span
            className={cn(
              'hidden sm:inline-block',
              'font-[family-name:var(--font-jetbrains)]',
              'text-xs',
              'text-[var(--color-vc-text-secondary)]',
              'bg-[var(--color-vc-surface)]',
              'rounded-full',
              'px-3 py-1',
            )}
          >
            {email}
          </span>
        )}
      </div>
    </header>
  );
}
