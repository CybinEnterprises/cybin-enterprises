import React from "react";

const testimonials = [
  {
    tag: "NUTRACEUTICALS",
    problem:
      "We were processing $280K/month when our processor terminated us without warning, citing chargeback ratios that never exceeded 0.8%.",
    outcome:
      "Cybin had us approved with a new processor in 9 days. Rates were competitive and we haven’t had an issue since.",
    attribution: "Michael T., Ohio",
  },
  {
    tag: "CBD & BOTANICALS",
    problem:
      "PayPal shut us down on a Friday afternoon with 48 hours notice. We had no backup and $60K in pending orders.",
    outcome:
      "Cybin found us a domestic processor and had us live again in under two weeks. We’ve been processing without issue for eight months.",
    attribution: "Verified Merchant — CBD & Botanicals",
  },
  {
    tag: "FIREARMS",
    problem:
      "Two processors terminated us in the same quarter — both citing ‘policy changes’ with no explanation.",
    outcome:
      "Cybin structured a dual-processor setup that’s given us redundancy we never had before. Best decision we made.",
    attribution: "James R., Texas",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-cybin-navy border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cybin-teal">
            Results
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mt-3">
            Merchants We’ve Helped
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric block 1 */}
          <div className="p-7 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-amber-500/20 flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">
            <p className="font-display text-[2.5rem] font-bold text-amber-700 dark:text-[#C9A84C] mb-2">
              $240M+
            </p>
            <p className="text-slate-600 dark:text-teal-50/80 text-[0.9rem]">
              processed across our merchant network
            </p>
            <p className="text-slate-500 dark:text-teal-50/45 text-[0.75rem] mt-2 italic">
              [PLACEHOLDER — replace with real figure]
            </p>
          </div>

          {tests()}

          {/* Metric block 2 */}
          <div className="p-7 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-amber-500/20 flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">
            <p className="font-display text-[2.5rem] font-bold text-amber-700 dark:text-[#C9A84C] mb-2">
              7 Days
            </p>
            <p className="text-slate-600 dark:text-teal-50/80 text-[0.9rem]">
              average approval timeline
            </p>
            <p className="text-slate-500 dark:text-teal-50/45 text-[0.75rem] mt-2 italic">
              [PLACEHOLDER — replace with real figure]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function tests() {
  return testimonials.map(({ tag, problem, outcome, attribution }) => (
    <div
      key={tag}
      className="p-7 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col shadow-sm dark:shadow-none"
    >
      <div className="mb-4">
        <span className="inline-block text-[0.65rem] font-bold tracking-[0.12em] text-[#C9A84C] uppercase py-1 px-2.5 rounded-md bg-amber-500/10 border border-amber-500/25">
          {tag}
        </span>
      </div>
      <p className="text-slate-600 dark:text-teal-50/80 text-[0.875rem] leading-[1.65] mb-3 italic">
        “{problem}”
      </p>
      <p className="text-slate-900 dark:text-[#E8EDF8] text-[0.875rem] leading-[1.65] mb-4 flex-grow">
        “{outcome}”
      </p>
      <p className="text-[#00d4b8] text-[0.8rem] font-semibold mt-auto">
        — {attribution}
      </p>
    </div>
  ));
}
