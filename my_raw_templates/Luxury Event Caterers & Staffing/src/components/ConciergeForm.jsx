import React, { useState } from 'react';

const EVENT_TYPES = [
  { id: 'gala', label: 'Grand Gala', icon: '🍷' },
  { id: 'wedding', label: 'Luxury Wedding', icon: '💍' },
  { id: 'estate', label: 'Private Estate Dinner', icon: '🏡' },
  { id: 'corporate', label: 'Corporate Reception', icon: '💼' },
  { id: 'yacht', label: 'Yacht Charter', icon: '⚓' },
];

const SERVICE_TYPES = [
  { id: 'plated', label: 'Plated Dinner (Multi-Course)' },
  { id: 'buffet', label: 'Luxury Buffet Showcases' },
  { id: 'canapes', label: 'Passing Canapés & Hors d’oeuvres' },
];

const STAFF_ROLES = [
  { id: 'chef', label: 'Michelin-Trained Head Chefs' },
  { id: 'butler', label: 'Butler & Silver Service Staff' },
  { id: 'bartender', label: 'Professional Event Bartenders' },
  { id: 'mixologist', label: 'Artisanal Cocktail Mixologists' },
];

export default function ConciergeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: 'gala',
    guestCount: 50,
    serviceType: 'plated',
    staffing: ['chef', 'mixologist'],
    name: '',
    email: '',
    date: '',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStaffingToggle = (roleId) => {
    setFormData((prev) => {
      const current = prev.staffing;
      const updated = current.includes(roleId)
        ? current.filter((r) => r !== roleId)
        : [...current, roleId];
      return { ...prev, staffing: updated };
    });
  };

  const validateStep = () => {
    if (step === 4) {
      return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.date !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() && step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitted(true);
    }
  };

  // Generate dynamic summaries
  const getSelectedEventLabel = () => EVENT_TYPES.find((e) => e.id === formData.eventType)?.label || '';
  const getSelectedServiceLabel = () => SERVICE_TYPES.find((s) => s.id === formData.serviceType)?.label || '';
  const getSelectedStaffLabels = () =>
    formData.staffing.map((s) => STAFF_ROLES.find((r) => r.id === s)?.label.split(' ')[1] || '').join(', ');

  return (
    <section id="concierge" className="py-24 md:py-32 bg-cream text-charcoal border-b border-champagne/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-champagne font-semibold mb-3">
            Digital Booking Consultant
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide mb-6">
            The Digital Concierge
          </h2>
          <div className="h-[1px] w-20 bg-champagne mx-auto mb-6"></div>
          <p className="text-charcoal/70 text-sm md:text-base tracking-wide">
            Design your bespoke gastronomic event in seconds. Our interactive planner calculates service and staffing compositions tailored to your headcount and vision.
          </p>
        </div>

        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="max-w-2xl mx-auto border border-champagne p-12 bg-cream shadow-2xl text-center animate-fade-in">
            <div className="w-16 h-16 border border-champagne flex items-center justify-center mx-auto mb-6 text-2xl text-champagne">
              ✓
            </div>
            <h3 className="font-serif text-3xl font-light mb-4">Inquiry Received</h3>
            <p className="text-charcoal/70 text-sm md:text-base mb-8 max-w-md mx-auto">
              Your gourmet event itinerary has been sent to our concierge desk. A culinary consultant will review your specifications and contact you within 2 hours.
            </p>
            <div className="bg-charcoal/5 p-6 border-l-2 border-champagne mb-8 text-left text-xs space-y-2">
              <p><strong>Lead Event Planner:</strong> Aura Concierge Desk</p>
              <p><strong>Proposed Date:</strong> {formData.date}</p>
              <p><strong>Event Profile:</strong> {getSelectedEventLabel()} for {formData.guestCount} guests</p>
              <p><strong>Catering Format:</strong> {getSelectedServiceLabel()}</p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                setFormData({
                  eventType: 'gala',
                  guestCount: 50,
                  serviceType: 'plated',
                  staffing: ['chef', 'mixologist'],
                  name: '',
                  email: '',
                  date: '',
                  notes: '',
                });
              }}
              className="px-8 py-3 bg-champagne hover:bg-muted-gold text-cream uppercase tracking-[0.2em] font-sans text-xs font-semibold"
            >
              Configure Another Event
            </button>
          </div>
        ) : (
          /* MULTI-STEP PLANNER FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-cream border border-champagne/15 shadow-2xl">
            {/* Left Column: Live Itinerary Summary */}
            <div className="lg:col-span-4 bg-charcoal text-cream p-8 md:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-champagne font-bold block mb-4">
                  Itinerary Blueprint
                </span>
                <h3 className="font-serif text-3xl font-light mb-8 tracking-wide">
                  Your Event Estimate
                </h3>

                <div className="space-y-6 text-xs text-cream/70 font-sans tracking-wide">
                  <div className="pb-4 border-b border-cream/10">
                    <p className="text-champagne text-[9px] uppercase tracking-[0.2em] mb-1">Event Service</p>
                    <p className="text-sm font-serif font-light text-cream">{getSelectedEventLabel()}</p>
                  </div>
                  <div className="pb-4 border-b border-cream/10">
                    <p className="text-champagne text-[9px] uppercase tracking-[0.2em] mb-1">Guests &amp; Format</p>
                    <p className="text-sm font-serif font-light text-cream">
                      {formData.guestCount} guests &bull; {getSelectedServiceLabel().split(' ')[0]}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-cream/10">
                    <p className="text-champagne text-[9px] uppercase tracking-[0.2em] mb-1">Concierge Staffing</p>
                    <p className="text-sm font-serif font-light text-cream">
                      {formData.staffing.length > 0 ? getSelectedStaffLabels() : 'No staff selected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic status quote */}
              <div className="mt-12 pt-6 border-t border-cream/10 text-[10px] uppercase tracking-[0.25em] text-champagne font-semibold font-sans">
                ✦ concierges standing by
              </div>
            </div>

            {/* Right Column: Steps Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between">
              
              {/* Top Step Indicators */}
              <div className="flex justify-between items-center mb-12">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center flex-1 last:flex-initial">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        step === s
                          ? 'border-champagne bg-champagne text-cream'
                          : step > s
                          ? 'border-champagne/40 bg-champagne/10 text-champagne'
                          : 'border-charcoal/20 text-charcoal/40'
                      }`}
                    >
                      {s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`h-[1px] flex-1 mx-4 transition-all duration-500 ${
                          step > s ? 'bg-champagne' : 'bg-charcoal/10'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Active Step Panel */}
              <div className="min-h-[250px] mb-8">
                
                {/* STEP 1: EVENT DETAILS */}
                {step === 1 && (
                  <div className="animate-fade-in">
                    <h4 className="font-serif text-2xl font-light text-charcoal mb-6">
                      Step 1: Choose Your Event Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {EVENT_TYPES.map((e) => (
                        <button
                          type="button"
                          key={e.id}
                          onClick={() => updateField('eventType', e.id)}
                          className={`p-5 text-left border flex items-center space-x-4 transition-all duration-300 rounded-none ${
                            formData.eventType === e.id
                              ? 'border-champagne bg-champagne/5 shadow-md'
                              : 'border-charcoal/10 hover:border-champagne/30'
                          }`}
                        >
                          <span className="text-2xl">{e.icon}</span>
                          <span className="font-sans text-xs md:text-sm uppercase tracking-widest font-semibold">
                            {e.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: GUEST COUNT & STYLE */}
                {step === 2 && (
                  <div className="animate-fade-in space-y-8">
                    <div>
                      <h4 className="font-serif text-2xl font-light text-charcoal mb-6">
                        Step 2: Guest Count &amp; Culinary Style
                      </h4>
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-sans text-xs uppercase tracking-widest text-charcoal/70">
                          Headcount / Guest Count
                        </label>
                        <span className="font-serif text-2xl text-champagne font-semibold">
                          {formData.guestCount} guests
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="5"
                        value={formData.guestCount}
                        onChange={(e) => updateField('guestCount', parseInt(e.target.value))}
                        className="w-full h-1 bg-charcoal/10 rounded-lg appearance-none cursor-pointer accent-champagne"
                      />
                      <div className="flex justify-between text-[10px] uppercase text-charcoal/40 mt-1 font-sans">
                        <span>10 Guests</span>
                        <span>250 Guests</span>
                        <span>500+ Guests</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-charcoal/5">
                      <label className="font-sans text-xs uppercase tracking-widest text-charcoal/70 block mb-2">
                        Serving &amp; Culinary Format
                      </label>
                      {SERVICE_TYPES.map((s) => (
                        <label
                          key={s.id}
                          className={`flex items-center space-x-3 p-4 border cursor-pointer transition-all duration-300 ${
                            formData.serviceType === s.id
                              ? 'border-champagne bg-champagne/5'
                              : 'border-charcoal/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="serviceType"
                            checked={formData.serviceType === s.id}
                            onChange={() => updateField('serviceType', s.id)}
                            className="accent-champagne"
                          />
                          <span className="font-sans text-xs md:text-sm tracking-wide text-charcoal">
                            {s.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: STAFFING NEEDS */}
                {step === 3 && (
                  <div className="animate-fade-in">
                    <h4 className="font-serif text-2xl font-light text-charcoal mb-4">
                      Step 3: Elite Service Staffing
                    </h4>
                    <p className="text-charcoal/60 text-xs md:text-sm font-sans mb-6">
                      Add Michelin-trained hospitality specialists to execute your menu flawlessly. Select as many roles as your concept requires.
                    </p>
                    <div className="space-y-3">
                      {STAFF_ROLES.map((role) => {
                        const isChecked = formData.staffing.includes(role.id);
                        return (
                          <label
                            key={role.id}
                            className={`flex items-center justify-between p-4 border cursor-pointer transition-all duration-300 ${
                              isChecked ? 'border-champagne bg-champagne/5' : 'border-charcoal/10'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleStaffingToggle(role.id)}
                                className="accent-champagne"
                              />
                              <span className="font-sans text-xs md:text-sm tracking-wide text-charcoal">
                                {role.label}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-champagne/80">
                              concierge staff
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: CONTACT & SUBMISSION */}
                {step === 4 && (
                  <div className="animate-fade-in space-y-6">
                    <h4 className="font-serif text-2xl font-light text-charcoal mb-4">
                      Step 4: Contact &amp; Schedule
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-[10px] uppercase tracking-widest text-charcoal/70 block mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="e.g. Charlotte Astley"
                          className="w-full p-3 border border-charcoal/15 bg-transparent focus:outline-none focus:border-champagne text-sm"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-[10px] uppercase tracking-widest text-charcoal/70 block mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="e.g. charlotte@estate.com"
                          className="w-full p-3 border border-charcoal/15 bg-transparent focus:outline-none focus:border-champagne text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-[10px] uppercase tracking-widest text-charcoal/70 block mb-2">
                        Event Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        className="w-full p-3 border border-charcoal/15 bg-transparent focus:outline-none focus:border-champagne text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[10px] uppercase tracking-widest text-charcoal/70 block mb-2">
                        Additional Concierge Notes (Optional)
                      </label>
                      <textarea
                        rows="2"
                        value={formData.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="Detail dietary wishes or specific mixology inspirations..."
                        className="w-full p-3 border border-charcoal/15 bg-transparent focus:outline-none focus:border-champagne text-sm"
                      ></textarea>
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-charcoal/10 font-sans text-xs uppercase tracking-[0.2em] font-semibold">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`px-4 py-2 border border-charcoal/20 transition-all ${
                    step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-charcoal hover:bg-charcoal/5'
                  }`}
                >
                  &larr; Back
                </button>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3.5 bg-charcoal text-cream hover:bg-champagne transition-all"
                  >
                    Next Step &rarr;
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!validateStep()}
                    className={`px-6 py-3.5 bg-champagne text-cream transition-all ${
                      !validateStep() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted-gold'
                    }`}
                  >
                    ✦ Submit Inquiry
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
}
