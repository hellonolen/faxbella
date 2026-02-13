import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Privacy Policy - FaxBella',
    description:
        'FaxBella privacy policy. How we collect, use, and protect your data when using our AI-powered fax routing service.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--color-vc-bg)]">
            <MarketingHeader />

            <main className="pt-[72px]">
                {/* ============================================
                    Dark Hero
                   ============================================ */}
                <section className="bg-[var(--color-vc-surface-dark)] py-16 md:py-20">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="accent-line w-12" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                                Legal
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-text-on-dark)] leading-[1.1]">
                            Privacy Policy
                            <span className="text-[var(--color-vc-accent)]">.</span>
                        </h1>

                        <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-vc-text-tertiary)]">
                            Effective Date: February 1, 2026 &middot; Last
                            Updated: February 1, 2026
                        </p>
                    </div>
                </section>

                {/* ============================================
                    Content
                   ============================================ */}
                <section className="py-16 md:py-20 bg-[var(--color-vc-bg)]">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8 leading-relaxed text-[var(--color-vc-text-secondary)]">
                        <p className="text-base leading-relaxed">
                            {SITE_CONFIG.name} (&quot;we,&quot; &quot;us,&quot;
                            or &quot;our&quot;) operates the AI-powered fax
                            routing platform at {SITE_CONFIG.domain} (the
                            &quot;Service&quot;). This Privacy Policy describes
                            how we collect, use, and protect information when
                            you use our Service.
                        </p>

                        {/* 1 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            1. Information We Collect
                        </h2>

                        <h3 className="mt-8 mb-2 text-base font-bold text-[var(--color-vc-primary)]">
                            1.1 Account Information
                        </h3>
                        <p>
                            When you create an account, we collect your email
                            address, name, and payment information (processed
                            securely by our payment processor). We also store
                            passkey authentication credentials for secure,
                            passwordless access to your account.
                        </p>

                        <h3 className="mt-8 mb-2 text-base font-bold text-[var(--color-vc-primary)]">
                            1.2 Fax Content
                        </h3>
                        <p>
                            Incoming faxes are temporarily processed by our AI
                            technology to extract recipient information, document
                            type, urgency level, and structured data. Fax
                            content is stored in encrypted form in our secure
                            database only as long as needed for routing and
                            delivery.
                        </p>

                        <h3 className="mt-8 mb-2 text-base font-bold text-[var(--color-vc-primary)]">
                            1.3 Usage Data
                        </h3>
                        <p>
                            We collect basic usage metrics including fax counts,
                            routing success rates, and dashboard access logs. We
                            do not use third-party analytics trackers.
                        </p>

                        <h3 className="mt-8 mb-2 text-base font-bold text-[var(--color-vc-primary)]">
                            1.4 Fax Provider Credentials
                        </h3>
                        <p>
                            If you provide your own fax provider API
                            credentials, they are stored encrypted in our
                            database and used solely to process your faxes.
                        </p>

                        {/* 2 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                To route incoming faxes to the correct recipient
                                using AI analysis
                            </li>
                            <li>
                                To deliver fax notifications via our email
                                delivery service
                            </li>
                            <li>
                                To process payments and manage your subscription
                            </li>
                            <li>
                                To authenticate you via passkey credentials
                            </li>
                            <li>
                                To provide customer support and respond to
                                inquiries
                            </li>
                            <li>
                                To detect and prevent fraud or abuse of the
                                Service
                            </li>
                        </ul>

                        {/* 3 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            3. AI Processing
                        </h2>
                        <p>
                            {SITE_CONFIG.name} uses AI technology to perform
                            document reading, classification, urgency detection,
                            and structured data extraction on incoming faxes.
                            Our AI processes fax content solely for routing
                            purposes. We do not use your fax content to train AI
                            models. Fax data sent to our AI provider is subject
                            to their data usage policies.
                        </p>

                        {/* 4 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            4. Data Sharing
                        </h2>
                        <p>
                            We do not sell your personal information. We share
                            data only with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>
                                <strong>Our fax provider</strong> &mdash; to
                                receive and send faxes on your behalf
                            </li>
                            <li>
                                <strong>Our AI provider</strong> &mdash; to
                                perform content analysis for fax routing
                            </li>
                            <li>
                                <strong>Our email delivery service</strong>{' '}
                                &mdash; to deliver fax notification emails
                            </li>
                            <li>
                                <strong>Our payment processor</strong> &mdash;
                                to process subscription payments
                            </li>
                            <li>
                                <strong>Our database provider</strong> &mdash;
                                our serverless database and backend
                                infrastructure
                            </li>
                            <li>
                                <strong>Our hosting provider</strong> &mdash;
                                our CDN and content delivery infrastructure
                            </li>
                        </ul>

                        {/* 5 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            5. Data Retention
                        </h2>
                        <p>
                            Fax content and extracted text are retained for 90
                            days after processing, then automatically purged.
                            Account information is retained for the duration of
                            your subscription plus 30 days after cancellation.
                            Payment records are retained as required by law.
                        </p>

                        {/* 6 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            6. Security
                        </h2>
                        <p>
                            We implement industry-standard security measures
                            including encrypted connections, passwordless
                            authentication, content security headers, strict
                            transport security, and encrypted storage of all
                            credentials. All secrets are stored securely in
                            environment variables, never in code.
                        </p>

                        {/* 7 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            7. HIPAA Considerations
                        </h2>
                        <p>
                            {SITE_CONFIG.name} processes faxes that may contain
                            Protected Health Information (PHI). While we
                            implement strong security controls, customers
                            requiring full HIPAA compliance should contact us at{' '}
                            <a
                                href={`mailto:${SITE_CONFIG.supportEmail}`}
                                className="text-[var(--color-vc-accent)] hover:underline"
                            >
                                {SITE_CONFIG.supportEmail}
                            </a>{' '}
                            to discuss a Business Associate Agreement (BAA)
                            before transmitting PHI through the Service.
                        </p>

                        {/* 8 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            8. Your Rights
                        </h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>
                                Access the personal data we hold about you
                            </li>
                            <li>Request correction of inaccurate data</li>
                            <li>
                                Request deletion of your data (subject to legal
                                retention requirements)
                            </li>
                            <li>
                                Export your data in a machine-readable format
                            </li>
                            <li>
                                Withdraw consent for optional processing
                            </li>
                        </ul>

                        {/* 9 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            9. Cookies
                        </h2>
                        <p>
                            {SITE_CONFIG.name} uses only essential cookies for
                            session management and authentication. We do not use
                            advertising or tracking cookies.
                        </p>

                        {/* 10 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            10. Children&apos;s Privacy
                        </h2>
                        <p>
                            {SITE_CONFIG.name} is not intended for use by
                            individuals under 18. We do not knowingly collect
                            information from minors.
                        </p>

                        {/* 11 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            11. Changes to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy periodically. We
                            will notify you of material changes via email or a
                            notice on our website.
                        </p>

                        {/* 12 */}
                        <h2 className="mt-12 mb-4 text-xl font-bold text-[var(--color-vc-primary)]">
                            12. Contact
                        </h2>
                        <p>For privacy inquiries, contact us at:</p>
                        <p className="mt-3">
                            <strong className="text-[var(--color-vc-primary)]">
                                {SITE_CONFIG.name}
                            </strong>
                            <br />
                            Email:{' '}
                            <a
                                href="mailto:privacy@faxbella.com"
                                className="text-[var(--color-vc-accent)] hover:underline"
                            >
                                privacy@faxbella.com
                            </a>
                            <br />
                            Web:{' '}
                            <Link
                                href="/"
                                className="text-[var(--color-vc-accent)] hover:underline"
                            >
                                {SITE_CONFIG.domain}
                            </Link>
                        </p>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}
