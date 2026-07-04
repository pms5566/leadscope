// ==========================================
// MYRAJPURA.COM - APPLICATION SCRIPT
// ==========================================

// --- MOCK DATABASE DEFAULTS ---
const DEFAULT_NEWS = [
  {
    id: 5,
    category: "Municipal",
    badgeClass: "bg-brandBlue text-white",
    title: "Fwara Chowk Beautification Project Completed; Fountain Restored",
    summary: "The Municipal Committee of Rajpura completed the landscape renovation at Fwara Chowk. The iconic central water fountain has been restored with new decorative lighting.",
    date: "June 25, 2026",
    readTime: "2 min read",
    image: "fwara_chowk.png",
    content: "The landmark Fwara Chowk (Fountain Roundabout) in Rajpura has officially reopened to the public following a month-long beautification project. The Municipal Committee restored the structural fountain, installed LED spotlights, and planted seasonal flowers around the roundabout.<br><br>The local authorities announced plans to renovate surrounding retail stores to match the new aesthetic."
  },
  {
    id: 1,
    category: "Alert",
    badgeClass: "bg-red-500 text-white",
    title: "Rajpura Bye-pass Road Construction Nears Completion; Traffic Diverted",
    summary: "The Municipal Corporation announced that the final black-topping of the new Rajpura Bye-pass flyover starts tomorrow. Commuters are advised to take alternative routes via Nalagarh Road.",
    date: "June 24, 2026",
    readTime: "3 min read",
    image: "youtube_street.jpg",
    content: "The Municipal Corporation of Rajpura has issued a public traffic advisory. The final phase of construction on the Rajpura-Patiala Bye-pass road flyover will begin tomorrow morning, marking the near-completion of a major two-year infrastructure project.<br><br>Heavy vehicles traveling between Chandigarh and Patiala are diverted to the Nalagarh Highway link road. Light motor vehicles can use the inner sector roads. MC Commissioner stated that this detour will remain in place for 5 days. Facade cladding along the service lanes is also being finalized to improve thermal insulation and aesthetics for adjacent commercial establishments."
  },
  {
    id: 2,
    category: "Municipal",
    badgeClass: "bg-brandBlue text-white",
    title: "Rajpura MC Launches Clean City Drive in Ward 5 & Ward 7",
    summary: "A new waste segregation initiative was flagged off by the Mayor today. Cleanliness bins will be distributed to 10,000 households over the next two weeks.",
    date: "June 23, 2026",
    readTime: "4 min read",
    image: "clean_city.png",
    content: "Under the Swachh Rajpura initiative, the Municipal Committee has launched a ward-wise waste segregation drive today. Starting with Wards 5 and 7, municipal workers will distribute separate biodegradable and non-biodegradable collection bins to residents.<br><br>Mayor Sanjeev Kumar flagged off the campaign, emphasizing citizen participation. 'Our goal is to make Rajpura a model green town,' he remarked. Citizen volunteers will also run door-to-door awareness programs."
  },
  {
    id: 3,
    category: "Business",
    badgeClass: "bg-amber-500 text-black",
    title: "New IT Hub Focal Point to Open Next Month, Booking Open",
    summary: "Rajpura Focal Point's new commercial block is set to host 20+ software and backend consulting startups, creating over 500 local tech jobs.",
    date: "June 21, 2026",
    readTime: "5 min read",
    image: "it_hub.png",
    content: "The Industrial Area Focal Point of Rajpura is undergoing a major technological expansion. A newly constructed commercial complex, Rajpura Tech Center, is scheduled to open its doors next month. Over 20 startups and small IT ventures have already leased spaces.<br><br>This development is expected to boost the local economy and keep talent within Punjab. Facilities include high-speed fiber lines, sustainable backup power, and a modern cafeteria. The opening ceremony will invite prominent business delegates from Chandigarh."
  },
  {
    id: 4,
    category: "Sports",
    badgeClass: "bg-emerald-600 text-white",
    title: "Rajpura Sports Club Secures Punjab Kabaddi Semi-Final Spot",
    summary: "In a nail-biting match against Bathinda Warriors, the local Rajpura team clinched victory by 3 points. The semi-finals will be played this Friday.",
    date: "June 20, 2026",
    readTime: "3 min read",
    image: "kabaddi_sports.png",
    content: "The Rajpura Sports Club Kabaddi team advanced to the semi-finals of the State Kabaddi League following a thriller at the local government stadium. They defeated the Bathinda Warriors by a score of 38-35.<br><br>Star raider Balwan Singh scored the match-winning points in the final raid. Coach Gurpreet Singh praised the team's defensive structure. The semi-final matchup is scheduled against Ludhiana at the same venue."
  }
];

const DEFAULT_DIRECTORY = [
  {
    id: 1,
    name: "Wills Hotels & Resorts",
    category: "Food & Dining",
    ward: "Town Hall",
    rating: "4.9",
    reviewsCount: 35,
    tagline: "Stay once, carry memories forever",
    logo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    phone: "+91 98765-12345",
    email: "hello@willshotels.com",
    website: "willshotels.com",
    address: "10, Bypass Road near Town Hall, Rajpura",
    desc: "Wills Hotels & Resorts offers premium hospitality services in Rajpura. Featuring high-end luxury suites, a fine dining restaurant, swimming pool, and banquet hall perfect for weddings and corporate gatherings. Visited and reviewed by major regional columns as the top premium stay option in Rajpura.",
    services: ["Luxury Suites", "Banquet Hall", "Swimming Pool", "Multi-Cuisine Buffet", "24/7 Room Service", "Valet Parking"],
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=300",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=300"
    ]
  },
  {
    id: 2,
    name: "Rajpura Sweet House",
    category: "Food & Dining",
    ward: "Kasturba Road",
    rating: "4.7",
    reviewsCount: 124,
    tagline: "Tradition of sweetness since 1975",
    logo: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800",
    phone: "+91 98142-23456",
    email: "contact@rajpurasweets.com",
    website: "rajpurasweets.com",
    address: "Main Bazar, Kasturba Road, Rajpura",
    desc: "Renowned for local Punjabi sweets, pure desi ghee preparations, and fresh dry fruit delicacies. Rajpura Sweet House has been serving households and weddings in Patiala district for over four decades. Try our famous Dhoda Sweet and Milk cake.",
    services: ["Pure Desi Ghee Sweets", "Custom Wedding Boxes", "Snacks & Samosas", "Outdoor Catering", "Festive Hampers"],
    gallery: [
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=300",
      "https://images.unsplash.com/photo-1589187151032-573886192e4a?q=80&w=300",
      "https://images.unsplash.com/photo-1505253658129-0ec8a341e97d?q=80&w=300"
    ]
  },
  {
    id: 3,
    name: "Calibre Electronics",
    category: "Shops & Retail",
    ward: "Calibre Market",
    rating: "4.5",
    reviewsCount: 89,
    tagline: "Your local tech & electronics expert",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
    phone: "+91 98881-34567",
    email: "info@calibreelectronics.com",
    website: "calibreparts.in",
    address: "Shop 42, Calibre Market, Rajpura",
    desc: "The largest multi-brand retail shop in Rajpura for home appliances, laptops, smartphones, and custom desktop builds. We provide official brand warranty products with easy EMI financing options.",
    services: ["Smartphones & Laptops", "Home Appliances", "Custom PC Building", "Repair Services", "Zero Cost EMI"],
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=300",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=300"
    ]
  },
  {
    id: 4,
    name: "Bassi Dental Clinic",
    category: "Health & Medical",
    ward: "Town Hall",
    rating: "4.8",
    reviewsCount: 62,
    tagline: "Smile with confidence",
    logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800",
    phone: "+91 99155-78901",
    email: "drbassi@bassidental.com",
    website: "bassidental.com",
    address: "Adjoining Town Hall, Ward 6, Rajpura",
    desc: "Providing state-of-the-art dental care in Rajpura. Led by Dr. Bassi, our clinic specializes in cosmetic dentistry, dental implants, root canals, and braces. Fully sanitized, child-friendly environment.",
    services: ["Dental Implants", "Cosmetic Smile Design", "Root Canal Treatment", "Teeth Whitening", "Orthodontic Braces"],
    gallery: [
      "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?q=80&w=300",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=300",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=300"
    ]
  },
  {
    id: 5,
    name: "Apex Wood Crafts",
    category: "Professional Services",
    ward: "Focal Point",
    rating: "4.6",
    reviewsCount: 28,
    tagline: "Premium wood siding & furniture builders",
    logo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=100&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800",
    phone: "+91 98762-90123",
    email: "apexwood@focalpoint.org",
    website: "apexwoods.in",
    address: "Plot 115, Focal Point Phase II, Rajpura",
    desc: "Specialized in customized home furniture, modern wood siding installations, wall paneling, and weather protection boards. We source sustainable, termite-treated seasoned timber.",
    services: ["Custom Wood Siding", "Modular Kitchens", "Modern Furniture Design", "Cladding Refurbishment", "Polishing & Joinery"],
    gallery: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=300",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=300"
    ]
  }
];

const DEFAULT_JOBS = [
  {
    id: 1,
    title: "Senior Accounts Assistant",
    company: "Calibre Enterprises",
    logo: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=80",
    type: "Full-Time",
    locationMode: "On-Site",
    salary: "₹18,000 - ₹25,000 / Month",
    appliedCount: 23,
    posted: "2 days ago",
    desc: "We are looking for a senior accountant to manage bookkeeping, GST filings, and general financial ledgers for our industrial manufacturing branch at Focal Point. Candidates must have Tally ERP proficiency and 2+ years of experience.",
    requirements: [
      "2+ years experience in corporate accounting",
      "Sound knowledge of Tally, GST, and TDS filings",
      "B.Com or relevant commerce degree",
      "Good communication skills in Punjabi/Hindi"
    ],
    responsibilities: [
      "Post and process journal entries to ensure all business transactions are recorded",
      "Prepare monthly reports and quarterly GST spreadsheets",
      "Coordinate with CA for audit filings",
      "Process monthly payroll for factory workers"
    ],
    phone: "+91 98881-34567"
  },
  {
    id: 2,
    title: "Showroom Sales Executive",
    company: "Soni Garments",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=80",
    type: "Full-Time",
    locationMode: "On-Site",
    salary: "₹12,000 - ₹16,000 / Month",
    appliedCount: 41,
    posted: "3 days ago",
    desc: "Join our retail sales team at the busiest market strip in Rajpura. You will assist walk-in customers, manage stock displays, and handle cash register transactions during evening shifts.",
    requirements: [
      "12th Pass or graduate (any stream)",
      "Polite personality with strong persuasion skills",
      "Previous retail/apparel experience is a plus",
      "Ability to handle billing systems"
    ],
    responsibilities: [
      "Welcoming and assisting clients as they enter the showroom",
      "Keep apparel display racks fully stocked and organized",
      "Track and report stock shortages to the manager",
      "Manage client checkouts and billing counter"
    ],
    phone: "+91 98142-99887"
  },
  {
    id: 3,
    title: "Data Entry Operator",
    company: "Tech-Focal Startups",
    logo: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=80",
    type: "Part-Time",
    locationMode: "Remote",
    salary: "₹8,000 - ₹10,000 / Month",
    appliedCount: 89,
    posted: "1 day ago",
    desc: "Looking for students or part-timers to handle remote database inputs. You will transfer catalog details into our cloud software. Computer and high-speed internet at home are required.",
    requirements: [
      "Excellent typing speed (minimum 40 WPM)",
      "Attention to detail and basic MS Excel skills",
      "Must own a personal laptop and stable internet connection",
      "Flexible working schedule"
    ],
    responsibilities: [
      "Input product titles, prices, and descriptions into database",
      "Verify data accuracy by comparing with scanned source documents",
      "Maintain a daily log of entries uploaded",
      "Coordinate queries with the data supervisor online"
    ],
    phone: "+91 99144-88552"
  }
];

const DEFAULT_EVENTS = [
  {
    id: 1,
    category: "Festivals",
    badgeClass: "event-green",
    title: "Monsoon Teej Festival",
    desc: "Celebrate Teej with traditional Punjabi swings, giddha performances, and sweet food stalls.",
    date: "Aug 15, 2026",
    days: [15],
    interestCount: 1642,
    image: "teej_festival.png"
  },
  {
    id: 2,
    category: "Sports",
    badgeClass: "event-blue",
    title: "Annual Kabaddi Championship",
    desc: "Top 8 teams of Patiala district battle it out for the grand trophy. Live commentary and food court.",
    date: "Aug 12, 2026",
    days: [12, 13, 14],
    interestCount: 843,
    image: "kabaddi_sports.png"
  },
  {
    id: 3,
    category: "Commercial",
    badgeClass: "event-yellow",
    title: "Grand Monsoon Market Sale",
    desc: "Amazing discounts of up to 40% across electronic shops, apparel, and furniture stores at Calibre market.",
    date: "Aug 6, 2026",
    days: [6, 7],
    interestCount: 994,
    image: "market_sale.png"
  },
  {
    id: 4,
    category: "Community",
    badgeClass: "event-red",
    title: "Public Civic Town Hall Meet",
    desc: "Meet Municipal Corporation representatives to discuss road work and clean water strategies in Ward 5.",
    date: "Aug 22, 2026",
    days: [22],
    interestCount: 258,
    image: "town_hall.png"
  }
];

const DEFAULT_BUZZ = [
  { sender: "Sandeep Singh", time: "10:15 AM", message: "Water supply is back in Ward 5, pressure is low though.", isSent: false },
  { sender: "Navjot MC", time: "10:48 AM", message: "MC road repair workers have arrived near Bypass road. Expect minor blocks.", isSent: false },
  { sender: "Ravi Kumar", time: "11:20 AM", message: "Anyone knows if Bassi Clinic is open today?", isSent: false },
  { sender: "Harpreet Kaur", time: "11:22 AM", message: "Yes Ravi, Bassi clinic is open till 6 PM. Took my son there in the morning.", isSent: false }
];

// --- PILLARS MAPPING FOR PREVIEW (Home Page) ---
const PILLARS_PREVIEWS = [
  {
    badge: "NEWS",
    title: "Breaking News & Local Incidents",
    desc: "Stay informed about road closures, water updates, sports results, and municipal bulletins around Rajpura.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800"
  },
  {
    badge: "DIRECTORY",
    title: "Verified Shop & Services Finder",
    desc: "Access contact details, locations, services list, and opening timings for local businesses.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800"
  },
  {
    badge: "CAREERS",
    title: "Active Job Openings in Rajpura",
    desc: "Apply directly via phone or WhatsApp to factory, retail, clerical, and local startup vacancies.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800"
  },
  {
    badge: "CALENDAR",
    title: "Upcoming Community Events & Sales",
    desc: "Track local matches, Teej melas, and commercial discounts across the monthly layout grids.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"
  }
];

// --- LOCAL STORAGE STATE INITIALIZATION ---
let newsDb = JSON.parse(localStorage.getItem('myrajpura_news_v4')) || DEFAULT_NEWS;
let directoryDb = JSON.parse(localStorage.getItem('myrajpura_directory_v4')) || DEFAULT_DIRECTORY;
let jobsDb = JSON.parse(localStorage.getItem('myrajpura_jobs_v4')) || DEFAULT_JOBS;
let eventsDb = JSON.parse(localStorage.getItem('myrajpura_events_v4')) || DEFAULT_EVENTS;
let buzzDb = JSON.parse(localStorage.getItem('myrajpura_buzz_v4')) || DEFAULT_BUZZ;

// Save database back to persist defaults if first run
function saveDatabasesToLocalStorage() {
  localStorage.setItem('myrajpura_news_v4', JSON.stringify(newsDb));
  localStorage.setItem('myrajpura_directory_v4', JSON.stringify(directoryDb));
  localStorage.setItem('myrajpura_jobs_v4', JSON.stringify(jobsDb));
  localStorage.setItem('myrajpura_events_v4', JSON.stringify(eventsDb));
  localStorage.setItem('myrajpura_buzz_v4', JSON.stringify(buzzDb));
}
saveDatabasesToLocalStorage();

// --- STATE MANAGEMENT VARS ---
let activeJobId = jobsDb[0] ? jobsDb[0].id : null;
let currentEventView = 'schedules'; // 'schedules' | 'calendar'
let currentCalendarMonth = 7; // August (0-indexed base, so August is 7)
let currentCalendarYear = 2026;

// Wizard State (Contribute)
let currentWizardType = ''; // 'news' | 'business' | 'job' | 'event'
let currentWizardStep = 1;

// --- PAGE NAVIGATION ENGINE (SPA) ---
function navigateTo(pageId) {
  // Hide all pages
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => {
    v.classList.remove('active');
    setTimeout(() => {
      if (!v.classList.contains('active')) {
        v.style.display = 'none';
      }
    }, 400); // Wait for transition
  });

  // Highlight Nav Link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(l => {
    if (l.getAttribute('href') === `#${pageId}`) {
      l.classList.add('text-brandGold', 'active');
    } else {
      l.classList.remove('text-brandGold', 'active');
    }
  });

  // Close Mobile Menu if open
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.add('hidden');
  document.getElementById('hamburger-btn').classList.remove('open');

  // Show selected page
  const activeView = document.getElementById(`${pageId}-view`);
  if (activeView) {
    activeView.style.display = 'block';
    setTimeout(() => {
      activeView.classList.add('active');
    }, 50);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update header text colors and solid/scrolled state
  updateHeaderStyle(pageId);

  // Load section specific renders
  if (pageId === 'home') {
    renderHomeFeeds();
  } else if (pageId === 'news') {
    renderNewsFeed();
    renderCommunityBuzz();
  } else if (pageId === 'directory') {
    renderDirectoryGrid();
  } else if (pageId === 'jobs') {
    renderJobFeed();
    renderJobDetails();
  } else if (pageId === 'events') {
    renderEvents();
  }
}

// Initial hash routing check on load
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1);
  if (hash && ['home', 'news', 'directory', 'jobs', 'events', 'contribute'].includes(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('home');
  }
  
  // Initialize slider drag listeners
  initBeforeAfterSlider();
  initHeroSlideshow();
  updateHeaderStyle();
});

// Hash routing support for browser back/forward
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    navigateTo(hash);
  }
});

// --- HEADER THEME & SCROLL COORDINATION ---
function updateHeaderStyle(activePage = null) {
  const header = document.getElementById('main-header');
  const logoText = document.getElementById('header-logo-text');
  const nav = document.querySelector('nav');
  const hamburger = document.getElementById('hamburger-btn');
  
  if (!header || !logoText || !nav || !hamburger) return;

  header.classList.add('shadow-md');
  header.classList.add('bg-white', 'dark:bg-[#1e293b]');
  
  logoText.classList.remove('text-white');
  logoText.classList.add('text-[#0f172a]', 'dark:text-white');
  
  nav.classList.remove('text-slate-200');
  nav.classList.add('text-slate-700', 'dark:text-slate-300');
  
  hamburger.classList.remove('text-white');
  hamburger.classList.add('text-[#0f172a]', 'dark:text-white');
}

// Scroll Event
window.addEventListener('scroll', () => {
  updateHeaderStyle();
});


// --- DARK / LIGHT MODE ENGINE ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('myrajpura_theme', theme);
  
  if (theme === 'dark') {
    themeIcon.className = "fa-solid fa-sun text-lg";
    document.documentElement.classList.add('dark');
  } else {
    themeIcon.className = "fa-solid fa-moon text-lg";
    document.documentElement.classList.remove('dark');
  }
  
  updateHeaderStyle();
}

// Check saved theme
const savedTheme = localStorage.getItem('myrajpura_theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});


// --- HAMBURGER MENU DRAWER ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  hamburgerBtn.classList.toggle('open');
});


// --- HOMEPAGE RENDERING & PILLAR PREVIEWS ---
function changePillarPreview(index) {
  const preview = PILLARS_PREVIEWS[index];
  if (!preview) return;
  
  const imgEl = document.getElementById('pillar-preview-img');
  const badgeEl = document.getElementById('pillar-preview-badge');
  const titleEl = document.getElementById('pillar-preview-title');
  const descEl = document.getElementById('pillar-preview-desc');
  
  // Fade out, swap text, fade in
  imgEl.style.opacity = 0;
  setTimeout(() => {
    imgEl.src = preview.image;
    badgeEl.textContent = preview.badge;
    titleEl.textContent = preview.title;
    descEl.textContent = preview.desc;
    imgEl.style.opacity = 0.9;
  }, 200);
}

function renderHomeFeeds() {
  // 1. Render News Grid (2 items)
  const newsGrid = document.getElementById('home-news-grid');
  newsGrid.innerHTML = '';
  
  newsDb.slice(0, 2).forEach(item => {
    newsGrid.innerHTML += `
      <article class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer" onclick="openNewsDetailModal(${item.id})">
        <img class="w-full h-48 object-cover" src="${item.image}" alt="${item.title}">
        <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded ${item.badgeClass || 'bg-brandBlue text-white'}">${item.category}</span>
            <h3 class="text-xl font-bold font-headings uppercase hover:text-brandGold transition-colors leading-tight">${item.title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">${item.summary}</p>
          </div>
          <div class="text-xs text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
            <span>${item.date}</span>
            <span>${item.readTime}</span>
          </div>
        </div>
      </article>
    `;
  });

  // 2. Render Events List (3 items)
  const eventsList = document.getElementById('home-events-list');
  eventsList.innerHTML = '';
  
  eventsDb.slice(0, 3).forEach(event => {
    eventsList.innerHTML += `
      <div class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4 hover:border-brandGold transition-colors cursor-pointer" onclick="navigateTo('events')">
        <img class="w-16 h-16 rounded-lg object-cover" src="${event.image}" alt="${event.title}">
        <div class="flex-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${event.category}</span>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-snug">${event.title}</h4>
          <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span><i class="fa-solid fa-calendar mr-1 text-brandGold"></i>${event.date}</span>
            <span><i class="fa-solid fa-users mr-1 text-brandGold"></i>${event.interestCount} Interested</span>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300"></i>
      </div>
    `;
  });
}

function openCategoryInDirectory(category) {
  navigateTo('directory');
  const targetBtn = Array.from(document.querySelectorAll('.category-filter-btn'))
                         .find(btn => btn.textContent.includes(category));
  if (targetBtn) {
    filterDirectoryCategory(category, targetBtn);
  }
}


// --- BEFORE/AFTER SLIDER LOGIC ---
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-slider');
  const handle = document.getElementById('slider-handle');
  const overlay = document.getElementById('slider-overlay');
  let isDragging = false;

  if (!container || !handle || !overlay) return;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let position = ((xPos - rect.left) / rect.width) * 100;
    
    // Contain boundaries
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    handle.style.left = `${position}%`;
    overlay.style.width = `${position}%`;
    
    // Adjust nested image width overlay to keep aspect ratio scaling
    const innerImg = overlay.querySelector('img');
    if (innerImg) {
      innerImg.style.width = `${rect.width}px`;
    }
  }

  // Mouse / Touch Start
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);

  // Mouse Move
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      updateSlider(e.touches[0].clientX);
    }
  });

  // Re-sync image sizes on window resize
  window.addEventListener('resize', () => {
    const rect = container.getBoundingClientRect();
    const innerImg = overlay.querySelector('img');
    if (innerImg) {
      innerImg.style.width = `${rect.width}px`;
    }
  });
}

// --- HERO SLIDESHOW MARQUEE LOGIC ---
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  setInterval(() => {
    // Fade out current slide
    slides[currentSlide].classList.remove('opacity-100');
    slides[currentSlide].classList.add('opacity-0');
    if (bgSlides.length > currentSlide) {
      bgSlides[currentSlide].classList.remove('opacity-100');
      bgSlides[currentSlide].classList.add('opacity-0');
    }
    
    // Increment slide index
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Fade in next slide
    slides[currentSlide].classList.remove('opacity-0');
    slides[currentSlide].classList.add('opacity-100');
    if (bgSlides.length > currentSlide) {
      bgSlides[currentSlide].classList.remove('opacity-0');
      bgSlides[currentSlide].classList.add('opacity-100');
    }
  }, 4500); // Transition every 4.5 seconds
}


// --- NEWS PORTAL LOGIC ---
let newsLayout = 'grid'; // 'grid' | 'list'
let selectedNewsFilters = [];

function renderNewsFeed() {
  const container = document.getElementById('news-feed-container');
  const leadContainer = document.getElementById('news-lead-story');
  
  // 1. Load lead story (the most recent article)
  const leadItem = newsDb[0];
  if (leadItem && leadContainer) {
    leadContainer.innerHTML = `
      <img class="absolute inset-0 w-full h-full object-cover" src="${leadItem.image}" alt="${leadItem.title}">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
      <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
        <span class="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wider">FEATURED STORY</span>
        <h3 class="text-2xl md:text-3xl font-bold font-headings leading-tight hover:text-brandGold transition-colors uppercase">${leadItem.title}</h3>
        <p class="text-sm text-slate-300 font-light line-clamp-2 max-w-xl">${leadItem.summary}</p>
        <div class="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-2">
          <span><i class="fa-solid fa-clock mr-1 text-brandGold"></i>${leadItem.date}</span>
          <span>${leadItem.readTime}</span>
        </div>
      </div>
    `;
  }

  // 2. Filter news database
  let filtered = newsDb;
  
  // Keyword Search
  const query = document.getElementById('news-search-input').value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(query) || item.summary.toLowerCase().includes(query));
  }

  // Category Checkboxes
  if (selectedNewsFilters.length > 0) {
    filtered = filtered.filter(item => selectedNewsFilters.includes(item.category));
  }

  // Update counts
  document.getElementById('news-feed-count').textContent = `${filtered.length} articles`;

  // Render news feed
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i class="fa-solid fa-folder-open text-3xl mb-3 text-slate-300"></i>
        <p>No news articles match your filter criteria.</p>
      </div>
    `;
    return;
  }

  // Set grid/list styles
  if (newsLayout === 'list') {
    container.className = "flex flex-col gap-4 w-full col-span-full";
  } else {
    container.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
  }

  filtered.forEach(item => {
    if (newsLayout === 'list') {
      container.innerHTML += `
        <article class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow cursor-pointer w-full" onclick="openNewsDetailModal(${item.id})">
          <img class="w-full md:w-48 h-40 object-cover" src="${item.image}" alt="${item.title}">
          <div class="p-6 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${item.badgeClass || 'bg-brandBlue text-white'}">${item.category}</span>
              <h3 class="text-xl font-bold font-headings leading-tight hover:text-brandGold transition-colors uppercase">${item.title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${item.summary}</p>
            </div>
            <div class="text-[10px] text-slate-400 font-semibold flex justify-between">
              <span>${item.date}</span>
              <span>${item.readTime}</span>
            </div>
          </div>
        </article>
      `;
    } else {
      container.innerHTML += `
        <article class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer" onclick="openNewsDetailModal(${item.id})">
          <img class="w-full h-48 object-cover" src="${item.image}" alt="${item.title}">
          <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded ${item.badgeClass || 'bg-brandBlue text-white'}">${item.category}</span>
              <h3 class="text-xl font-bold font-headings leading-tight hover:text-brandGold transition-colors uppercase leading-tight">${item.title}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">${item.summary}</p>
            </div>
            <div class="text-xs text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
              <span>${item.date}</span>
              <span>${item.readTime}</span>
            </div>
          </div>
        </article>
      `;
    }
  });
}

function searchNews() {
  renderNewsFeed();
}

function applyNewsFilters() {
  const checkboxes = document.querySelectorAll('.news-filter-checkbox');
  selectedNewsFilters = [];
  checkboxes.forEach(c => {
    if (c.checked) selectedNewsFilters.push(c.value);
  });
  
  // Uncheck 'All' if specific filters checked
  document.getElementById('filter-news-all').checked = selectedNewsFilters.length === 0;
  
  renderNewsFeed();
}

function resetNewsFilters() {
  document.getElementById('filter-news-all').checked = true;
  document.querySelectorAll('.news-filter-checkbox').forEach(c => c.checked = false);
  document.getElementById('news-search-input').value = '';
  selectedNewsFilters = [];
  renderNewsFeed();
}

document.getElementById('filter-news-all').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.querySelectorAll('.news-filter-checkbox').forEach(c => c.checked = false);
    selectedNewsFilters = [];
    renderNewsFeed();
  }
});

function toggleNewsLayout(layout) {
  newsLayout = layout;
  const gridBtn = document.getElementById('btn-news-grid');
  const listBtn = document.getElementById('btn-news-list');
  
  if (layout === 'list') {
    listBtn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    listBtn.classList.remove('text-slate-400');
    gridBtn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    gridBtn.classList.add('text-slate-400');
  } else {
    gridBtn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    gridBtn.classList.remove('text-slate-400');
    listBtn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-brandBlue', 'dark:text-brandGold');
    listBtn.classList.add('text-slate-400');
  }
  renderNewsFeed();
}

// --- NEWS DETAIL MODAL ---
function openNewsDetailModal(newsId) {
  const item = newsDb.find(n => n.id === parseInt(newsId));
  if (!item) return;

  document.getElementById('modal-news-image').style.backgroundImage = `url('${item.image}')`;
  document.getElementById('modal-news-meta').innerHTML = `
    <span class="bg-brandGold text-black font-bold px-2 py-0.5 rounded uppercase">${item.category}</span>
    <span>•</span>
    <span>Published: ${item.date}</span>
    <span>•</span>
    <span>${item.readTime}</span>
  `;
  document.getElementById('modal-news-title').textContent = item.title;
  document.getElementById('modal-news-content').innerHTML = item.content;

  const modal = document.getElementById('news-detail-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeNewsDetailModal() {
  document.getElementById('news-detail-modal').classList.add('hidden');
  document.body.style.overflow = '';
}


// --- LIVE NOTICE BOARD (BUZZ CHAT) ---
function renderCommunityBuzz() {
  const container = document.getElementById('community-buzz-stream');
  container.innerHTML = '';
  
  buzzDb.forEach(chat => {
    const isSentClass = chat.isSent ? 'flex-row-reverse' : '';
    const bubbleClass = chat.isSent ? 'chat-bubble-sent ml-auto' : 'chat-bubble-received';
    const textAlignment = chat.isSent ? 'text-right' : '';
    
    container.innerHTML += `
      <div class="flex gap-2.5 items-start ${isSentClass}">
        ${!chat.isSent ? `<div class="w-7 h-7 rounded-full bg-brandGold flex items-center justify-center font-bold text-[10px] text-black shrink-0">${chat.sender[0]}</div>` : ''}
        <div class="space-y-1 max-w-[80%]">
          <div class="flex items-center gap-2 text-[9px] text-slate-500 font-semibold ${chat.isSent ? 'justify-end' : ''}">
            <span>${chat.sender}</span>
            <span>•</span>
            <span>${chat.time}</span>
          </div>
          <div class="chat-bubble ${bubbleClass} text-[11px] leading-relaxed shadow-sm">
            ${chat.message}
          </div>
        </div>
      </div>
    `;
  });
  
  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function sendBuzzMessage(event) {
  event.preventDefault();
  const input = document.getElementById('buzz-input');
  const messageText = input.value.trim();
  if (!messageText) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Append sent message
  const newMsg = {
    sender: "You (Citizen)",
    time: timeString,
    message: messageText,
    isSent: true
  };
  
  buzzDb.push(newMsg);
  input.value = '';
  
  renderCommunityBuzz();
  saveDatabasesToLocalStorage();

  // Simulate administrative/neighbor reply after 2.5 seconds
  setTimeout(() => {
    const replies = [
      "Thanks for sharing! Adding this to our notice log.",
      "Is that near the railway underpass? I was planning to head that way.",
      "Good warning, thanks. The municipal workers were active there yesterday too.",
      "Agree! Ward councils need to look into this soon.",
      "Indeed. Thanks for notifying the portal community."
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    buzzDb.push({
      sender: "Sarabjit M.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: randomReply,
      isSent: false
    });
    
    renderCommunityBuzz();
    saveDatabasesToLocalStorage();
  }, 2500);
}


// --- BUSINESS DIRECTORY LOGIC ---
let activeDirectoryCategory = 'All';

function renderDirectoryGrid() {
  const container = document.getElementById('directory-grid-container');
  let filtered = directoryDb;

  // Search keyword
  const searchVal = document.getElementById('directory-search-input').value.toLowerCase().trim();
  if (searchVal) {
    filtered = filtered.filter(b => b.name.toLowerCase().includes(searchVal) || b.tagline.toLowerCase().includes(searchVal) || b.desc.toLowerCase().includes(searchVal));
  }

  // Location selector
  const wardVal = document.getElementById('directory-ward-select').value;
  if (wardVal !== 'All') {
    filtered = filtered.filter(b => b.ward === wardVal);
  }

  // Category filter
  if (activeDirectoryCategory !== 'All') {
    filtered = filtered.filter(b => b.category === activeDirectoryCategory);
  }

  document.getElementById('directory-grid-count').textContent = `${filtered.length} businesses listed`;
  
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <i class="fa-solid fa-store-slash text-4xl mb-3 text-slate-300"></i>
        <p>No verified businesses found matching your criteria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    container.innerHTML += `
      <div class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group cursor-pointer" onclick="openBusinessDetailModal(${item.id})">
        <div>
          <!-- Top Cover Banner -->
          <div class="relative w-full h-44 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${item.cover}" alt="${item.name}">
            <span class="absolute top-3 left-3 bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">FEATURED</span>
          </div>

          <!-- Content Block -->
          <div class="p-6 relative mt-6">
            <!-- Floating Circular Logo -->
            <div class="absolute -top-12 left-6 w-14 h-14 rounded-full border-2 border-white dark:border-[#1e293b] shadow-md bg-white overflow-hidden">
              <img class="w-full h-full object-cover" src="${item.logo}" alt="Logo">
            </div>

            <div class="flex items-center gap-2">
              <h4 class="text-xl font-bold font-headings uppercase hover:text-brandGold transition-colors">${item.name}</h4>
              <i class="fa-solid fa-circle-check text-brandGold text-sm" title="Verified Business"></i>
            </div>
            
            <div class="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-1.5">
              <span><i class="fa-solid fa-map-pin mr-1.5 text-brandGold"></i>${item.ward}</span>
              <span>•</span>
              <span><i class="fa-solid fa-star mr-1 text-brandGold"></i>${item.rating} (${item.reviewsCount} reviews)</span>
            </div>
            
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed">${item.desc}</p>
          </div>
        </div>

        <div class="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <span class="text-brandGold font-semibold uppercase tracking-wider">${item.category}</span>
          <span class="text-slate-600 dark:text-brandGold font-bold group-hover:translate-x-1.5 transition-transform">View Listing <i class="fa-solid fa-chevron-right ml-1"></i></span>
        </div>
      </div>
    `;
  });
}

function searchDirectory() {
  renderDirectoryGrid();
}

// Add keypress listener to search inputs
document.getElementById('directory-search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchDirectory();
});
document.getElementById('directory-ward-select').addEventListener('change', searchDirectory);

function filterDirectoryCategory(category, buttonEl) {
  activeDirectoryCategory = category;
  
  // Highlight active button
  const buttons = document.querySelectorAll('.category-filter-btn');
  buttons.forEach(btn => {
    btn.className = "category-filter-btn px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:border-brandGold hover:text-brandGold text-xs font-semibold uppercase flex items-center gap-2 whitespace-nowrap";
  });
  buttonEl.className = "category-filter-btn px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:border-brandGold hover:text-brandGold text-xs font-semibold uppercase flex items-center gap-2 whitespace-nowrap active bg-brandBlue text-white dark:bg-brandGold dark:text-black";

  renderDirectoryGrid();
}


// --- BUSINESS DETAILS MODAL ---
function openBusinessDetailModal(bizId) {
  const biz = directoryDb.find(b => b.id === parseInt(bizId));
  if (!biz) return;

  // Header Cover and Logo Overlap
  const headerContainer = document.getElementById('modal-business-header');
  headerContainer.innerHTML = `
    <div class="w-full h-full bg-cover bg-center" style="background-image: url('${biz.cover}');">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    </div>
    <div class="absolute bottom-6 left-8 flex items-end gap-5 text-white">
      <div class="w-20 h-20 rounded-full border-4 border-white dark:border-[#1e293b] shadow-lg bg-white overflow-hidden shrink-0">
        <img class="w-full h-full object-cover" src="${biz.logo}" alt="${biz.name} Logo">
      </div>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h3 class="text-3xl font-extrabold font-headings uppercase">${biz.name}</h3>
          <i class="fa-solid fa-circle-check text-brandGold text-xl" title="Verified Listing"></i>
        </div>
        <p class="text-sm text-slate-300 font-light italic">${biz.tagline}</p>
        <div class="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1">
          <span><i class="fa-solid fa-location-dot mr-1.5 text-brandGold"></i>${biz.ward}</span>
          <span>•</span>
          <span><i class="fa-solid fa-star mr-1 text-brandGold"></i>${biz.rating} (${biz.reviewsCount} reviews)</span>
        </div>
      </div>
    </div>
  `;

  // Body Content
  document.getElementById('modal-business-desc').textContent = biz.desc;

  // Services list
  const servicesContainer = document.getElementById('modal-business-services');
  servicesContainer.innerHTML = '';
  biz.services.forEach(serv => {
    servicesContainer.innerHTML += `
      <div class="flex items-center gap-2 text-xs">
        <i class="fa-solid fa-check text-brandGold"></i>
        <span>${serv}</span>
      </div>
    `;
  });

  // Gallery grid
  const galleryContainer = document.getElementById('modal-business-gallery');
  galleryContainer.innerHTML = '';
  biz.gallery.forEach(img => {
    galleryContainer.innerHTML += `
      <img class="w-full aspect-square rounded-lg object-cover border border-slate-200 dark:border-slate-800" src="${img}" alt="Gallery item">
    `;
  });

  // Contacts Sidebar
  document.getElementById('modal-business-contact-list').innerHTML = `
    <li class="flex items-center gap-3"><i class="fa-solid fa-location-arrow w-4 text-brandGold text-center"></i><span>${biz.address}</span></li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-phone w-4 text-brandGold text-center"></i><span>${biz.phone}</span></li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-envelope w-4 text-brandGold text-center"></i><span>${biz.email}</span></li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-globe w-4 text-brandGold text-center"></i><a href="https://${biz.website}" target="_blank" class="hover:underline text-brandBlue dark:text-brandGold font-semibold">${biz.website}</a></li>
  `;

  // Main Call Button href
  const ctaBtn = document.getElementById('modal-business-cta');
  ctaBtn.setAttribute('href', `tel:${biz.phone}`);

  // Mock Map container
  document.getElementById('modal-business-map').innerHTML = `
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400'); opacity: 0.85;">
      <div class="absolute inset-0 bg-[#132c4c]/40 mix-blend-multiply"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brandGold flex items-center justify-center text-black border-2 border-white shadow-lg animate-bounce">
        <i class="fa-solid fa-map-pin"></i>
      </div>
    </div>
  `;

  const modal = document.getElementById('business-detail-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBusinessDetailModal() {
  document.getElementById('business-detail-modal').classList.add('hidden');
  document.body.style.overflow = '';
}


// --- JOB BOARD LOGIC (Yoda Split-Pane) ---
function renderJobFeed() {
  const container = document.getElementById('job-feed-list');
  let filtered = jobsDb;

  // Search keyword inside filters
  const searchVal = document.getElementById('job-search-input').value.toLowerCase().trim();
  if (searchVal) {
    filtered = filtered.filter(j => j.title.toLowerCase().includes(searchVal) || j.company.toLowerCase().includes(searchVal));
  }

  // Job Type Checkboxes
  const selectedTypes = Array.from(document.querySelectorAll('.job-filter-checkbox:checked')).map(c => c.value);
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(j => selectedTypes.includes(j.type));
  }

  // Location Mode Checkboxes
  const selectedLocs = Array.from(document.querySelectorAll('.job-location-checkbox:checked')).map(c => c.value);
  if (selectedLocs.length > 0) {
    filtered = filtered.filter(j => selectedLocs.includes(j.locationMode));
  }

  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i class="fa-solid fa-magnifying-glass-chart text-3xl mb-2 text-slate-300"></i>
        <p class="text-sm">No career openings match your selection filters.</p>
      </div>
    `;
    document.getElementById('job-details-pane').innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
        <i class="fa-solid fa-briefcase text-4xl mb-3 text-slate-350"></i>
        <p class="text-sm">No job selected.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((job, index) => {
    // If no active job is selected, select the first match
    if (index === 0 && (!activeJobId || !filtered.some(j => j.id === activeJobId))) {
      activeJobId = job.id;
    }

    const isActive = job.id === activeJobId;
    const cardActiveBorder = isActive ? 'border-brandGold ring-1 ring-brandGold' : 'border-slate-200 dark:border-slate-800';
    const cardActiveBg = isActive ? 'bg-slate-50 dark:bg-[#2e3b4e]/30' : 'bg-white dark:bg-[#1e293b]';

    container.innerHTML += `
      <div class="border rounded-xl p-5 shadow-sm transition-all cursor-pointer ${cardActiveBorder} ${cardActiveBg}" onclick="setActiveJob(${job.id})">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-lg text-black">
            ${job.logo ? `<img class="w-full h-full object-cover" src="${job.logo}" alt="Logo">` : job.company[0]}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-snug truncate hover:text-brandGold transition-colors">${job.title}</h4>
              <i class="fa-solid fa-bookmark text-slate-400 hover:text-brandGold text-xs shrink-0 pt-0.5"></i>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">${job.company}</p>
            
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span class="text-[9px] font-bold bg-brandBlue/10 text-brandBlue dark:bg-brandGold/10 dark:text-brandGold px-2 py-0.5 rounded">${job.type}</span>
              <span class="text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">${job.locationMode}</span>
            </div>
            
            <div class="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span class="text-brandBlue dark:text-brandGold font-bold">${job.salary.split(' /')[0]}</span>
              <span>${job.posted}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function setActiveJob(jobId) {
  activeJobId = jobId;
  renderJobFeed();
  renderJobDetails();
}

function renderJobDetails() {
  const detailsPane = document.getElementById('job-details-pane');
  const job = jobsDb.find(j => j.id === activeJobId);

  if (!job) {
    detailsPane.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
        <i class="fa-solid fa-briefcase text-4xl mb-3 text-slate-350"></i>
        <p class="text-sm">Please select a job vacancy from the listing feed to view specifications.</p>
      </div>
    `;
    return;
  }

  // Generate lists
  let reqsHtml = '';
  job.requirements.forEach(r => reqsHtml += `<li class="flex items-start gap-2.5"><i class="fa-solid fa-circle-check text-brandGold mt-1 text-xs"></i><span>${r}</span></li>`);
  
  let respsHtml = '';
  job.responsibilities.forEach(r => respsHtml += `<li class="flex items-start gap-2.5"><i class="fa-solid fa-circle-right text-brandBlue dark:text-brandGold mt-1 text-xs"></i><span>${r}</span></li>`);

  detailsPane.innerHTML = `
    <!-- Detail Header -->
    <div class="flex items-center gap-5 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
      <div class="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-2xl text-black shrink-0">
        ${job.logo ? `<img class="w-full h-full object-cover" src="${job.logo}" alt="Logo">` : job.company[0]}
      </div>
      <div>
        <h3 class="text-2xl font-bold font-headings leading-tight uppercase">${job.title}</h3>
        <p class="text-sm text-brandBlue dark:text-brandGold font-bold mt-0.5">${job.company}</p>
        <div class="flex items-center gap-3 text-xs text-slate-400 mt-2 font-semibold">
          <span><i class="fa-solid fa-briefcase mr-1"></i>${job.type}</span>
          <span>•</span>
          <span><i class="fa-solid fa-location-dot mr-1"></i>${job.locationMode}</span>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-[#0f172a]/50 p-4 rounded-xl text-xs mb-6">
      <div>
        <div class="text-slate-400 font-bold uppercase tracking-wider">Salary Bracket</div>
        <div class="text-sm font-extrabold text-brandBlue dark:text-brandGold mt-1">${job.salary}</div>
      </div>
      <div>
        <div class="text-slate-400 font-bold uppercase tracking-wider">Simulated Applicants</div>
        <div class="text-sm font-extrabold mt-1">${job.appliedCount} applied</div>
      </div>
    </div>

    <!-- Description -->
    <div class="flex-1 space-y-6 text-sm leading-relaxed">
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white border-l-4 border-brandGold pl-2.5 mb-2 font-headings uppercase">Overview</h4>
        <p class="text-slate-600 dark:text-slate-400 text-xs">${job.desc}</p>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 dark:text-white border-l-4 border-brandGold pl-2.5 mb-3 font-headings uppercase">Requirements</h4>
        <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          ${reqsHtml}
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 dark:text-white border-l-4 border-brandGold pl-2.5 mb-3 font-headings uppercase">Responsibilities</h4>
        <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          ${respsHtml}
        </ul>
      </div>
    </div>

    <!-- Apply Box -->
    <div class="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 flex gap-4">
      <a href="tel:${job.phone}" class="btn-gold flex-1 text-center py-3 text-xs uppercase flex items-center justify-center gap-2">
        <i class="fa-solid fa-phone"></i> Call Employer
      </a>
      <a href="https://wa.me/${job.phone.replace(/[^0-9]/g, '')}?text=Hi, I am interested in the ${job.title} position at ${job.company} posted on MyRajpura." target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 text-center py-3 text-xs uppercase rounded-md font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
        <i class="fa-brands fa-whatsapp text-sm"></i> Apply WhatsApp
      </a>
    </div>
  `;
}

function applyJobFilters() {
  renderJobFeed();
  renderJobDetails();
}

function resetJobFilters() {
  document.getElementById('job-search-input').value = '';
  document.querySelectorAll('.job-filter-checkbox').forEach(c => c.checked = false);
  document.querySelectorAll('.job-location-checkbox').forEach(c => c.checked = false);
  renderJobFeed();
  renderJobDetails();
}

// Drawer animations
function toggleJobDrawer(open) {
  const drawer = document.getElementById('job-post-drawer');
  const panel = document.getElementById('job-drawer-panel');
  
  if (open) {
    drawer.classList.remove('hidden');
    setTimeout(() => {
      panel.classList.remove('translate-x-full');
    }, 50);
  } else {
    panel.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  }
}

function submitJobDrawer(event) {
  event.preventDefault();
  
  const company = document.getElementById('drawer-job-company').value.trim();
  const title = document.getElementById('drawer-job-title').value.trim();
  const type = document.getElementById('drawer-job-type').value;
  const locationMode = document.getElementById('drawer-job-location-mode').value;
  const salaryVal = document.getElementById('drawer-job-salary').value.trim();
  const phone = document.getElementById('drawer-job-phone').value.trim();
  const desc = document.getElementById('drawer-job-desc').value.trim();

  const newJob = {
    id: Date.now(),
    title: title,
    company: company,
    type: type,
    locationMode: locationMode,
    salary: `₹${salaryVal} / Month`,
    appliedCount: 0,
    posted: "Just now",
    desc: desc,
    requirements: [
      "Immediate joiner preferred",
      "Valid contact details provided",
      "Fluency in regional language"
    ],
    responsibilities: [
      "Handle direct responsibilities assigned by manager",
      "Maintain active communication with employer"
    ],
    phone: phone
  };

  jobsDb.unshift(newJob); // Add at top
  activeJobId = newJob.id;
  
  // Clean form
  document.getElementById('drawer-job-form').reset();
  
  // Close drawer
  toggleJobDrawer(false);
  
  // Render
  renderJobFeed();
  renderJobDetails();
  saveDatabasesToLocalStorage();
}


// --- EVENTS CALENDAR LOGIC (Sooma 51, 52) ---
function toggleEventsView(view) {
  currentEventView = view;
  const btnSchedules = document.getElementById('btn-events-schedules');
  const btnCalendar = document.getElementById('btn-events-calendar');
  const schedulesCont = document.getElementById('events-schedules-container');
  const calendarCont = document.getElementById('events-calendar-container');

  if (view === 'calendar') {
    btnCalendar.className = "px-4 py-1.5 text-xs font-bold rounded bg-brandBlue text-white dark:bg-brandGold dark:text-black transition-colors";
    btnSchedules.className = "px-4 py-1.5 text-xs font-semibold text-slate-500 rounded transition-colors";
    schedulesCont.classList.add('hidden');
    calendarCont.classList.remove('hidden');
    renderEventsCalendar();
  } else {
    btnSchedules.className = "px-4 py-1.5 text-xs font-bold rounded bg-brandBlue text-white dark:bg-brandGold dark:text-black transition-colors";
    btnCalendar.className = "px-4 py-1.5 text-xs font-semibold text-slate-500 rounded transition-colors";
    calendarCont.classList.add('hidden');
    schedulesCont.classList.remove('hidden');
    renderEventsSchedules();
  }
}

function renderEvents() {
  if (currentEventView === 'calendar') {
    renderEventsCalendar();
  } else {
    renderEventsSchedules();
  }
}

function renderEventsSchedules() {
  const container = document.getElementById('events-grid-container');
  let filtered = eventsDb;

  // Filters
  const searchVal = document.getElementById('event-search-input').value.toLowerCase().trim();
  if (searchVal) {
    filtered = filtered.filter(e => e.title.toLowerCase().includes(searchVal) || e.desc.toLowerCase().includes(searchVal));
  }

  const catVal = document.getElementById('event-category-filter').value;
  if (catVal !== 'All') {
    filtered = filtered.filter(e => e.category === catVal);
  }

  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <i class="fa-solid fa-calendar-xmark text-4xl mb-3 text-slate-350"></i>
        <p>No upcoming schedules matching your criteria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(event => {
    container.innerHTML += `
      <div class="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
        <div>
          <!-- Photo Container -->
          <div class="relative w-full h-40 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${event.image}" alt="${event.title}">
            
            <!-- Float Badges (Sooma 51 inspired) -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                <i class="fa-solid fa-calendar text-brandGold"></i>${event.date.split(',')[0]}
              </span>
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                <i class="fa-solid fa-users text-brandGold"></i>${event.interestCount}
              </span>
            </div>
          </div>

          <div class="p-5">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${event.category}</span>
            <h4 class="font-bold text-lg mt-1 font-headings uppercase hover:text-brandGold transition-colors leading-tight">${event.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">${event.desc}</p>
          </div>
        </div>

        <div class="p-5 border-t border-slate-100 dark:border-slate-800">
          <button class="w-full border border-slate-200 dark:border-slate-700 hover:border-brandGold hover:text-brandGold py-2 rounded-lg text-xs font-bold transition-all uppercase flex items-center justify-center gap-1.5" onclick="starEvent(${event.id})">
            <i class="fa-regular fa-star"></i>Interested
          </button>
        </div>
      </div>
    `;
  });
}

function starEvent(eventId) {
  const event = eventsDb.find(e => e.id === eventId);
  if (event) {
    event.interestCount += 1;
    saveDatabasesToLocalStorage();
    renderEvents();
  }
}

function applyEventFilters() {
  renderEvents();
}

// --- INTERACTIVE MONTHLY CALENDAR GRID (Sooma 52) ---
function changeCalendarMonth(offset) {
  currentCalendarMonth += offset;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear -= 1;
  } else if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear += 1;
  }
  
  // Format Month Year text
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById('calendar-month-year').textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
  
  renderEventsCalendar();
}

function renderEventsCalendar() {
  const container = document.getElementById('calendar-days-container');
  container.innerHTML = '';

  // Get first day of month (1-indexed base starting day)
  // JS Day indices: 0 = Sun, 1 = Mon ... 6 = Sat
  // We want grid where Monday is col 0, Sun is col 6.
  const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  // Adjust so Monday is 0
  const adjustedStartCol = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Days in month
  const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  
  // Days in previous month (to fill prefix columns)
  const prevMonthTotalDays = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  // Draw prefix columns (Other Month days)
  for (let i = adjustedStartCol - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    container.innerHTML += `
      <div class="calendar-day other-month">
        <span class="text-xs text-slate-400 font-bold">${dayNum}</span>
      </div>
    `;
  }

  // Draw current month days
  for (let day = 1; day <= totalDays; day++) {
    // Check if this date has any events
    const dayEvents = eventsDb.filter(e => {
      // Parse event date object matching month & year
      // For mock simplicity, we only match events mapped to 2026-08 (August)
      const evDate = new Date(e.date);
      const isAugustMatches = evDate.getMonth() === currentCalendarMonth && evDate.getFullYear() === currentCalendarYear;
      return isAugustMatches && e.days.includes(day);
    });

    let eventsHtml = '';
    dayEvents.forEach(e => {
      eventsHtml += `
        <div class="calendar-event-strip ${e.badgeClass}" title="${e.title}" onclick="openCalendarEventDetail('${e.title}', '${e.desc}', '${e.date}')">
          ${e.title}
        </div>
      `;
    });

    container.innerHTML += `
      <div class="calendar-day">
        <span class="text-xs font-extrabold text-slate-600 dark:text-slate-300">${day}</span>
        <div class="space-y-1 mt-1 overflow-y-auto max-h-[60px]">
          ${eventsHtml}
        </div>
      </div>
    `;
  }

  // Fill remaining suffix columns to complete full calendar week rows (multiple of 7)
  const totalSlotsUsed = adjustedStartCol + totalDays;
  const suffixSlotsNeeded = (7 - (totalSlotsUsed % 7)) % 7;
  for (let day = 1; day <= suffixSlotsNeeded; day++) {
    container.innerHTML += `
      <div class="calendar-day other-month">
        <span class="text-xs text-slate-400 font-bold">${day}</span>
      </div>
    `;
  }
}

function openCalendarEventDetail(title, desc, date) {
  // Use global news detail modal to show event specifications (reusable)
  document.getElementById('modal-news-image').style.backgroundImage = "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600')";
  document.getElementById('modal-news-meta').innerHTML = `
    <span class="bg-brandGold text-black font-bold px-2 py-0.5 rounded uppercase">COMMUNITY EVENT</span>
    <span>•</span>
    <span>Date: ${date}</span>
  `;
  document.getElementById('modal-news-title').textContent = title;
  document.getElementById('modal-news-content').innerHTML = `<p>${desc}</p><br><p>Interested counts: simulated local attendees are tracking this. RSVP via our submission forms in the contribution tab.</p>`;

  const modal = document.getElementById('news-detail-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}


// --- USER SUBMISSION PORTAL LOGIC (Hireup 444 Wizard) ---
function initiateSubmissionWizard(type) {
  currentWizardType = type;
  currentWizardStep = 1;
  
  // Update UI Elements
  document.getElementById('submit-selection-hub').classList.add('hidden');
  const wizard = document.getElementById('submission-wizard');
  wizard.classList.remove('hidden');

  // Change wizard title
  const titles = {
    news: "Submit a News Tip",
    business: "Register Business Directory",
    job: "Post a Job opening",
    event: "Submit Local Event"
  };
  document.getElementById('wizard-form-title').textContent = titles[type];

  // Draw input fields
  drawWizardFields();
  updateWizardProgressNodes();
}

function cancelSubmissionWizard() {
  document.getElementById('submission-wizard').classList.add('hidden');
  document.getElementById('submit-selection-hub').classList.remove('hidden');
  
  // Clean form
  document.getElementById('submission-wizard-form').reset();
}

function openContributeTab(type) {
  navigateTo('contribute');
  initiateSubmissionWizard(type);
}

function drawWizardFields() {
  const step1 = document.getElementById('wizard-step-1-fields');
  const step2 = document.getElementById('wizard-step-2-fields');
  
  step1.innerHTML = '';
  step2.innerHTML = '';
  
  if (currentWizardType === 'news') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">News Title / Headline</label>
        <input type="text" id="form-news-title" placeholder="e.g. Major Rain Cause Traffic Block Near Focal Point" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">News Category</label>
        <select id="form-news-cat" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
          <option value="Municipal">🏛️ Civic & Municipal</option>
          <option value="Alert">🚨 Road / Public Alert</option>
          <option value="Business">🛍️ Business Openings</option>
          <option value="Sports">🏆 Local Sports</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Short Excerpt / Summary</label>
        <input type="text" id="form-news-summary" placeholder="Briefly summarize the incident in 1 or 2 lines..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
    `;
    step2.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Report details / Content</label>
        <textarea id="form-news-content" rows="6" placeholder="Provide full details of the incident..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Attach Photo Cover URL (Optional)</label>
        <input type="url" id="form-news-image" placeholder="Paste an image address url..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
      </div>
    `;
  } else if (currentWizardType === 'business') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Business / Shop Name</label>
        <input type="text" id="form-biz-name" placeholder="e.g. Soni Sweets and Catering" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Category</label>
          <select id="form-biz-cat" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="Food & Dining">🍽️ Food & Dining</option>
            <option value="Shops & Retail">🛍️ Shops & Retail</option>
            <option value="Health & Medical">🏥 Health & Medical</option>
            <option value="Professional Services">🛠️ Local Crafts & Services</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Ward / Area</label>
          <select id="form-biz-ward" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="Kasturba Road">Kasturba Road</option>
            <option value="Town Hall">Town Hall Area</option>
            <option value="Focal Point">Focal Point</option>
            <option value="Calibre Market">Calibre Market</option>
            <option value="Nehru Market">Nehru Market</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Catchy Slogan / Tagline</label>
        <input type="text" id="form-biz-tagline" placeholder="e.g. Best Punjabi Samosas In Town" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
    `;
    step2.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Contact Phone</label>
          <input type="tel" id="form-biz-phone" placeholder="+91 98142-XXXXX" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Email address</label>
          <input type="email" id="form-biz-email" placeholder="contact@shopname.com" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Full Shop Address</label>
        <input type="text" id="form-biz-address" placeholder="Shop Number, Bazar Street, Landmark, Rajpura" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Cover Image URL (Paste URL Link)</label>
        <input type="url" id="form-biz-cover" placeholder="Paste image url showing your storefront..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Listing Description</label>
        <textarea id="form-biz-desc" rows="3" placeholder="Provide background about your shop and specialization..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
    `;
  } else if (currentWizardType === 'job') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Title</label>
        <input type="text" id="form-job-title" placeholder="e.g. Graphic Designer / Office Admin" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Company / Business Name</label>
        <input type="text" id="form-job-company" placeholder="e.g. Bassi Diagnostics Center" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Type</label>
          <select id="form-job-type" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Daily Wage">Daily Wage (Dihari)</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Location Mode</label>
          <select id="form-job-loc" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
            <option value="On-Site">On-Site (Rajpura)</option>
            <option value="Remote">Work From Home</option>
          </select>
        </div>
      </div>
    `;
    step2.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Salary Offer (Monthly)</label>
        <input type="text" id="form-job-salary" placeholder="e.g. ₹15,000 - ₹18,000" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Contact Phone / WhatsApp</label>
        <input type="tel" id="form-job-phone" placeholder="+91 98XXX-XXXXX" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Specifications / Description</label>
        <textarea id="form-job-desc" rows="4" placeholder="Mention key duties and who should apply..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
    `;
  } else if (currentWizardType === 'event') {
    step1.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Event Name / Title</label>
        <input type="text" id="form-event-title" placeholder="e.g. Rajpura Trade Fair and Expo" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Category</label>
        <select id="form-event-cat" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
          <option value="Festivals">Festivals & Fairs</option>
          <option value="Sports">Sports matches</option>
          <option value="Commercial">Retail Sales / Discounts</option>
          <option value="Community">Civic Meetings</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Start Date</label>
          <input type="date" id="form-event-date" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Duration (Days)</label>
          <input type="number" id="form-event-duration" min="1" max="7" value="1" class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required>
        </div>
      </div>
    `;
    step2.innerHTML = `
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Brief description</label>
        <textarea id="form-event-desc" rows="4" placeholder="Briefly state timing, venue details, tickets if any..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold" required></textarea>
      </div>
      <div>
        <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5">Event Image URL</label>
        <input type="url" id="form-event-image" placeholder="Paste custom cover image url link..." class="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded py-2.5 px-4 focus:outline-none focus:border-brandGold">
      </div>
    `;
  }
}

function updateWizardProgressNodes() {
  document.getElementById('step-node-1').className = "step-node w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs active";
  document.getElementById('step-node-2').className = "step-node w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs";
  document.getElementById('step-node-3').className = "step-node w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs";
  
  document.getElementById('step-line-1').className = "flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 mx-2";
  document.getElementById('step-line-2').className = "flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 mx-2";

  if (currentWizardStep >= 2) {
    document.getElementById('step-node-1').classList.add('completed');
    document.getElementById('step-node-2').classList.add('active');
    document.getElementById('step-line-1').classList.add('bg-brandGold', 'dark:bg-brandGold');
  }
  if (currentWizardStep === 3) {
    document.getElementById('step-node-2').classList.add('completed');
    document.getElementById('step-node-3').classList.add('active');
    document.getElementById('step-line-2').classList.add('bg-brandGold', 'dark:bg-brandGold');
  }
}

function navigateWizardStep(offset) {
  // Simple validation for required fields
  if (offset > 0) {
    const activeCont = document.getElementById(`wizard-step-${currentWizardStep}-fields`);
    const inputs = activeCont.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(el => {
      if (!el.value.trim()) {
        isValid = false;
        el.classList.add('border-red-500');
        el.addEventListener('input', () => el.classList.remove('border-red-500'), { once: true });
      }
    });

    if (!isValid) return; // Stop if form fields are empty
  }

  currentWizardStep += offset;
  
  // Contain boundaries
  if (currentWizardStep < 1) currentWizardStep = 1;
  if (currentWizardStep > 3) currentWizardStep = 3;

  // Toggle step wrappers
  document.getElementById('wizard-step-1-fields').classList.add('hidden');
  document.getElementById('wizard-step-2-fields').classList.add('hidden');
  document.getElementById('wizard-step-3-fields').classList.add('hidden');
  
  document.getElementById(`wizard-step-${currentWizardStep}-fields`).classList.remove('hidden');

  // Toggle Nav buttons
  const prevBtn = document.getElementById('btn-wizard-prev');
  const nextBtn = document.getElementById('btn-wizard-next');
  const submitBtn = document.getElementById('btn-wizard-submit');

  if (currentWizardStep === 1) {
    prevBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
  } else if (currentWizardStep === 2) {
    prevBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
  } else if (currentWizardStep === 3) {
    prevBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    generateWizardCardPreview();
  }

  updateWizardProgressNodes();
}

function generateWizardCardPreview() {
  const container = document.getElementById('wizard-card-preview-container');
  container.innerHTML = '';

  if (currentWizardType === 'news') {
    const title = document.getElementById('form-news-title').value.trim();
    const cat = document.getElementById('form-news-cat').value;
    const summary = document.getElementById('form-news-summary').value.trim();
    const img = document.getElementById('form-news-image').value.trim() || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';

    container.innerHTML = `
      <article class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col w-full max-w-sm">
        <img class="w-full h-44 object-cover" src="${img}" alt="${title}">
        <div class="p-5 space-y-2 flex-1 flex flex-col justify-between">
          <div class="space-y-2 text-black">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-brandBlue text-white uppercase">${cat}</span>
            <h3 class="text-lg font-bold leading-tight font-headings uppercase">${title}</h3>
            <p class="text-xs text-slate-500 line-clamp-2">${summary}</p>
          </div>
          <div class="text-[10px] text-slate-400 font-semibold border-t pt-3 flex justify-between">
            <span>Just now</span>
            <span>2 min read</span>
          </div>
        </div>
      </article>
    `;
  } else if (currentWizardType === 'business') {
    const name = document.getElementById('form-biz-name').value.trim();
    const cat = document.getElementById('form-biz-cat').value;
    const ward = document.getElementById('form-biz-ward').value;
    const tagline = document.getElementById('form-biz-tagline').value.trim();
    const cover = document.getElementById('form-biz-cover').value.trim() || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600';

    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative flex flex-col justify-between w-full max-w-sm text-black">
        <div>
          <div class="relative w-full h-40 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover" src="${cover}" alt="${name}">
            <span class="absolute top-3 left-3 bg-[#111827]/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">FEATURED</span>
          </div>

          <div class="p-5 relative mt-4">
            <div class="absolute -top-10 left-5 w-12 h-12 rounded-full border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center font-bold text-lg">
              ${name[0]}
            </div>

            <div class="flex items-center gap-2">
              <h4 class="text-lg font-bold font-headings uppercase">${name}</h4>
              <i class="fa-solid fa-circle-check text-brandGold text-xs"></i>
            </div>
            
            <div class="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-1">
              <span><i class="fa-solid fa-map-pin mr-1.5 text-brandGold"></i>${ward}</span>
              <span>•</span>
              <span><i class="fa-solid fa-star mr-1 text-brandGold"></i>5.0 (New)</span>
            </div>
            
            <p class="text-xs text-slate-500 mt-2 italic leading-relaxed line-clamp-1">"${tagline}"</p>
          </div>
        </div>

        <div class="p-5 border-t flex justify-between items-center text-xs">
          <span class="text-brandGold font-semibold uppercase tracking-wider text-[10px]">${cat}</span>
          <span class="text-brandBlue font-bold">View Listing <i class="fa-solid fa-chevron-right ml-1"></i></span>
        </div>
      </div>
    `;
  } else if (currentWizardType === 'job') {
    const title = document.getElementById('form-job-title').value.trim();
    const company = document.getElementById('form-job-company').value.trim();
    const type = document.getElementById('form-job-type').value;
    const loc = document.getElementById('form-job-loc').value;
    const salary = document.getElementById('form-job-salary').value.trim();

    container.innerHTML = `
      <div class="border rounded-xl p-5 shadow-sm bg-white border-slate-200 w-full max-w-sm text-black">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border flex items-center justify-center font-bold text-lg text-black">
            ${company[0]}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm leading-snug truncate">${title}</h4>
            <p class="text-xs text-slate-500 font-semibold mt-0.5">${company}</p>
            
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span class="text-[9px] font-bold bg-brandBlue/10 text-brandBlue px-2 py-0.5 rounded">${type}</span>
              <span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${loc}</span>
            </div>
            
            <div class="border-t pt-3 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span class="text-brandBlue font-bold">₹${salary}</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (currentWizardType === 'event') {
    const title = document.getElementById('form-event-title').value.trim();
    const cat = document.getElementById('form-event-cat').value;
    const dateInput = document.getElementById('form-event-date').value;
    const img = document.getElementById('form-event-image').value.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300';
    
    let dateStr = "Aug 1, 2026";
    if (dateInput) {
      const d = new Date(dateInput);
      dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    container.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between w-full max-w-xs text-black">
        <div>
          <div class="relative w-full h-32 overflow-hidden bg-slate-100">
            <img class="w-full h-full object-cover" src="${img}" alt="${title}">
            <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <i class="fa-solid fa-calendar text-brandGold"></i>${dateStr.split(',')[0]}
              </span>
              <span class="bg-[#111827]/75 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <i class="fa-solid fa-users text-brandGold"></i>0
              </span>
            </div>
          </div>

          <div class="p-4">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">${cat}</span>
            <h4 class="font-bold text-sm mt-0.5 font-headings uppercase leading-tight">${title}</h4>
          </div>
        </div>
      </div>
    `;
  }
}

function handleWizardSubmit(event) {
  event.preventDefault();

  if (currentWizardType === 'news') {
    const title = document.getElementById('form-news-title').value.trim();
    const cat = document.getElementById('form-news-cat').value;
    const summary = document.getElementById('form-news-summary').value.trim();
    const detail = document.getElementById('form-news-content').value.trim();
    const img = document.getElementById('form-news-image').value.trim() || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';

    const newObj = {
      id: Date.now(),
      category: cat,
      badgeClass: cat === 'Alert' ? 'bg-red-500 text-white' : (cat === 'Sports' ? 'bg-emerald-600 text-white' : 'bg-brandBlue text-white'),
      title: title,
      summary: summary,
      content: detail,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: "2 min read",
      image: img
    };
    
    newsDb.unshift(newObj);
    localStorage.setItem('myrajpura_news_v4', JSON.stringify(newsDb));
    navigateTo('news');
  } else if (currentWizardType === 'business') {
    const name = document.getElementById('form-biz-name').value.trim();
    const cat = document.getElementById('form-biz-cat').value;
    const ward = document.getElementById('form-biz-ward').value;
    const tagline = document.getElementById('form-biz-tagline').value.trim();
    const phone = document.getElementById('form-biz-phone').value.trim();
    const email = document.getElementById('form-biz-email').value.trim();
    const address = document.getElementById('form-biz-address').value.trim();
    const cover = document.getElementById('form-biz-cover').value.trim() || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600';
    const desc = document.getElementById('form-biz-desc').value.trim();

    const newObj = {
      id: Date.now(),
      name: name,
      category: cat,
      ward: ward,
      rating: "5.0",
      reviewsCount: 1,
      tagline: tagline,
      logo: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=100",
      cover: cover,
      phone: phone,
      email: email,
      website: "myrajpura.com/directory",
      address: address,
      desc: desc,
      services: ["Verfied Local Outlet", "Customer Support Available"],
      gallery: [cover, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300"]
    };

    directoryDb.unshift(newObj);
    localStorage.setItem('myrajpura_directory_v4', JSON.stringify(directoryDb));
    navigateTo('directory');
  } else if (currentWizardType === 'job') {
    const title = document.getElementById('form-job-title').value.trim();
    const company = document.getElementById('form-job-company').value.trim();
    const type = document.getElementById('form-job-type').value;
    const loc = document.getElementById('form-job-loc').value;
    const salary = document.getElementById('form-job-salary').value.trim();
    const phone = document.getElementById('form-job-phone').value.trim();
    const desc = document.getElementById('form-job-desc').value.trim();

    const newObj = {
      id: Date.now(),
      title: title,
      company: company,
      type: type,
      locationMode: loc,
      salary: `₹${salary} / Month`,
      appliedCount: 0,
      posted: "Just now",
      desc: desc,
      requirements: ["Immediate Joiner", "Fluency in local communication"],
      responsibilities: ["Fulfill direct requests by managers"],
      phone: phone
    };

    jobsDb.unshift(newObj);
    activeJobId = newObj.id;
    localStorage.setItem('myrajpura_jobs_v4', JSON.stringify(jobsDb));
    navigateTo('jobs');
  } else if (currentWizardType === 'event') {
    const title = document.getElementById('form-event-title').value.trim();
    const cat = document.getElementById('form-event-cat').value;
    const dateInput = document.getElementById('form-event-date').value;
    const duration = parseInt(document.getElementById('form-event-duration').value) || 1;
    const desc = document.getElementById('form-event-desc').value.trim();
    const img = document.getElementById('form-event-image').value.trim() || 'town_hall.png';

    const d = new Date(dateInput);
    const dayVal = d.getDate();
    
    // Generate arrays of days
    let dayArr = [];
    for (let i = 0; i < duration; i++) {
      dayArr.push(dayVal + i);
    }

    const newObj = {
      id: Date.now(),
      category: cat,
      badgeClass: cat === 'Festivals' ? 'event-green' : (cat === 'Sports' ? 'event-blue' : (cat === 'Commercial' ? 'event-yellow' : 'event-red')),
      title: title,
      desc: desc,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      days: dayArr,
      interestCount: 0,
      image: img
    };

    eventsDb.unshift(newObj);
    localStorage.setItem('myrajpura_events_v4', JSON.stringify(eventsDb));
    navigateTo('events');
  }

  // Clean and hide wizard
  document.getElementById('submission-wizard').classList.add('hidden');
  document.getElementById('submit-selection-hub').classList.remove('hidden');
  document.getElementById('submission-wizard-form').reset();
  
  // Alert success
  alert("Thank you! Your community listing was submitted successfully and is now active.");
}
