import React from 'react';

const STANDARDS = [
  {
    title: 'Synchronized Service',
    description: 'Choreographed fine dining service where dishes are laid and lifted in perfect, silent unison. Creates a seamless flow that never interrupts the room’s conversation.',
    icon: (
      <svg className="w-8 h-8 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    title: 'Immaculate Grooming',
    description: 'Strict uniform standards combining classic butler attire with modern refinement. Crisp tailoring, white-glove presentation, and polished professional conduct.',
    icon: (
      <svg className="w-8 h-8 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 15.546c0.563-.186 1-.726 1-1.36V7.813c0-1.104-.896-2-2-2H4c-1.104 0-2 .896-2 2v6.373c0 .634.437 1.174 1 1.36v2.72c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2v-2.72z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 5.813v5M8 10.813l4 4 4-4" />
      </svg>
    )
  },
  {
    title: 'Certified Expertise',
    description: 'A roster curated from Michelin-starred kitchens and 5-star estates. Includes WSET-certified sommeliers, artisanal mixologists, and dedicated event captains.',
    icon: (
      <svg className="w-8 h-8 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  }
];

export default function Standards() {
  return (
    <section id="staffing" className="py-24 md:py-32 bg-charcoal text-cream relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-champagne/2 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-muted-gold/2 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-champagne font-semibold mb-3">
            Impeccable Hospitality
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide mb-6">
            The Standards of Service
          </h2>
          <div className="h-[1px] w-20 bg-champagne mx-auto mb-6"></div>
          <p className="text-cream/70 text-sm md:text-base tracking-wide leading-relaxed">
            Staffing is not an afterthought; it is the cornerstone of the Epicurean experience. Our staff are vetted, polished, and synchronized to execute flawless hospitality.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STANDARDS.map((std, idx) => (
            <div
              key={idx}
              className="group p-8 md:p-10 bg-charcoal border border-champagne/10 hover:border-champagne/40 transition-all duration-500 rounded-none flex flex-col justify-between h-full hover:-translate-y-2 shadow-2xl relative"
            >
              {/* Top border highlight hover */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-champagne group-hover:w-full transition-all duration-500"></div>

              <div>
                {/* Icon wrapper */}
                <div className="mb-8 p-4 border border-champagne/15 w-16 h-16 flex items-center justify-center group-hover:bg-champagne/10 transition-colors duration-500">
                  {std.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-serif text-2xl font-light text-cream tracking-wide mb-4 group-hover:text-champagne transition-colors duration-300">
                  {std.title}
                </h3>
                
                {/* Description */}
                <p className="text-cream/60 text-xs md:text-sm font-sans tracking-wide leading-relaxed">
                  {std.description}
                </p>
              </div>

              {/* Bottom decorative quote mark */}
              <div className="text-right text-[10px] uppercase tracking-[0.25em] text-champagne/40 mt-8 font-sans">
                standard {idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy Callout */}
        <div id="philosophy" className="mt-20 p-8 md:p-12 border border-champagne/20 bg-charcoal/50 max-w-4xl mx-auto text-center">
          <p className="font-serif italic text-lg md:text-xl text-cream/90 leading-relaxed">
            "Fine dining is an art, but hospitality is a choreography. Our team does not merely serve; they compose the rhythm of the event."
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne font-semibold mt-4">
            — Aura &amp; Epicure Concierge philosophy
          </p>
        </div>

      </div>
    </section>
  );
}
