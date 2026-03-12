import {
  AlertTriangle,
  FileX,
  Globe,
  Lock,
  Scale,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const painPoints = [
  {
    icon: XCircle,
    headline: "Account Terminated.",
    copy: "Your processor shut you down without warning. We’ve seen it happen thousands of times — and we know exactly how to respond.",
  },
  {
    icon: FileX,
    headline: "Application Rejected.",
    copy: "Stripe, PayPal, Square — they’re not built for your industry. We are. Rejection from them is not a verdict on your business.",
  },
  {
    icon: Lock,
    headline: "Reserves Holding Your Cash.",
    copy: "Rolling reserves don’t have to be permanent. We structure accounts that reduce reserve requirements as your account history builds.",
  },
  {
    icon: Globe,
    headline: "International Sales Blocked.",
    copy: "Global customers are ready to buy. Your processor shouldn’t be the reason they can’t reach checkout.",
  },
  {
    icon: AlertTriangle,
    headline: "Chargeback Pressure.",
    copy: "High chargeback ratios don’t have to end your processing. We build chargeback protection and dispute support into every account structure.",
  },
  {
    icon: Scale,
    headline: "Compliance Uncertainty.",
    copy: "Operating in a regulated vertical? We understand the compliance landscape and structure your account accordingly.",
  },
];

export function PainPointsSection() {
  return (
    <section className="py-20 bg-white dark:bg-cybin-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cybin-teal">
            Common Situations
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mt-3 mb-3">
            We’ve Seen Every Problem. We Know Every Solution.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {painPoints.map(({ icon: Icon, headline, copy }, i) => (
            <motion.div
              key={headline}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{
                borderColor: "rgba(99,102,241,0.35)",
                boxShadow: "0 0 20px rgba(99,102,241,0.12)",
              }}
              className="p-7 rounded-2xl bg-slate-50 dark:bg-[#110F22] border border-slate-200 dark:border-white/5 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/12 flex items-center justify-center mb-4">
                <Icon
                  size={18}
                  className="text-indigo-600 dark:text-teal-200"
                />
              </div>
              <h3 className="font-display text-[1.15rem] font-bold text-slate-900 dark:text-[#E8EDF8] mb-2.5">
                {headline}
              </h3>
              <p className="text-slate-600 dark:text-teal-50/80 text-sm leading-relaxed">
                {copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
