"use client";

/**
 * Admin Dashboard - Split into components for maintainability
 */

import { createClient } from "@repo/db/client";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConfirmDialog } from "../components/ConfirmDialog";
import { CustomPortalModal } from "../components/CustomPortalModal";

import { BulkActionsMenu } from "./components/BulkActionsMenu";
import { SearchFilter } from "./components/SearchFilter";
import { StatsBar } from "./components/StatsBar";
import { SubmissionModal } from "./components/SubmissionModal";
import { SubmissionsCards } from "./components/SubmissionsCards";
import { SubmissionsTable } from "./components/SubmissionsTable";
import { PAGE_SIZE } from "./constants";
import { useAdminSubmissions } from "./hooks/useAdminSubmissions";
import type { PortalActivity, PortalMessage, PortalUpload, Submission } from "./types";

import { useCurrentAdmin } from "@/lib/admin/use-current-admin";

interface PortalActivityResponse {
  uploads: PortalUpload[];
  messages: PortalMessage[];
}

interface PortalLinkResponse {
  success?: boolean;
  message?: string;
  sandbox?: boolean;
  portalUrl?: string;
  alreadySent?: boolean;
  sentCount?: number;
  error?: string;
}

interface ReplyResponse {
  success?: boolean;
  message?: { id: string; created_at: string };
  error?: string;
}

export default function AdminDashboard() {
  const {
    submissions,
    loading,
    initialLoad,
    error,
    success,
    selected,
    setSelected,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    assigneeFilter,
    setAssigneeFilter,
    sortField,
    sortDirection,
    toggleSort,
    deleting,
    selectedIds,
    showBulkMenu,
    setShowBulkMenu,
    page,
    setPage,
    totalCount,
    stats,
    fetchSubmissions,
    deleteSubmission,
    bulkDelete,
    bulkStatus,
    bulkSendPortalLink,
    updateStatus,
    exportSubmissions,
    exporting,
    toggleSelect,
    toggleSelectAll,
    setError,
    setSuccess,
  } = useAdminSubmissions();

  const { email: currentAdminEmail } = useCurrentAdmin();

  // Delete confirmation state — replaces browser confirm()
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  // Portal resend confirmation (replaces confirm() in sendPortalLink flow)
  const [resendPrompt, setResendPrompt] = useState<{ sub: Submission; sentCount: number } | null>(
    null
  );
  // Custom portal link modal
  const [customPortalSub, setCustomPortalSub] = useState<Submission | null>(null);
  const [sendingCustomPortal, setSendingCustomPortal] = useState(false);

  const [sandboxPortalUrl, setSandboxPortalUrl] = useState<string | null>(null);
  const [portalActivity, setPortalActivity] = useState<PortalActivity>({
    files: 0,
    messages: 0,
    uploads: [],
    messagesList: [],
  });
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalCopied, setPortalCopied] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const getToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || "";
  }, [supabase]);

  const fetchPortalActivity = useCallback(
    async (submissionId: string) => {
      setPortalLoading(true);
      try {
        const res = await fetch(`/api/admin/submissions/${submissionId}/portal-activity`, {
          credentials: "include",
        });
        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(
            errData.error ?? `Failed to load portal activity (${String(res.status)})`
          );
        }
        const data = (await res.json()) as PortalActivityResponse;
        setPortalActivity({
          files: data.uploads.length,
          messages: data.messages.length,
          uploads: data.uploads,
          messagesList: data.messages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load portal activity");
        setPortalActivity({ files: 0, messages: 0, uploads: [], messagesList: [] });
      } finally {
        setPortalLoading(false);
      }
    },
    [setError]
  );

  const sendCustomPortalLink = useCallback(
    async (requirements: Record<string, boolean>) => {
      if (!customPortalSub?.id) {
        setError("No submission selected");
        return;
      }
      setSendingCustomPortal(true);
      try {
        const res = await fetch("/api/admin/submissions/send-custom-portal", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: customPortalSub.id,
            requirements,
            sendEmail: true,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("Custom portal link sent to " + (customPortalSub.email || customPortalSub.name));
          void fetchSubmissions(page);
        } else {
          setError(data.error ?? "Failed to send custom portal link");
        }
      } catch (err) {
        setError(
          "Failed to send custom portal link: " + (err instanceof Error ? err.message : "Unknown error")
        );
      } finally {
        setSendingCustomPortal(false);
      }
    },
    [customPortalSub, fetchSubmissions, page, setError, setSuccess]
  );

  const sendPortalLink = useCallback(
    async (sub: Submission, forceResend = false) => {
      if (!sub.id) {
        setError("No submission ID found");
        return;
      }
      try {
        const submissionId = sub.id.trim();

        const res = await fetch("/api/admin/submissions/send-portal-link", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId, forceResend }),
        });
        if (!res.ok && res.status === 401) {
          window.location.href = `/admin/login?redirect=/admin/dashboard`;
          return;
        }
        const data = (await res.json()) as PortalLinkResponse;

        if (data.success) {
          setSuccess(data.message ?? "Portal link sent");
          setPortalCopied(sub.id);
          if (data.sandbox === true && data.portalUrl) {
            setSandboxPortalUrl(data.portalUrl);
          }
          // Sandbox URL (dev) stays visible until dismissed so it can be copied;
          // the success banner and "Sent!" button hint fade after 7s.
          setTimeout(() => {
            setPortalCopied(null);
            setSuccess(null);
          }, 7000);
          void fetchSubmissions(page);
        } else if (data.alreadySent === true) {
          setResendPrompt({ sub, sentCount: data.sentCount ?? 0 });
        } else {
          setError(data.error ?? "Failed to send portal link");
        }
      } catch (err) {
        setError(
          "Failed to send portal link: " + (err instanceof Error ? err.message : "Unknown error")
        );
      }
    },
    [fetchSubmissions, page, setError, setSuccess]
  );

  const sendReply = useCallback(
    async (submissionId: string) => {
      if (!replyText.trim()) return;
      setSendingReply(true);
      try {
        const token = await getToken();
        const res = await fetch(`/api/admin/submissions/${submissionId}/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: replyText.trim() }),
        });
        const result = (await res.json()) as ReplyResponse;
        if (res.ok && result.success === true) {
          setPortalActivity((prev) => ({
            ...prev,
            messages: prev.messages + 1,
            messagesList: [
              ...prev.messagesList,
              {
                id: result.message?.id ?? "",
                sender: "admin",
                message: replyText.trim(),
                created_at: result.message?.created_at ?? new Date().toISOString(),
              },
            ],
          }));
          setReplyText("");
          setSuccess("Reply sent");
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        } else {
          setError(result.error ?? "Failed to send reply");
        }
      } catch {
        setError("Failed to send reply");
      } finally {
        setSendingReply(false);
      }
    },
    [replyText, getToken, setError, setSuccess]
  );

  const handleView = useCallback(
    (sub: Submission) => {
      setSelected(sub);
      setPortalActivity({
        files: 0,
        messages: 0,
        uploads: [],
        messagesList: [],
      });
      void fetchPortalActivity(sub.id);
    },
    [setSelected, fetchPortalActivity]
  );

  // Deep link: /admin/dashboard?id=<submissionId> opens that submission.
  // Only fires once per id (tracked in a ref) so users can close the modal
  // without it reopening on every render.
  const searchParams = useSearchParams();
  const deepLinkHandled = useRef<string | null>(null);
  useEffect(() => {
    const targetId = searchParams.get("id");
    if (!targetId || deepLinkHandled.current === targetId) return;
    const match = submissions.find((s) => s.id === targetId);
    if (match) {
      deepLinkHandled.current = targetId;
      handleView(match);
    }
  }, [searchParams, submissions, handleView]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setAssigneeFilter(null);
  }, [setSearchTerm, setStatusFilter, setAssigneeFilter]);

  const toggleMyQueue = useCallback(() => {
    if (!currentAdminEmail) return;
    setAssigneeFilter((prev) => (prev ? null : currentAdminEmail));
  }, [currentAdminEmail, setAssigneeFilter]);

  // Only show full-page spinner on the very first load, not on every background refresh.
  // Subsequent refreshes (filter changes, pagination, manual refresh) keep the table
  // visible so the user can still interact with submissions already loaded.
  if (initialLoad && loading) {
    return (
      <div
        className="flex h-64 items-center justify-center"
        role="status"
        aria-label="Loading applications"
      >
        <Loader2 className="text-accent h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasFilters =
    searchTerm.trim().length > 0 || statusFilter !== "all" || assigneeFilter !== null;

  return (
    <div className="mx-auto max-w-7xl p-6 pt-0 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-text-1 text-2xl font-semibold">Applications</h1>
          <p className="text-text-muted mt-1 text-sm">Merchant application pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <BulkActionsMenu
              selectedCount={selectedIds.size}
              showMenu={showBulkMenu}
              onToggle={() => {
                setShowBulkMenu(!showBulkMenu);
              }}
              onExportJson={() => {
                void exportSubmissions(Array.from(selectedIds), "json");
              }}
              onExportCsv={() => {
                void exportSubmissions(Array.from(selectedIds), "csv");
              }}
              onExportPdf={() => {
                void exportSubmissions(Array.from(selectedIds), "pdf");
              }}
              onMarkContacted={() => {
                void bulkStatus("contacted");
              }}
              onMarkQualified={() => {
                void bulkStatus("qualified");
              }}
              onMarkArchived={() => {
                void bulkStatus("archived");
              }}
              onSendPortalLink={() => {
                void bulkSendPortalLink();
              }}
              onDeleteAll={() => {
                setBulkDeleteOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="border-danger/30 bg-danger-soft mb-4 flex items-center gap-3 rounded-lg border p-3">
          <AlertCircle className="text-danger-fg h-4 w-4 shrink-0" />
          <p className="text-danger-fg text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
            }}
            className="text-danger-fg ml-auto hover:opacity-80"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="border-success/30 bg-success-soft mb-4 rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-success-fg h-4 w-4 shrink-0" />
            <p className="text-success-fg text-sm">{success}</p>
            <button
              onClick={() => {
                setSuccess(null);
              }}
              className="text-success-fg ml-auto hover:opacity-80"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {sandboxPortalUrl && (
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                value={sandboxPortalUrl}
                aria-label="Sandbox portal URL"
                className="border-border bg-surface-0 text-text-2 flex-1 rounded border px-2 py-1 font-mono text-xs outline-none"
                onClick={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(sandboxPortalUrl);
                  setSandboxPortalUrl(null);
                }}
                className="bg-accent text-accent-fg hover:bg-accent-hover shrink-0 rounded px-2 py-1 text-xs"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}

      <StatsBar stats={stats} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onRefresh={() => {
          void fetchSubmissions(page);
        }}
        refreshing={!initialLoad && loading}
        myQueue={assigneeFilter !== null}
        onToggleMyQueue={toggleMyQueue}
        canFilterMyQueue={currentAdminEmail !== null}
      />

      {/* Desktop Table */}
      <div className="relative hidden md:block">
        {!initialLoad && loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/20">
            <Loader2 className="text-accent h-6 w-6 animate-spin" />
          </div>
        )}
        <SubmissionsTable
          submissions={submissions}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onView={handleView}
          onExport={(ids, fmt) => {
            void exportSubmissions(ids, fmt);
          }}
          onDelete={(sub) => {
            setDeleteTarget(sub);
          }}
          onSendCustomPortal={(sub) => {
            setCustomPortalSub(sub);
          }}
          onStatusChange={(id, newStatus) => {
            void updateStatus(id, newStatus);
          }}
          deleting={deleting}
          exporting={exporting}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
        />
      </div>

      {/* Mobile Cards */}
      <div className="relative md:hidden">
        {!initialLoad && loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/20">
            <Loader2 className="text-accent h-6 w-6 animate-spin" />
          </div>
        )}
        <SubmissionsCards
          submissions={submissions}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onView={handleView}
          onExport={(ids, fmt) => {
            void exportSubmissions(ids, fmt);
          }}
          onDelete={(sub) => {
            setDeleteTarget(sub);
          }}
          onStatusChange={(id, newStatus) => {
            void updateStatus(id, newStatus);
          }}
          deleting={deleting}
          exporting={exporting}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Pagination */}
      {totalCount > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-text-muted text-sm">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of{" "}
            {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={page === 1}
              className="border-border bg-surface-1 text-text-2 hover:border-border-strong hover:text-text-1 rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-text-muted text-sm">
              Page {page} of {Math.ceil(totalCount / PAGE_SIZE)}
            </span>
            <button
              onClick={() => {
                setPage((p) => Math.min(Math.ceil(totalCount / PAGE_SIZE), p + 1));
              }}
              disabled={page >= Math.ceil(totalCount / PAGE_SIZE)}
              className="border-border bg-surface-1 text-text-2 hover:border-border-strong hover:text-text-1 rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <SubmissionModal
            key={selected.id}
            submission={selected}
            portalActivity={portalActivity}
            portalLoading={portalLoading}
            replyText={replyText}
            onReplyChange={setReplyText}
            onSendReply={() => {
              void sendReply(selected.id);
            }}
            sendingReply={sendingReply}
            onSendPortalLink={() => {
              void sendPortalLink(selected);
            }}
            portalCopied={portalCopied}
            onExport={(ids, fmt) => {
              void exportSubmissions(ids, fmt);
            }}
            onDelete={() => {
              setDeleteTarget(selected);
            }}
            onStatusChange={(id, newStatus) => {
              void updateStatus(id, newStatus);
              // Optimistically update the open modal so the badge reflects immediately
              setSelected({ ...selected, status: newStatus });
            }}
            onNotesSaved={(notes) => {
              setSelected({ ...selected, notes });
            }}
            deleting={deleting}
            exporting={exporting}
            onClose={() => {
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Single-submission delete confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete submission?"
        message={
          deleteTarget
            ? `Permanently delete submission from ${deleteTarget.name}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting !== null}
        onConfirm={() => {
          if (deleteTarget) {
            const target = deleteTarget;
            setDeleteTarget(null);
            void deleteSubmission(target);
          }
        }}
        onCancel={() => {
          setDeleteTarget(null);
        }}
      />

      {/* Bulk delete confirmation */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        title={`Delete ${String(selectedIds.size)} submission${selectedIds.size === 1 ? "" : "s"}?`}
        message="All selected submissions will be permanently deleted. This cannot be undone."
        confirmLabel="Delete all"
        destructive
        onConfirm={() => {
          setBulkDeleteOpen(false);
          void bulkDelete();
        }}
        onCancel={() => {
          setBulkDeleteOpen(false);
        }}
      />

      {/* Portal link resend confirmation */}
      <ConfirmDialog
        open={resendPrompt !== null}
        title="Resend portal link?"
        message={
          resendPrompt
            ? `This link has already been sent ${String(resendPrompt.sentCount)} time${resendPrompt.sentCount === 1 ? "" : "s"}. Send it again?`
            : ""
        }
        confirmLabel="Send again"
        onConfirm={() => {
          if (resendPrompt) {
            const { sub } = resendPrompt;
            setResendPrompt(null);
            void sendPortalLink(sub, true);
          }
        }}
        onCancel={() => {
          setResendPrompt(null);
        }}
      />

      {/* Custom portal link modal */}
      <CustomPortalModal
        isOpen={customPortalSub !== null}
        onClose={() => setCustomPortalSub(null)}
        customerEmail={customPortalSub?.email ?? undefined}
        customerName={customPortalSub?.name ?? undefined}
        submissionId={customPortalSub?.id}
        onSend={sendCustomPortalLink}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
