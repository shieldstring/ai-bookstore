import { useNavigate } from "react-router-dom";
import ArtHeroFonts from "../common/ArtHeroFonts";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#050505] text-white min-h-[92vh] lg:min-h-[96vh] flex items-center overflow-hidden">
      <ArtHeroFonts />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      {/* Stage portrait */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] z-0 pointer-events-none">
        <img
          src="/pl 4.jpeg"
          alt="Wisdom Peters presenting on stage"
          className="w-full h-full object-cover object-top grayscale contrast-125 brightness-90 opacity-30 lg:opacity-100 art-hero-float"
          style={{ animationDuration: "8s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/92 lg:via-[#050505]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_100%)] opacity-60" />
      </div>

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Decorative geometry */}
      <div className="absolute top-16 left-10 w-28 h-28 border border-[#D4AF37]/20 rounded-full hidden lg:block art-hero-shimmer" aria-hidden="true" />
      <div className="absolute top-1/2 left-[8%] w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent hidden lg:block" aria-hidden="true" />
      <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-[#D4AF37] rounded-full hidden lg:block art-hero-float" aria-hidden="true" />
      <div className="absolute top-[20%] right-[18%] w-20 h-20 border border-[#D4AF37]/12 rotate-45 hidden xl:block" aria-hidden="true" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 art-hero-body">
              <span className="h-px w-8 bg-[#D4AF37]/60" />
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.4em] text-[#D4AF37] uppercase">
                Bible Teacher · Pastor · Author
              </p>
            </div>

            <div className="art-hero-brand text-6xl sm:text-8xl lg:text-[7.5rem] tracking-tight uppercase leading-[0.82]">
              <h1 className="text-[#D4AF37] drop-shadow-[0_0_40px_rgba(212,175,55,0.15)]">Wisdom</h1>
              <h1 className="text-white/95 ml-0 sm:ml-8 lg:ml-16">Peters</h1>
            </div>

            {/* Quote — editorial layout */}
            <div className="relative max-w-xl pt-2">
              <span
                className="art-hero-serif text-[5rem] sm:text-[6rem] text-[#D4AF37]/15 absolute -top-8 -left-2 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                "
              </span>
              <blockquote className="art-hero-serif text-xl sm:text-2xl md:text-[1.65rem] text-white/90 leading-snug italic pl-8 border-l-[3px] border-[#D4AF37]/50">
                When God has something to teach me, He sends me a teacher. I may not like the lessons but they are ideal for me.
              </blockquote>
              <p className="art-hero-signature text-3xl sm:text-4xl text-[#D4AF37]/85 mt-5 pl-8">
                — Wisdom Peters
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 art-hero-body">
              <button
                onClick={() => navigate("/about")}
                className="group relative px-7 py-3.5 overflow-hidden border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-sm tracking-widest uppercase transition hover:border-[#D4AF37]"
              >
                <span className="relative z-10">About Wisdom</span>
                <span className="absolute inset-0 bg-[#D4AF37]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <button
                onClick={() => navigate("/books")}
                className="px-7 py-3.5 bg-[#D4AF37] text-black font-bold text-sm tracking-widest uppercase hover:bg-[#e8c547] transition shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                Explore Books & Courses
              </button>
            </div>
          </div>

          {/* Right column accent — visible on large screens */}
          <div className="lg:col-span-5 hidden lg:flex justify-end items-end pb-8">
            <div className="relative art-hero-float" style={{ animationDuration: "7s" }}>
              <div className="absolute -inset-3 border border-[#D4AF37]/25 rotate-3 rounded-sm" aria-hidden="true" />
              <div className="absolute -inset-3 border border-white/5 -rotate-2 rounded-sm" aria-hidden="true" />
              <p className="art-hero-signature text-5xl text-white/20 rotate-[-12deg] translate-x-4">
                purpose driven
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade + scroll cue */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2 art-hero-body">
        <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#D4AF37]/60 to-transparent art-hero-shimmer" />
      </div>

      <span className="art-hero-signature text-4xl sm:text-5xl text-white/15 absolute bottom-16 right-8 sm:right-16 select-none rotate-[-8deg] tracking-widest pointer-events-none hidden lg:block">
        WISDOMPETERS
      </span>
    </section>
  );
};

export default HeroBanner;
