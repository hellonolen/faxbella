'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Check,
  Wifi,
  Users,
  Mail,
  FileText,
  Clock,
  Search,
  UserCheck,
  Send,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';
import { STEPS, ROUTES, SITE_CONFIG } from '@/lib/constants';

/* ============================================
   FAQ Data — Plain language, zero jargon
   ============================================ */
const FAQ_ITEMS = [
  {
    question: 'How fast does it work?',
    answer:
      'Most faxes are delivered in under 4 seconds.',
  },
  {
    question: 'Do I need to change my fax number?',
    answer:
      'No. You keep your existing number. Your patients and partners never know anything changed.',
  },
  {
    question: 'What if FaxBella can\'t figure out who a fax is for?',
    answer:
      'You\'ll get a notification so you can route it manually. This happens less than 3% of the time.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. Everything is encrypted and we don\'t store fax content longer than needed.',
  },
  {
    question: 'Can I send faxes too?',
    answer:
      'Yes, on Business and Enterprise plans. Right from your dashboard.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Plans start at $29/month. See our pricing page for details.',
  },
  {
    question: 'Do I need IT to set this up?',
    answer:
      'No. If you can fill out a form, you can set up FaxBella.',
  },
  {
    question: 'What kind of documents does it understand?',
    answer:
      'Referrals, lab results, prescriptions, insurance claims, and 8 more document types.',
  },
] as const;

/* ============================================
   Behind the Scenes Steps
   ============================================ */
const BEHIND_THE_SCENES = [
  {
    label: '1',
    title: 'Your fax number receives the document',
    icon: FileText,
  },
  {
    label: '2',
    title: 'FaxBella reads the cover page and every page',
    icon: Search,
  },
  {
    label: '3',
    title: 'It identifies the document type and urgency',
    icon: Clock,
  },
  {
    label: '4',
    title: 'It matches the fax to the right person on your team',
    icon: UserCheck,
  },
  {
    label: '5',
    title: 'That person gets an email notification. Done.',
    icon: Send,
  },
] as const;

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
   How It Works Page
   ============================================ */
export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--color-vc-bg)] text-[var(--color-vc-text)] antialiased">
      <MarketingHeader />

      <main className="pt-[72px]">
        {/* ============================================
           HERO (DARK SECTION)
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
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06]"
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
                How It Works
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-[var(--color-vc-text-on-dark)] max-w-4xl">
              Set up in 2 minutes
              <span className="text-[var(--color-vc-accent)]">.</span>
              <br />
              Never sort a fax again
              <span className="text-[var(--color-vc-accent)]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-xl leading-relaxed">
              Three simple steps between you and a fax-free desk.
            </p>

            {/* Bottom accent line */}
            <div className="mt-20 md:mt-28 border-t border-white/[0.06]" />
          </div>
        </section>

        {/* ============================================
           STEP 1: CONNECT YOUR FAX NUMBER (LIGHT BG)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Content */}
              <div>
                <span className="font-mono text-7xl md:text-8xl font-black text-[var(--color-vc-accent)]/[0.12] leading-none block mb-6">
                  {STEPS[0].number}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="accent-line w-12" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                    Step One
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1] mb-6">
                  Connect your fax number
                  <span className="text-[var(--color-vc-accent)]">.</span>
                </h2>

                <p className="text-[var(--color-vc-text-secondary)] text-sm md:text-base leading-relaxed max-w-lg">
                  Enter your fax number — the one your patients and partners
                  already use. We'll start receiving faxes on your behalf. No
                  new number, no equipment changes, no downtime.
                </p>
              </div>

              {/* Visual: Fax Connection Card */}
              <div className="rounded-xl border border-[var(--color-vc-border)] bg-white shadow-[var(--shadow-lg)] overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-[var(--color-vc-border)] bg-[var(--color-vc-surface)]">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[var(--color-vc-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                      Fax Connection
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Fax number input mock */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)] mb-2">
                      Your Fax Number
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--color-vc-border)] bg-[var(--color-vc-bg)]">
                      <span className="text-sm font-mono text-[var(--color-vc-primary)]">
                        +1 (555) 234-5678
                      </span>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[color:var(--color-success)]/[0.06] border border-[color:var(--color-success)]/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                    <span className="text-sm font-medium text-[var(--color-success)]">
                      Connected
                    </span>
                    <Check className="w-4 h-4 text-[var(--color-success)] ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
           STEP 2: TELL US WHO GETS WHAT (SURFACE BG)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-surface)] border-y border-[var(--color-vc-border)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Visual: Recipients List (LEFT on desktop) */}
              <div className="order-2 lg:order-1 rounded-xl border border-[var(--color-vc-border)] bg-white shadow-[var(--shadow-lg)] overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-[var(--color-vc-border)] bg-[var(--color-vc-surface)]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--color-vc-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                      Your Team
                    </span>
                  </div>
                </div>

                {/* Recipient rows */}
                <div className="divide-y divide-[var(--color-vc-border)]">
                  {[
                    {
                      name: 'Dr. Chen',
                      keywords: 'Lab Results, Referrals',
                    },
                    {
                      name: 'Billing Dept',
                      keywords: 'Insurance, Claims',
                    },
                    {
                      name: 'Front Desk',
                      keywords: 'General, Appointments',
                    },
                    {
                      name: 'Dr. Park',
                      keywords: 'Prescriptions, Pharmacy',
                    },
                  ].map((recipient) => (
                    <div
                      key={recipient.name}
                      className="px-6 py-4 flex items-center gap-4"
                    >
                      <div className="w-9 h-9 rounded-full bg-[var(--color-vc-accent)]/[0.08] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[var(--color-vc-accent)]">
                          {recipient.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-vc-primary)]">
                          {recipient.name}
                        </p>
                        <p className="text-xs text-[var(--color-vc-text-tertiary)]">
                          {recipient.keywords}
                        </p>
                      </div>
                      <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content (RIGHT on desktop) */}
              <div className="order-1 lg:order-2">
                <span className="font-mono text-7xl md:text-8xl font-black text-[var(--color-vc-accent)]/[0.12] leading-none block mb-6">
                  {STEPS[1].number}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="accent-line w-12" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                    Step Two
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1] mb-6">
                  Tell us who gets what
                  <span className="text-[var(--color-vc-accent)]">.</span>
                </h2>

                <p className="text-[var(--color-vc-text-secondary)] text-sm md:text-base leading-relaxed max-w-lg">
                  Add the people who receive faxes — doctors, departments,
                  billing, front desk. Give each person a few keywords or
                  department names so {SITE_CONFIG.name} knows who gets which
                  fax. Takes about a minute per person.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
           STEP 3: FAXES ROUTE THEMSELVES (LIGHT BG)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-bg)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Content */}
              <div>
                <span className="font-mono text-7xl md:text-8xl font-black text-[var(--color-vc-accent)]/[0.12] leading-none block mb-6">
                  {STEPS[2].number}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="accent-line w-12" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                    Step Three
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1] mb-6">
                  That's it. Faxes route themselves
                  <span className="text-[var(--color-vc-accent)]">.</span>
                </h2>

                <p className="text-[var(--color-vc-text-secondary)] text-sm md:text-base leading-relaxed max-w-lg">
                  From now on, every incoming fax is read, understood, and
                  delivered to the right person's email. Urgent faxes are
                  flagged. Everything is tracked. You never touch the fax
                  machine again.
                </p>
              </div>

              {/* Visual: Routing Flow */}
              <div className="rounded-xl border border-[var(--color-vc-border)] bg-white shadow-[var(--shadow-lg)] overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-[var(--color-vc-border)] bg-[var(--color-vc-surface)]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--color-vc-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-vc-text-tertiary)]">
                      Live Routing
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Step: Fax arrives */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--color-vc-border)] bg-[var(--color-vc-bg)]">
                    <FileText className="w-4 h-4 text-[var(--color-vc-text-tertiary)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-vc-primary)]">
                        Fax arrives
                      </p>
                      <p className="text-xs text-[var(--color-vc-text-tertiary)]">
                        From +1 (555) 234-5678
                      </p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-center" aria-hidden="true">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-[2px] h-3 bg-[var(--color-vc-accent)]/30" />
                      <ArrowRight className="w-4 h-4 text-[var(--color-vc-accent)] rotate-90" />
                    </div>
                  </div>

                  {/* Step: Read and classified */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-[var(--color-vc-accent)]/20 bg-[var(--color-vc-accent)]/[0.03]">
                    <Search className="w-4 h-4 text-[var(--color-vc-accent)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-vc-primary)]">
                        Read and classified
                      </p>
                      <p className="text-xs text-[var(--color-vc-text-tertiary)]">
                        Lab Results — Urgent
                      </p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-center" aria-hidden="true">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-[2px] h-3 bg-[var(--color-vc-accent)]/30" />
                      <ArrowRight className="w-4 h-4 text-[var(--color-vc-accent)] rotate-90" />
                    </div>
                  </div>

                  {/* Step: Delivered */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[color:var(--color-success)]/[0.06] border border-[color:var(--color-success)]/20">
                    <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-vc-primary)]">
                        Delivered to Dr. Chen's inbox
                      </p>
                    </div>
                    <span className="font-mono text-xs font-medium text-[var(--color-success)]">
                      3 seconds
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
           WHAT HAPPENS BEHIND THE SCENES (SURFACE BG)
           ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--color-vc-surface)] border-y border-[var(--color-vc-border)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Behind the Scenes
                </span>
                <span className="accent-line w-12" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-vc-primary)] leading-[1.1]">
                What happens when a fax arrives
                <span className="text-[var(--color-vc-accent)]">.</span>
              </h2>
            </div>

            {/* Timeline — horizontal on desktop, vertical on mobile */}
            <div className="hidden md:flex items-start justify-between gap-4 max-w-5xl mx-auto">
              {BEHIND_THE_SCENES.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.label} className="flex flex-col items-center text-center flex-1 relative">
                    {/* Connector line */}
                    {idx < BEHIND_THE_SCENES.length - 1 && (
                      <div
                        className="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-[2px] bg-[var(--color-vc-accent)]/20"
                        aria-hidden="true"
                      />
                    )}

                    {/* Icon circle */}
                    <div className="w-12 h-12 rounded-full bg-[var(--color-vc-accent)]/[0.08] border-2 border-[var(--color-vc-accent)]/20 flex items-center justify-center mb-4 relative z-10 bg-[var(--color-vc-surface)]">
                      <IconComponent className="w-5 h-5 text-[var(--color-vc-accent)]" />
                    </div>

                    {/* Step number */}
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-accent)] font-bold mb-2">
                      {step.label}
                    </span>

                    {/* Title */}
                    <p className="text-sm font-medium text-[var(--color-vc-primary)] leading-snug max-w-[160px]">
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mobile: Vertical timeline */}
            <div className="md:hidden space-y-0">
              {BEHIND_THE_SCENES.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.label} className="flex gap-4">
                    {/* Left column: icon + connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-vc-accent)]/[0.08] border-2 border-[var(--color-vc-accent)]/20 flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4 text-[var(--color-vc-accent)]" />
                      </div>
                      {idx < BEHIND_THE_SCENES.length - 1 && (
                        <div className="w-[2px] flex-1 bg-[var(--color-vc-accent)]/20 my-1" aria-hidden="true" />
                      )}
                    </div>

                    {/* Right column: text */}
                    <div className="pb-8">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-accent)] font-bold">
                        {step.label}
                      </span>
                      <p className="text-sm font-medium text-[var(--color-vc-primary)] leading-snug mt-1">
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================
           FAQ SECTION (LIGHT BG)
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
                  Questions?
                  <br />
                  We've got answers
                  <span className="text-[var(--color-vc-accent)]">.</span>
                </h2>
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
          {/* Geometric grid */}
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
              {/* Monospace tag */}
              <div className="flex items-center gap-3 mb-8">
                <span className="accent-line w-12" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-vc-text-tertiary)]">
                  Get Started
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-vc-text-on-dark)] leading-[1.05]">
                Ready to stop
                <br />
                sorting faxes
                <span className="text-[var(--color-vc-accent)]">?</span>
              </h2>

              <p className="mt-6 text-base md:text-lg text-[var(--color-vc-text-tertiary)] max-w-md leading-relaxed">
                Join 850+ clinics. Setup takes 2 minutes.
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
