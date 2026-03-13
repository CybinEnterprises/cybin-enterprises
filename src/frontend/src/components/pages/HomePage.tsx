import { useSeo } from "@/hooks/useSeo";
import React from "react";
import { EnterpriseCalloutSection } from "./home/EnterpriseCalloutSection";
import { FinalCtaSection } from "./home/FinalCtaSection";
import { HeroSection } from "./home/HeroSection";
import { HowItWorksSection } from "./home/HowItWorksSection";
import { IndustryGridSection } from "./home/IndustryGrid";
import { IndustryTicker } from "./home/IndustryTicker";
import { PainPointsSection } from "./home/PainPointsSection";
import { TestimonialsSection } from "./home/TestimonialsSection";

export default function HomePage() {
  useSeo({
    canonical: "https://cybinenterprises.com/",
    title:
      "High-Risk Merchant Accounts | Payment Solutions for Every Industry | Cybin Enterprises",
    description:
      "Cybin Enterprises structures high-risk merchant accounts for businesses in 100+ industries — from CBD and firearms to peptides and enterprise e-commerce. Free account review, no commitment.",
  });

  return (
    <div className="bg-white dark:bg-cybin-navy text-slate-900 dark:text-teal-50">
      <HeroSection />
      <IndustryTicker />
      <PainPointsSection />
      <HowItWorksSection />
      <IndustryGridSection />
      <EnterpriseCalloutSection />
      <TestimonialsSection />
      <FinalCtaSection />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
