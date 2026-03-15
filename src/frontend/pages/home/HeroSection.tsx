import NeuronCanvas from "@/src/components/NeuronCanvas";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Link } from "@/src/lib/router";
import {
  ArrowUpRight,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Globe,
  Lock,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

/* ───── Psychological Trust Architecture ──────────────────────────
   Uses proven persuasion methodologies:
   1. SOCIAL PROOF — Live-counting approval stats
   2. AUTHORITY — Institutional dashboard aesthetic
   3. SAFETY SIGNALS — Green/teal glow = calm, security
   4. RECIPROCITY — Free review, no commitment
   5. ANCHORING — Large approval numbers anchor expectations
   6. DOPAMINE TRIGGERS — Satisfying count-up animations + success checkmarks
   7. VISUAL HIERARCHY — Eye drawn center→metrics→CTA
──────────────────────────────────────────────────────────────────── */

/* ─── Animated Counter (dopamine trigger) ────────────────────────  */
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  delay = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve for satisfying deceleration
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.round(eased * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [end, duration, delay]);
  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Live Transaction Pulse (social proof) ──────────────────────  */
function TransactionPulse({ isLight }: { isLight: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 100,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: "#00d4b8",
        backgroundColor: isLight
          ? "rgba(0,212,184,0.08)"
          : "rgba(0,212,184,0.08)",
        border: `1px solid ${isLight ? "rgba(0,212,184,0.15)" : "rgba(0,212,184,0.12)"}`,
      }}
    >
      <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#00d4b8",
          display: "inline-block",
          boxShadow: "0 0 8px rgba(0,212,184,0.6)",
        }}
      />
      Processing Live
    </motion.div>
  );
}

/* ───── HERO SECTION ─────────────────────────────────────────────  */
export function HeroSection() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  /* Theme tokens */
  const cardBg = isLight ? "rgba(255,255,255,0.85)" : "rgba(14,20,40,0.7)";
  const cardBorder = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  const textPrimary = isLight ? "#0f172a" : "#f1f5f9";
  const textMuted = isLight ? "rgba(15,23,42,0.55)" : "rgba(241,245,249,0.45)";
  const _glowColor = isLight ? "rgba(0,212,184,0.07)" : "rgba(0,212,184,0.12)";

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center bg-white dark:bg-cybin-navy">
      <NeuronCanvas mode={isLight ? "light" : "dark"} />

      {/* Ambient gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,212,184,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 20% 60%, rgba(99,102,241,0.04) 0%, transparent 50%)"
            : "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,212,184,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 20% 60%, rgba(99,102,241,0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── LEFT: Copy with psychological triggers ────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Authority badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 bg-indigo-500/10 border border-indigo-500/20 text-teal-800 dark:text-teal-100/80">
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 rounded-full bg-cybin-teal shadow-[0_0_8px_rgba(0,212,184,0.6)]"
              />
              High-Risk Payment Specialists
            </div>

            {/* Headline — pain → relief */}
            <h1
              className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] mb-6"
              style={{ color: textPrimary }}
            >
              Your processor shut you&nbsp;down.{" "}
              <br className="hidden sm:block" />
              <span className="text-cybin-teal">We get you approved.</span>
            </h1>

            {/* Subhead — specificity builds trust */}
            <p
              className="text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: textMuted, lineHeight: 1.7 }}
            >
              Cybin Enterprises structures domestic and international merchant
              accounts for high-risk businesses — from startups processing their
              first transaction to enterprises handling millions monthly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                to="/apply"
                data-ocid="hero.primary.button"
                className="cybin-btn-blue"
              >
                Get a Free Account Review <ChevronRight size={15} />
              </Link>
              <Link
                to="/industries"
                data-ocid="hero.secondary.button"
                className="cybin-btn-ghost-white"
              >
                See All Industries
              </Link>
            </div>

            {/* Safety signal */}
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: textMuted }}
            >
              <Lock size={12} className="text-cybin-teal" />
              No commitment · Secure · Reviewed within 24 hours
            </div>
          </motion.div>

          {/* ── RIGHT: Payment Processing Dashboard ──────────── */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              style={{
                perspective: 1000,
                position: "relative",
              }}
            >
              {/* ─── Main dashboard card ─── */}
              <div
                style={{
                  borderRadius: 24,
                  padding: "32px 28px",
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: isLight
                    ? "0 25px 80px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.04)"
                    : "0 25px 80px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle top glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    left: "20%",
                    right: "20%",
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(0,212,184,0.5), transparent)",
                  }}
                />

                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#00d4b8",
                        marginBottom: 2,
                      }}
                    >
                      Merchant Dashboard
                    </p>
                    <p style={{ fontSize: "0.75rem", color: textMuted }}>
                      Account Status Overview
                    </p>
                  </div>
                  <TransactionPulse isLight={isLight} />
                </div>

                {/* ─── Big Approval Status (center anchor) ─── */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                  style={{
                    textAlign: "center",
                    padding: "28px 0 24px",
                    borderRadius: 16,
                    marginBottom: 20,
                    background: isLight
                      ? "linear-gradient(135deg, rgba(0,212,184,0.06) 0%, rgba(99,102,241,0.04) 100%)"
                      : "linear-gradient(135deg, rgba(0,212,184,0.08) 0%, rgba(99,102,241,0.06) 100%)",
                    border: `1px solid ${isLight ? "rgba(0,212,184,0.12)" : "rgba(0,212,184,0.1)"}`,
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  >
                    <CheckCircle
                      size={44}
                      style={{ color: "#00d4b8", margin: "0 auto 10px" }}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      fontFamily: "Sora, system-ui, sans-serif",
                      color: "#00d4b8",
                      marginBottom: 2,
                    }}
                  >
                    Account Approved
                  </p>
                  <p style={{ fontSize: "0.72rem", color: textMuted }}>
                    Your merchant account is active and processing
                  </p>
                </motion.div>

                {/* ─── Metric Grid (social proof + anchoring) ─── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {[
                    {
                      icon: TrendingUp,
                      value: 97.3,
                      suffix: "%",
                      label: "Approval Rate",
                      delay: 600,
                    },
                    {
                      icon: Globe,
                      value: 100,
                      suffix: "+",
                      label: "Industries",
                      delay: 800,
                    },
                    {
                      icon: Shield,
                      value: 24,
                      suffix: "hr",
                      prefix: "<",
                      label: "Avg. Review",
                      delay: 1000,
                    },
                  ].map(
                    ({
                      icon: Icon,
                      value,
                      suffix,
                      prefix,
                      label,
                      delay: d,
                    }) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: d / 1000, duration: 0.5 }}
                        style={{
                          textAlign: "center",
                          padding: "14px 8px",
                          borderRadius: 12,
                          backgroundColor: isLight
                            ? "rgba(0,0,0,0.02)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${cardBorder}`,
                        }}
                      >
                        <Icon
                          size={16}
                          style={{
                            color: "#00d4b8",
                            margin: "0 auto 6px",
                            display: "block",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "1.15rem",
                            fontWeight: 800,
                            fontFamily: "Sora, system-ui, sans-serif",
                            color: textPrimary,
                            lineHeight: 1,
                          }}
                        >
                          <AnimatedCounter
                            end={value}
                            suffix={suffix}
                            prefix={prefix}
                            delay={d}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: textMuted,
                            marginTop: 4,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {label}
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>

                {/* ─── Simulated transaction feed (social proof) ─── */}
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1px solid ${cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 14px",
                      backgroundColor: isLight
                        ? "rgba(0,0,0,0.02)"
                        : "rgba(255,255,255,0.02)",
                      borderBottom: `1px solid ${cardBorder}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: textMuted,
                      }}
                    >
                      Recent Approvals
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "#00d4b8" }}>
                      View All{" "}
                      <ArrowUpRight size={10} style={{ display: "inline" }} />
                    </span>
                  </div>
                  {[
                    {
                      industry: "CBD & Wellness",
                      type: "Domestic",
                      time: "2m ago",
                      delay: 1.3,
                    },
                    {
                      industry: "Online Gaming",
                      type: "International",
                      time: "8m ago",
                      delay: 1.5,
                    },
                    {
                      industry: "Nutraceuticals",
                      type: "Multi-MID",
                      time: "14m ago",
                      delay: 1.7,
                    },
                  ].map(({ industry, type, time, delay: d }, idx) => (
                    <motion.div
                      key={industry}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: d, duration: 0.4 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderBottom:
                          idx < 2 ? `1px solid ${cardBorder}` : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            backgroundColor: "rgba(0,212,184,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CreditCard size={12} style={{ color: "#00d4b8" }} />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: textPrimary,
                              lineHeight: 1.2,
                            }}
                          >
                            {industry}
                          </p>
                          <p
                            style={{
                              fontSize: "0.6rem",
                              color: textMuted,
                            }}
                          >
                            {type}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: textMuted,
                          }}
                        >
                          {time}
                        </span>
                        <CheckCircle size={14} style={{ color: "#00d4b8" }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ─── Floating accent elements ─── */}
              {/* Floating badge bottom-left */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                style={{
                  position: "absolute",
                  bottom: -16,
                  left: -16,
                  padding: "8px 14px",
                  borderRadius: 12,
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  boxShadow: isLight
                    ? "0 8px 24px rgba(0,0,0,0.06)"
                    : "0 8px 24px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#00d4b8",
                }}
              >
                <Shield size={14} />
                PCI DSS Compliant
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
