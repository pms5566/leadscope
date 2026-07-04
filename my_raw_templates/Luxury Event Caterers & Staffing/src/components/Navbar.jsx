import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
          isScrolled || isMobileMenuOpen
            ? 'glassmorphism py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
            className="cursor-pointer group flex flex-col z-50"
          >
            <span className="font-serif text-lg md:text-2xl font-light tracking-[0.2em] text-charcoal transition-colors group-hover:text-champagne">
              AURA &amp; EPICURE
            </span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-champagne/80 font-sans -mt-1 pl-0.5">
              Luxury Catering &amp; Staffing
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-10 text-xs uppercase tracking-[0.25em] font-sans font-medium">
            <button
              onClick={() => scrollToSection('philosophy')}
              className="text-charcoal/80 hover:text-champagne transition-colors duration-300 cursor-pointer"
            >
              Philosophy
            </button>
            <button
              onClick={() => scrollToSection('menus')}
              className="text-charcoal/80 hover:text-champagne transition-colors duration-300 cursor-pointer"
            >
              Menus
            </button>
            <button
              onClick={() => scrollToSection('staffing')}
              className="text-charcoal/80 hover:text-champagne transition-colors duration-300 cursor-pointer"
            >
              Staffing
            </button>
            <button
              onClick={() => scrollToSection('experiences')}
              className="text-charcoal/80 hover:text-champagne transition-colors duration-300 cursor-pointer"
            >
              Experiences
            </button>
          </nav>

          {/* Right actions (Desktop CTA & Mobile Hamburger) */}
          <div className="flex items-center space-x-4 z-50">
            {/* Desktop Inquire Button */}
            <button
              onClick={() => scrollToSection('concierge')}
              className="hidden sm:inline-block px-6 py-2.5 border border-champagne text-charcoal hover:text-cream bg-transparent hover:bg-champagne transition-all duration-300 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-none cursor-pointer"
            >
              Inquire Now
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-charcoal hover:text-champagne focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <span
                  className={`w-full h-[1px] bg-current transition-all duration-300 origin-left ${
                    isMobileMenuOpen ? 'rotate-45 translate-x-1' : ''
                  }`}
                />
                <span
                  className={`w-full h-[1px] bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-[1px] bg-current transition-all duration-300 origin-left ${
                    isMobileMenuOpen ? '-rotate-45 translate-x-1' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-cream z-40 md:hidden flex flex-col justify-center items-center px-8 transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        <nav className="flex flex-col space-y-8 text-center text-sm uppercase tracking-[0.3em] font-sans font-medium text-charcoal">
          <button
            onClick={() => scrollToSection('philosophy')}
            className="hover:text-champagne transition-colors duration-300 text-lg cursor-pointer"
          >
            Philosophy
          </button>
          <button
            onClick={() => scrollToSection('menus')}
            className="hover:text-champagne transition-colors duration-300 text-lg cursor-pointer"
          >
            Menus
          </button>
          <button
            onClick={() => scrollToSection('staffing')}
            className="hover:text-champagne transition-colors duration-300 text-lg cursor-pointer"
          >
            Staffing
          </button>
          <button
            onClick={() => scrollToSection('experiences')}
            className="hover:text-champagne transition-colors duration-300 text-lg cursor-pointer"
          >
            Experiences
          </button>
          
          <button
            onClick={() => scrollToSection('concierge')}
            className="mt-8 px-8 py-3.5 border border-champagne text-charcoal hover:text-cream bg-transparent hover:bg-champagne transition-all duration-300 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-none cursor-pointer"
          >
            Inquire Now
          </button>
        </nav>

        {/* Decorative elements in mobile overlay */}
        <div className="absolute bottom-12 text-center text-[10px] uppercase tracking-[0.4em] text-champagne/80 font-sans">
          ✦ Aura &amp; Epicure ✦
        </div>
      </div>
    </>
  );
}
