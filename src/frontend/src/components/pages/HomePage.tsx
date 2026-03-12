import NeuronCanvas from "@/components/NeuronCanvas";
import PaymentAnimation from "@/components/PaymentAnimation";
import { useTheme } from "@/contexts/ThemeContext";
import { useLiveSiteSettings } from "@/hooks/useLiveSiteSettings";
import { useSeo } from "@/hooks/useSeo";
import { Link } from "@/lib/router";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  CreditCard,
  FileX,
  Globe,
  Landmark,
  Layers,
  Lock,
  Scale,
  Shield,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

// Comprehensive industry list
const ALL_INDUSTRIES = [
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
    copy: "Global customers are ready to buy. Your payment processor shouldn’t be the reason they can’t reach checkout.",
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
  { label: "All businesses", href: "/industries", hrtitle: "All businesses approved", icon: "🔬" },
  { label: "View All", href: "/industries?view=all", icon: "→" },
];

const testimonials = [
  {
    tag: "NUTRACEUTICALS",
    problem:
      "We were processing $280K/month when our processor terminated us without warning, citing chargeback ratios that never exceeded 0.8%.",
    outcome:
      "Cybin had us approved with a new processor in 72 hours. Rates were competitive and we haven’t had an issue since.",
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

export default function HomePage() {
  const _site = useLiveSiteSettings();
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  // Process animation state
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep(prev => prev >= 4 ? 1 : prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  useSeo({
    canonical: "https://cybinenterprises.com/",
    title:
      "High-Risk Merchant Accounts | Payment Solutions for Every Industry | Cybin Enterprises",
    description:
      "Cybin Enterprises structures high-risk merchant accounts for all businesses — from CBD and firearms to peptides and enterprise e-commerce. Free account review, no commitment.",
  });

  // Consistent theme colors - Bioluminescent Tech Design System
  const colors = {
    accent: isLight ? "var(--lm-accent-cyan)" : "var(--dm-accent-cyan)",
    accentSecondary: isLight ? "var(--lm-accent-indigo)" : "var(--dm-accent-violet)",
    textPrimary: isLight ? "var(--lm-text-primary)" : "var(--dm-text-primary)",
    textSecondary: isLight ? "var(--lm-text-secondary)" : "var(--dm-text-secondary)",
    textMuted: isLight ? "var(--lm-text-muted)" : "var(--dm-text-muted)",
    bgPrimary: isLight ? "var(--lm-bg-surface)" : "var(--dm-bg-deep)",
    bgSecondary: isLight ? "var(--lm-bg-elevated)" : "var(--dm-bg-surface)",
    cardBg: isLight ? "var(--lm-bg-surface)" : "rgba(255,255,255,0.03)",
    cardBorder: isLight ? "var(--lm-border)" : "rgba(255,255,255,0.07)",
    tagBg: isLight ? "rgba(0, 212, 184, 0.1)" : "rgba(99,102,241,0.12)",
    tagBorder: isLight ? "rgba(0, 212, 184, 0.25)" : "rgba(99,102,241,0.3)",
    tagText: isLight ? "var(--lm-accent-cyan)" : "rgba(232,245,242,0.8)",
  };

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        style={{
          background: colors.bgPrimary,
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <NeuronCanvas mode={isLight ? "light" : "dark"} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLight
              ? `radial-gradient(ellipse 70% 50% at 20% 40%, rgba(0, 212, 184, 0.25) 0%, transparent 50%),
                 radial-gradient(ellipse 60% 40% at 80% 60%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                 radial-gradient(ellipse 50% 30% at 50% 80%, rgba(124, 92, 191, 0.15) 0%, transparent 50%)`
              : "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)",
            pointerEvents: "none",
            mixBlendMode: isLight ? "multiply" : "normal",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          {/* Top Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: colors.accent }}>Millions</span>
              <span className="text-sm" style={{ color: colors.textSecondary }}>processed monthly</span>
            </div>
            <div className="w-px h-6" style={{ backgroundColor: colors.cardBorder }} />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: colors.accent }}>High</span>
              <span className="text-sm" style={{ color: colors.textSecondary }}>approval rate</span>
            </div>
            <div className="w-px h-6" style={{ backgroundColor: colors.cardBorder }} />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: colors.accent }}>48-72hrs</span>
              <span className="text-sm" style={{ color: colors.textSecondary }}>avg. setup time</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left column */}
            <div>
              {/* Pain Point Hook */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 animate-fade-up"
                style={{
                  background: isLight 
                    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"
                    : "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)",
                  border: `1px solid ${isLight ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.4)"}`,
                  color: isLight ? "#d97706" : "#f59e0b",
                  animationDelay: "0ms"
                }}
              >
                <AlertTriangle size={14} />
                Your processor terminated you without warning?
              </div>
              
              <h1
                className="animate-fade-up"
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                  fontWeight: 700,
                  color: colors.textPrimary,
                  lineHeight: 1.15,
                  marginBottom: 24,
                  animationDelay: "150ms"
                }}
              >
                We've helped <span style={{ color: colors.accent }}>businesses like yours</span> get back online in 48-72 hours
              </h1>
              <p
                className="animate-fade-up"
                style={{
                  fontSize: "1.1rem",
                  color: colors.textSecondary,
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 520,
                  animationDelay: "300ms"
                }}
              >
                From CBD to firearms, peptides to crypto — when banks say no, we build the solution that keeps you processing. No more sudden shutdowns, no more lost revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up" style={{ animationDelay: "450ms" }}>
                <Link
                  to="/apply"
                  data-ocid="hero.primary.button"
                  className="cybin-btn-blue"
                >
                  Get Back Online Fast <ChevronRight size={15} />
                </Link>
                <Link
                  to="/industries"
                  data-ocid="hero.secondary.button"
                  className="cybin-btn-ghost-white"
                >
                  See Success Stories
                </Link>
              </div>
              <div
                className="flex items-center gap-2 animate-fade-up"
                style={{ 
                  color: colors.textMuted, 
                  fontSize: "0.78rem",
                  animationDelay: "600ms"
                }}
              >
                <CheckCircle size={12} style={{ color: colors.accent }} />
                <span>Businesses rescued • Fast approval • No setup fees</span>
              </div>
            </div>
            {/* Right column — Trust Indicators */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-8">
              {/* Trust Badge 1 */}
              <div
                className="animate-fade-up"
                style={{
                  position: "relative",
                  width: 400,
                  height: 400,
                }}
              >
                <PaymentAnimation mode={isLight ? "light" : "dark"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Industry Ticker ──────────────────────────────────── */}
      <section
        style={{
          backgroundColor: isLight ? "#eef1f8" : "#0c1020",
          padding: "80px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.accent }}
            >
              Industries
            </span>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: colors.textPrimary,
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              If Banks Said No,{" "}
              <span style={{ color: colors.accent }}>We Say Yes</span>
            </h2>
            <p
              style={{ color: colors.textSecondary, maxWidth: 600, margin: "0 auto" }}
            >
              Cybin Enterprises works with businesses across every industry —
              including those labeled high-risk, hard-to-place, or previously
              declined.
            </p>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div
          style={{
            overflow: "hidden",
            position: "relative",
            padding: "12px 0",
            borderTop: `1px solid ${colors.cardBorder}`,
            borderBottom: `1px solid ${colors.cardBorder}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 80,
              zIndex: 2,
              background: isLight
                ? "linear-gradient(to right, #eef1f8, transparent)"
                : "linear-gradient(to right, #0c1020, transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 80,
              zIndex: 2,
              background: isLight
                ? "linear-gradient(to left, #eef1f8, transparent)"
                : "linear-gradient(to left, #0c1020, transparent)",
              pointerEvents: "none",
            }}
          />
          <div className="ticker-track">
            {[
              ...ALL_INDUSTRIES.map((ind) => ({ label: ind, key: `a-${ind}` })),
              ...ALL_INDUSTRIES.map((ind) => ({ label: ind, key: `b-${ind}` })),
            ].map(({ label, key }) => (
              <div
                key={key}
                className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 rounded-full text-sm font-medium flex-shrink-0"
                style={{
                  backgroundColor: isLight
                    ? "rgba(99,102,241,0.06)"
                    : "rgba(99,102,241,0.08)",
                  border: `1px solid ${isLight ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.2)"}`,
                  color: colors.textSecondary,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: colors.accent, fontSize: 8 }}>◆</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain Points ──────────────────────────────────────── */}
      <section style={{ backgroundColor: colors.bgPrimary, padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.accent }}
            >
              Common Situations
            </span>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: colors.textPrimary,
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              We’ve Seen Every Problem. We Know Every Solution.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map(({ icon: Icon, headline, copy }, i) => (
              <div
                key={`pain-point-${i}`}
                className={`animate-fade-rise${i > 0 ? ` animate-delay-${i * 80}` : ""}`}
                style={{
                  padding: 28,
                  borderRadius: 16,
                  backgroundColor: isLight ? "#F0F4FF" : "#110F22",
                  border: `1px solid ${colors.cardBorder}`,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(99,102,241,0.35)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 0 20px rgba(99,102,241,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    colors.cardBorder;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(99,102,241,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={18} style={{ color: colors.textSecondary }} />
                </div>
                <h3
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: 10,
                  }}
                >
                  {headline}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: colors.bgSecondary,
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!isLight && <NeuronCanvas mode="dark" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.accent }}
            >
              Process
            </span>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: colors.textPrimary,
                marginTop: 12,
              }}
            >
              How We Get You Approved
            </h2>
          </div>
          {/* Smooth Process Animation */}
          <div className="max-w-4xl mx-auto">
            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() => {
                    setActiveStep(step);
                    setIsAutoPlaying(false);
                  }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: activeStep === step 
                      ? colors.accent 
                      : colors.cardBorder,
                    width: activeStep === step ? "24px" : "8px",
                  }}
                />
              ))}
            </div>

            {/* Steps */}
            <div className="relative">
              {steps.map(({ n, headline, copy }, i) => (
                <div
                  key={`step-${i}`}
                  className={`transition-all duration-500 ${
                    activeStep === i + 1 ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Step Number with pulse animation */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500"
                      style={{
                        background: isLight
                          ? "linear-gradient(135deg, #00d4b8 0%, #0891b2 100%)"
                          : "linear-gradient(135deg, #00ffd1 0%, #7c3aed 100%)",
                        boxShadow: isLight
                          ? "0 4px 15px rgba(0, 212, 184, 0.3)"
                          : "0 4px 15px rgba(0, 255, 209, 0.25)",
                        border: `3px solid ${isLight ? "#ffffff" : "#0a0f1e"}`,
                        transform: activeStep === i + 1 ? "scale(1)" : "scale(0.8)",
                      }}
                    >
                      <span className="text-white font-bold text-2xl">{n}</span>
                    </div>

                    <h3
                      className="font-bold mb-3 text-lg transition-all duration-500"
                      style={{ 
                        color: colors.textPrimary,
                        transform: activeStep === i + 1 ? "translateY(0)" : "translateY(20px)",
                        opacity: activeStep === i + 1 ? 1 : 0
                      }}
                    >
                      {headline}
                    </h3>
                    <p
                      className="text-base leading-relaxed max-w-md transition-all duration-500"
                      style={{ 
                        color: colors.textSecondary,
                        transform: activeStep === i + 1 ? "translateY(0)" : "translateY(20px)",
                        opacity: activeStep === i + 1 ? 1 : 0
                      }}
                    >
                      {copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Auto-play Controls */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: isLight 
                    ? "rgba(0, 212, 184, 0.1)" 
                    : "rgba(0, 255, 209, 0.1)",
                  border: `1px solid ${isLight ? "rgba(0, 212, 184, 0.3)" : "rgba(0, 255, 209, 0.3)"}`,
                  color: colors.accent,
                }}
              >
                {isAutoPlaying ? <Clock size={16} /> : <ChevronRight size={16} />}
                {isAutoPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              to="/how-it-works"
              data-ocid="howitworks.link.button"
              style={{
                color: colors.accent,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Learn more about our process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Industry Grid ──────────────────────────────────── */}
      <section style={{ backgroundColor: colors.bgPrimary, padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.accent }}
            >
              Common Industries
            </span>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: colors.textPrimary,
                marginTop: 12,
              }}
            >
              Industries We Serve
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {industryTiles.map(({ label, href, icon }, i) => (
              <Link
                key={`industry-tile-${i}`}
                to={href}
                data-ocid={`industries.item.${label === "View All" ? "link" : "1"}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "20px 12px",
                  borderRadius: 12,
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  textDecoration: "none",
                  transition:
                    "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "scale(1.03)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(99,102,241,0.4)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 20px rgba(99,102,241,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "scale(1)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    colors.cardBorder;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "none";
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: colors.textPrimary,
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <p className="text-center mt-6">
            <Link
              to="/industries"
              data-ocid="industries.all.link"
              style={{ color: colors.accent, fontWeight: 600 }}
            >
              View All Industries →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Enterprise Callout ───────────────────────────────── */}
      <section
        style={{
          background: isLight ? "var(--lm-bg-elevated)" : "var(--dm-bg-deep)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <NeuronCanvas mode={isLight ? "light" : "dark"} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLight
              ? `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(8, 145, 178, 0.15) 0%, transparent 50%),
                 radial-gradient(ellipse 50% 40% at 30% 70%, rgba(79, 70, 229, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse 40% 30% at 70% 30%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)`
              : `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 255, 209, 0.08) 0%, transparent 70%),
                 radial-gradient(ellipse 50% 40% at 30% 70%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: colors.textPrimary,
              marginBottom: 20,
            }}
          >
            Processing millions per month?{" "}
            <span style={{ color: colors.accent }}>
              We build accounts that scale.
            </span>
          </h2>
          <p
            style={{
              color: colors.textSecondary,
              lineHeight: 1.75,
              marginBottom: 32,
              fontSize: "1rem",
            }}
          >
            From multi-MID structuring to international acquiring and backup
            processor redundancy, Cybin Enterprises supports high-volume
            merchants who need stability and reliability — not surprises. Our
            enterprise team reviews large-volume accounts personally.
          </p>
          <Link
            to="/apply/enterprise"
            data-ocid="enterprise.callout.button"
            className="cybin-btn-blue"
          >
            Request a Volume Review <ChevronRight size={15} />
          </Link>
          <p
            style={{
              marginTop: 12,
              fontSize: "0.8rem",
              color: colors.textMuted,
            }}
          >
            High-volume accounts receive dedicated review and a direct point of
            contact.
          </p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section style={{ backgroundColor: colors.bgPrimary, padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.accent }}
            >
              Results
            </span>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: colors.textPrimary,
                marginTop: 12,
              }}
            >
              Merchants We’ve Helped
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric block 1 */}
            <div
              style={{
                padding: 28,
                borderRadius: 16,
                background: isLight ? "var(--lm-bg-card)" : "var(--dm-bg-card)",
                border: `2px solid ${isLight ? "var(--lm-border-medium)" : "var(--dm-border-medium)"}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: colors.accent,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  marginBottom: 8,
                }}
              >
                $240M+
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                processed across our merchant network
              </p>
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: "0.75rem",
                  marginTop: 8,
                  fontStyle: "italic",
                }}
              >
                [PLACEHOLDER — replace with real figure]
              </p>
            </div>

            {testimonials.map(({ tag, problem, outcome, attribution }, i) => (
              <div
                key={`testimonial-${i}`}
                style={{
                  padding: 28,
                  borderRadius: 16,
                  background: isLight ? "var(--lm-bg-card)" : "var(--dm-bg-card)",
                  border: `2px solid ${isLight ? "var(--lm-border-medium)" : "var(--dm-border-medium)"}`,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: colors.accentSecondary,
                    textTransform: "uppercase",
                    marginBottom: 12,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: isLight 
                      ? "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(8, 145, 178, 0.1) 100%)" 
                      : "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(0, 255, 209, 0.1) 100%)",
                    border: `1px solid ${isLight ? "rgba(79, 70, 229, 0.3)" : "rgba(124, 58, 237, 0.3)"}`,
                  }}
                >
                  {tag}
                </span>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    marginBottom: 12,
                    fontStyle: "italic",
                  }}
                >
                  “{problem}”
                </p>
                <p
                  style={{
                    color: colors.textPrimary,
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  “{outcome}”
                </p>
                <p
                  style={{
                    color: colors.accent,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  — {attribution}
                </p>
              </div>
            ))}

            {/* Metric block 2 */}
            <div
              style={{
                padding: 28,
                borderRadius: 16,
                backgroundColor: colors.cardBg,
                border: `1px solid ${isLight ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.2)"}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: isLight ? "#b5943d" : "#C9A84C",
                  fontFamily: '"Playfair Display", Georgia, serif',
                  marginBottom: 8,
                }}
              >
                7 Days
              </p>
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                average approval timeline
              </p>
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: "0.75rem",
                  marginTop: 8,
                  fontStyle: "italic",
                }}
              >
                [PLACEHOLDER — replace with real figure]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section
        style={{
          background: isLight ? "var(--lm-bg-elevated)" : "var(--dm-bg-deep)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <NeuronCanvas mode={isLight ? "light" : "dark"} />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: colors.textPrimary,
              marginBottom: 16,
            }}
          >
            Ready to Get <span style={{ color: colors.accent }}>Approved?</span>
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: 32 }}>
            Free review, no commitment. A real person reviews your situation
            within 24 hours.
          </p>
          <Link
            to="/apply"
            data-ocid="final.apply.button"
            className="cybin-btn-blue"
          >
            Get a Free Account Review <ChevronRight size={15} />
          </Link>
        </div>
      </section>

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
