'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Phone,
  Key,
  Brain,
  Webhook,
  Copy,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Fingerprint,
  Mail,
  CreditCard,
} from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { usePasskey } from '@/hooks/use-passkey';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';
import { cn } from '@/lib/utils';
import { PLANS } from '@/lib/constants';

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const CONFIGURED_PLACEHOLDER = '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
const FEEDBACK_DURATION_MS = 3000;

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

/* ----------------------------------------
   Inline Feedback
   ---------------------------------------- */

function InlineFeedback({ feedback }: { feedback: FeedbackState | null }) {
  if (!feedback) return null;

  const isSuccess = feedback.type === 'success';

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'text-xs font-medium mt-3 px-3 py-2 rounded-[var(--radius-sm)]',
        isSuccess
          ? 'text-[var(--color-success)] bg-[var(--color-success-light)]'
          : 'text-[var(--color-error)] bg-[var(--color-error-light)]',
      )}
    >
      {feedback.message}
    </p>
  );
}

/* ----------------------------------------
   Section Header
   ---------------------------------------- */

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size: number }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className={cn(
          'inline-flex items-center justify-center',
          'w-9 h-9 rounded-[var(--radius-md)]',
          'bg-[var(--color-vc-surface)]',
          'text-[var(--color-vc-text-secondary)]',
        )}
      >
        <Icon size={16} />
      </span>
      <h2 className="mono-label">{title}</h2>
    </div>
  );
}

/* ----------------------------------------
   Password Input with Toggle
   ---------------------------------------- */

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  isConfigured,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isConfigured: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mono-label block mb-2">
        {label}
        {isConfigured && (
          <span className="ml-2 text-[var(--color-success)]">(configured)</span>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isConfigured ? CONFIGURED_PLACEHOLDER : placeholder}
          className={cn(
            'w-full px-3 py-2.5 pr-10',
            'text-sm font-[family-name:var(--font-jetbrains)]',
            'bg-[var(--color-vc-surface)]',
            'border border-[var(--color-vc-border)]',
            'rounded-[var(--radius-md)]',
            'text-[var(--color-vc-text)]',
            'placeholder:text-[var(--color-vc-text-tertiary)]',
            'transition-shadow duration-150',
            'focus:outline-none focus:focus-ring',
          )}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'p-1.5 rounded-[var(--radius-sm)]',
            'text-[var(--color-vc-text-tertiary)]',
            'hover:text-[var(--color-vc-text-secondary)]',
            'hover:bg-[var(--color-vc-border)]',
            'transition-colors duration-150',
            'cursor-pointer',
          )}
          aria-label={visible ? 'Hide value' : 'Show value'}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Text Input
   ---------------------------------------- */

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mono-label block mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full px-3 py-2.5',
          'text-sm font-[family-name:var(--font-jetbrains)]',
          'bg-[var(--color-vc-surface)]',
          'border border-[var(--color-vc-border)]',
          'rounded-[var(--radius-md)]',
          'text-[var(--color-vc-text)]',
          'placeholder:text-[var(--color-vc-text-tertiary)]',
          'transition-shadow duration-150',
          'focus:outline-none focus:focus-ring',
        )}
      />
    </div>
  );
}

/* ----------------------------------------
   Read-Only Field
   ---------------------------------------- */

function ReadOnlyField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="mono-label block mb-2">{label}</span>
      <p
        className={cn(
          'text-sm text-[var(--color-vc-text)]',
          mono && 'font-[family-name:var(--font-jetbrains)]',
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ----------------------------------------
   Section: Fax Configuration
   ---------------------------------------- */

function FaxConfigSection({
  email,
  sessionToken,
  faxNumber,
  accessKeyConfigured,
  secretKeyConfigured,
}: {
  email: string;
  sessionToken: string;
  faxNumber: string | undefined;
  accessKeyConfigured: boolean;
  secretKeyConfigured: boolean;
}) {
  const updateFaxCredentials = useMutation(api.customers.updateFaxCredentials);
  const [faxNum, setFaxNum] = useState(faxNumber ?? '');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!faxNum.trim()) return;

      setSaving(true);
      setFeedback(null);

      try {
        await updateFaxCredentials({
          sessionToken,
          email,
          faxNumber: faxNum.trim(),
          ...(accessKey ? { humbleFaxAccessKey: accessKey } : {}),
          ...(secretKey ? { humbleFaxSecretKey: secretKey } : {}),
        });

        setFeedback({ type: 'success', message: 'Fax credentials saved.' });
        setAccessKey('');
        setSecretKey('');

        setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save credentials.';
        setFeedback({ type: 'error', message: msg });
      } finally {
        setSaving(false);
      }
    },
    [sessionToken, email, faxNum, accessKey, secretKey, updateFaxCredentials],
  );

  return (
    <Card accent>
      <SectionHeader icon={Phone} title="Fax Configuration" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="fax-number"
          label="Fax Number"
          value={faxNum}
          onChange={setFaxNum}
          placeholder="+1 (555) 000-0000"
          type="tel"
        />

        <PasswordField
          id="hf-access-key"
          label="HumbleFax Access Key"
          value={accessKey}
          onChange={setAccessKey}
          placeholder="Enter access key"
          isConfigured={accessKeyConfigured}
        />

        <PasswordField
          id="hf-secret-key"
          label="HumbleFax Secret Key"
          value={secretKey}
          onChange={setSecretKey}
          placeholder="Enter secret key"
          isConfigured={secretKeyConfigured}
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={saving}
          disabled={!faxNum.trim()}
        >
          Save Fax Settings
        </Button>

        <InlineFeedback feedback={feedback} />
      </form>
    </Card>
  );
}

/* ----------------------------------------
   Section: AI Configuration
   ---------------------------------------- */

function AiConfigSection({
  email,
  sessionToken,
  geminiKeyConfigured,
}: {
  email: string;
  sessionToken: string;
  geminiKeyConfigured: boolean;
}) {
  const updateLLMKey = useMutation(api.customers.updateLLMKey);
  const [geminiKey, setGeminiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!geminiKey.trim()) return;

      setSaving(true);
      setFeedback(null);

      try {
        await updateLLMKey({
          sessionToken,
          email,
          geminiApiKey: geminiKey.trim(),
        });

        setFeedback({ type: 'success', message: 'AI key saved.' });
        setGeminiKey('');

        setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save AI key.';
        setFeedback({ type: 'error', message: msg });
      } finally {
        setSaving(false);
      }
    },
    [sessionToken, email, geminiKey, updateLLMKey],
  );

  return (
    <Card accent>
      <SectionHeader icon={Brain} title="AI Configuration" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          id="gemini-key"
          label="Gemini API Key"
          value={geminiKey}
          onChange={setGeminiKey}
          placeholder="Enter Gemini API key"
          isConfigured={geminiKeyConfigured}
        />

        <p className="text-xs text-[var(--color-vc-text-tertiary)] leading-relaxed">
          Used for fax content analysis and routing
        </p>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={saving}
          disabled={!geminiKey.trim()}
        >
          Save AI Key
        </Button>

        <InlineFeedback feedback={feedback} />
      </form>
    </Card>
  );
}

/* ----------------------------------------
   Section: Webhook Secret
   ---------------------------------------- */

function WebhookSection({ sessionToken }: { sessionToken: string | undefined }) {
  const [copied, setCopied] = useState(false);

  const webhookData = useQuery(
    api.customers.getWebhookSecret,
    sessionToken ? { sessionToken } : 'skip',
  );

  const webhookSecret = webhookData?.webhookSecret;

  const handleCopy = useCallback(async () => {
    if (!webhookSecret) return;
    try {
      await navigator.clipboard.writeText(webhookSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = webhookSecret;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [webhookSecret]);

  return (
    <Card accent>
      <SectionHeader icon={Webhook} title="Webhook Secret" />

      <div className="space-y-4">
        <div>
          <span className="mono-label block mb-2">Secret</span>
          <div className="flex items-center gap-2">
            <code
              className={cn(
                'flex-1 px-3 py-2.5',
                'text-sm font-[family-name:var(--font-jetbrains)]',
                'bg-[var(--color-vc-surface)]',
                'border border-[var(--color-vc-border)]',
                'rounded-[var(--radius-md)]',
                'text-[var(--color-vc-text)]',
                'select-all',
                'overflow-x-auto whitespace-nowrap',
              )}
            >
              {webhookSecret ?? 'Loading...'}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!webhookSecret}
              className={cn(
                'inline-flex items-center justify-center',
                'w-10 h-10',
                'rounded-[var(--radius-md)]',
                'border border-[var(--color-vc-border)]',
                'bg-white',
                'text-[var(--color-vc-text-secondary)]',
                'hover:bg-[var(--color-vc-surface)]',
                'hover:border-[var(--color-vc-accent)]',
                'hover:text-[var(--color-vc-accent)]',
                'active:scale-[0.96]',
                'transition-all duration-150',
                'cursor-pointer',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                copied && 'border-[var(--color-success)] text-[var(--color-success)]',
              )}
              aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--color-vc-text-tertiary)] leading-relaxed">
          Use this secret to verify webhook payloads
        </p>
      </div>
    </Card>
  );
}

/* ----------------------------------------
   Section: Account
   ---------------------------------------- */

function AccountSection({
  email,
  plan,
  onLogout,
}: {
  email: string;
  plan: string;
  onLogout: () => void;
}) {
  const credentials = useQuery(
    api.passkeys.listCredentials,
    email ? { email } : 'skip',
  );

  const planKey = plan.toLowerCase() as keyof typeof PLANS;
  const planLabel = PLANS[planKey]?.name ?? plan;
  const passkeyCount = credentials?.length ?? 0;

  return (
    <Card accent>
      <SectionHeader icon={Key} title="Account" />

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'inline-flex items-center justify-center',
                'w-8 h-8 rounded-[var(--radius-sm)]',
                'bg-[var(--color-vc-surface)]',
                'text-[var(--color-vc-text-tertiary)]',
              )}
            >
              <Mail size={14} />
            </span>
            <ReadOnlyField label="Email" value={email} mono />
          </div>

          <div className="flex items-start gap-3">
            <span
              className={cn(
                'inline-flex items-center justify-center',
                'w-8 h-8 rounded-[var(--radius-sm)]',
                'bg-[var(--color-vc-surface)]',
                'text-[var(--color-vc-text-tertiary)]',
              )}
            >
              <CreditCard size={14} />
            </span>
            <ReadOnlyField label="Plan" value={planLabel} />
          </div>

          <div className="flex items-start gap-3">
            <span
              className={cn(
                'inline-flex items-center justify-center',
                'w-8 h-8 rounded-[var(--radius-sm)]',
                'bg-[var(--color-vc-surface)]',
                'text-[var(--color-vc-text-tertiary)]',
              )}
            >
              <Fingerprint size={14} />
            </span>
            <ReadOnlyField
              label="Passkeys"
              value={`${passkeyCount} registered`}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--color-vc-border)]">
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut size={14} aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="dash-card-accent space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton width={36} height={36} />
            <Skeleton width={140} height={12} />
          </div>
          <Skeleton height={40} className="w-full" />
          <Skeleton height={40} className="w-full" />
          <Skeleton width={120} height={36} />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function SettingsPage() {
  const { data, isLoading, email } = useDashboard();
  const { logout, session } = usePasskey();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (!data || !email) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-[var(--color-vc-text-tertiary)]">
          Unable to load settings. Please try again.
        </p>
      </div>
    );
  }

  const { customer } = data;

  return (
    <div className="space-y-6 max-w-2xl">
      <FaxConfigSection
        email={email}
        sessionToken={session?.sessionToken ?? ''}
        faxNumber={customer.faxNumber}
        accessKeyConfigured={customer.humbleFaxAccessKey === '***configured***'}
        secretKeyConfigured={customer.humbleFaxSecretKey === '***configured***'}
      />

      <AiConfigSection
        email={email}
        sessionToken={session?.sessionToken ?? ''}
        geminiKeyConfigured={customer.geminiApiKey === '***configured***'}
      />

      <WebhookSection sessionToken={session?.sessionToken} />

      <AccountSection
        email={email}
        plan={customer.plan}
        onLogout={logout}
      />
    </div>
  );
}
