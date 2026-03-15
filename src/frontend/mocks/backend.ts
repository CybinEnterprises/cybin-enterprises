import type { backendInterface, BlogPost, ContactSubmission, PartialLead, PartnerLead, WizardApplication } from "../backend";

// Mock backend for Vercel preview deployment
// This allows the app to function without blockchain connectivity
export const mockBackend: backendInterface = {
  // Blog posts
  getAllBlogPosts: async (): Promise<BlogPost[]> => {
    return [];
  },
  getPublishedBlogPosts: async (): Promise<BlogPost[]> => {
    return [];
  },
  getBlogPost: async (_id: bigint): Promise<BlogPost | null> => {
    return null;
  },
  createBlogPost: async (title: string, category: string, excerpt: string, body: string, author: string, readTime: string, publishDate: string): Promise<bigint> => {
    console.log("Mock createBlogPost:", { title, category, excerpt, body, author, readTime, publishDate });
    return 0n;
  },
  updateBlogPost: async (id: bigint, title: string, category: string, excerpt: string, body: string, author: string, readTime: string, publishDate: string): Promise<boolean> => {
    console.log("Mock updateBlogPost:", { id, title, category, excerpt, body, author, readTime, publishDate });
    return true;
  },
  deleteBlogPost: async (_id: bigint): Promise<boolean> => {
    return true;
  },
  publishBlogPost: async (_id: bigint): Promise<boolean> => {
    return true;
  },
  unpublishBlogPost: async (_id: bigint): Promise<boolean> => {
    return true;
  },

  // Partial leads
  getAllPartialLeads: async (): Promise<PartialLead[]> => {
    return [];
  },
  savePartialLead: async (email: string, industry: string, regulatoryHurdle: string): Promise<bigint> => {
    console.log("Mock savePartialLead:", { email, industry, regulatoryHurdle });
    return 0n;
  },

  // Partner leads
  getAllPartnerLeads: async (): Promise<PartnerLead[]> => {
    return [];
  },
  submitPartnerLead: async (companyName: string, contactName: string, email: string, phone: string, partnershipType: string, description: string): Promise<bigint> => {
    console.log("Mock submitPartnerLead:", { companyName, contactName, email, phone, partnershipType, description });
    return 0n;
  },
  getTotalPartnerLeads: async (): Promise<bigint> => {
    return 0n;
  },

  // Contact submissions
  getAllSubmissions: async (): Promise<ContactSubmission[]> => {
    return [];
  },
  submitContactForm: async (name: string, email: string, phone: string, businessType: string, message: string): Promise<bigint> => {
    console.log("Mock submitContactForm:", { name, email, phone, businessType, message });
    return 0n;
  },
  getTotalSubmissions: async (): Promise<bigint> => {
    return 0n;
  },

  // Wizard applications
  getAllWizardApplications: async (): Promise<WizardApplication[]> => {
    return [];
  },
  submitWizardApplication: async (industry: string, regulatoryHurdle: string, name: string, email: string, phone: string, businessName: string, fein: string, hasFein: boolean): Promise<bigint> => {
    console.log("Mock submitWizardApplication:", { industry, regulatoryHurdle, name, email, phone, businessName, fein, hasFein });
    return 0n;
  },
  getTotalWizardApplications: async (): Promise<bigint> => {
    return 0n;
  },
};