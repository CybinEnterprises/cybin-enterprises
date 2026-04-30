"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  FileDown,
  Inbox,
  Loader2,
  Send,
  Trash2,
} from "lucide-react";
import type { ReactElement } from "react";

import type { SortDirection, SortField } from "../hooks/useAdminSubmissions";
import type { Submission } from "../types";

import { formatRelativeTime } from "@/lib/admin/format-relative-time";
import { getStatusTokens, PIPELINE_STAGES, STATUS_TOKENS } from "@/lib/admin/status-tokens";

interface SubmissionsTableProps {
  submissions: Submission[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onView: (sub: Submission) => void;
  onExport: (ids: string[], format: string) => void;
  onDelete: (sub: Submission) => void;
  onSendCustomPortal?: (sub: Submission) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
  deleting: string | null;
  exporting: boolean;
  /** Used by the empty state to decide which message to show. */
  hasFilters?: boolean;
  onClearFilters?: () => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onToggleSort?: (field: SortField) => void;
}

function portalIndicator(sub: Submission): { color: string; label: string } {
  if (sub.portal_link_accessed_at) {
    return { color: "bg-success", label: "Portal accessed by client" };
  }
  if (sub.portal_link_sent_at) {
    return { color: "bg-warn", label: "Portal link sent, not yet accessed" };
  }
  return { color: "bg-text-subtle", label: "Portal link not sent" };
}

function assigneeInitials(email: string | null | undefined): string {
  if (!email) return "";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return local.slice(0, 2).toUpperCase();
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  return ((parts[0] ?? "").charAt(0) + (parts[1] ?? "").charAt(0)).toUpperCase();
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}): ReactElement {
  if (!active) return <ArrowUpDown className="text-text-subtle h-3 w-3" aria-hidden />;
  return direction === "asc" ? (
    <ArrowUp className="text-text-1 h-3 w-3" aria-hidden />
  ) : (
    <ArrowDown className="text-text-1 h-3 w-3" aria-hidden />
  );
}

export function SubmissionsTable({
  submissions,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onExport,
  onDelete,
  onSendCustomPortal,
  onStatusChange,
  deleting,
  exporting,
  hasFilters = false,
  onClearFilters,
  sortField = "created_at",
  sortDirection = "desc",
  onToggleSort,
}: SubmissionsTableProps) {
  const allSelected = submissions.length > 0 && selectedIds.size === submissions.length;

  const ariaSortFor = (field: SortField): "ascending" | "descending" | "none" => {
    if (sortField !== field) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  const headerButton = (field: SortField, label: string): ReactElement => {
    if (!onToggleSort) {
      return (
        <span className="text-text-muted text-[11px] font-medium uppercase tracking-wider">
          {label}
        </span>
      );
    }
    const active = sortField === field;
    let ariaLabel = `Sort by ${label}`;
    if (active) {
      ariaLabel =
        sortDirection === "asc"
          ? `${label}, sorted ascending (click to reverse)`
          : `${label}, sorted descending (click to reverse)`;
    }
    return (
      <button
        type="button"
        onClick={() => {
          onToggleSort(field);
        }}
        className="text-text-muted hover:text-text-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors"
        aria-label={ariaLabel}
      >
        {label}
        <SortIcon active={active} direction={sortDirection} />
      </button>
    );
  };

  return (
    <div className="border-border bg-surface-1 overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="divide-border w-full min-w-[1160px] divide-y">
          <thead className="bg-surface-1/60">
            <tr>
              <th scope="col" className="w-10 px-4 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label={`Select all ${String(submissions.length)} visible applications`}
                  className="border-border-strong bg-surface-2 h-4 w-4 rounded accent-[var(--admin-accent)]"
                />
              </th>
              <th scope="col" aria-sort={ariaSortFor("name")} className="px-4 py-2.5 text-left">
                {headerButton("name", "Merchant")}
              </th>
              <th
                scope="col"
                className="text-text-muted px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider"
              >
                Business
              </th>
              <th
                scope="col"
                className="text-text-muted px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider"
                title="Self-reported monthly processing volume"
              >
                Volume
              </th>
              <th
                scope="col"
                aria-sort={ariaSortFor("created_at")}
                className="px-4 py-2.5 text-left"
              >
                {headerButton("created_at", "Submitted")}
              </th>
              <th
                scope="col"
                className="text-text-muted px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider"
              >
                Stage
              </th>
              <th
                scope="col"
                className="text-text-muted px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider"
              >
                Assignee
              </th>
              <th
                scope="col"
                className="text-text-muted px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider"
              >
                Portal
              </th>
              <th
                scope="col"
                className="text-text-muted px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {submissions.map((sub) => {
              const portal = portalIndicator(sub);
              const token = getStatusTokens(sub.status);
              return (
                <tr
                  key={sub.id}
                  onClick={() => {
                    onView(sub);
                  }}
                  className="hover:bg-surface-2/50 cursor-pointer border-l-2 border-l-transparent transition-colors"
                >
                  <td
                    className="px-4 py-2.5"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sub.id)}
                      onChange={() => {
                        onToggleSelect(sub.id);
                      }}
                      aria-label={`Select ${sub.name}`}
                      className="border-border-strong bg-surface-2 h-4 w-4 rounded accent-[var(--admin-accent)]"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-text-1 text-sm font-medium">{sub.name}</span>
                      <span className="text-text-subtle text-xs">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-text-2 text-sm">
                        {sub.business_name ?? sub.company ?? (
                          <span className="text-text-subtle">—</span>
                        )}
                      </span>
                      <span className="text-text-subtle text-xs">{sub.industry ?? "—"}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {sub.monthly_volume ? (
                      <span
                        className="text-text-2 font-mono text-xs"
                        title="Self-reported monthly processing volume"
                      >
                        {sub.monthly_volume}
                      </span>
                    ) : (
                      <span className="text-text-subtle text-xs">—</span>
                    )}
                  </td>
                  <td className="text-text-muted whitespace-nowrap px-4 py-2.5 text-sm">
                    {formatRelativeTime(sub.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {onStatusChange ? (
                      <select
                        value={sub.status}
                        onChange={(e) => {
                          onStatusChange(sub.id, e.target.value);
                        }}
                        aria-label={`Change status for ${sub.name}`}
                        title="Change status"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`cursor-pointer appearance-none rounded-full px-2.5 py-0.5 pr-6 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--admin-ring)] ${token.pillClass}`}
                      >
                        {PIPELINE_STAGES.map((opt) => (
                          <option key={opt} value={opt}>
                            {STATUS_TOKENS[opt].label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${token.pillClass}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${token.dotClass}`}
                          aria-hidden
                        />
                        {token.label}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {sub.assigned_to ? (
                      <span
                        title={sub.assigned_to}
                        className="bg-accent-soft text-accent ring-accent/30 inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-1 ring-inset"
                      >
                        {assigneeInitials(sub.assigned_to)}
                      </span>
                    ) : (
                      <span className="text-text-subtle text-sm">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${portal.color}`}
                      aria-label={portal.label}
                      title={portal.label}
                    />
                  </td>
                  <td
                    className="whitespace-nowrap px-4 py-2.5"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onView(sub);
                        }}
                        className="border-border bg-surface-1 text-text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
                        title={`View ${sub.name}`}
                        aria-label={`View ${sub.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {onSendCustomPortal && (
                        <button
                          type="button"
                          onClick={() => {
                            onSendCustomPortal(sub);
                          }}
                          className="border-border bg-surface-1 text-text-muted hover:border-brand-teal/40 hover:bg-brand-teal-soft hover:text-brand-teal flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
                          title={`Send custom portal link to ${sub.name}`}
                          aria-label={`Send custom portal link to ${sub.name}`}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onExport([sub.id], "pdf");
                        }}
                        disabled={exporting}
                        className="border-border bg-surface-1 text-text-muted hover:border-border-strong hover:text-text-1 flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        title={`Export ${sub.name} as PDF`}
                        aria-label={`Export ${sub.name} as PDF`}
                      >
                        <FileDown className="h-4 w-4" />
                      </button>
                      <span className="bg-border mx-1 h-4 w-px" aria-hidden />
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(sub);
                        }}
                        disabled={deleting === sub.id}
                        className="border-border bg-surface-1 text-text-muted hover:border-danger/40 hover:bg-danger-soft hover:text-danger-fg flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        title={`Delete ${sub.name}`}
                        aria-label={`Delete ${sub.name}`}
                      >
                        {deleting === sub.id ? (
                          <Loader2 className="text-danger-fg h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <Inbox className="text-text-subtle h-10 w-10" aria-hidden />
          <div>
            <p className="text-text-1 text-sm font-medium">No applications found</p>
            <p className="text-text-muted mt-1 text-xs">
              {hasFilters
                ? "Try a different search or clear the status filter."
                : "Waiting for your first application — new submissions will show up here."}
            </p>
          </div>
          {hasFilters && onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="border-border bg-surface-1 text-text-2 hover:border-border-strong hover:text-text-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Adjust filters
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
