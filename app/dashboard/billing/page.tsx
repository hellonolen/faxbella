'use client';

import { useState, useCallback } from 'react';
import { CreditCard, ExternalLink, Info } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useDashboard } from '@/hooks/use-dashboard';
import { usePasskey } from '@/hooks/use-passkey';
import { PLAN, DAY_PASS } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

/* ----------------------------------------
   Status Badge Styles
   ---------------------------------------- */

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  canceled: { label: 'Canceled', color: 'var(--color-error)', bg: 'var(--color-error-light)' },
  past_due: { label: 'Past Due', color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
};

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <Card accent>
        <div className="space-y-4">
          <Skeleton width={120} height={14} />
          <Skeleton width={200} height={32} />
          <Skeleton width={160} height={14} />
        </div>
      </Card>
      <Card>
        <div className="space-y-4">
          <Skeleton width={100} height={14} />
          <Skeleton height={12} className="w-full" />
        </div>
      </Card>
      <Card>
        <div className="space-y-4">
          <Skeleton width={180} height={14} />
          <Skeleton height={48} className="w-full" />
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------------------
   Progress Bar
   ---------------------------------------- */

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isHigh = percentage >= 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="mono-label">{label}</span>
        <span
          className={cn(
            'font-[family-name:var(--font-jetbrains)] text-xs font-medium',
            isHigh ? 'text-[var(--color-warning)]' : 'text-[var(--color-vc-text-secondary)]',
          )}
        >
          {used} / {limit}
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--color-vc-surface)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: isHigh ? 'var(--color-warning)' : 'var(--color-vc-accent)',
          }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function BillingPage() {
  const { data, isLoading: dashLoading } = useDashboard();
  const { isAuthenticated } = usePasskey();
  const createPortal = useAction(api.stripe.createBillingPortalSession);
  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

  const isDemo = !isAuthenticated;

  /* Open Stripe billing portal */
  const handleManageBilling = useCallback(async () => {
    if (isDemo) {
      setDemoMessage('Sign in to manage billing');
      return;
    }
    if (!data?.customer.email) return;

    setIsPortalLoading(true);
    try {
      const result = await createPortal({
        email: data.customer.email,
        returnUrl: `${window.location.origin}/dashboard/billing`,
      });
      if (result?.portalUrl) {
        window.location.href = result.portalUrl;
      }
    } catch {
      setIsPortalLoading(false);
    }
  }, [isDemo, data, createPortal]);

  /* Subscribe to a plan */
  const handleSubscribe = useCallback(
    async (plan: 'standard' | 'daypass') => {
      if (isDemo) {
        setDemoMessage('Sign in to subscribe');
        return;
      }
      if (!data?.customer.email) return;

      setIsCheckoutLoading(true);
      try {
        const result = await createCheckout({
          email: data.customer.email,
          plan,
          billingCycle: plan === 'daypass' ? 'one_time' : 'monthly',
          successUrl: `${window.location.origin}/dashboard/billing?payment=success`,
          cancelUrl: `${window.location.origin}/dashboard/billing`,
        });
        if (result?.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        }
      } catch {
        setIsCheckoutLoading(false);
      }
    },
    [isDemo, data, createCheckout],
  );

  if (dashLoading || !data) {
    return <BillingSkeleton />;
  }

  const { customer } = data;
  const planStatus = STATUS_STYLES[customer.planStatus] ?? STATUS_STYLES.active;
  const isSubscribed = customer.planStatus === 'active';
  const isDayPass = customer.plan === 'daypass';

  const planName = isDayPass ? DAY_PASS.name : PLAN.name;
  const planPrice = isDayPass ? DAY_PASS.price : PLAN.price;
  const planPeriod = isDayPass ? '/day' : '/month';
  const planSubline = isDayPass
    ? `${DAY_PASS.faxBlock} documents \u00B7 ${DAY_PASS.duration} window`
    : `${PLAN.faxBlock} faxes included`;
  const usageLimit = isDayPass ? DAY_PASS.faxBlock : PLAN.faxBlock;
  const usageLabel = isDayPass ? 'Documents' : 'Faxes';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Demo message toast */}
      {demoMessage && (
        <div
          role="alert"
          className={cn(
            'flex items-center justify-between gap-3 p-3',
            'bg-[var(--color-warning-light)]',
            'border border-[var(--color-warning)]',
            'rounded-[var(--radius-md)]',
            'text-sm text-[var(--color-warning)]',
          )}
        >
          <span>{demoMessage}</span>
          <button
            onClick={() => setDemoMessage('')}
            className="text-[var(--color-warning)] hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      {/* Current Plan Card */}
      <Card accent>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="mono-label mb-2">Current Plan</p>
            <p className="font-[family-name:var(--font-jetbrains)] text-2xl font-black text-[var(--color-vc-text)] leading-none mb-2">
              {planName}
            </p>
            <p className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-[var(--color-vc-text)]">
                ${planPrice}
              </span>
              <span className="text-xs text-[var(--color-vc-text-tertiary)]">{planPeriod}</span>
            </p>
            <p className="text-xs text-[var(--color-vc-text-tertiary)] mt-1">
              {planSubline}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="status-badge"
              style={{ color: planStatus.color, background: planStatus.bg }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: planStatus.color }}
                aria-hidden="true"
              />
              {planStatus.label}
            </div>
            {isSubscribed ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleManageBilling}
                loading={isPortalLoading}
              >
                <ExternalLink size={14} aria-hidden="true" />
                Manage Billing
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubscribe('standard')}
                loading={isCheckoutLoading}
              >
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Usage Section */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <CreditCard
            size={16}
            className="text-[var(--color-vc-text-tertiary)]"
            aria-hidden="true"
          />
          <p className="mono-label">{isDayPass ? 'Usage This Session' : 'Usage This Month'}</p>
        </div>
        <div className="space-y-5">
          <UsageBar
            used={customer.faxesThisMonth}
            limit={usageLimit}
            label={usageLabel}
          />
          {!isDayPass && (
            <div className="flex items-center justify-between">
              <span className="mono-label">Recipients</span>
              <span className="font-[family-name:var(--font-jetbrains)] text-xs font-medium text-[var(--color-vc-text-secondary)]">
                {data.recipientsCount} / Unlimited
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Auto-Expand Info */}
      <Card>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex items-center justify-center shrink-0',
              'w-8 h-8 rounded-full',
              'bg-[var(--color-vc-surface)]',
            )}
          >
            <Info
              size={16}
              className="text-[var(--color-vc-accent)]"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-vc-text)] mb-1">
              Auto-Expand
            </p>
            <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed">
              {isDayPass
                ? `When you exceed ${DAY_PASS.faxBlock} documents, we auto-add another ${DAY_PASS.faxBlock}-doc block for $${DAY_PASS.price}.`
                : `When you exceed ${PLAN.faxBlock} faxes, we automatically add another ${PLAN.faxBlock}-fax block for $${PLAN.price}.`}{' '}
              You only pay for what you need.
            </p>
          </div>
        </div>
      </Card>

      {/* Upgrade CTA for Day Pass users */}
      {isDayPass && isSubscribed && (
        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-[var(--color-vc-text)] mb-1">
                Upgrade to Membership
              </p>
              <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed">
                Get the full membership for ${PLAN.price}/mo &mdash; {PLAN.faxBlock} faxes, all features.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSubscribe('standard')}
              loading={isCheckoutLoading}
            >
              Upgrade to Membership
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
