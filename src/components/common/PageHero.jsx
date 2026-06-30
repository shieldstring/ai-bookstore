import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ArtHeroFonts from "./ArtHeroFonts";

const PageHero = ({
  title,
  subtitle,
  eyebrow = "Wisdom Peters",
  backgroundImage,
  breadcrumbs = [],
  align = "center",
  variant = "default",
  overlayClass = "bg-gradient-to-br from-black/85 via-purple-950/75 to-black/90",
  aside,
  actions,
  minHeight = "min-h-[320px] md:min-h-[380px]",
}) => {
  const isLeft = align === "left";
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <section
      className={`relative overflow-hidden text-white ${minHeight} flex items-center ${
        isFeatured ? "min-h-[65vh] md:min-h-[70vh]" : ""
      }`}
    >
      <ArtHeroFonts />

      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
            aria-hidden="true"
          />
          <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-purple-950 to-black" aria-hidden="true" />
      )}

      {/* Decorative elements */}
      <div className="absolute top-8 left-6 w-20 h-20 border border-[#D4AF37]/15 rounded-full hidden md:block art-hero-shimmer" aria-hidden="true" />
      <div className="absolute bottom-12 right-10 w-12 h-12 border border-[#D4AF37]/20 rotate-45 hidden lg:block" aria-hidden="true" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#D4AF37] rounded-full hidden md:block art-hero-float" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Diagonal bottom cut */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50"
        style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 py-14 md:py-20">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav
            className={`flex flex-wrap items-center gap-1 text-xs art-hero-body mb-6 ${
              isLeft ? "justify-start" : "justify-center"
            }`}
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <ChevronRight className="h-3 w-3 text-[#D4AF37]/60 mx-0.5 shrink-0" />
                )}
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="text-white/60 hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-semibold"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#D4AF37] uppercase tracking-wider font-semibold">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div
          className={`grid gap-10 items-center ${
            aside ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div className={`space-y-4 ${isLeft || aside ? "text-left" : "text-center mx-auto max-w-3xl"}`}>
            {!isCompact && (
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#D4AF37] uppercase art-hero-body">
                {eyebrow}
              </p>
            )}

            <div className="relative inline-block">
              <span
                className="art-hero-serif text-5xl sm:text-6xl text-[#D4AF37]/20 absolute -top-6 -left-3 select-none hidden sm:block"
                aria-hidden="true"
              >
                ✦
              </span>
              <h1
                className={`art-hero-brand uppercase tracking-tight text-[#D4AF37] leading-[0.9] ${
                  isFeatured
                    ? "text-4xl sm:text-6xl md:text-7xl"
                    : isCompact
                    ? "text-2xl sm:text-3xl md:text-4xl"
                    : "text-3xl sm:text-5xl md:text-6xl"
                }`}
              >
                {title}
              </h1>
              <div className={`mt-3 h-0.5 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/40 to-transparent ${isLeft || aside ? "w-32" : "w-24 mx-auto"}`} />
            </div>

            {subtitle && (
              <p
                className={`art-hero-serif italic text-white/80 leading-relaxed ${
                  isCompact ? "text-sm md:text-base" : "text-base md:text-lg"
                } ${!isLeft && !aside ? "max-w-2xl mx-auto" : "max-w-xl"}`}
              >
                {subtitle}
              </p>
            )}

            {actions && (
              <div className={`pt-2 flex flex-wrap gap-3 ${!isLeft && !aside ? "justify-center" : ""}`}>
                {actions}
              </div>
            )}
          </div>

          {aside && <div className="flex justify-center lg:justify-end">{aside}</div>}
        </div>
      </div>

      <span className="art-hero-signature text-3xl text-white/10 absolute bottom-20 right-8 select-none rotate-[-6deg] tracking-widest pointer-events-none hidden lg:block">
        WISDOMPETERS
      </span>
    </section>
  );
};

export default PageHero;
