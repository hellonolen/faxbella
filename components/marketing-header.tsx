'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import { SITE_CONFIG, NAV_ITEMS, ROUTES } from '@/lib/constants';

export default function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-vc-bg)]/90 backdrop-blur-md border-b border-[var(--color-vc-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <div className="flex flex-col">
            <Link
              href={ROUTES.home}
              className="text-xl font-black tracking-tight text-[var(--color-vc-primary)]"
            >
              {SITE_CONFIG.name}
            </Link>
            <span className="accent-line mt-1 w-8 h-[2px]" />
          </div>

          {/* Desktop Nav + CTA (right-justified) */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-mono uppercase tracking-widest text-[var(--color-vc-text-secondary)] hover:text-[var(--color-vc-accent)] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href={ROUTES.login}
              className="text-sm font-mono uppercase tracking-widest text-[var(--color-vc-text-secondary)] hover:text-[var(--color-vc-accent)] transition-colors duration-200"
            >
              Log In
            </Link>

            <Link
              href={ROUTES.signup}
              className="circular-cta w-11 h-11"
              aria-label="Get started"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-[var(--color-vc-text-secondary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-vc-border)] bg-[var(--color-vc-bg)]">
          <nav className="px-6 py-6 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-mono uppercase tracking-widest text-[var(--color-vc-text-secondary)] hover:text-[var(--color-vc-accent)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={ROUTES.login}
              className="text-sm font-mono uppercase tracking-widest text-[var(--color-vc-text-secondary)] hover:text-[var(--color-vc-accent)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>

            <Link
              href={ROUTES.signup}
              className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] transition-transform hover:scale-[1.03]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
