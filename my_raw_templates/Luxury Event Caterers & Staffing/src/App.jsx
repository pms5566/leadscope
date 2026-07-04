import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Standards from './components/Standards';
import ConciergeForm from './components/ConciergeForm';
import CaseStudies from './components/CaseStudies';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-cream min-h-screen flex flex-col justify-between selection:bg-champagne selection:text-cream">
      {/* Navigation bar */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero split section */}
        <Hero />

        {/* Interactive Menu Gallery */}
        <Gallery />

        {/* Service Staffing Standards & Spotlight */}
        <Standards />

        {/* Experiences & Testimonials Showcase */}
        <CaseStudies />

        {/* Digital Concierge interactive event planner */}
        <ConciergeForm />
      </main>

      {/* Luxury footer */}
      <Footer />
    </div>
  );
}
