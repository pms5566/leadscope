import React, { useState } from 'react';

const MENU_CATEGORIES = [
  {
    id: 'canapes',
    title: 'Artisanal Canapés',
    subtitle: 'Exquisite bite-sized masterpieces',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop',
    tag: "Chef's Signature",
    items: [
      { name: 'Osetra Caviar Blinis', desc: 'Crème fraîche, delicate gold leaf infusion' },
      { name: 'Wagyu Beef Tartare', desc: 'Truffle aioli, toasted brioche shard' },
      { name: 'Lobster & Mango Spoons', desc: 'Kaffir lime dressing, micro cilantro' },
    ],
    badges: ['Locally Sourced', 'Sustainable Seafood']
  },
  {
    id: 'plated',
    title: 'Plated Gastronomy',
    subtitle: 'Michelin-inspired multi-course dining',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
    tag: 'Seasonal Harvest',
    items: [
      { name: 'Dry-Aged Duck Breast', desc: 'Spiced plum reduction, parsnip purée' },
      { name: 'Miso-Glazed Chilean Sea Bass', desc: 'Ginger-infused dashi, sea succulents' },
      { name: 'Perigord Truffle Gnocchi', desc: 'Wild chanterelles, aged parmigiano foam' },
    ],
    badges: ['100% Organic', 'Farm-to-Table']
  },
  {
    id: 'mixology',
    title: 'Curated Mixology',
    subtitle: 'Bespoke elixirs & sommelier pairings',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop',
    tag: 'Sommelier Choice',
    items: [
      { name: 'The Golden Saffron Elixir', desc: 'Champagne, botanical gin, saffron honey' },
      { name: 'Rosemary Smoked Old Fashioned', desc: 'Small-batch bourbon, aromatic bitters' },
      { name: 'Lavender & Pear Collins', desc: 'Cold-pressed pear nectar, organic soda' },
    ],
    badges: ['Bespoke Blends', 'Artisanal Bitters']
  }
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('canapes');

  return (
    <section id="menus" className="py-24 md:py-32 bg-cream text-charcoal border-b border-champagne/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-champagne font-semibold mb-3">
            Epicurean Collections
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide mb-6">
            Bespoke Culinary Menus
          </h2>
          <div className="h-[1px] w-20 bg-champagne mx-auto mb-6"></div>
          <p className="text-charcoal/70 text-sm md:text-base tracking-wide">
            Explore sample pairings crafted by Michelin-trained chefs. Every single menu is custom-designed around your event theme, dietary requirements, and seasonal availability.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center space-x-6 md:space-x-12 mb-16 border-b border-charcoal/10 pb-4 text-xs md:text-sm uppercase tracking-[0.25em] font-sans font-medium">
          {MENU_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`pb-4 transition-all duration-300 relative ${
                activeTab === category.id
                  ? 'text-champagne font-semibold'
                  : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              {category.title.split(' ')[1] || category.title}
              {activeTab === category.id && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-champagne animate-fade-in"></span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Interactive Showroom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left side: Showcase Card with Hover Details */}
          {MENU_CATEGORIES.map((cat) => {
            if (cat.id !== activeTab) return null;
            return (
              <React.Fragment key={cat.id}>
                <div className="lg:col-span-6 group relative h-[450px] overflow-hidden shadow-xl border border-champagne/10">
                  {/* Category Image */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Static Details */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 bg-champagne text-cream text-[10px] uppercase tracking-[0.2em] font-medium">
                      {cat.tag}
                    </span>
                  </div>

                  {/* Hover Reveal Card Container */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end">
                    <h3 className="font-serif text-3xl text-cream font-light mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-cream/80 text-xs italic tracking-widest font-serif mb-4">
                      {cat.subtitle}
                    </p>

                    {/* Sliding Animation details */}
                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                      <div className="pt-4 border-t border-cream/20 flex flex-wrap gap-2">
                        {cat.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 border border-champagne text-champagne text-[9px] uppercase tracking-[0.2em] font-sans"
                          >
                            ✦ {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Detailed Items Menu */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:pl-6">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-charcoal/10 pb-6 group hover:border-champagne/45 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-serif text-lg md:text-xl font-light text-charcoal group-hover:text-champagne transition-colors duration-300">
                          {item.name}
                        </h4>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-sans">
                          concierge menu
                        </span>
                      </div>
                      <p className="text-charcoal/60 text-xs md:text-sm font-sans tracking-wide">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                  
                  {/* Dietary Note */}
                  <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/45 italic pt-4">
                    * Vegetarian, Vegan, and Gluten-Free alternatives curated on request.
                  </p>
                </div>
              </React.Fragment>
            );
          })}

        </div>

      </div>
    </section>
  );
}
