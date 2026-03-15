import { JsonLd } from "@/components/JsonLd";
import { useTheme } from "@/contexts/ThemeContext";
import { useSeo } from "@/hooks/useSeo";
import { Link, useParams } from "@/lib/router";
import { AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { useEffect } from "react";

import { type IndustryData, industries } from "@/data/industries";

export default function IndustryLandingPage() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";
  const { slug } = useParams<{ slug: string }>();
  const industry = industries.find((i) => i.slug === slug);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on slug change to animate new content
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
  }, [slug]);

  // Scroll to top on slug change
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on slug change intentional
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // Call hooks unconditionally
  useSeo(
    industry
      ? {
          title: industry.metaTitle,
          description: industry.metaDesc,
          canonical: `/industries/${industry.slug}`,
        }
      : {
          title: "Industry Not Found | Cybin Enterprises",
          description: "This industry page was not found.",
          canonical: "/industries",
        },
  );



  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: industry.title,
          description: industry.metaDesc,
          provider: {
            "@type": "Organization",
            name: "Cybin Enterprises",
            url: "https://cybinenterprises.com",
          },
          areaServed: "Global",
          serviceType: "Payment Processing",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://cybinenterprises.com/industries/${industry.slug}`,
          },
        }}
      />

      {/* Hero */}
      <section
        className="page-hero-bg"
        style={{
          padding: "80px 0 60px",
          borderBottom: "1px solid rgba(110,247,212,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-up">
            <div
              className="flex items-center gap-2 mb-4"
              style={{ flexWrap: "wrap" }}
            >
              <Link
                to="/"
                className="text-sm text-[#e8edf8]/45 dark:text-[#e8edf8]/45"
                style={{
                  color: isLight ? "#64748b" : "rgba(232,237,248,0.45)",
                }}
              >
                Home
              </Link>
              <ChevronRight
                size={14}
                style={{ color: "rgba(232,237,248,0.3)" }}
              />
              <Link
                to="/industries"
                className="text-sm"
                style={{
                  color: isLight ? "#64748b" : "rgba(232,237,248,0.45)",
                }}
              >
                Industries
              </Link>
              <ChevronRight
                size={14}
                style={{ color: "rgba(232,237,248,0.3)" }}
              />
              <span className="text-sm" style={{ color: "#00d4b8" }}>
                {industry.title}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 font-display text-white leading-[1.15]">
              {industry.hero}
            </h1>
            <p className="text-lg mb-6 text-[#e8edf8]/65 leading-relaxed">
              {industry.heroSub}
            </p>
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{
                backgroundColor: "rgba(255,193,7,0.05)",
                border: "1px solid rgba(255,193,7,0.2)",
              }}
            >
              <AlertTriangle
                size={16}
                style={{ color: "#ffc107", flexShrink: 0, marginTop: 2 }}
              />
              <p className="text-xs leading-relaxed text-slate-500 dark:text-[#e8edf8]/60">
                Cybin Enterprises is a payment services intermediary — not a
                bank, processor, or acquirer. We connect merchants with
                appropriate acquiring partners. Approval is not guaranteed. Each
                merchant is responsible for their own regulatory compliance.
                Results vary by business model, processing history, and
                underwriting criteria.
              </p>
            </div>
            <Link
              to="/apply"
              data-ocid="industry.hero.primary_button"
              className="cybin-btn-primary"
            >
              Start Your Approval Process
              <ChevronRight size={16} />
            </Link>
          </div>
          </div>
          </section>
          <section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          style={{ padding: "72px 0" }}
          >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
          <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#00d4b8" }}
          >
          Common Challenges
          </span>
          <h2 className="text-3xl font-bold mt-3 font-display text-slate-900 dark:text-[#e8edf8]">
          Why Payment Processing Is Difficult in This Space
          </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center mb-12 animate-fade-up">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#00d4b8" }}
            >
              Common Challenges
            </span>
            <h2 className="text-3xl font-bold mt-3 font-display text-slate-900 dark:text-[#e8edf8]">
              Why Payment Processing Is Difficult in This Space
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.painPoints.map((pp, idx) => (
              <div
                key={pp.title}
                data-ocid={`industry.pain_point.item.${idx + 1}`}
                className="animate-fade-up cybin-glass-card p-6"
                style={{
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(110,247,212,0.1)" }}
                >
                  <span style={{ color: "#00d4b8", fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-3 font-display text-slate-900 dark:text-[#e8edf8]">
                  {pp.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {pp.body}
                </p>
              </div>
            ))}
          </div>
          </div>
          </div>
          </section>

      {/* Benefits */}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
          <h2 className="text-2xl font-bold mb-8 font-display text-slate-900 dark:text-[#e8edf8]">
            How Cybin Can Help
          </h2>
          <div className="flex flex-col gap-3 text-left">
            {industry.benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle
                  size={16}
                  style={{ color: "#00d4b8", flexShrink: 0 }}
                />
                <span className="text-sm text-slate-700 dark:text-[#e8edf8]/80">
                  {b}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/apply"
              data-ocid="industry.benefits.cta.button"
              className="cybin-btn-primary"
            >
              Get Started
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
          {/* FAQ */}
          <section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
          className="bg-slate-50 dark:bg-cybin-navy py-16"
          >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
          Frequently Asked Questions
          </h2>section
      className="bg-slate-50 dark:bg-cybin-navy py-16"
      >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
      Frequently Asked Questions
      </h2>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4">
            {industry.faq.map((item, idx) => (
              <div
                key={item.q}
                data-ocid={`industry.faq.item.${idx + 1}`}
                className="animate-fade-up"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <h3 className="text-sm font-bold mb-2 font-display text-slate-900 dark:text-[#e8edf8]">
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Industries */}
      <section className="bg-slate-100 dark:bg-[#0c1020] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center animate-fade-up font-display text-slate-900 dark:text-[#e8edf8]">
            Related Industries
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {industry.related.map((r, idx) => (
              <Link
                key={r.slug}
                to={`/industries/${r.slug}`}
                data-ocid={`industry.related.item.${idx + 1}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cybin-glass-card"
                style={{
                  color: isLight ? "#0f172a" : "#e8edf8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(110,247,212,0.12)";
                  e.currentTarget.style.borderColor = "rgba(110,247,212,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(110,247,212,0.06)";
                  e.currentTarget.style.borderColor = "rgba(110,247,212,0.2)";
                }}
              >
                {r.label}
                <ChevronRight size={14} style={{ color: "#00d4b8" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
