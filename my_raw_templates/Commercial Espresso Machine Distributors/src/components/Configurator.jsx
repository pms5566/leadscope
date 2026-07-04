import React, { useState } from 'react';

const FINISHES = [
  { id: 'matte-black', label: 'Matte Black Steel', price: 0, color: 'bg-[#1a1a1a] border-[#333]' },
  { id: 'powder-coat', label: 'Custom Powder Coat', price: 850, color: 'bg-[#D4AF37] border-[#AA7C11]' },
  { id: 'oak-timber', label: 'Premium Oak Accents', price: 1400, color: 'bg-[#b8860b] border-[#8b6508]' },
];

const GROUPS = [
  { id: 2, label: '2-Group Configuration', price: 14500, boiler: '4.2L Steam / 1.8L Brew' },
  { id: 3, label: '3-Group Configuration', price: 16800, boiler: '8.2L Steam / 3.4L Brew' },
  { id: 4, label: '4-Group Configuration', price: 19200, boiler: '11.5L Steam / 5.2L Brew' },
];

export default function Configurator() {
  const [selectedGroup, setSelectedGroup] = useState(3);
  const [selectedFinish, setSelectedFinish] = useState('oak-timber');
  const [formData, setFormData] = useState({
    cafeName: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeGroup = GROUPS.find(g => g.id === selectedGroup);
  const activeFinish = FINISHES.find(f => f.id === selectedFinish);
  
  const calculatedTotal = activeGroup.price + activeFinish.price;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.cafeName && formData.email) {
      setIsSubmitted(true);
    }
  };

  return (
    <section id="configurator" className="py-24 md:py-32 bg-steel-gray text-matte-black border-b border-steel-gray/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-copper font-bold mb-3">
            Bespoke Engineering
          </p>
          <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-6">
            B2B Machine Configurator
          </h2>
          <div className="h-[2px] w-20 bg-copper mx-auto mb-6"></div>
          <p className="text-matte-black/70 text-sm md:text-base leading-relaxed">
            Select your capacity and custom visual trim. Our Melbourne workshop builds each machine to order, pre-configured for your cafe's volume and voltage specifications.
          </p>
        </div>

        {/* Configurator Box */}
        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="max-w-2xl mx-auto border-2 border-copper p-12 bg-white text-center shadow-2xl">
            <div className="w-16 h-16 border border-copper flex items-center justify-center mx-auto mb-6 text-2xl text-copper">
              ✓
            </div>
            <h3 className="font-sans text-3xl font-bold mb-4">Quote Request Submitted</h3>
            <p className="text-matte-black/70 text-sm mb-8">
              Thank you. Our commercial sales division will contact you with a formal B2B invoice and lease-to-own options within 1 business hour.
            </p>
            <div className="bg-steel-gray p-6 border-l-4 border-copper text-left text-xs space-y-2 font-mono">
              <p><strong>Establishment:</strong> {formData.cafeName}</p>
              <p><strong>Configured Specs:</strong> {selectedGroup}-Group &bull; {activeFinish.label}</p>
              <p><strong>Est. Value (AUD):</strong> ${calculatedTotal.toLocaleString()}</p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ cafeName: '', email: '', phone: '' });
              }}
              className="px-8 py-3 bg-matte-black hover:bg-copper text-white uppercase tracking-widest text-xs font-bold"
            >
              Reconfigure
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-charcoal/10 shadow-2xl p-6 md:p-12">
            
            {/* Left: Product Visual & Live Summary */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="relative border border-steel-gray bg-[#1a1a1a] p-8 flex items-center justify-center h-[320px] md:h-[400px]">
                  <img
                    src="/apex_machine.png"
                    alt="Configurator espresso machine"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-copper text-white text-[8px] uppercase tracking-widest px-2 py-1 font-mono font-bold">
                    active configuration
                  </div>
                </div>

                {/* Estimate Summary box */}
                <div className="mt-8 p-6 bg-steel-gray border border-matte-black/5 font-sans space-y-4">
                  <h4 className="font-sans text-xs uppercase tracking-widest text-copper font-bold">
                    Build Summary
                  </h4>
                  <div className="flex justify-between text-xs border-b border-matte-black/10 pb-2">
                    <span className="text-matte-black/60">{selectedGroup}-Group Chassis</span>
                    <span className="font-bold">${activeGroup.price.toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-matte-black/10 pb-2">
                    <span className="text-matte-black/60">Finish: {activeFinish.label}</span>
                    <span className="font-bold">${activeFinish.price.toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 font-bold">
                    <span>Est. Equipment Value</span>
                    <span className="text-copper">${calculatedTotal.toLocaleString()} AUD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Selectors & Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-6 flex flex-col justify-between space-y-8">
              
              {/* Step 1: Group selector */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-copper font-bold mb-4">
                  1. Select Boiler &amp; Group Capacity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {GROUPS.map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setSelectedGroup(g.id)}
                      className={`p-4 border text-center transition-all ${
                        selectedGroup === g.id
                          ? 'border-copper bg-copper/5 shadow-md font-bold'
                          : 'border-matte-black/10 hover:border-copper/40'
                      }`}
                    >
                      <span className="block text-sm font-bold text-matte-black">{g.id} Groups</span>
                      <span className="block text-[8px] uppercase tracking-wider text-matte-black/50 mt-1">
                        {g.boiler.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Finish Selector */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-copper font-bold mb-4">
                  2. Customize Aesthetics
                </label>
                <div className="space-y-3">
                  {FINISHES.map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setSelectedFinish(f.id)}
                      className={`w-full p-4 border flex items-center justify-between text-left transition-all ${
                        selectedFinish === f.id
                          ? 'border-copper bg-copper/5 shadow-sm'
                          : 'border-matte-black/10 hover:border-copper/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-4 h-4 rounded-full border ${f.color}`}></span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-matte-black">
                          {f.label}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-copper">
                        {f.price > 0 ? `+$${f.price.toLocaleString()} AUD` : 'Standard'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Quote Info */}
              <div className="pt-6 border-t border-matte-black/10 space-y-4">
                <label className="block text-xs uppercase tracking-[0.2em] text-copper font-bold mb-2">
                  3. B2B Client Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Cafe / Business Name"
                    value={formData.cafeName}
                    onChange={(e) => setFormData({ ...formData, cafeName: e.target.value })}
                    className="w-full p-3 border border-matte-black/15 bg-transparent focus:outline-none focus:border-copper text-xs"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-matte-black/15 bg-transparent focus:outline-none focus:border-copper text-xs"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-matte-black/15 bg-transparent focus:outline-none focus:border-copper text-xs"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-matte-black hover:bg-copper text-white font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md"
              >
                Request B2B Quote
              </button>

            </form>
          </div>
        )}

      </div>
    </section>
  );
}
