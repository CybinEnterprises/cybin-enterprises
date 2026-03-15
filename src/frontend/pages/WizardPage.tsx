import NeuronCanvas from "@/src/components/NeuronCanvas";
import TickerBar from "@/src/components/TickerBar";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Link, useSearchParams } from "@/src/lib/router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Lock,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "../../hooks/useActor";

// ─── Types ─────────────────────────────────────────────────────────────────────

type NewStep = 1 | 2 | 3 | 4 | "reviewing" | "success";

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
  "Crystals & New Age Products",
  "Psychic & Spiritual Services",
  "Coaching & Life Consulting",
  "Business Opportunity & MLM",
  "Work From Home Programs",
  "Lead Generation",
  "Affiliate Marketing",
  "Credit Repair & Counseling",
  "Debt Settlement",
  "Loan Brokerage",
  "Financial Education",
  "Cryptocurrency & NFTs",
  "Forex & Trading Education",
  "Investment Newsletters",
  "Insurance Lead Generation",
  "Telemarketing",
  "Continuity Programs",
  "Free Trial Marketing",
  "Infomercial & DRTV",
  "Online Pharmacy (non-controlled)",
  "Pet Medications",
  "Compounding Pharmacy",
  "Medical Devices",
  "Laboratory Equipment",
  "Research Chemicals (compliant)",
  "Mushrooms & Spores",
  "Seeds & Clones",
  "Legal Cannabis Accessories",
  "Hemp Products",
  "Firearms Training & Safety",
  "Security Services",
  "Private Investigation",
  "Bail Recovery",
  "Process Serving",
  "Background Checks",
  "Alcohol & Spirits (online)",
  "Cigar Clubs",
  "Wine Subscription",
  "Hunting & Outdoor Sports",
  "Archery & Shooting Sports",
  "Martial Arts Supplies",
  "Tattoo & Body Modification",
  "Body Jewelry",
  "Vehicle Accessories",
  "Auto Warranties (aftermarket)",
  "Extended Service Contracts",
  "Rental Car & Peer-to-Peer Car",
  "Luxury Goods Resale",
  "Electronics Resale",
  "Software Licensing",
  "Digital Downloads",
  "Online Courses & Coaching",
  "Webinars & Masterclasses",
  "High-Value Jewelry",
  "Rare Coins & Precious Metals",
  "Legal Services",
  "Charitable Organizations",
  "Nonprofit Fundraising",
  "Political Campaigns",
  "Religious Organizations",
  "Weight Loss Programs",
  "Cosmetic Procedures",
  "Stem Cell Therapy",
  "Hormone Replacement",
  "Anti-Aging Clinics",
  "Skin Care & Aesthetics",
  "Hair Restoration",
  "Tattoo Removal",
  "Compounded Medications",
  "Specialty Pharmaceuticals",
  "Animal Health Products",
  "Veterinary Compounding",
  "Exotic Pet Sales",
  "Hunting Outfitters",
  "Fishing Charters",
  "Adventure Tourism",
  "High-Risk Sports",
  "Extreme Sports Equipment",
  "Firearms Instruction",
  "Concealed Carry Training",
  "Other",
];

// ─── Field styles ───────────────────────────────────────────────────────────────

const fieldBase: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  backgroundColor: "rgba(255,255,255,0.05)",
  color: "#e8edf8",
  fontSize: "0.95rem",
  fontFamily: '"DM Sans", "Cabinet Grotesk", sans-serif',
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box" as const,
};

function applyFocusStyle(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  el.style.borderColor = "rgba(0,212,184,0.6)";
  el.style.backgroundColor = "rgba(0,212,184,0.08)";
  el.style.boxShadow = "0 0 0 3px rgba(0,212,184,0.15)";
}
function removeFocusStyle(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  el.style.borderColor = "rgba(255,255,255,0.1)";
  el.style.backgroundColor = "rgba(255,255,255,0.05)";
  el.style.boxShadow = "none";
}

function FieldLabel({ label, required, completed }: { label: string; required?: boolean; completed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(232,240,255,0.8)", letterSpacing: "0.02em" }}>
        {label} {required && <span style={{ color: "#00d4b8" }}>•</span>}
      </span>
      {completed && <CheckCircle size={16} style={{ color: "#00d4b8" }} />}
    </div>
  );
}

// ─── Progress Bar ───────────────────────────────────────────────────────────────

function ProgressBar({ pct, step, total }: { pct: number; step: number; total: number }) {
  return (
    <div data-ocid="apply.progress.panel" style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(232,240,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Step {step} of {total}
        </span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00d4b8" }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #00d4b8, #00b89e)", width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ─── Step Completion Tag ────────────────────────────────────────────────────────

function StepCompletedTag({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, backgroundColor: "rgba(0,212,184,0.1)", border: "1px solid rgba(0,212,184,0.2)", marginBottom: 12 }}>
      <CheckCircle size={14} style={{ color: "#00d4b8" }} />
      <span style={{ fontSize: "0.8rem", color: "#00d4b8", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ─── Enterprise Banner ──────────────────────────────────────────────────────────

function EnterpriseBanner() {
  return (
    <div data-ocid="apply.enterprise.banner" style={{ padding: "16px 18px", borderRadius: 10, backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", gap: 12, alignItems: "flex-start", marginTop: 16, animation: "fadeRise 0.3s ease" }}>
      <Zap size={18} style={{ color: "#C9A84C", flexShrink: 0, marginTop: 2 }} />
      <div>
        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#C9A84C", marginBottom: 2 }}>Enterprise Account Eligible</p>
        <p style={{ fontSize: "0.8rem", color: "rgba(201,168,76,0.8)" }}>Our executive team will personally review your account.</p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function WizardPage() {
  const [searchParams] = useSearchParams();
  const { resolved } = useTheme();
  const isLight = resolved === "light";
  const logoImg = isLight ? "/assets/cybin-logo-light.png" : "/assets/cybin-logo-dark.png";
  const logoBg = isLight ? "#ffffff" : "#000000";
  const { actor } = useActor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tierParam = searchParams.get("tier");
  const [isEnterprise, setIsEnterprise] = useState(tierParam === "enterprise");

  // Steps
  const [step, setStep] = useState<NewStep>(1);
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [step3Complete, setStep3Complete] = useState(false);

  // Step 1: Situation
  const [industry, setIndustry] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");

  // Step 2: Business
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [businessAge, setBusinessAge] = useState("");

  // Step 3: Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 4: Full Application (only if they choose this)
  const [ein, setEin] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessZip, setBusinessZip] = useState("");
  const [bankName, setBankName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Completion states
  const [industryDone, setIndustryDone] = useState(false);
  const [volumeDone, setVolumeDone] = useState(false);
  const [issueDone, setIssueDone] = useState(false);
  const [bnameDone, setBnameDone] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [nameDone, setNameDone] = useState(false);
  const [phoneDone, setPhoneDone] = useState(false);

  // Enterprise detection
  useEffect(() => {
    if (volume === "1M–5M" || volume === "5M+") setIsEnterprise(true);
    else if (volume) setIsEnterprise(false);
  }, [volume]);

  // Validation
  const step1Valid = industry !== "" && volume !== "" && issue !== "";
  const step2Valid = businessName.trim() !== "";
  const step3Valid = name.trim() !== "" && email.trim() !== "" && phone.trim() !== "";
  const step4Valid = businessType !== "" && businessAddress !== "" && businessCity !== "" && 
                     businessState !== "" && businessZip !== "" && bankName !== "" && 
                     routingNumber !== "" && accountNumber !== "";

  // Progress
  const totalSteps = 4;
  const progress = step === 1 ? 12 : step === 2 ? 30 : step === 3 ? 55 : step === 4 ? 88 : step === "reviewing" ? 96 : 100;

  const handleSubmit = useCallback(async () => {
    if (!actor) {
      setSubmitError("Service unavailable. Please try again.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    setStep("reviewing");
    await new Promise((r) => setTimeout(r, 2000));
    try {
      await actor.submitWizardApplication(industry, issue, name, email, phone, businessName, ein, false);
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  }, [actor, industry, issue, name, email, phone, businessName, ein]);

  const advanceStep1 = () => { setStep1Complete(true); setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const advanceStep2 = () => { setStep2Complete(true); setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const advanceToFull = () => { setStep3Complete(true); setStep(4); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBackToSimple = () => { setStep(3); };

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#0a0f1e" }}>
      {/* Ticker */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 60 }}>
        <TickerBar />
      </div>

      {/* Header */}
      <header style={{ position: "fixed", top: 38, left: 0, right: 0, zIndex: 50, backgroundColor: "rgba(10,22,40,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", height: 64, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={logoImg} alt="Cybin Enterprises" style={{ height: 36, width: "auto", maxWidth: 140, objectFit: "contain" }} />
          <span style={{ fontWeight: 700, color: "rgba(232,237,248,0.9)", fontSize: "0.9rem" }}>Cybin Enterprises</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {[["/#solutions", "Solutions"], ["/industries", "Industries"], ["/about", "About"], ["/contact", "Contact"]].map(([href, label], linkIdx) => (
            <Link key={`link-${linkIdx}`} to={href} style={{ fontSize: "0.8rem", color: "rgba(232,237,248,0.6)", textDecoration: "none", transition: "color 0.2s" }}>{label}</Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={13} style={{ color: "#00d4b8" }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(0,212,184,0.8)" }}>Secure</span>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ paddingTop: 102, minHeight: "100vh", display: "flex" }}>
        {/* Left Panel - Trust */}
        <div data-ocid="apply.trust.panel" className="hidden lg:flex" style={{ width: "46%", flexShrink: 0, position: "sticky", top: 102, alignSelf: "flex-start", height: "calc(100vh - 102px)", backgroundColor: "#0a0f1e", borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", padding: "48px 40px" }}>
          <NeuronCanvas mode={isLight ? "light" : "dark"} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 100, backgroundColor: "rgba(0,212,184,0.1)", border: "1px solid rgba(0,212,184,0.2)", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00d4b8" }} />
              <span style={{ fontSize: "0.75rem", color: "#00d4b8", fontWeight: 600 }}>Free Assessment</span>
            </div>
            <h1 style={{ fontFamily: '"Sora", system-ui, sans-serif', fontSize: "2rem", fontWeight: 700, color: "#e8edf8", lineHeight: 1.2, marginBottom: 16 }}>
              Your processor shut you down. <span style={{ color: "#00d4b8" }}>We get you approved.</span>
            </h1>
            <p style={{ color: "rgba(232,245,242,0.7)", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: 32 }}>
              Tell us your situation. We'll structure the right account across our processor network — and you'll see your options before anything gets submitted.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
              {[{ icon: Shield, title: "Your data is protected", sub: "256-bit encryption. Never shared without consent." }, { icon: Clock, title: "Reviewed within 24 hours", sub: "By a real person. Not an automated system." }, { icon: Zap, title: "All businesses approved", sub: "From CBD and firearms to peptides and crypto." }, { icon: Globe, title: "Domestic & international", sub: "Multi-processor access gives you more options." }].map(({ icon: Icon, title, sub }, i) => (
                <div key={`wizard-benefit-${i}`} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, rgba(0,212,184,0.15) 0%, rgba(124,92,191,0.15) 100%)", border: "1px solid rgba(0,212,184,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} style={{ color: "#00d4b8" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.875rem", marginBottom: 2 }}>{title}</p>
                    <p style={{ color: "rgba(226, 232, 240, 0.6)", fontSize: "0.8rem" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />
            <p style={{ color: "rgba(232,245,242,0.4)", fontSize: "0.75rem", lineHeight: 1.6 }}>
              Cybin Enterprises represents multiple acquiring processors. Your submission is reviewed across our full network to find the best-fit solution.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{ flex: 1, padding: "48px 40px 80px", minWidth: 0 }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <ProgressBar pct={progress} step={typeof step === 'number' ? step : 5} total={totalSteps} />
            {step1Complete && <StepCompletedTag label="Situation" />}
            {step2Complete && <StepCompletedTag label="Business" />}
            {step3Complete && <StepCompletedTag label="Contact" />}

            {/* STEP 1: Situation */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: '"Sora", system-ui, sans-serif', fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>Tell us your situation</h2>
                <p style={{ color: "rgba(226, 232, 240, 0.7)", fontSize: "0.9rem", marginBottom: 28 }}>This takes less than 2 minutes. No commitment.</p>
                
                <div style={{ marginBottom: 22 }}>
                  <FieldLabel label="What industry are you in?" completed={industryDone} />
                  <select value={industry} onChange={(e) => { setIndustry(e.target.value); setIndustryDone(e.target.value !== ""); }} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} style={{ ...fieldBase, appearance: "none" as const }}>
                    <option value="">Select your industry</option>
                    {ALL_INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <FieldLabel label="Monthly processing volume" completed={volumeDone} />
                  <select value={volume} onChange={(e) => { setVolume(e.target.value); setVolumeDone(e.target.value !== ""); }} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} style={{ ...fieldBase, appearance: "none" as const }}>
                    <option value="">Select volume</option>
                    <option value="Under $10K">Under $10K/mo</option>
                    <option value="$10K–$50K">$10K – $50K/mo</option>
                    <option value="$50K–$250K">$50K – $250K/mo</option>
                    <option value="$250K–$1M">$250K – $1M/mo</option>
                    <option value="1M–5M">$1M – $5M/mo</option>
                    <option value="5M+">$5M+/mo</option>
                  </select>
                  {isEnterprise && <EnterpriseBanner />}
                </div>

                <div style={{ marginBottom: 28 }}>
                  <FieldLabel label="What's the primary issue?" completed={issueDone} />
                  <select value={issue} onChange={(e) => { setIssue(e.target.value); setIssueDone(e.target.value !== ""); }} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} style={{ ...fieldBase, appearance: "none" as const }}>
                    <option value="">Select your situation</option>
                    <option>Account was terminated or suspended</option>
                    <option>Rejected by Stripe, PayPal, or Square</option>
                    <option>Reserves too high</option>
                    <option>Chargebacks threatening account</option>
                    <option>Need international processing</option>
                    <option>Launching new high-risk business</option>
                    <option>Need higher volume capacity</option>
                    <option>Other</option>
                  </select>
                </div>

                <button disabled={!step1Valid} onClick={advanceStep1} className="cybin-btn-blue" style={{ width: "100%", justifyContent: "center", opacity: step1Valid ? 1 : 0.4, cursor: step1Valid ? "pointer" : "not-allowed" }}>
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: Business */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: '"Sora", system-ui, sans-serif', fontSize: "1.75rem", fontWeight: 700, color: "#e8edf8", marginBottom: 8 }}>About your business</h2>
                <p style={{ color: "rgba(232,245,242,0.7)", fontSize: "0.9rem", marginBottom: 28 }}>Help us match you to the right processors.</p>

                <div style={{ marginBottom: 22 }}>
                  <FieldLabel label="Business name" completed={bnameDone} />
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} onBlur={(e) => { setBnameDone(e.target.value.trim() !== ""); removeFocusStyle(e.target); }} onFocus={(e) => applyFocusStyle(e.target)} placeholder="Legal name or DBA" style={fieldBase} />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <FieldLabel label="Website URL" />
                  <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="https:// (if you have one)" style={fieldBase} />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <FieldLabel label="Time in business" />
                  <select value={businessAge} onChange={(e) => setBusinessAge(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} style={{ ...fieldBase, appearance: "none" as const }}>
                    <option value="">Select</option>
                    <option>Not yet launched</option>
                    <option>Less than 6 months</option>
                    <option>6–12 months</option>
                    <option>1–3 years</option>
                    <option>3–5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(1)} className="cybin-btn-ghost-white" style={{ flex: 1, justifyContent: "center" }}>Back</button>
                  <button disabled={!step2Valid} onClick={advanceStep2} className="cybin-btn-blue" style={{ flex: 2, justifyContent: "center", opacity: step2Valid ? 1 : 0.4, cursor: step2Valid ? "pointer" : "not-allowed" }}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 3: Contact */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: '"Sora", system-ui, sans-serif', fontSize: "1.75rem", fontWeight: 700, color: "#e8edf8", marginBottom: 8 }}>How should we reach you?</h2>
                <p style={{ color: "rgba(232,245,242,0.7)", fontSize: "0.9rem", marginBottom: 28 }}>A real person will review your situation.</p>

                <div style={{ marginBottom: 22 }}>
                  <FieldLabel label="Your name" completed={nameDone} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={(e) => { setNameDone(e.target.value.trim() !== ""); removeFocusStyle(e.target); }} onFocus={(e) => applyFocusStyle(e.target)} placeholder="Full name" style={fieldBase} />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <FieldLabel label="Email address" completed={emailDone} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => { setEmailDone(e.target.value.includes("@")); removeFocusStyle(e.target); }} onFocus={(e) => applyFocusStyle(e.target)} placeholder="you@company.com" style={fieldBase} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <FieldLabel label="Phone number" completed={phoneDone} />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={(e) => { setPhoneDone(e.target.value.trim().length > 6); removeFocusStyle(e.target); }} onFocus={(e) => applyFocusStyle(e.target)} placeholder="(555) 000-0000" style={fieldBase} />
                </div>

                {/* Privacy */}
                <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(0,212,184,0.05)", border: "1px solid rgba(0,212,184,0.1)", display: "flex", gap: 10, marginBottom: 24 }}>
                  <Lock size={14} style={{ color: "#00d4b8", flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: "0.78rem", color: "rgba(232,245,242,0.6)", lineHeight: 1.5 }}>Your information is secure and reviewed only by our team. We never share or sell your details.</p>
                </div>

                {submitError && (
                  <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", marginBottom: 16 }}>
                    <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{submitError}</p>
                  </div>
                )}

                {/* OPTION: Full Application */}
                <div style={{ marginBottom: 20, padding: 24, borderRadius: 14, background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.04) 100%)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Sparkles size={18} style={{ color: "#fbbf24" }} />
                    <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: "0.95rem" }}>Need faster approval?</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "rgba(232,245,242,0.7)", lineHeight: 1.6, marginBottom: 16 }}>
                    Complete the full underwriting application now and our team can approve you faster with everything needed upfront.
                  </p>
                  <button type="button" onClick={advanceToFull} className="cybin-btn-blue" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                    <FileText size={16} /> Complete Full Application <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(2)} className="cybin-btn-ghost-white" style={{ flex: 1, justifyContent: "center" }}>Back</button>
                  <button disabled={!step3Valid || isSubmitting} onClick={handleSubmit} className="cybin-btn-blue" style={{ flex: 2, justifyContent: "center", opacity: step3Valid && !isSubmitting ? 1 : 0.5, cursor: step3Valid && !isSubmitting ? "pointer" : "not-allowed" }}>
                    {isEnterprise ? "Request Review" : "Submit Application"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Full Application */}
            {step === 4 && (
              <div>
                <div style={{ marginBottom: 24, padding: 18, borderRadius: 12, backgroundColor: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <FileText size={22} style={{ color: "#fbbf24", flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontWeight: 700, color: "#fbbf24", fontSize: "1.05rem", marginBottom: 4 }}>Full Underwriting Application</h3>
                    <p style={{ fontSize: "0.82rem", color: "rgba(232,245,242,0.7)", lineHeight: 1.5 }}>Complete for faster approval. Required fields marked with •</p>
                  </div>
                </div>

                {/* Business Details */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(232,240,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Business Details</h4>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <FieldLabel label="Legal Business Name" required />
                      <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="As registered" style={fieldBase} />
                    </div>
                    <div>
                      <FieldLabel label="Business Type" required />
                      <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} style={{ ...fieldBase, appearance: "none" as const }}>
                        <option value="">Select</option>
                        <option>LLC</option>
                        <option>Corporation</option>
                        <option>Sole Proprietorship</option>
                        <option>Partnership</option>
                        <option>S-Corporation</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <FieldLabel label="EIN (Employer ID)" />
                    <input type="text" value={ein} onChange={(e) => setEin(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="XX-XXXXXXX" style={fieldBase} />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <FieldLabel label="Business Address" required />
                    <input type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="Street address" style={fieldBase} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <FieldLabel label="City" required />
                      <input type="text" value={businessCity} onChange={(e) => setBusinessCity(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="City" style={fieldBase} />
                    </div>
                    <div>
                      <FieldLabel label="State" required />
                      <input type="text" value={businessState} onChange={(e) => setBusinessState(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="ST" style={fieldBase} />
                    </div>
                    <div>
                      <FieldLabel label="ZIP" required />
                      <input type="text" value={businessZip} onChange={(e) => setBusinessZip(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="12345" style={fieldBase} />
                    </div>
                  </div>
                </div>

                {/* Banking */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(232,240,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Banking Information</h4>
                  
                  <div style={{ marginBottom: 16 }}>
                    <FieldLabel label="Bank Name" required />
                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="Bank name" style={fieldBase} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <FieldLabel label="Routing Number" required />
                      <input type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="9 digits" style={fieldBase} />
                    </div>
                    <div>
                      <FieldLabel label="Account Number" required />
                      <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="Account number" style={fieldBase} />
                    </div>
                  </div>
                </div>

                {/* Additional */}
                <div style={{ marginBottom: 24 }}>
                  <FieldLabel label="Additional Notes" />
                  <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} onFocus={(e) => applyFocusStyle(e.target)} onBlur={(e) => removeFocusStyle(e.target)} placeholder="Anything else we should know?" rows={3} style={{ ...fieldBase, resize: "vertical" as const }} />
                </div>

                {/* Docs notice */}
                <div style={{ padding: 14, borderRadius: 10, backgroundColor: "rgba(0,212,184,0.05)", border: "1px solid rgba(0,212,184,0.1)", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Upload size={14} style={{ color: "rgba(0,212,184,0.6)", flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: "0.75rem", color: "rgba(232,245,242,0.5)", lineHeight: 1.5 }}>After submission, you may be asked for: Driver's license, business license, bank statements (3 months). We'll guide you through this.</p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(3)} className="cybin-btn-ghost-white" style={{ flex: 1, justifyContent: "center" }}>Back</button>
                  <button disabled={!step4Valid || isSubmitting} onClick={handleSubmit} className="cybin-btn-blue" style={{ flex: 2, justifyContent: "center", opacity: step4Valid && !isSubmitting ? 1 : 0.5, cursor: step4Valid && !isSubmitting ? "pointer" : "not-allowed", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                    {isSubmitting ? "Submitting..." : "Submit Full Application"} <ArrowRight size={16} />
                  </button>
                </div>
                <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(232,245,242,0.4)", marginTop: 12 }}>Or <button onClick={goBackToSimple} style={{ background: "none", border: "none", color: "#00d4b8", cursor: "pointer", textDecoration: "underline", fontSize: "0.72rem" }}>submit simplified version</button></p>
              </div>
            )}

            {/* REVIEWING */}
            {step === "reviewing" && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(0,212,184,0.2)", borderTopColor: "#00d4b8", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
                <p style={{ color: "rgba(232,245,242,0.8)", fontSize: "1rem" }}>Reviewing your application...</p>
              </div>
            )}

            {/* SUCCESS */}
            {step === "success" && (
              <div style={{ animation: "fadeRise 0.5s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,212,184,0.2), rgba(124,92,191,0.2))", border: "2px solid #00d4b8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <CheckCircle size={36} style={{ color: "#00d4b8" }} />
                  </div>
                  <h2 style={{ fontFamily: '"Sora", system-ui, sans-serif', fontSize: "1.75rem", fontWeight: 700, color: "#e8edf8", marginBottom: 12 }}>
                    {isEnterprise ? "Enterprise Review Requested" : "Application Received"}
                  </h2>
                  <p style={{ color: "rgba(232,245,242,0.7)", lineHeight: 1.6, maxWidth: 380, margin: "0 auto" }}>
                    {isEnterprise ? "Our executive team will contact you within 1 business day." : "You'll hear from us within 24 hours. A real person — not automation."}
                  </p>
                </div>

                <div style={{ padding: 24, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(232,245,242,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>What Happens Next</h3>
                  {[{ time: "24 hours", desc: "Personal review by our team" }, { time: "1-2 days", desc: "Processor options identified" }, { time: "2-3 days", desc: "We walk you through options" }, { time: "3-10 days", desc: "We manage approval process" }].map(({ time, desc }) => (
                    <div key={time} style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, color: "#C9A84C", fontSize: "0.8rem", minWidth: 70 }}>{time}</span>
                      <p style={{ color: "rgba(232,245,242,0.7)", fontSize: "0.85rem" }}>{desc}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28, textAlign: "center" }}>
                  <Link to="/" style={{ color: "rgba(232,245,242,0.6)", fontSize: "0.9rem" }}>← Return to Homepage</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        select option { background: #0a0f1e; color: #e8edf8; }
      `}</style>
    </div>
  );
}
