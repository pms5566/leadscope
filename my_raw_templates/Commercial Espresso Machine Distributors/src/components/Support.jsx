import React from 'react';

const COVERAGE = [
  { city: 'Melbourne', status: 'Central Workshop / Showroom', dispatch: '20 Min Average response' },
  { city: 'Sydney', status: 'Regional Hub / Showroom', dispatch: '35 Min Average response' },
  { city: 'Brisbane', status: 'Affiliate Workshop', dispatch: '45 Min Average response' },
  { city: 'Adelaide', status: 'Affiliate Dispatch', dispatch: '60 Min Average response' },
  { city: 'Perth', status: 'Affiliate Dispatch', dispatch: '60 Min Average response' },
];

export default function Support() {
  return (
    <section id="support" className="py-24 md:py-32 bg-steel-gray text-matte-black border-b border-steel-gray/20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Reassurance Text & Contracts */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-copper font-bold mb-3">
              Zero Downtime SLA
            </p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Hospitality-Grade Dispatch
            </h2>
            <div className="h-[2px] w-20 bg-copper mb-6"></div>
            <p className="text-matte-black/70 text-sm md:text-base leading-relaxed tracking-wide">
              We understand that a broken espresso machine is a closed business. Our "Zero Downtime" contract guarantees hot-swap replacement machinery and round-the-clock technician dispatch in all capital cities.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex space-x-4 border-l-2 border-copper pl-6">
              <div>
                <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-matte-black mb-1">
                  24/7 Emergency Repairs
                </h4>
                <p className="text-xs text-matte-black/60 leading-relaxed">
                  Hotline dispatch connected directly to field engineers carrying pre-packaged boiler spares and gaskets.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 border-l-2 border-copper pl-6">
              <div>
                <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-matte-black mb-1">
                  Preventative Maintenance Contracts
                </h4>
                <p className="text-xs text-matte-black/60 leading-relaxed">
                  Scheduled quarterly inspections covering group head seals, steam wand rebuilds, and water filtration cartridge audits to prevent scale build-up.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stylized map & Hub list */}
        <div className="lg:col-span-6 p-8 bg-matte-black text-steel-gray shadow-2xl relative border border-steel-gray/10">
          <h3 className="font-sans text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-steel-gray/10 pb-4">
            Australian Service Coverage
          </h3>
          
          <div className="space-y-6">
            {COVERAGE.map((cov, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-steel-gray/5 pb-4 last:border-0 last:pb-0 group">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-copper group-hover:scale-125 transition-transform"></span>
                  <div>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                      {cov.city}
                    </h4>
                    <p className="text-[10px] text-steel-gray/40 font-mono mt-0.5">{cov.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 border border-copper/30 bg-copper/5 text-copper text-[8px] uppercase tracking-widest font-mono">
                    {cov.dispatch}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Map Vector Graphic Mockup */}
          <div className="mt-8 pt-8 border-t border-steel-gray/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-steel-gray/30">
            <span>✦ 100% Nationwide Spare Parts Stocked</span>
            <span>Est. 2012</span>
          </div>
        </div>

      </div>
    </section>
  );
}
