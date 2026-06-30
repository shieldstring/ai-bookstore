import { useState } from "react";
import { Play, Star, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleBrowseClick = () => {
    navigate("/books");
  };

  return (
    <section className="relative bg-black text-white min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Self-contained Font Imports for exact typographic matches */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Montserrat:wght@900&family=Plus+Jakarta+Sans:wght@300;450;700&display=swap');
          
          .brand-title-heavy {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
          }
          
          .signature-font {
            font-family: 'Caveat', cursive;
          }

          .body-jakarta {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}
      </style>

      {/* Grayscale Stage Presenter Background Image on the right half */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] z-0 pointer-events-none">
        <img
          src="/pl 4.jpeg"
          alt="william peter styled speaker presenting on stage"
          className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 opacity-40 lg:opacity-100"
        />
           {/* White Signature Handwriting Overlay overlaying the sub-headline / bottom area */}
              <span className="signature-font text-5xl sm:text-6xl text-white/50 absolute bottom-10 right-4 sm:right-48 select-none rotate-[-6deg] tracking-widest pointer-events-none">
                WISDOMPETERS
              </span>
        {/* Right-to-left black gradient mask to blend image into solid black left-column */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 lg:via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:hidden"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Bold Personal Brand Typography */}
          <div className="lg:col-span-6 space-y-7 text-left relative">
            {/* Pre-header Tagline */}
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-300 uppercase leading-none">
              ELEVATE YOUR ENDEAVORS WITH
            </p>

            {/* Stacked Gold Brand Heading */}
            <div className="space-y-0 brand-title-heavy text-5xl sm:text-7xl lg:text-8.5xl tracking-tight uppercase leading-[0.85] select-none">
              <h1 className="text-[#D4AF37]">AI BOOK</h1>
              <h1 className="text-[#D4AF37]">STORE</h1>
            </div>

            {/* Benefit-Driven Sub-headline */}
            <div className="relative">
              <p className="body-jakarta text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed font-light">
                Renowned as a{" "}
                <strong className="text-white font-bold">TOP-TIER</strong>{" "}
                learning and social e-commerce platform, AI Bookstore magnifies
                outcomes, guiding our community to experience{" "}
                <span className="text-white italic not-italic font-medium underline decoration-amber-500/50 decoration-2 underline-offset-4">
                  rapid results
                </span>{" "}
                unparalleled in the industry.
              </p>

              
            </div>
          </div>

          {/* Right Column: Empty spacer to overlay content beautifully over the stage portrait background */}
          <div className="lg:col-span-6 hidden lg:block"></div>
        </div>
      </div>

    </section>
  );
};

export default HeroBanner;
