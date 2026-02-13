'use client';

/**
 * Global error boundary for FaxBella.
 * Catches errors in the root layout itself. This is the last resort error UI.
 * Must include its own <html> and <body> tags since the root layout has failed.
 * Uses inline CSS vars since globals.css may not have loaded.
 */

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    /* Inline VC design tokens -- globals may not load */
                    '--color-vc-bg': '#faf8f5',
                    '--color-vc-primary': '#2c2c2c',
                    '--color-vc-accent': '#e8553d',
                    '--color-vc-surface': '#f2efeb',
                    '--color-vc-text-secondary': '#5a5a5a',
                    '--color-vc-text-tertiary': '#999999',
                    '--color-vc-border': '#e4e0db',

                    margin: 0,
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#faf8f5',
                    color: '#2c2c2c',
                    padding: 24,
                } as React.CSSProperties}
            >
                <div
                    style={{
                        textAlign: 'center',
                        maxWidth: 480,
                        background: 'white',
                        border: '1px solid #e4e0db',
                        borderRadius: 16,
                        borderTop: '3px solid #e8553d',
                        padding: '40px 32px',
                    }}
                >
                    {/* Accent line */}
                    <div
                        style={{
                            width: 48,
                            height: 3,
                            background: '#e8553d',
                            borderRadius: 2,
                            margin: '0 auto 24px',
                        }}
                        aria-hidden="true"
                    />

                    {/* Monospace label */}
                    <p
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: '#999999',
                            marginBottom: 12,
                        }}
                    >
                        Critical Error
                    </p>

                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: '#2c2c2c' }}>
                        Something went wrong
                    </h1>

                    <p style={{ color: '#5a5a5a', marginBottom: 8, lineHeight: 1.6, fontSize: 14 }}>
                        FaxBella encountered a critical error. Your fax routing is not affected
                        -- faxes continue to be processed in the background.
                    </p>

                    {error.digest && (
                        <p
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 11,
                                color: '#999999',
                                marginBottom: 24,
                            }}
                        >
                            Error ID: {error.digest}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                        <button
                            onClick={reset}
                            style={{
                                background: '#e8553d',
                                color: 'white',
                                border: 'none',
                                padding: '12px 28px',
                                borderRadius: 9999,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 8px 40px rgba(232, 85, 61, 0.35)',
                            }}
                        >
                            Try Again
                        </button>
                        <a
                            href="/"
                            style={{
                                background: '#f2efeb',
                                color: '#2c2c2c',
                                border: 'none',
                                padding: '12px 28px',
                                borderRadius: 9999,
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            Reload Page
                        </a>
                    </div>

                    <p style={{ marginTop: 40, fontSize: 12, color: '#999999' }}>
                        FaxBella | faxbella.com
                    </p>
                </div>
            </body>
        </html>
    );
}
