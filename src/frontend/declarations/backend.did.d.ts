/* eslint-disable */

// @ts-nocheck

// This file was generated for Cybin Enterprises Backend v2.0.0
// Professional-grade backend with stable storage, pagination, and audit logging

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

// =============================================================================
// ENUMS AND VARIANTS
// =============================================================================

export type SubmissionStatus = 
  | { New: null }
  | { InProgress: null }
  | { Completed: null }
  | { Archived: null }
  | { Spam: null };

export type ApplicationStatus = 
  | { Pending: null }
  | { UnderReview: null }
  | { Approved: null }
  | { Rejected: null }
  | { NeedsInfo: null };

export type LeadStatus = 
  | { New: null }
  | { Contacted: null }
  | { Qualified: null }
  | { Converted: null }
  | { Unqualified: null };

export type PartnershipType = 
  | { Reseller: null }
  | { Referral: null }
  | { Technology: null }
  | { Strategic: null }
  | { WhiteLabel: null };

export type PartnerStatus = 
  | { New: null }
  | { Contacted: null }
  | { Negotiating: null }
  | { Active: null }
  | { Inactive: null }
  | { Rejected: null };

export type AuditAction = 
  | { Create: null }
  | { Read: null }
  | { Update: null }
  | { Delete: null }
  | { Login: null }
  | { Logout: null }
  | { AdminAction: null };

export type UserRole = 
  | { Anonymous: null }
  | { User: null }
  | { Partner: null }
  | { Admin: null }
  | { SuperAdmin: null };

export type BackendError = 
  | { InvalidInput: string }
  | { NotFound: string }
  | { Unauthorized: string }
  | { Forbidden: string }
  | { RateLimited: string }
  | { InternalError: string }
  | { ValidationError: string };

// Helper to check if result is ok
export function isOk<T>(result: { ok: T } | { err: BackendError }): result is { ok: T } {
  return 'ok' in result;
}

// Helper to extract error message
export function getErrorMessage(result: { ok: unknown } | { err: BackendError }): string | null {
  if ('err' in result) {
    const err = result.err;
    if ('InvalidInput' in err) return err.InvalidInput;
    if ('NotFound' in err) return err.NotFound;
    if ('Unauthorized' in err) return err.Unauthorized;
    if ('Forbidden' in err) return err.Forbidden;
    if ('RateLimited' in err) return err.RateLimited;
    if ('InternalError' in err) return err.InternalError;
    if ('ValidationError' in err) return err.ValidationError;
  }
  return null;
}

// =============================================================================
// CORE TYPES
// =============================================================================

export interface ContactSubmission {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
  timestamp: bigint;
  status: SubmissionStatus;
  notes: [] | [string];
  assignedTo: [] | [Principal];
}

export interface WizardApplication {
  id: bigint;
  industry: string;
  regulatoryHurdle: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  fein: string;
  hasFein: boolean;
  timestamp: bigint;
  status: ApplicationStatus;
  notes: [] | [string];
  assignedTo: [] | [Principal];
}

export interface PartialLead {
  id: bigint;
  email: string;
  industry: string;
  regulatoryHurdle: string;
  timestamp: bigint;
  status: LeadStatus;
  followUpDate: [] | [bigint];
}

export interface BlogPost {
  id: bigint;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  readTime: string;
  publishDate: string;
  published: boolean;
  timestamp: bigint;
  featured: boolean;
  tags: string[];
  seoTitle: [] | [string];
  seoDescription: [] | [string];
  viewCount: bigint;
}

export interface PartnerLead {
  id: bigint;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  description: string;
  timestamp: bigint;
  status: PartnerStatus;
  notes: [] | [string];
  assignedTo: [] | [Principal];
}

export interface AuditLogEntry {
  id: bigint;
  timestamp: bigint;
  action: AuditAction;
  entityType: string;
  entityId: string;
  caller: Principal;
  details: string;
  ipAddress: [] | [string];
}

export interface User {
  id: Principal;
  role: UserRole;
  email: string;
  createdAt: bigint;
  lastLogin: [] | [bigint];
  isActive: boolean;
}

// =============================================================================
// PAGINATION TYPES
// =============================================================================

export interface Page {
  page: bigint;
  pageSize: bigint;
  totalItems: bigint;
  totalPages: bigint;
}

export interface PaginationParams {
  page: bigint;
  pageSize: bigint;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: Page;
}

export type PaginatedContactSubmission = PaginatedResponse<ContactSubmission>;
export type PaginatedWizardApplication = PaginatedResponse<WizardApplication>;
export type PaginatedPartialLead = PaginatedResponse<PartialLead>;
export type PaginatedBlogPost = PaginatedResponse<BlogPost>;
export type PaginatedPartnerLead = PaginatedResponse<PartnerLead>;
export type PaginatedAuditLogEntry = PaginatedResponse<AuditLogEntry>;

// =============================================================================
// RESULT TYPES (for error handling)
// =============================================================================

export type OperationResultNat = { ok: bigint } | { err: BackendError };
export type OperationResultBool = { ok: boolean } | { err: BackendError };
export type OperationResultContactSubmission = { ok: ContactSubmission } | { err: BackendError };
export type OperationResultPaginatedContactSubmission = { ok: PaginatedContactSubmission } | { err: BackendError };
export type OperationResultPaginatedWizardApplication = { ok: PaginatedWizardApplication } | { err: BackendError };
export type OperationResultPaginatedPartialLead = { ok: PaginatedPartialLead } | { err: BackendError };
export type OperationResultPaginatedBlogPost = { ok: PaginatedBlogPost } | { err: BackendError };
export type OperationResultPaginatedPartnerLead = { ok: PaginatedPartnerLead } | { err: BackendError };
export type OperationResultPaginatedAuditLog = { ok: PaginatedAuditLogEntry } | { err: BackendError };
export type OperationResultBlogPost = { ok: BlogPost } | { err: BackendError };

// =============================================================================
// SYSTEM TYPES
// =============================================================================

export interface StorageStats {
  submissions: bigint;
  applications: bigint;
  leads: bigint;
  blogPosts: bigint;
  partnerLeads: bigint;
}

export interface HealthCheckResult {
  status: string;
  version: string;
  timestamp: bigint;
  storageStats: StorageStats;
}

export interface AnalyticsSnapshot {
  totalContactSubmissions: bigint;
  totalWizardApplications: bigint;
  totalPartnerLeads: bigint;
  totalBlogViews: bigint;
  totalActivePartners: bigint;
  submissionsThisMonth: bigint;
  applicationsThisMonth: bigint;
  leadsThisMonth: bigint;
  timestamp: bigint;
}

export interface DatabaseStatsByType {
  submissions: bigint;
  applications: bigint;
  leads: bigint;
  blogPosts: bigint;
  partnerLeads: bigint;
}

export interface DatabaseStats {
  totalRecords: bigint;
  byType: DatabaseStatsByType;
}

export interface ExportData {
  submissions: ContactSubmission[];
  applications: WizardApplication[];
  partialLeads: PartialLead[];
  blogPosts: BlogPost[];
  partnerLeads: PartnerLead[];
}

// =============================================================================
// SERVICE DEFINITION
// =============================================================================

export interface _SERVICE {
  // System functions
  healthCheck: ActorMethod<[], HealthCheckResult>;
  getVersion: ActorMethod<[], string>;
  getCanisterPrincipal: ActorMethod<[], Principal>;

  // Analytics
  getAnalytics: ActorMethod<[], AnalyticsSnapshot>;

  // Site settings
  getSiteSetting: ActorMethod<[string], [] | [string]>;
  setSiteSetting: ActorMethod<[string, string], OperationResultBool>;
  getAllSiteSettings: ActorMethod<[], [string, string][]>;

  // Audit logs
  getAuditLogs: ActorMethod<[PaginationParams], OperationResultPaginatedAuditLog>;

  // Contact submissions
  submitContactForm: ActorMethod<
    [string, string, string, string, string],
    OperationResultNat
  >;
  getAllSubmissions: ActorMethod<[PaginationParams], OperationResultPaginatedContactSubmission>;
  getSubmission: ActorMethod<[bigint], OperationResultContactSubmission>;
  getTotalSubmissions: ActorMethod<[], bigint>;
  updateSubmissionStatus: ActorMethod<
    [bigint, SubmissionStatus, [] | [string]],
    OperationResultBool
  >;

  // Wizard applications
  submitWizardApplication: ActorMethod<
    [string, string, string, string, string, string, string, boolean],
    OperationResultNat
  >;
  savePartialLead: ActorMethod<
    [string, string, string],
    OperationResultNat
  >;
  getAllWizardApplications: ActorMethod<[PaginationParams], OperationResultPaginatedWizardApplication>;
  getAllPartialLeads: ActorMethod<[PaginationParams], OperationResultPaginatedPartialLead>;
  getTotalWizardApplications: ActorMethod<[], bigint>;
  updateApplicationStatus: ActorMethod<
    [bigint, ApplicationStatus, [] | [string]],
    OperationResultBool
  >;

  // Blog posts
  createBlogPost: ActorMethod<
    [string, string, string, string, string, string, string, boolean, string[]],
    OperationResultNat
  >;
  updateBlogPost: ActorMethod<
    [bigint, string, string, string, string, string, string, string, boolean, string[], [] | [string], [] | [string]],
    OperationResultBool
  >;
  publishBlogPost: ActorMethod<[bigint], OperationResultBool>;
  unpublishBlogPost: ActorMethod<[bigint], OperationResultBool>;
  deleteBlogPost: ActorMethod<[bigint], OperationResultBool>;
  getAllBlogPosts: ActorMethod<[PaginationParams], OperationResultPaginatedBlogPost>;
  getPublishedBlogPosts: ActorMethod<[PaginationParams], OperationResultPaginatedBlogPost>;
  getBlogPost: ActorMethod<[bigint], OperationResultBlogPost>;
  getFeaturedBlogPosts: ActorMethod<[], BlogPost[]>;
  getBlogPostsByCategory: ActorMethod<[string, PaginationParams], OperationResultPaginatedBlogPost>;

  // Partner leads
  submitPartnerLead: ActorMethod<
    [string, string, string, string, string, string],
    OperationResultNat
  >;
  getAllPartnerLeads: ActorMethod<[PaginationParams], OperationResultPaginatedPartnerLead>;
  getTotalPartnerLeads: ActorMethod<[], bigint>;
  updatePartnerLeadStatus: ActorMethod<
    [bigint, PartnerStatus, [] | [string]],
    OperationResultBool
  >;

  // Bulk operations
  exportAllData: ActorMethod<[], ExportData>;
  getDatabaseStats: ActorMethod<[], DatabaseStats>;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create pagination params with sensible defaults
 */
export function createPaginationParams(page: number = 0, pageSize: number = 20): PaginationParams {
  return { page: BigInt(page), pageSize: BigInt(pageSize) };
}

/**
 * Helper to extract variant type from Candid variant
 */
export function extractVariant<T>(variant: T): keyof T {
  return Object.keys(variant)[0] as keyof T;
}

/**
 * Check if submission status is a specific variant
 */
export function hasStatus<T extends Record<string, null>>(
  status: T, 
  variant: keyof T
): boolean {
  return variant in status;
}

// Re-export IDL types for external use
export { idlService, idlInitArgs, idlFactory, init };
