import NeuronCanvas from "@/src/components/NeuronCanvas";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Link } from "@/src/lib/router";
import { motion } from "motion/react";
import React from "react";

const steps = [
  {
    n: "1",
    headline: "Tell Us Your Situation",
    copy: "Free, secure, and no commitment. Tell us your industry, your monthly volume, and what’s gone wrong — or what you’re trying to build.",
  },
  {
    n: "2",
    headline: "We Structure Your Options",
    copy: "We match your business to the best-fit processors across our network. You see your options before anything is submitted — no surprises.",
  },
  {
    n: "3",
    headline: "Application & Approval",
    copy: "We manage the full application process. Approvals typically take 3 to 10 business days depending on your volume and vertical.",
  },
  {
    n: "4",
    headline: "Process With Confidence",
    copy: "Ongoing account monitoring, chargeback support, and scaling assistance as your business grows. We don’t disappear after approval.",
  },
];

export function HowItWorksSection() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#110F22] relative overflow-hidden">
      <NeuronCanvas mode={isLight ? "light" : "dark"} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00d4b8]">
            Process
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mt-3 mb-3">
            How We Get You Approved
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[36px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {steps.map(({ n, headline, copy }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-[14px] bg-white/80 dark:bg-white/5 border border-indigo-500/10 dark:border-white/10 relative backdrop-blur-md shadow-sm dark:shadow-none"
            >
              <div className="w-10 h-10 rounded-full font-bold text-white text-sm bg-gradient-to-br from-[#7c5cbf] to-[#00d4b8] flex items-center justify-center mb-4 relative z-10 shadow-[0_0_16px_rgba(99,102,241,0.35)]">
                {n}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#E8EDF8] mb-2 text-base">
                {headline}
              </h3>
              <p className="text-slate-600 dark:text-teal-50/80 text-[0.85rem] leading-[1.7]">
                {copy}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/how-it-works"
            data-ocid="howitworks.link.button"
            className="text-[#00d4b8] text-[0.9rem] font-semibold hover:text-teal-400 transition-colors"
          >
            Learn more about our process →
          </Link>
        </div>
      </div>
    </section>
  );
}
