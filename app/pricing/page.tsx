'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Shield,
  Layers,
  TrendingUp,
  Calculator,
  Clock,
} from 'lucide-react';
import { SITE_CONFIG, PLAN, DAY_PASS, ROUTES } from '@/lib/constants';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';

/* ============================================
   Constants
   ============================================ */

const AUTO_EXPAND_TABLE = [
  { range: '1 - 1,000', blocks: 1, cost: '$55' },
  { range: '1,001 - 2,000', blocks: 2, cost: '$110' },
  { range: '2,001 - 3,000', blocks: 3, cost: '$165' },
];

const DAYPASS_EXPAND_TABLE = [
  { range: '1 - 5', blocks: 1, cost: '$9' },
  { range: '6 - 10', blocks: 2, cost: '$18' },
  { range: '11 - 15', blocks: 3, cost: '$27' },
];

const AUTO_EXPAND_STEPS = [
  {
    icon: Layers,
    title: 'You get 1,000 faxes every month',
    description:
      'Your membership includes 1,000 faxes per billing cycle. Send, receive, and route all of them with AI.',
  },
  {
    icon: TrendingUp,
    title: 'Exceed 1,000? We add another block automatically',
    description:
      'If your volume grows past 1,000, we add another 1,000-fax block for $55. No interruptions, no manual upgrades.',
  },
  {
    icon: Calculator,
    title: 'Simple formula, no surprises',
    description: 'Your monthly cost is always ceil(usage / 1000) x $55. You only pay for what you use.',
  },
];

const FEATURE_GRID = [
  {
    category: 'Routing',
    features: [
      'AI-powered routing',
      'Priority detection',
      'Priority routing',
      'Custom routing rules',
    ],
  },
  {
    category: 'Delivery',
    features: [
      'Email delivery',
      'Webhook integrations',
      'Send faxes',
      'Receive faxes',
    ],
  },
  {
    category: 'Dashboard & Reporting',
    features: [
      'Full dashboard access',
      'Fax history & search',
      'Export reports',
      'Custom analytics',
    ],
  },
  {
    category: 'Support',
    features: [
      'Priority support',
      'Dedicated onboarding',
      'API access',
      'Custom integrations',
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'What\'s the difference between Day Pass and Membership?',
    answer:
      'Day Pass gives you 5 documents and 8 hours of access for $9 — perfect for quick one-off jobs. Membership gives you 1,000 faxes per month for $55 — built for offices and businesses that fax regularly. Both include all features and both auto-expand if you need more.',
  },
  {
    question: 'What happens if I go over 1,000 faxes?',
    answer:
      'We automatically add another 1,000-fax block for $55. There is no interruption to your service. Your monthly bill is always ceil(usage / 1000) x $55, so you only pay for what you actually use.',
  },
  {
    question: 'How do I cancel?',
    answer:
      'Cancel anytime from your billing settings. There are no cancellation fees and no contracts. Your account stays active through the end of your current billing period.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer:
      'Yes. We offer special pricing for nonprofits, community health centers, and rural clinics. Contact our team and we will work something out.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards including Visa, Mastercard, and American Express.',
  },
  {
    question: 'Can I send AND receive faxes?',
    answer:
      'Yes. Your FaxBella Membership includes both inbound and outbound faxing. AI routing applies to incoming faxes, and you can send faxes to any number from your dashboard.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Contact us for a personalized demo. We will walk you through the platform and show you how AI routing works with your workflow.',
  },
];

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
   Expand Table Component
   ============================================ */

function ExpandTable({
  title,
  rows,
}: {
  title: string;
  rows: { range: string; blocks: number; cost: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-vc-border)] bg-white shadow-[var(--shadow-lg)]">
      {/* Table Title */}
      <div className="bg-[var(--color-vc-surface)] border-b border-[var(--color-vc-border)] px-6 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-primary)] font-bold">
          {title}
        </span>
      </div>
      {/* Table Header */}
      <div className="grid grid-cols-3 bg-[var(--color-vc-surface)] border-b-2 border-[var(--color-vc-border)]">
        <div className="px-6 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)] font-bold">
            Usage
          </span>
        </div>
        <div className="px-6 py-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)] font-bold">
            Blocks
          </span>
        </div>
        <div className="px-6 py-3 text-right">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)] font-bold">
            Cost
          </span>
        </div>
      </div>

      {/* Table Rows */}
      {rows.map((row, idx) => (
        <div
          key={row.range}
          className={`grid grid-cols-3 ${
            idx < rows.length - 1
              ? 'border-b border-[var(--color-vc-border)]'
              : ''
          } ${idx === 0 ? 'bg-[var(--color-vc-accent)]/[0.03]' : ''}`}
        >
          <div className="px-6 py-4">
            <span className="text-sm font-medium text-[var(--color-vc-primary)]">
              {row.range}
            </span>
          </div>
          <div className="px-6 py-4 text-center">
            <span className="text-sm text-[var(--color-vc-text-secondary)]">
              {row.blocks}
            </span>
          </div>
          <div className="px-6 py-4 text-right">
            <span className="text-sm font-bold text-[var(--color-vc-primary)]">
              {row.cost}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================
   Pricing Page
   ============================================ */

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
              Two ways in
              <span className="text-[var(--color-vc-accent)]">.</span>
              <br />
              Your call
              <span className="text-[var(--color-vc-accent)]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-2xl leading-relaxed">
              Day pass for quick jobs. Membership for the long haul.
            </p>

            {/* Bottom accent line */}
            <div className="mt-20 md:mt-28 border-t border-white/[0.06]" />
          </div>
        </section>

        {/* ============================================
           TWO PLAN CARDS
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
                Pick your path
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Two Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* ---- Day Pass Card ---- */}
              <article className="relative bg-white p-8 md:p-10 rounded-xl border border-[var(--color-vc-border)] shadow-[var(--shadow-lg)] flex flex-col">
                {/* Quick Access tag */}
                <div className="absolute top-0 right-0 bg-[var(--color-vc-surface)] text-[var(--color-vc-text-secondary)] font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-bl-lg border-b border-l border-[var(--color-vc-border)]">
                  Quick Access
                </div>

                {/* Accent line */}
                <div className="w-10 h-[3px] rounded-full mb-8 bg-[var(--color-vc-border)]" />

                {/* Plan name */}
                <span className="mono-label">{DAY_PASS.name}</span>

                {/* Price */}
                <div className="mt-4 mb-2">
                  <span className="font-mono text-4xl md:text-5xl font-black text-[var(--color-vc-primary)] tracking-tight">
                    ${DAY_PASS.price}
                  </span>
                  <span className="font-mono text-sm text-[var(--color-vc-text-tertiary)] ml-1">
                    /day
                  </span>
                </div>

                {/* Billing note */}
                <div className="mb-8 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-vc-text-tertiary)]" />
                  <p className="font-mono text-xs text-[var(--color-vc-text-tertiary)]">
                    5 documents &middot; 8-hour window
                  </p>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-10">
                  {DAY_PASS.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[var(--color-vc-text-tertiary)]/[0.08]">
                        <Check className="w-3 h-3 text-[var(--color-vc-text-tertiary)]" />
                      </span>
                      <span className="text-sm text-[var(--color-vc-text-secondary)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA — outlined */}
                <Link
                  href={`${ROUTES.signup}?plan=daypass`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[var(--color-vc-primary)] text-[var(--color-vc-primary)] font-medium text-sm rounded-full hover:bg-[var(--color-vc-primary)] hover:text-white transition-all duration-200"
                >
                  Get a Day Pass
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>

              {/* ---- Membership Card (Featured) ---- */}
              <article className="relative bg-white p-8 md:p-10 rounded-xl ring-2 ring-[var(--color-vc-accent)] shadow-[var(--shadow-xl)] flex flex-col">
                {/* Badge */}
                <div className="absolute top-0 right-0 bg-[var(--color-vc-accent)] text-white font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-bl-lg">
                  Best Value
                </div>

                {/* Accent line */}
                <div className="w-10 h-[3px] rounded-full mb-8 bg-[var(--color-vc-accent)]" />

                {/* Plan name */}
                <span className="mono-label">{PLAN.name}</span>

                {/* Price */}
                <div className="mt-4 mb-2">
                  <span className="font-mono text-4xl md:text-5xl font-black text-[var(--color-vc-primary)] tracking-tight">
                    ${PLAN.price}
                  </span>
                  <span className="font-mono text-sm text-[var(--color-vc-text-tertiary)] ml-1">
                    /mo
                  </span>
                </div>

                {/* Billing note */}
                <div className="mb-8">
                  <p className="font-mono text-xs text-[var(--color-vc-text-tertiary)]">
                    {PLAN.faxBlock} faxes included &middot; Cancel anytime
                  </p>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-10">
                  {PLAN.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[var(--color-vc-accent)]/[0.08]">
                        <Check className="w-3 h-3 text-[var(--color-vc-accent)]" />
                      </span>
                      <span className="text-sm text-[var(--color-vc-text-secondary)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA — filled */}
                <Link
                  href={ROUTES.signup}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] hover:scale-[1.03] transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            </div>

            {/* Below-card note */}
            <p className="mt-8 text-center text-sm text-[var(--color-vc-text-secondary)] leading-relaxed max-w-md mx-auto">
              Both plans auto-expand. Need more? We add blocks automatically as you grow.
            </p>
          </div>
        </section>

        {/* ============================================
           HOW AUTO-EXPAND WORKS
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Auto-Expand
                </span>
                <span className="accent-line w-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                Grow without thinking about it
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
              <p className="mt-6 text-base text-[var(--color-vc-text-secondary)] max-w-xl mx-auto leading-relaxed">
                Both plans auto-expand. Same formula, different block sizes.
              </p>
            </div>

            {/* 3-Step Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-16 md:mb-20">
              {AUTO_EXPAND_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative bg-white rounded-xl border border-[var(--color-vc-border)] p-8 flex flex-col"
                  >
                    {/* Step number */}
                    <span className="absolute top-6 right-6 font-mono text-5xl font-black text-[var(--color-vc-surface)] leading-none select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-[var(--color-vc-accent)]/[0.08] flex items-center justify-center mb-6">
                      <StepIcon className="w-5 h-5 text-[var(--color-vc-accent)]" />
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-vc-primary)] mb-3 pr-8">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Formula callouts — side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)] font-bold">
                  Day Pass
                </span>
                <div className="mt-2 inline-block bg-[var(--color-vc-surface-dark)] rounded-lg px-6 py-3">
                  <code className="font-mono text-sm text-[var(--color-vc-text-on-dark)]">
                    ceil(docs / 5) &times; $9
                  </code>
                </div>
              </div>
              <div className="text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)] font-bold">
                  Membership
                </span>
                <div className="mt-2 inline-block bg-[var(--color-vc-surface-dark)] rounded-lg px-6 py-3">
                  <code className="font-mono text-sm text-[var(--color-vc-text-on-dark)]">
                    ceil(faxes / 1000) &times; $55
                  </code>
                </div>
              </div>
            </div>

            {/* Visual Example Tables — side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ExpandTable title="Day Pass" rows={DAYPASS_EXPAND_TABLE} />
              <ExpandTable title="Membership" rows={AUTO_EXPAND_TABLE} />
            </div>
          </div>
        </section>

        {/* ============================================
           EVERYTHING INCLUDED — FEATURE GRID
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-surface)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  All Features
                </span>
                <span className="accent-line w-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                Everything, for everyone
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
              <p className="mt-6 text-base text-[var(--color-vc-text-secondary)] max-w-xl mx-auto leading-relaxed">
                No feature tiers. No add-ons. Every FaxBella member gets full
                access to every capability from day one.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURE_GRID.map((group) => (
                <div
                  key={group.category}
                  className="bg-white rounded-xl border border-[var(--color-vc-border)] p-6"
                >
                  {/* Category label */}
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-accent)] font-bold">
                    {group.category}
                  </span>

                  <ul className="mt-5 space-y-3">
                    {group.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[var(--color-vc-accent)] shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--color-vc-text-secondary)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
           TRUST / FLEXIBILITY
           ============================================ */}
        <section className="py-16 md:py-20 bg-[var(--color-vc-bg)] border-y border-[var(--color-vc-border)]">
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
                No long-term contracts. No cancellation fees. Cancel from your
                billing settings whenever you need to. Your account stays active
                through the end of your current billing period.
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
