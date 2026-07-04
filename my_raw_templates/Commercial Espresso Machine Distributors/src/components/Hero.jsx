import React from 'react';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen bg-matte-black text-steel-gray pt-32 pb-16 flex flex-col justify-center relative overflow-hidden border-b border-steel-gray/5">
      {/* Structural technical grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(229,231,235,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(229,231,235,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Column: Bold Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 border border-copper/30 bg-copper/5">
            <span className="w-1.5 h-1.5 bg-copper rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-copper">
              Commercial Duty &bull; Australian Standard
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-white">
            BUILT FOR VOLUME.<br />
            ENGINEERED FOR PRECISION.<br />
            <span className="text-copper">THE HEART OF AUSTRALIA'S BEST CAFES.</span>
          </h1>

          <p className="text-steel-gray/60 text-sm md:text-base leading-relaxed max-w-xl font-sans tracking-wide">
            Apex supplies high-volume multi-boiler machinery built to sustain extreme peak rushes. Uncompromising thermal stability, tailored custom finishes, and guaranteed round-the-clock technical dispatch.
          </p>

          {/* Quick Specs Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-md font-sans text-left">
            <div className="border border-steel-gray/10 p-3 bg-matte-black">
              <span className="block text-copper font-mono text-sm font-bold">2-GROUP</span>
              <span className="text-[9px] uppercase tracking-wider text-steel-gray/40">Compact Volume</span>
            </div>
            <div className="border border-steel-gray/10 p-3 bg-matte-black">
              <span className="block text-copper font-mono text-sm font-bold">3-GROUP</span>
              <span className="text-[9px] uppercase tracking-wider text-steel-gray/40">Standard Bistro</span>
            </div>
            <div className="border border-steel-gray/10 p-3 bg-matte-black">
              <span className="block text-copper font-mono text-sm font-bold">4-GROUP</span>
              <span className="text-[9px] uppercase tracking-wider text-steel-gray/40">Extreme Peak</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button
              onClick={() => scrollToSection('configurator')}
              className="px-8 py-4 bg-copper hover:bg-copper-dark text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300"
            >
              Configure Machine
            </button>
            <button
              onClick={() => scrollToSection('support')}
              className="px-8 py-4 border border-steel-gray/25 hover:border-copper text-steel-gray hover:text-copper transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] font-bold"
            >
              Dispatch Network
            </button>
          </div>
        </div>

        {/* Right Column: Industrial Machine Showcase */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Subtle glow behind machine */}
          <div className="absolute w-[300px] h-[300px] bg-copper/5 rounded-full blur-[80px] -z-10"></div>
          
          <div className="border border-steel-gray/10 p-4 bg-matte-black shadow-2xl relative group">
            <img
              src="/apex_machine.png"
              alt="Apex Commercial Multi-boiler espresso machine with custom timber side panels"
              className="max-w-full h-auto object-contain transform scale-100 group-hover:scale-102 transition-transform duration-700"
            />
            {/* Tech detail callouts */}
            <div className="absolute top-4 right-4 bg-copper text-white text-[9px] uppercase tracking-[0.2em] px-2 py-1 font-bold">
              Custom Oak Accents
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
