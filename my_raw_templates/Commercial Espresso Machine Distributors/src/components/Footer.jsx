import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-matte-black text-steel-gray pt-20 pb-12 border-t border-steel-gray/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Compliance Badges */}
          <div className="md:col-span-2">
            <span className="font-sans text-2xl font-bold tracking-tighter text-white block mb-2">
              APEX
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-copper block mb-6 font-serif italic">
              Espresso Distributors
            </span>
            <p className="text-steel-gray/50 text-xs md:text-sm font-sans tracking-wide leading-relaxed max-w-sm mb-6">
              Supplier of heavy-duty commercial multi-boiler espresso machines, serving Australia's leading specialty roasters and high-volume cafes.
            </p>
            {/* Certifications and Compliance */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="border border-steel-gray/20 px-3 py-1.5 text-[8px] uppercase tracking-widest text-copper font-bold">
                ★ WaterMark Certified
              </div>
              <div className="border border-steel-gray/20 px-3 py-1.5 text-[8px] uppercase tracking-widest text-copper font-bold">
                ★ AS/NZS 3820 Compliance
              </div>
            </div>
          </div>

          {/* Showroom Addresses */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-copper font-bold mb-6">
              Our Showrooms
            </h4>
            <ul className="space-y-4 text-xs font-sans text-steel-gray/60 tracking-wider">
              <li>
                <span className="block text-white text-[9px] uppercase tracking-[0.2em] mb-0.5">Melbourne HQ</span>
                128 Royston St, Carlton VIC 3053
              </li>
              <li>
                <span className="block text-white text-[9px] uppercase tracking-[0.2em] mb-0.5">Sydney Office</span>
                45 Hutchinson St, Surry Hills NSW 2010
              </li>
            </ul>
          </div>

          {/* Portals & Links */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-copper font-bold mb-6">
              Trade Desk
            </h4>
            <ul className="space-y-3 text-xs font-sans text-steel-gray/60 tracking-wider">
              <li>
                <a href="#configurator" className="hover:text-copper transition-colors duration-300">✦ Roaster Portal Login</a>
              </li>
              <li>
                <a href="#specs" className="hover:text-copper transition-colors duration-300">✦ Plumbing Schematics (PDF)</a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-copper transition-colors duration-300">✦ SilverChef Financing Info</a>
              </li>
              <li>
                <a href="#support" className="hover:text-copper transition-colors duration-300">✦ SLA Service Contracts</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-steel-gray/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] text-steel-gray/30 font-sans">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Apex Espresso Distributors Pty Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-copper transition-colors duration-300">LinkedIn</a>
            <a href="#" className="hover:text-copper transition-colors duration-300">Instagram</a>
            <a href="#" className="hover:text-copper transition-colors duration-300">Vimeo</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
