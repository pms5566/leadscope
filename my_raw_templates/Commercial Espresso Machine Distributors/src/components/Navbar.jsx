import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled || isMobileMenuOpen ? 'glassmorphism-dark shadow-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        {/* Top Info Strip for B2B */}
        <div className={`max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-steel-gray/50 pb-2 mb-2 border-b border-steel-gray/5 transition-all duration-500 ${
          isScrolled ? 'opacity-0 h-0 overflow-hidden mb-0 pb-0' : 'opacity-100'
        }`}>
          <div>Commercial Espresso Distribution &bull; Australia-Wide</div>
          <div className="hidden sm:block">Showrooms: Melbourne &amp; Sydney</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Brand */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
            className="cursor-pointer group flex items-baseline space-x-2"
          >
            <span className="font-sans text-xl md:text-2xl font-bold tracking-tighter text-steel-gray group-hover:text-copper transition-colors">
              APEX
            </span>
            <span className="font-serif italic text-xs text-copper tracking-widest uppercase">
              Espresso
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-steel-gray/80">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-copper transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('configurator')}
              className="hover:text-copper transition-colors cursor-pointer"
            >
              Configurator
            </button>
            <button
              onClick={() => scrollToSection('specs')}
              className="hover:text-copper transition-colors cursor-pointer"
            >
              Specifications
            </button>
            <button
              onClick={() => scrollToSection('support')}
              className="hover:text-copper transition-colors cursor-pointer"
            >
              Support
            </button>
            <button
              onClick={() => scrollToSection('calculator')}
              className="hover:text-copper transition-colors cursor-pointer"
            >
              Finance
            </button>
          </nav>

          {/* Actions & Hotline */}
          <div className="flex items-center space-x-6 z-50">
            {/* Hotline banner */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[9px] uppercase tracking-widest text-steel-gray/40">24/7 Dispatch Desk</span>
              <a href="tel:1300273943" className="text-xs font-mono font-bold text-copper hover:text-copper-dark transition-colors">
                1300-APEX-HELP
              </a>
            </div>

            {/* CTA Showroom */}
            <button
              onClick={() => scrollToSection('configurator')}
              className="hidden sm:inline-block px-5 py-2.5 bg-copper hover:bg-copper-dark text-steel-gray hover:text-white transition-all text-xs uppercase tracking-[0.15em] font-sans font-bold rounded-none cursor-pointer"
            >
              Book Showroom
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-steel-gray hover:text-copper focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <span className={`w-full h-[1px] bg-current transition-all duration-300 origin-left ${isMobileMenuOpen ? 'rotate-45 translate-x-1' : ''}`}></span>
                <span className={`w-full h-[1px] bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-[1px] bg-current transition-all duration-300 origin-left ${isMobileMenuOpen ? '-rotate-45 translate-x-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-0 bg-matte-black z-40 md:hidden flex flex-col justify-center items-center px-8 transition-all duration-500 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
      }`}>
        <nav className="flex flex-col space-y-8 text-center text-sm uppercase tracking-[0.25em] font-sans font-bold text-steel-gray">
          <button onClick={() => scrollToSection('hero')} className="hover:text-copper transition-colors cursor-pointer text-lg">Overview</button>
          <button onClick={() => scrollToSection('configurator')} className="hover:text-copper transition-colors cursor-pointer text-lg">Configurator</button>
          <button onClick={() => scrollToSection('specs')} className="hover:text-copper transition-colors cursor-pointer text-lg">Specifications</button>
          <button onClick={() => scrollToSection('support')} className="hover:text-copper transition-colors cursor-pointer text-lg">Support</button>
          <button onClick={() => scrollToSection('calculator')} className="hover:text-copper transition-colors cursor-pointer text-lg">Finance Calculator</button>
          
          <div className="pt-8 flex flex-col items-center border-t border-steel-gray/10">
            <span className="text-[9px] uppercase tracking-widest text-steel-gray/40 mb-1">24/7 Dispatch Desk</span>
            <a href="tel:1300273943" className="text-sm font-mono font-bold text-copper">1300-APEX-HELP</a>
          </div>

          <button onClick={() => scrollToSection('configurator')} className="mt-8 px-8 py-3.5 bg-copper hover:bg-copper-dark text-steel-gray hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-sans font-bold rounded-none cursor-pointer">
            Book Showroom
          </button>
        </nav>
      </div>
    </>
  );
}
