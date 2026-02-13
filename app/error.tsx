'use client';

/**
 * Error boundary page for FaxBella.
 * Catches runtime errors in route segments and displays a recovery UI.
 */

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[FaxBella] Unhandled error:', error);
    }, [error]);

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-vc-bg)',
                padding: 24,
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    maxWidth: 480,
                    background: 'white',
                    border: '1px solid var(--color-vc-border)',
                    borderRadius: 16,
                    borderTop: '3px solid var(--color-vc-accent)',
                    padding: '40px 32px',
                }}
            >
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

                {/* Monospace label */}
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
                    Error
                </p>

                <h1
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        marginBottom: 12,
                        color: 'var(--color-vc-primary)',
                    }}
                >
                    Something went wrong
                </h1>

                <p
                    style={{
                        color: 'var(--color-vc-text-secondary)',
                        marginBottom: 8,
                        lineHeight: 1.6,
                        fontSize: 14,
                    }}
                >
                    An unexpected error occurred while processing your request.
                </p>

                {error.digest && (
                    <p
                        style={{
                            fontFamily: 'var(--font-jetbrains), monospace',
                            fontSize: 11,
                            color: 'var(--color-vc-text-tertiary)',
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
                            background: 'var(--color-vc-accent)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 28px',
                            borderRadius: 9999,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 8px 40px rgba(232, 85, 61, 0.35)',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        style={{
                            background: 'var(--color-vc-surface)',
                            color: 'var(--color-vc-primary)',
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
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
