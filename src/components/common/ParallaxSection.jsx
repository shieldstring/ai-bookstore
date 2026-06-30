import React from "react";

const ParallaxSection = ({
  image,
  children,
  overlayClass = "bg-black/65",
  className = "",
  minHeight = "min-h-[420px]",
}) => {
  return (
    <section className={`relative overflow-hidden ${minHeight} ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${image}')` }}
        aria-hidden="true"
      />
      <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default ParallaxSection;
