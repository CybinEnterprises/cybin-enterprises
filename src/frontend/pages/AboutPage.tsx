import { JsonLd } from "@/src/components/JsonLd";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useLiveImageSettings } from "@/src/hooks/useLiveImageSettings";
import { useLiveSiteSettings } from "@/src/hooks/useLiveSiteSettings";
import { useSeo } from "@/src/hooks/useSeo";
import { Link } from "@/src/lib/router";
import { Award, ChevronRight, Star } from "lucide-react";
import { useEffect } from "react";
const melPhoto = "/assets/mel-headshot.jpeg";
const shanePhoto = "/assets/uploads/IMG_2988-1.jpeg";

const melAchievements = [
  "Most Influential Businesswomen recognition",
  "Top 30 CEOs of the Year",
  "Commercial Cannabis Awards honoree",
  "Exeleon Magazine recognition",
  "Best Place to Work Award (2021)",
  "Featured on the cover of Dope Magazine",
];

const shaneExpertise = [
  "Logistics & Operations Management",
  "Cybersecurity & Data Protection",
  "Health-Technology Systems",
  "Consumer Services & Growth",
  "Payment Infrastructure Simplification",
  "Cross-Industry Business Development",
];

export default function AboutPage() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";
  const { style: melStyle, config: melCfg } = useLiveImageSettings("mel");
  const { style: shaneStyle, config: shaneCfg } = useLiveImageSettings("shane");
  const site = useLiveSiteSettings();

  useSeo({
    title:
      "About Cybin Enterprises | Mel Kotchey & Shane Suehr | High-Risk Payments",
    description:
      "Cybin Enterprises was founded by Mel Kotchey and Shane Suehr to bring clarity and stability to businesses navigating complex payment environments.",
    canonical: "/about",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    for (const el of document.querySelectorAll(
      ".animate-fade-up, .animate-fade-in",
    )) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Light mode colors
  const lightBg = "#f8fafc";
  const lightBgAlt = "#f1f5f9";
  const lightCardBg = "#ffffff";
  const lightTextPrimary = "#0f172a";
  const lightTextSecondary = "#475569";
  const lightTextMuted = "#64748b";
  const lightBorder = "#e2e8f0";
  const lightAccent = "#00a88e";
  const lightAccentGlow = "rgba(0, 168, 142, 0.1)";

  // Dark mode colors
  const darkBg = "#0a0f1e";
  const darkBgAlt = "#080d1a";
  const darkTextPrimary = "#e8edf8";
  const darkTextSecondary = "rgba(232,237,248,0.65)";
  const darkBorder = "rgba(110,247,212,0.12)";
  const darkAccent = "#00d4b8";
  const darkAccentGlow = "rgba(110,247,212,0.08)";

  const bg = isLight ? lightBg : darkBg;
  const bgAlt = isLight ? lightBgAlt : darkBgAlt;
  const textPrimary = isLight ? lightTextPrimary : darkTextPrimary;
  const textSecondary = isLight ? lightTextSecondary : darkTextSecondary;
  const accent = isLight ? lightAccent : darkAccent;
  const cardBg = isLight ? lightCardBg : "linear-gradient(160deg, rgba(8,13,26,0.99) 0%, rgba(4,6,18,0.97) 100%)";
  const border = isLight ? lightBorder : darkBorder;
  const accentGlow = isLight ? lightAccentGlow : darkAccentGlow;

  return (
    <div style={{ backgroundColor: bg }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://cybinenterprises.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "About",
              item: "https://cybinenterprises.com/about",
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Cybin Enterprises Founders",
          itemListElement: [
            {
              "@type": "Person",
              position: 1,
              name: "Mel Kotchey",
              jobTitle: "Co-Founder & CEO",
              description:
                "Award-winning entrepreneur with 28 years in medical and regulated sectors. Five degrees including a master's in healthcare administration.",
              worksFor: {
                "@type": "Organization",
                name: "Cybin Enterprises",
              },
              award: [
                "Most Influential Businesswomen",
                "Top 30 CEOs of the Year",
                "Commercial Cannabis Awards honoree",
                "Best Place to Work Award (2021)",
                "Featured on the cover of Dope Magazine",
              ],
            },
            {
              "@type": "Person",
              position: 2,
              name: "Shane Suehr",
              jobTitle: "Co-Founder & COO",
              description:
                "Experienced leader across logistics, cybersecurity, health-technology, and consumer services.",
              worksFor: {
                "@type": "Organization",
                name: "Cybin Enterprises",
              },
            },
          ],
        }}
      />

      {/* Hero */}
      <section
        className="page-hero-bg"
        style={{
          padding: "80px 0 60px",
          background: isLight 
            ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
            : "linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)",
          borderBottom: `1px solid ${isLight ? "#e2e8f0" : "rgba(110,247,212,0.08)"}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <Link
                to="/"
                className="text-sm"
                style={{ color: isLight ? "rgba(15,23,42,0.5)" : "rgba(232,237,248,0.45)" }}
              >
                Home
              </Link>
              <ChevronRight
                size={14}
                style={{ color: isLight ? "rgba(15,23,42,0.25)" : "rgba(232,237,248,0.3)" }}
              />
              <span className="text-sm" style={{ color: accent }}>
                About
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5"
              style={{
                fontFamily: "Sora, system-ui, sans-serif",
                color: textPrimary,
                lineHeight: 1.15,
              }}
            >
              About <span style={{ color: accent }}>Cybin Enterprises</span>
            </h1>
            <p
              className="text-lg"
              style={{ color: textSecondary, lineHeight: 1.7 }}
            >
              Cybin Enterprises helps businesses navigate complex payment
              environments with clarity, structure, and long-term reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Mission - Beautiful in both modes */}
      <section
        style={{
          backgroundColor: bg,
          padding: "80px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="animate-fade-up p-12 rounded-3xl text-center max-w-3xl mx-auto"
            style={{
              background: isLight
                ? "linear-gradient(135deg, #ffffff 0%, #f0fdfa 50%, #f8fafc 100%)"
                : "linear-gradient(135deg, rgba(0,212,184,0.08) 0%, rgba(26,10,46,0.5) 100%)",
              border: `1px solid ${isLight ? "rgba(0,168,142,0.2)" : "rgba(110,247,212,0.12)"}`,
              boxShadow: isLight
                ? "0 4px 24px rgba(0,168,142,0.08), 0 12px 48px rgba(0,0,0,0.04)"
                : "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: isLight
                  ? "linear-gradient(135deg, #00d4b8 0%, #00a88e 100%)"
                  : "rgba(0,212,184,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: isLight
                  ? "0 4px 20px rgba(0,212,184,0.3)"
                  : "none",
              }}
            >
              <Star
                size={28}
                style={{ color: isLight ? "#ffffff" : "#00d4b8" }}
              />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-5"
              style={{
                fontFamily: "Sora, system-ui, sans-serif",
                color: textPrimary,
              }}
            >
              {site.about.missionTitle}
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{
                color: textSecondary,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {site.about.missionBody}
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section
        data-ocid="about.founders.section"
        style={{
          backgroundColor: bgAlt,
          padding: "100px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: isLight
              ? "none"
              : "linear-gradient(rgba(110,247,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(110,247,212,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Ambient gradients - dark mode only */}
        {!isLight && (
          <>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                background: "radial-gradient(ellipse 70% 60% at 25% 45%, rgba(110,247,212,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                background: "radial-gradient(ellipse 70% 60% at 75% 45%, rgba(124,92,191,0.09) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          </>
        )}

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Section heading */}
          <div className="text-center mb-14 animate-fade-up">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: accent, letterSpacing: "0.2em" }}
            >
              Leadership
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold mt-4 mb-4"
              style={{
                fontFamily: "Sora, system-ui, sans-serif",
                color: textPrimary,
                lineHeight: 1.12,
              }}
            >
              {site.about.foundersSectionTitle}
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: textSecondary, lineHeight: 1.7 }}
            >
              {site.about.foundersSectionSubtitle}
            </p>
          </div>

          {/* Founders grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
            {/* MEL KOTCHEY */}
            <div
              className="animate-fade-up"
              data-ocid="about.founders.card.1"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Portrait */}
              <div
                style={{
                  position: "relative",
                  height: `${melCfg.containerHeight}px`,
                  overflow: "hidden",
                  borderRadius: isLight ? "20px 20px 0 0" : "20px 20px 0 0",
                }}
              >
                <img
                  src={melPhoto}
                  alt="Mel Kotchey, Co-Founder & CEO"
                  loading="lazy"
                  width={800}
                  height={1000}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    ...melStyle,
                  }}
                />
                {/* Overlay for text readability */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isLight
                      ? "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.9) 80%)"
                      : "linear-gradient(to bottom, transparent 40%, rgba(8,13,26,0.95) 80%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Bio Card */}
              <div
                className="rounded-b-2xl"
                style={{
                  background: isLight ? "#ffffff" : cardBg,
                  border: `1px solid ${isLight ? "#e2e8f0" : "rgba(110,247,212,0.18)"}`,
                  borderTop: "none",
                  boxShadow: isLight
                    ? "0 8px 30px rgba(0,0,0,0.08)"
                    : "0 0 60px rgba(110,247,212,0.08)",
                  padding: "28px 32px 32px",
                  flex: 1,
                }}
              >
                <div className="mb-5">
                  <h3
                    style={{
                      fontFamily: "Sora, system-ui, sans-serif",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: textPrimary,
                      lineHeight: 1.2,
                      marginBottom: 0,
                    }}
                  >
                    {site.about.melName}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      fontFamily: "Cabinet Grotesk, system-ui, sans-serif",
                      marginTop: "8px",
                    }}
                  >
                    {site.about.melTitle}
                  </p>
                  <div style={{ marginTop: "16px", borderTop: `1px solid ${isLight ? "#e2e8f0" : "rgba(110,247,212,0.15)"}` }} />
                </div>

                <p style={{ color: textSecondary, fontSize: "15px", lineHeight: 1.8, marginBottom: "12px" }}>
                  {site.about.melBio1}
                </p>
                <p style={{ color: textSecondary, fontSize: "15px", lineHeight: 1.8, marginBottom: "24px" }}>
                  {site.about.melBio2}
                </p>

                {/* Achievements */}
                <div
                  className="rounded-xl"
                  style={{
                    backgroundColor: isLight ? "rgba(0,168,142,0.04)" : "rgba(110,247,212,0.04)",
                    border: `1px solid ${isLight ? "rgba(0,168,142,0.1)" : "rgba(110,247,212,0.1)"}`,
                    padding: "20px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={15} style={{ color: accent, flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: accent,
                        fontFamily: "Cabinet Grotesk, system-ui, sans-serif",
                      }}
                    >
                      Achievements
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {melAchievements.map((a) => (
                      <div key={a} className="flex items-start gap-3">
                        <span style={{ color: accent, fontSize: "8px", marginTop: "6px", flexShrink: 0 }}>◆</span>
                        <p style={{ color: textSecondary, fontSize: "13px", lineHeight: 1.5 }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SHANE SUEHR */}
            <div
              className="animate-fade-up"
              data-ocid="about.founders.card.2"
              style={{ display: "flex", flexDirection: "column", transitionDelay: "120ms" }}
            >
              {/* Portrait */}
              <div
                style={{
                  position: "relative",
                  height: `${shaneCfg.containerHeight}px`,
                  overflow: "hidden",
                  borderRadius: "20px 20px 0 0",
                }}
              >
                <img
                  src={shanePhoto}
                  alt="Shane Suehr, Co-Founder & COO"
                  loading="lazy"
                  width={832}
                  height={1248}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    ...shaneStyle,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isLight
                      ? "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.9) 80%)"
                      : "linear-gradient(to bottom, transparent 40%, rgba(8,13,26,0.95) 80%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Bio Card */}
              <div
                className="rounded-b-2xl"
                style={{
                  background: isLight ? "#ffffff" : cardBg,
                  border: `1px solid ${isLight ? "#e2e8f0" : "rgba(124,92,191,0.22)"}`,
                  borderTop: "none",
                  boxShadow: isLight
                    ? "0 8px 30px rgba(0,0,0,0.08)"
                    : "0 0 60px rgba(124,92,191,0.1)",
                  padding: "28px 32px 32px",
                  flex: 1,
                }}
              >
                <div className="mb-5">
                  <h3
                    style={{
                      fontFamily: "Sora, system-ui, sans-serif",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: textPrimary,
                      lineHeight: 1.2,
                      marginBottom: 0,
                    }}
                  >
                    {site.about.shaneName}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isLight ? "#7c3aed" : "#a87ef5",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      fontFamily: "Cabinet Grotesk, system-ui, sans-serif",
                      marginTop: "8px",
                    }}
                  >
                    {site.about.shaneTitle}
                  </p>
                  <div style={{ marginTop: "16px", borderTop: `1px solid ${isLight ? "#e2e8f0" : "rgba(124,92,191,0.18)"}` }} />
                </div>

                <p style={{ color: textSecondary, fontSize: "15px", lineHeight: 1.8, marginBottom: "12px" }}>
                  {site.about.shaneBio1}
                </p>
                <p style={{ color: textSecondary, fontSize: "15px", lineHeight: 1.8, marginBottom: "24px" }}>
                  {site.about.shaneBio2}
                </p>

                {/* Expertise */}
                <div
                  className="rounded-xl"
                  style={{
                    backgroundColor: isLight ? "rgba(124,58,237,0.04)" : "rgba(124,92,191,0.05)",
                    border: `1px solid ${isLight ? "rgba(124,58,237,0.1)" : "rgba(124,92,191,0.12)"}`,
                    padding: "20px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={15} style={{ color: isLight ? "#7c3aed" : "#a87ef5", flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: isLight ? "#7c3aed" : "#a87ef5",
                        fontFamily: "Cabinet Grotesk, system-ui, sans-serif",
                      }}
                    >
                      Areas of Expertise
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {shaneExpertise.map((a) => (
                      <div key={a} className="flex items-start gap-3">
                        <span style={{ color: isLight ? "#7c3aed" : "#a87ef5", fontSize: "8px", marginTop: "6px", flexShrink: 0 }}>◆</span>
                        <p style={{ color: textSecondary, fontSize: "13px", lineHeight: 1.5 }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          backgroundColor: bg,
          padding: "80px 0",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center animate-fade-up">
          <h2
            className="text-3xl font-bold mb-5"
            style={{
              fontFamily: "Sora, system-ui, sans-serif",
              color: textPrimary,
            }}
          >
            Ready to Work With Us?
          </h2>
          <p
            className="text-base mb-8"
            style={{ color: textSecondary }}
          >
            Reach out today to begin the conversation about your payment needs.
          </p>
          <Link to="/contact" className="cybin-btn-primary">
            Contact Cybin Enterprises <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
