import { motion } from "motion/react";
import React from "react";
import { Link } from "react-router-dom";

const industryTiles = [
  { label: "Cannabis & CBD", href: "/industries/cannabis-cbd", icon: "🌿" },
  {
    label: "Firearms & Ammo",
    href: "/industries/firearms-ammunition",
    icon: "🎯",
  },
  {
    label: "Nutraceuticals",
    href: "/industries/nutraceuticals-supplements",
    icon: "💊",
  },
  {
    label: "Telemedicine",
    href: "/industries/telemedicine-healthcare",
    icon: "⚕️",
  },
  { label: "Online Gaming", href: "/industries/online-gaming", icon: "🎮" },
  {
    label: "E-Cigarettes",
    href: "/industries/e-cigarettes-vaping",
    icon: "💨",
  },
  {
    label: "Kratom & Spores",
    href: "/industries/kratom-spores-ethnobotanicals",
    icon: "🌱",
  },
  { label: "Debt Collection", href: "/industries/debt-collection", icon: "📋" },
  {
    label: "Subscription",
    href: "/industries/subscription-businesses",
    icon: "♻️",
  },
  {
    label: "Travel & Timeshare",
    href: "/industries/travel-timeshare",
    icon: "✈️",
  },
  { label: "Peptides", href: "/industries/peptides", icon: "🔬" },
  { label: "View All", href: "/industries", icon: "→" },
];

export function IndustryGridSection() {
  return (
    <section className="py-20 bg-white dark:bg-cybin-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cybin-teal">
            Common Industries
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-slate-900 dark:text-[#E8EDF8] mt-3">
            Industries We Serve
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {industryTiles.map(({ label, href, icon }, i) => (
            <Link
              key={href}
              to={href}
              data-ocid={`industries.item.${label === "View All" ? "link" : "1"}`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  borderColor: "rgba(99,102,241,0.4)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.12)",
                }}
                className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer text-center h-full"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-[#E8EDF8] leading-[1.3]">
                  {label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        <p className="text-center mt-6">
          <Link
            to="/industries"
            data-ocid="industries.all.link"
            className="text-[#00d4b8] font-semibold hover:text-teal-400 transition-colors"
          >
            View All 100+ Industries →
          </Link>
        </p>
      </div>
    </section>
  );
}
