import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  UserCheck,
  AlertTriangle,
  ClipboardList,
  Phone,
  Send,
  Lock,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';
import { STATS_BAR, ROUTES, SITE_CONFIG } from '@/lib/constants';

/* ============================================
   Plain-Language Stat Labels
   ============================================ */
const STAT_LABELS: Record<string, string> = {
  'Faxes Processed': 'Faxes Routed',
  'Routing Accuracy': 'Routing Accuracy',
  'Avg. Processing': 'Average Delivery',
  'Active Clinics': 'Organizations',
};

/* ============================================
   Feature Section Data
   ============================================ */
const FEATURE_SECTIONS = [
  {
    index: '01',
    headline: 'Faxes go to the right person. Every time.',
    copy: 'FaxBella reads every incoming fax and figures out who it\'s for. By name, by department, by the words on the page. No more reading cover sheets. No more guessing.',
    cta: { label: 'See how routing works', href: ROUTES.howItWorks },
    icon: UserCheck,
    visual: {
      type: 'routing' as const,
    },
  },
  {
    index: '02',
    headline: 'Urgent faxes don\'t wait in line.',
    copy: 'Critical lab results, time-sensitive referrals, and prescriptions are flagged automatically. The right person gets them immediately -- not hours later when someone checks the tray.',
    cta: { label: 'Learn about priority delivery', href: ROUTES.howItWorks },
    icon: AlertTriangle,
    visual: {
      type: 'urgency' as const,
    },
  },
  {
    index: '03',
    headline: 'Know exactly where every fax went.',
    copy: 'See the full history: who received each fax, when it arrived, when it was delivered, and how confident the match was. Export reports. Filter by date, type, or urgency.',
    cta: { label: 'Explore the dashboard', href: ROUTES.signup },
    icon: ClipboardList,
    visual: {
      type: 'dashboard' as const,
    },
  },
  {
    index: '04',
    headline: 'Works with your existing fax number.',
    copy: 'Keep the number your patients and partners already have. Connect it in two minutes. No new equipment, no IT department, no learning curve.',
    cta: { label: 'Get started now', href: ROUTES.signup },
    icon: Phone,
    visual: {
      type: 'setup' as const,
    },
  },
  {
    index: '05',
    headline: 'Send faxes too.',
    copy: 'Need to fax something out? Do it right from your dashboard. Type or upload, pick the recipient, and send. Track delivery status in real time.',
    cta: { label: 'Try sending a fax', href: ROUTES.signup },
    icon: Send,
    visual: {
      type: 'send' as const,
    },
  },
  {
    index: '06',
    headline: 'Your data stays private.',
    copy: 'Every fax is encrypted in transit and at rest. We process securely and don\'t store content longer than needed. Built with healthcare privacy in mind.',
    cta: { label: 'Read our security practices', href: ROUTES.privacy },
    icon: Lock,
    visual: {
      type: 'security' as const,
    },
  },
] as const;

/* ============================================
   Visual Mock Components
   ============================================ */
function RoutingVisual() {
  return (
    <div className="bg-white border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
      <div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)] mb-5">
        Incoming Fax
      </div>
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--color-vc-border)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-vc-surface)] flex items-center justify-center">
          <span className="text-sm font-bold text-[var(--color-vc-text-secondary)]">Fx</span>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-vc-primary)]">Lab Results - CBC Panel</p>
          <p className="text-xs text-[var(--color-vc-text-tertiary)]">From: +1 (555) 234-5678</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-vc-accent)]/[0.08] flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-[var(--color-vc-accent)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[var(--color-vc-primary)]">Dr. Sarah Chen</p>
          <p className="text-xs text-[var(--color-vc-text-tertiary)]">Internal Medicine</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] text-xs font-bold">
          97% match
        </div>
      </div>
    </div>
  );
}

function UrgencyVisual() {
  return (
    <div className="bg-white border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-5">
        <div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
          Priority Fax
        </div>
        <div className="px-3 py-1 rounded-full bg-[var(--color-vc-accent)]/[0.08] text-[var(--color-vc-accent)] text-xs font-bold uppercase tracking-wider">
          Urgent
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--color-vc-accent)] mt-1.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[var(--color-vc-primary)]">Stat Lab Results - Potassium Critical</p>
            <p className="text-xs text-[var(--color-vc-text-tertiary)] mt-1">Flagged and delivered to Dr. James Park</p>
          </div>
        </div>
        <div className="border-t border-[var(--color-vc-border)] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-vc-text-tertiary)]">Time to delivery</span>
            <span className="text-sm font-black text-[var(--color-vc-accent)]">3 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardVisual() {
  return (
    <div className="bg-white border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-[var(--color-vc-border)] flex items-center gap-3">
        <div className="px-3 py-1 rounded-full border border-[var(--color-vc-border)] text-xs text-[var(--color-vc-text-secondary)]">
          All Types
        </div>
        <div className="px-3 py-1 rounded-full border border-[var(--color-vc-border)] text-xs text-[var(--color-vc-text-secondary)]">
          This Week
        </div>
        <div className="px-3 py-1 rounded-full border border-[var(--color-vc-border)] text-xs text-[var(--color-vc-text-secondary)]">
          All Recipients
        </div>
      </div>
      {/* Table rows */}
      <div className="divide-y divide-[var(--color-vc-border)]">
        {[
          { type: 'Lab Results', to: 'Dr. Chen', time: '2m ago', status: 'Delivered' },
          { type: 'Referral', to: 'Front Desk', time: '14m ago', status: 'Delivered' },
          { type: 'Prescription', to: 'Dr. Park', time: '1h ago', status: 'Delivered' },
        ].map((row) => (
          <div key={row.type} className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[var(--color-vc-primary)]">{row.type}</span>
              <span className="text-xs text-[var(--color-vc-text-tertiary)]">{row.to}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--color-vc-text-tertiary)]">{row.time}</span>
              <span className="text-xs font-bold text-[var(--color-success)]">{row.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SetupVisual() {
  return (
    <div className="bg-white border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
      <div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)] mb-5">
        Your Fax Line
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-[var(--color-vc-surface)] flex items-center justify-center">
          <Phone className="w-5 h-5 text-[var(--color-vc-text-secondary)]" />
        </div>
        <div>
          <p className="text-lg font-black text-[var(--color-vc-primary)]">(555) 234-5678</p>
          <p className="text-xs text-[var(--color-vc-text-tertiary)]">Your existing number</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-success-light)]">
        <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
        <span className="text-sm font-bold text-[var(--color-success)]">Connected and receiving faxes</span>
      </div>
    </div>
  );
}

function SendVisual() {
  return (
    <div className="bg-white border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
      <div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)] mb-5">
        Send a Fax
      </div>
      <div className="space-y-4 mb-6">
        <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-vc-border)] bg-[var(--color-vc-surface)]">
          <span className="text-xs text-[var(--color-vc-text-tertiary)]">To</span>
          <p className="text-sm font-bold text-[var(--color-vc-primary)]">+1 (555) 876-5432</p>
        </div>
        <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-vc-border)] bg-[var(--color-vc-surface)]">
          <span className="text-xs text-[var(--color-vc-text-tertiary)]">Document</span>
          <p className="text-sm font-bold text-[var(--color-vc-primary)]">referral-chen-02-13.pdf</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-success-light)]">
        <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
        <span className="text-sm font-bold text-[var(--color-success)]">Sent successfully</span>
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="bg-white border border-[var(--color-vc-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[var(--color-vc-accent)]/[0.08] flex items-center justify-center">
          <Lock className="w-5 h-5 text-[var(--color-vc-accent)]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-vc-primary)]">Security Status</p>
          <p className="text-xs text-[var(--color-vc-text-tertiary)]">All systems protected</p>
        </div>
      </div>
      <div className="space-y-3">
        {['Encrypted in transit', 'Encrypted at rest', 'HIPAA-aware processing', 'SOC 2 compliant'].map(
          (badge) => (
            <div
              key={badge}
              className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-vc-surface)]"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-vc-primary)]">{badge}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const VISUAL_MAP = {
  routing: RoutingVisual,
  urgency: UrgencyVisual,
  dashboard: DashboardVisual,
  setup: SetupVisual,
  send: SendVisual,
  security: SecurityVisual,
} as const;

/* ============================================
   Features Page
   ============================================ */
export default function FeaturesPage() {
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
              background: `radial-gradient(circle, var(--color-vc-accent) 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            {/* Monospace tag */}
            <div className="flex items-center gap-3 mb-8">
              <span className="accent-line w-12" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                Features
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight text-[var(--color-vc-text-on-dark)] max-w-5xl">
              Everything your fax
              <br />
              workflow needs
              <span className="text-[var(--color-vc-accent)]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-2xl leading-relaxed">
              {SITE_CONFIG.name} handles the reading, sorting, and delivering.
              <br className="hidden md:block" />
              You handle everything else.
            </p>

            {/* Bottom accent line */}
            <div className="mt-20 md:mt-28 border-t border-white/[0.06]" />
          </div>
        </section>

        {/* ============================================
           FEATURE SECTIONS -- 6 alternating full-width bands
           ============================================ */}
        {FEATURE_SECTIONS.map((feature, idx) => {
          const isReversed = idx % 2 !== 0;
          const isDark = idx % 2 !== 0;
          const VisualComponent = VISUAL_MAP[feature.visual.type];
          const FeatureIcon = feature.icon;

          return (
            <section
              key={feature.index}
              className={`relative overflow-hidden ${
                isDark
                  ? 'bg-[var(--color-vc-surface)]'
                  : 'bg-[var(--color-vc-bg)]'
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28 lg:py-32">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    isReversed ? 'lg:direction-rtl' : ''
                  }`}
                >
                  {/* Content side */}
                  <div className={isReversed ? 'lg:order-2' : 'lg:order-1'}>
                    {/* Index label */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-xs tracking-[0.2em] text-[var(--color-vc-text-tertiary)] uppercase">
                        {feature.index}
                      </span>
                      <span className="accent-line w-8" />
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-[var(--color-vc-accent)]/[0.08] flex items-center justify-center mb-6">
                      <FeatureIcon className="w-6 h-6 text-[var(--color-vc-accent)]" />
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.05] max-w-lg">
                      {feature.headline}
                    </h2>

                    {/* Copy */}
                    <p className="mt-6 text-base text-[var(--color-vc-text-secondary)] leading-relaxed max-w-md">
                      {feature.copy}
                    </p>

                    {/* CTA Link */}
                    <Link
                      href={feature.cta.href}
                      className="group inline-flex items-center gap-2 mt-8 text-sm font-bold text-[var(--color-vc-accent)] hover:gap-3 transition-all duration-300"
                    >
                      {feature.cta.label}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Visual side */}
                  <div className={isReversed ? 'lg:order-1' : 'lg:order-2'}>
                    <VisualComponent />
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* ============================================
           BY THE NUMBERS
           ============================================ */}
        <section className="bg-[var(--color-vc-surface)] border-y border-[var(--color-vc-border)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  By the Numbers
                </span>
                <span className="accent-line w-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                Trusted by healthcare teams everywhere
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS_BAR.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`py-8 md:py-10 ${
                    idx > 0 ? 'border-l border-[var(--color-vc-border)]' : ''
                  } ${
                    idx >= 2
                      ? 'border-t md:border-t-0 border-[var(--color-vc-border)]'
                      : ''
                  } px-4 md:px-8 text-center`}
                >
                  <p className="font-mono text-3xl md:text-4xl font-black text-[var(--color-vc-primary)] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                    {STAT_LABELS[stat.label] ?? stat.label}
                  </p>
                </div>
              ))}
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
              background: `radial-gradient(circle, var(--color-vc-accent) 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center">
            {/* Monospace tag */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="accent-line w-12" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                Get Started
              </span>
              <span className="accent-line w-12" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-vc-text-on-dark)] leading-[1.05]">
              See it in action
              <span className="text-[var(--color-vc-accent)]">.</span>
            </h2>

            <p className="mt-6 text-base text-[var(--color-vc-text-tertiary)] max-w-md mx-auto leading-relaxed">
              Get started today. Takes 2 minutes.
            </p>

            {/* CTA Row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
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
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
