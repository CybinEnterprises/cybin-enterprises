import type { backendInterface } from "../backend";

// Mock backend for Vercel preview deployment
// This allows the app to function without blockchain connectivity
export const mockBackend: backendInterface = {
  // Blog posts
  getAllBlogPosts: async ({ page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getBlogPost: async ({ id }) => {
    return { err: "Blog post not found in mock mode" };
  },
  createBlogPost: async ({ title, category, excerpt, body, author, readTime, publishDate, featured, tags }) => {
    return { ok: 0n };
  },
  updateBlogPost: async ({ id, title, category, excerpt, body, author, readTime, publishDate, featured, tags, published, content }) => {
    return { ok: true };
  },
  deleteBlogPost: async ({ id }) => {
    return { ok: true };
  },
  getPublishedBlogPosts: async ({ page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  getFeaturedBlogPosts: async () => {
    return [];
  },

  // Site settings
  getSiteSetting: async (key) => {
    return [];
  },
  setSiteSetting: async (key, value) => {
    return { ok: true };
  },
  getAllSiteSettings: async () => {
    return [["mock", "mode"]];
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
  updatePartnerLeadStatus: async ({ id, status, notes }) => {
    return { ok: true };
  },
  deletePartnerLead: async ({ id }) => {
    return { ok: true };
  },

  // Analytics
  getAnalytics: async () => {
    return { ok: {
      total_visitors: 0,
      total_submissions: 0,
      conversion_rate: 0,
      top_pages: [],
      recent_visitors: [],
    } };
  },
};
