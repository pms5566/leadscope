import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Configurator from './components/Configurator';
import SpecsTable from './components/SpecsTable';
import Support from './components/Support';
import FinanceCalculator from './components/FinanceCalculator';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-steel-gray min-h-screen flex flex-col justify-between selection:bg-copper selection:text-white">
      {/* Navigation header */}
      <Navbar />

      <main className="flex-grow">
        {/* B2B Hero */}
        <Hero />

        {/* Dynamic Configurator */}
        <Configurator />

        {/* Specs Table */}
        <SpecsTable />

        {/* Service Dispatch Contracts */}
        <Support />

        {/* SilverChef Leasing Calculator */}
        <FinanceCalculator />
      </main>

      {/* B2B Footer */}
      <Footer />
    </div>
  );
}
