'use client';

import { useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { usePasskey } from '@/hooks/use-passkey';
import { useSessionSync } from '@/hooks/use-session-sync';
import { PageLoader } from '@/components/ui/loading';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardTopbar } from '@/components/dashboard-topbar';
import { DASHBOARD_NAV_ITEMS, ROUTES } from '@/lib/constants';

/* ----------------------------------------
   Page title from pathname
   ---------------------------------------- */

function getPageTitle(pathname: string): string {
  const matched = DASHBOARD_NAV_ITEMS.find((item) => {
    if (item.href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(item.href);
  });
  return matched?.label ?? 'Dashboard';
}

/* ----------------------------------------
   Layout
   ---------------------------------------- */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading, isAuthenticated, logout } = usePasskey();
  useSessionSync();

  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push(ROUTES.login);
  }, [logout, router]);

  const handleMenuClick = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  /* Show loading only during initial session check */
  if (isLoading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-vc-bg)]">
      <DashboardSidebar
        activePath={pathname}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main content area */}
      <div className="lg:ml-[240px] min-h-screen flex flex-col">
        <DashboardTopbar
          title={pageTitle}
          email={isAuthenticated ? session?.email : 'demo@faxbella.com'}
          currentPath={pathname}
          onMenuClick={handleMenuClick}
        />

        {/* Demo mode banner */}
        {!isAuthenticated && (
          <div className="px-6 pt-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] bg-[rgba(232,85,61,0.06)] border border-[rgba(232,85,61,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-vc-accent)] animate-pulse" />
              <p className="text-xs text-[var(--color-vc-text-secondary)]">
                <span className="font-semibold text-[var(--color-vc-accent)]">Sample data</span>
                {' \u2014 '}
                This is a preview with demo content. Sign in to see your real faxes.
              </p>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 pb-24 sm:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile floating "Send Fax" button — visible only on small screens, hidden on send page */}
      {pathname !== ROUTES.send && (
        <Link
          href={ROUTES.send}
          className="fixed bottom-6 right-6 z-50 sm:hidden inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-vc-accent)] text-white text-sm font-medium shadow-[0_4px_20px_rgba(232,85,61,0.4)] hover:brightness-110 active:scale-95 transition-all duration-200"
          aria-label="Send a fax"
        >
          <Send size={16} aria-hidden="true" />
          Send Fax
        </Link>
      )}
    </div>
  );
}
