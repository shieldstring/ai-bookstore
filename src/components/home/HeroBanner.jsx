import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-black text-white min-h-[88vh] lg:min-h-[92vh] flex items-center overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Montserrat:wght@900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;450;600&display=swap');

          .brand-title-heavy {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
          }

          .signature-font {
            font-family: 'Caveat', cursive;
          }

          .quote-serif {
            font-family: 'Playfair Display', serif;
          }

          .body-jakarta {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}
      </style>

      {/* Stage portrait — fixed feel on scroll within hero */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] z-0 pointer-events-none">
        <img
          src="/pl 4.jpeg"
          alt="Wisdom Peters presenting on stage"
          className="w-full h-full object-cover object-top grayscale contrast-125 brightness-90 opacity-35 lg:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 lg:via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 lg:hidden" />
      </div>

      {/* Decorative gold accents */}
      <div className="absolute top-20 left-8 w-24 h-24 border border-[#D4AF37]/20 rounded-full hidden lg:block" aria-hidden="true" />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-[#D4AF37] rounded-full hidden lg:block" aria-hidden="true" />
      <div className="absolute top-1/3 right-[12%] w-16 h-16 border border-[#D4AF37]/15 rotate-45 hidden lg:block" aria-hidden="true" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 py-20 lg:py-28">
        <div className="max-w-2xl space-y-8">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#D4AF37] uppercase">
            Wisdom Peters
          </p>

          <div className="brand-title-heavy text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.85]">
            <h1 className="text-[#D4AF37]">Wisdom</h1>
            <h1 className="text-[#D4AF37]">Peters</h1>
          </div>

          {/* Artistic quote block */}
          <div className="relative pt-4">
            <span className="quote-serif text-6xl sm:text-7xl text-[#D4AF37]/30 absolute -top-2 -left-1 leading-none select-none" aria-hidden="true">
              "
            </span>
            <blockquote className="quote-serif text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed italic pl-6 border-l-2 border-[#D4AF37]/60">
              When God has something to teach me, He sends me a teacher. I may not like the lessons but they are ideal for me.
            </blockquote>
            <p className="signature-font text-2xl sm:text-3xl text-[#D4AF37]/80 mt-4 pl-6">
              — Wisdom Peters
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 body-jakarta">
            <button
              onClick={() => navigate("/about")}
              className="px-6 py-3 border border-[#D4AF37]/60 text-[#D4AF37] font-semibold text-sm tracking-wide hover:bg-[#D4AF37]/10 transition"
            >
              About Wisdom
            </button>
            <button
              onClick={() => navigate("/books")}
              className="px-6 py-3 bg-[#D4AF37] text-black font-bold text-sm tracking-wide hover:bg-[#c9a430] transition"
            >
              Explore Books & Courses
            </button>
          </div>
        </div>
      </div>

      <span className="signature-font text-4xl sm:text-5xl text-white/20 absolute bottom-8 right-6 sm:right-16 select-none rotate-[-8deg] tracking-widest pointer-events-none hidden lg:block">
        WISDOMPETERS
      </span>
    </section>
  );
};

export default HeroBanner;
