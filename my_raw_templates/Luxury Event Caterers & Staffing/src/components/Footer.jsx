import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream pt-20 pb-12 border-t border-champagne/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo Brand Info */}
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-light tracking-[0.25em] text-cream block mb-2">
              AURA &amp; EPICURE
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-champagne block mb-6">
              Luxury Catering &amp; Staffing
            </span>
            <p className="text-cream/50 text-xs md:text-sm font-sans tracking-wide leading-relaxed max-w-sm mb-6">
              Orchestrating bespoke fine dining and silver-service staffing solutions for grand events, private estates, and luxury marine charters.
            </p>
            {/* Certifications */}
            <div className="flex gap-4 items-center">
              <div className="border border-champagne/20 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-champagne">
                ★ Food Hygiene Rating 5
              </div>
              <div className="border border-champagne/20 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-champagne">
                ★ ISO 9001 Certified
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-champagne font-bold mb-6">
              Concierge Desk
            </h4>
            <ul className="space-y-4 text-xs font-sans text-cream/70 tracking-widest">
              <li>
                <span className="block text-cream/40 text-[9px] uppercase tracking-[0.2em] mb-0.5">inquires</span>
                concierge@auraepicure.com
              </li>
              <li>
                <span className="block text-cream/40 text-[9px] uppercase tracking-[0.2em] mb-0.5">direct line</span>
                +1 (800) 555-AURA
              </li>
              <li>
                <span className="block text-cream/40 text-[9px] uppercase tracking-[0.2em] mb-0.5">headquarters</span>
                42 Park Lane, Mayfair, London
              </li>
            </ul>
          </div>

          {/* Venue Partners */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-champagne font-bold mb-6">
              Venue Partners
            </h4>
            <ul className="space-y-2 text-xs font-sans text-cream/60 tracking-wider">
              <li className="hover:text-champagne transition-colors duration-300">✦ Somerset House Pavilions</li>
              <li className="hover:text-champagne transition-colors duration-300">✦ The Royal Botanical Glasshouses</li>
              <li className="hover:text-champagne transition-colors duration-300">✦ Mayfair Private Hall</li>
              <li className="hover:text-champagne transition-colors duration-300">✦ Port of Monaco Yacht Club</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] text-cream/40 font-sans">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Aura &amp; Epicure. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-champagne transition-colors duration-300">instagram</a>
            <a href="#" className="hover:text-champagne transition-colors duration-300">linkedin</a>
            <a href="#" className="hover:text-champagne transition-colors duration-300">vimeo</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
