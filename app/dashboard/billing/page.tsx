'use client';

import { useState, useCallback } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Check, ExternalLink } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useDashboard } from '@/hooks/use-dashboard';
import { usePasskey } from '@/hooks/use-passkey';
import { PLANS } from '@/lib/constants';
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
   Plan keys in display order
   ---------------------------------------- */

const PLAN_KEYS = ['starter', 'business', 'enterprise'] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

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
          <Skeleton height={12} className="w-full" />
        </div>
      </Card>
      <Card>
        <div className="space-y-4">
          <Skeleton width={120} height={14} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={180} className="w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------------------
   Progress Bar
   ---------------------------------------- */

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const isUnlimited = !isFinite(limit);
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
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
          {used} / {isUnlimited ? 'Unlimited' : limit}
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--color-vc-surface)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: isUnlimited ? '0%' : `${percentage}%`,
            background: isHigh ? 'var(--color-warning)' : 'var(--color-vc-accent)',
          }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Plan Card
   ---------------------------------------- */

function PlanCard({
  planKey,
  isCurrent,
  currentPlanKey,
  onUpgrade,
  onDowngrade,
  isLoading,
}: {
  planKey: PlanKey;
  isCurrent: boolean;
  currentPlanKey: PlanKey;
  onUpgrade: (plan: PlanKey) => void;
  onDowngrade: () => void;
  isLoading: boolean;
}) {
  const plan = PLANS[planKey];
  const currentIndex = PLAN_KEYS.indexOf(currentPlanKey);
  const thisIndex = PLAN_KEYS.indexOf(planKey);
  const isUpgrade = thisIndex > currentIndex;
  const isDowngrade = thisIndex < currentIndex;
  const isUnlimited = !isFinite(plan.price);

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border p-5 transition-all duration-200',
        isCurrent
          ? 'border-[var(--color-vc-accent)] bg-[rgba(232,85,61,0.03)]'
          : 'border-[var(--color-vc-border)] bg-white hover:border-[var(--color-vc-text-tertiary)]',
      )}
    >
      {/* Plan name */}
      <p className="mono-label mb-2">{plan.name}</p>

      {/* Price */}
      <p className="flex items-baseline gap-1 mb-4">
        <span className="font-[family-name:var(--font-jetbrains)] text-2xl font-black text-[var(--color-vc-text)]">
          ${isUnlimited ? '299' : plan.price}
        </span>
        <span className="text-xs text-[var(--color-vc-text-tertiary)]">/mo</span>
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-5">
        {plan.features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs text-[var(--color-vc-text-secondary)]">
            <Check
              size={14}
              className="mt-0.5 shrink-0"
              style={{ color: isCurrent ? 'var(--color-vc-accent)' : 'var(--color-vc-text-tertiary)' }}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <div
          className="status-badge w-full justify-center"
          style={{
            color: 'var(--color-vc-accent)',
            background: 'rgba(232, 85, 61, 0.08)',
          }}
        >
          Current Plan
        </div>
      ) : (
        <Button
          variant={isUpgrade ? 'primary' : 'ghost'}
          size="sm"
          className="w-full"
          onClick={() => isUpgrade ? onUpgrade(planKey) : onDowngrade()}
          loading={isLoading}
        >
          {isUpgrade && <ArrowUpRight size={14} aria-hidden="true" />}
          {isDowngrade && <ArrowDownRight size={14} aria-hidden="true" />}
          {isUpgrade ? 'Upgrade' : 'Downgrade'}
        </Button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function BillingPage() {
  const { data, isLoading: dashLoading } = useDashboard();
  const { isAuthenticated } = usePasskey();
  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const createPortal = useAction(api.stripe.createBillingPortalSession);

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

  /* Create Stripe checkout for upgrade */
  const handleUpgrade = useCallback(async (plan: PlanKey) => {
    if (isDemo) {
      setDemoMessage('Sign in to upgrade your plan');
      return;
    }
    if (!data?.customer.email) return;

    setIsCheckoutLoading(true);
    try {
      const result = await createCheckout({
        email: data.customer.email,
        plan,
        billingCycle: 'monthly',
        successUrl: `${window.location.origin}/dashboard/billing?payment=success`,
        cancelUrl: `${window.location.origin}/dashboard/billing`,
      });
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch {
      setIsCheckoutLoading(false);
    }
  }, [isDemo, data, createCheckout]);

  /* Downgrade via billing portal */
  const handleDowngrade = useCallback(async () => {
    if (isDemo) {
      setDemoMessage('Sign in to manage your plan');
      return;
    }
    await handleManageBilling();
  }, [isDemo, handleManageBilling]);

  if (dashLoading || !data) {
    return <BillingSkeleton />;
  }

  const { customer } = data;
  const planKey = (customer.plan?.toLowerCase() ?? 'starter') as PlanKey;
  const planStatus = STATUS_STYLES[customer.planStatus] ?? STATUS_STYLES.active;

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
              {PLANS[planKey]?.name ?? customer.plan}
            </p>
            <p className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-[var(--color-vc-text)]">
                ${PLANS[planKey]?.price ?? '--'}
              </span>
              <span className="text-xs text-[var(--color-vc-text-tertiary)]">/month</span>
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
            {customer.planStatus === 'active' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleManageBilling}
                loading={isPortalLoading}
              >
                <ExternalLink size={14} aria-hidden="true" />
                Manage Billing
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
          <p className="mono-label">Usage This Month</p>
        </div>
        <div className="space-y-5">
          <UsageBar
            used={customer.faxesThisMonth}
            limit={customer.faxesLimit}
            label="Faxes"
          />
          <UsageBar
            used={data.recipientsCount}
            limit={customer.recipientLimit}
            label="Recipients"
          />
        </div>
      </Card>

      {/* All Plans */}
      <Card>
        <p className="mono-label mb-4">All Plans</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAN_KEYS.map((key) => (
            <PlanCard
              key={key}
              planKey={key}
              isCurrent={key === planKey}
              currentPlanKey={planKey}
              onUpgrade={handleUpgrade}
              onDowngrade={handleDowngrade}
              isLoading={isCheckoutLoading || isPortalLoading}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
