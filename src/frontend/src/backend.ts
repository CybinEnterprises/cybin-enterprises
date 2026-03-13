/* eslint-disable */

// @ts-nocheck

// This file was generated for Cybin Enterprises Backend v2.0.0
// Professional-grade backend with stable storage, pagination, and audit logging

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
export type {
  _SERVICE,
  ContactSubmission,
  WizardApplication,
  PartialLead,
  BlogPost,
  PartnerLead,
  AuditLogEntry,
  User,
  SubmissionStatus,
  ApplicationStatus,
  LeadStatus,
  PartnershipType,
  PartnerStatus,
  AuditAction,
  UserRole,
  BackendError,
  PaginationParams,
  Page,
  PaginatedContactSubmission,
  PaginatedWizardApplication,
  PaginatedPartialLead,
  PaginatedBlogPost,
  PaginatedPartnerLead,
  PaginatedAuditLogEntry,
  OperationResultNat,
  OperationResultBool,
  OperationResultContactSubmission,
  OperationResultPaginatedContactSubmission,
  OperationResultPaginatedWizardApplication,
  OperationResultPaginatedPartialLead,
  OperationResultPaginatedBlogPost,
  OperationResultPaginatedPartnerLead,
  OperationResultPaginatedAuditLog,
  OperationResultBlogPost,
  HealthCheckResult,
  AnalyticsSnapshot,
  DatabaseStats,
  StorageStats,
  ExportData,
} from "./declarations/backend.did";

// Utility function for creating pagination params
export function createPaginationParams(page: number = 0, pageSize: number = 20): PaginationParams {
  return { page: BigInt(page), pageSize: BigInt(pageSize) };
}

// Helper to check if result is ok
export function isOk<T>(result: { ok: T } | { err: unknown }): result is { ok: T } {
  return 'ok' in result;
}

// Helper to extract error message
export function getErrorMessage(result: { ok: unknown } | { err: unknown }): string | null {
  if ('err' in result && result.err && typeof result.err === 'object') {
    const err = result.err as Record<string, unknown>;
    if ('ValidationError' in err) return String(err.ValidationError);
    if ('NotFound' in err) return String(err.NotFound);
    if ('RateLimited' in err) return String(err.RateLimited);
    if ('Unauthorized' in err) return String(err.Unauthorized);
    if ('Forbidden' in err) return String(err.Forbidden);
    if ('InvalidInput' in err) return String(err.InvalidInput);
    if ('InternalError' in err) return String(err.InternalError);
  }
  return null;
}

// External blob handling
export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) {
            this._blob = blob;
        }
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([
            new Uint8Array(blob)
        ], {
            type: 'application/octet-stream'
        }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) {
            return this._blob;
        }
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string {
        return this.directURL;
    }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

// Type exports
export type SubmissionId = bigint;
export type BlogPostId = bigint;
export type WizardApplicationId = bigint;
export type PartialLeadId = bigint;
export type PartnerLeadId = bigint;

// Backend interface for the new API
export interface backendInterface {
  // System functions
  healthCheck(): Promise<{
    status: string;
    version: string;
    timestamp: bigint;
    storageStats: {
      submissions: bigint;
      applications: bigint;
      leads: bigint;
      blogPosts: bigint;
      partnerLeads: bigint;
    };
  }>;
  getVersion(): Promise<string>;
  getCanisterPrincipal(): Promise<Principal>;

  // Analytics
  getAnalytics(): Promise<{
    totalContactSubmissions: bigint;
    totalWizardApplications: bigint;
    totalPartnerLeads: bigint;
    totalBlogViews: bigint;
    totalActivePartners: bigint;
    submissionsThisMonth: bigint;
    applicationsThisMonth: bigint;
    leadsThisMonth: bigint;
    timestamp: bigint;
  }>;

  // Site settings
  getSiteSetting(key: string): Promise<[] | [string]>;
  setSiteSetting(key: string, value: string): Promise<{ ok: boolean } | { err: unknown }>;
  getAllSiteSettings(): Promise<[string, string][]>;

  // Audit logs
  getAuditLogs(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;

  // Contact submissions
  submitContactForm(
    name: string,
    email: string,
    phone: string,
    businessType: string,
    message: string
  ): Promise<{ ok: bigint } | { err: unknown }>;
  getAllSubmissions(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;
  getSubmission(id: bigint): Promise<{ ok: unknown } | { err: unknown }>;
  getTotalSubmissions(): Promise<bigint>;
  updateSubmissionStatus(
    id: bigint,
    status: unknown,
    notes: [] | [string]
  ): Promise<{ ok: boolean } | { err: unknown }>;

  // Wizard applications
  submitWizardApplication(
    industry: string,
    regulatoryHurdle: string,
    name: string,
    email: string,
    phone: string,
    businessName: string,
    fein: string,
    hasFein: boolean
  ): Promise<{ ok: bigint } | { err: unknown }>;
  savePartialLead(
    email: string,
    industry: string,
    regulatoryHurdle: string
  ): Promise<{ ok: bigint } | { err: unknown }>;
  getAllWizardApplications(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;
  getAllPartialLeads(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;
  getTotalWizardApplications(): Promise<bigint>;
  updateApplicationStatus(
    id: bigint,
    status: unknown,
    notes: [] | [string]
  ): Promise<{ ok: boolean } | { err: unknown }>;

  // Blog posts
  createBlogPost(
    title: string,
    category: string,
    excerpt: string,
    body: string,
    author: string,
    readTime: string,
    publishDate: string,
    featured: boolean,
    tags: string[]
  ): Promise<{ ok: bigint } | { err: unknown }>;
  updateBlogPost(
    id: bigint,
    title: string,
    category: string,
    excerpt: string,
    body: string,
    author: string,
    readTime: string,
    publishDate: string,
    featured: boolean,
    tags: string[],
    seoTitle: [] | [string],
    seoDescription: [] | [string]
  ): Promise<{ ok: boolean } | { err: unknown }>;
  publishBlogPost(id: bigint): Promise<{ ok: boolean } | { err: unknown }>;
  unpublishBlogPost(id: bigint): Promise<{ ok: boolean } | { err: unknown }>;
  deleteBlogPost(id: bigint): Promise<{ ok: boolean } | { err: unknown }>;
  getAllBlogPosts(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;
  getPublishedBlogPosts(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;
  getBlogPost(id: bigint): Promise<{ ok: unknown } | { err: unknown }>;
  getFeaturedBlogPosts(): Promise<unknown[]>;
  getBlogPostsByCategory(category: string, params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;

  // Partner leads
  submitPartnerLead(
    companyName: string,
    contactName: string,
    email: string,
    phone: string,
    partnershipType: string,
    description: string
  ): Promise<{ ok: bigint } | { err: unknown }>;
  getAllPartnerLeads(params: { page: bigint; pageSize: bigint }): Promise<{ ok: { data: unknown[]; page: { page: bigint; pageSize: bigint; totalItems: bigint; totalPages: bigint } } } | { err: unknown }>;
  getTotalPartnerLeads(): Promise<bigint>;
  updatePartnerLeadStatus(
    id: bigint,
    status: unknown,
    notes: [] | [string]
  ): Promise<{ ok: boolean } | { err: unknown }>;

  // Bulk operations
  exportAllData(): Promise<{
    submissions: unknown[];
    applications: unknown[];
    partialLeads: unknown[];
    blogPosts: unknown[];
    partnerLeads: unknown[];
  }>;
  getDatabaseStats(): Promise<{
    totalRecords: bigint;
    byType: {
      submissions: bigint;
      applications: bigint;
      leads: bigint;
      blogPosts: bigint;
      partnerLeads: bigint;
    };
  }>;
}

// Backend class wrapper
export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, private processError?: (error: unknown) => never){}

    // Helper to process results
    private processResult<T>(result: { ok: T } | { err: unknown }, _defaultValue: T): T {
      if (this.processError && 'err' in result) {
        this.processError(result.err);
      }
      if ('ok' in result) {
        return result.ok;
      }
      // This should never be reached if processError is set
      throw new Error('Operation failed');
    }

    // System functions
    async healthCheck() {
        const result = await this.actor.healthCheck();
        return result;
    }

    async getVersion(): Promise<string> {
        const result = await this.actor.getVersion();
        return result;
    }

    async getCanisterPrincipal(): Promise<Principal> {
        const result = await this.actor.getCanisterPrincipal();
        return result;
    }

    // Analytics
    async getAnalytics() {
        const result = await this.actor.getAnalytics();
        return result;
    }

    // Site settings
    async getSiteSetting(key: string): Promise<[] | [string]> {
        const result = await this.actor.getSiteSetting(key);
        return result;
    }

    async setSiteSetting(key: string, value: string) {
        const result = await this.actor.setSiteSetting(key, value);
        return result;
    }

    async getAllSiteSettings(): Promise<[string, string][]> {
        const result = await this.actor.getAllSiteSettings();
        return result;
    }

    // Audit logs
    async getAuditLogs(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getAuditLogs(params);
        return result;
    }

    // Contact submissions
    async submitContactForm(
        name: string,
        email: string,
        phone: string,
        businessType: string,
        message: string
    ) {
        const result = await this.actor.submitContactForm(name, email, phone, businessType, message);
        return result;
    }

    async getAllSubmissions(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getAllSubmissions(params);
        return result;
    }

    async getSubmission(id: bigint) {
        const result = await this.actor.getSubmission(id);
        return result;
    }

    async getTotalSubmissions(): Promise<bigint> {
        const result = await this.actor.getTotalSubmissions();
        return result;
    }

    async updateSubmissionStatus(
        id: bigint,
        status: unknown,
        notes: [] | [string]
    ) {
        const result = await this.actor.updateSubmissionStatus(id, status, notes);
        return result;
    }

    // Wizard applications
    async submitWizardApplication(
        industry: string,
        regulatoryHurdle: string,
        name: string,
        email: string,
        phone: string,
        businessName: string,
        fein: string,
        hasFein: boolean
    ) {
        const result = await this.actor.submitWizardApplication(
            industry, regulatoryHurdle, name, email, phone, businessName, fein, hasFein
        );
        return result;
    }

    async savePartialLead(email: string, industry: string, regulatoryHurdle: string) {
        const result = await this.actor.savePartialLead(email, industry, regulatoryHurdle);
        return result;
    }

    async getAllWizardApplications(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getAllWizardApplications(params);
        return result;
    }

    async getAllPartialLeads(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getAllPartialLeads(params);
        return result;
    }

    async getTotalWizardApplications(): Promise<bigint> {
        const result = await this.actor.getTotalWizardApplications();
        return result;
    }

    async updateApplicationStatus(
        id: bigint,
        status: unknown,
        notes: [] | [string]
    ) {
        const result = await this.actor.updateApplicationStatus(id, status, notes);
        return result;
    }

    // Blog posts
    async createBlogPost(
        title: string,
        category: string,
        excerpt: string,
        body: string,
        author: string,
        readTime: string,
        publishDate: string,
        featured: boolean,
        tags: string[]
    ) {
        const result = await this.actor.createBlogPost(
            title, category, excerpt, body, author, readTime, publishDate, featured, tags
        );
        return result;
    }

    async updateBlogPost(
        id: bigint,
        title: string,
        category: string,
        excerpt: string,
        body: string,
        author: string,
        readTime: string,
        publishDate: string,
        featured: boolean,
        tags: string[],
        seoTitle: [] | [string],
        seoDescription: [] | [string]
    ) {
        const result = await this.actor.updateBlogPost(
            id, title, category, excerpt, body, author, readTime, publishDate, 
            featured, tags, seoTitle, seoDescription
        );
        return result;
    }

    async publishBlogPost(id: bigint) {
        const result = await this.actor.publishBlogPost(id);
        return result;
    }

    async unpublishBlogPost(id: bigint) {
        const result = await this.actor.unpublishBlogPost(id);
        return result;
    }

    async deleteBlogPost(id: bigint) {
        const result = await this.actor.deleteBlogPost(id);
        return result;
    }

    async getAllBlogPosts(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getAllBlogPosts(params);
        return result;
    }

    async getPublishedBlogPosts(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getPublishedBlogPosts(params);
        return result;
    }

    async getBlogPost(id: bigint) {
        const result = await this.actor.getBlogPost(id);
        return result;
    }

    async getFeaturedBlogPosts(): Promise<unknown[]> {
        const result = await this.actor.getFeaturedBlogPosts();
        return result;
    }

    async getBlogPostsByCategory(category: string, params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getBlogPostsByCategory(category, params);
        return result;
    }

    // Partner leads
    async submitPartnerLead(
        companyName: string,
        contactName: string,
        email: string,
        phone: string,
        partnershipType: string,
        description: string
    ) {
        const result = await this.actor.submitPartnerLead(
            companyName, contactName, email, phone, partnershipType, description
        );
        return result;
    }

    async getAllPartnerLeads(params: { page: bigint; pageSize: bigint }) {
        const result = await this.actor.getAllPartnerLeads(params);
        return result;
    }

    async getTotalPartnerLeads(): Promise<bigint> {
        const result = await this.actor.getTotalPartnerLeads();
        return result;
    }

    async updatePartnerLeadStatus(
        id: bigint,
        status: unknown,
        notes: [] | [string]
    ) {
        const result = await this.actor.updatePartnerLeadStatus(id, status, notes);
        return result;
    }

    // Bulk operations
    async exportAllData() {
        const result = await this.actor.exportAllData();
        return result;
    }

    async getDatabaseStats() {
        const result = await this.actor.getDatabaseStats();
        return result;
    }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({
        ...options.agentOptions
    });
    if (options.agent && options.agentOptions) {
        // Silenced to reduce console noise
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId: canisterId,
        ...options.actorOptions
    });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
