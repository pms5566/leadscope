import React, { useState } from 'react';

const SPEC_DATA = {
  2: {
    steamBoiler: '4.2 Litres (PID Temp Control)',
    brewBoilers: '1.2 Litres (Independent)',
    power: '240V / 15 Amp / Single Phase',
    connection: 'Direct Plumbed (WaterMark Certified)',
    dimensions: '750mm (W) x 580mm (D) x 480mm (H)',
    weight: '72 kg',
  },
  3: {
    steamBoiler: '8.2 Litres (PID Temp Control)',
    brewBoilers: '3.4 Litres (Independent)',
    power: '240V / 20 Amp / Single Phase',
    connection: 'Direct Plumbed (WaterMark Certified)',
    dimensions: '940mm (W) x 580mm (D) x 480mm (H)',
    weight: '90 kg',
  },
  4: {
    steamBoiler: '11.5 Litres (PID Temp Control)',
    brewBoilers: '5.2 Litres (Independent)',
    power: '415V / 15 Amp / Three Phase',
    connection: 'Direct Plumbed (WaterMark Certified)',
    dimensions: '1180mm (W) x 580mm (D) x 480mm (H)',
    weight: '115 kg',
  }
};

export default function SpecsTable() {
  const [activeTab, setActiveTab] = useState(3);

  const activeSpecs = SPEC_DATA[activeTab];

  return (
    <section id="specs" className="py-24 bg-matte-black text-steel-gray border-b border-steel-gray/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-copper font-bold mb-3">
            Engineering Data
          </p>
          <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Technical Specifications
          </h2>
          <div className="h-[2px] w-20 bg-copper mx-auto mb-6"></div>
          <p className="text-steel-gray/60 text-sm md:text-base">
            Detailed engineering schematics for plumbers, electrical contractors, and cafe designers. Select group count to load compliance figures.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center space-x-4 mb-12 font-sans text-xs uppercase tracking-[0.2em] font-semibold">
          {[2, 3, 4].map((g) => (
            <button
              key={g}
              onClick={() => setActiveTab(g)}
              className={`px-6 py-3 border tab-btn cursor-pointer ${
                activeTab === g
                  ? 'border-copper bg-copper text-white'
                  : 'border-steel-gray/10 hover:border-steel-gray/30 text-steel-gray/60'
              }`}
            >
              {g} Groups Specs
            </button>
          ))}
        </div>

        {/* Technical Data Grid Table */}
        <div className="max-w-4xl mx-auto border border-steel-gray/10 bg-matte-black shadow-2xl p-8 md:p-12 animate-fade-in" key={activeTab}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-steel-gray/5 pb-8 mb-8 text-xs md:text-sm tracking-wide font-sans">
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-steel-gray/40 mb-1">Chassis Standard</span>
              <p className="font-bold text-white">Precision Welded Stainless Steel Frame</p>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-steel-gray/40 mb-1">Temperature Stability</span>
              <p className="font-bold text-white">Multi-Boiler PID Controlled (&plusmn;0.1&deg;C Tolerance)</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-steel-gray/5 pb-4">
              <span className="text-xs uppercase tracking-wider text-steel-gray/50">Steam Boiler Capacity</span>
              <span className="font-mono text-sm font-bold text-white">{activeSpecs.steamBoiler}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-steel-gray/5 pb-4">
              <span className="text-xs uppercase tracking-wider text-steel-gray/50">Independent Brew Boilers</span>
              <span className="font-mono text-sm font-bold text-white">{activeSpecs.brewBoilers}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-steel-gray/5 pb-4">
              <span className="text-xs uppercase tracking-wider text-steel-gray/50">Electrical Supply Requirements</span>
              <span className="font-mono text-sm font-bold text-white">{activeSpecs.power}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-steel-gray/5 pb-4">
              <span className="text-xs uppercase tracking-wider text-steel-gray/50">Water Inlet/Drain Connections</span>
              <span className="font-mono text-sm font-bold text-white">{activeSpecs.connection}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-steel-gray/5 pb-4">
              <span className="text-xs uppercase tracking-wider text-steel-gray/50">Physical Dimensions</span>
              <span className="font-mono text-sm font-bold text-white">{activeSpecs.dimensions}</span>
            </div>
            <div className="flex justify-between items-baseline pb-2">
              <span className="text-xs uppercase tracking-wider text-steel-gray/50">Net Unfilled Weight</span>
              <span className="font-mono text-sm font-bold text-white">{activeSpecs.weight}</span>
            </div>
          </div>

          {/* Compliance Logos callout */}
          <div className="mt-8 pt-8 border-t border-steel-gray/5 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest text-copper font-bold">
              <span>✦ AS/NZS 3820 Compliant</span>
              <span>&bull;</span>
              <span>✦ WaterMark Level 1</span>
            </div>
            <div className="border border-copper/30 px-3 py-1 text-[8px] uppercase tracking-widest text-copper font-bold bg-copper/5">
              Approved B2B Equipment
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
