import React from 'react';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen pt-20 flex flex-col lg:flex-row bg-cream text-charcoal">
      {/* Left side copy */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 lg:py-0">
        <div className="max-w-xl animate-fade-in duration-1000">
          <p className="text-xs uppercase tracking-[0.4em] text-champagne font-semibold mb-4">
            Curated Concierge Events
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light leading-[1.1] mb-6 text-shadow-subtle">
            Culinary Artistry.<br />
            Flawless Execution.<br />
            <span className="italic font-normal text-champagne">Immaculate Service.</span>
          </h1>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed tracking-wide font-sans mb-10 max-w-lg">
            Aura &amp; Epicure raises the bar for luxury private dining, grand galas, and yacht charters. We synthesize gastronomy with meticulous service to orchestrate unforgettable concierge experiences.
          </p>
          
          {/* CTA */}
          <button
            onClick={() => scrollToSection('concierge')}
            className="group relative px-8 py-4 bg-champagne hover:bg-muted-gold text-cream font-sans text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
          >
            Design Your Event
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 ml-2">
              &rarr;
            </span>
          </button>
        </div>
      </div>

      {/* Right side gourmet dish showcase */}
      <div className="flex-1 relative h-[50vh] lg:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-charcoal/10 z-10 pointer-events-none"></div>
        <img
          src="/gourmet_dish.png"
          alt="Luxury Michelin-style plated seared scallops on charcoal slate"
          className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-10000 ease-out"
          loading="eager"
        />
        {/* Decorative corner element */}
        <div className="absolute bottom-6 right-6 border border-champagne/30 p-4 z-20 hidden md:block">
          <p className="text-[10px] uppercase tracking-[0.3em] text-cream">
            Signature Presentation
          </p>
          <p className="font-serif italic text-xs text-champagne mt-1">
            Seared Scallops, Gold Saffron Nectar
          </p>
        </div>
      </div>
    </section>
  );
}
