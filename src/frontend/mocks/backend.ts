import type { backendInterface, ContactSubmission, WizardApplication, PartialLead, BlogPost } from "../backend";

// Mock backend for Vercel preview deployment
// This allows the app to function without blockchain connectivity
export const mockBackend: backendInterface = {
  // System functions
  healthCheck: async () => {
    return {
      status: "healthy",
      version: "2.0.0",
      timestamp: 0n,
      storageStats: {
        submissions: 0n,
        applications: 0n,
        leads: 0n,
        blogPosts: 0n,
        partnerLeads: 0n,
      },
    };
  },
  getVersion: async () => {
    return "2.0.0";
  },
  getCanisterPrincipal: async () => {
    return { toText: () => "mock-principal" } as any;
  },

  // Analytics
  getAnalytics: async () => {
    return {
      totalContactSubmissions: 0n,
      totalWizardApplications: 0n,
      totalPartnerLeads: 0n,
      totalBlogViews: 0n,
      totalActivePartners: 0n,
      submissionsThisMonth: 0n,
      applicationsThisMonth: 0n,
      leadsThisMonth: 0n,
      timestamp: 0n,
    };
  },

  // Site settings
  getSiteSetting: async (key) => {
    return [];
  },
  setSiteSetting: async (key, value) => {
    return { ok: true };
  },
  getAllSiteSettings: async () => {
    return [];
  },

  // Audit logs
  getAuditLogs: async ({ page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },

  // Contact submissions
  submitContactForm: async (name, email, phone, businessType, message) => {
    return { ok: 0n };
  },
  getAllSubmissions: async ({ page, pageSize }) => {
    const submissions: ContactSubmission[] = [];
    return { ok: { data: submissions, page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getSubmission: async (id) => {
    return { err: "Submission not found in mock mode" };
  },
  getTotalSubmissions: async () => {
    return 0n;
  },
  updateSubmissionStatus: async (id, status, notes) => {
    return { ok: true };
  },

  // Wizard applications
  submitWizardApplication: async (industry, regulatoryHurdle, name, email, phone, businessName, fein, hasFein) => {
    return { ok: 0n };
  },
  savePartialLead: async (email, industry, regulatoryHurdle) => {
    return { ok: 0n };
  },
  getAllWizardApplications: async ({ page, pageSize }) => {
    const applications: WizardApplication[] = [];
    return { ok: { data: applications, page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getAllPartialLeads: async ({ page, pageSize }) => {
    const leads: PartialLead[] = [];
    return { ok: { data: leads, page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getTotalWizardApplications: async () => {
    return 0n;
  },
  updateApplicationStatus: async (id, status, notes) => {
    return { ok: true };
  },

  // Blog posts
  getAllBlogPosts: async ({ page, pageSize }) => {
    const posts: BlogPost[] = [];
    return { ok: { data: posts, page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getBlogPost: async (id) => {
    return { err: "Blog post not found in mock mode" };
  },
  createBlogPost: async (title, category, excerpt, body, author, readTime, publishDate, featured, tags, timestamp = 0n, viewCount = 0n) => {
    return { ok: 0n };
  },
  updateBlogPost: async (id, title, category, excerpt, body, author, readTime, publishDate, featured, tags, published, content, seoTitle, seoDescription) => {
    return { ok: true };
  },
  deleteBlogPost: async (id) => {
    return { ok: true };
  },
  publishBlogPost: async (id) => {
    return { ok: true };
  },
  unpublishBlogPost: async (id) => {
    return { ok: true };
  },
  getPublishedBlogPosts: async ({ page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getFeaturedBlogPosts: async () => {
    return [];
  },
  getBlogPostsByCategory: async (category, { page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },

  // Image settings
  getImageSettings: async () => {
    return { ok: {} };
  },
  updateImageSettings: async (image_settings) => {
    return { ok: true };
  },

  // Partner leads
  submitPartnerLead: async (company, email, phone, website, message) => {
    return { ok: 0n };
  },
  getAllPartnerLeads: async ({ page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getTotalPartnerLeads: async () => {
    return 0n;
  },
  updatePartnerLeadStatus: async (id, status, notes) => {
    return { ok: true };
  },
  deletePartnerLead: async (id) => {
    return { ok: true };
  },
};
