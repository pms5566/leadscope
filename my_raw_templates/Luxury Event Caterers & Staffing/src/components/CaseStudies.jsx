import React, { useState } from 'react';

const CASE_STUDIES = [
  {
    title: 'The Solstice Gala',
    client: 'Vanguard Fine Art Foundation',
    location: 'Modern Art Pavilion',
    guests: 250,
    quote: "Aura & Epicure didn't just cater our gala; they curated a culinary journey. The synchronized service was breathtaking—250 plates landed in absolute silence, in unison.",
    author: 'Elena Rostova, Executive Director',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop',
    logo: '✦ VANGUARD'
  },
  {
    title: 'An Emerald Coast Soirée',
    client: 'Oceanic Elite Charters',
    location: 'Superyacht Chronos',
    guests: 60,
    quote: "Orchestrating Michelin-caliber plates in a moving galley is no small feat. Aura’s chefs and sommeliers delivered a world-class tasting menu that our charter guests are still talking about.",
    author: 'Captain Marcus Sterling',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop',
    logo: '⚓ OCEANIC'
  },
  {
    title: 'High-Society Nuptials',
    client: 'The Kensington-Vance Wedding',
    location: 'Vance Manor Estate',
    guests: 180,
    quote: "Every detail was flawless. The butler staff were groomed to perfection and pre-empted every guest need. The bespoke mixology bar was the highlight of the reception.",
    author: 'Lady Victoria Vance',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop',
    logo: '⚜ K&V ESTATE'
  }
];

export default function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === CASE_STUDIES.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? CASE_STUDIES.length - 1 : prev - 1));
  };

  return (
    <section id="experiences" className="py-24 md:py-32 bg-charcoal text-cream relative overflow-hidden border-b border-champagne/10">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-champagne font-semibold mb-3">
            Concierge Portfolios
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide mb-6">
            Client Experiences
          </h2>
          <div className="h-[1px] w-20 bg-champagne mx-auto mb-6"></div>
          <p className="text-cream/70 text-sm md:text-base tracking-wide">
            Read case studies of recent high-society events, private estates, and luxury yacht charters serviced by our staff.
          </p>
        </div>

        {/* Carousel Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-charcoal border border-champagne/15 p-8 md:p-12">
          
          {/* Left Column: Image with animation */}
          <div className="lg:col-span-6 relative h-[300px] md:h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-charcoal/10 z-10"></div>
            <img
              src={CASE_STUDIES[activeIndex].image}
              alt={CASE_STUDIES[activeIndex].title}
              className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-700 ease-out animate-fade-in"
              key={activeIndex} // Force remount for transition
            />
            {/* Logo overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-charcoal/80 border border-champagne/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-champagne font-semibold font-sans">
              {CASE_STUDIES[activeIndex].logo}
            </div>
          </div>

          {/* Right Column: Narrative Testimonial */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full py-4 lg:pl-6">
            <div className="animate-fade-in" key={activeIndex}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-bold block mb-2">
                {CASE_STUDIES[activeIndex].client}
              </span>
              <h3 className="font-serif text-3xl font-light text-cream tracking-wide mb-2">
                {CASE_STUDIES[activeIndex].title}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/50 font-sans mb-6">
                {CASE_STUDIES[activeIndex].location} &bull; {CASE_STUDIES[activeIndex].guests} guests
              </p>

              <blockquote className="font-serif italic text-base md:text-lg text-cream/90 leading-relaxed border-l-2 border-champagne pl-6 mb-6">
                "{CASE_STUDIES[activeIndex].quote}"
              </blockquote>
              
              <cite className="font-sans text-xs uppercase tracking-widest text-champagne not-italic font-semibold">
                — {CASE_STUDIES[activeIndex].author}
              </cite>
            </div>

            {/* Controls */}
            <div className="flex space-x-4 mt-12 items-center">
              <button
                onClick={handlePrev}
                className="w-10 h-10 border border-champagne/20 hover:border-champagne flex items-center justify-center text-champagne hover:bg-champagne/10 transition-colors"
                aria-label="Previous Experience"
              >
                &larr;
              </button>
              <span className="text-xs uppercase tracking-[0.25em] text-cream/40 font-sans font-semibold">
                {activeIndex + 1} / {CASE_STUDIES.length}
              </span>
              <button
                onClick={handleNext}
                className="w-10 h-10 border border-champagne/20 hover:border-champagne flex items-center justify-center text-champagne hover:bg-champagne/10 transition-colors"
                aria-label="Next Experience"
              >
                &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
