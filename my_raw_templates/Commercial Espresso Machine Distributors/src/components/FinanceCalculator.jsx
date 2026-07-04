import React, { useState } from 'react';

export default function FinanceCalculator() {
  const [machineValue, setMachineValue] = useState(15000);

  // Realistic SilverChef Rent-to-Own weekly estimation rate (~$7.00 per $1,000 of value)
  const weeklyRate = 0.007; 
  const weeklyEstimate = Math.round(machineValue * weeklyRate);
  
  // Tax deduction estimation (assuming 30% B2B tax write-off on lease payments)
  const taxSavings = Math.round(weeklyEstimate * 0.3);
  const netWeeklyCost = weeklyEstimate - taxSavings;

  return (
    <section id="calculator" className="py-24 bg-matte-black text-steel-gray relative overflow-hidden border-b border-steel-gray/5">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-copper/2 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-copper font-bold mb-3">
            Financial Flexibility
          </p>
          <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            SilverChef Leasing Calculator
          </h2>
          <div className="h-[2px] w-20 bg-copper mx-auto mb-6"></div>
          <p className="text-steel-gray/60 text-sm md:text-base leading-relaxed">
            Preserve your working capital. We partner with SilverChef to offer flexible rent-to-own funding solutions. Calculate your estimated weekly payments below.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-matte-black border border-steel-gray/10 p-8 md:p-12 shadow-2xl items-center">
          
          {/* Inputs */}
          <div className="space-y-6">
            <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-steel-gray/5 pb-2">
              1. Setup Equipment Value
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="text-xs uppercase tracking-widest text-steel-gray/50">
                  Total Equipment Value
                </label>
                <span className="font-mono text-2xl font-bold text-copper">
                  ${machineValue.toLocaleString()} AUD
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="5000"
                max="50000"
                step="500"
                value={machineValue}
                onChange={(e) => setMachineValue(parseInt(e.target.value))}
                className="w-full h-1 bg-steel-gray/10 rounded-lg appearance-none cursor-pointer accent-copper"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-steel-gray/30 font-mono">
                <span>$5,000 AUD</span>
                <span>$25,000 AUD</span>
                <span>$50,000+ AUD</span>
              </div>
            </div>

            {/* Custom Input Box */}
            <div className="pt-4 border-t border-steel-gray/5">
              <label className="text-[10px] uppercase tracking-widest text-steel-gray/50 block mb-2">
                Custom Invoice Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-xs text-steel-gray/40 font-mono">$</span>
                <input
                  type="number"
                  min="3000"
                  max="100000"
                  value={machineValue}
                  onChange={(e) => setMachineValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 pl-8 border border-steel-gray/10 bg-matte-black focus:outline-none focus:border-copper text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="p-8 bg-steel-gray text-matte-black flex flex-col justify-between h-full border border-steel-gray/5">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-copper font-bold block mb-4">
                Estimated SilverChef Rate
              </span>
              
              <div className="mb-6">
                <span className="text-4xl md:text-5xl font-mono font-bold text-matte-black">
                  ${weeklyEstimate}
                </span>
                <span className="text-xs uppercase tracking-widest text-matte-black/60 font-bold ml-2">
                  / Week
                </span>
              </div>

              <div className="space-y-3 text-xs border-t border-matte-black/10 pt-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-matte-black/60">Estimated Tax Savings (30%)</span>
                  <span className="font-bold">-${taxSavings} / Wk</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-matte-black/10 pt-2 text-sm font-bold">
                  <span>Net Weekly Out-of-pocket</span>
                  <span className="text-copper">${netWeeklyCost} / Wk</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const configSection = document.getElementById('configurator');
                if (configSection) configSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-4 bg-matte-black hover:bg-copper text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md text-center"
            >
              Configure &amp; Apply
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
