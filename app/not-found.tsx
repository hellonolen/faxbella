/**
 * Custom 404 Not Found page for FaxBella.
 */

import Link from 'next/link';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';

export default function NotFound() {
    return (
        <>
            <MarketingHeader />
            <main
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-vc-bg)',
                    padding: 24,
                }}
            >
                <div style={{ textAlign: 'center', maxWidth: 480 }}>
                    {/* Accent line */}
                    <div
                        style={{
                            width: 48,
                            height: 3,
                            background: 'var(--color-vc-accent)',
                            borderRadius: 2,
                            margin: '0 auto 24px',
                        }}
                        aria-hidden="true"
                    />

                    {/* Monospace 404 label */}
                    <p
                        style={{
                            fontFamily: 'var(--font-jetbrains), monospace',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--color-vc-text-tertiary)',
                            marginBottom: 12,
                        }}
                    >
                        404
                    </p>

                    <h1
                        style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            marginBottom: 12,
                            color: 'var(--color-vc-primary)',
                        }}
                    >
                        Page not found
                    </h1>

                    <p
                        style={{
                            color: 'var(--color-vc-text-secondary)',
                            marginBottom: 32,
                            lineHeight: 1.6,
                        }}
                    >
                        The page you are looking for does not exist or has been moved.
                        If you believe this is an error, please contact support@faxbella.com.
                    </p>

                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--color-vc-accent)',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: 9999,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 8px 40px rgba(232, 85, 61, 0.35)',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
            <MarketingFooter />
        </>
    );
}
