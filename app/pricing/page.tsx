'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  X,
  Shield,
} from 'lucide-react';
import { SITE_CONFIG, PLANS, ROUTES } from '@/lib/constants';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';

/* ============================================
   Types
   ============================================ */

type BillingCycle = 'monthly' | 'annual';

type PlanKey = keyof typeof PLANS;

type PlanEntry = [PlanKey, (typeof PLANS)[PlanKey]];

/* ============================================
   Constants
   ============================================ */

const BILLING_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
];

const PLAN_ORDER: PlanKey[] = ['starter', 'business', 'enterprise'];

const COMPARISON_FEATURES: {
  category: string;
  features: {
    label: string;
    starter: string | boolean;
    business: string | boolean;
    enterprise: string | boolean;
  }[];
}[] = [
  {
    category: 'Volume',
    features: [
      { label: 'Faxes per month', starter: '100', business: '500', enterprise: 'Unlimited' },
      { label: 'Recipients', starter: '5', business: '25', enterprise: 'Unlimited' },
    ],
  },
  {
    category: 'Routing',
    features: [
      { label: 'Smart routing', starter: true, business: true, enterprise: true },
      { label: 'Priority detection', starter: true, business: true, enterprise: true },
      { label: 'Priority routing', starter: false, business: true, enterprise: true },
      { label: 'Custom routing rules', starter: false, business: false, enterprise: true },
    ],
  },
  {
    category: 'Delivery',
    features: [
      { label: 'Email delivery', starter: true, business: true, enterprise: true },
      { label: 'Direct integrations', starter: false, business: true, enterprise: true },
      { label: 'Send faxes', starter: false, business: true, enterprise: true },
    ],
  },
  {
    category: 'Dashboard & Reporting',
    features: [
      { label: 'Dashboard access', starter: true, business: true, enterprise: true },
      { label: 'Fax history & search', starter: true, business: true, enterprise: true },
      { label: 'Export reports', starter: false, business: true, enterprise: true },
      { label: 'Custom analytics', starter: false, business: false, enterprise: true },
    ],
  },
  {
    category: 'Support',
    features: [
      { label: 'Email support', starter: true, business: true, enterprise: true },
      { label: 'Priority support', starter: false, business: true, enterprise: true },
      { label: 'Dedicated account manager', starter: false, business: false, enterprise: true },
      { label: 'Custom onboarding', starter: false, business: false, enterprise: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'Can I change plans anytime?',
    answer:
      'Yes. You can upgrade or downgrade at any time from your billing settings. When you upgrade, the new features are available immediately. When you downgrade, your current plan stays active until the end of your billing cycle.',
  },
  {
    question: 'What happens if I go over my fax limit?',
    answer:
      'We will notify you when you reach 80% and 100% of your monthly limit. Once you hit the limit, incoming faxes are queued and you can upgrade to continue processing immediately. No faxes are lost.',
  },
  {
    question: 'How does annual billing work?',
    answer:
      'Annual billing is charged once per year, upfront. You save up to 20% compared to monthly billing. If you cancel mid-year, your plan stays active through the end of the prepaid period.',
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes. You can upgrade or downgrade at any time from your billing settings. Changes take effect at the start of your next billing period.',
  },
  {
    question: 'How do I cancel?',
    answer:
      'You can cancel anytime from your billing settings. There are no cancellation fees or contracts. Your plan stays active through the end of your current billing period.',
  },
  {
    question: 'Do you offer discounts for nonprofits or community clinics?',
    answer:
      'Yes. We offer special pricing for nonprofits, community health centers, and rural clinics. Contact our team and we will work something out.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) and can arrange invoicing for Enterprise plans.',
  },
  {
    question: 'What if I need more than 500 faxes but fewer than unlimited?',
    answer:
      'Contact us. We can create a custom plan that fits your volume exactly. No need to pay for more than you use.',
  },
];

/* ============================================
   Helper Functions
   ============================================ */

function isFeaturedPlan(plan: (typeof PLANS)[PlanKey]): boolean {
  return 'featured' in plan && Boolean(plan.featured);
}

function getDisplayPrice(price: number): string {
  return price === Infinity ? 'Custom' : `$${price}`;
}

function getAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  return (monthlyPrice - annualPrice) * 12;
}

function getCtaLabel(price: number): string {
  return price === Infinity ? 'Contact Sales' : 'Get Started';
}

function getCtaHref(key: string): string {
  return key === 'enterprise' ? `mailto:${SITE_CONFIG.supportEmail}` : `${ROUTES.signup}?plan=${key}`;
}

/* ============================================
   FAQ Accordion Item
   ============================================ */

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--color-vc-border)]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-1 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-bold text-[var(--color-vc-primary)] pr-8 group-hover:text-[var(--color-vc-accent)] transition-colors duration-200">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border-2 border-[var(--color-vc-border)] flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? 'bg-[var(--color-vc-accent)] border-[var(--color-vc-accent)] rotate-180'
              : 'group-hover:border-[var(--color-vc-accent)]'
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors duration-200 ${
              isOpen ? 'text-white' : 'text-[var(--color-vc-text-tertiary)]'
            }`}
          />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-sm md:text-base text-[var(--color-vc-text-secondary)] leading-relaxed px-1 max-w-2xl">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ============================================
   Comparison Cell Renderer
   ============================================ */

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-4 h-4 text-[var(--color-vc-accent)]" />
    ) : (
      <X className="w-4 h-4 text-[var(--color-vc-border)]" />
    );
  }
  return (
    <span className="text-sm font-medium text-[var(--color-vc-primary)]">
      {value}
    </span>
  );
}

/* ============================================
   Pricing Page
   ============================================ */

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const planEntries = PLAN_ORDER.map(
    (key) => [key, PLANS[key]] as PlanEntry
  );
  const isAnnual = billingCycle === 'annual';

  return (
    <div className="min-h-screen bg-[var(--color-vc-bg)] text-[var(--color-vc-text)] antialiased">
      <MarketingHeader />

      <main className="pt-[72px]">
        {/* ============================================
           HERO (DARK SECTION)
           ============================================ */}
        <section className="relative bg-[var(--color-vc-surface-dark)] overflow-hidden">
          {/* Geometric Background Grid */}
          <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />
          </div>

          {/* Accent glow sphere */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{
              background: 'radial-gradient(circle, var(--color-vc-accent) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            {/* Monospace tag */}
            <div className="flex items-center gap-3 mb-8">
              <span className="accent-line w-12" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                Pricing
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight text-[var(--color-vc-text-on-dark)] max-w-5xl">
              Simple, transparent
              <br />
              pricing
              <span className="text-[var(--color-vc-accent)]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-2xl leading-relaxed">
              No hidden fees. No long-term contracts. Pick the plan that fits your
              office and get started today.
            </p>

            {/* Billing Toggle */}
            <div className="mt-12 flex items-center gap-3">
              <div
                className="inline-flex items-center gap-1 p-1 rounded-full border border-white/[0.08] bg-white/[0.04]"
                role="radiogroup"
                aria-label="Billing cycle"
              >
                {BILLING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={billingCycle === option.value}
                    onClick={() => setBillingCycle(option.value)}
                    className={`font-mono text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all duration-200 ${
                      billingCycle === option.value
                        ? 'bg-[var(--color-vc-accent)] text-white shadow-[var(--shadow-glow-accent)]'
                        : 'text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {isAnnual && (
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-accent)]">
                  Save up to 20%
                </span>
              )}
            </div>

            {/* Bottom accent line */}
            <div className="mt-20 md:mt-28 border-t border-white/[0.06]" />
          </div>
        </section>

        {/* ============================================
           PLAN CARDS
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-surface)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Choose Your Plan
                </span>
                <span className="accent-line w-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                Pick a plan, start routing
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-vc-border)] rounded-xl overflow-hidden shadow-[var(--shadow-xl)]">
              {planEntries.map(([key, plan]) => {
                const featured = isFeaturedPlan(plan);
                const price = isAnnual ? plan.priceAnnual : plan.price;
                const displayPrice = getDisplayPrice(price);
                const priceIsFinite = price !== Infinity;
                const savings = getAnnualSavings(plan.price, plan.priceAnnual);

                return (
                  <article
                    key={key}
                    className={`relative bg-white p-8 md:p-10 flex flex-col ${
                      featured ? 'ring-2 ring-[var(--color-vc-accent)] ring-inset' : ''
                    }`}
                  >
                    {/* Featured badge */}
                    {featured && (
                      <div className="absolute top-0 right-0 bg-[var(--color-vc-accent)] text-white font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-1.5">
                        Most Popular
                      </div>
                    )}

                    {/* Accent line */}
                    <div
                      className={`w-10 h-[3px] rounded-full mb-8 ${
                        featured
                          ? 'bg-[var(--color-vc-accent)]'
                          : 'bg-[var(--color-vc-border)]'
                      }`}
                    />

                    {/* Plan name */}
                    <span className="mono-label">{plan.name}</span>

                    {/* Price */}
                    <div className="mt-4 mb-2">
                      <span className="font-mono text-4xl md:text-5xl font-black text-[var(--color-vc-primary)] tracking-tight">
                        {displayPrice}
                      </span>
                      {priceIsFinite && (
                        <span className="font-mono text-sm text-[var(--color-vc-text-tertiary)] ml-1">
                          /mo
                        </span>
                      )}
                    </div>

                    {/* Annual savings or billing note */}
                    <div className="mb-8 h-6">
                      {isAnnual && priceIsFinite ? (
                        <p className="font-mono text-xs text-[var(--color-vc-accent)] font-bold">
                          Save ${savings} per year
                        </p>
                      ) : priceIsFinite ? (
                        <p className="font-mono text-xs text-[var(--color-vc-text-tertiary)]">
                          Billed monthly
                        </p>
                      ) : (
                        <p className="font-mono text-xs text-[var(--color-vc-text-tertiary)]">
                          Custom pricing for your team
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="flex-1 space-y-3 mb-10">
                      {plan.features.map((feature) => {
                        const displayFeature = feature
                          .replace('AI-powered routing', 'Smart routing')
                          .replace('Email + webhook delivery', 'Email + direct integrations')
                          .replace('API access', 'Full platform access')
                          .replace('Custom integrations', 'Custom integrations')
                          .replace('Custom AI training', 'Custom routing rules');

                        return (
                          <li key={feature} className="flex items-start gap-3">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                featured
                                  ? 'bg-[var(--color-vc-accent)]/[0.08]'
                                  : 'bg-[var(--color-vc-surface)]'
                              }`}
                            >
                              <Check
                                className={`w-3 h-3 ${
                                  featured
                                    ? 'text-[var(--color-vc-accent)]'
                                    : 'text-[var(--color-vc-text-tertiary)]'
                                }`}
                              />
                            </span>
                            <span className="text-sm text-[var(--color-vc-text-secondary)]">
                              {displayFeature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    {featured ? (
                      <Link
                        href={getCtaHref(key)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] hover:scale-[1.03] transition-all duration-200"
                      >
                        {getCtaLabel(price)}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={getCtaHref(key)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[var(--color-vc-border)] text-[var(--color-vc-primary)] font-medium text-sm rounded-full hover:border-[var(--color-vc-primary)] transition-colors duration-200"
                      >
                        {getCtaLabel(price)}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================
           FEATURE COMPARISON TABLE
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Compare Plans
                </span>
                <span className="accent-line w-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                Everything you get, side by side
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Comparison Table — Desktop */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-[var(--color-vc-border)] bg-white shadow-[var(--shadow-lg)]">
              {/* Table Header */}
              <div className="grid grid-cols-4 border-b-2 border-[var(--color-vc-border)]">
                <div className="p-6 bg-[var(--color-vc-surface)]">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                    Features
                  </span>
                </div>
                {planEntries.map(([key, plan]) => {
                  const featured = isFeaturedPlan(plan);
                  return (
                    <div
                      key={key}
                      className={`p-6 text-center ${
                        featured
                          ? 'bg-[var(--color-vc-accent)]/[0.04] border-x-2 border-[var(--color-vc-accent)]'
                          : 'bg-[var(--color-vc-surface)]'
                      }`}
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                        {plan.name}
                      </span>
                      <p className="mt-2 font-mono text-2xl font-black text-[var(--color-vc-primary)]">
                        {getDisplayPrice(isAnnual ? plan.priceAnnual : plan.price)}
                        {plan.price !== Infinity && (
                          <span className="text-sm font-normal text-[var(--color-vc-text-tertiary)]">
                            /mo
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Table Body */}
              {COMPARISON_FEATURES.map((category) => (
                <div key={category.category}>
                  {/* Category header */}
                  <div className="grid grid-cols-4 bg-[var(--color-vc-surface)]">
                    <div className="px-6 py-3 col-span-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-accent)] font-bold">
                        {category.category}
                      </span>
                    </div>
                  </div>

                  {/* Feature rows */}
                  {category.features.map((feature, featureIdx) => (
                    <div
                      key={feature.label}
                      className={`grid grid-cols-4 ${
                        featureIdx < category.features.length - 1
                          ? 'border-b border-[var(--color-vc-border)]'
                          : ''
                      }`}
                    >
                      <div className="px-6 py-4 flex items-center">
                        <span className="text-sm text-[var(--color-vc-text-secondary)]">
                          {feature.label}
                        </span>
                      </div>
                      {(['starter', 'business', 'enterprise'] as PlanKey[]).map((planKey) => {
                        const isBusiness = planKey === 'business';
                        return (
                          <div
                            key={planKey}
                            className={`px-6 py-4 flex items-center justify-center ${
                              isBusiness
                                ? 'bg-[var(--color-vc-accent)]/[0.02] border-x border-[var(--color-vc-accent)]/20'
                                : ''
                            }`}
                          >
                            <ComparisonCell value={feature[planKey]} />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}

              {/* Table Footer — CTAs */}
              <div className="grid grid-cols-4 border-t-2 border-[var(--color-vc-border)]">
                <div className="p-6 bg-[var(--color-vc-surface)]" />
                {planEntries.map(([key, plan]) => {
                  const featured = isFeaturedPlan(plan);
                  const price = isAnnual ? plan.priceAnnual : plan.price;
                  return (
                    <div
                      key={key}
                      className={`p-6 flex items-center justify-center ${
                        featured
                          ? 'bg-[var(--color-vc-accent)]/[0.04] border-x-2 border-b-2 border-[var(--color-vc-accent)] rounded-b-xl'
                          : 'bg-[var(--color-vc-surface)]'
                      }`}
                    >
                      {featured ? (
                        <Link
                          href={getCtaHref(key)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] hover:scale-[1.03] transition-all duration-200"
                        >
                          {getCtaLabel(price)}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href={getCtaHref(key)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[var(--color-vc-border)] text-[var(--color-vc-primary)] font-medium text-sm rounded-full hover:border-[var(--color-vc-primary)] transition-colors duration-200"
                        >
                          {getCtaLabel(price)}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison Table — Mobile (stacked cards) */}
            <div className="md:hidden space-y-6">
              {COMPARISON_FEATURES.map((category) => (
                <div
                  key={category.category}
                  className="rounded-xl border border-[var(--color-vc-border)] bg-white overflow-hidden"
                >
                  {/* Category header */}
                  <div className="px-5 py-3 bg-[var(--color-vc-surface)] border-b border-[var(--color-vc-border)]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-accent)] font-bold">
                      {category.category}
                    </span>
                  </div>

                  {/* Feature rows */}
                  <div className="divide-y divide-[var(--color-vc-border)]">
                    {category.features.map((feature) => (
                      <div key={feature.label} className="px-5 py-4">
                        <p className="text-sm font-medium text-[var(--color-vc-primary)] mb-3">
                          {feature.label}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['starter', 'business', 'enterprise'] as PlanKey[]).map((planKey) => (
                            <div key={planKey} className="text-center">
                              <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)] mb-1">
                                {PLANS[planKey].name}
                              </span>
                              <div className="flex justify-center">
                                <ComparisonCell value={feature[planKey]} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
           TRUST / FLEXIBILITY
           ============================================ */}
        <section className="py-16 md:py-20 bg-[var(--color-vc-surface)] border-y border-[var(--color-vc-border)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-vc-accent)]/[0.08] mb-6">
                <Shield className="w-8 h-8 text-[var(--color-vc-accent)]" />
              </div>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  No Contracts
                </span>
                <span className="accent-line w-12" />
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1] mb-6">
                Cancel anytime, no questions asked
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>

              <p className="text-base text-[var(--color-vc-text-secondary)] leading-relaxed max-w-xl mx-auto">
                No long-term contracts. No cancellation fees. Upgrade, downgrade,
                or cancel from your billing settings whenever you need to.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
           FAQ SECTION
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              {/* Left: Section header */}
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 mb-6">
                  <span className="accent-line w-12" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                    FAQ
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                  Billing questions
                  <span className="text-[var(--color-vc-accent)]">?</span>
                  <br />
                  We have answers
                  <span className="text-[var(--color-vc-accent)]">.</span>
                </h2>
                <p className="mt-6 text-sm text-[var(--color-vc-text-secondary)] leading-relaxed max-w-sm">
                  Can not find what you are looking for? Reach us at{' '}
                  <a
                    href={`mailto:${SITE_CONFIG.supportEmail}`}
                    className="text-[var(--color-vc-accent)] font-medium hover:underline"
                  >
                    {SITE_CONFIG.supportEmail}
                  </a>
                </p>
              </div>

              {/* Right: Accordion */}
              <div className="lg:col-span-8">
                <div className="border-t border-[var(--color-vc-border)]">
                  {FAQ_ITEMS.map((item, idx) => (
                    <FaqItem
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openFaq === idx}
                      onToggle={() =>
                        setOpenFaq(openFaq === idx ? null : idx)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
           FINAL CTA (DARK SECTION)
           ============================================ */}
        <section className="relative bg-[var(--color-vc-surface-dark)] overflow-hidden">
          {/* Geometric Background */}
          <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '120px 120px',
              }}
            />
          </div>

          {/* Accent glow */}
          <div
            className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{
              background: 'radial-gradient(circle, var(--color-vc-accent) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-2xl">
              {/* Monospace tag */}
              <div className="flex items-center gap-3 mb-8">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Get Started
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-vc-text-on-dark)] leading-[1.05]">
                Stop sorting faxes
                <span className="text-[var(--color-vc-accent)]">.</span>
                <br />
                Get started now
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>

              <p className="mt-6 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-md leading-relaxed">
                Setup takes 2 minutes. Cancel anytime.
              </p>

              {/* CTA Row */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href={ROUTES.signup}
                  className="group inline-flex items-center gap-4 px-8 py-4 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_50px_var(--color-vc-accent-glow)]"
                >
                  Get Started
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  href={ROUTES.signup}
                  className="circular-cta w-14 h-14"
                  aria-label="Get started"
                >
                  <ArrowUpRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
