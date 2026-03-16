import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageViewData {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

export const ANALYTICS_KEY = "cybin-analytics";

export interface AnalyticsEvent {
  sessionId: string;
  path: string;
  deviceType: string;
  timestamp: number;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Simple page view tracking
    const pageData: PageViewData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname,
    };

    // In production, this would send to analytics
    console.log("[PageView]", pageData);
  }, [location]);

  return null;
}

export type { PageViewData };