'use client';

import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Info } from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { usePasskey } from '@/hooks/use-passkey';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

import { RecipientSection } from './recipient-section';
import { MessageSection } from './message-section';
import { SendFormActions } from './send-form-actions';
import { SubscribeModal } from './subscribe-modal';
import { SendTips } from './send-tips';
import { SuccessConfirmation } from './success-confirmation';
import { StepIndicators } from './step-indicators';
import {
  type FormState,
  type PageStatus,
  INITIAL_FORM,
  SEND_ELIGIBLE_PLANS,
  isValidUSPhone,
} from './types';

/* ----------------------------------------
   Loading Skeleton
   ---------------------------------------- */

function SendSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="dash-card space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton width={100} height={12} />
            <Skeleton height={44} className="w-full" />
          </div>
        ))}
        <Skeleton width={140} height={44} className="rounded-full" />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Page Component
   ---------------------------------------- */

export default function SendFaxPage() {
  const { data, isLoading } = useDashboard();
  const { isAuthenticated, session } = usePasskey();
  const createFax = useMutation(api.outboundFax.createOutboundFax);
  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<PageStatus>('idle');
  const [faxId, setFaxId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
  const [uploadedR2Key, setUploadedR2Key] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const getUploadUrl = useAction(api.r2.getPresignedUploadUrl);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  useEffect(() => {
    return () => {
      xhrRef.current?.abort();
    };
  }, []);

  /* Form handlers */
  const updateField = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setStatus('idle');
    setFaxId('');
    setErrorMessage('');
    setSelectedFile(null);
    setUploadProgress(undefined);
    setUploadedR2Key('');
    setUploadedFileName('');
  }, []);

  /* File upload handlers */
  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);

    if (!data?.customer?.email) return;

    try {
      setUploadProgress(0);

      const { uploadUrl, objectKey } = await getUploadUrl({
        email: data.customer.email,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        direction: 'outbound',
      });

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          xhrRef.current = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };
        xhr.onerror = () => {
          xhrRef.current = null;
          reject(new Error('Upload failed'));
        };
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      setUploadedR2Key(objectKey);
      setUploadedFileName(file.name);
      setUploadProgress(100);
    } catch (err) {
      setUploadProgress(undefined);
      setSelectedFile(null);
      setErrorMessage(err instanceof Error ? err.message : 'File upload failed');
      setStatus('error');
    }
  }, [data, getUploadUrl]);

  const handleFileRemoved = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(undefined);
    setUploadedR2Key('');
    setUploadedFileName('');
  }, []);

  /* Subscribe handler */
  const handleSubscribe = useCallback(
    async (plan: 'business' | 'enterprise') => {
      if (!data?.customer.email) return;

      setIsRedirecting(true);
      try {
        const result = await createCheckout({
          email: data.customer.email,
          plan,
          billingCycle: 'monthly',
          successUrl: `${window.location.origin}/dashboard/send?payment=success`,
          cancelUrl: `${window.location.origin}/dashboard/send`,
        });
        if (result?.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        }
      } catch {
        setIsRedirecting(false);
      }
    },
    [data, createCheckout],
  );

  /* Submit */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!data?.customer._id) return;

      const customerPlan = data.customer.plan.toLowerCase();
      const canSend = SEND_ELIGIBLE_PLANS.includes(
        customerPlan as (typeof SEND_ELIGIBLE_PLANS)[number],
      );
      if (!canSend) {
        setShowSubscribeModal(true);
        return;
      }

      if (!isValidUSPhone(form.recipientNumber)) {
        setErrorMessage('Please enter a valid US phone number (10 digits).');
        setStatus('error');
        return;
      }

      setStatus('submitting');
      setErrorMessage('');

      try {
        const result = await createFax({
          sessionToken: session!.sessionToken,
          recipientNumber: form.recipientNumber.replace(/\D/g, ''),
          recipientName: form.recipientName || undefined,
          subject: form.subject || undefined,
          message: form.message || undefined,
          r2ObjectKey: uploadedR2Key || undefined,
          fileName: uploadedFileName || undefined,
          fileSize: selectedFile?.size,
          mimeType: selectedFile?.type,
        });

        setFaxId(String(result));
        setStatus('success');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to send fax. Please try again.';
        setErrorMessage(message);
        setStatus('error');
      }
    },
    [data, form, createFax, session, uploadedR2Key, uploadedFileName, selectedFile],
  );

  /* Loading gate */
  if (isLoading) {
    return <SendSkeleton />;
  }

  /* No account */
  if (!data) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-sm text-[var(--color-vc-text-secondary)]">
          No account found. Please sign up for a plan.
        </p>
      </div>
    );
  }

  const isDemo = !isAuthenticated;

  /* Success state */
  if (status === 'success') {
    return <SuccessConfirmation faxId={faxId} onSendAnother={resetForm} />;
  }

  /* Send form */
  return (
    <div className="max-w-5xl">
      {/* Hero header */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center sm:justify-between',
          'gap-4 mb-8',
        )}
      >
        <div className="flex items-start gap-3">
          <span
            className="w-[3px] h-10 shrink-0 rounded-full bg-[var(--color-vc-accent)]"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-xl font-black text-[var(--color-vc-text)]">
              Send a Fax
            </h2>
            <p className="text-sm text-[var(--color-vc-text-secondary)] mt-0.5 leading-relaxed">
              Fill in the details below and we&apos;ll deliver your fax in seconds.
            </p>
          </div>
        </div>
        <StepIndicators />
      </div>

      {/* Main grid: form + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Info box */}
              <div
                className={cn(
                  'flex items-start gap-2.5 p-3',
                  'bg-[var(--color-vc-surface)]',
                  'border border-[var(--color-vc-border)]',
                  'rounded-[var(--radius-md)]',
                )}
              >
                <Info
                  size={14}
                  className="shrink-0 mt-0.5 text-[var(--color-vc-text-tertiary)]"
                  aria-hidden="true"
                />
                <p className="text-[12px] text-[var(--color-vc-text-secondary)] leading-relaxed">
                  Faxes are sent via our secure network and typically deliver
                  within 60 seconds.
                </p>
              </div>

              <RecipientSection
                form={form}
                onFieldChange={updateField}
              />

              <MessageSection
                form={form}
                onFieldChange={updateField}
                onFileSelected={handleFileSelected}
                onFileRemoved={handleFileRemoved}
                maxSizeMB={data.customer.plan === 'enterprise' ? 50 : 20}
                uploadProgress={uploadProgress}
                uploadedFileName={uploadedFileName || undefined}
                isSubmitting={status === 'submitting'}
              />

              <SendFormActions
                status={status}
                errorMessage={errorMessage}
                isRecipientEmpty={!form.recipientNumber.trim()}
              />
            </form>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <SendTips />
        </div>
      </div>

      {/* Subscribe modal */}
      {showSubscribeModal && (
        <SubscribeModal
          onClose={() => setShowSubscribeModal(false)}
          onSubscribe={handleSubscribe}
          isRedirecting={isRedirecting}
          isDemo={isDemo}
        />
      )}
    </div>
  );
}
