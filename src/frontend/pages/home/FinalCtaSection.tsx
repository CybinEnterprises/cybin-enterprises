import NeuronCanvas from "@/src/components/NeuronCanvas";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Link } from "@/src/lib/router";
import { ChevronRight } from "lucide-react";
import React from "react";

export function FinalCtaSection() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  return (
    <section className="bg-slate-50 dark:bg-cybin-navy py-20 relative overflow-hidden">
      <NeuronCanvas mode={isLight ? "light" : "dark"} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mb-4">
          Ready to Get <span className="text-[#00d4b8]">Approved?</span>
        </h2>
        <p className="text-slate-600 dark:text-teal-50/80 mb-8">
          Free review, no commitment. A real person reviews your situation
          within 24 hours.
        </p>
        <Link
          to="/apply"
          data-ocid="final.apply.button"
          className="cybin-btn-blue inline-flex"
        >
          Get a Free Account Review <ChevronRight size={15} />
        </Link>
      </div>
    </section>
  );
}
