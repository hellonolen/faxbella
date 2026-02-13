'use client';

import {
  Lock,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PLANS } from '@/lib/constants';

/* ----------------------------------------
   Subscribe Modal
   ---------------------------------------- */

const SUBSCRIBE_PLANS = [
  { key: 'business' as const, accent: true },
  { key: 'enterprise' as const, accent: false },
];

interface SubscribeModalProps {
  onClose: () => void;
  onSubscribe: (plan: 'business' | 'enterprise') => void;
  isRedirecting: boolean;
  isDemo: boolean;
}

export function SubscribeModal({
  onClose,
  onSubscribe,
  isRedirecting,
  isDemo,
}: SubscribeModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-modal-title"
    >
      <div
        className={cn(
          'relative w-full max-w-md',
          'bg-white rounded-[var(--radius-lg)]',
          'border border-[var(--color-vc-border)]',
          'shadow-xl',
          'overflow-hidden',
        )}
      >
        {/* Accent top line */}
        <div
          className="h-1 w-full"
          style={{ background: 'var(--color-vc-accent)' }}
          aria-hidden="true"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4',
            'w-7 h-7 rounded-full',
            'flex items-center justify-center',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:bg-[var(--color-vc-surface)] transition-colors',
          )}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="p-6 pt-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                'flex items-center justify-center',
                'w-10 h-10 rounded-full',
                'bg-[var(--color-vc-surface)]',
              )}
            >
              <Lock
                size={18}
                className="text-[var(--color-vc-accent)]"
                aria-hidden="true"
              />
            </div>
            <h2
              id="subscribe-modal-title"
              className="text-lg font-bold text-[var(--color-vc-text)]"
            >
              Subscribe to Send Faxes
            </h2>
          </div>

          <p className="text-sm text-[var(--color-vc-text-secondary)] leading-relaxed mb-5 pl-[52px]">
            Sending faxes requires a Business or Enterprise plan.
            Choose a plan below to get started.
          </p>

          {/* Demo warning */}
          {isDemo && (
            <div
              className={cn(
                'flex items-start gap-2.5 p-3 mb-4',
                'bg-[var(--color-warning-light)]',
                'border border-[var(--color-warning)]',
                'rounded-[var(--radius-md)]',
              )}
            >
              <AlertTriangle
                size={14}
                className="shrink-0 mt-0.5 text-[var(--color-warning)]"
                aria-hidden="true"
              />
              <p className="text-[12px] text-[var(--color-warning)] leading-relaxed">
                Sign in to subscribe to a plan and start sending faxes.
              </p>
            </div>
          )}

          {/* Plan options */}
          <div className="space-y-3">
            {SUBSCRIBE_PLANS.map(({ key, accent }) => {
              const plan = PLANS[key];
              return (
                <div
                  key={key}
                  className={cn(
                    'rounded-[var(--radius-md)] border p-4',
                    'transition-all duration-200',
                    accent
                      ? 'border-[var(--color-vc-accent)] bg-[rgba(232,85,61,0.03)]'
                      : 'border-[var(--color-vc-border)] bg-white',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={cn(
                          'font-[family-name:var(--font-jetbrains)]',
                          'text-[10px] uppercase tracking-[0.15em]',
                          'text-[var(--color-vc-text-tertiary)] mb-1',
                        )}
                      >
                        {plan.name}
                      </p>
                      <p className="flex items-baseline gap-1">
                        <span className="font-[family-name:var(--font-jetbrains)] text-xl font-black text-[var(--color-vc-text)]">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-[var(--color-vc-text-tertiary)]">
                          /mo
                        </span>
                      </p>
                    </div>
                    <Button
                      variant={accent ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => onSubscribe(key)}
                      disabled={isRedirecting || isDemo}
                      loading={isRedirecting}
                    >
                      Subscribe
                    </Button>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-[11px] text-[var(--color-vc-text-secondary)]"
                      >
                        <CheckCircle2
                          size={12}
                          className="shrink-0"
                          style={{
                            color: accent
                              ? 'var(--color-vc-accent)'
                              : 'var(--color-vc-text-tertiary)',
                          }}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
