import React from "react";

const ArtHeroFonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Montserrat:wght@700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;450;600&display=swap');

      .art-hero-brand {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
      }
      .art-hero-serif {
        font-family: 'Playfair Display', serif;
      }
      .art-hero-signature {
        font-family: 'Caveat', cursive;
      }
      .art-hero-body {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      @keyframes art-hero-shimmer {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.9; }
      }
      .art-hero-shimmer {
        animation: art-hero-shimmer 4s ease-in-out infinite;
      }
      @keyframes art-hero-float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(2deg); }
      }
      .art-hero-float {
        animation: art-hero-float 6s ease-in-out infinite;
      }
    `}
  </style>
);

export default ArtHeroFonts;
