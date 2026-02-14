'use client';

import { type ElementType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Send,
  SendHorizontal,
  FolderOpen,
  Workflow,
  ListChecks,
  Users,
  Settings,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DASHBOARD_NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';

/* ----------------------------------------
   Icon Map
   ---------------------------------------- */

const ICON_MAP: Record<string, ElementType> = {
  LayoutDashboard,
  Inbox,
  Send,
  SendHorizontal,
  FolderOpen,
  Workflow,
  ListChecks,
  Users,
  Settings,
  CreditCard,
};

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface DashboardSidebarProps {
  activePath?: string;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function DashboardSidebar({
  onLogout,
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  }

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <h1
            className={cn(
              'font-[family-name:var(--font-inter)]',
              'text-lg font-black tracking-tight',
              'text-[var(--color-vc-text-on-dark)]',
            )}
          >
            {SITE_CONFIG.name}
          </h1>
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)] transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <span className="accent-line mt-3" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-0.5">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = isActive(item.href);
            const isSendFax = item.href === '/dashboard/send';

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3',
                    'px-3 py-2.5 rounded-[var(--radius-md)]',
                    'font-[family-name:var(--font-jetbrains)]',
                    'text-xs uppercase tracking-[0.15em]',
                    'transition-all duration-150 ease-out',
                    active
                      ? 'text-[var(--color-vc-text-on-dark)] bg-white/[0.06] border-l-[3px] border-l-[var(--color-vc-accent)]'
                      : isSendFax
                        ? 'text-[var(--color-vc-accent)] bg-[rgba(232,85,61,0.08)] border-l-[3px] border-l-[var(--color-vc-accent)] hover:bg-[rgba(232,85,61,0.12)]'
                        : 'text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)] hover:bg-white/[0.03] border-l-[3px] border-l-transparent',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {Icon && <Icon size={16} aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={onLogout}
          className={cn(
            'flex items-center gap-3 w-full',
            'px-3 py-2.5 rounded-[var(--radius-md)]',
            'font-[family-name:var(--font-jetbrains)]',
            'text-xs uppercase tracking-[0.15em]',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:text-[var(--color-vc-accent)]',
            'transition-colors duration-150 ease-out',
            'cursor-pointer',
          )}
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col',
          'fixed left-0 top-0 bottom-0',
          'w-[240px]',
          'bg-[var(--color-vc-surface-dark)]',
          'border-r border-white/[0.06]',
          'z-40',
        )}
      >
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside
            className={cn(
              'fixed left-0 top-0 bottom-0',
              'w-[280px]',
              'bg-[var(--color-vc-surface-dark)]',
              'z-50 lg:hidden',
              'shadow-xl',
            )}
          >
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
