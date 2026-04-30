'use client';

import { useState } from 'react';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import { FieldRequirementsSelector } from '../FieldRequirementsSelector';
import { DEFAULT_FIELD_REQUIREMENTS } from '@/app/portal/validation';

interface CustomPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerEmail?: string;
  customerName?: string;
  submissionId?: string;
  existingRequirements?: Record<string, boolean>;
  onSend: (requirements: Record<string, boolean>) => Promise<void>;
}

export function CustomPortalModal({
  isOpen,
  onClose,
  customerEmail,
  customerName,
  submissionId,
  existingRequirements,
  onSend,
}: CustomPortalModalProps) {
  const [requirements, setRequirements] = useState<Record<string, boolean>>(
    existingRequirements || DEFAULT_FIELD_REQUIREMENTS
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSending(true);
    setError(null);
    try {
      await onSend(requirements);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send portal link');
    } finally {
      setIsSending(false);
    }
  };

  const requiredCount = Object.values(requirements).filter(v => v).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Send Custom Portal Link</h2>
            {customerName && (
              <p className="text-sm text-text-secondary">for {customerName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {customerEmail && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {customerEmail}
              </p>
              {submissionId && (
                <p className="text-xs text-blue-600 mt-1">
                  Submission ID: {submissionId}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <FieldRequirementsSelector
            value={requirements}
            onChange={setRequirements}
          />
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {requiredCount} fields will be required
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Portal Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}