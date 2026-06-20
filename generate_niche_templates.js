const fs = require('fs');
const path = require('path');

// Target directory for the raw templates
const outputDir = path.join('/Users/parmeetsingh/Desktop/AI Automation/my_raw_templates');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Full Database of 100 Niches with custom color palettes, font pairings, slogans, services, and Unsplash categories
const niches = [
  // ==================== HOME & TRADE SERVICES (20) ====================
  {
    id: "plumber",
    name: "Emergency Plumber",
    category: "Home & Trade Services",
    layout: "Layout_A", // Left-Aligned Split Hero
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0066cc", secondary: "#f0f7ff", accent: "#ff9900", neutral: "#1e293b" },
    slogan: "Fast, Reliable Plumbing Services Available 24/7",
    description: "Leaky pipes, clogged drains, or water heater failures? Our certified plumbers are on standby to resolve your plumbing emergencies in record time with zero hidden fees.",
    services: [
      { title: "Emergency Leak Repair", desc: "Rapid localization and repair of pipe bursts, leaks, and water line issues.", icon: "fa-droplet" },
      { title: "Drain Cleaning & Jetting", desc: "Clearing stubborn blockages using state-of-the-art hydro-jetting equipment.", icon: "fa-bore-hole" },
      { title: "Water Heater Installation", desc: "Expert setup of energy-efficient tankless and traditional water heaters.", icon: "fa-fire" }
    ],
    unsplashCategory: "plumbing",
    unsplashId: "photo-1584622650111-993a426fbf0a",
    cta: "Schedule Plumbing Service"
  },
  {
    id: "electrician",
    name: "Pro Electricians",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#d97706", secondary: "#fef3c7", accent: "#2563eb", neutral: "#0f172a" },
    slogan: "Safe, Licensed Electrical Solutions For Your Home",
    description: "From simple outlet replacements to complete home rewiring, our team of fully licensed technicians guarantees top-tier safety and craftsmanship.",
    services: [
      { title: "Panel Upgrades", desc: "Modernize your service panel to handle high-capacity modern appliances safely.", icon: "fa-bolt-lightning" },
      { title: "Smart Home Installation", desc: "Integration of smart switches, smart lighting systems, and automation hubs.", icon: "fa-house-laptop" },
      { title: "Troubleshooting & Repairs", desc: "Diagnostics and resolution of flickering lights, dead outlets, and short circuits.", icon: "fa-wrench" }
    ],
    unsplashCategory: "electrical",
    unsplashId: "photo-1621905252507-b354bc25edac",
    cta: "Request Service Call"
  },
  {
    id: "hvac",
    name: "AirFlow HVAC Services",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0891b2", secondary: "#ecfeff", accent: "#ea580c", neutral: "#1e293b" },
    slogan: "Keep Your Home Comfortable All Year Round",
    description: "Don't sweat the heat or freeze in the cold. Our highly responsive HVAC specialists provide prompt air conditioning and heating tune-ups, installations, and repairs.",
    services: [
      { title: "AC Repair & Tune-Up", desc: "Keep your cooling system running at peak performance during scorching summer days.", icon: "fa-snowflake" },
      { title: "Furnace Installation", desc: "Professional heating system upgrades to keep your home warm and cozy.", icon: "fa-temperature-high" },
      { title: "Duct & Filter Cleaning", desc: "Breathe clean air and improve your system's efficiency with complete duct cleanings.", icon: "fa-wind" }
    ],
    unsplashCategory: "hvac",
    unsplashId: "photo-1504307651254-35680f356dfd",
    cta: "Book HVAC Service"
  },
  {
    id: "roofing",
    name: "Apex Roofing Specialists",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#475569", secondary: "#f1f5f9", accent: "#e2e8f0", neutral: "#0f172a" },
    slogan: "Durable Roofs Built to Protect Your Family",
    description: "Protect your primary investment with commercial-grade roofing materials, professional installations, and comprehensive warranty coverage.",
    services: [
      { title: "Residential Roof Replacement", desc: "Complete architectural shingle or metal roof installations that last decades.", icon: "fa-house-chimney" },
      { title: "Roof Inspection & Repair", desc: "Fixing storm damage, wind loss, leaky flashing, and replacing broken tiles.", icon: "fa-magnifying-glass" },
      { title: "Commercial Roof Coating", desc: "High-grade weather protective sealants to extend the life of flat roofs.", icon: "fa-shield-halved" }
    ],
    unsplashCategory: "roofing",
    unsplashId: "photo-1632759162403-f1a671152448",
    cta: "Get Free Roof Estimate"
  },
  {
    id: "towing",
    name: "QuickTow 24/7 Roadside",
    category: "Home & Trade Services",
    layout: "Layout_D", // Dark-Mode Accentuated
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black italic", bodyClass: "font-sans" },
    colors: { primary: "#dc2626", secondary: "#1e1e1e", accent: "#f59e0b", neutral: "#121212" },
    slogan: "Stranded? We'll Be There in Under 30 Minutes!",
    description: "Flat tire, dead battery, or major engine breakdown? Our heavy-duty towing fleet and responsive roadside assistance teams are active 24/7 to rescue you.",
    services: [
      { title: "Flatbed Towing", desc: "Safe, damage-free transport for exotic, luxury, and standard vehicles.", icon: "fa-truck-ramp-box" },
      { title: "Battery Jumpstart & Fuel Delivery", desc: "Get back on the road quickly with emergency power boosts and gas deliveries.", icon: "fa-car-battery" },
      { title: "Accident Recovery & Winching", desc: "Retrieval services from ditches, snow banks, or collision scenes.", icon: "fa-truck-monster" }
    ],
    unsplashCategory: "towing",
    unsplashId: "photo-1568605117036-5fe5e7bab0b7",
    cta: "Dispatch Towing Now"
  },
  {
    id: "painter",
    name: "FreshCoat Painters",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#4f46e5", secondary: "#e0e7ff", accent: "#ec4899", neutral: "#1e293b" },
    slogan: "Revitalize Your Home With Expert Painting Services",
    description: "From custom accent walls to complete exterior painting, our team delivers seamless coatings, clean borders, and premium paint finishes that protect and beautify your property.",
    services: [
      { title: "Interior House Painting", desc: "Professional painting of walls, ceilings, trim, and doors with zero messes.", icon: "fa-paint-roller" },
      { title: "Exterior Wood Protection", desc: "Weatherproof coatings that shield siding, brick, and stucco from weather wear.", icon: "fa-brush" },
      { title: "Cabinet Refinishing", desc: "Transform your kitchen cabinets with professional spray-paint finishes.", icon: "fa-kitchen-set" }
    ],
    unsplashCategory: "painting",
    unsplashId: "photo-1562259949-e8e7689d7828",
    cta: "Get Painting Quote"
  },
  {
    id: "landscaper",
    name: "Eden Lawn & Landscape",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#15803d", secondary: "#f0fdf4", accent: "#eab308", neutral: "#0f172a" },
    slogan: "Crafting Stunning Outdoor Spaces You'll Love",
    description: "Transform your outdoor property into a beautiful, functional sanctuary. We provide custom garden design, hardscaping, lawn maintenance, and irrigation systems.",
    services: [
      { title: "Lawn Care & Maintenance", desc: "Regular mowing, edging, fertilization, and weed control services.", icon: "fa-seedling" },
      { title: "Hardscape & Patio Construction", desc: "Installation of custom stone patios, retaining walls, and walkways.", icon: "fa-trowel-bricks" },
      { title: "Irrigation System Installation", desc: "Smart sprinkler setups to keep your lawn lush while saving water.", icon: "fa-faucet" }
    ],
    unsplashCategory: "landscaping",
    unsplashId: "photo-1558904541-efa8c3a30fc9",
    cta: "Design Your Garden"
  },
  {
    id: "locksmith",
    name: "SafeGuard Locksmiths",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0f172a", secondary: "#f1f5f9", accent: "#f59e0b", neutral: "#0f172a" },
    slogan: "24/7 Professional Lock & Key Security Services",
    description: "Locked out of your home, office, or car? Our mobile security technicians respond in minutes to resolve lockouts, replace keys, and upgrade lock systems.",
    services: [
      { title: "Emergency Lockout Relief", desc: "Non-destructive door entry for residential and vehicle lockouts.", icon: "fa-key" },
      { title: "Smart Lock Installation", desc: "Installation of keyless smart locks, keypads, and card access controls.", icon: "fa-lock" },
      { title: "Key Duplication & Rekeying", desc: "Changing lock pins to render old lost keys useless instantly.", icon: "fa-key-skeleton" }
    ],
    unsplashCategory: "locksmith",
    unsplashId: "photo-1510519138101-570d1dca3d66",
    cta: "Call Locksmith Now"
  },
  {
    id: "pest-control",
    name: "PestX Outbreak Control",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#e11d48", neutral: "#1e293b" },
    slogan: "Keep Your Home Clean and Pest-Free",
    description: "Say goodbye to unwanted guests. We offer fully licensed, pet-safe pest management solutions to eliminate ants, rodents, termites, and bugs permanently.",
    services: [
      { title: "Residential Pest Control", desc: "Regular seasonal inspections and protective barriers around your home.", icon: "fa-bug" },
      { title: "Termite Defense", desc: "Advanced soil treatments and baiting stations to halt structural damage.", icon: "fa-shield-virus" },
      { title: "Rodent Exclusion", desc: "Sealing entries and removing mice/rats securely with pet-safe methods.", icon: "fa-ban" }
    ],
    unsplashCategory: "pest control",
    unsplashId: "photo-1587334206506-6966f007ee23",
    cta: "Request Inspection"
  },
  {
    id: "handyman",
    name: "Reliable Handyman Services",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#ea580c", secondary: "#fff7ed", accent: "#2563eb", neutral: "#1e293b" },
    slogan: "Your Local Home Repairs & Assembly Expert",
    description: "Need help tackling your honey-do list? We take care of home repairs, furniture assembly, TV mounting, and property maintenance with professional quality.",
    services: [
      { title: "TV Mounting & Shelving", desc: "Clean wall installations with concealed cables and sturdy brackets.", icon: "fa-tv" },
      { title: "Furniture Assembly", desc: "Prompt assembly of flat-pack furniture, exercise machines, and playsets.", icon: "fa-cubes" },
      { title: "Minor Plumbing & Electrical", desc: "Fixing leaky faucets, changing light fixtures, and installing ceiling fans.", icon: "fa-screwdriver" }
    ],
    unsplashCategory: "handyman",
    unsplashId: "photo-1504307651254-35680f356dfd",
    cta: "Hire A Handyman"
  },
  {
    id: "cleaning",
    name: "Sparkle Clean Services",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Outfit", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#fb7185", neutral: "#1e293b" },
    slogan: "Professional Home & Office Cleaning Made Simple",
    description: "Sit back and relax while our fully vetted cleaning professionals make your home sparkle. We offer deep cleaning, recurring maids, and move-out specials.",
    services: [
      { title: "Standard House Keeping", desc: "Scheduled dust-down, vacuuming, mopping, and bathroom cleaning services.", icon: "fa-sparkles" },
      { title: "Deep Cleaning Specials", desc: "Rigorous cleaning of baseboards, behind appliances, and detailing rooms.", icon: "fa-soap" },
      { title: "Move-In / Move-Out Clean", desc: "Preparing empty properties for new tenants with pristine detailing.", icon: "fa-house-circle-check" }
    ],
    unsplashCategory: "cleaning",
    unsplashId: "photo-1581578731548-c64695cc6952",
    cta: "Book Cleaners Online"
  },
  {
    id: "deck-builder",
    name: "Apex Deck Construction",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#78350f", secondary: "#fffbeb", accent: "#d97706", neutral: "#1e293b" },
    slogan: "Custom Outdoor Decks & Pergolas Built to Last",
    description: "Expand your outdoor living space with premium wood and composite decks built by expert carpenters with structural guarantees.",
    services: [
      { title: "Custom Deck Design", desc: "Tailor-made multi-level decks optimized for your yard layout.", icon: "fa-compass-drafting" },
      { title: "Composite Wood Upgrades", desc: "Ultra-low-maintenance composite decks that never splinter or fade.", icon: "fa-tree" },
      { title: "Pergolas & Outdoor Coverings", desc: "Adding shade structures and pergolas to block direct sun heat.", icon: "fa-campground" }
    ],
    unsplashCategory: "patio deck",
    unsplashId: "photo-1590790302251-24b51909a3de",
    cta: "Schedule Deck Consultation"
  },
  {
    id: "excavator",
    name: "IronDig Excavation Services",
    category: "Home & Trade Services",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-extrabold uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#eab308", secondary: "#1e1b4b", accent: "#ffffff", neutral: "#0b0f19" },
    slogan: "Professional Site Preparation & Earthmoving",
    description: "Providing heavy machinery operations, trenching, grading, and foundation excavations for residential and commercial builders.",
    services: [
      { title: "Site Grading & Clearing", desc: "Removing debris and leveling terrain for building construction.", icon: "fa-mountain" },
      { title: "Foundation Digging", desc: "Precise basement and foundation trenching utilizing GPS controls.", icon: "fa-square-check" },
      { title: "Utility Trenching", desc: "Digging secure lines for electrical conduits, gas pipelines, and sewer runs.", icon: "fa-pipe-valve" }
    ],
    unsplashCategory: "excavator",
    unsplashId: "photo-1579684385127-1ef15d508118",
    cta: "Request Equipment Bid"
  },
  {
    id: "drywaller",
    name: "Apex Drywall & Plaster",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#4b5563", secondary: "#f9fafb", accent: "#ea580c", neutral: "#111827" },
    slogan: "Flawless Drywall Repair & Texture Matching",
    description: "Tired of looking at water stains, drywall cracks, or holes? Our expert hangers and finishers leave your walls smooth and ready for paint.",
    services: [
      { title: "Drywall Repair & Patching", desc: "Seamless patching of holes, door-handle dings, and water cracks.", icon: "fa-circle-dot" },
      { title: "Plaster & Mud Finishing", desc: "High-grade taping and mudding to achieve Level 5 smooth finishes.", icon: "fa-paint-roller" },
      { title: "Texture Application", desc: "Matching orange peel, knock-down, or popcorn ceiling styles.", icon: "fa-wand-magic-sparkles" }
    ],
    unsplashCategory: "drywall repair",
    unsplashId: "photo-1504307651254-35680f356dfd",
    cta: "Request Drywall Bid"
  },
  {
    id: "concrete",
    name: "SolidStone Concrete Co.",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-black uppercase", bodyClass: "font-sans" },
    colors: { primary: "#374151", secondary: "#f3f4f6", accent: "#f59e0b", neutral: "#111827" },
    slogan: "Durable Patios, Driveways, & Foundations",
    description: "Providing residential and commercial concrete pours, decorative stamping, and structural concrete repairs built to hold.",
    services: [
      { title: "Concrete Driveways", desc: "High-load concrete driveways reinforced with rebar for long life.", icon: "fa-road" },
      { title: "Stamped & Colored Patios", desc: "Transform slate and stone patios with beautiful texturized patterns.", icon: "fa-border-all" },
      { title: "Foundation Slab Pours", desc: "Precisely level concrete slabs for home extensions and garages.", icon: "fa-square-check" }
    ],
    unsplashCategory: "concrete",
    unsplashId: "photo-1590069261209-f8e9b8642343",
    cta: "Request Concrete Estimate"
  },
  {
    id: "solar-installer",
    name: "Helios Solar Systems",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Outfit", body: "Inter", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#0f766e", secondary: "#f0fdfa", accent: "#eab308", neutral: "#0f172a" },
    slogan: "Power Your Home With Clean Solar Energy",
    description: "Slash your utility bills and protect your household from power outages. We provide premium Tier-1 solar panel setups and backup batteries.",
    services: [
      { title: "Solar Panel Installation", desc: "Maximum sunlight-capture panel designs custom-fit to your roof style.", icon: "fa-solar-panel" },
      { title: "Battery Backups (Powerwall)", desc: "Store clean power to secure your home from blackouts and grid failures.", icon: "fa-battery-full" },
      { title: "Solar System Tune-Ups", desc: "Cleaning, efficiency audits, and inverter upgrades for existing setups.", icon: "fa-screwdriver-wrench" }
    ],
    unsplashCategory: "solar panels",
    unsplashId: "photo-1509391366360-2e959784a276",
    cta: "Get Solar Savings Guide"
  },
  {
    id: "appliance-repair",
    name: "FastFix Appliance Pros",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#2563eb", secondary: "#eff6ff", accent: "#ea580c", neutral: "#1e293b" },
    slogan: "Quick Repair For Refrigerators, Washers & Ovens",
    description: "Broken appliance disrupting your household? Our appliance repair technicians service all major brands in a single visit with parts warranties.",
    services: [
      { title: "Refrigerator Repair", desc: "Fixing cooling loss, ice maker leaks, and broken compressors.", icon: "fa-refrigerator" },
      { title: "Washer & Dryer Fixes", desc: "Resolving drum spin issues, drainage failure, and heater problems.", icon: "fa-soap" },
      { title: "Stove & Oven Calibration", desc: "Repairing electric burners, gas igniters, and temperature control valves.", icon: "fa-fire" }
    ],
    unsplashCategory: "washing machine",
    unsplashId: "photo-1621905252507-b354bc25edac",
    cta: "Book Appliance Repair"
  },
  {
    id: "garage-door",
    name: "Apex Garage Door Solutions",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e3a8a", secondary: "#eff6ff", accent: "#d97706", neutral: "#0f172a" },
    slogan: "Reliable Repairs For Broken Springs & Openers",
    description: "Is your garage door stuck, noisy, or damaged? We specialize in emergency spring replacements, opener installations, and track repairs.",
    services: [
      { title: "Torsion Spring Replacement", desc: "Replacing dangerous, high-tension broken springs with heavy-duty steel options.", icon: "fa-spiral-spring" },
      { title: "Smart Opener Setup", desc: "Installing ultra-quiet belt-drive openers equipped with phone controls.", icon: "fa-house-signal" },
      { title: "Door Off-Track Repair", desc: "Realignment of wheels and safety rails to guarantee smooth door travel.", icon: "fa-arrows-left-right" }
    ],
    unsplashCategory: "garage door",
    unsplashId: "photo-1558036117-15d82a90b9b1",
    cta: "Schedule Door Service"
  },
  {
    id: "carpet-cleaner",
    name: "EcoFresh Carpet Cleaners",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Outfit", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0369a1", secondary: "#f0f9ff", accent: "#10b981", neutral: "#1e293b" },
    slogan: "Restore Your Carpets & Rugs to Like-New Condition",
    description: "Deep hot-water steam extraction cleaning that removes stains, eliminates odors, and kills allergens using eco-friendly, child-safe formulas.",
    services: [
      { title: "Hot Water Steam Extraction", desc: "High-pressure sanitizing cleaning that flushes deep dirt from fibers.", icon: "fa-shower" },
      { title: "Pet Stain & Odor Removal", desc: "Neutralization of urine odors and deep stains using enzyme treatments.", icon: "fa-paw" },
      { title: "Upholstery & Sofa Cleaning", desc: "Delicate steam cleaning to restore couches, armchairs, and mattresses.", icon: "fa-couch" }
    ],
    unsplashCategory: "carpet cleaning",
    unsplashId: "photo-1581578731548-c64695cc6952",
    cta: "Book Carpet Cleaning"
  },
  {
    id: "welder",
    name: "IronBound Welding Services",
    category: "Home & Trade Services",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black italic", bodyClass: "font-sans" },
    colors: { primary: "#ea580c", secondary: "#262626", accent: "#ffffff", neutral: "#0c0a09" },
    slogan: "Precision Mobile Welding & Custom Metalwork",
    description: "Providing certified structural welding, trailer repairs, and architectural metal fabrications. Equipped with fully mobile welding gear.",
    services: [
      { title: "Mobile Emergency Welding", desc: "On-site repair of heavy machinery, equipment frames, and pipe networks.", icon: "fa-fire-burner" },
      { title: "Structural Steel Fabrications", desc: "Rigorous welding of structural columns, beams, and fire escapes.", icon: "fa-building-columns" },
      { title: "Gate & Railing Custom Repairs", desc: "Decorative iron fence restorations, hinge repairs, and additions.", icon: "fa-shield-halved" }
    ],
    unsplashCategory: "welding",
    unsplashId: "photo-1504917595217-d4dc5ebe6122",
    cta: "Request Custom Quote"
  },

  // ==================== MEDICAL & WELLNESS (20) ====================
  {
    id: "dentist",
    name: "Zenith Dental Care",
    category: "Medical & Wellness",
    layout: "Layout_B", // Centered Minimalist Glassmorphic
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#14b8a6", neutral: "#0f172a" },
    slogan: "Gentle, State-of-the-Art Dental Care for Your Family",
    description: "Experience premium dental comfort. We offer standard checkups, dental implants, teeth whitening, and emergency treatment in a relaxing, anxiety-free clinic.",
    services: [
      { title: "Cosmetic Veneers & Whitening", desc: "Revitalize your smile with medical-grade bleaching and custom porcelain veneers.", icon: "fa-tooth" },
      { title: "Dental Implants", desc: "Restore missing teeth with premium dental implants that function like originals.", icon: "fa-circle-check" },
      { title: "Preventative Checkups", desc: "Thorough scaling, early cavities diagnosis, and protective sealants.", icon: "fa-hand-holding-heart" }
    ],
    unsplashCategory: "dental clinic",
    unsplashId: "photo-1629909613654-28e377c37b09",
    cta: "Schedule First Visit"
  },
  {
    id: "chiropractor",
    name: "SpineAlign Chiropractic",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0f766e", secondary: "#f0fdfa", accent: "#d97706", neutral: "#0f172a" },
    slogan: "Relieve Chronic Pain & Restore Your Mobility",
    description: "Get targeted relief from sciatica, neck pain, and headaches. Our personalized spinal adjustments help restore your body's natural alignment.",
    services: [
      { title: "Spinal Adjustments", desc: "Gentle manipulations to relieve pressure, realign disks, and boost movement.", icon: "fa-bone" },
      { title: "Sciatica & Herniation Relief", desc: "Therapeutic decompression to relieve severe lower back and leg pain.", icon: "fa-arrows-up-down" },
      { title: "Corrective Posture Plans", desc: "Strengthening exercises to resolve desk-job alignment fatigue.", icon: "fa-user-check" }
    ],
    unsplashCategory: "chiropractic",
    unsplashId: "photo-1579684385127-1ef15d508118",
    cta: "Book Pain Consultation"
  },
  {
    id: "physiotherapist",
    name: "Apex Physio & Rehab",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#1d4ed8", secondary: "#eff6ff", accent: "#ef4444", neutral: "#0f172a" },
    slogan: "Reclaim Your Active Lifestyle Without Pain",
    description: "Providing sports injury recovery, post-surgical rehabilitation, and targeted physical therapy designed to get you moving strongly.",
    services: [
      { title: "Sports Injury Rehab", desc: "Rapid recovery programs for ligament strains, joint tears, and tendonitis.", icon: "fa-person-running" },
      { title: "Manual Massage Therapy", desc: "Hands-on tissue work to resolve muscle tightness and pain trigger zones.", icon: "fa-hands" },
      { title: "Post-Op Restoration", desc: "Guided mobility recovery for joint replacements and bone surgeries.", icon: "fa-wheelchair" }
    ],
    unsplashCategory: "physiotherapy",
    unsplashId: "photo-1600334129128-685c5582fd35",
    cta: "Schedule Physiotherapy"
  },
  {
    id: "podiatrist",
    name: "Apex Foot & Ankle Care",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0369a1", secondary: "#f0f9ff", accent: "#0284c7", neutral: "#1e293b" },
    slogan: "Eliminate Foot Pain & Improve Your Gate",
    description: "Specializing in correcting bunions, heel spurs, ingrown toenails, and custom orthotics to keep you standing comfortably.",
    services: [
      { title: "Custom Foot Orthotics", desc: "Computer-molded insoles designed to restore balanced weight distribution.", icon: "fa-shoe-prints" },
      { title: "Ingrown Toenail Treatments", desc: "Fast, painless outpatient procedures to eliminate nail pain for good.", icon: "fa-scissors" },
      { title: "Plantar Fasciitis Relief", desc: "Shockwave therapies to target persistent foot heel tendon pain.", icon: "fa-person-falling" }
    ],
    unsplashCategory: "foot care",
    unsplashId: "photo-1519494026892-80bbd2d6fd0d",
    cta: "Schedule Foot Exam"
  },
  {
    id: "optometrist",
    name: "Apex Eye Clinic & Eyewear",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0e7490", secondary: "#ecfeff", accent: "#0891b2", neutral: "#0f172a" },
    slogan: "Comprehensive Eye Exams & Boutique Eyewear",
    description: "Protect your vision. We provide complete pediatric and adult vision testing, glaucoma screening, and custom prescription glasses.",
    services: [
      { title: "Comprehensive Vision Testing", desc: "Digital eye pressure and visual accuracy scans for modern prescriptions.", icon: "fa-eye" },
      { title: "Dry Eye Treatment", desc: "Targeted thermal eye treatments to restore natural tear production.", icon: "fa-droplet" },
      { title: "Boutique Designer Frames", desc: "Select from hundreds of lightweight, hand-crafted designer glasses.", icon: "fa-glasses" }
    ],
    unsplashCategory: "eye clinic",
    unsplashId: "photo-1579684385127-1ef15d508118",
    cta: "Schedule Eye Exam"
  },
  {
    id: "orthodontist",
    name: "Zenith Orthodontics",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#e11d48", neutral: "#1e293b" },
    slogan: "Stunning, Confident Smiles with Invisible Braces",
    description: "Align your teeth comfortably. We offer Invisalign clear aligners and modern ceramic braces for kids, teens, and adults.",
    services: [
      { title: "Invisalign Clear Aligners", desc: "Removable, crystal-clear plastic aligners that straighten teeth invisibly.", icon: "fa-teeth" },
      { title: "Modern Metal & Ceramic Braces", desc: "High-grade bracket setups offering maximum teeth alignment speeds.", icon: "fa-teeth-open" },
      { title: "Early Childhood Orthodontics", desc: "Interceptive bite checks to ensure healthy jaw developments.", icon: "fa-face-smile" }
    ],
    unsplashCategory: "braces",
    unsplashId: "photo-1598256989800-fe5f95da9787",
    cta: "Book Free Braces Check"
  },
  {
    id: "massage",
    name: "Serene Body Massage",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold italic", bodyClass: "font-sans" },
    colors: { primary: "#78350f", secondary: "#fffbeb", accent: "#d97706", neutral: "#1c1917" },
    slogan: "Deep Muscle Relaxation & Stress Relief Therapy",
    description: "Unwind your body and mind. We offer professional Swedish massage, deep tissue therapy, and hot stone treatments designed to melt muscle tension away.",
    services: [
      { title: "Deep Tissue Massage", desc: "Heavy pressure therapy targeting deep muscle knots and tension.", icon: "fa-hands-holding" },
      { title: "Swedish Relaxation Care", desc: "Gentle, flowing strokes to restore blood circulation and calm stress.", icon: "fa-spa" },
      { title: "Hot Stone Therapy", desc: "Warm volcanic stones placed along meridian lines to ease joints.", icon: "fa-gem" }
    ],
    unsplashCategory: "massage spa",
    unsplashId: "photo-1519699047748-de8e457a634e",
    cta: "Book Massage Session"
  },
  {
    id: "acupuncture",
    name: "Zen Oriental Medicine & Acupuncture",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-semibold", bodyClass: "font-sans" },
    colors: { primary: "#1e3a8a", secondary: "#f8fafc", accent: "#047857", neutral: "#0f172a" },
    slogan: "Restore Harmony & Vitality Naturally",
    description: "A holistic approach to healing. Our certified acupuncturists treat chronic migraines, digestive disorders, insomnia, and stress safely.",
    services: [
      { title: "Acupuncture Therapy", desc: "Sterile micro-needle treatments to stimulate energy flow and trigger endorphins.", icon: "fa-needle" },
      { title: "Chinese Herbal Consultation", desc: "Customized organic plant recipes to balance internal organ systems.", icon: "fa-leaf" },
      { title: "Cupping Therapy", desc: "Vacuum cup suctioning to flush lactic acid from stiff back muscles.", icon: "fa-circle-nodes" }
    ],
    unsplashCategory: "acupuncture",
    unsplashId: "photo-1607613009820-a29f7bb81c04",
    cta: "Schedule Consultation"
  },
  {
    id: "gym",
    name: "IronWorks Fitness Center",
    category: "Medical & Wellness",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#ef4444", secondary: "#1c1917", accent: "#ffffff", neutral: "#0c0a09" },
    slogan: "Stop Wishing. Start Training. Get Results.",
    description: "Unleash your strength. Features modern strength machinery, free weights, group high-intensity classes, and expert coaches available 24/7.",
    services: [
      { title: "Strength & Conditioning", desc: "Premium cages, deadlift platforms, and dumbells ranging up to 150 lbs.", icon: "fa-dumbbell" },
      { title: "High-Intensity Group Training", desc: "Heart-pumping group circuit courses designed to torch calories fast.", icon: "fa-users-viewfinder" },
      { title: "Personal Training Plans", desc: "Custom nutritional coaching and exercise tracking with elite trainers.", icon: "fa-user-ninja" }
    ],
    unsplashCategory: "gym weights",
    unsplashId: "photo-1517838277536-f5f99be501cd",
    cta: "Get 3-Day Free Pass"
  },
  {
    id: "yoga",
    name: "Prana Vinyasa Yoga",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold italic", bodyClass: "font-sans" },
    colors: { primary: "#7c3aed", secondary: "#faf5ff", accent: "#db2777", neutral: "#1c1917" },
    slogan: "Find Balance, Flexibility, & Inner Peace",
    description: "Align your mind, body, and breath. Our welcoming studio hosts Vinyasa Flow, Hot Yoga, and Restorative Yin classes for all skill levels.",
    services: [
      { title: "Vinyasa Flow Sessions", desc: "Fluid, alignment-focused posture sequences matched to breathing beats.", icon: "fa-hands-praying" },
      { title: "Hot Yoga & Detox", desc: "Sweat out impurities in our custom-heated 95-degree studio.", icon: "fa-temperature-arrow-up" },
      { title: "Yin & Sound Baths", desc: "Restorative deep stretches accompanied by healing crystal sound bowls.", icon: "fa-wind" }
    ],
    unsplashCategory: "yoga studio",
    unsplashId: "photo-1544367567-0f2fcb009e0b",
    cta: "Book Trial Class"
  },
  {
    id: "pilates",
    name: "CoreFlex Pilates Studio",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#9d174d", secondary: "#fdf2f8", accent: "#db2777", neutral: "#1e293b" },
    slogan: "Build Core Strength & Sleek Muscle Tone",
    description: "Transform your posture. We host small group Reformer Pilates and mat classes focusing on precision core activation and length.",
    services: [
      { title: "Reformer Pilates Sessions", desc: "Controlled resistance training using state-of-the-art reformer frames.", icon: "fa-anchor" },
      { title: "Mat Pilates & Core Focus", desc: "High-repetition core and glute targeted bodyweight workouts.", icon: "fa-circle" },
      { title: "Private Instructor Alignment", desc: "Custom 1-on-1 sessions designed to correct postural imbalances.", icon: "fa-user-check" }
    ],
    unsplashCategory: "pilates reformer",
    unsplashId: "photo-1518611012118-696072aa579a",
    cta: "Book Reformer Class"
  },
  {
    id: "personal-trainer",
    name: "Apex Elite Fitness Training",
    category: "Medical & Wellness",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase", bodyClass: "font-sans" },
    colors: { primary: "#f59e0b", secondary: "#1c1917", accent: "#ffffff", neutral: "#0b0f19" },
    slogan: "Custom Fit Plans Built Specifically for Your Body",
    description: "No more generic routines. Reach your weight loss or muscle building goals with data-backed coaching, weekly metrics tracking, and nutritional advice.",
    services: [
      { title: "Fat Loss & Metabolic Conditioning", desc: "High-intensity cardio and resistance training to maximize calorie burn.", icon: "fa-fire" },
      { title: "Muscle Hypertrophy Focus", desc: "Progression-focused strength training to build lean muscle safely.", icon: "fa-dumbbell" },
      { title: "Custom Meal Programming", desc: "Weekly macro-nutritional plans matched to your exact metabolism.", icon: "fa-apple-whole" }
    ],
    unsplashCategory: "personal trainer",
    unsplashId: "photo-1517838277536-f5f99be501cd",
    cta: "Apply For Coaching"
  },
  {
    id: "nutritionist",
    name: "Zenith Clinical Nutrition",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#15803d", secondary: "#f0fdf4", accent: "#16a34a", neutral: "#1e293b" },
    slogan: "Optimize Your Health with Science-Backed Nutrition",
    description: "Rebuild your relationship with food. We provide personalized meal therapy plans for diabetic management, gut health, and permanent weight control.",
    services: [
      { title: "Gut Health & Microbiome Therapy", desc: "Eliminating bloating and fatigue by restoring your digestive flora.", icon: "fa-bacteria" },
      { title: "Chronic Disease Diet Management", desc: "Science-based eating plans to lower cholesterol and control blood sugar.", icon: "fa-heart-pulse" },
      { title: "Corporate Wellness Seminars", desc: "Seminars on energy management and healthy lunch prep hacks for office staffs.", icon: "fa-briefcase" }
    ],
    unsplashCategory: "healthy food salad",
    unsplashId: "photo-1512621776951-a57141f2eefd",
    cta: "Schedule Nutrition Check"
  },
  {
    id: "speech-therapist",
    name: "Zenith Speech & Language Clinic",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#4338ca", secondary: "#e0e7ff", accent: "#6366f1", neutral: "#1e293b" },
    slogan: "Building Confident Communication Skills for All Ages",
    description: "Providing supportive, clinically-proven speech therapy plans for children, teenagers, and adult stroke recovery patients.",
    services: [
      { title: "Child Speech Delays", desc: "Interactive, play-based therapies to develop language fluency in kids.", icon: "fa-child" },
      { title: "Stuttering & Fluency Therapy", desc: "Proven breathing and vocalization hacks to overcome stutter hurdles.", icon: "fa-volume-high" },
      { title: "Cognitive Aphasia Recovery", desc: "Restoring word retrieval and expression after stroke injury events.", icon: "fa-brain" }
    ],
    unsplashCategory: "speech therapy",
    unsplashId: "photo-1573497019940-1c28c88b4f3e",
    cta: "Book Speech Screening"
  },
  {
    id: "mental-health",
    name: "Zenith Counseling Center",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0891b2", secondary: "#ecfeff", accent: "#0d9488", neutral: "#1e293b" },
    slogan: "A Safe, Confidential Space to Heal and Grow",
    description: "You don't have to walk this road alone. We provide certified cognitive behavioral therapy for anxiety management, trauma healing, and couples counseling.",
    services: [
      { title: "Cognitive Behavioral Therapy (CBT)", desc: "Identifying and reshaping negative thought loops to restore peace.", icon: "fa-brain" },
      { title: "Couples & Marriage Counseling", desc: "Guided dialog sessions to repair communication, boundaries, and trust.", icon: "fa-heart" },
      { title: "Trauma & EMDR Recovery", desc: "Advanced neuro-stimulation therapies to process distressing past memories.", icon: "fa-user-shield" }
    ],
    unsplashCategory: "mental health",
    unsplashId: "photo-1527137341206-e32f9d3c0914",
    cta: "Schedule Private Session"
  },
  {
    id: "dermatologist",
    name: "Zenith Dermatology & Skin Care",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#be185d", secondary: "#fdf2f8", accent: "#db2777", neutral: "#1f2937" },
    slogan: "Expert Medical & Cosmetic Skin Care Services",
    description: "Protect your body's largest organ. We treat eczema, psoriasis, acne breakouts, and perform full-body checks for skin cancer risk.",
    services: [
      { title: "Acne & Scar Treatments", desc: "Chemical peeling and customized prescriptions to clear stubborn breakouts.", icon: "fa-star" },
      { title: "Mole & Cancer Screenings", desc: "Dermatological checks of abnormal spots with biopsy support.", icon: "fa-shield-halved" },
      { title: "Anti-Aging Skin Therapies", desc: "Hyaluronic fillers and microneedles to restore volume.", icon: "fa-face-smile" }
    ],
    unsplashCategory: "skin care clinic",
    unsplashId: "photo-1629909613654-28e377c37b09",
    cta: "Book Skin Consultation"
  },
  {
    id: "vet-clinic",
    name: "HappyPets Veterinary Clinic",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#22c55e", neutral: "#1e293b" },
    slogan: "Loving, Compassionate Medical Care For Your Pets",
    description: "From routine puppy vaccines to emergency surgeries, our experienced veterinary team treats your pets like family.",
    services: [
      { title: "Preventative Vaccinations", desc: "Essential disease shots and worming therapies for dogs and cats.", icon: "fa-syringe" },
      { title: "Advanced Soft-Tissue Surgery", desc: "High-safety surgical procedures, spay/neuter clinic, and clean rooms.", icon: "fa-heart-pulse" },
      { title: "Pet Dental Cleaning", desc: "Scaling and plaque removal to resolve bad breath and gum disease.", icon: "fa-tooth" }
    ],
    unsplashCategory: "veterinarian",
    unsplashId: "photo-1581888227599-779811939961",
    cta: "Schedule Vet Visit"
  },
  {
    id: "dog-trainer",
    name: "Apex Canine Training Academy",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#854d0e", secondary: "#fef9c3", accent: "#d97706", neutral: "#1e293b" },
    slogan: "Transform Your Dog into a Well-Behaved Companion",
    description: "Stop leash pulling, endless barking, and separation anxiety. We utilize positive reinforcement training to build a balanced canine bond.",
    services: [
      { title: "Puppy Social Obedience", desc: "Teaching foundational cues: sit, stay, recall, and house toilet hacks.", icon: "fa-paw" },
      { title: "Aggressive Leash Reactivity", desc: "Behavior modifications to stop lunging, growling, and chasing cars.", icon: "fa-shield" },
      { title: "Board & Train Bootcamps", desc: "Immersive multi-week training programs at our clean country estate.", icon: "fa-graduation-cap" }
    ],
    unsplashCategory: "dog training",
    unsplashId: "photo-1587300003388-59208cc962cb",
    cta: "Request Free Evaluation"
  },
  {
    id: "dog-groomer",
    name: "HappyTails Dog Grooming Spa",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#fb7185", neutral: "#1e293b" },
    slogan: "Luxury Bathing & Styling For Your Furry Friend",
    description: "Give your pup the royal treatment! We provide warm bubble baths, breed-specific haircuts, nail trims, and blueberry facial treatments.",
    services: [
      { title: "Full Grooming Package", desc: "Hair clipping, blow-dry, ear cleaning, and gland checks.", icon: "fa-soap" },
      { title: "De-Shedding Mud Baths", desc: "Enriched mud wraps designed to release deep undercoats from heavy double-coats.", icon: "fa-scissors" },
      { title: "Pedicure Nail Grinding", desc: "Smooth rounded grinding of nails to eliminate scratching of floors.", icon: "fa-paw" }
    ],
    unsplashCategory: "dog groomer",
    unsplashId: "photo-1516734212186-a967f81ad0d7",
    cta: "Book Grooming Session"
  },
  {
    id: "animal-hospital",
    name: "Metropolitan 24/7 Animal Hospital",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#b91c1c", secondary: "#fef2f2", accent: "#ef4444", neutral: "#111827" },
    slogan: "Emergency Veterinary Trauma Center & ICU",
    description: "Fully staffed 24/7 with emergency veterinarians and diagnostic labs to handle pet poisonings, broken bones, and critical pet illnesses.",
    services: [
      { title: "24/7 Trauma Care", desc: "Immediate surgical interventions for pet car accidents and poisonings.", icon: "fa-truck-medical" },
      { title: "In-House Digital X-Rays", desc: "Advanced imaging scans to locate internal obstructions instantly.", icon: "fa-radiation" },
      { title: "Pet ICU & Oxygen Therapy", desc: "Monitored recovery cages with pure oxygen flow control panels.", icon: "fa-heart-pulse" }
    ],
    unsplashCategory: "animal hospital",
    unsplashId: "photo-1584132967334-10e028bd69f7",
    cta: "Emergency: Call Hospital Now"
  },

  // ==================== FOOD & BEVERAGE (20) ====================
  {
    id: "cafe",
    name: "Roasted Bean Cafe",
    category: "Food & Beverage",
    layout: "Layout_E", // Soft-Curved Organic Story
    fonts: { heading: "Fraunces", body: "Instrument Sans", headingClass: "font-serif font-black", bodyClass: "font-sans" },
    colors: { primary: "#451a03", secondary: "#fffbeb", accent: "#d97706", neutral: "#1c1917" },
    slogan: "Artisanal Espresso & Warm Baked Goods",
    description: "Unplug, unwind, and sip the finest organic coffee. Our single-origin beans are locally roasted weekly and brewed with pure passion.",
    services: [
      { title: "Pour-Over & Cold Brew", desc: "Slow-extraction coffee showcasing complex fruit and chocolate notes.", icon: "fa-mug-hot" },
      { title: "Daily Sourdough Pastries", desc: "Flaky croissants, fruit danishes, and fresh loaves baked daily at 4 AM.", icon: "fa-wheat-awn" },
      { title: "Cozy Study Spaces", desc: "Super-fast Wi-Fi, silent nooks, and solar-power desktop outlet hubs.", icon: "fa-wifi" }
    ],
    unsplashCategory: "cozy coffee shop",
    unsplashId: "photo-1501339847302-ac426a4a7cbb",
    cta: "View Cafe Menu"
  },
  {
    id: "bakery",
    name: "WildYeast Sourdough Bakery",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Fraunces", body: "Instrument Sans", headingClass: "font-serif font-black", bodyClass: "font-sans" },
    colors: { primary: "#7c2d12", secondary: "#fff7ed", accent: "#ea580c", neutral: "#1c1917" },
    slogan: "Traditional Sourdough Bread Baked Daily",
    description: "Made from just organic flour, water, and sea salt. Naturally fermented for 36 hours for maximum flavor, crunch, and digestion.",
    services: [
      { title: "Artisan Sourdough Loaves", desc: "Classic rustic white, seed-laden rye, and dark walnut specialty breads.", icon: "fa-bread-slice" },
      { title: "Flaky Morning Croissants", desc: "Buttery, multi-layered French pastries that melt in your mouth.", icon: "fa-cookie" },
      { title: "Bespoke Celebration Cakes", desc: "Elegant tiered cakes custom-decorated with local edible flowers.", icon: "fa-cake-candles" }
    ],
    unsplashCategory: "sourdough bread bakery",
    unsplashId: "photo-1509440159596-0249088772ff",
    cta: "Order Bread Online"
  },
  {
    id: "brewery",
    name: "Hops & Barrel Craft Brewing",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#d97706", secondary: "#27272a", accent: "#ffffff", neutral: "#18181b" },
    slogan: "Boldly Crafted Beers Brewed Locally",
    description: "Welcome to your local watering hole. Try our award-winning dry-hopped IPAs, velvet chocolate stouts, and fresh wood-fired pizzas.",
    services: [
      { title: "Local Craft Drafts", desc: "18 rotating taps featuring crisp lagers, sour ales, and heavy stouts.", icon: "fa-beer-mugs-healthy" },
      { title: "Brewery Tours & Tastings", desc: "Go behind the steel tanks with our master brewer and sample malts.", icon: "fa-flask" },
      { title: "Wood-Fired Pizza Kitchen", desc: "Neapolitan pizzas baked hot at 900 degrees inside brick ovens.", icon: "fa-pizza-slice" }
    ],
    unsplashCategory: "craft brewery taproom",
    unsplashId: "photo-1571613316887-6f8d5cbf7ef7",
    cta: "See What's On Tap"
  },
  {
    id: "winery",
    name: "BellaVista Winery & Vineyards",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#701a75", secondary: "#fae8ff", accent: "#86198f", neutral: "#1e1b4b" },
    slogan: "Award-Winning Estate Wines & Sunset Tastings",
    description: "Experience the legacy of fine wine making. Join us on our sunny terrace overlooking the vineyard valley for classic pairings.",
    services: [
      { title: "Estate Cabernet & Chardonnay", desc: "Premium single-block bottles aged inside French oak barrels.", icon: "fa-wine-bottle" },
      { title: "Sunset Wine Tastings", desc: "Private sommelier tasting flights paired with local goat cheese boards.", icon: "fa-wine-glass" },
      { title: "Exclusive Wine Club", desc: "Get early allocations of limited reserves shipped to your door quarterly.", icon: "fa-truck" }
    ],
    unsplashCategory: "vineyard winery",
    unsplashId: "photo-1506377247377-2a5b3b417ebb",
    cta: "Book Vine Tasting"
  },
  {
    id: "pizzeria",
    name: "Bella Italia Pizzeria",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Fraunces", body: "Instrument Sans", headingClass: "font-serif font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#b91c1c", secondary: "#fffbeb", accent: "#16a34a", neutral: "#1c1917" },
    slogan: "Authentic Neapolitan Pizza Baked Hot",
    description: "Imported San Marzano tomatoes, fresh buffalo mozzarella, and a dough fermented for 48 hours, baked in 90 seconds under wood logs.",
    services: [
      { title: "Classic Margherita Pizza", desc: "Salty mozzarella, tomato sauce, extra virgin olive oil, and fresh basil.", icon: "fa-pizza-slice" },
      { title: "Custom Brick-Oven Calzones", desc: "Folded pizza dough stuffed with creamy ricotta, salami, and garlic.", icon: "fa-bread-slice" },
      { title: "Italian Gelato Desserts", desc: "Creamy pistachio, hazelnut, and dark chocolate scoop selections.", icon: "fa-ice-cream" }
    ],
    unsplashCategory: "neapolitan pizza oven",
    unsplashId: "photo-1513104890138-7c749659a591",
    cta: "Order Pizza Now"
  },
  {
    id: "sushi",
    name: "Mizu Sushi Bar",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold uppercase", bodyClass: "font-sans" },
    colors: { primary: "#1c1917", secondary: "#292524", accent: "#b91c1c", neutral: "#0c0a09" },
    slogan: "Fresh Traditional Omakase Sushi Experiences",
    description: "Savor the art of sushi. Our master chefs prepare daily shipments of fish from Tokyo's Toyosu Market in front of your eyes.",
    services: [
      { title: "Chef's Omakase Course", desc: "A curated 12-piece tasting journey highlighting fatty tuna and sea urchin.", icon: "fa-cube" },
      { title: "Signature Nigiri & Sashimi", desc: "Delicately sliced premium raw fish served over warm, seasoned vinegared rice.", icon: "fa-fish" },
      { title: "Premium Sake Pairings", desc: "Crisp, cold junmai ginjo sake flights served in custom bamboo cups.", icon: "fa-bottle-droplet" }
    ],
    unsplashCategory: "sushi raw fish",
    unsplashId: "photo-1579871494447-9811cf80d66c",
    cta: "Book Omakase Counter"
  },
  {
    id: "catering",
    name: "Gourmet Catering Services",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#047857", secondary: "#f0fdf4", accent: "#10b981", neutral: "#064e3b" },
    slogan: "Exquisite Culinary Planning For Large Events",
    description: "From intimate backyard weddings to corporate gala events, our custom catering menus showcase local seasonal ingredients.",
    services: [
      { title: "Weddings & Galas", desc: "Sophisticated multi-course plated dinners and raw bar seafood stations.", icon: "fa-bell-concierge" },
      { title: "Corporate Buffet Launches", desc: "Healthy, diverse lunch platters designed for quick hot servings.", icon: "fa-briefcase" },
      { title: "Artisanal Cocktail Bars", desc: "Premium mixology bars complete with custom-crafted house syrups.", icon: "fa-wine-glass-sad" }
    ],
    unsplashCategory: "wedding food catering",
    unsplashId: "photo-1555244162-803834f70033",
    cta: "Plan Your Event Menu"
  },
  {
    id: "juice-bar",
    name: "PureBlend Smoothie & Juice Bar",
    category: "Food & Beverage",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-black", bodyClass: "font-sans" },
    colors: { primary: "#15803d", secondary: "#f0fdf4", accent: "#eab308", neutral: "#1e293b" },
    slogan: "Cold-Pressed Raw Juices & Energy Superfood Bowls",
    description: "Recharge your day. Our juices are cold-pressed daily from raw organic greens with zero added sugars or preservatives.",
    services: [
      { title: "Organic Cold-Pressed Juices", desc: "Packed with active live enzymes to boost immunity and skin health.", icon: "fa-glass-water" },
      { title: "Nutrient-Dense Acai Bowls", desc: "Thick acai bases topped with raw cocoa nibs, local berries, and hemp seeds.", icon: "fa-bowl-food" },
      { title: "Ginger & Turmeric Shots", desc: "Concentrated immune system boosters that combat body inflammation.", icon: "fa-flask-vial" }
    ],
    unsplashCategory: "green smoothie juice",
    unsplashId: "photo-1610970881699-44a5587caa90",
    cta: "View Smoothie Menu"
  },
  {
    id: "food-truck",
    name: "StreetBites Taco Truck",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase", bodyClass: "font-sans" },
    colors: { primary: "#d97706", secondary: "#27272a", accent: "#dc2626", neutral: "#09090b" },
    slogan: "Authentic Mexican Street Tacos & Hand-Cut Fries",
    description: "Follow the smell of sizzle! Our mobile food kitchen serves slow-cooked birria tacos and massive loaded cheese fries.",
    services: [
      { title: "Birria Tacos & Consomé", desc: "Braised beef folded with melted cheese, served with deep dipping broth.", icon: "fa-taco" },
      { title: "Asada Loaded Street Fries", desc: "Crispy skin-on fries topped with grilled steak, guac, and chipotle mayo.", icon: "fa-bowl-rice" },
      { title: "Catering & Private Popups", desc: "Book our truck to serve fresh hot food directly at your event.", icon: "fa-truck" }
    ],
    unsplashCategory: "food truck",
    unsplashId: "photo-1565123409695-7b5ff624d164",
    cta: "Find Our Location"
  },
  {
    id: "pub-bar",
    name: "The Rusty Anchor Irish Pub",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Fraunces", body: "Inter", headingClass: "font-serif font-black", bodyClass: "font-sans" },
    colors: { primary: "#7f1d1d", secondary: "#1c1917", accent: "#eab308", neutral: "#0c0a09" },
    slogan: "Traditional Pints, Fine Whiskey & Live Music",
    description: "Pull up a stool. Enjoy cold Guinness on draft, select from over 80 single-malt scotches, and listen to local folk bands.",
    services: [
      { title: "Guinness & Local Drafts", desc: "Perfectly poured pints kept at a cellar-cool temperature.", icon: "fa-beer-mug-empty" },
      { title: "Irish Stout Pot Pies", desc: "Slow-stewed beef inside puff pastry, baked with rich gravy.", icon: "fa-plate-wheat" },
      { title: "Live Music Sessions", desc: "Enjoy acoustic performances every Thursday through Saturday night.", icon: "fa-guitar" }
    ],
    unsplashCategory: "irish pub bar",
    unsplashId: "photo-1543007630-9710e4a00a20",
    cta: "Book Table Tonight"
  },
  {
    id: "ice-cream",
    name: "Scoop Society Artisan Ice Cream",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Fraunces", body: "Instrument Sans", headingClass: "font-serif font-extrabold italic", bodyClass: "font-sans" },
    colors: { primary: "#be185d", secondary: "#fff1f2", accent: "#fb7185", neutral: "#1e1b4b" },
    slogan: "Hand-Crafted Ice Cream Made in Small Batches",
    description: "Creamy, dream-worthy scoop combinations. We use raw milk from local cows and real organic vanilla beans to craft our flavors.",
    services: [
      { title: "Small-Batch Scoop Scoops", desc: "Rotating classics, raw salted caramel, and vegan lavender flavors.", icon: "fa-ice-cream" },
      { title: "Loaded Sundaes & Cones", desc: "Custom waffle cones baked daily, loaded with fudge and cherries.", icon: "fa-cookie-bite" },
      { title: "Ice Cream Catering Carts", desc: "Vintage mobile scoop carts configured for weddings and kids parties.", icon: "fa-truck" }
    ],
    unsplashCategory: "ice cream scoop cone",
    unsplashId: "photo-1497034825429-c343d7c6a68f",
    cta: "See Current Flavors"
  },
  {
    id: "steakhouse",
    name: "The Prime Cut Steakhouse",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-black", bodyClass: "font-sans" },
    colors: { primary: "#450a0a", secondary: "#292524", accent: "#d97706", neutral: "#0c0a09" },
    slogan: "Dry-Aged USDA Prime Steaks Sear-Cooked",
    description: "Savor the rich flavor of dry-aged beef. Our cuts are aged 28 days on-site and seared inside an 1800-degree broiler.",
    services: [
      { title: "Dry-Aged Bone-In Ribeye", desc: "Unmatched marbling, seasoned simply with kosher salt and black pepper.", icon: "fa-drumstick-bite" },
      { title: "Bespoke Shellfish Towers", desc: "Fresh oysters, lobster tails, and tiger prawns on crushed ice.", icon: "fa-shrimp" },
      { title: "Private Dining Cellars", desc: "Host dinner inside our underground stone cellars with custom menus.", icon: "fa-wine-glass" }
    ],
    unsplashCategory: "cooked steak",
    unsplashId: "photo-1544025162-d76694265947",
    cta: "Reserve Dining Table"
  },
  {
    id: "burger-joint",
    name: "WildStack Burger Bar",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#dc2626", secondary: "#27272a", accent: "#fbbf24", neutral: "#09090b" },
    slogan: "Gourmet Smash Burgers & Craft Shakes",
    description: "Juicy, caramelized edges! We smash our custom dry-aged beef blends onto screaming hot steel grills and serve in soft brioche buns.",
    services: [
      { title: "Crispy Smash Burgers", desc: "Double beef patties, melted cheddar, house pickles, and stack sauce.", icon: "fa-burger" },
      { title: "Truffle Loaded Hand-Cut Fries", desc: "Crispy potato wedges tossed with white truffle oil and parm.", icon: "fa-bowl-food" },
      { title: "Thick Whipped Milkshakes", desc: "Rich shakes blended with real local ice cream and whipped cream.", icon: "fa-glass-water" }
    ],
    unsplashCategory: "smash burger fries",
    unsplashId: "photo-1568901346375-23c9450c58cd",
    cta: "Order Online Delivery"
  },
  {
    id: "seafood",
    name: "The Harbour Grill & Oysters",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0369a1", secondary: "#f0f9ff", accent: "#0284c7", neutral: "#0f172a" },
    slogan: "Ocean-to-Table Seafood & Fresh Shucked Oysters",
    description: "Enjoy catch-of-the-day freshness. We source daily fish directly from local fishing boats to guarantee exceptional flavor.",
    services: [
      { title: "Raw Oyster Bar", desc: "rotating cold-water oysters shucked live and served with mignonette.", icon: "fa-fish" },
      { title: "Pan-Seared Sea Bass", desc: "Cooked with lemon-herb butter over sautéed garden asparagus.", icon: "fa-utensils" },
      { title: "Lobster Roll Plates", desc: "Heaping cold Maine lobster inside buttered warm brioche buns.", icon: "fa-bread-slice" }
    ],
    unsplashCategory: "seafood fish plate",
    unsplashId: "photo-1534422298391-e4f8c172dddb",
    cta: "View Seafood Menu"
  },
  {
    id: "vegetarian-cafe",
    name: "The GreenKitchen Cafe",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Fraunces", body: "Instrument Sans", headingClass: "font-serif font-black", bodyClass: "font-sans" },
    colors: { primary: "#166534", secondary: "#f0fdf4", accent: "#86efac", neutral: "#064e3b" },
    slogan: "Vibrant Plant-Based Dining for Conscious Eaters",
    description: "Enjoy flavorful, colorful vegan and vegetarian courses made from organic ingredients sourced from local eco-farms.",
    services: [
      { title: "Rainbow Harvest Bowls", desc: "Warm quinoa, roasted sweet potatoes, avocado, and tahini drizzle.", icon: "fa-bowl-food" },
      { title: "Lentil & Mushroom Burgers", desc: "Hearty, house-made veggie patties served with oven-baked sweet potato wedges.", icon: "fa-burger" },
      { title: "Organic Matcha & Chai Lattes", desc: "Bespoke tea drinks whisked with oat or almond milk.", icon: "fa-leaf" }
    ],
    unsplashCategory: "vegan food salad",
    unsplashId: "photo-1540420773420-3366772f4999",
    cta: "Explore Plant Menu"
  },
  {
    id: "donut-shop",
    name: "Glazed & Dazed Donut Co.",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Fraunces", body: "Instrument Sans", headingClass: "font-serif font-black italic", bodyClass: "font-sans" },
    colors: { primary: "#be185d", secondary: "#fff1f2", accent: "#fb7185", neutral: "#1c1917" },
    slogan: "Crazy Creative Artisan Donuts Yeast-Raised",
    description: "Indulge in fluffy, melt-in-your-mouth donuts. Hand-crafted daily, featuring crazy glaze creations and custom fillings.",
    services: [
      { title: "Artisan Brioche Donuts", desc: "24-hour slow fermented yeast doughs, glazed with local fruits.", icon: "fa-circle-dot" },
      { title: "Filled Crème Brûlée Bombs", desc: "Stuffed with pastry cream, complete with caramelized torch tops.", icon: "fa-fire" },
      { title: "Fresh Espresso Bar", desc: "Perfectly balanced dark roast double-shots to cut the sweetness.", icon: "fa-mug-hot" }
    ],
    unsplashCategory: "donuts",
    unsplashId: "photo-1551024601-bec78aea704b",
    cta: "Order Donut Box"
  },
  {
    id: "food-prep",
    name: "Apex Prep & Meal Delivery",
    category: "Food & Beverage",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#eab308", neutral: "#1e293b" },
    slogan: "Chef-Prepared Healthy Meals Shipped Weekly",
    description: "Save hours of shopping and cooking. Get portion-controlled, macro-balanced clean meals delivered fresh to your door.",
    services: [
      { title: "High-Protein Fitness Prep", desc: "Clean cuts of chicken, steak, and salmon paired with complex grains.", icon: "fa-dumbbell" },
      { title: "Low-Carb Keto Packages", desc: "Healthy fat and high-veg options designed to trigger fat loss.", icon: "fa-heart-pulse" },
      { title: "Custom Portion Selectors", desc: "Adjust your meal sizes easily on our mobile application platform.", icon: "fa-scale-balanced" }
    ],
    unsplashCategory: "healthy food prep",
    unsplashId: "photo-1546069901-ba9599a7e63c",
    cta: "Choose Your Weekly Meals"
  },
  {
    id: "bistro",
    name: "The Corner Bistro",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#581c87", secondary: "#faf5ff", accent: "#7e22ce", neutral: "#1e1b4b" },
    slogan: "Classic French-American Bistro Comfort Food",
    description: "Enjoy intimate dining under soft lighting. We offer classic steak frites, duck confit, and an extensive list of wines.",
    services: [
      { title: "Steak Frites Classic", desc: "Grilled tenderloin served with red wine reduction and crispy matchstick potatoes.", icon: "fa-utensils" },
      { title: "Baked French Onion Soup", desc: "Rich caramelized beef broth topped with crusty sourdough and gruyère cheese.", icon: "fa-bowl-food" },
      { title: "Seasonal Tart Selections", desc: "Crisp pastry crusts filled with lemon curd or caramelized fresh pears.", icon: "fa-cake-slice" }
    ],
    unsplashCategory: "cozy bistro dinner",
    unsplashId: "photo-1550966871-3ed3cdb5ed0c",
    cta: "Reserve Bistro Table"
  },
  {
    id: "taco-stand",
    name: "Tacos El Rey Stand",
    category: "Food & Beverage",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase", bodyClass: "font-sans" },
    colors: { primary: "#15803d", secondary: "#27272a", accent: "#b91c1c", neutral: "#09090b" },
    slogan: "Legendary Mexican Street Tacos Rolled Hot",
    description: "No frills, just exceptional flavor. Freshly pressed corn tortillas topped with chopped cilantro, onions, and spicy salsas.",
    services: [
      { title: "Spit-Roasted Al Pastor", desc: "Marinated pork sliced thin from rotating spits, topped with pineapple.", icon: "fa-taco" },
      { title: "Slow-Cooked Carnitas", desc: "Crispy shredded pork shoulder braised with orange peel and spices.", icon: "fa-circle-check" },
      { title: "Spicy House Salsas", desc: "Choose from roasted salsa verde or our signature red fire habanero sauce.", icon: "fa-pepper-hot" }
    ],
    unsplashCategory: "mexican street tacos",
    unsplashId: "photo-1565299585323-38d6b0865b47",
    cta: "See Taco Menu"
  },
  {
    id: "tapas-bar",
    name: "La Rambla Tapas Bar",
    category: "Food & Beverage",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold italic", bodyClass: "font-sans" },
    colors: { primary: "#9a3412", secondary: "#fff7ed", accent: "#ea580c", neutral: "#1e1b4b" },
    slogan: "Vibrant Spanish Tapas & Sangria Carousels",
    description: "Designed for sharing. Savor small plates of patatas bravas, garlic shrimp, and dry-cured Jamón Ibérico paired with iced red sangria.",
    services: [
      { title: "Garlic Chili Shrimp", desc: "Sizzling olive oil loaded with garlic, red pepper flakes, and fresh tiger shrimp.", icon: "fa-shrimp" },
      { title: "Crispy Patatas Bravas", desc: "Fried potato cubes drizzled with spicy tomato bravas sauce and garlic aioli.", icon: "fa-plate-wheat" },
      { title: "Traditional Red Sangria", desc: "A fruit-steeped red wine cocktail served cold in sharing pitchers.", icon: "fa-wine-glass" }
    ],
    unsplashCategory: "spanish tapas food",
    unsplashId: "photo-1555244162-803834f70033",
    cta: "Book Tapas Table"
  },

  // ==================== BEAUTY & PERSONAL CARE (10) ====================
  {
    id: "hair-salon",
    name: "Lore Hair Salon",
    category: "Beauty & Personal Care",
    layout: "Layout_C", // Asymmetrical Grid Showcase
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#be185d", secondary: "#fff1f2", accent: "#d97706", neutral: "#1f2937" },
    slogan: "Luxury Hair Styling & Color Balayage Services",
    description: "Unveil your beautiful self. Our experienced master stylists specialize in precision haircuts, custom color balayage, and restorative keratin hair treatments.",
    services: [
      { title: "Balayage & Color Melts", desc: "Hand-painted, natural highlights tailored to skin tone tones.", icon: "fa-wand-magic-sparkles" },
      { title: "Precision Dry Cuts", desc: "Custom structural haircuts designed to drop cleanly without heavy styling.", icon: "fa-scissors" },
      { title: "Silk-Press & Blowouts", desc: "Bouncy, high-volume blowouts finished with professional round brushes.", icon: "fa-wind" }
    ],
    unsplashCategory: "hair salon styling",
    unsplashId: "photo-1560066984-138dadb4c035",
    cta: "Book Hair Appointment"
  },
  {
    id: "barbershop",
    name: "Heads Barbershop",
    category: "Beauty & Personal Care",
    layout: "Layout_D",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-black uppercase", bodyClass: "font-sans" },
    colors: { primary: "#171717", secondary: "#262626", accent: "#d4af37", neutral: "#0a0a0a" },
    slogan: "Sharp Haircuts & Traditional Hot Towel Shaves",
    description: "Elevate your style. We provide premium skin fades, clean beard alignments, and traditional straight razor hot towel shaves in a classic club atmosphere.",
    services: [
      { title: "Skin Fades & Tapors", desc: "Perfectly blended low, mid, or high fades finished with premium clippers.", icon: "fa-user" },
      { title: "Straight Razor Hot Shave", desc: "Skin prepped with essential oils, warm lather, and straight blade shaving.", icon: "fa-soap" },
      { title: "Beard Sculpting & Wash", desc: "Trimming, detailing lines, and nourishing treatment with organic oils.", icon: "fa-face-smile" }
    ],
    unsplashCategory: "barbershop fade cut",
    unsplashId: "photo-1503951914875-452162b0f3f1",
    cta: "Book Barber Chair"
  },
  {
    id: "nail-salon",
    name: "GelLux Nail Studio",
    category: "Beauty & Personal Care",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#db2777", secondary: "#fdf2f8", accent: "#ec4899", neutral: "#1f2937" },
    slogan: "Bespoke Nail Art & Luxury Gel Manicures",
    description: "Treat your hands. Our nail artists specialize in custom extension sculpting, hand-painted nail designs, and organic spa pedicures.",
    services: [
      { title: "Gel-X Extension Sets", desc: "Lightweight, long-lasting extensions cured under UV LED lamps.", icon: "fa-sparkles" },
      { title: "Hand-Painted Nail Art", desc: "Custom geometric, floral, or chrome line art designs.", icon: "fa-brush" },
      { title: "Paraffin Spa Pedicure", desc: "Hot water foot soak, skin exfoliation, and warm paraffin wax wrap.", icon: "fa-foot-prints" }
    ],
    unsplashCategory: "nail polish manicure",
    unsplashId: "photo-1604654894610-df63bc536371",
    cta: "Book Nail Session"
  },
  {
    id: "day-spa",
    name: "Aura Oasis Day Spa",
    category: "Beauty & Personal Care",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-semibold", bodyClass: "font-sans" },
    colors: { primary: "#065f46", secondary: "#ecfdf5", accent: "#059669", neutral: "#064e3b" },
    slogan: "Rejuvenating Facials, Body Wraps & Spa Packages",
    description: "Escape the noise of the city. Calm your senses with relaxing clinical facials, skin body polishes, and custom couples spa packages.",
    services: [
      { title: "HydraFacial Skin Detailing", desc: "Advanced pore vacuuming, skin exfoliation, and serum hydration.", icon: "fa-droplet" },
      { title: "Eucalyptus Body Polish", desc: "A full-body scrub using organic essential oils and dead sea salt crystals.", icon: "fa-soap" },
      { title: "Infrared Sauna Cabins", desc: "Decompress joints and sweat out toxins inside cedar dry-saunas.", icon: "fa-temperature-high" }
    ],
    unsplashCategory: "day spa facial",
    unsplashId: "photo-1540555700478-4be289fbecef",
    cta: "Book Spa Day"
  },
  {
    id: "makeup-artist",
    name: "Vogue Faces Makeup Studio",
    category: "Beauty & Personal Care",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#be185d", secondary: "#fff1f2", accent: "#db2777", neutral: "#1e1b4b" },
    slogan: "Flawless Bridal & High-Fashion Makeup Artistry",
    description: "Look radiant on your special day. Providing luxury airbrush makeup application, lash extensions, and makeup tutorial classes.",
    services: [
      { title: "Bridal Airbrush Packages", desc: "Tear-resistant, high-definition makeup matched to wedding themes.", icon: "fa-heart" },
      { title: "Special Event Glamour", desc: "Chic smoky eyes, contouring, and false lash application styling.", icon: "fa-eye" },
      { title: "Private Makeup Masterclasses", desc: "1-on-1 lessons teaching custom skin prep and product layering.", icon: "fa-graduation-cap" }
    ],
    unsplashCategory: "makeup brush face",
    unsplashId: "photo-1487412720507-e7ab37603c6f",
    cta: "Book Makeup Artist"
  },
  {
    id: "lash-studio",
    name: "LashCraft Studio",
    category: "Beauty & Personal Care",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-semibold", bodyClass: "font-sans" },
    colors: { primary: "#9d174d", secondary: "#fdf2f8", accent: "#db2777", neutral: "#1f2937" },
    slogan: "Semi-Permanent Lash Extensions & Brow Lamination",
    description: "Wake up with perfect eyelashes. We apply premium silk and mink individual extensions with medical-grade, low-fume glues.",
    services: [
      { title: "Classic Lash Extensions", desc: "A 1-to-1 lash ratio application that adds clean length and curl.", icon: "fa-eye" },
      { title: "Volume / Hybrid Fan Sets", desc: "Multi-lash fan placement to create dense, dramatic thickness.", icon: "fa-sparkles" },
      { title: "Keratin Lash Lift & Tint", desc: "Curling and darkening your natural lashes to mimic mascara.", icon: "fa-wind" }
    ],
    unsplashCategory: "eyelash extensions",
    unsplashId: "photo-1582213782179-e0d53f98f2ca",
    cta: "Book Lash Chair"
  },
  {
    id: "tattoo-parlor",
    name: "Sacred Skin Tattoo Parlour",
    category: "Beauty & Personal Care",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#171717", secondary: "#262626", accent: "#b91c1c", neutral: "#0a0a0a" },
    slogan: "Custom Fine-Line & Traditional Tattoo Artistry",
    description: "Wear your story. Our award-winning resident artists specialize in geometric, black-and-gray realism, and traditional bold-line work.",
    services: [
      { title: "Fine-Line & Dotwork", desc: "Highly detailed, intricate black-ink illustrations with clean heals.", icon: "fa-pen-clip" },
      { title: "Black & Gray Realism", desc: "Expert shading and portrait tattoos utilizing soft dynamic gradients.", icon: "fa-image" },
      { title: "Tattoo Clean Removals", desc: "State-of-the-art laser tattoo removal to prep skin for coverups.", icon: "fa-bolt-lightning" }
    ],
    unsplashCategory: "tattoo artist",
    unsplashId: "photo-1598256989800-fe5f95da9787",
    cta: "Book Tattoo Consult"
  },
  {
    id: "piercing",
    name: "Zenith Body Piercing",
    category: "Beauty & Personal Care",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black", bodyClass: "font-sans" },
    colors: { primary: "#1f2937", secondary: "#374151", accent: "#fbbf24", neutral: "#0c0f17" },
    slogan: "Safe, Clean Body Piercing & Fine Titanium Jewelry",
    description: "Your safety is our priority. We perform clean body piercings using sterile single-use needles and stock implant-grade titanium jewelry.",
    services: [
      { title: "Ear & Facial Piercings", desc: "Lobe, cartilage, helix, nose, and eyebrow piercings with clean guns.", icon: "fa-circle" },
      { title: "Sterile Needle Piercing", desc: "100% single-use needles operated inside autoclave sterile rooms.", icon: "fa-shield-halved" },
      { title: "Bespoke Solid Gold Jewelry", desc: "Shop ASTM F136 titanium and 14k threadless gold studs.", icon: "fa-gem" }
    ],
    unsplashCategory: "earrings jewelry",
    unsplashId: "photo-1535632066927-ab7c9ab60908",
    cta: "Book Piercing Slot"
  },
  {
    id: "cryotherapy",
    name: "SubZero Cryo & Recovery",
    category: "Beauty & Personal Care",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#38bdf8", neutral: "#0f172a" },
    slogan: "Accelerate Muscle Healing & Boost Metabolism",
    description: "Step into the cold. Our whole-body cryotherapy chambers expose skin to -160°F temperatures to flush inflammation and jumpstart fat burn.",
    services: [
      { title: "Whole Body Cryotherapy", desc: "3-minute freezing cold chamber sessions to boost collagen and recovery.", icon: "fa-snowflake" },
      { title: "Localized Pain Cryo", desc: "Targeted cold nitrogen air streams to relieve sore knees or elbows.", icon: "fa-temperature-arrow-down" },
      { title: "Compression Leg Therapy", desc: "Normatec leg sleeves to flush metabolic waste from calf muscles.", icon: "fa-arrows-compress" }
    ],
    unsplashCategory: "cryotherapy chamber",
    unsplashId: "photo-1600334129128-685c5582fd35",
    cta: "Book Cryo Session"
  },
  {
    id: "tanning",
    name: "SunKissed Tanning Salon",
    category: "Beauty & Personal Care",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-bold italic", bodyClass: "font-sans" },
    colors: { primary: "#854d0e", secondary: "#fef9c3", accent: "#ca8a04", neutral: "#1e293b" },
    slogan: "Luxury Sunless Airbrush Spray Tans",
    description: "Get a natural, golden beach glow! We specialize in custom-blended organic airbrush spray tanning with zero orange streaks.",
    services: [
      { title: "Custom Airbrush Spray Tan", desc: "Personal technician application tailored to your skin shade goals.", icon: "fa-spray-can" },
      { title: "High-Output UV Tanning Beds", desc: "Modern laying and standing tanning booths with skin cooling fans.", icon: "fa-lightbulb" },
      { title: "Skin Hydration Lock Treatment", desc: "Post-tan moisturizing spray to extend tan life for weeks.", icon: "fa-droplet" }
    ],
    unsplashCategory: "tanning spray",
    unsplashId: "photo-1540555700478-4be289fbecef",
    cta: "Book Tanning Session"
  },

  // ==================== PROFESSIONAL SERVICES (10) ====================
  {
    id: "accountant",
    name: "Vanguard Tax & CPA",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e3a8a", secondary: "#f8fafc", accent: "#3b82f6", neutral: "#0f172a" },
    slogan: "Strategic Tax Planning & Financial Advisory",
    description: "Max tax write-offs, zero auditing anxiety. We manage corporate accounting, bookkeeping, payroll, and personal income filing.",
    services: [
      { title: "Corporate Bookkeeping", desc: "Accurate monthly ledger balancing and cashflow statement processing.", icon: "fa-calculator" },
      { title: "IRS Audit Defense & Representation", desc: "Licensed CPA negotiation and letter representation before IRS agents.", icon: "fa-folder-open" },
      { title: "Strategic Tax Minimization", desc: "Structuring business investments to minimize standard tax liabilities.", icon: "fa-chart-pie" }
    ],
    unsplashCategory: "accounting tax calculator",
    unsplashId: "photo-1554224155-8d04cb21cd6c",
    cta: "Request Tax Audit"
  },
  {
    id: "lawyer",
    name: "Apex Corporate Law",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e1b4b", secondary: "#f8fafc", accent: "#d4af37", neutral: "#0f172a" },
    slogan: "Experienced Legal Counsel for Scale-Up Businesses",
    description: "Protect your intellectual property, resolve equity disputes, and review complex corporate contracts with expert business attorneys.",
    services: [
      { title: "Contract Review & Drafting", desc: "Robust legal agreements written to secure operations against risks.", icon: "fa-file-signature" },
      { title: "IP & Trademark Filings", desc: "Registration of patents, copyrights, and brand trademarks globally.", icon: "fa-copyright" },
      { title: "Mergers & Acquisitions Legal", desc: "Rigorous legal due diligence for business sales and asset buying.", icon: "fa-briefcase" }
    ],
    unsplashCategory: "law firm office",
    unsplashId: "photo-1589829545856-d10d557cf95f",
    cta: "Schedule Law Counsel"
  },
  {
    id: "realtor",
    name: "Prestige Real Estate Brokerage",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0f172a", secondary: "#f8fafc", accent: "#ca8a04", neutral: "#0f172a" },
    slogan: "Unlock the True Value of Your Property",
    description: "Looking to buy or sell? Partner with top-producing real estate brokers to locate off-market listings and secure top dollar values.",
    services: [
      { title: "Seller Marketing & Staging", desc: "Pro photography, floor modeling, and ads to sell homes fast.", icon: "fa-house-circle-check" },
      { title: "First-Time Buyer Tours", desc: "Navigating mortgages, home inspections, and writing strong bids.", icon: "fa-key" },
      { title: "Investment Portfolio Audits", desc: "Analyzing multi-family buildings for rental yields and appreciation.", icon: "fa-chart-line" }
    ],
    unsplashCategory: "luxury home interior",
    unsplashId: "photo-1600585154340-be6161a56a0c",
    cta: "List Your Home"
  },
  {
    id: "financial-advisor",
    name: "Apex Wealth Management",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#111827", secondary: "#f9fafb", accent: "#0284c7", neutral: "#111827" },
    slogan: "Secure Your Retirement & Grow Your Capital",
    description: "Personalized investment plans designed by fiduciary advisors to grow wealth, reduce fees, and plan family estates safely.",
    services: [
      { title: "Asset Allocation Plans", desc: "Balanced stock, bond, and real estate index funds adjusted for risk.", icon: "fa-chart-pie" },
      { title: "Retirement Cashflow Plans", desc: "Structuring retirement income distributions to limit tax costs.", icon: "fa-umbrella" },
      { title: "College Savings Trusts", desc: "Setting up 529 education funds and generational family trusts.", icon: "fa-piggy-bank" }
    ],
    unsplashCategory: "stock market finance",
    unsplashId: "photo-1590283603385-17ffb3a7f29f",
    cta: "Schedule Wealth Audit"
  },
  {
    id: "insurance",
    name: "Apex Shield Insurance Group",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e3a8a", secondary: "#f8fafc", accent: "#2563eb", neutral: "#0f172a" },
    slogan: "Secure Coverage for Your Auto, Home & Business",
    description: "Compare multiple top-rated insurers in minutes. Get custom policy coverages with maximum rate savings and rapid claim supports.",
    services: [
      { title: "Commercial General Liability", desc: "Shielding business owners from legal lawsuits and property damage.", icon: "fa-shield-halved" },
      { title: "Full-Coverage Auto Insurance", desc: "Roadside tow relief, low deductibles, and new car replacement options.", icon: "fa-car" },
      { title: "Home & Property Insurance", desc: "Securing your home frame, roof, and belongings from storm losses.", icon: "fa-house-lock" }
    ],
    unsplashCategory: "insurance house contract",
    unsplashId: "photo-1454165804606-c3d57bc86b40",
    cta: "Compare Free Quotes"
  },
  {
    id: "marketing",
    name: "GrowthScale Digital Marketing",
    category: "Professional Services",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-extrabold", bodyClass: "font-sans" },
    colors: { primary: "#4f46e5", secondary: "#f5f3ff", accent: "#10b981", neutral: "#0f172a" },
    slogan: "Dominate Google & Generate Predictable Leads",
    description: "Scale your revenue. We construct profit-driven search engine optimization, Google Ads, and custom conversion funnel campaigns.",
    services: [
      { title: "SEO Lead Dominance", desc: "Ranking your business website at the top of local maps searches.", icon: "fa-magnifying-glass-chart" },
      { title: "Pay-Per-Click Google Ads", desc: "Targeted advertisements that connect with buyers looking to buy now.", icon: "fa-bullseye" },
      { title: "Social Media Ads Setup", desc: "Creative photo and video campaigns on Instagram and Facebook.", icon: "fa-thumbs-up" }
    ],
    unsplashCategory: "digital marketing board",
    unsplashId: "photo-1460925895917-afdab827c52f",
    cta: "Request Marketing Audit"
  },
  {
    id: "coworking",
    name: "The Hub Coworking Spaces",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#090d16", secondary: "#f8fafc", accent: "#ff5a5f", neutral: "#090d16" },
    slogan: "Premium Shared Desks, Offices & Meeting Rooms",
    description: "Work productive in design-led shared workspaces. Equipped with ultra-fast gigabit internet, unlimited coffee, and quiet booths.",
    services: [
      { title: "Flexible Hot Desks", desc: "Walk in, plug in, and get to work inside cozy community spaces.", icon: "fa-laptop" },
      { title: "Private Lockable Offices", desc: "Dedicated, soundproof workspaces configured for teams of 2 to 10.", icon: "fa-door-closed" },
      { title: "Conference Rooms & TV", desc: "Professional boardrooms equipped with Apple TVs and video cameras.", icon: "fa-video" }
    ],
    unsplashCategory: "coworking office",
    unsplashId: "photo-1497366216548-37526070297c",
    cta: "Book Coworking Tour"
  },
  {
    id: "consultant",
    name: "Apex Business Consultants",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e293b", secondary: "#f8fafc", accent: "#3b82f6", neutral: "#0f172a" },
    slogan: "Streamline Operations & Accelerate Growth",
    description: "Eliminate bottleneck friction. We audit operations, integrate modern automation software, and structure management hierarchies.",
    services: [
      { title: "Workflow Automation audits", desc: "Replacing manual entries with Zapier, CRM integrations, and automated invoicing.", icon: "fa-code-fork" },
      { title: "Fractional COO Support", desc: "Weekly leadership meetings to keep your team aligned on business goals.", icon: "fa-user-tie" },
      { title: "Supply Chain Auditing", desc: "Renegotiating raw vendor costs to boost company net margins.", icon: "fa-boxes-packing" }
    ],
    unsplashCategory: "corporate meeting board",
    unsplashId: "photo-1522071820081-009f0129c71c",
    cta: "Schedule Operations Audit"
  },
  {
    id: "web-designer",
    name: "PixelCraft Web Studios",
    category: "Professional Services",
    layout: "Layout_C",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#4f46e5", secondary: "#faf5ff", accent: "#a855f7", neutral: "#0f172a" },
    slogan: "Stunning, High-Conversion Custom Web Design",
    description: "We build websites that double as automatic lead machines. Fully custom layouts, optimized page speed, and seamless copywriting.",
    services: [
      { title: "UX/UI Design & Prototyping", desc: "Interactive Figma mockups detailing customer visual pathways.", icon: "fa-compass-drafting" },
      { title: "Tailwind CSS & Webflow Builds", desc: "Fast-loading, clean-coded custom website themes built for SEO.", icon: "fa-code" },
      { title: "Conversion Optimization Audits", desc: "Reworking headlines and form placements to double user signs.", icon: "fa-chart-simple" }
    ],
    unsplashCategory: "designer desk figma",
    unsplashId: "photo-1581291518633-83b4ebd1d83e",
    cta: "Get Custom Website Mockup"
  },
  {
    id: "it-support",
    name: "Apex Net IT Solutions",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0b3c5d", secondary: "#f4f8fa", accent: "#328cc1", neutral: "#1d2731" },
    slogan: "Reliable Managed IT Support & Cyber Security",
    description: "Outsource your IT troubles. We handle office server network installation, cloud data backup, and employee device security monitoring.",
    services: [
      { title: "Managed IT Support Helpdesk", desc: "Rapid remote support solving software errors and device issues.", icon: "fa-headset" },
      { title: "Cloud Sever Data Backups", desc: "Automated, encrypted data backups ensuring zero ransomware losses.", icon: "fa-cloud-arrow-up" },
      { title: "Office Cybersecurity Audits", desc: "Advanced firewalls, password managers, and network locks.", icon: "fa-shield-halved" }
    ],
    unsplashCategory: "server room computers",
    unsplashId: "photo-1558494949-ef010cbdcc31",
    cta: "Request IT Audit"
  },

  // ==================== HOSPITALITY & LEISURE (10) ====================
  {
    id: "boutique-hotel",
    name: "Lumière Boutique Hotel",
    category: "Hospitality & Leisure",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-semibold", bodyClass: "font-sans" },
    colors: { primary: "#111827", secondary: "#fcf8f2", accent: "#d4af37", neutral: "#111827" },
    slogan: "Luxury Rest Inside Our Historic Guest Rooms",
    description: "Welcome to a sensory sanctuary. Set inside a restored 1800s stone mansion, our hotel balances historical details with modern luxury.",
    services: [
      { title: "Bespoke Guest Rooms", desc: "Soaking tubs, plush Belgian linens, and private garden patio views.", icon: "fa-bed" },
      { title: "Chef's Tasting Terrace", desc: "Enjoy organic morning coffees and locally sourced seasonal sharing plates.", icon: "fa-champagne-glasses" },
      { title: "Private Spa & Sauna Pools", desc: "Relax inside underground stone cold-plunge pools and dry saunas.", icon: "fa-spa" }
    ],
    unsplashCategory: "boutique hotel room",
    unsplashId: "photo-1566073771259-6a8506099945",
    cta: "Book Guest Room"
  },
  {
    id: "bed-breakfast",
    name: "Millbrook Bed & Breakfast",
    category: "Hospitality & Leisure",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold italic", bodyClass: "font-sans" },
    colors: { primary: "#7c2d12", secondary: "#fdf8f5", accent: "#c2410c", neutral: "#1c1917" },
    slogan: "Your Cozy Countryside Getaway Escape",
    description: "Nestled along a running creek, our guest lodge offers quiet fireplaces, beautiful walking paths, and fresh hot breakfasts cooked to order.",
    services: [
      { title: "Fireplace Guest Suites", desc: "Quaint suites featuring stone fireplaces and wood-beam ceilings.", icon: "fa-fire" },
      { title: "Hot Farmhouse Breakfasts", desc: "Fresh buttermilk pancakes, local eggs, and homemade berry jams.", icon: "fa-mug-hot" },
      { title: "Creek Walking Trails", desc: "Explore acres of quiet private forest trails and trout fishing pools.", icon: "fa-person-hiking" }
    ],
    unsplashCategory: "cozy bed breakfast lodge",
    unsplashId: "photo-1544644181-1484b3fdfc62",
    cta: "Reserve Weekend Getaway"
  },
  {
    id: "event-venue",
    name: "The Grand Loft Venue",
    category: "Hospitality & Leisure",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e1b4b", secondary: "#fbfbfe", accent: "#db2777", neutral: "#09090b" },
    slogan: "Stunning Industrial Loft for Weddings & Parties",
    description: "A blank canvas for your imagination. Featuring high exposed brick walls, timber wood columns, and massive sun-facing factory windows.",
    services: [
      { title: "Wedding Ceremonies & Galas", desc: "Capacity up to 250 seated guests, complete with dancefloor lighting.", icon: "fa-glass-cheers" },
      { title: "Corporate Presentation Stages", desc: "Gigantic projector screen walls, microphone setups, and audio controls.", icon: "fa-screen-users" },
      { title: "Cocktail Lounge Bars", desc: "Integrated black marble bars staffed by professional mixologists.", icon: "fa-wine-glass" }
    ],
    unsplashCategory: "loft event venue",
    unsplashId: "photo-1519167758481-83f550bb49b3",
    cta: "Check Venue Availability"
  },
  {
    id: "art-gallery",
    name: "Canvas & Clay Art Gallery",
    category: "Hospitality & Leisure",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-medium", bodyClass: "font-sans" },
    colors: { primary: "#0f172a", secondary: "#fafafa", accent: "#4f46e5", neutral: "#0f172a" },
    slogan: "Contemporary Fine Art & Sculptures Exhibit",
    description: "Showcasing rotating monthly exhibitions of paintings, fine ceramics, and metal sculptures created by leading local and global artists.",
    services: [
      { title: "Contemporary Art Exhibits", desc: "Explore curated oil paintings and graphic design displays.", icon: "fa-palette" },
      { title: "Private Gallery Tours", desc: "guided walks detailing the artistic concepts and artist backstories.", icon: "fa-user-group" },
      { title: "Art Acquisition Advising", desc: "Help locating the perfect painting for custom home designs.", icon: "fa-cart-shopping" }
    ],
    unsplashCategory: "art gallery painting",
    unsplashId: "photo-1579783900882-c0d3dad7b119",
    cta: "View Exhibitions Schedule"
  },
  {
    id: "sports-club",
    name: "Riverside Tennis & Country Club",
    category: "Hospitality & Leisure",
    layout: "Layout_A",
    fonts: { heading: "Cabinet Grotesk", body: "Inter", headingClass: "font-sans font-extrabold uppercase", bodyClass: "font-sans" },
    colors: { primary: "#166534", secondary: "#f0fdf4", accent: "#86efac", neutral: "#064e3b" },
    slogan: "Premium Clay Tennis Courts & Pool Club",
    description: "Welcome to premier recreation. Enjoy our 8 outdoor clay tennis courts, heated lap pool, and lakeside dining patio.",
    services: [
      { title: "Clay Court Tennis Matches", desc: "Play on watered and swept clay courts that reduce joint fatigue.", icon: "fa-table-tennis-paddle-ball" },
      { title: "Pro Instructor Lessons", desc: "Private tennis serve and forehand clinics taught by certified USPTA pros.", icon: "fa-graduation-cap" },
      { title: "Heated Pool & Lounges", desc: "Swim laps or relax inside luxury private poolside cabanas.", icon: "fa-water" }
    ],
    unsplashCategory: "tennis court green",
    unsplashId: "photo-1626224583764-f87db24ac4ea",
    cta: "Apply For Membership"
  },
  {
    id: "climbing-gym",
    name: "Summit Rock Climbing Gym",
    category: "Hospitality & Leisure",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#27272a", accent: "#e11d48", neutral: "#0c0a09" },
    slogan: "Reach New Heights. Over 180 Bouldering Routes.",
    description: "Get active. Features 45-foot high climbing walls, autobelays, lead arches, and weekly routesetting to challenge your grip.",
    services: [
      { title: "Bouldering & Lead Walls", desc: "thick padded floors, high quality climbing holds, and autobelays.", icon: "fa-mountain-climbing" },
      { title: "Intro To Belay Courses", desc: "Learn essential harness knots and rope safety checks from pros.", icon: "fa-square-check" },
      { title: "Youth Climbing Teams", desc: "Guided weekly fitness climbing courses designed to build child grip.", icon: "fa-children" }
    ],
    unsplashCategory: "rock climbing wall",
    unsplashId: "photo-1522163182402-834f871fd851",
    cta: "Get Day Pass Now"
  },
  {
    id: "dance-studio",
    name: "Prism Dance & Ballet Studio",
    category: "Hospitality & Leisure",
    layout: "Layout_C",
    fonts: { heading: "Playfair Display", body: "Plus Jakarta Sans", headingClass: "font-serif font-bold italic", bodyClass: "font-sans" },
    colors: { primary: "#be185d", secondary: "#fff1f2", accent: "#f472b6", neutral: "#1f2937" },
    slogan: "Graceful Ballet & Modern Contemporary Dance",
    description: "Discover the joy of movement. We host beginner to pre-professional classes in ballet, contemporary, hip-hop, and jazz.",
    services: [
      { title: "Classical Ballet Programs", desc: "Structured barre work, extensions, and pointe technique classes.", icon: "fa-shoe-prints" },
      { title: "Jazz & Hip-Hop Beats", desc: "Energetic, choreography-focused dance sessions to boost stamina.", icon: "fa-music" },
      { title: "Youth Performance Recitals", desc: "Immersive annual stage recitals showcasing student choreographies.", icon: "fa-masks-theater" }
    ],
    unsplashCategory: "ballet dancer",
    unsplashId: "photo-1508700115892-45ecd05ae2ad",
    cta: "Book Trial Dance Class"
  },
  {
    id: "photography",
    name: "Apex Studio Photography",
    category: "Hospitality & Leisure",
    layout: "Layout_C",
    fonts: { heading: "Plus Jakarta Sans", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#171717", secondary: "#fafafa", accent: "#6366f1", neutral: "#0a0a0a" },
    slogan: "Capturing Authentic Moments That Tell Your Story",
    description: "High-end portraiture, editorial fashion shoots, and candid wedding photography captured by experienced visual storytellers.",
    services: [
      { title: "Bespoke Portraits & Headshots", desc: "Professional studio lighting headshots for modeling and resumes.", icon: "fa-camera-retro" },
      { title: "Candid Wedding Photography", desc: "Complete event coverage capturing raw emotional moments cleanly.", icon: "fa-heart" },
      { title: "Commercial Product Shoots", desc: "High-contrast product photos optimized for Shopify stores.", icon: "fa-shirt" }
    ],
    unsplashCategory: "photography camera lens",
    unsplashId: "photo-1516035069371-29a1b244cc32",
    cta: "Schedule Photoshoot Call"
  },
  {
    id: "car-rental",
    name: "Prestige Exotic Car Rentals",
    category: "Hospitality & Leisure",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#dc2626", secondary: "#222222", accent: "#ffffff", neutral: "#0b0b0b" },
    slogan: "Rent Your Dream Exotic Supercar Today",
    description: "Drive in ultimate style. Choose from our pristine collection of Lamborghinis, Ferraris, Porsches, and luxury SUVs.",
    services: [
      { title: "Exotic Supercar Rental", desc: "Experience raw horsepower behind Ferrari or Lamborghini wheels.", icon: "fa-car-side" },
      { title: "VIP Airport Deliveries", desc: "Get your luxury car dropped directly at the private jet terminal hanger.", icon: "fa-plane" },
      { title: "Weddings & Video Shoots", desc: "Chauffeur services and static rentals configured for events.", icon: "fa-video" }
    ],
    unsplashCategory: "red sports car lamborghini",
    unsplashId: "photo-1525609004556-c46c7d6cf0a3",
    cta: "Book Your Supercar"
  },
  {
    id: "yacht-charter",
    name: "Metropolitan Luxury Yacht Charters",
    category: "Hospitality & Leisure",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0b3c5d", secondary: "#f0f8ff", accent: "#328cc1", neutral: "#0d2731" },
    slogan: "Bespoke Ocean Yacht Charters & Sunset Cruises",
    description: "Sail away in luxury. We host private island tours, business corporate events, and sunset champagne cruises on premium yachts.",
    services: [
      { title: "Private Day Charters", desc: "Bespoke ocean cruises complete with jet skis and captain crews.", icon: "fa-ship" },
      { title: "Sunset Champagne Parties", desc: "Sip cold champagne while watching the ocean sun dip below horizons.", icon: "fa-glass-water" },
      { title: "Multi-Day Island Cruises", desc: "Immersive island hopping routes with luxury stateroom beds.", icon: "fa-anchor" }
    ],
    unsplashCategory: "luxury yacht ocean",
    unsplashId: "photo-1567899378494-47b22a2ae96a",
    cta: "Book Yacht Charter"
  },
  {
    id: "window-cleaner",
    name: "ClearView Window Cleaning",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Outfit", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#f59e0b", neutral: "#1e293b" },
    slogan: "Spotless, Streak-Free Window Cleaning Services",
    description: "Get crystal-clear views for your home or storefront. We provide safe, fully insured window washing and screen detailing services.",
    services: [
      { title: "Residential Window Washing", desc: "Streak-free exterior and interior cleaning of all home windows.", icon: "fa-sun" },
      { title: "Commercial Window Detailing", desc: "Regular cleaning of storefront glass, display windows, and office glazing.", icon: "fa-building" },
      { title: "Screen & Track Detailing", desc: "Removing dust, pollen, and debris from window frames and tracks.", icon: "fa-broom" }
    ],
    unsplashCategory: "window washing glass",
    unsplashId: "photo-1527689368864-3a821dbccc34",
    cta: "Request Window Wash"
  },
  {
    id: "pressure-washer",
    name: "Apex Pressure Washing",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0369a1", secondary: "#f0f9ff", accent: "#22c55e", neutral: "#111827" },
    slogan: "Restore Your Home's Curb Appeal Instantly",
    description: "Professional pressure and soft washing services that remove dirt, mold, and stains from siding, driveways, decks, and roofs.",
    services: [
      { title: "House Siding Soft Wash", desc: "Low-pressure chemical wash that cleans vinyl, brick, and stucco safely.", icon: "fa-soap" },
      { title: "Driveway & Patio Cleaning", desc: "High-pressure concrete cleaning to erase deep oil stains and grime.", icon: "fa-soap" },
      { title: "Deck & Fence Restoration", desc: "Clearing dirt and gray fibers from wood before staining or painting.", icon: "fa-brush" }
    ],
    unsplashCategory: "pressure washing house",
    unsplashId: "photo-1581578731548-c64695cc6952",
    cta: "Book Pressure Wash"
  },
  {
    id: "moving-company",
    name: "Apex Moving Specialists",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#ea580c", secondary: "#fff7ed", accent: "#2563eb", neutral: "#1e293b" },
    slogan: "Stress-Free Residential & Commercial Moving",
    description: "Licensed and insured movers on standby. We pack, load, transport, and unpack your belongings with care and precision.",
    services: [
      { title: "Full-Service Packing", desc: "Wrapping fragile items and boxing belongings securely with labels.", icon: "fa-box-open" },
      { title: "Residential Home Moving", desc: "Prompt loading and clean transport of furniture to your new home.", icon: "fa-truck" },
      { title: "Secure Storage Options", desc: "Climate-controlled storage units for short-term or long-term needs.", icon: "fa-warehouse" }
    ],
    unsplashCategory: "moving truck cardboard boxes",
    unsplashId: "photo-1600585154526-990dced4db0d",
    cta: "Get Free Moving Quote"
  },
  {
    id: "auto-detailer",
    name: "Apex Auto Detailing",
    category: "Home & Trade Services",
    layout: "Layout_D",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-black uppercase italic", bodyClass: "font-sans" },
    colors: { primary: "#e11d48", secondary: "#1e293b", accent: "#ffffff", neutral: "#0f172a" },
    slogan: "Premium Mobile Detailing & Ceramic Coatings",
    description: "Restore your vehicle's factory shine. We provide deep interior cleaning, paint corrections, and professional ceramic coating applications.",
    services: [
      { title: "Signature Interior Clean", desc: "Steam clean carpets, sanitize dashboard, and condition leather seats.", icon: "fa-soap" },
      { title: "Multi-Stage Paint Correction", desc: "Polishing away fine swirl marks, scratches, and clear-coat oxidations.", icon: "fa-paint-roller" },
      { title: "Professional Ceramic Coating", desc: "Ultra-hard hydrophobic shield that protects paint from UV and grit.", icon: "fa-shield" }
    ],
    unsplashCategory: "car detailing wash",
    unsplashId: "photo-1607860108855-64acf2078ed9",
    cta: "Book Auto Detail"
  },
  {
    id: "mechanic",
    name: "Apex Automotive Repair",
    category: "Home & Trade Services",
    layout: "Layout_A",
    fonts: { heading: "Barlow", body: "Inter", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1d4ed8", secondary: "#eff6ff", accent: "#f59e0b", neutral: "#1e293b" },
    slogan: "Honest, Certified Auto Repair & Diagnostics",
    description: "Is your check engine light on? From brake repairs to engine tune-ups, our certified technicians get you back on the road safely.",
    services: [
      { title: "Certified Brake Service", desc: "Replacing pads, rotors, and calipers to ensure firm stopping power.", icon: "fa-screwdriver" },
      { title: "Check Engine Diagnostics", desc: "Scanning computer codes to resolve sensor and engine errors.", icon: "fa-desktop" },
      { title: "Engine Tune-Ups & Filters", desc: "Oil changes, spark plug replacements, and coolant flushes.", icon: "fa-oil-can" }
    ],
    unsplashCategory: "auto mechanic wrench",
    unsplashId: "photo-1486006920555-c77dce18193b",
    cta: "Book Auto Repair"
  },
  {
    id: "pediatrician",
    name: "HappyKids Pediatrics",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#22c55e", neutral: "#1e293b" },
    slogan: "Compassionate, Quality Pediatric Care for Your Child",
    description: "Providing comprehensive well-child checkups, immunizations, and prompt same-day sick visits in a welcoming, kid-friendly environment.",
    services: [
      { title: "Well-Child Checkups", desc: "Tracking growth, motor skills, speech development, and nutrition.", icon: "fa-child" },
      { title: "Childhood Vaccinations", desc: "Safe, up-to-date immunizations protecting your children from diseases.", icon: "fa-syringe" },
      { title: "Same-Day Emergency Sick Visits", desc: "Fast appointments to diagnose ear infections, fevers, and coughs.", icon: "fa-stethoscope" }
    ],
    unsplashCategory: "pediatrician child exam",
    unsplashId: "photo-1581888227599-779811939961",
    cta: "Schedule Child Visit"
  },
  {
    id: "pediatric-dentist",
    name: "LittleSmiles Pediatric Dentistry",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Outfit", body: "Plus Jakarta Sans", headingClass: "font-sans font-bold", bodyClass: "font-sans" },
    colors: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#f43f5e", neutral: "#0f172a" },
    slogan: "Making Dental Visits Fun & Anxiety-Free for Kids",
    description: "Specialized pediatric dental care focusing on cavity prevention, gentle cleanings, and building positive dental habits for life.",
    services: [
      { title: "Cavity Prevention & Sealants", desc: "Protective coatings that lock out sugars and prevent decay on back teeth.", icon: "fa-tooth" },
      { title: "Gentle Cleanings & Flossings", desc: "Fun, patient cleaning sessions designed to make kids comfortable.", icon: "fa-face-smile" },
      { title: "Emergency Kids Dentistry", desc: "Relief for chipped teeth, severe toothaches, or lost crowns.", icon: "fa-circle-check" }
    ],
    unsplashCategory: "pediatric dentist children",
    unsplashId: "photo-1598256989800-fe5f95da9787",
    cta: "Book Free Child Exam"
  },
  {
    id: "med-spa",
    name: "Zenith Medical Spa",
    category: "Medical & Wellness",
    layout: "Layout_B",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#db2777", secondary: "#fdf2f8", accent: "#ca8a04", neutral: "#1f2937" },
    slogan: "Advanced Aesthetic Treatments & Skin Rejuvenation",
    description: "Rejuvenate your natural beauty. We provide medical-grade Botox, laser hair removals, dermal fillers, and clinical skin tightening.",
    services: [
      { title: "Botox & Dermal Fillers", desc: "Smoothing wrinkles and restoring facial volume under professional care.", icon: "fa-syringe" },
      { title: "Clinical Laser Hair Removal", desc: "Permanent hair reduction using safe, dual-wavelength cooling lasers.", icon: "fa-bolt-lightning" },
      { title: "Custom Chemical Skin Peels", desc: "Exfoliating skin layers to target dark spots, fine lines, and acne scars.", icon: "fa-droplet" }
    ],
    unsplashCategory: "medical spa skin care",
    unsplashId: "photo-1512290923902-8a9f81dc236c",
    cta: "Schedule Aesthetic Consult"
  },
  {
    id: "florist",
    name: "BellaFlora Florist",
    category: "Hospitality & Leisure",
    layout: "Layout_E",
    fonts: { heading: "Playfair Display", body: "Instrument Sans", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#701a75", secondary: "#fdf4ff", accent: "#c084fc", neutral: "#1e1b4b" },
    slogan: "Hand-Crafted Floral Arrangements for Every Moment",
    description: "Beautiful, fresh-cut local flowers arranged by master florists for weddings, special celebrations, or to brighten someone's day.",
    services: [
      { title: "Custom Wedding Flowers", desc: "Bridal bouquets, table centerpieces, and arch arrangements custom-fit.", icon: "fa-leaf" },
      { title: "Celebration Bouquets", desc: "Vibrant designs loaded with roses, lilies, and seasonal greens.", icon: "fa-gift" },
      { title: "Weekly Floral Deliveries", desc: "Fresh seasonal floral vases delivered directly to homes or offices.", icon: "fa-truck" }
    ],
    unsplashCategory: "flowers florist shop",
    unsplashId: "photo-1526047932273-341f2a7631f9",
    cta: "Order Fresh Flowers"
  },
  {
    id: "funeral-home",
    name: "Apex Memorial & Funeral Home",
    category: "Professional Services",
    layout: "Layout_A",
    fonts: { heading: "Playfair Display", body: "Inter", headingClass: "font-serif font-bold", bodyClass: "font-sans" },
    colors: { primary: "#1e293b", secondary: "#f8fafc", accent: "#94a3b8", neutral: "#0f172a" },
    slogan: "Compassionate, Dignified Memorial & Funeral Services",
    description: "We are here to support you through difficult times. Providing quiet, respectful memorial planning, pre-arrangements, and cremation services.",
    services: [
      { title: "Dignified Funeral Services", desc: "Traditional viewings, chapels, graveside services, and coordinates.", icon: "fa-monument" },
      { title: "Complete Cremations", desc: "Secure cremation procedures, urn options, and private family memorial services.", icon: "fa-fire" },
      { title: "Advanced Pre-Planning", desc: "Locking in service preferences to relieve future family decision burdens.", icon: "fa-clipboard-check" }
    ],
    unsplashCategory: "memorial funeral home",
    unsplashId: "photo-1544164962-d49a5624d164",
    cta: "Contact Memorial Director"
  }
];

// Helper function to render the layout base
function compileTemplate(niche) {
  const fontPairLink = `https://fonts.googleapis.com/css2?family=${niche.fonts.heading.replace(' ', '+')}:wght@400;600;800;900&family=${niche.fonts.body.replace(' ', '+')}:wght@300;400;500;700&display=swap`;

  let heroHTML = '';

  // Layout A: Left-Aligned Split Hero (Trades & Professional Services)
  if (niche.layout === 'Layout_A') {
    heroHTML = `
      <section class="py-16 md:py-24 bg-white">
        <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <span class="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full uppercase tracking-wider">${niche.category}</span>
            <h1 class="${niche.fonts.headingClass} text-4xl lg:text-5xl text-neutral leading-tight">
              ${niche.slogan}
            </h1>
            <p class="text-slate-600 text-lg leading-relaxed">
              ${niche.description}
            </p>
            <div class="flex flex-wrap gap-4 pt-2">
              <a href="tel:{{PHONE}}" class="btn btn-primary bg-primary text-white border-none hover:bg-opacity-90 px-8 py-3 rounded-lg shadow-lg font-semibold flex items-center gap-2">
                <i class="fa-solid fa-phone"></i> Call Now
              </a>
              <a href="#contact" class="btn btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold">
                Send Message
              </a>
            </div>
            <div class="flex items-center gap-6 pt-4 border-t border-slate-100">
              <div class="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <i class="fa-solid fa-circle-check text-green-500"></i> Fully Licensed
              </div>
              <div class="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <i class="fa-solid fa-circle-check text-green-500"></i> Free Estimates
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-primary/5 rounded-2xl transform translate-x-3 translate-y-3 -z-10"></div>
            <img src="https://images.unsplash.com/${niche.unsplashId}?auto=format&fit=crop&w=800&q=80" alt="${niche.name}" class="w-full h-[450px] object-cover rounded-2xl shadow-xl">
            <div class="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
              <div class="bg-primary/10 p-3 rounded-full text-primary">
                <i class="fa-solid fa-quote-left text-xl"></i>
              </div>
              <div>
                <p class="text-xs text-slate-500 italic">"Highly professional and prompt response!"</p>
                <div class="flex items-center gap-1 mt-1 text-xs text-amber-500">
                  <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                  <span class="text-slate-800 font-bold ml-1">5.0 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  } 
  // Layout B: Centered Minimalist Glassmorphic (Medical & Wellness)
  else if (niche.layout === 'Layout_B') {
    heroHTML = `
      <section class="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-secondary/50 via-white to-white">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div class="container mx-auto px-6 text-center max-w-4xl space-y-8">
          <span class="px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full uppercase tracking-wider">${niche.category}</span>
          <h1 class="${niche.fonts.headingClass} text-4xl md:text-6xl text-neutral leading-tight">
            ${niche.slogan}
          </h1>
          <p class="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            ${niche.description}
          </p>
          <div class="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#appointment" class="btn btn-primary bg-primary text-white border-none hover:bg-opacity-90 px-8 py-3 rounded-lg shadow-lg font-semibold flex items-center gap-2">
              <i class="fa-solid fa-calendar-check"></i> ${niche.cta}
            </a>
            <a href="tel:{{PHONE}}" class="btn btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
              <i class="fa-solid fa-phone"></i> Call {{PHONE}}
            </a>
          </div>
          <div class="pt-12">
            <img src="https://images.unsplash.com/${niche.unsplashId}?auto=format&fit=crop&w=1200&q=80" alt="${niche.name}" class="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-2xl border border-white">
          </div>
        </div>
      </section>
    `;
  }
  // Layout C: Asymmetrical Grid Showcase (Beauty & Design Studios)
  else if (niche.layout === 'Layout_C') {
    heroHTML = `
      <section class="py-16 md:py-24 bg-secondary/30">
        <div class="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-5 space-y-6">
            <span class="px-3 py-1 bg-white text-primary text-xs font-semibold rounded-full uppercase tracking-wider shadow-sm">${niche.category}</span>
            <h1 class="${niche.fonts.headingClass} text-4xl md:text-5xl text-neutral leading-tight">
              ${niche.slogan}
            </h1>
            <p class="text-slate-600 text-lg leading-relaxed">
              ${niche.description}
            </p>
            <div class="pt-4">
              <a href="#booking" class="btn btn-primary bg-primary text-white border-none hover:bg-opacity-90 px-10 py-4 rounded-full shadow-xl font-semibold text-lg flex items-center justify-center gap-2 md:inline-flex">
                ${niche.cta} <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div class="lg:col-span-7 grid grid-cols-12 gap-4">
            <div class="col-span-7 space-y-4">
              <img src="https://images.unsplash.com/${niche.unsplashId}?auto=format&fit=crop&w=600&q=80" alt="${niche.name}" class="w-full h-[350px] object-cover rounded-2xl shadow-lg">
              <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-2">
                <h4 class="font-bold text-neutral">Award-Winning Quality</h4>
                <p class="text-xs text-slate-500">Curating styles that compliment your natural identity and boost your personal confidence.</p>
              </div>
            </div>
            <div class="col-span-5 pt-8">
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80" alt="Atmosphere" class="w-full h-[400px] object-cover rounded-2xl shadow-lg">
            </div>
          </div>
        </div>
      </section>
    `;
  }
  // Layout D: Dark-Mode Accentuated (Bars, Gyms, Heavy Trades)
  else if (niche.layout === 'Layout_D') {
    heroHTML = `
      <section class="relative py-24 md:py-32 bg-neutral text-white overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center opacity-20 -z-10" style="background-image: url('https://images.unsplash.com/${niche.unsplashId}?auto=format&fit=crop&w=1600&q=80');"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/95 to-transparent -z-10"></div>
        <div class="container mx-auto px-6 max-w-4xl space-y-8">
          <span class="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full uppercase tracking-wider">${niche.category}</span>
          <h1 class="${niche.fonts.headingClass} text-4xl md:text-7xl text-white leading-none">
            ${niche.slogan}
          </h1>
          <p class="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl">
            ${niche.description}
          </p>
          <div class="flex flex-wrap gap-4 pt-4">
            <a href="tel:{{PHONE}}" class="btn btn-primary bg-primary text-white border-none hover:bg-opacity-90 px-8 py-3 rounded-lg shadow-lg font-semibold flex items-center gap-2">
              <i class="fa-solid fa-phone"></i> Call {{PHONE}}
            </a>
            <a href="#booking" class="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-neutral px-8 py-3 rounded-lg font-semibold">
              ${niche.cta}
            </a>
          </div>
          <div class="grid grid-cols-3 gap-6 pt-12 border-t border-white/10 max-w-2xl">
            <div>
              <p class="text-3xl md:text-4xl font-bold text-accent">100%</p>
              <p class="text-xs text-slate-400 mt-1 uppercase">Satisfaction Guarantee</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-bold text-accent">24/7</p>
              <p class="text-xs text-slate-400 mt-1 uppercase">Customer Dispatch</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-bold text-accent">5-Star</p>
              <p class="text-xs text-slate-400 mt-1 uppercase">Google Reviews</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  // Layout E: Soft-Curved Organic Story (Bakeries, Florists, Cafes, Winery)
  else {
    heroHTML = `
      <section class="py-16 md:py-24 bg-[#fffdfa]">
        <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div class="space-y-6">
            <span class="text-primary text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <i class="fa-solid fa-leaf"></i> ${niche.category}
            </span>
            <h1 class="${niche.fonts.headingClass} text-4xl lg:text-5xl text-neutral leading-tight">
              ${niche.slogan}
            </h1>
            <p class="text-slate-600 text-lg leading-relaxed">
              ${niche.description}
            </p>
            <div class="pt-4 flex items-center gap-6">
              <a href="#menu" class="btn btn-primary bg-primary text-white border-none hover:bg-opacity-90 px-8 py-3 rounded-full shadow-lg font-semibold">
                ${niche.cta}
              </a>
              <a href="#story" class="text-neutral font-semibold hover:underline flex items-center gap-2">
                Our Story <i class="fa-solid fa-chevron-right text-xs"></i>
              </a>
            </div>
          </div>
          <div class="relative">
            <div class="w-full h-[500px] overflow-hidden rounded-t-[250px] rounded-b-2xl shadow-xl">
              <img src="https://images.unsplash.com/${niche.unsplashId}?auto=format&fit=crop&w=800&q=80" alt="${niche.name}" class="w-full h-full object-cover">
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Compile full HTML structure
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{BUSINESS_NAME}} - ${niche.name}</title>
  <meta name="description" content="${niche.slogan}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontPairLink}" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${niche.colors.primary}',
            secondary: '${niche.colors.secondary}',
            accent: '${niche.colors.accent}',
            neutral: '${niche.colors.neutral}'
          },
          fontFamily: {
            sans: ['${niche.fonts.body}', 'sans-serif'],
            serif: ['${niche.fonts.heading}', 'serif']
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: '${niche.fonts.body}', sans-serif;
    }
    h1, h2, h3, h4 {
      font-family: '${niche.fonts.heading}', ${niche.layout === 'Layout_E' || niche.layout === 'Layout_B' ? 'serif' : 'sans-serif'};
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen pb-16 md:pb-0">

  <!-- Navigation -->
  <nav class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" class="text-2xl font-bold text-neutral flex items-center gap-2">
        <i class="fa-solid fa-house-medical text-primary"></i>
        <span>{{BUSINESS_NAME}}</span>
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a href="#services" class="text-sm font-semibold text-slate-600 hover:text-primary">Services</a>
        <a href="#about" class="text-sm font-semibold text-slate-600 hover:text-primary">About Us</a>
        <a href="#contact" class="text-sm font-semibold text-slate-600 hover:text-primary">Contact</a>
      </div>
      <a href="tel:{{PHONE}}" class="hidden md:inline-flex btn bg-primary hover:bg-opacity-95 text-white border-none px-6 py-2 rounded-lg font-semibold items-center gap-2 shadow-md">
        <i class="fa-solid fa-phone"></i> {{PHONE}}
      </a>
    </div>
  </nav>

  <!-- Hero Section -->
  ${heroHTML}

  <!-- Services Section -->
  <section id="services" class="py-16 md:py-24 bg-slate-50">
    <div class="container mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span class="text-primary text-xs font-bold uppercase tracking-wider">What We Offer</span>
        <h2 class="text-3xl md:text-4xl text-neutral font-black">Our Professional Services</h2>
        <p class="text-slate-500">Highly qualified technicians and specialized treatments customized for your immediate requirements.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${niche.services.map(srv => `
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div class="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <i class="fa-solid ${srv.icon} text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-neutral mb-3">${srv.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">${srv.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-16 md:py-24 bg-white border-y border-slate-100">
    <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="order-2 md:order-1">
        <img src="https://images.unsplash.com/photo-15522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="About Us" class="w-full h-[400px] object-cover rounded-2xl shadow-md">
      </div>
      <div class="space-y-6 order-1 md:order-2">
        <span class="text-primary text-xs font-bold uppercase tracking-wider">Our Story</span>
        <h2 class="text-3xl md:text-4xl text-neutral font-black">Why Choose {{BUSINESS_NAME}}?</h2>
        <p class="text-slate-600 leading-relaxed">
          We have served our community for years, providing reliable local solutions. Every member of our team is fully vetted, licensed, and trained to the highest safety and visual standards.
        </p>
        <ul class="space-y-3">
          <li class="flex items-center gap-3 text-slate-700">
            <i class="fa-solid fa-check text-green-500"></i> Local, community-trusted business
          </li>
          <li class="flex items-center gap-3 text-slate-700">
            <i class="fa-solid fa-check text-green-500"></i> Certified experts and state-of-the-art tooling
          </li>
          <li class="flex items-center gap-3 text-slate-700">
            <i class="fa-solid fa-check text-green-500"></i> Full satisfaction guarantee and robust warranties
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-16 md:py-24 bg-slate-50">
    <div class="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="space-y-8">
        <div class="space-y-4">
          <span class="text-primary text-xs font-bold uppercase tracking-wider">Get In Touch</span>
          <h2 class="text-3xl md:text-4xl text-neutral font-black">Reach Out To Us Today</h2>
          <p class="text-slate-500">Need immediate help or looking to book a service estimate? Fill out our form, or call directly!</p>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
              <i class="fa-solid fa-phone"></i>
            </div>
            <div>
              <p class="text-xs text-slate-400">Phone Support</p>
              <a href="tel:{{PHONE}}" class="font-bold text-neutral hover:underline">{{PHONE}}</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div>
              <p class="text-xs text-slate-400">Email Address</p>
              <a href="mailto:{{EMAIL}}" class="font-bold text-neutral hover:underline">{{EMAIL}}</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <p class="text-xs text-slate-400">Office Location</p>
              <p class="font-bold text-neutral">{{ADDRESS}}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <h3 class="text-xl font-bold text-neutral">Send Us A Message</h3>
        <form class="space-y-4" onsubmit="event.preventDefault(); alert('Personalized demo mode: Form input active!');">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Your Name</label>
              <input type="text" placeholder="John Doe" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" required>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
              <input type="tel" placeholder="(555) 000-0000" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" required>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
            <input type="email" placeholder="john@example.com" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" required>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">How can we help?</label>
            <textarea placeholder="Tell us about your requirements..." rows="4" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" required></textarea>
          </div>
          <button type="submit" class="w-full btn btn-primary bg-primary text-white border-none hover:bg-opacity-95 py-3 rounded-lg font-bold shadow-md">
            Submit Message
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-neutral text-white py-12 border-t border-white/5">
    <div class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-center md:text-left space-y-2">
        <p class="text-xl font-bold">{{BUSINESS_NAME}}</p>
        <p class="text-xs text-slate-400">${niche.slogan}</p>
      </div>
      <p class="text-xs text-slate-500">&copy; 2026 {{BUSINESS_NAME}}. All Rights Reserved.</p>
    </div>
  </footer>

  <!-- Bottom Mobile Sticky Call CTA -->
  <div class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur border-t border-slate-100 md:hidden flex justify-between items-center shadow-lg">
    <div class="text-xs font-semibold text-slate-800">Need immediate help?</div>
    <a href="tel:{{PHONE}}" class="btn btn-sm btn-primary bg-primary text-white border-none flex items-center gap-2">
      <i class="fa-solid fa-phone"></i> Call Now
    </a>
  </div>

</body>
</html>`;
}

// Generate all 100 templates
console.log(`Starting raw template generation. Niches configured: ${niches.length}`);

niches.forEach(niche => {
  const folderPath = path.join(outputDir, niche.id);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const htmlContent = compileTemplate(niche);
  const filePath = path.join(folderPath, 'index.html');
  
  fs.writeFileSync(filePath, htmlContent);
  console.log(`Generated template [${niche.id}]: ${filePath}`);
});

console.log('All raw templates successfully generated!');
