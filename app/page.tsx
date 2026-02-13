'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Zap,
  FileSearch,
  Shield,
  BarChart3,
  Plug,
  AlertCircle,
  ChevronRight,
  FileText,
  Users,
  Target,
  Clock,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';
import {
  SITE_CONFIG,
  FEATURES,
  PLAN,
  DAY_PASS,
  STEPS,
  STATS_BAR,
  ROUTES,
  DASHBOARD_STATS,
  MOCK_FAXES,
} from '@/lib/constants';

/* ============================================
   Icon Maps
   ============================================ */
const FEATURE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Zap,
  FileSearch,
  Shield,
  BarChart3,
  Plug,
};

const STAT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Users,
  Target,
  Clock,
};

/* ============================================
   Landing Page
   ============================================ */
export default function LandingPage() {

  return (
    <div className="min-h-screen bg-[var(--color-vc-bg)] text-[var(--color-vc-text)] antialiased">
      <MarketingHeader />

      <main className="pt-[72px]">
        {/* ============================================
           1. HERO (DARK)
           ============================================ */}
        <section className="relative bg-[var(--color-vc-surface-dark)] overflow-hidden">
          {/* Geometric grid background */}
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

          {/* Accent glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{
              background:
                'radial-gradient(circle, var(--color-vc-accent) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            {/* Monospace label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="accent-line w-12" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                AI-Powered Fax Routing
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-black leading-[0.92] tracking-tight text-[var(--color-vc-text-on-dark)] max-w-5xl">
              Every fax finds
              <br />
              its person
              <span className="text-[var(--color-vc-accent)]">.</span>
              <br />
              <span className="text-[var(--color-vc-accent)]">Instantly</span>
              <span className="text-[var(--color-vc-text-on-dark)]">.</span>
            </h1>

            {/* Subhead */}
            <p className="mt-8 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-xl leading-relaxed">
              Stop sorting faxes by hand. FaxBella reads every incoming fax,
              figures out who it&apos;s for, and delivers it to them — in seconds.
            </p>

            {/* CTA Row */}
            <div className="mt-12 flex flex-wrap items-center gap-6">
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
                href={ROUTES.howItWorks}
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-vc-text-tertiary)] hover:text-[var(--color-vc-text-on-dark)] transition-colors"
              >
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Bottom accent line */}
            <div className="mt-20 md:mt-28 border-t border-white/[0.06]" />
          </div>
        </section>

        {/* ============================================
           2. STATS BAR (LIGHT)
           ============================================ */}
        <section className="border-b border-[var(--color-vc-border)] bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS_BAR.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`py-8 md:py-10 px-4 md:px-8 ${
                    idx > 0 ? 'border-l border-[var(--color-vc-border)]' : ''
                  } ${
                    idx >= 2
                      ? 'border-t md:border-t-0 border-[var(--color-vc-border)]'
                      : ''
                  }`}
                >
                  <p className="font-mono text-3xl md:text-4xl font-black text-[var(--color-vc-primary)] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
           3. FEATURES (LIGHT)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Features
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] max-w-2xl leading-[1.1]">
                Everything your fax machine should already do
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* 2x3 Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-vc-border)]">
              {FEATURES.map((feature, idx) => {
                const IconComp = FEATURE_ICON_MAP[feature.icon];
                return (
                  <div
                    key={feature.title}
                    className="group bg-white p-8 md:p-10 hover:bg-[var(--color-vc-surface)] transition-colors duration-300"
                  >
                    {/* Accent line */}
                    <div className="w-10 h-[3px] bg-[var(--color-vc-accent)] mb-8 group-hover:w-16 transition-all duration-300" />

                    {/* Index */}
                    <span className="font-mono text-xs tracking-[0.15em] text-[var(--color-vc-text-tertiary)] uppercase">
                      {String(idx + 1).padStart(2, '0')} --
                    </span>

                    {/* Icon + Title */}
                    <div className="flex items-start gap-4 mt-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-vc-accent)]/[0.08] flex items-center justify-center shrink-0">
                        {IconComp && (
                          <IconComp className="w-5 h-5 text-[var(--color-vc-accent)]" />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-vc-primary)] leading-tight pt-1.5">
                        {feature.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================
           4. HOW IT WORKS (SURFACE)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-surface)] border-y border-[var(--color-vc-border)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  How It Works
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] max-w-2xl leading-[1.1]">
                Three steps. Two minutes.
                <br />
                Zero fax sorting
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {STEPS.map((step, idx) => (
                <div key={step.number} className="relative flex flex-col md:flex-row">
                  {/* Step Content */}
                  <div className="flex-1 p-8 md:p-10">
                    {/* Large number */}
                    <span className="font-mono text-6xl md:text-7xl font-black text-[var(--color-vc-accent)]/[0.12] leading-none block mb-4">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-[var(--color-vc-primary)] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>

                  {/* Desktop connector */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className="hidden md:flex items-center justify-center w-12"
                      aria-hidden="true"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-[3px] h-2 bg-[var(--color-vc-accent)]/30 rounded-full" />
                        <div className="w-[3px] h-3 bg-[var(--color-vc-accent)]/50 rounded-full" />
                        <div className="w-[3px] h-2 bg-[var(--color-vc-accent)]/30 rounded-full" />
                        <ArrowRight className="w-4 h-4 text-[var(--color-vc-accent)]" />
                        <div className="w-[3px] h-2 bg-[var(--color-vc-accent)]/30 rounded-full" />
                        <div className="w-[3px] h-3 bg-[var(--color-vc-accent)]/50 rounded-full" />
                        <div className="w-[3px] h-2 bg-[var(--color-vc-accent)]/30 rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Mobile connector */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className="md:hidden flex justify-center py-2"
                      aria-hidden="true"
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-[3px] bg-[var(--color-vc-accent)]/30 rounded-full" />
                        <div className="w-3 h-[3px] bg-[var(--color-vc-accent)]/50 rounded-full" />
                        <div className="w-2 h-[3px] bg-[var(--color-vc-accent)]/30 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Learn more link */}
            <div className="mt-12 flex justify-center">
              <Link
                href={ROUTES.howItWorks}
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-vc-accent)] hover:text-[var(--color-vc-accent-light)] transition-colors"
              >
                Learn more about how it works
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================
           5. DASHBOARD PREVIEW (LIGHT)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Your Dashboard
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] max-w-2xl leading-[1.1]">
                See every fax, every route, in real time
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
              <p className="mt-6 text-base text-[var(--color-vc-text-secondary)] max-w-lg leading-relaxed">
                Your dashboard shows exactly what&apos;s happening — who received what,
                when, and how confident the match was.
              </p>
            </div>

            {/* Dashboard Mockup */}
            <div className="rounded-xl overflow-hidden border border-[var(--color-vc-border)] shadow-[var(--shadow-xl)]">
              {/* Browser Chrome */}
              <div className="bg-[var(--color-vc-surface-dark)] px-5 py-3 flex items-center gap-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white/[0.12]" />
                  <span className="w-3 h-3 rounded-full bg-white/[0.12]" />
                  <span className="w-3 h-3 rounded-full bg-white/[0.12]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-sm mx-auto bg-white/[0.06] rounded-md px-4 py-1.5 text-xs font-mono text-white/40 text-center">
                    app.faxbella.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="bg-white p-4 md:p-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {DASHBOARD_STATS.map((stat) => {
                    const StatIcon = STAT_ICON_MAP[stat.icon];
                    return (
                      <div
                        key={stat.label}
                        className="p-4 md:p-5 rounded-lg border border-[var(--color-vc-border)] bg-[var(--color-vc-bg)]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          {StatIcon && (
                            <StatIcon className="w-4 h-4 text-[var(--color-vc-text-tertiary)]" />
                          )}
                          {'limit' in stat && stat.limit && (
                            <span className="font-mono text-[10px] text-[var(--color-vc-text-tertiary)]">
                              / {stat.limit}
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-2xl font-black text-[var(--color-vc-primary)] tracking-tight">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-vc-text-tertiary)]">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Fax Table */}
                <div className="border border-[var(--color-vc-border)] rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-[var(--color-vc-surface)] border-b border-[var(--color-vc-border)]">
                    {[
                      'From',
                      'Type',
                      'Urgency',
                      'Routed To',
                      'Confidence',
                      'Time',
                    ].map((header) => (
                      <span
                        key={header}
                        className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]"
                      >
                        {header}
                      </span>
                    ))}
                  </div>

                  {/* Table Rows */}
                  {MOCK_FAXES.map((fax, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 px-5 py-3.5 items-center ${
                        idx < MOCK_FAXES.length - 1
                          ? 'border-b border-[var(--color-vc-border)]'
                          : ''
                      } hover:bg-[var(--color-vc-surface)] transition-colors`}
                    >
                      <span className="text-sm font-mono text-[var(--color-vc-primary)] truncate">
                        {fax.from}
                      </span>
                      <span className="text-sm text-[var(--color-vc-text-secondary)]">
                        {fax.type}
                      </span>
                      <div className="hidden md:block">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full ${
                            fax.urgency === 'Urgent'
                              ? 'bg-[var(--color-vc-accent)]/[0.08] text-[var(--color-vc-accent)]'
                              : 'bg-[var(--color-vc-surface)] text-[var(--color-vc-text-tertiary)]'
                          }`}
                        >
                          {fax.urgency === 'Urgent' && (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {fax.urgency}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm text-[var(--color-vc-text-secondary)]">
                        {fax.to}
                      </span>
                      <div className="hidden md:flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--color-vc-surface)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-vc-accent)] rounded-full"
                            style={{ width: fax.confidence }}
                          />
                        </div>
                        <span className="font-mono text-xs text-[var(--color-vc-text-secondary)] min-w-[32px] text-right">
                          {fax.confidence}
                        </span>
                      </div>
                      <span className="hidden md:block text-xs font-mono text-[var(--color-vc-text-tertiary)] text-right">
                        {fax.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
           6. PRICING (SURFACE)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-surface)] border-y border-[var(--color-vc-border)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Pricing
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] max-w-lg leading-[1.1]">
                Simple plans that grow with you
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Plan Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Day Pass */}
              <div className="relative bg-white p-8 md:p-10 flex flex-col rounded-xl border border-[var(--color-vc-border)]">
                <div className="w-10 h-[3px] rounded-full mb-8 bg-[var(--color-vc-border)]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  {DAY_PASS.name}
                </span>
                <div className="mt-4 mb-6">
                  <span className="font-mono text-4xl md:text-5xl font-black text-[var(--color-vc-primary)] tracking-tight">
                    ${DAY_PASS.price}
                  </span>
                  <span className="font-mono text-sm text-[var(--color-vc-text-tertiary)] ml-1">
                    /day
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {DAY_PASS.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-[var(--color-vc-text-secondary)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-vc-text-tertiary)] mt-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${ROUTES.signup}?plan=daypass`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[var(--color-vc-border)] text-[var(--color-vc-primary)] font-medium text-sm rounded-full hover:border-[var(--color-vc-primary)] transition-colors duration-200"
                >
                  Get a Day Pass
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Membership */}
              <div className="relative bg-white p-8 md:p-10 flex flex-col rounded-xl ring-2 ring-[var(--color-vc-accent)]">
                <div className="absolute top-0 right-0 bg-[var(--color-vc-accent)] text-white font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-bl-lg">
                  Best Value
                </div>
                <div className="w-10 h-[3px] rounded-full mb-8 bg-[var(--color-vc-accent)]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  {PLAN.name}
                </span>
                <div className="mt-4 mb-6">
                  <span className="font-mono text-4xl md:text-5xl font-black text-[var(--color-vc-primary)] tracking-tight">
                    ${PLAN.price}
                  </span>
                  <span className="font-mono text-sm text-[var(--color-vc-text-tertiary)] ml-1">
                    /mo
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {PLAN.features.slice(0, 6).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-[var(--color-vc-text-secondary)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-vc-accent)] mt-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={ROUTES.signup}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] hover:scale-[1.03] transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* See all plans link */}
            <div className="mt-10 flex justify-center">
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-vc-accent)] hover:text-[var(--color-vc-accent-light)] transition-colors"
              >
                Compare plans and features
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================
           7. FINAL CTA (DARK)
           ============================================ */}
        <section className="relative bg-[var(--color-vc-surface-dark)] overflow-hidden">
          {/* Geometric grid background */}
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
              background:
                'radial-gradient(circle, var(--color-vc-accent) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-2xl">
              {/* Headline */}
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-vc-text-on-dark)] leading-[1.05]">
                Stop sorting
                <br />
                faxes
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>

              {/* Subhead */}
              <p className="mt-6 text-base text-[var(--color-vc-text-tertiary)] max-w-md leading-relaxed">
                Get started today. Setup takes 2 minutes.
              </p>

              {/* CTA Row */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href={ROUTES.signup}
                  className="group inline-flex items-center gap-4 px-8 py-4 bg-[var(--color-vc-accent)] text-white font-medium text-sm rounded-full shadow-[var(--shadow-glow-accent)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_50px_var(--color-vc-accent-glow)]"
                >
                  Get Started Free
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
