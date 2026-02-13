'use client';

import { MessageSquare, Paperclip } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { FormField } from './form-field';
import { type FormState, TEXTAREA_CLASSES } from './types';

/* ----------------------------------------
   MessageSection -- Message textarea + file upload
   ---------------------------------------- */

interface MessageSectionProps {
  form: FormState;
  onFieldChange: (
    field: keyof FormState,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileSelected: (file: File) => void;
  onFileRemoved: () => void;
  maxSizeMB: number;
  uploadProgress: number | undefined;
  uploadedFileName: string | undefined;
  isSubmitting: boolean;
}

export function MessageSection({
  form,
  onFieldChange,
  onFileSelected,
  onFileRemoved,
  maxSizeMB,
  uploadProgress,
  uploadedFileName,
  isSubmitting,
}: MessageSectionProps) {
  return (
    <>
      {/* Message */}
      <FormField label="Message" icon={MessageSquare} htmlFor="send-message">
        <textarea
          id="send-message"
          className={TEXTAREA_CLASSES}
          placeholder="Type your fax message here..."
          value={form.message}
          onChange={onFieldChange('message')}
          rows={5}
        />
      </FormField>

      {/* File Attachment */}
      <FormField label="Attachment" icon={Paperclip}>
        <FileUpload
          onFileSelected={onFileSelected}
          onFileRemoved={onFileRemoved}
          acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']}
          maxSizeMB={maxSizeMB}
          uploadProgress={uploadProgress}
          uploadedFileName={uploadedFileName}
          disabled={isSubmitting}
          error={undefined}
        />
      </FormField>
    </>
  );
}
