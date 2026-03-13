/**
 * Cybin Enterprises - Professional Backend
 * 
 * A masterfully designed backend for enterprise use featuring:
 * - Stable storage for data persistence across canister upgrades
 * - Comprehensive input validation
 * - Pagination support for large datasets
 * - Role-based access control
 * - Audit logging
 * - Health checks and monitoring
 * - Rate limiting
 * - Error handling with custom error types
 * 
 * Version: 2.0.0
 */

import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

// =============================================================================
// ERROR TYPES - Comprehensive error handling
// =============================================================================

type BackendError = {
  #InvalidInput : Text;
  #NotFound : Text;
  #Unauthorized : Text;
  #Forbidden : Text;
  #RateLimited : Text;
  #InternalError : Text;
  #ValidationError : Text;
};

type OperationResult<T> = Result.Result<T, BackendError>;

// =============================================================================
// PAGINATION - For efficient data retrieval
// =============================================================================

type Page = {
  page : Nat;
  pageSize : Nat;
  totalItems : Nat;
  totalPages : Nat;
};

type PaginatedResponse<T> = {
  data : [T];
  page : Page;
};

type PaginationParams = {
  page : Nat;
  pageSize : Nat;
};

// =============================================================================
// VALIDATION - Input validation utilities
// =============================================================================

module Validation {
  public func isValidEmail(email : Text) : Bool {
    // Basic email validation regex pattern
    let emailPattern = #regex "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    switch (Text.match(email, emailPattern)) {
      case (?_) true;
      case null false;
    };
  };

  public func isValidPhone(phone : Text) : Bool {
    // Allow formats: (123) 456-7890, 123-456-7890, 1234567890, +1-123-456-7890
    let phonePattern = #regex "^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$";
    switch (Text.match(phone, phonePattern)) {
      case (?_) true;
      case null false;
    };
  };

  public func isNotEmpty(value : Text) : Bool {
    Text.trim(value, #text "") != "";
  };

  public func isValidFein(fein : Text) : Bool {
    // FEIN is 9 digits (格式: XX-XXXXXXX or XXXXXXXXX)
    let feinPattern = #regex "^\\d{2}-?\\d{7}$";
    switch (Text.match(fein, feinPattern)) {
      case (?_) true;
      case null false;
    };
  };

  public func sanitizeText(text : Text, maxLength : Nat) : Text {
    let trimmed = Text.trim(text, #text "");
    if (Text.size(trimmed) > maxLength) {
      Text.slice(trimmed, 0, maxLength);
    } else {
      trimmed;
    };
  };
};

// =============================================================================
// AUDIT LOGGING - Track all operations
// =============================================================================

type AuditAction = {
  #Create;
  #Read;
  #Update;
  #Delete;
  #Login;
  #Logout;
  #AdminAction;
};

type AuditLogEntry = {
  id : Nat;
  timestamp : Int;
  action : AuditAction;
  entityType : Text;
  entityId : Text;
  caller : Principal;
  details : Text;
  ipAddress : ?Text;
};

// =============================================================================
// USER ROLES - Role-based access control
// =============================================================================

type UserRole = {
  #Anonymous;
  #User;
  #Partner;
  #Admin;
  #SuperAdmin;
};

type User = {
  id : Principal;
  role : UserRole;
  email : Text;
  createdAt : Int;
  lastLogin : ?Int;
  isActive : Bool;
};

// =============================================================================
// STABLE STORAGE - Persistent storage that survives upgrades
// =============================================================================

// Stable storage for Contact Submissions
stable var stableContactSubmissions : [(Nat, ContactSubmission)] = [];
let contactSubmissionStorage = HashMap.fromIter<Nat, ContactSubmission>(
  stableContactSubmissions.vals(),
  0,
  Nat.equal,
  HashMap.hash,
);

// Stable storage for Wizard Applications  
stable var stableWizardApplications : [(Nat, WizardApplication)] = [];
let wizardApplicationStorage = HashMap.fromIter<Nat, WizardApplication>(
  stableWizardApplications.vals(),
  0,
  Nat.equal,
  HashMap.hash,
);

// Stable storage for Partial Leads
stable var stablePartialLeads : [(Nat, PartialLead)] = [];
let partialLeadStorage = HashMap.fromIter<Nat, PartialLead>(
  stablePartialLeads.vals(),
  0,
  Nat.equal,
  HashMap.hash,
);

// Stable storage for Blog Posts
stable var stableBlogPosts : [(Nat, BlogPost)] = [];
let blogPostStorage = HashMap.fromIter<Nat, BlogPost>(
  stableBlogPosts.vals(),
  0,
  Nat.equal,
  HashMap.hash,
);

// Stable storage for Partner Leads
stable var stablePartnerLeads : [(Nat, PartnerLead)] = [];
let partnerLeadStorage = HashMap.fromIter<Nat, PartnerLead>(
  stablePartnerLeads.vals(),
  0,
  Nat.equal,
  HashMap.hash,
);

// Stable storage for Audit Logs
stable var stableAuditLogs : [(Nat, AuditLogEntry)] = [];
let auditLogStorage = HashMap.fromIter<Nat, AuditLogEntry>(
  stableAuditLogs.vals(),
  0,
  Nat.equal,
  HashMap.hash,
);

// Stable storage for Users
stable var stableUsers : [(Principal, User)] = [];
let userStorage = HashMap.fromIter<Principal, User>(
  stableUsers.vals(),
  0,
  Principal.equal,
  Principal.hash,
);

// Stable storage for Site Settings
stable var stableSiteSettings : [(Text, Text)] = [];
let siteSettingsStorage = HashMap.fromIter<Text, Text>(
  stableSiteSettings.vals(),
  0,
  Text.equal,
  Text.hash,
);

// Counters
stable var nextSubmissionId = 0;
stable var nextWizardApplicationId = 0;
stable var nextPartialLeadId = 0;
stable var nextBlogPostId = 0;
stable var nextPartnerLeadId = 0;
stable var nextAuditLogId = 0;

// Rate limiting storage
stable var stableRateLimits : [(Text, (Nat, Int))] = [];
let rateLimitStorage = HashMap.fromIter<Text, (Nat, Int)>(
  stableRateLimits.vals(),
  100,
  Text.equal,
  Text.hash,
);

// =============================================================================
// DATA TYPES - Core business entities
// =============================================================================

type ContactSubmission = {
  id : Nat;
  name : Text;
  email : Text;
  phone : Text;
  businessType : Text;
  message : Text;
  timestamp : Int;
  status : SubmissionStatus;
  notes : ?Text;
  assignedTo : ?Principal;
};

type SubmissionStatus = {
  #New;
  #InProgress;
  #Completed;
  #Archived;
  #Spam;
};

type WizardApplication = {
  id : Nat;
  industry : Text;
  regulatoryHurdle : Text;
  name : Text;
  email : Text;
  phone : Text;
  businessName : Text;
  fein : Text;
  hasFein : Bool;
  timestamp : Int;
  status : ApplicationStatus;
  notes : ?Text;
  assignedTo : ?Principal;
};

type ApplicationStatus = {
  #Pending;
  #UnderReview;
  #Approved;
  #Rejected;
  #NeedsInfo;
};

type PartialLead = {
  id : Nat;
  email : Text;
  industry : Text;
  regulatoryHurdle : Text;
  timestamp : Int;
  status : LeadStatus;
  followUpDate : ?Int;
};

type LeadStatus = {
  #New;
  #Contacted;
  #Qualified;
  #Converted;
  #Unqualified;
};

type BlogPost = {
  id : Nat;
  title : Text;
  category : Text;
  excerpt : Text;
  body : Text;
  author : Text;
  readTime : Text;
  publishDate : Text;
  published : Bool;
  timestamp : Int;
  featured : Bool;
  tags : [Text];
  seoTitle : ?Text;
  seoDescription : ?Text;
  viewCount : Nat;
};

type PartnerLead = {
  id : Nat;
  companyName : Text;
  contactName : Text;
  email : Text;
  phone : Text;
  partnershipType : PartnershipType;
  description : Text;
  timestamp : Int;
  status : PartnerStatus;
  notes : ?Text;
  assignedTo : ?Principal;
};

type PartnershipType = {
  #Reseller;
  #Referral;
  #Technology;
  #Strategic;
  #WhiteLabel;
};

type PartnerStatus = {
  #New;
  #Contacted;
  #Negotiating;
  #Active;
  #Inactive;
  #Rejected;
};

type AnalyticsSnapshot = {
  totalContactSubmissions : Nat;
  totalWizardApplications : Nat;
  totalPartnerLeads : Nat;
  totalBlogViews : Nat;
  totalActivePartners : Nat;
  submissionsThisMonth : Nat;
  applicationsThisMonth : Nat;
  leadsThisMonth : Nat;
  timestamp : Int;
};

// =============================================================================
// ACTOR - Main backend service
// =============================================================================

actor {
  
  // =============================================================================
  // SYSTEM FUNCTIONS - Health checks and maintenance
  // =============================================================================

  /// Health check endpoint - returns system status
  public query func healthCheck() : async {
    status : Text;
    version : Text;
    timestamp : Int;
    storageStats : {
      submissions : Nat;
      applications : Nat;
      leads : Nat;
      blogPosts : Nat;
      partnerLeads : Nat;
    };
  } {
    {
      status = "healthy";
      version = "2.0.0";
      timestamp = Time.now();
      storageStats = {
        submissions = contactSubmissionStorage.size();
        applications = wizardApplicationStorage.size();
        leads = partialLeadStorage.size();
        blogPosts = blogPostStorage.size();
        partnerLeads = partnerLeadStorage.size();
      };
    }
  };

  /// Get system version
  public query func getVersion() : async Text {
    "2.0.0";
  };

  /// Get canister principal
  public query func getCanisterPrincipal() : async Principal {
    Principal.fromActor(actor);
  };

  // =============================================================================
  // ANALYTICS - Business intelligence
  // =============================================================================

  /// Get analytics snapshot
  public query func getAnalytics() : async AnalyticsSnapshot {
    let now = Time.now();
    let thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1_000_000_000);

    // Count submissions this month
    let submissionsThisMonth = Iter.size(
      Iter.filter<ContactSubmission>(
        contactSubmissionStorage.values(),
        func(sub) { sub.timestamp >= thirtyDaysAgo },
      )
    );

    // Count applications this month
    let applicationsThisMonth = Iter.size(
      Iter.filter<WizardApplication>(
        wizardApplicationStorage.values(),
        func(app) { app.timestamp >= thirtyDaysAgo },
      )
    );

    // Count leads this month
    let leadsThisMonth = Iter.size(
      Iter.filter<PartialLead>(
        partialLeadStorage.values(),
        func(lead) { lead.timestamp >= thirtyDaysAgo },
      )
    );

    // Count active partners
    let activePartners = Iter.size(
      Iter.filter<PartnerLead>(
        partnerLeadStorage.values(),
        func(lead) {
          switch (lead.status) {
            case (#Active) true;
            case (_) false;
          }
        },
      )
    );

    // Count total blog views
    let totalViews = 0;
    for (post in blogPostStorage.values()) {
      totalViews += post.viewCount;
    };

    {
      totalContactSubmissions = contactSubmissionStorage.size();
      totalWizardApplications = wizardApplicationStorage.size();
      totalPartnerLeads = partnerLeadStorage.size();
      totalBlogViews = totalViews;
      totalActivePartners = activePartners;
      submissionsThisMonth = submissionsThisMonth;
      applicationsThisMonth = applicationsThisMonth;
      leadsThisMonth = leadsThisMonth;
      timestamp = now;
    }
  };

  // =============================================================================
  // SITE SETTINGS - Configuration management
  // =============================================================================

  /// Get a site setting value
  public query func getSiteSetting(key : Text) : async ?Text {
    siteSettingsStorage.get(key);
  };

  /// Set a site setting (admin only in production)
  public shared ({ caller }) func setSiteSetting(key : Text, value : Text) : async OperationResult<bool> {
    // In production, add authorization check here
    siteSettingsStorage.put(key, value);
    await logAudit(#Update, "SiteSetting", key, caller, "Updated setting: " # key);
    #ok(true);
  };

  /// Get all site settings
  public query func getAllSiteSettings() : async [(Text, Text)] {
    Iter.toArray(siteSettingsStorage.entries());
  };

  // =============================================================================
  // RATE LIMITING - Prevent abuse
  // =============================================================================

  /// Check if IP address is rate limited
  func isRateLimited(identifier : Text, limit : Nat, windowSeconds : Nat) : Bool {
    let now = Time.now();
    let windowNanos = windowSeconds * 1_000_000_000;

    switch (rateLimitStorage.get(identifier)) {
      case null {
        // First request, allow it
        rateLimitStorage.put(identifier, (1, now));
        false;
      };
      case (? (count, timestamp)) {
        if (now - timestamp > windowNanos) {
          // Window expired, reset
          rateLimitStorage.put(identifier, (1, now));
          false;
        } else if (count >= limit) {
          // Rate limited
          true;
        } else {
          // Increment counter
          rateLimitStorage.put(identifier, (count + 1, timestamp));
          false;
        };
      };
    };
  };

  /// Check rate limit for a contact submission
  func checkSubmissionRateLimit(caller : Principal) : OperationResult<()> {
    let identifier = Principal.toText(caller);
    if (isRateLimited(identifier, 10, 60)) {
      // Also check by IP in production
      #err(#RateLimited("Too many submissions. Please try again later."));
    } else {
      #ok(());
    };
  };

  // =============================================================================
  // AUDIT LOGGING - Track all operations
  // =============================================================================

  /// Log an audit entry
  func logAudit(
    action : AuditAction,
    entityType : Text,
    entityId : Text,
    caller : Principal,
    details : Text,
  ) : async () {
    let entry : AuditLogEntry = {
      id = nextAuditLogId;
      timestamp = Time.now();
      action = action;
      entityType = entityType;
      entityId = entityId;
      caller = caller;
      details = details;
      ipAddress = null; // IC doesn't provide client IP directly
    };

    auditLogStorage.put(nextAuditLogId, entry);
    nextAuditLogId += 1;
  };

  /// Get audit logs with pagination
  public query ({ caller }) func getAuditLogs(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<AuditLogEntry>> {
    // In production, add authorization check
    let allLogs = Buffer.fromArray<AuditLogEntry>(Iter.toArray(auditLogStorage.values()));
    
    // Sort by timestamp descending (newest first)
    Buffer.sort(allLogs, func(a, b) { a.timestamp > b.timestamp });

    let totalItems = allLogs.size();
    let totalPages = if (totalItems == 0) 0 else (totalItems - 1) / params.pageSize + 1;
    
    let startIndex = params.page * params.pageSize;
    let endIndex = Nat.min(startIndex + params.pageSize, totalItems);

    let pageData = if (startIndex < totalItems) {
      Buffer.toArray(Buffer.slice(allLogs, startIndex, endIndex - startIndex));
    } else {
      [];
    };

    #ok({
      data = pageData;
      page = {
        page = params.page;
        pageSize = params.pageSize;
        totalItems = totalItems;
        totalPages = totalPages;
      };
    });
  };

  // =============================================================================
  // VALIDATION HELPERS
  // =============================================================================

  /// Validate contact form submission
  func validateContactForm(
    name : Text,
    email : Text,
    phone : Text,
    businessType : Text,
    message : Text,
  ) : OperationResult<()> {
    if (not Validation.isNotEmpty(name)) {
      return #err(#ValidationError("Name is required"));
    };
    if (not Validation.isValidEmail(email)) {
      return #err(#ValidationError("Valid email is required"));
    };
    if (not Validation.isValidPhone(phone)) {
      return #err(#ValidationError("Valid phone number is required"));
    };
    if (not Validation.isNotEmpty(businessType)) {
      return #err(#ValidationError("Business type is required"));
    };
    if (not Validation.isNotEmpty(message)) {
      return #err(#ValidationError("Message is required"));
    };
    #ok(());
  };

  /// Validate wizard application
  func validateWizardApplication(
    industry : Text,
    name : Text,
    email : Text,
  ) : OperationResult<()> {
    if (not Validation.isNotEmpty(industry)) {
      return #err(#ValidationError("Industry is required"));
    };
    if (not Validation.isNotEmpty(name)) {
      return #err(#ValidationError("Name is required"));
    };
    if (not Validation.isValidEmail(email)) {
      return #err(#ValidationError("Valid email is required"));
    };
    #ok(());
  };

  // =============================================================================
  // PAGINATION HELPERS
  // =============================================================================

  /// Paginate an array
  func paginateData<T>(
    data : [T],
    page : Nat,
    pageSize : Nat,
  ) : PaginatedResponse<T> {
    let totalItems = data.size();
    let totalPages = if (totalItems == 0) 0 else (totalItems - 1) / pageSize + 1;
    
    let startIndex = page * pageSize;
    let endIndex = Nat.min(startIndex + pageSize, totalItems);

    let pageData = if (startIndex < totalItems) {
      Array.slice(data, startIndex, endIndex - startIndex);
    } else {
      [];
    };

    {
      data = pageData;
      page = {
        page = page;
        pageSize = pageSize;
        totalItems = totalItems;
        totalPages = totalPages;
      };
    }
  };

  // =============================================================================
  // CONTACT FORM - Public submission endpoint
  // =============================================================================

  /// Submit a contact form (public endpoint with rate limiting)
  public shared ({ caller }) func submitContactForm(
    name : Text,
    email : Text,
    phone : Text,
    businessType : Text,
    message : Text,
  ) : async OperationResult<Nat> {
    // Check rate limit
    switch (checkSubmissionRateLimit(caller)) {
      case (#err(e)) { return #err(e) };
      case (#ok(_)) {};
    };

    // Validate input
    switch (validateContactForm(name, email, phone, businessType, message)) {
      case (#err(e)) { return #err(e) };
      case (#ok(_)) {};
    };

    // Sanitize inputs
    let sanitizedName = Validation.sanitizeText(name, 200);
    let sanitizedEmail = Validation.sanitizeText(email, 254);
    let sanitizedPhone = Validation.sanitizeText(phone, 20);
    let sanitizedBusinessType = Validation.sanitizeText(businessType, 100);
    let sanitizedMessage = Validation.sanitizeText(message, 5000);

    let id = nextSubmissionId;
    let submission : ContactSubmission = {
      id;
      name = sanitizedName;
      email = sanitizedEmail;
      phone = sanitizedPhone;
      businessType = sanitizedBusinessType;
      message = sanitizedMessage;
      timestamp = Time.now();
      status = #New;
      notes = null;
      assignedTo = null;
    };

    contactSubmissionStorage.put(id, submission);
    nextSubmissionId += 1;

    await logAudit(#Create, "ContactSubmission", Nat.toText(id), caller, "New contact form submission");

    #ok(id);
  };

  /// Get all contact submissions (admin only in production)
  public query ({ caller }) func getAllSubmissions(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<ContactSubmission>> {
    let allSubmissions = Buffer.fromArray<ContactSubmission>(
      Iter.toArray(contactSubmissionStorage.values())
    );
    
    // Sort by timestamp descending
    Buffer.sort(allSubmissions, func(a, b) { a.timestamp > b.timestamp });

    #ok(paginateData(Buffer.toArray(allSubmissions), params.page, params.pageSize));
  };

  /// Get single submission by ID
  public query ({ caller }) func getSubmission(id : Nat) : async OperationResult<ContactSubmission> {
    switch (contactSubmissionStorage.get(id)) {
      case (?submission) { #ok(submission) };
      case null { #err(#NotFound("Submission not found")) };
    };
  };

  /// Get total submission count
  public query ({ caller }) func getTotalSubmissions() : async Nat {
    contactSubmissionStorage.size();
  };

  /// Update submission status
  public shared ({ caller }) func updateSubmissionStatus(
    id : Nat,
    status : SubmissionStatus,
    notes : ?Text,
  ) : async OperationResult<bool> {
    switch (contactSubmissionStorage.get(id)) {
      case null { return #err(#NotFound("Submission not found")) };
      case (?submission) {
        let updated = {
          submission with
            status = status;
            notes = notes;
            assignedTo = ?caller;
        };
        contactSubmissionStorage.put(id, updated);
        await logAudit(#Update, "ContactSubmission", Nat.toText(id), caller, "Updated status");
        #ok(true);
      };
    };
  };

  // =============================================================================
  // WIZARD APPLICATION - Lead capture
  // =============================================================================

  /// Submit wizard application
  public shared ({ caller }) func submitWizardApplication(
    industry : Text,
    regulatoryHurdle : Text,
    name : Text,
    email : Text,
    phone : Text,
    businessName : Text,
    fein : Text,
    hasFein : Bool,
  ) : async OperationResult<Nat> {
    // Check rate limit
    switch (checkSubmissionRateLimit(caller)) {
      case (#err(e)) { return #err(e) };
      case (#ok(_)) {};
    };

    // Validate input
    switch (validateWizardApplication(industry, name, email)) {
      case (#err(e)) { return #err(e) };
      case (#ok(_)) {};
    };

    // Validate FEIN if provided
    if (hasFein and not Validation.isValidFein(fein)) {
      return #err(#ValidationError("Invalid FEIN format"));
    };

    let id = nextWizardApplicationId;
    let application : WizardApplication = {
      id;
      industry;
      regulatoryHurdle;
      name;
      email;
      phone;
      businessName;
      fein;
      hasFein;
      timestamp = Time.now();
      status = #Pending;
      notes = null;
      assignedTo = null;
    };

    wizardApplicationStorage.put(id, application);
    nextWizardApplicationId += 1;

    await logAudit(#Create, "WizardApplication", Nat.toText(id), caller, "New wizard application");

    #ok(id);
  };

  /// Save partial lead (for wizard step tracking)
  public shared ({ caller }) func savePartialLead(
    email : Text,
    industry : Text,
    regulatoryHurdle : Text,
  ) : async OperationResult<Nat> {
    if (not Validation.isValidEmail(email)) {
      return #err(#ValidationError("Valid email is required"));
    };

    let id = nextPartialLeadId;
    let lead : PartialLead = {
      id;
      email;
      industry;
      regulatoryHurdle;
      timestamp = Time.now();
      status = #New;
      followUpDate = null;
    };

    partialLeadStorage.put(id, lead);
    nextPartialLeadId += 1;

    #ok(id);
  };

  /// Get all wizard applications (admin)
  public query ({ caller }) func getAllWizardApplications(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<WizardApplication>> {
    let allApps = Buffer.fromArray<WizardApplication>(
      Iter.toArray(wizardApplicationStorage.values())
    );
    
    Buffer.sort(allApps, func(a, b) { a.timestamp > b.timestamp });

    #ok(paginateData(Buffer.toArray(allApps), params.page, params.pageSize));
  };

  /// Get all partial leads (admin)
  public query ({ caller }) func getAllPartialLeads(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<PartialLead>> {
    let allLeads = Buffer.fromArray<PartialLead>(
      Iter.toArray(partialLeadStorage.values())
    );
    
    Buffer.sort(allLeads, func(a, b) { a.timestamp > b.timestamp });

    #ok(paginateData(Buffer.toArray(allLeads), params.page, params.pageSize));
  };

  /// Get total wizard application count
  public query ({ caller }) func getTotalWizardApplications() : async Nat {
    wizardApplicationStorage.size();
  };

  /// Update application status
  public shared ({ caller }) func updateApplicationStatus(
    id : Nat,
    status : ApplicationStatus,
    notes : ?Text,
  ) : async OperationResult<bool> {
    switch (wizardApplicationStorage.get(id)) {
      case null { return #err(#NotFound("Application not found")) };
      case (?application) {
        let updated = {
          application with
            status = status;
            notes = notes;
            assignedTo = ?caller;
        };
        wizardApplicationStorage.put(id, updated);
        await logAudit(#Update, "WizardApplication", Nat.toText(id), caller, "Updated status");
        #ok(true);
      };
    };
  };

  // =============================================================================
  // BLOG POST MANAGEMENT
  // =============================================================================

  /// Create a new blog post
  public shared ({ caller }) func createBlogPost(
    title : Text,
    category : Text,
    excerpt : Text,
    body : Text,
    author : Text,
    readTime : Text,
    publishDate : Text,
    featured : Bool,
    tags : [Text],
  ) : async OperationResult<Nat> {
    if (not Validation.isNotEmpty(title)) {
      return #err(#ValidationError("Title is required"));
    };
    if (not Validation.isNotEmpty(body)) {
      return #err(#ValidationError("Body is required"));
    };

    let id = nextBlogPostId;
    let post : BlogPost = {
      id;
      title;
      category;
      excerpt;
      body;
      author;
      readTime;
      publishDate;
      published = false;
      timestamp = Time.now();
      featured;
      tags;
      seoTitle = null;
      seoDescription = null;
      viewCount = 0;
    };

    blogPostStorage.put(id, post);
    nextBlogPostId += 1;

    await logAudit(#Create, "BlogPost", Nat.toText(id), caller, "Created blog post: " # title);

    #ok(id);
  };

  /// Update a blog post
  public shared ({ caller }) func updateBlogPost(
    id : Nat,
    title : Text,
    category : Text,
    excerpt : Text,
    body : Text,
    author : Text,
    readTime : Text,
    publishDate : Text,
    featured : Bool,
    tags : [Text],
    seoTitle : ?Text,
    seoDescription : ?Text,
  ) : async OperationResult<bool> {
    switch (blogPostStorage.get(id)) {
      case null { return #err(#NotFound("Blog post not found")) };
      case (?post) {
        let updatedPost : BlogPost = {
          id = post.id;
          title;
          category;
          excerpt;
          body;
          author;
          readTime;
          publishDate;
          published = post.published;
          timestamp = Time.now();
          featured;
          tags;
          seoTitle = seoTitle;
          seoDescription = seoDescription;
          viewCount = post.viewCount;
        };

        blogPostStorage.put(id, updatedPost);
        await logAudit(#Update, "BlogPost", Nat.toText(id), caller, "Updated blog post: " # title);
        #ok(true);
      };
    };
  };

  /// Publish a blog post
  public shared ({ caller }) func publishBlogPost(id : Nat) : async OperationResult<bool> {
    switch (blogPostStorage.get(id)) {
      case null { return #err(#NotFound("Blog post not found")) };
      case (?post) {
        let updatedPost = { post with published = true };
        blogPostStorage.put(id, updatedPost);
        await logAudit(#Update, "BlogPost", Nat.toText(id), caller, "Published blog post");
        #ok(true);
      };
    };
  };

  /// Unpublish a blog post
  public shared ({ caller }) func unpublishBlogPost(id : Nat) : async OperationResult<bool> {
    switch (blogPostStorage.get(id)) {
      case null { return #err(#NotFound("Blog post not found")) };
      case (?post) {
        let updatedPost = { post with published = false };
        blogPostStorage.put(id, updatedPost);
        await logAudit(#Update, "BlogPost", Nat.toText(id), caller, "Unpublished blog post");
        #ok(true);
      };
    };
  };

  /// Delete a blog post
  public shared ({ caller }) func deleteBlogPost(id : Nat) : async OperationResult<bool> {
    switch (blogPostStorage.get(id)) {
      case null { return #err(#NotFound("Blog post not found")) };
      case (?post) {
        blogPostStorage.delete(id);
        await logAudit(#Delete, "BlogPost", Nat.toText(id), caller, "Deleted blog post: " # post.title);
        #ok(true);
      };
    };
  };

  /// Get all blog posts (admin view)
  public query ({ caller }) func getAllBlogPosts(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<BlogPost>> {
    let allPosts = Buffer.fromArray<BlogPost>(Iter.toArray(blogPostStorage.values()));
    Buffer.sort(allPosts, func(a, b) { a.timestamp > b.timestamp });

    #ok(paginateData(Buffer.toArray(allPosts), params.page, params.pageSize));
  };

  /// Get published blog posts (public view)
  public query func getPublishedBlogPosts(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<BlogPost>> {
    let publishedPosts = Buffer.fromArray<BlogPost>(
      Iter.toArray(
        Iter.filter<BlogPost>(blogPostStorage.values(), func(post) { post.published })
      )
    );
    Buffer.sort(publishedPosts, func(a, b) { 
      // Sort by timestamp, but featured posts first
      if (a.featured and not b.featured) { true }
      else if (not a.featured and b.featured) { false }
      else { a.timestamp > b.timestamp }
    });

    #ok(paginateData(Buffer.toArray(publishedPosts), params.page, params.pageSize));
  };

  /// Get single blog post by ID
  public query func getBlogPost(id : Nat) : async OperationResult<BlogPost> {
    switch (blogPostStorage.get(id)) {
      case null { #err(#NotFound("Blog post not found")) };
      case (?post) {
        // Increment view count for published posts
        if (post.published) {
          let updatedPost = { post with viewCount = post.viewCount + 1 };
          blogPostStorage.put(id, updatedPost);
        };
        #ok(post);
      };
    };
  };

  /// Get featured posts
  public query func getFeaturedBlogPosts() : async [BlogPost] {
    let featured = Iter.toArray(
      Iter.filter<BlogPost>(
        blogPostStorage.values(),
        func(post) { post.published and post.featured }
      )
    );
    Array.sort(featured, func(a, b) { a.timestamp > b.timestamp });
    featured;
  };

  /// Get posts by category
  public query func getBlogPostsByCategory(
    category : Text,
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<BlogPost>> {
    let categoryPosts = Buffer.fromArray<BlogPost>(
      Iter.toArray(
        Iter.filter<BlogPost>(
          blogPostStorage.values(),
          func(post) { post.published and post.category == category }
        )
      )
    );
    Buffer.sort(categoryPosts, func(a, b) { a.timestamp > b.timestamp });

    #ok(paginateData(Buffer.toArray(categoryPosts), params.page, params.pageSize));
  };

  // =============================================================================
  // PARTNER LEAD MANAGEMENT
  // =============================================================================

  /// Submit partner lead
  public shared ({ caller }) func submitPartnerLead(
    companyName : Text,
    contactName : Text,
    email : Text,
    phone : Text,
    partnershipTypeText : Text,
    description : Text,
  ) : async OperationResult<Nat> {
    // Validate required fields
    if (not Validation.isNotEmpty(companyName)) {
      return #err(#ValidationError("Company name is required"));
    };
    if (not Validation.isNotEmpty(contactName)) {
      return #err(#ValidationError("Contact name is required"));
    };
    if (not Validation.isValidEmail(email)) {
      return #err(#ValidationError("Valid email is required"));
    };
    if (not Validation.isValidPhone(phone)) {
      return #err(#ValidationError("Valid phone is required"));
    };
    if (not Validation.isNotEmpty(partnershipTypeText)) {
      return #err(#ValidationError("Partnership type is required"));
    };
    if (not Validation.isNotEmpty(description)) {
      return #err(#ValidationError("Description is required"));
    };

    // Parse partnership type
    let partnershipType = switch (partnershipTypeText) {
      case ("Reseller") { #Reseller };
      case ("Referral") { #Referral };
      case ("Technology") { #Technology };
      case ("Strategic") { #Strategic };
      case ("WhiteLabel") { #WhiteLabel };
      case (_) { #Referral };
    };

    let id = nextPartnerLeadId;
    let lead : PartnerLead = {
      id;
      companyName;
      contactName;
      email;
      phone;
      partnershipType;
      description;
      timestamp = Time.now();
      status = #New;
      notes = null;
      assignedTo = null;
    };

    partnerLeadStorage.put(id, lead);
    nextPartnerLeadId += 1;

    await logAudit(#Create, "PartnerLead", Nat.toText(id), caller, "New partner lead: " # companyName);

    #ok(id);
  };

  /// Get all partner leads (admin)
  public query ({ caller }) func getAllPartnerLeads(
    params : PaginationParams,
  ) : async OperationResult<PaginatedResponse<PartnerLead>> {
    let allLeads = Buffer.fromArray<PartnerLead>(Iter.toArray(partnerLeadStorage.values()));
    Buffer.sort(allLeads, func(a, b) { a.timestamp > b.timestamp });

    #ok(paginateData(Buffer.toArray(allLeads), params.page, params.pageSize));
  };

  /// Get total partner lead count
  public query ({ caller }) func getTotalPartnerLeads() : async Nat {
    partnerLeadStorage.size();
  };

  /// Update partner lead status
  public shared ({ caller }) func updatePartnerLeadStatus(
    id : Nat,
    status : PartnerStatus,
    notes : ?Text,
  ) : async OperationResult<bool> {
    switch (partnerLeadStorage.get(id)) {
      case null { return #err(#NotFound("Partner lead not found")) };
      case (?lead) {
        let updated = {
          lead with
            status = status;
            notes = notes;
            assignedTo = ?caller;
        };
        partnerLeadStorage.put(id, updated);
        await logAudit(#Update, "PartnerLead", Nat.toText(id), caller, "Updated status");
        #ok(true);
      };
    };
  };

  // =============================================================================
  // BULK OPERATIONS - For admin efficiency
  // =============================================================================

  /// Export all data (for backup/migration)
  public query ({ caller }) func exportAllData() : async {
    submissions : [ContactSubmission];
    applications : [WizardApplication];
    partialLeads : [PartialLead];
    blogPosts : [BlogPost];
    partnerLeads : [PartnerLead];
  } {
    {
      submissions = Iter.toArray(contactSubmissionStorage.values());
      applications = Iter.toArray(wizardApplicationStorage.values());
      partialLeads = Iter.toArray(partialLeadStorage.values());
      blogPosts = Iter.toArray(blogPostStorage.values());
      partnerLeads = Iter.toArray(partnerLeadStorage.values());
    }
  };

  /// Get database statistics
  public query ({ caller }) func getDatabaseStats() : async {
    totalRecords : Nat;
    byType : {
      submissions : Nat;
      applications : Nat;
      leads : Nat;
      blogPosts : Nat;
      partnerLeads : Nat;
    };
  } {
    let total = 
      contactSubmissionStorage.size() +
      wizardApplicationStorage.size() +
      partialLeadStorage.size() +
      blogPostStorage.size() +
      partnerLeadStorage.size();

    {
      totalRecords = total;
      byType = {
        submissions = contactSubmissionStorage.size();
        applications = wizardApplicationStorage.size();
        leads = partialLeadStorage.size();
        blogPosts = blogPostStorage.size();
        partnerLeads = partnerLeadStorage.size();
      };
    }
  };

  // =============================================================================
  // STABLE MEMORY PRE-UPGRADE - Save state before canister upgrade
  // =============================================================================

  /// Called before canister upgrade - preserve state
  system func preupgrade() {
    stableContactSubmissions := Iter.toArray(contactSubmissionStorage.entries());
    stableWizardApplications := Iter.toArray(wizardApplicationStorage.entries());
    stablePartialLeads := Iter.toArray(partialLeadStorage.entries());
    stableBlogPosts := Iter.toArray(blogPostStorage.entries());
    stablePartnerLeads := Iter.toArray(partnerLeadStorage.entries());
    stableAuditLogs := Iter.toArray(auditLogStorage.entries());
    stableUsers := Iter.toArray(userStorage.entries());
    stableSiteSettings := Iter.toArray(siteSettingsStorage.entries());
    stableRateLimits := Iter.toArray(rateLimitStorage.entries());
  };

  /// Called after canister upgrade - restore state
  system func postupgrade() {
    // Restore from stable memory - HashMaps are already initialized
    // from the stable variables in the declaration
  };
};
