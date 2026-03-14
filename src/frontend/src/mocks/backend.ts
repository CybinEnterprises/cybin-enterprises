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
  createBlogPost: async ({ blog_post }) => {
    return { ok: true };
  },
  updateBlogPost: async ({ id, blog_post }) => {
    return { ok: true };
  },
  deleteBlogPost: async ({ id }) => {
    return { ok: true };
  },

  // Site settings
  get_site_settings: async () => {
    return { ok: {
      contact_info: {
        email: "contact@cybinenterprises.com",
        phone: "888-321-2100",
        address: "",
      },
      hero_content: {
        headline: "High-Risk Payment Specialists",
        subheadline: "We get you approved when others say no",
        description: "Cybin Enterprises structures high-risk merchant accounts",
      },
      about_content: {
        headline: "About Cybin Enterprises",
        description: "Your trusted partner for high-risk payment processing",
      },
      color_theme: "dark",
    } };
  },
  update_site_settings: async ({ site_settings }) => {
    return { ok: true };
  },

  // Image settings
  get_image_settings: async () => {
    return { ok: {} };
  },
  update_image_settings: async ({ image_settings }) => {
    return { ok: true };
  },

  // Partner leads
  get_all_partner_leads: async ({ page, pageSize }) => {
    return { ok: { data: [], page: { page, pageSize, totalItems: 0n, totalPages: 0n } } };
  },
  create_partner_lead: async ({ partner_lead }) => {
    return { ok: true };
  },
  update_partner_lead: async ({ id, partner_lead }) => {
    return { ok: true };
  },
  delete_partner_lead: async ({ id }) => {
    return { ok: true };
  },

  // Analytics
  get_analytics: async () => {
    return { ok: {
      total_visitors: 0,
      total_submissions: 0,
      conversion_rate: 0,
      top_pages: [],
      recent_visitors: [],
    } };
  },
};
