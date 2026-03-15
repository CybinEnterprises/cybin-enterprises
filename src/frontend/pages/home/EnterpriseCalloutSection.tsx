import NeuronCanvas from "@/components/NeuronCanvas";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export function EnterpriseCalloutSection() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  return (
    <section className="bg-slate-50 dark:bg-cybin-navy py-20 relative overflow-hidden">
      <NeuronCanvas mode={isLight ? "light" : "dark"} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mb-5">
          Processing millions per month? <br className="hidden sm:block" />
          <span className="text-[#00d4b8]">We build accounts that scale.</span>
        </h2>
        <p className="text-slate-600 dark:text-teal-50/80 leading-[1.75] mb-8 text-base">
          From multi-MID structuring to international acquiring and backup
          processor redundancy, Cybin Enterprises supports high-volume merchants
          who need stability and reliability — not surprises. Our enterprise
          team reviews large-volume accounts personally.
        </p>
        <Link
          to="/apply/enterprise"
          data-ocid="enterprise.callout.button"
          className="cybin-btn-blue inline-flex"
        >
          Request a Volume Review <ChevronRight size={15} />
        </Link>
        <p className="mt-4 text-[0.8rem] text-slate-500 dark:text-teal-50/45">
          High-volume accounts receive dedicated review and a direct point of
          contact.
        </p>
      </div>
    </section>
  );
}
