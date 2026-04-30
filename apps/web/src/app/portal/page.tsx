/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, sonarjs/prefer-regexp-exec, @typescript-eslint/no-unnecessary-type-arguments, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises, @typescript-eslint/no-dynamic-delete, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion */
"use client";

/**
 * Customer Portal — Complete application wizard + documents + messaging
 * Split into multiple components for maintainability
 */

import { Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

import { ContactSection } from "./components/ContactSection";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { MessagesThread } from "./components/MessagesThread";
import { MultiFileUpload } from "./components/MultiFileUpload";
import { PortalHeader } from "./components/PortalHeader";
import { StepAboutYou } from "./components/steps/StepAboutYou";
import { StepBanking } from "./components/steps/StepBanking";
import { StepBusiness } from "./components/steps/StepBusiness";
import { StepDocuments } from "./components/steps/StepDocuments";
import { StepProcessing } from "./components/steps/StepProcessing";
import { StepProducts } from "./components/steps/StepProducts";
import { SubmittedState } from "./components/SubmittedState";
import { TabNavigation } from "./components/TabNavigation";
import { WelcomeSection } from "./components/WelcomeSection";
import { WizardNavigation } from "./components/WizardNavigation";
import { INITIAL_FORM, TOTAL_STEPS } from "./constants";
import { useAutosave } from "./hooks/useAutosave";
import type { FormData, PortalUpload, Submission } from "./types";
import { validateStep, FieldErrors, hasErrors } from "./validation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

type TabType = "application" | "documents" | "messages";

function PortalContent() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    searchParams.get("token") || getCookie("portal_token")
  );

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [customRequirements, setCustomRequirements] = useState<Record<string, boolean> | null>(null);

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("application");

  const {
    save: autosave,
    saveStatus,
    pause: pauseAutosave,
    clearError: clearAutosaveError,
  } = useAutosave(token);

  const verifyToken = useCallback(async () => {
    // Get token from URL param or cookie
    const urlToken = searchParams.get("token") || getCookie("portal_token");

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (urlToken) headers["Authorization"] = `Bearer ${urlToken}`;

      // Use absolute URL to avoid redirect issues
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}/api/portal/verify`, {
        method: "POST",
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        let errorMsg = "Failed to verify access";
        if (res.status === 404) {
          errorMsg = "Portal service not found. Please contact support.";
          console.error("[Portal] API endpoint not found - 404 response");
        } else if (res.status === 401) {
          errorMsg = "Invalid or expired access link. Please request a new link.";
        } else if (res.status === 503) {
          errorMsg = "Portal service temporarily unavailable. Please try again later.";
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const result = await res.json();

      if (!res.ok || !result.valid) {
        const errorMessage = result.error || `Access denied (${res.status})`;
        console.error("[Portal] Verification failed:", errorMessage);
        setError(
          result.error ||
            (urlToken
              ? `Access denied: ${errorMessage}`
              : "No access link provided. Please use the link from your email to access the portal.")
        );
        setLoading(false);
        return;
      }

      if (urlToken) {
        setToken(urlToken);
        // CRITICAL: Do NOT strip the token from the URL.
        // Users may open the email in their email app's browser, then tap
        // "Open in Safari/Chrome" — the new browser won't have the httpOnly
        // cookie, but WILL have the token in the URL. Keep it always.
        // The token is HMAC-SHA256 signed, 30-day expiry, safe to keep in URL.

        // Also store in httpOnly cookie as fallback for same-browser navigation
        try {
          await fetch("/api/portal/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: urlToken }),
          });
        } catch {
          // Cookie storage failed — URL token will handle auth
        }
      }

      setData(result);

      if (result.isSubmitted) {
        setSubmitted(true);
      }

      if (result.fieldRequirements) {
        setCustomRequirements(result.fieldRequirements);
      }

      const sub = result.submission;
      const auto = result.autosaveData || {};
      setForm((prev) => ({
        ...prev,
        ownerName: sub.ownerName || sub.name || auto.ownerName || "",
        ownerEmail: sub.ownerEmail || sub.email || auto.ownerEmail || "",
        ownerPhone: sub.ownerPhone || sub.phone || auto.ownerPhone || "",
        businessName: sub.businessName || sub.company || auto.businessName || "",
        industry: sub.industry || auto.industry || "",
        monthlyVolume: sub.monthlyVolume || auto.monthlyVolume || "",
        businessType: sub.businessType || auto.businessType || "",
        website: sub.website || auto.website || "",
        yearsInBusiness: sub.yearsInBusiness || auto.yearsInBusiness || "",
        businessAddress: sub.businessAddress || auto.businessAddress || "",
        businessCity: sub.businessCity || auto.businessCity || "",
        businessState: sub.businessState || auto.businessState || "",
        businessZip: sub.businessZip || auto.businessZip || "",
        additionalNotes: sub.additionalNotes || auto.additionalNotes || "",
        ...Object.fromEntries(
          Object.entries(auto).filter(([k]) => !k.startsWith("_") && k in INITIAL_FORM)
        ),
      }));

      if (auto._lastStep && typeof auto._lastStep === "number") {
        setStep(Math.min(auto._lastStep, TOTAL_STEPS - 1));
      }

      setLoading(false);
    } catch {
      setError("Failed to verify access. Please try again.");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [step]);

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      setForm((prev) => {
        const updated = { ...prev, [field]: value };
        const newErrors = validateStep(step, updated, customRequirements ?? undefined);
        setErrors((prevErrors) => {
          const filtered = { ...prevErrors };
          for (const key of Object.keys(newErrors)) {
            if (newErrors[key as keyof FormData]) {
              filtered[key as keyof FormData] = newErrors[key as keyof FormData];
            } else {
              delete filtered[key as keyof FormData];
            }
          }
          return filtered;
        });
        return updated;
      });
      autosave(field, value, step);
    },
    [autosave, step, customRequirements]
  );

  const validateAndNext = useCallback(() => {
    const stepErrors = validateStep(step, form, customRequirements ?? undefined);
    setErrors(stepErrors);
    if (!hasErrors(stepErrors)) {
      setStep((s) => s + 1);
    }
  }, [step, form, customRequirements]);

  const handleUploadComplete = useCallback(
    (file: { id: string; name: string; contentType: string; size: number; uploadedAt: string }) => {
      setData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          uploads: [
            {
              id: file.id,
              original_name: file.name,
              content_type: file.contentType || "",
              file_size: file.size,
              created_at: file.uploadedAt,
            },
            ...prev.uploads,
          ],
        };
      });
    },
    []
  );

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !token) return;
    setSendingMessage(true);
    setMessageError(null);
    try {
      const res = await fetch("/api/portal/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: message.trim() }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: result.message.id,
                sender: "client" as const,
                message: message.trim(),
                created_at: result.message.createdAt,
              },
            ],
          };
        });
        setMessage("");
      } else {
        setMessageError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setMessageError("Network error. Please check your connection and try again.");
    } finally {
      setSendingMessage(false);
    }
  }, [message, token]);

  const handleSubmit = useCallback(async () => {
    if (!token || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    pauseAutosave();
    try {
      const formData = new FormData();
      formData.append("name", form.ownerName || "");
      formData.append("email", form.ownerEmail || "");
      formData.append("phone", form.ownerPhone || "");
      formData.append("company", form.businessName || "");
      formData.append("message", "Full application submitted via portal");
      formData.append("source", "portal");
      for (const [key, value] of Object.entries(form)) {
        if (value) formData.append(key, value);
      }
      const res = await fetch("/api/portal/submit-application", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const result = await res.json().catch(() => null);
        const errMsg =
          result?.error ||
          `Submission failed (HTTP ${res.status}). Please try again or contact support.`;
        setSubmitError(errMsg);
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form, token, submitting, pauseAutosave]);

  if (error)
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          verifyToken();
        }}
      />
    );
  if (loading || !data) return <LoadingState />;
  if (submitted) return <SubmittedState />;

  const d = data as any;
  const sub = d.submission as Submission;
  const uploads = (d.uploads || []) as PortalUpload[];
  const messages = d.messages || [];
  const portal = d.portal as {
    email: string;
    expiresAt: string;
    daysLeft: number;
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      <PortalHeader />

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:space-y-6 sm:py-8">
        <WelcomeSection submission={sub} daysLeft={portal.daysLeft} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {saveStatus === "error" && activeTab === "application" && (
          <div
            role="alert"
            className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-600"
          >
            <span>Your progress may not be saving. Check your connection.</span>
            <button
              type="button"
              onClick={clearAutosaveError}
              className="text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}
        {saveStatus === "saving" && activeTab === "application" && (
          <div aria-live="polite" className="text-text-tertiary flex items-center gap-1.5 text-xs">
            <span className="bg-text-tertiary/60 inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
            Saving…
          </div>
        )}
        {saveStatus === "saved" && activeTab === "application" && (
          <div aria-live="polite" className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            Saved
          </div>
        )}

        {activeTab === "application" && (
          <div className="space-y-6">
            <div className="bg-bg-secondary border-border-primary rounded-xl border p-4 sm:p-6">
              {step === 0 && (
                <StepAboutYou data={form} onChange={handleFieldChange} errors={errors} />
              )}
              {step === 1 && (
                <StepBusiness data={form} onChange={handleFieldChange} errors={errors} />
              )}
              {step === 2 && (
                <StepProcessing data={form} onChange={handleFieldChange} errors={errors} />
              )}
              {step === 3 && (
                <StepBanking data={form} onChange={handleFieldChange} errors={errors} />
              )}
              {step === 4 && (
                <StepProducts data={form} onChange={handleFieldChange} errors={errors} />
              )}
              {step === 5 && (
                <StepDocuments
                  token={token!}
                  uploads={uploads}
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </div>
            <WizardNavigation
              step={step}
              onStepChange={setStep}
              onBack={() => {
                setErrors({});
                setStep((s) => s - 1);
              }}
              onNext={validateAndNext}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
            />
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-bg-secondary border-border-primary space-y-4 rounded-xl border p-4 sm:p-6">
            <h2 className="text-text-primary text-lg font-bold">Additional Documents</h2>
            <p className="text-text-secondary text-sm">
              Need to upload more documents? You can add them here anytime.
            </p>
            <MultiFileUpload
              token={token!}
              uploads={uploads}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        )}

        {activeTab === "messages" && (
          <MessagesThread
            messages={messages}
            message={message}
            onMessageChange={setMessage}
            onSend={handleSendMessage}
            sending={sendingMessage}
            error={messageError}
            onErrorDismiss={() => setMessageError(null)}
          />
        )}

        <ContactSection />
      </main>

      {/* Secure portal footer */}
      <footer className="border-border-primary bg-bg-secondary border-t py-6 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-text-tertiary mb-3 flex items-center justify-center gap-2 text-xs">
            <Lock className="text-brand-teal h-3.5 w-3.5" />
            <span>
              256-bit AES encryption &middot; Bank-grade data handling &middot; Secure link expires
              in {portal.daysLeft} day{portal.daysLeft === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-text-tertiary text-[10px] uppercase tracking-wider">
            Cybin Enterprises Secure Portal &middot; Isolated Session
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PortalContent />
    </Suspense>
  );
}
