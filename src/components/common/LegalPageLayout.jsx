import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import PageHero from "./PageHero";

const LegalPageLayout = ({
  title,
  subtitle,
  eyebrow,
  seoTitle,
  seoDescription,
  breadcrumbs,
  lastUpdated = "June 2026",
  children,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={seoTitle} description={seoDescription} name="Wisdom Peters" type="website" />

      <PageHero
        variant="compact"
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        align="left"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 max-w-3xl py-12 -mt-2 relative z-10">
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-8 pb-4 border-b border-slate-100">
            Last updated: {lastUpdated}
          </p>
          <div className="prose-policy space-y-8 text-slate-600 leading-relaxed">{children}</div>
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-sm">
            <Link to="/contact" className="text-purple-600 font-semibold hover:text-purple-800 transition">
              Contact us
            </Link>
            <Link to="/faq" className="text-purple-600 font-semibold hover:text-purple-800 transition">
              FAQ
            </Link>
            <Link to="/" className="text-slate-500 hover:text-purple-600 transition">
              Back to home
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export const PolicySection = ({ title, children }) => (
  <section>
    <h2 className="text-lg font-bold text-slate-800 mb-3">{title}</h2>
    <div className="space-y-3 text-sm md:text-base">{children}</div>
  </section>
);

export default LegalPageLayout;
