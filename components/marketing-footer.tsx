import Link from 'next/link';
import { SITE_CONFIG, ROUTES } from '@/lib/constants';

/* ============================================
   Footer Link Columns
   ============================================ */
const PRODUCT_LINKS = [
    { label: 'Features', href: ROUTES.features },
    { label: 'How It Works', href: ROUTES.howItWorks },
    { label: 'Pricing', href: ROUTES.pricing },
    { label: 'Dashboard', href: ROUTES.dashboard },
] as const;

const COMPANY_LINKS = [
    { label: 'Privacy Policy', href: ROUTES.privacy },
    { label: 'Terms of Service', href: ROUTES.terms },
] as const;

export default function MarketingFooter() {
    return (
        <footer className="bg-[var(--color-vc-surface-dark)] border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                {/* ============================================
                    Three-column grid
                   ============================================ */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-16">
                    {/* Column 1 -- Brand */}
                    <div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-[var(--color-vc-text-on-dark)]">
                                {SITE_CONFIG.name}
                            </span>
                            <span
                                className="w-8 h-[2px] bg-[var(--color-vc-accent)] mt-1 rounded-full"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-[var(--color-vc-text-tertiary)] max-w-xs">
                            {SITE_CONFIG.tagline}.{' '}
                            {SITE_CONFIG.description}
                        </p>
                        <p className="mt-6 font-mono text-xs text-[var(--color-vc-text-tertiary)]">
                            &copy; {SITE_CONFIG.year} {SITE_CONFIG.name}. All
                            rights reserved.
                        </p>
                    </div>

                    {/* Column 2 -- Product */}
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)] mb-4">
                            Product
                        </p>
                        <ul className="space-y-3">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 -- Company */}
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)] mb-4">
                            Company
                        </p>
                        <ul className="space-y-3">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a
                                    href={`mailto:${SITE_CONFIG.supportEmail}`}
                                    className="text-sm text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)] transition-colors"
                                >
                                    {SITE_CONFIG.supportEmail}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
