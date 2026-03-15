import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";

export const ALL_INDUSTRIES = [
  "Research Peptides",
  "CBD & Botanicals",
  "Cannabis (state-legal)",
  "Firearms & Ammunition",
  "Online Gaming & iGaming",
  "Nutraceuticals & Supplements",
  "Kratom & Ethnobotanicals",
  "Telemedicine & Digital Health",
  "E-Cigarettes & Vaping",
  "Debt Collection",
  "Subscription Businesses",
  "Travel & Timeshare",
  "High-Volume E-Commerce",
  "Firearms Parts & Accessories",
  "Adult Entertainment",
  "Dating & Relationship Apps",
  "Pawn Shops & Secondhand",
  "Check Cashing & Money Services",
  "Bail Bonds",
  "Moving & Relocation",
  "Ticket Brokers & Resellers",
  "Auction Houses",
  "Tobacco & Cigars",
  "Dietary Supplements",
  "Herbal Remedies",
  "Essential Oils & Aromatherapy",
  "Crystals & New Age",
  "Coaching & Consulting",
  "Business Opportunity & MLM",
  "Lead Generation",
  "Affiliate Marketing",
  "Credit Repair & Counseling",
  "Debt Settlement",
  "Loan Brokerage",
  "Financial Education",
  "Cryptocurrency & NFTs",
  "Forex & Trading Education",
  "Insurance Lead Generation",
  "Telemarketing",
  "Continuity Programs",
  "Online Pharmacy",
  "Pet Medications",
  "Compounding Pharmacy",
  "Medical Devices",
  "Laboratory Equipment",
  "Research Chemicals",
  "Mushrooms & Spores",
  "Seeds & Clones",
  "Hemp Products",
  "Firearms Training",
  "Security Services",
  "Private Investigation",
  "Background Checks",
  "Alcohol & Spirits",
  "Wine Subscription",
  "Hunting & Outdoor Sports",
  "Martial Arts Supplies",
  "Tattoo & Body Modification",
  "Auto Warranties",
  "Rental Car & Peer-to-Peer",
  "Luxury Goods Resale",
  "Electronics Resale",
  "Software Licensing",
  "Digital Downloads",
  "Online Courses & Coaching",
  "High-Value Jewelry",
  "Rare Coins & Precious Metals",
  "Legal Services",
  "Nonprofit Fundraising",
  "Weight Loss Programs",
  "Cosmetic Procedures",
  "Anti-Aging Clinics",
  "Skin Care & Aesthetics",
  "Compounded Medications",
  "Animal Health Products",
  "Exotic Pet Sales",
  "Adventure Tourism",
  "Extreme Sports Equipment",
  "Other High-Risk",
];

export function IndustryTicker() {
  const { resolved } = useTheme();
  const _isLight = resolved === "light";

  return (
    <section className="py-20 bg-slate-100 dark:bg-[#0c1020]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#00d4b8]">
          Industries
        </span>
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mt-3 mb-3">
          If Banks Said No, <span className="text-[#00d4b8]">We Say Yes</span>
        </h2>
        <p className="text-slate-600 dark:text-teal-50/80 max-w-2xl mx-auto">
          Cybin Enterprises works with businesses across every industry —
          including those labeled high-risk, hard-to-place, or previously
          declined.
        </p>
      </div>

      <div className="overflow-hidden relative py-3 border-y border-slate-200 dark:border-white/5">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-slate-100 dark:from-[#0c1020] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-slate-100 dark:from-[#0c1020] to-transparent pointer-events-none" />

        <div className="ticker-track">
          {[
            ...ALL_INDUSTRIES.map((ind) => ({ label: ind, key: `a-${ind}` })),
            ...ALL_INDUSTRIES.map((ind) => ({ label: ind, key: `b-${ind}` })),
          ].map(({ label, key }) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 rounded-full text-sm font-medium flex-shrink-0 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-slate-600 dark:text-teal-50/80 whitespace-nowrap"
            >
              <span className="text-cybin-teal text-[8px]">◆</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
