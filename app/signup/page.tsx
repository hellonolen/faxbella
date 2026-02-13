'use client';

import { Suspense, useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Fingerprint, AlertCircle } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { usePasskey } from '@/hooks/use-passkey';
import { useSessionSync } from '@/hooks/use-session-sync';
import { ROUTES, SITE_CONFIG } from '@/lib/constants';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[var(--color-vc-bg)] text-[var(--color-vc-text)] antialiased">
          <MarketingHeader />
          <main className="pt-[72px] flex-1">
            <div className="relative h-[200px] bg-[var(--color-vc-surface-dark)]" />
          </main>
          <MarketingFooter />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const {
    register,
    session,
    isLoading,
    error,
    isAuthenticated,
    isSupported,
  } = usePasskey();

  useSessionSync();

  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && session) {
      router.replace(ROUTES.dashboard);
    }
  }, [isAuthenticated, session, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      const result = await register(email, displayName || undefined);

      if (result?.success) {
        if (plan) {
          // User came from pricing page with a plan — redirect to Stripe checkout
          try {
            const checkoutResult = await createCheckout({
              email,
              plan,
              billingCycle: 'monthly',
              successUrl: `${window.location.origin}/dashboard?payment=success`,
              cancelUrl: `${window.location.origin}/dashboard`,
            });
            if (checkoutResult?.checkoutUrl) {
              window.location.href = checkoutResult.checkoutUrl;
              return;
            }
          } catch {
            // If checkout fails, still go to dashboard
          }
        }
        router.replace(ROUTES.dashboard);
      }
    } catch {
      // Error is captured by usePasskey hook
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-vc-bg)] text-[var(--color-vc-text)] antialiased">
      <MarketingHeader />

      <main className="pt-[72px] flex-1">
        {/* Dark top section with geometric grid */}
        <div
          className="relative h-[200px] bg-[var(--color-vc-surface-dark)] overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(232, 85, 61, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232, 85, 61, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        >
          {/* Subtle accent glow in corner */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--color-vc-accent)' }}
            aria-hidden="true"
          />
        </div>

        {/* Auth card overlapping the dark section */}
        <div className="flex justify-center px-4 pb-20">
          <div
            className="relative w-full max-w-md -mt-16 rounded-xl shadow-xl"
            style={{
              background: 'white',
              border: '1px solid var(--color-vc-border)',
            }}
          >
          {/* Accent line at top of card */}
          <div
            className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full"
            style={{ background: 'var(--color-vc-accent)' }}
            aria-hidden="true"
          />

          <div className="px-8 pt-10 pb-10">
            {/* Logo / Brand */}
            <div className="mb-8 text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: 'var(--color-vc-accent)',
                  boxShadow: 'var(--shadow-glow-accent)',
                }}
              >
                <Fingerprint className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h1
                className="text-2xl font-black tracking-tight"
                style={{ color: 'var(--color-vc-text)' }}
              >
                Get started
              </h1>
              <p
                className="mt-1 text-sm"
                style={{ color: 'var(--color-vc-text-secondary)' }}
              >
                Create your {SITE_CONFIG.name} account
              </p>
            </div>

            {/* WebAuthn not supported warning */}
            {!isSupported && (
              <div
                className="flex items-start gap-3 rounded-lg p-3 mb-6 text-sm"
                style={{
                  background: 'var(--color-warning-light)',
                  color: 'var(--color-warning)',
                }}
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Passkeys are not supported in this browser. Please use a
                  modern browser such as Chrome, Safari, or Edge.
                </span>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div
                className="flex items-start gap-3 rounded-lg p-3 mb-6 text-sm"
                style={{
                  background: 'var(--color-error-light)',
                  color: 'var(--color-error)',
                }}
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Signup form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="signup-display-name"
                  className="mono-label block mb-2"
                >
                  First name
                </label>
                <input
                  id="signup-display-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Sarah"
                  disabled={isLoading || !isSupported}
                  className="
                    w-full px-4 py-3 rounded-lg text-sm
                    transition-shadow duration-150
                    placeholder:text-vc-text-tertiary
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus-ring
                  "
                  style={{
                    background: 'var(--color-vc-bg)',
                    border: '1px solid var(--color-vc-border)',
                    color: 'var(--color-vc-text)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mono-label block mb-2"
                >
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email webauthn"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  disabled={isLoading || !isSupported}
                  className="
                    w-full px-4 py-3 rounded-lg text-sm
                    transition-shadow duration-150
                    placeholder:text-vc-text-tertiary
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus-ring
                  "
                  style={{
                    background: 'var(--color-vc-bg)',
                    border: '1px solid var(--color-vc-border)',
                    color: 'var(--color-vc-text)',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !isSupported}
                className="
                  flex items-center justify-center gap-2
                  w-full py-3 rounded-full text-sm font-medium text-white
                  transition-all duration-200
                  hover:brightness-110
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                style={{
                  background: 'var(--color-vc-accent)',
                  boxShadow: 'var(--shadow-glow-accent)',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    Create Account with Passkey
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p
              className="mt-8 text-center text-sm"
              style={{ color: 'var(--color-vc-text-secondary)' }}
            >
              Already have an account?{' '}
              <Link
                href={ROUTES.login}
                className="font-medium transition-colors duration-150 hover:underline"
                style={{ color: 'var(--color-vc-accent)' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
