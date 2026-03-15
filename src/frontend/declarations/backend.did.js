/* eslint-disable */

// @ts-nocheck

// This file was automatically generated for Cybin Enterprises Backend v2.0.0
// Professional-grade backend with stable storage, pagination, and audit logging

import { IDL } from '@icp-sdk/core/candid';

// =============================================================================
// ENUMS AND VARIANTS
// =============================================================================

export const SubmissionStatus = IDL.Variant({
  'New': IDL.Null,
  'InProgress': IDL.Null,
  'Completed': IDL.Null,
  'Archived': IDL.Null,
  'Spam': IDL.Null,
});

export const ApplicationStatus = IDL.Variant({
  'Pending': IDL.Null,
  'UnderReview': IDL.Null,
  'Approved': IDL.Null,
  'Rejected': IDL.Null,
  'NeedsInfo': IDL.Null,
});

export const LeadStatus = IDL.Variant({
  'New': IDL.Null,
  'Contacted': IDL.Null,
  'Qualified': IDL.Null,
  'Converted': IDL.Null,
  'Unqualified': IDL.Null,
});

export const PartnershipType = IDL.Variant({
  'Reseller': IDL.Null,
  'Referral': IDL.Null,
  'Technology': IDL.Null,
  'Strategic': IDL.Null,
  'WhiteLabel': IDL.Null,
});

export const PartnerStatus = IDL.Variant({
  'New': IDL.Null,
  'Contacted': IDL.Null,
  'Negotiating': IDL.Null,
  'Active': IDL.Null,
  'Inactive': IDL.Null,
  'Rejected': IDL.Null,
});

export const AuditAction = IDL.Variant({
  'Create': IDL.Null,
  'Read': IDL.Null,
  'Update': IDL.Null,
  'Delete': IDL.Null,
  'Login': IDL.Null,
  'Logout': IDL.Null,
  'AdminAction': IDL.Null,
});

export const UserRole = IDL.Variant({
  'Anonymous': IDL.Null,
  'User': IDL.Null,
  'Partner': IDL.Null,
  'Admin': IDL.Null,
  'SuperAdmin': IDL.Null,
});

export const BackendError = IDL.Variant({
  'InvalidInput': IDL.Text,
  'NotFound': IDL.Text,
  'Unauthorized': IDL.Text,
  'Forbidden': IDL.Text,
  'RateLimited': IDL.Text,
  'InternalError': IDL.Text,
  'ValidationError': IDL.Text,
});

// =============================================================================
// CORE TYPES
// =============================================================================

export const ContactSubmission = IDL.Record({
  'id': IDL.Nat,
  'name': IDL.Text,
  'email': IDL.Text,
  'phone': IDL.Text,
  'businessType': IDL.Text,
  'message': IDL.Text,
  'timestamp': IDL.Int,
  'status': SubmissionStatus,
  'notes': IDL.Opt(IDL.Text),
  'assignedTo': IDL.Opt(IDL.Principal),
});

export const WizardApplication = IDL.Record({
  'id': IDL.Nat,
  'industry': IDL.Text,
  'regulatoryHurdle': IDL.Text,
  'name': IDL.Text,
  'email': IDL.Text,
  'phone': IDL.Text,
  'businessName': IDL.Text,
  'fein': IDL.Text,
  'hasFein': IDL.Bool,
  'timestamp': IDL.Int,
  'status': ApplicationStatus,
  'notes': IDL.Opt(IDL.Text),
  'assignedTo': IDL.Opt(IDL.Principal),
});

export const PartialLead = IDL.Record({
  'id': IDL.Nat,
  'email': IDL.Text,
  'industry': IDL.Text,
  'regulatoryHurdle': IDL.Text,
  'timestamp': IDL.Int,
  'status': LeadStatus,
  'followUpDate': IDL.Opt(IDL.Int),
});

export const BlogPost = IDL.Record({
  'id': IDL.Nat,
  'title': IDL.Text,
  'category': IDL.Text,
  'excerpt': IDL.Text,
  'body': IDL.Text,
  'author': IDL.Text,
  'readTime': IDL.Text,
  'publishDate': IDL.Text,
  'published': IDL.Bool,
  'timestamp': IDL.Int,
  'featured': IDL.Bool,
  'tags': IDL.Vec(IDL.Text),
  'seoTitle': IDL.Opt(IDL.Text),
  'seoDescription': IDL.Opt(IDL.Text),
  'viewCount': IDL.Nat,
});

export const PartnerLead = IDL.Record({
  'id': IDL.Nat,
  'companyName': IDL.Text,
  'contactName': IDL.Text,
  'email': IDL.Text,
  'phone': IDL.Text,
  'partnershipType': PartnershipType,
  'description': IDL.Text,
  'timestamp': IDL.Int,
  'status': PartnerStatus,
  'notes': IDL.Opt(IDL.Text),
  'assignedTo': IDL.Opt(IDL.Principal),
});

export const AuditLogEntry = IDL.Record({
  'id': IDL.Nat,
  'timestamp': IDL.Int,
  'action': AuditAction,
  'entityType': IDL.Text,
  'entityId': IDL.Text,
  'caller': IDL.Principal,
  'details': IDL.Text,
  'ipAddress': IDL.Opt(IDL.Text),
});

export const User = IDL.Record({
  'id': IDL.Principal,
  'role': UserRole,
  'email': IDL.Text,
  'createdAt': IDL.Int,
  'lastLogin': IDL.Opt(IDL.Int),
  'isActive': IDL.Bool,
});

// =============================================================================
// PAGINATION TYPES
// =============================================================================

export const Page = IDL.Record({
  'page': IDL.Nat,
  'pageSize': IDL.Nat,
  'totalItems': IDL.Nat,
  'totalPages': IDL.Nat,
});

export const PaginationParams = IDL.Record({
  'page': IDL.Nat,
  'pageSize': IDL.Nat,
});

export const PaginatedResponseContactSubmission = IDL.Record({
  'data': IDL.Vec(ContactSubmission),
  'page': Page,
});

export const PaginatedResponseWizardApplication = IDL.Record({
  'data': IDL.Vec(WizardApplication),
  'page': Page,
});

export const PaginatedResponsePartialLead = IDL.Record({
  'data': IDL.Vec(PartialLead),
  'page': Page,
});

export const PaginatedResponseBlogPost = IDL.Record({
  'data': IDL.Vec(BlogPost),
  'page': Page,
});

export const PaginatedResponsePartnerLead = IDL.Record({
  'data': IDL.Vec(PartnerLead),
  'page': Page,
});

export const PaginatedResponseAuditLogEntry = IDL.Record({
  'data': IDL.Vec(AuditLogEntry),
  'page': Page,
});

// =============================================================================
// SYSTEM TYPES
// =============================================================================

export const StorageStats = IDL.Record({
  'submissions': IDL.Nat,
  'applications': IDL.Nat,
  'leads': IDL.Nat,
  'blogPosts': IDL.Nat,
  'partnerLeads': IDL.Nat,
});

export const HealthCheckResult = IDL.Record({
  'status': IDL.Text,
  'version': IDL.Text,
  'timestamp': IDL.Int,
  'storageStats': StorageStats,
});

export const AnalyticsSnapshot = IDL.Record({
  'totalContactSubmissions': IDL.Nat,
  'totalWizardApplications': IDL.Nat,
  'totalPartnerLeads': IDL.Nat,
  'totalBlogViews': IDL.Nat,
  'totalActivePartners': IDL.Nat,
  'submissionsThisMonth': IDL.Nat,
  'applicationsThisMonth': IDL.Nat,
  'leadsThisMonth': IDL.Nat,
  'timestamp': IDL.Int,
});

export const DatabaseStats = IDL.Record({
  'totalRecords': IDL.Nat,
  'byType': IDL.Record({
    'submissions': IDL.Nat,
    'applications': IDL.Nat,
    'leads': IDL.Nat,
    'blogPosts': IDL.Nat,
    'partnerLeads': IDL.Nat,
  }),
});

export const ExportData = IDL.Record({
  'submissions': IDL.Vec(ContactSubmission),
  'applications': IDL.Vec(WizardApplication),
  'partialLeads': IDL.Vec(PartialLead),
  'blogPosts': IDL.Vec(BlogPost),
  'partnerLeads': IDL.Vec(PartnerLead),
});

// =============================================================================
// RESULT TYPES (for error handling)
// =============================================================================

export const OperationResultNat = IDL.Variant({
  'ok': IDL.Nat,
  'err': BackendError,
});

export const OperationResultBool = IDL.Variant({
  'ok': IDL.Bool,
  'err': BackendError,
});

export const OperationResultContactSubmission = IDL.Variant({
  'ok': ContactSubmission,
  'err': BackendError,
});

export const OperationResultPaginatedContactSubmission = IDL.Variant({
  'ok': PaginatedResponseContactSubmission,
  'err': BackendError,
});

export const OperationResultPaginatedWizardApplication = IDL.Variant({
  'ok': PaginatedResponseWizardApplication,
  'err': BackendError,
});

export const OperationResultPaginatedPartialLead = IDL.Variant({
  'ok': PaginatedResponsePartialLead,
  'err': BackendError,
});

export const OperationResultPaginatedBlogPost = IDL.Variant({
  'ok': PaginatedResponseBlogPost,
  'err': BackendError,
});

export const OperationResultPaginatedPartnerLead = IDL.Variant({
  'ok': PaginatedResponsePartnerLead,
  'err': BackendError,
});

export const OperationResultPaginatedAuditLog = IDL.Variant({
  'ok': PaginatedResponseAuditLogEntry,
  'err': BackendError,
});

export const OperationResultBlogPost = IDL.Variant({
  'ok': BlogPost,
  'err': BackendError,
});

// =============================================================================
// SERVICE DEFINITION
// =============================================================================

export const idlService = IDL.Service({
  // System functions
  'healthCheck': IDL.Func([], [HealthCheckResult], ['query']),
  'getVersion': IDL.Func([], [IDL.Text], ['query']),
  'getCanisterPrincipal': IDL.Func([], [IDL.Principal], ['query']),

  // Analytics
  'getAnalytics': IDL.Func([], [AnalyticsSnapshot], ['query']),

  // Site settings
  'getSiteSetting': IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
  'setSiteSetting': IDL.Func([IDL.Text, IDL.Text], [OperationResultBool], []),
  'getAllSiteSettings': IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ['query']),

  // Audit logs
  'getAuditLogs': IDL.Func([PaginationParams], [OperationResultPaginatedAuditLog], ['query']),

  // Contact submissions
  'submitContactForm': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
    [OperationResultNat],
    [],
  ),
  'getAllSubmissions': IDL.Func([PaginationParams], [OperationResultPaginatedContactSubmission], ['query']),
  'getSubmission': IDL.Func([IDL.Nat], [OperationResultContactSubmission], ['query']),
  'getTotalSubmissions': IDL.Func([], [IDL.Nat], ['query']),
  'updateSubmissionStatus': IDL.Func(
    [IDL.Nat, SubmissionStatus, IDL.Opt(IDL.Text)],
    [OperationResultBool],
    [],
  ),

  // Wizard applications
  'submitWizardApplication': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
    [OperationResultNat],
    [],
  ),
  'savePartialLead': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text],
    [OperationResultNat],
    [],
  ),
  'getAllWizardApplications': IDL.Func([PaginationParams], [OperationResultPaginatedWizardApplication], ['query']),
  'getAllPartialLeads': IDL.Func([PaginationParams], [OperationResultPaginatedPartialLead], ['query']),
  'getTotalWizardApplications': IDL.Func([], [IDL.Nat], ['query']),
  'updateApplicationStatus': IDL.Func(
    [IDL.Nat, ApplicationStatus, IDL.Opt(IDL.Text)],
    [OperationResultBool],
    [],
  ),

  // Blog posts
  'createBlogPost': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Vec(IDL.Text)],
    [OperationResultNat],
    [],
  ),
  'updateBlogPost': IDL.Func(
    [IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Vec(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
    [OperationResultBool],
    [],
  ),
  'publishBlogPost': IDL.Func([IDL.Nat], [OperationResultBool], []),
  'unpublishBlogPost': IDL.Func([IDL.Nat], [OperationResultBool], []),
  'deleteBlogPost': IDL.Func([IDL.Nat], [OperationResultBool], []),
  'getAllBlogPosts': IDL.Func([PaginationParams], [OperationResultPaginatedBlogPost], ['query']),
  'getPublishedBlogPosts': IDL.Func([PaginationParams], [OperationResultPaginatedBlogPost], ['query']),
  'getBlogPost': IDL.Func([IDL.Nat], [OperationResultBlogPost], ['query']),
  'getFeaturedBlogPosts': IDL.Func([], [IDL.Vec(BlogPost)], ['query']),
  'getBlogPostsByCategory': IDL.Func([IDL.Text, PaginationParams], [OperationResultPaginatedBlogPost], ['query']),

  // Partner leads
  'submitPartnerLead': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
    [OperationResultNat],
    [],
  ),
  'getAllPartnerLeads': IDL.Func([PaginationParams], [OperationResultPaginatedPartnerLead], ['query']),
  'getTotalPartnerLeads': IDL.Func([], [IDL.Nat], ['query']),
  'updatePartnerLeadStatus': IDL.Func(
    [IDL.Nat, PartnerStatus, IDL.Opt(IDL.Text)],
    [OperationResultBool],
    [],
  ),

  // Bulk operations
  'exportAllData': IDL.Func([], [ExportData], ['query']),
  'getDatabaseStats': IDL.Func([], [DatabaseStats], ['query']),
});

// Factory function for IDL
export const idlFactory = ({ IDL }) => {
  // Re-define variants
  const SubmissionStatus = IDL.Variant({
    'New': IDL.Null,
    'InProgress': IDL.Null,
    'Completed': IDL.Null,
    'Archived': IDL.Null,
    'Spam': IDL.Null,
  });

  const ApplicationStatus = IDL.Variant({
    'Pending': IDL.Null,
    'UnderReview': IDL.Null,
    'Approved': IDL.Null,
    'Rejected': IDL.Null,
    'NeedsInfo': IDL.Null,
  });

  const LeadStatus = IDL.Variant({
    'New': IDL.Null,
    'Contacted': IDL.Null,
    'Qualified': IDL.Null,
    'Converted': IDL.Null,
    'Unqualified': IDL.Null,
  });

  const PartnershipType = IDL.Variant({
    'Reseller': IDL.Null,
    'Referral': IDL.Null,
    'Technology': IDL.Null,
    'Strategic': IDL.Null,
    'WhiteLabel': IDL.Null,
  });

  const PartnerStatus = IDL.Variant({
    'New': IDL.Null,
    'Contacted': IDL.Null,
    'Negotiating': IDL.Null,
    'Active': IDL.Null,
    'Inactive': IDL.Null,
    'Rejected': IDL.Null,
  });

  const AuditAction = IDL.Variant({
    'Create': IDL.Null,
    'Read': IDL.Null,
    'Update': IDL.Null,
    'Delete': IDL.Null,
    'Login': IDL.Null,
    'Logout': IDL.Null,
    'AdminAction': IDL.Null,
  });

  const BackendError = IDL.Variant({
    'InvalidInput': IDL.Text,
    'NotFound': IDL.Text,
    'Unauthorized': IDL.Text,
    'Forbidden': IDL.Text,
    'RateLimited': IDL.Text,
    'InternalError': IDL.Text,
    'ValidationError': IDL.Text,
  });

  // Records
  const ContactSubmission = IDL.Record({
    'id': IDL.Nat,
    'name': IDL.Text,
    'email': IDL.Text,
    'phone': IDL.Text,
    'businessType': IDL.Text,
    'message': IDL.Text,
    'timestamp': IDL.Int,
    'status': SubmissionStatus,
    'notes': IDL.Opt(IDL.Text),
    'assignedTo': IDL.Opt(IDL.Principal),
  });

  const WizardApplication = IDL.Record({
    'id': IDL.Nat,
    'industry': IDL.Text,
    'regulatoryHurdle': IDL.Text,
    'name': IDL.Text,
    'email': IDL.Text,
    'phone': IDL.Text,
    'businessName': IDL.Text,
    'fein': IDL.Text,
    'hasFein': IDL.Bool,
    'timestamp': IDL.Int,
    'status': ApplicationStatus,
    'notes': IDL.Opt(IDL.Text),
    'assignedTo': IDL.Opt(IDL.Principal),
  });

  const PartialLead = IDL.Record({
    'id': IDL.Nat,
    'email': IDL.Text,
    'industry': IDL.Text,
    'regulatoryHurdle': IDL.Text,
    'timestamp': IDL.Int,
    'status': LeadStatus,
    'followUpDate': IDL.Opt(IDL.Int),
  });

  const BlogPost = IDL.Record({
    'id': IDL.Nat,
    'title': IDL.Text,
    'category': IDL.Text,
    'excerpt': IDL.Text,
    'body': IDL.Text,
    'author': IDL.Text,
    'readTime': IDL.Text,
    'publishDate': IDL.Text,
    'published': IDL.Bool,
    'timestamp': IDL.Int,
    'featured': IDL.Bool,
    'tags': IDL.Vec(IDL.Text),
    'seoTitle': IDL.Opt(IDL.Text),
    'seoDescription': IDL.Opt(IDL.Text),
    'viewCount': IDL.Nat,
  });

  const PartnerLead = IDL.Record({
    'id': IDL.Nat,
    'companyName': IDL.Text,
    'contactName': IDL.Text,
    'email': IDL.Text,
    'phone': IDL.Text,
    'partnershipType': PartnershipType,
    'description': IDL.Text,
    'timestamp': IDL.Int,
    'status': PartnerStatus,
    'notes': IDL.Opt(IDL.Text),
    'assignedTo': IDL.Opt(IDL.Principal),
  });

  const AuditLogEntry = IDL.Record({
    'id': IDL.Nat,
    'timestamp': IDL.Int,
    'action': AuditAction,
    'entityType': IDL.Text,
    'entityId': IDL.Text,
    'caller': IDL.Principal,
    'details': IDL.Text,
    'ipAddress': IDL.Opt(IDL.Text),
  });

  const Page = IDL.Record({
    'page': IDL.Nat,
    'pageSize': IDL.Nat,
    'totalItems': IDL.Nat,
    'totalPages': IDL.Nat,
  });

  const PaginationParams = IDL.Record({
    'page': IDL.Nat,
    'pageSize': IDL.Nat,
  });

  const StorageStats = IDL.Record({
    'submissions': IDL.Nat,
    'applications': IDL.Nat,
    'leads': IDL.Nat,
    'blogPosts': IDL.Nat,
    'partnerLeads': IDL.Nat,
  });

  const HealthCheckResult = IDL.Record({
    'status': IDL.Text,
    'version': IDL.Text,
    'timestamp': IDL.Int,
    'storageStats': StorageStats,
  });

  const AnalyticsSnapshot = IDL.Record({
    'totalContactSubmissions': IDL.Nat,
    'totalWizardApplications': IDL.Nat,
    'totalPartnerLeads': IDL.Nat,
    'totalBlogViews': IDL.Nat,
    'totalActivePartners': IDL.Nat,
    'submissionsThisMonth': IDL.Nat,
    'applicationsThisMonth': IDL.Nat,
    'leadsThisMonth': IDL.Nat,
    'timestamp': IDL.Int,
  });

  const DatabaseStats = IDL.Record({
    'totalRecords': IDL.Nat,
    'byType': IDL.Record({
      'submissions': IDL.Nat,
      'applications': IDL.Nat,
      'leads': IDL.Nat,
      'blogPosts': IDL.Nat,
      'partnerLeads': IDL.Nat,
    }),
  });

  const ExportData = IDL.Record({
    'submissions': IDL.Vec(ContactSubmission),
    'applications': IDL.Vec(WizardApplication),
    'partialLeads': IDL.Vec(PartialLead),
    'blogPosts': IDL.Vec(BlogPost),
    'partnerLeads': IDL.Vec(PartnerLead),
  });

  // Paginated responses
  const PaginatedResponseContactSubmission = IDL.Record({
    'data': IDL.Vec(ContactSubmission),
    'page': Page,
  });

  const PaginatedResponseWizardApplication = IDL.Record({
    'data': IDL.Vec(WizardApplication),
    'page': Page,
  });

  const PaginatedResponsePartialLead = IDL.Record({
    'data': IDL.Vec(PartialLead),
    'page': Page,
  });

  const PaginatedResponseBlogPost = IDL.Record({
    'data': IDL.Vec(BlogPost),
    'page': Page,
  });

  const PaginatedResponsePartnerLead = IDL.Record({
    'data': IDL.Vec(PartnerLead),
    'page': Page,
  });

  const PaginatedResponseAuditLogEntry = IDL.Record({
    'data': IDL.Vec(AuditLogEntry),
    'page': Page,
  });

  // Operation results
  const OperationResultNat = IDL.Variant({
    'ok': IDL.Nat,
    'err': BackendError,
  });

  const OperationResultBool = IDL.Variant({
    'ok': IDL.Bool,
    'err': BackendError,
  });

  const OperationResultContactSubmission = IDL.Variant({
    'ok': ContactSubmission,
    'err': BackendError,
  });

  const OperationResultPaginatedContactSubmission = IDL.Variant({
    'ok': PaginatedResponseContactSubmission,
    'err': BackendError,
  });

  const OperationResultPaginatedWizardApplication = IDL.Variant({
    'ok': PaginatedResponseWizardApplication,
    'err': BackendError,
  });

  const OperationResultPaginatedPartialLead = IDL.Variant({
    'ok': PaginatedResponsePartialLead,
    'err': BackendError,
  });

  const OperationResultPaginatedBlogPost = IDL.Variant({
    'ok': PaginatedResponseBlogPost,
    'err': BackendError,
  });

  const OperationResultPaginatedPartnerLead = IDL.Variant({
    'ok': PaginatedResponsePartnerLead,
    'err': BackendError,
  });

  const OperationResultPaginatedAuditLog = IDL.Variant({
    'ok': PaginatedResponseAuditLogEntry,
    'err': BackendError,
  });

  const OperationResultBlogPost = IDL.Variant({
    'ok': BlogPost,
    'err': BackendError,
  });

  return IDL.Service({
    // System functions
    'healthCheck': IDL.Func([], [HealthCheckResult], ['query']),
    'getVersion': IDL.Func([], [IDL.Text], ['query']),
    'getCanisterPrincipal': IDL.Func([], [IDL.Principal], ['query']),

    // Analytics
    'getAnalytics': IDL.Func([], [AnalyticsSnapshot], ['query']),

    // Site settings
    'getSiteSetting': IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'setSiteSetting': IDL.Func([IDL.Text, IDL.Text], [OperationResultBool], []),
    'getAllSiteSettings': IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ['query']),

    // Audit logs
    'getAuditLogs': IDL.Func([PaginationParams], [OperationResultPaginatedAuditLog], ['query']),

    // Contact submissions
    'submitContactForm': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [OperationResultNat],
      [],
    ),
    'getAllSubmissions': IDL.Func([PaginationParams], [OperationResultPaginatedContactSubmission], ['query']),
    'getSubmission': IDL.Func([IDL.Nat], [OperationResultContactSubmission], ['query']),
    'getTotalSubmissions': IDL.Func([], [IDL.Nat], ['query']),
    'updateSubmissionStatus': IDL.Func(
      [IDL.Nat, SubmissionStatus, IDL.Opt(IDL.Text)],
      [OperationResultBool],
      [],
    ),

    // Wizard applications
    'submitWizardApplication': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
      [OperationResultNat],
      [],
    ),
    'savePartialLead': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text],
      [OperationResultNat],
      [],
    ),
    'getAllWizardApplications': IDL.Func([PaginationParams], [OperationResultPaginatedWizardApplication], ['query']),
    'getAllPartialLeads': IDL.Func([PaginationParams], [OperationResultPaginatedPartialLead], ['query']),
    'getTotalWizardApplications': IDL.Func([], [IDL.Nat], ['query']),
    'updateApplicationStatus': IDL.Func(
      [IDL.Nat, ApplicationStatus, IDL.Opt(IDL.Text)],
      [OperationResultBool],
      [],
    ),

    // Blog posts
    'createBlogPost': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Vec(IDL.Text)],
      [OperationResultNat],
      [],
    ),
    'updateBlogPost': IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Vec(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [OperationResultBool],
      [],
    ),
    'publishBlogPost': IDL.Func([IDL.Nat], [OperationResultBool], []),
    'unpublishBlogPost': IDL.Func([IDL.Nat], [OperationResultBool], []),
    'deleteBlogPost': IDL.Func([IDL.Nat], [OperationResultBool], []),
    'getAllBlogPosts': IDL.Func([PaginationParams], [OperationResultPaginatedBlogPost], ['query']),
    'getPublishedBlogPosts': IDL.Func([PaginationParams], [OperationResultPaginatedBlogPost], ['query']),
    'getBlogPost': IDL.Func([IDL.Nat], [OperationResultBlogPost], ['query']),
    'getFeaturedBlogPosts': IDL.Func([], [IDL.Vec(BlogPost)], ['query']),
    'getBlogPostsByCategory': IDL.Func([IDL.Text, PaginationParams], [OperationResultPaginatedBlogPost], ['query']),

    // Partner leads
    'submitPartnerLead': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [OperationResultNat],
      [],
    ),
    'getAllPartnerLeads': IDL.Func([PaginationParams], [OperationResultPaginatedPartnerLead], ['query']),
    'getTotalPartnerLeads': IDL.Func([], [IDL.Nat], ['query']),
    'updatePartnerLeadStatus': IDL.Func(
      [IDL.Nat, PartnerStatus, IDL.Opt(IDL.Text)],
      [OperationResultBool],
      [],
    ),

    // Bulk operations
    'exportAllData': IDL.Func([], [ExportData], ['query']),
    'getDatabaseStats': IDL.Func([], [DatabaseStats], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
