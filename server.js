const express = require('express');
const path = require('path');
const axios = require('axios');
const { scanLocalLeads, isLiveModeConfigured } = require('./scanner');
const { scanAdLeads } = require('./ad-scanner');
const { scanGoogleAds } = require('./google-ads-scanner');
const { scanDirectory } = require('./directory-scanner');
require('dotenv').config();


// Helper to get working Serper API key with automatic fallback to new working key
const getSerperKey = () => {
  const key = process.env.SERPER_API_KEY;
  if (!key || key === "your_serper_api_key_here" || key.trim() === "" || key.startsWith("757145")) {
    return "4140784afc392def187e1480af6ec7e67e638411";
  }
  return key;
};

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// In-memory cache for latest scanned leads and visitor tracking
let latestScannedLeads = [];
let activeVisits = [];

// Niche alias mapping for matching synonyms/sub-niches to template folder names
const NICHE_ALIASES = {
  // ── Auto Detailing & Ceramic Coating Shops ──────────────────────────────────
  'vinyl_wrapping': 'auto_detailing_ceramic_coating_shops',
  'vinyl_wrapping_ppf': 'auto_detailing_ceramic_coating_shops',
  'vinyl_wrapping_and_ppf': 'auto_detailing_ceramic_coating_shops',
  'ppf': 'auto_detailing_ceramic_coating_shops',
  'paint_protection_film': 'auto_detailing_ceramic_coating_shops',
  'window_tinting': 'auto_detailing_ceramic_coating_shops',
  'detailing': 'dynamic_auto',
  'car_detailing': 'dynamic_auto',
  'auto_detailing': 'dynamic_auto',
  'car_wash': 'dynamic_auto',
  'ceramic_coating': 'dynamic_auto',
  'dynamic_auto': 'dynamic_auto',
  'car_vinyl_wrap': 'auto_detailing_ceramic_coating_shops',
  'car_vinyl_wrapping': 'auto_detailing_ceramic_coating_shops',
  'vinyl_wrap': 'auto_detailing_ceramic_coating_shops',
  'vinyl_wrap_shop': 'auto_detailing_ceramic_coating_shops',
  'vinyl_wraps': 'auto_detailing_ceramic_coating_shops',
  'car_wrapping': 'auto_detailing_ceramic_coating_shops',
  'car_wrap': 'auto_detailing_ceramic_coating_shops',
  'car_wraps': 'auto_detailing_ceramic_coating_shops',
  // ── Luxury Event Caterers & Staffing ────────────────────────────────────────
  'caterers': 'luxury_event_caterers_staffing',
  'catering': 'luxury_event_caterers_staffing',
  'caterer': 'luxury_event_caterers_staffing',
  // ── Luxury Yacht Wedding Planners ────────────────────────────────────────────
  'wedding_planners': 'luxury_yacht_wedding_planners',
  'wedding_planner': 'luxury_yacht_wedding_planners',
  'yacht_weddings': 'luxury_yacht_wedding_planners',
  'yacht_wedding': 'luxury_yacht_wedding_planners',
  // ── Aesthetic & Anti-Aging Medicine ─────────────────────────────────────────
  'aesthetic_clinic': 'aesthetic_anti_aging_medicine',
  'aesthetic_medicine': 'aesthetic_anti_aging_medicine',
  'anti_aging': 'aesthetic_anti_aging_medicine',
  'anti_aging_clinic': 'aesthetic_anti_aging_medicine',
  'medispa': 'aesthetic_anti_aging_medicine',
  'med_spa': 'aesthetic_anti_aging_medicine',
  'medspa': 'aesthetic_anti_aging_medicine',
  'botox_clinic': 'aesthetic_anti_aging_medicine',
  'botox': 'aesthetic_anti_aging_medicine',
  'filler_clinic': 'aesthetic_anti_aging_medicine',
  'skin_clinic': 'aesthetic_anti_aging_medicine',
  'dermatology_clinic': 'aesthetic_anti_aging_medicine',
  'aesthetic_anti_aging': 'aesthetic_anti_aging_medicine',
  // ── Student PG Accommodation ─────────────────────────────────────────────────
  'student_pg': 'student_pg_accommodation',
  'pg_accommodation': 'student_pg_accommodation',
  'paying_guest': 'student_pg_accommodation',
  'paying_guest_hostel': 'student_pg_accommodation',
  'pg_hostel': 'student_pg_accommodation',
  'student_accommodation': 'student_pg_accommodation',
  'student_hostel': 'student_pg_accommodation',
  'pg_rooms': 'student_pg_accommodation',
  'pg': 'student_pg_accommodation',
  'hostel': 'student_pg_accommodation',
  // ── Dermatologist ─────────────────────────────────────────────────────────────
  'dermatologist': 'dermatologist',
  'dermatology': 'dermatologist',
  'skin_doctor': 'dermatologist',
  'skin_specialist': 'dermatologist',
  'skin_care_clinic': 'dermatologist',
  'derma_clinic': 'dermatologist',
  'acne_treatment': 'dermatologist',
  'laser_skin_clinic': 'dermatologist',
  'cosmetic_dermatologist': 'dermatologist',
  // ── Dentist ───────────────────────────────────────────────────────────────────
  'dentist': 'dentist',
  'dental_clinic': 'dentist',
  'dental': 'dentist',
  'teeth_whitening': 'dentist',
  'cosmetic_dentistry': 'dentist',
  'orthodontist': 'dentist',
  'braces_clinic': 'dentist',
  'dental_implants': 'dentist',
  'family_dentist': 'dentist',
  'tooth_clinic': 'dentist',
  'oral_care': 'dentist',
  'smile_clinic': 'dentist',
  // ── Luxurious Salon Website ──────────────────────────────────────────────────
  'luxurious_salon': 'luxurious-salon-website',
  'salon': 'luxurious-salon-website',
  'beauty_salon': 'luxurious-salon-website',
  'hair_salon': 'luxurious-salon-website',
  'nail_salon': 'nail-art',
  'spa': 'SPA',
  'beauty_spa': 'SPA',
  'massage_center': 'SPA',
  'wellness_spa': 'SPA',
  'massage': 'SPA',
  'massage_spa': 'SPA',
  'day_spa': 'SPA',
  'hair_styling': 'luxurious-salon-website',
  'skincare_clinic': 'luxurious-salon-website',
  'luxury_salon': 'luxurious-salon-website',
  'atelier': 'luxurious-salon-website',
  'salon_website': 'luxurious-salon-website',
  // ── Nail Art ─────────────────────────────────────────────────────────────────
  'nail_art': 'nail-art',
  'nails': 'nail-art',
  'manicure': 'nail-art',
  'pedicure': 'nail-art',
  'nail_care': 'nail-art',
  'acrylic_nails': 'nail-art',
  'gel_nails': 'nail-art',
  'gel_manicure': 'nail-art',
  'nail_studio': 'nail-art',
  'nail_bar': 'nail-art'
};

// Helper to fetch files from configured GitHub repository
async function fetchFromGithub(pathWithinRepo, responseType = 'text') {
  const owner = process.env.GITHUB_USERNAME || 'pms5566';
  const repo = process.env.GITHUB_REPO || 'my-leadscope-templates';
  const branch = process.env.GITHUB_BRANCH || 'main';
  
  // If the repository is 'leadscope', prepend 'my_raw_templates/' to the path
  const adjustedPath = (repo === 'leadscope' && !pathWithinRepo.startsWith('my_raw_templates/'))
    ? `my_raw_templates/${pathWithinRepo}`
    : pathWithinRepo;
    
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${adjustedPath}`;
  
  const headers = {};
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here') {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  const response = await axios.get(url, { headers, responseType });
  return response.data;
}

function getCommonPrefixLength(str1, str2) {
  let len = 0;
  const minLen = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLen; i++) {
    if (str1[i] === str2[i]) {
      len++;
    } else {
      break;
    }
  }
  return len;
}

// Resolve a URL slug (e.g. "commercial-espresso-machine-distributors") to the
// actual folder name inside my_raw_templates (e.g. "Commercial Espresso Machine Distributors")
async function resolveLocalNicheFolder(niche) {
  const fs = require('fs').promises;
  const templatesDir = path.join(__dirname, 'my_raw_templates');

  // Normalize helper: lowercase, replace non-alphanumeric with underscore
  const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  let cleanNiche = normalize(niche);

  // Apply alias mapping if present
  if (NICHE_ALIASES[cleanNiche]) {
    cleanNiche = NICHE_ALIASES[cleanNiche];
  }
  cleanNiche = normalize(cleanNiche);

  // Read directory dynamically to detect new templates instantly
  const localFolderCache = {};
  try {
    const folders = await fs.readdir(templatesDir);
    for (const folder of folders) {
      const stat = await fs.stat(path.join(templatesDir, folder)).catch(() => null);
      if (stat && stat.isDirectory()) {
        localFolderCache[normalize(folder)] = folder;
      }
    }
  } catch (e) { /* ignore */ }

  // 1. Exact normalized match
  if (localFolderCache[cleanNiche]) return localFolderCache[cleanNiche];

  // 2. Substring match
  for (const [key, folder] of Object.entries(localFolderCache)) {
    if (key.includes(cleanNiche) || cleanNiche.includes(key)) return folder;
  }

  // 3. Word overlap match
  const words = cleanNiche.split('_').filter(w => w.length > 2);
  let bestFolder = null, bestScore = 0;
  for (const [key, folder] of Object.entries(localFolderCache)) {
    let score = 0;
    for (const w of words) { if (key.includes(w)) score++; }
    if (score > bestScore) { bestScore = score; bestFolder = folder; }
  }
  if (bestScore > 0) return bestFolder;

  return null;
}

let nicheTemplatesCache = null;

// Resolve a URL slug to the actual folder name inside the GitHub templates repo
let githubFolderCache = null;
async function resolveGithubNicheFolder(niche) {
  const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  let cleanNiche = normalize(niche);

  // Apply alias mapping if present
  if (NICHE_ALIASES[cleanNiche]) {
    cleanNiche = NICHE_ALIASES[cleanNiche];
  }
  cleanNiche = normalize(cleanNiche);

  // Build cache of all root folders in the GitHub repo once
  if (!githubFolderCache) {
    githubFolderCache = {};
    try {
      const owner = process.env.GITHUB_USERNAME || 'pms5566';
      const repo = process.env.GITHUB_REPO || 'my-leadscope-templates';
      const branch = process.env.GITHUB_BRANCH || 'main';
      const headers = {};
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here') {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }
      const url = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;
      const response = await axios.get(url, { headers });
      if (Array.isArray(response.data)) {
        for (const item of response.data) {
          if (item.type === 'dir') {
            githubFolderCache[normalize(item.name)] = item.name;
          }
        }
      }
      console.log('[GitHub Folder Cache] Loaded', Object.keys(githubFolderCache).length, 'folders from GitHub templates repo.');
    } catch (e) {
      console.warn('[GitHub Folder Cache] Failed to load:', e.message);
    }
  }

  // 1. Exact normalized match
  if (githubFolderCache[cleanNiche]) return githubFolderCache[cleanNiche];

  // 2. Substring match
  for (const [key, folder] of Object.entries(githubFolderCache)) {
    if (key.includes(cleanNiche) || cleanNiche.includes(key)) return folder;
  }

  // 3. Word overlap match
  const words = cleanNiche.split('_').filter(w => w.length > 2);
  let bestFolder = null, bestScore = 0;
  for (const [key, folder] of Object.entries(githubFolderCache)) {
    let score = 0;
    for (const w of words) { if (key.includes(w)) score++; }
    if (score > bestScore) { bestScore = score; bestFolder = folder; }
  }
  if (bestScore > 0) return bestFolder;

  return null;
}
async function findNicheTemplate(niche) {
  const cleanNiche = niche.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  
  if (!nicheTemplatesCache) {
    nicheTemplatesCache = {};
    const fs = require('fs').promises;
    
    // 1. Try local sites directory
    try {
      const sitesDir = path.join(__dirname, 'my_raw_templates', 'sites');
      const files = await fs.readdir(sitesDir);
      for (const file of files) {
        if (file.endsWith('.html')) {
          const baseName = file.replace(/^\d+_/, '').replace(/\.html$/, '');
          const normalizedBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
          nicheTemplatesCache[normalizedBase] = file;
        }
      }
    } catch (err) {
      console.warn('[Template Loader] Local sites directory not found or unreadable, will fall back to GitHub contents lookup:', err.message);
      
      // 2. Try GitHub Contents API fallback
      try {
        const owner = process.env.GITHUB_USERNAME || 'pms5566';
        const repo = process.env.GITHUB_REPO || 'my-leadscope-templates';
        const branch = process.env.GITHUB_BRANCH || 'main';
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/sites?ref=${branch}`;
        const headers = {};
        if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here') {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }
        const response = await axios.get(url, { headers });
        if (Array.isArray(response.data)) {
          for (const item of response.data) {
            if (item.name.endsWith('.html')) {
              const baseName = item.name.replace(/^\d+_/, '').replace(/\.html$/, '');
              const normalizedBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
              nicheTemplatesCache[normalizedBase] = item.name;
            }
          }
        }
      } catch (gitErr) {
        console.error('[Template Loader] Failed to fetch sites list from GitHub:', gitErr.message);
      }
    }
  }
  
  // 1. Try exact match
  if (nicheTemplatesCache[cleanNiche]) {
    return nicheTemplatesCache[cleanNiche];
  }
  
  // 2. Try substring match (check if a cache key contains the requested cleanNiche)
  for (const key of Object.keys(nicheTemplatesCache)) {
    if (key.includes(cleanNiche)) {
      console.log(`[Template Match] Substring match: "${niche}" mapped to "${nicheTemplatesCache[key]}"`);
      return nicheTemplatesCache[key];
    }
  }
  
  // 3. Try inverse substring match (check if the cleanNiche contains a cache key)
  for (const key of Object.keys(nicheTemplatesCache)) {
    if (cleanNiche.includes(key)) {
      console.log(`[Template Match] Inverse match: "${niche}" mapped to "${nicheTemplatesCache[key]}"`);
      return nicheTemplatesCache[key];
    }
  }
  
  // 4. Try prefix-overlap matching (e.g. "plumber" shares prefix "plumb" with "plumbing")
  const requestedWords = cleanNiche.split('_').filter(w => w.length >= 3);
  if (requestedWords.length > 0) {
    let bestMatch = null;
    let maxPrefixScore = 0;
    
    for (const key of Object.keys(nicheTemplatesCache)) {
      const templateWords = key.split('_').filter(w => w.length >= 3);
      let prefixScore = 0;
      for (const reqWord of requestedWords) {
        for (const tempWord of templateWords) {
          const commonLen = getCommonPrefixLength(reqWord, tempWord);
          if (commonLen >= 4 || (reqWord.length === 3 && reqWord === tempWord)) {
            prefixScore += commonLen;
          }
        }
      }
      if (prefixScore > maxPrefixScore) {
        maxPrefixScore = prefixScore;
        bestMatch = nicheTemplatesCache[key];
      }
    }
    
    if (maxPrefixScore > 0) {
      console.log(`[Template Match] Prefix-overlap match: "${niche}" mapped to "${bestMatch}" with prefix score ${maxPrefixScore}`);
      return bestMatch;
    }
  }
  
  // 5. Try word-based overlap match
  const cleanWords = cleanNiche.split('_').filter(w => w.length > 2);
  if (cleanWords.length > 0) {
    let bestMatch = null;
    let maxOverlap = 0;
    
    for (const key of Object.keys(nicheTemplatesCache)) {
      let overlap = 0;
      for (const word of cleanWords) {
        if (key.includes(word)) overlap++;
      }
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = nicheTemplatesCache[key];
      }
    }
    
    if (maxOverlap > 0) {
      console.log(`[Template Match] Fuzzy match: "${niche}" mapped to "${bestMatch}" with ${maxOverlap} overlapping words`);
      return bestMatch;
    }
  }
  
  return null;
}

// Enable CORS for cross-domain visitor logs tracking (e.g. from local dashboard to Hugging Face)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Enable JSON parsing
app.use(express.json());

// Enable CORS with credentials support for localhost and space domains
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('hf.space'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Basic Authentication Middleware to protect internal LeadScope dashboard and CRM data from clients
function basicAuth(req, res, next) {
  const reqPath = req.path;
  
  // 1. Bypass authentication on local machine for developer convenience
  const host = req.headers.host || '';
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return next();
  }

  // 2. Bypass authentication for client-facing routes, previews, tracking and service workers
  if (
    reqPath.startsWith('/go/') || 
    reqPath.startsWith('/preview/') || 
    reqPath.startsWith('/api/track') || 
    reqPath.startsWith('/sw.js') ||
    reqPath === '/favicon.ico'
  ) {
    return next();
  }
  
  // 3. Protect dashboard, CRM API routes and internal assets
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="LeadScope Dashboard"');
    return res.status(401).send('Authentication required.');
  }

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'leadscope99';

  if (user === adminUser && pass === adminPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="LeadScope Dashboard"');
  return res.status(401).send('Authentication required.');
}

app.use(basicAuth);

// Serve frontend assets
app.use(express.static(path.join(__dirname, 'public')));


function maskKey(key) {
  if (!key || key === "your_google_places_api_key_here" || 
      key === "your_google_search_api_key_here" || 
      key === "your_google_search_engine_id_here" || 
      key === "your_github_token_here" || 
      key === "your_serper_api_key_here" ||
      key === "your_telegram_bot_token_here" ||
      key === "your_discord_webhook_url_here") {
    return "";
  }
  if (key.length <= 8) return "***";
  return key.substring(0, 6) + "..." + key.substring(key.length - 4);
}

// API Endpoint to check configuration status
app.get('/api/config', (req, res) => {
  res.json({
    liveModeAvailable: isLiveModeConfigured(),
    placesKeyConfigured: !!(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY !== "your_google_places_api_key_here" && process.env.GOOGLE_PLACES_API_KEY.trim() !== ""),
    serperKeyConfigured: !!(process.env.SERPER_API_KEY && process.env.SERPER_API_KEY !== "your_serper_api_key_here" && process.env.SERPER_API_KEY.trim() !== ""),
    yelpKeyConfigured: !!(process.env.YELP_API_KEY && process.env.YELP_API_KEY !== "your_yelp_api_key_here" && process.env.YELP_API_KEY.trim() !== ""),
    searchKeyConfigured: !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_API_KEY !== "your_google_search_api_key_here" && process.env.GOOGLE_SEARCH_API_KEY.trim() !== ""),
    searchEngineIdConfigured: !!(process.env.GOOGLE_SEARCH_ENGINE_ID && process.env.GOOGLE_SEARCH_ENGINE_ID !== "your_google_search_engine_id_here" && process.env.GOOGLE_SEARCH_ENGINE_ID.trim() !== ""),
    githubConfigured: !!(process.env.GITHUB_USERNAME && process.env.GITHUB_USERNAME !== "your_github_username" && process.env.GITHUB_USERNAME.trim() !== ""),
    telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== "your_telegram_bot_token_here" && process.env.TELEGRAM_BOT_TOKEN.trim() !== "" && process.env.TELEGRAM_CHAT_ID && process.env.TELEGRAM_CHAT_ID !== "your_telegram_chat_id_here" && process.env.TELEGRAM_CHAT_ID.trim() !== ""),
    discordConfigured: !!(process.env.DISCORD_WEBHOOK_URL && process.env.DISCORD_WEBHOOK_URL !== "your_discord_webhook_url_here" && process.env.DISCORD_WEBHOOK_URL.trim() !== ""),
    placesKey: maskKey(process.env.GOOGLE_PLACES_API_KEY),
    serperKey: maskKey(process.env.SERPER_API_KEY),
    yelpKey: maskKey(process.env.YELP_API_KEY),
    searchKey: maskKey(process.env.GOOGLE_SEARCH_API_KEY),
    searchEngineId: maskKey(process.env.GOOGLE_SEARCH_ENGINE_ID),
    githubUsername: process.env.GITHUB_USERNAME === "your_github_username" ? "" : (process.env.GITHUB_USERNAME || ""),
    githubRepo: process.env.GITHUB_REPO === "your_templates_repo_name" ? "" : (process.env.GITHUB_REPO || ""),
    githubBranch: process.env.GITHUB_BRANCH || "main",
    githubToken: maskKey(process.env.GITHUB_TOKEN),
    telegramToken: maskKey(process.env.TELEGRAM_BOT_TOKEN),
    telegramChatId: process.env.TELEGRAM_CHAT_ID === "your_telegram_chat_id_here" ? "" : (process.env.TELEGRAM_CHAT_ID || ""),
    discordWebhookUrl: maskKey(process.env.DISCORD_WEBHOOK_URL),
    discordUserId: process.env.DISCORD_USER_ID || "",
    publicSharingDomain: process.env.PUBLIC_SHARING_DOMAIN || "",
    tawkEmbedUrl: process.env.TAWK_EMBED_URL || ""
  });
});

// API Endpoint to save configuration
app.post('/api/config', async (req, res) => {
  const { placesKey, serperKey, yelpKey, searchKey, searchEngineId, githubUsername, githubRepo, githubBranch, githubToken, telegramToken, telegramChatId, discordWebhookUrl, discordUserId, publicSharingDomain, tawkEmbedUrl } = req.body;
  
  try {
    let envContent = "";
    try {
      envContent = await fs.readFile(path.join(__dirname, '.env'), 'utf8');
    } catch (e) {
      // If file doesn't exist, we start empty
    }
    
    // Parse envContent into key-value pairs
    const lines = envContent.split('\n');
    const envObj = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim();
          envObj[key] = value;
        }
      }
    }
    
    // Helper to check if input is a masked key representation
    const isMasked = (val) => val && val.includes('...');
    
    // Only update if value is provided and NOT masked (since masked values are just sent back for show)
    if (placesKey !== undefined && !isMasked(placesKey)) envObj['GOOGLE_PLACES_API_KEY'] = placesKey;
    if (serperKey !== undefined && !isMasked(serperKey)) envObj['SERPER_API_KEY'] = serperKey;
    if (yelpKey !== undefined && !isMasked(yelpKey)) envObj['YELP_API_KEY'] = yelpKey;
    if (searchKey !== undefined && !isMasked(searchKey)) envObj['GOOGLE_SEARCH_API_KEY'] = searchKey;
    if (searchEngineId !== undefined && !isMasked(searchEngineId)) envObj['GOOGLE_SEARCH_ENGINE_ID'] = searchEngineId;
    if (githubUsername !== undefined) envObj['GITHUB_USERNAME'] = githubUsername;
    if (githubRepo !== undefined) envObj['GITHUB_REPO'] = githubRepo;
    if (githubBranch !== undefined) envObj['GITHUB_BRANCH'] = githubBranch;
    if (githubToken !== undefined && !isMasked(githubToken)) envObj['GITHUB_TOKEN'] = githubToken;
    if (telegramToken !== undefined && !isMasked(telegramToken)) envObj['TELEGRAM_BOT_TOKEN'] = telegramToken;
    if (telegramChatId !== undefined) envObj['TELEGRAM_CHAT_ID'] = telegramChatId;
    if (discordWebhookUrl !== undefined && !isMasked(discordWebhookUrl)) envObj['DISCORD_WEBHOOK_URL'] = discordWebhookUrl;
    if (discordUserId !== undefined) envObj['DISCORD_USER_ID'] = discordUserId;
    if (publicSharingDomain !== undefined) envObj['PUBLIC_SHARING_DOMAIN'] = publicSharingDomain;
    if (tawkEmbedUrl !== undefined) envObj['TAWK_EMBED_URL'] = tawkEmbedUrl;
    
    // Re-serialize
    let newEnvContent = "";
    newEnvContent += "# Google Places API Key\n";
    newEnvContent += `GOOGLE_PLACES_API_KEY=${envObj['GOOGLE_PLACES_API_KEY'] || 'your_google_places_api_key_here'}\n\n`;
    newEnvContent += "# Serper.dev Google Search API Key\n";
    newEnvContent += `SERPER_API_KEY=${envObj['SERPER_API_KEY'] || 'your_serper_api_key_here'}\n\n`;
    newEnvContent += "# Yelp Fusion API Key\n";
    newEnvContent += `YELP_API_KEY=${envObj['YELP_API_KEY'] || 'your_yelp_api_key_here'}\n\n`;
    newEnvContent += "# Google Custom Search JSON API Key & Search Engine ID (Legacy)\n";
    newEnvContent += `GOOGLE_SEARCH_API_KEY=${envObj['GOOGLE_SEARCH_API_KEY'] || 'your_google_search_api_key_here'}\n`;
    newEnvContent += `GOOGLE_SEARCH_ENGINE_ID=${envObj['GOOGLE_SEARCH_ENGINE_ID'] || 'your_google_search_engine_id_here'}\n\n`;
    newEnvContent += "# Server Configuration\n";
    newEnvContent += `PORT=${envObj['PORT'] || '3000'}\n\n`;
    newEnvContent += "# GitHub Templates Repository Configurations\n";
    newEnvContent += `GITHUB_USERNAME=${envObj['GITHUB_USERNAME'] || 'your_github_username'}\n`;
    newEnvContent += `GITHUB_REPO=${envObj['GITHUB_REPO'] || 'your_templates_repo_name'}\n`;
    newEnvContent += `GITHUB_BRANCH=${envObj['GITHUB_BRANCH'] || 'main'}\n`;
    newEnvContent += `GITHUB_TOKEN=${envObj['GITHUB_TOKEN'] || 'your_github_token_here'}\n\n`;
    newEnvContent += "# Telegram Phone Notifications Configuration\n";
    newEnvContent += `TELEGRAM_BOT_TOKEN=${envObj['TELEGRAM_BOT_TOKEN'] || 'your_telegram_bot_token_here'}\n`;
    newEnvContent += `TELEGRAM_CHAT_ID=${envObj['TELEGRAM_CHAT_ID'] || 'your_telegram_chat_id_here'}\n\n`;
    newEnvContent += "# Discord Webhook Notifications Configuration\n";
    newEnvContent += `DISCORD_WEBHOOK_URL=${envObj['DISCORD_WEBHOOK_URL'] || 'your_discord_webhook_url_here'}\n`;
    newEnvContent += `DISCORD_USER_ID=${envObj['DISCORD_USER_ID'] || ''}\n\n`;
    newEnvContent += "# Public Sharing Configuration\n";
    newEnvContent += `PUBLIC_SHARING_DOMAIN=${envObj['PUBLIC_SHARING_DOMAIN'] || ''}\n`;
    newEnvContent += `TAWK_EMBED_URL=${envObj['TAWK_EMBED_URL'] || ''}\n`;
    
    await fs.writeFile(path.join(__dirname, '.env'), newEnvContent, 'utf8');
    
    // Reload process.env values in runtime!
    if (placesKey !== undefined && !isMasked(placesKey)) process.env.GOOGLE_PLACES_API_KEY = placesKey;
    if (serperKey !== undefined && !isMasked(serperKey)) process.env.SERPER_API_KEY = serperKey;
    if (yelpKey !== undefined && !isMasked(yelpKey)) process.env.YELP_API_KEY = yelpKey;
    if (searchKey !== undefined && !isMasked(searchKey)) process.env.GOOGLE_SEARCH_API_KEY = searchKey;
    if (searchEngineId !== undefined && !isMasked(searchEngineId)) process.env.GOOGLE_SEARCH_ENGINE_ID = searchEngineId;
    if (githubUsername !== undefined) process.env.GITHUB_USERNAME = githubUsername;
    if (githubRepo !== undefined) envObj['GITHUB_REPO'] = githubRepo; 
    if (githubRepo !== undefined) process.env.GITHUB_REPO = githubRepo;
    if (githubBranch !== undefined) process.env.GITHUB_BRANCH = githubBranch;
    if (githubToken !== undefined && !isMasked(githubToken)) process.env.GITHUB_TOKEN = githubToken;
    if (telegramToken !== undefined && !isMasked(telegramToken)) process.env.TELEGRAM_BOT_TOKEN = telegramToken;
    if (telegramChatId !== undefined) process.env.TELEGRAM_CHAT_ID = telegramChatId;
    if (discordWebhookUrl !== undefined && !isMasked(discordWebhookUrl)) process.env.DISCORD_WEBHOOK_URL = discordWebhookUrl;
    if (discordUserId !== undefined) process.env.DISCORD_USER_ID = discordUserId;
    if (publicSharingDomain !== undefined) process.env.PUBLIC_SHARING_DOMAIN = publicSharingDomain;
    if (tawkEmbedUrl !== undefined) process.env.TAWK_EMBED_URL = tawkEmbedUrl;
    
    res.json({
      success: true,
      message: 'Configuration updated successfully and reloaded into runtime.',
      liveModeAvailable: isLiveModeConfigured()
    });
  } catch (error) {
    console.error('[API Error] Update configuration failed:', error.message);
    res.status(500).json({ error: 'Failed to update configuration: ' + error.message });
  }
});

// Helper to post to Discord with automatic proxy fallback for cloud-hosted environments (e.g. Hugging Face)
async function postDiscordWebhook(webhookUrl, payload, options = {}) {
  // Ensure we have headers and a realistic browser User-Agent to prevent Cloudflare blocks on proxy servers
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ...(options.headers || {})
  };

  const reqOptions = {
    ...options,
    headers
  };

  try {
    return await axios.post(webhookUrl, payload, reqOptions);
  } catch (err) {
    if (webhookUrl.includes('discord.com') || webhookUrl.includes('discordapp.com')) {
      const proxyUrl = webhookUrl
        .replace('discord.com', 'proxy.tmyt105.com')
        .replace('discordapp.com', 'proxy.tmyt105.com');
        
      console.warn(`[Discord Webhook] Direct call failed (${err.message}). Retrying via proxy...`);
      try {
        return await axios.post(proxyUrl, payload, reqOptions);
      } catch (proxyErr) {
        console.error(`[Discord Webhook] Proxy fallback failed:`, proxyErr.message);
        throw proxyErr;
      }
    }
    throw err;
  }
}

// API Endpoint to test configuration connections
app.post('/api/config/test', async (req, res) => {
  const { type } = req.body;
  
  try {
    if (type === 'places') {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey || apiKey === "your_google_places_api_key_here" || apiKey.trim() === "") {
        return res.json({ success: false, error: 'Places API key is not configured.' });
      }
      
      const url = "https://places.googleapis.com/v1/places:searchText";
      const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.id"
      };
      
      const payload = {
        textQuery: "coffee in Paris",
        pageSize: 1
      };
      
      console.log(`[Config Test] Testing Google Places API connection...`);
      const testRes = await axios.post(url, payload, { headers, timeout: 5000 });
      if (testRes.status === 200) {
        return res.json({ success: true, message: 'Google Places API connection successful!' });
      }
    } else if (type === 'serper') {
      const serperKey = getSerperKey();
      if (!serperKey || serperKey === "your_serper_api_key_here" || serperKey.trim() === "") {
        return res.json({ success: false, error: 'Serper.dev API key is not configured.' });
      }
      
      const url = "https://google.serper.dev/search";
      const headers = {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json"
      };
      const payload = {
        q: "coffee in Paris",
        num: 1
      };
      
      console.log(`[Config Test] Testing Serper.dev API connection...`);
      const testRes = await axios.post(url, payload, { headers, timeout: 5000 });
      if (testRes.status === 200) {
        return res.json({ success: true, message: 'Serper.dev API connection successful!' });
      }
    } else if (type === 'yelp') {
      const yelpKey = process.env.YELP_API_KEY;
      if (!yelpKey || yelpKey === "your_yelp_api_key_here" || yelpKey.trim() === "") {
        return res.json({ success: false, error: 'Yelp Fusion API key is not configured.' });
      }
      
      const url = "https://api.yelp.com/v3/businesses/search";
      const headers = {
        "Authorization": `Bearer ${yelpKey}`
      };
      
      console.log(`[Config Test] Testing Yelp Fusion API connection...`);
      const testRes = await axios.get(url, {
        headers,
        params: {
          term: "coffee",
          location: "New York",
          limit: 1
        },
        timeout: 5000
      });
      if (testRes.status === 200) {
        return res.json({ success: true, message: 'Yelp Fusion API connection successful!' });
      }
    } else if (type === 'search') {
      const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
      const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
      
      if (!apiKey || apiKey === "your_google_search_api_key_here" || apiKey.trim() === "") {
        return res.json({ success: false, error: 'Custom Search API Key is not configured.' });
      }
      if (!cx || cx === "your_google_search_engine_id_here" || cx.trim() === "") {
        return res.json({ success: false, error: 'Custom Search Engine ID (CX ID) is not configured.' });
      }
      
      const url = "https://www.googleapis.com/customsearch/v1";
      console.log(`[Config Test] Testing Google Custom Search API connection (Option A)...`);
      const testRes = await axios.get(url, {
        params: {
          key: apiKey,
          cx: cx,
          q: "test",
          num: 1
        },
        timeout: 5000
      });
      
      if (testRes.status === 200) {
        return res.json({ success: true, message: 'Google Custom Search API connection successful!' });
      }
    } else if (type === 'discord') {
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      
      if (!webhookUrl || webhookUrl === "your_discord_webhook_url_here" || webhookUrl.trim() === "") {
        return res.json({ success: false, error: 'Discord Webhook URL is not configured.' });
      }
      
      console.log(`[Config Test] Sending test Discord notification...`);
      const userId = process.env.DISCORD_USER_ID;
      const mention = (userId && userId.trim() !== "") ? `<@${userId.trim()}>` : "@everyone";
      
      const testRes = await postDiscordWebhook(webhookUrl, {
        content: `${mention} 🔔 **Spy Alert Test**\nYour Lead Tracker notification integration is working successfully! You will now receive real-time notifications on your phone.`,
        allowed_mentions: {
          parse: ["everyone", "users"]
        }
      }, { timeout: 5000 });
      
      if (testRes.status === 200 || testRes.status === 204) {
        return res.json({ success: true, message: 'Discord test message sent successfully! Check your phone.' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid test type specified.' });
    }
  } catch (error) {
    console.error('[API Error] Connection test failed:', error.message);
    const details = error.response && error.response.data && error.response.data.error 
      ? error.response.data.error.message 
      : error.message;
    return res.json({ success: false, error: `Connection failed: ${details}` });
  }
});

// API Endpoint to scan local leads
app.post('/api/scan', async (req, res) => {
  const { niche, location, forceMock } = req.body;
  
  if (!niche || !location) {
    return res.status(400).json({ error: 'Niche and Location are required parameters.' });
  }
  
  try {
    const leads = await scanLocalLeads(niche, location, forceMock === true);
    latestScannedLeads = leads; // Cache in memory
    res.json({
      success: true,
      niche,
      location,
      mode: (forceMock || !isLiveModeConfigured()) ? 'mock' : 'live',
      leads
    });
  } catch (error) {
    console.error('[API Error] Scan failed:', error.message);
    res.status(500).json({ error: 'An error occurred during the local scan: ' + error.message });
  }
});

// ─── Ad Scanner API Endpoint ──────────────────────────────────────────────────
// POST /api/scan-ads
// Body: { niche: string, city: string, platforms: string[] }
// Returns: { success, niche, city, platforms, leads[] }
app.post('/api/scan-ads', async (req, res) => {
  const { niche, city, platforms } = req.body;

  if (!niche || !city) {
    return res.status(400).json({ error: 'Niche and City are required.' });
  }

  const selectedPlatforms = Array.isArray(platforms) && platforms.length > 0
    ? platforms
    : ['instagram', 'facebook', 'tiktok'];

  console.log(`[Ad Scanner API] Scanning: niche="${niche}", city="${city}", platforms=[${selectedPlatforms.join(',')}]`);

  try {
    const leads = await scanAdLeads(niche, city, selectedPlatforms);
    res.json({
      success: true,
      niche,
      city,
      platforms: selectedPlatforms,
      leads
    });
  } catch (error) {
    console.error('[Ad Scanner API] Error:', error.message);
    res.status(500).json({ error: 'Ad scan failed: ' + error.message });
  }
});

// POST /api/scan-google-ads
// Body: { niche: string, city: string, engines: string[], scoreWebsites: boolean }
// Returns: { success, leads[] }
app.post('/api/scan-google-ads', async (req, res) => {
  const { niche, city, engines, scoreWebsites } = req.body;

  if (!niche || !city) {
    return res.status(400).json({ error: 'Niche and City are required.' });
  }

  const selectedEngines = Array.isArray(engines) && engines.length > 0
    ? engines
    : ['google', 'bing'];

  const doScore = scoreWebsites !== false; // default true

  console.log(`[Google Ads API] Scanning: niche="${niche}", city="${city}", engines=[${selectedEngines.join(',')}], score=${doScore}`);

  try {
    const leads = await scanGoogleAds(niche, city, selectedEngines, doScore);
    res.json({ success: true, niche, city, engines: selectedEngines, leads });
  } catch (error) {
    console.error('[Google Ads API] Error:', error.message);
    res.status(500).json({ error: 'Google Ads scan failed: ' + error.message });
  }
});

// POST /api/scan-directory
// Body: { niche: string, city: string, minReviews: number }
// Returns: { success, leads[] }
app.post('/api/scan-directory', async (req, res) => {
  const { niche, city, minReviews } = req.body;

  if (!niche || !city) {
    return res.status(400).json({ error: 'Niche and City are required.' });
  }

  const reviewThreshold = parseInt(minReviews, 10) || 0;
  console.log(`[Directory Scanner API] Scanning directory: niche="${niche}", city="${city}", minReviews=${reviewThreshold}`);

  try {
    const leads = await scanDirectory(niche, city, reviewThreshold);
    res.json({ success: true, niche, city, minReviews: reviewThreshold, leads });
  } catch (error) {
    console.error('[Directory Scanner API] Error:', error.message);
    res.status(500).json({ error: 'Directory scan failed: ' + error.message });
  }
});

const fs = require('fs').promises;
const DB_PATH = path.join(__dirname, 'leads_db.json');

const GH_OWNER = 'pms5566';
const GH_REPO = 'leadscope';
const GH_PATH = 'leads_db.json';

let dbQueue = Promise.resolve();
let dbCache = null;
let dbCacheTime = 0;
const CACHE_TTL = 10000; // 10 seconds cache TTL for read performance

async function readDb() {
  return new Promise((resolve) => {
    dbQueue = dbQueue.then(async () => {
      // Return memory cache if fresh
      if (dbCache && (Date.now() - dbCacheTime < CACHE_TTL)) {
        return resolve(dbCache);
      }

      // Try reading from GitHub if token is set
      const token = process.env.GITHUB_TOKEN;
      if (token && token.startsWith('ghp_')) {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`,
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'LeadScope-App'
              }
            }
          );
          const base64Content = response.data.content;
          const sha = response.data.sha;
          const fileContent = Buffer.from(base64Content, 'base64').toString('utf8');
          const parsed = JSON.parse(fileContent);
          
          dbCache = parsed;
          dbCache.sha = sha;
          dbCacheTime = Date.now();
          
          return resolve(dbCache);
        } catch (error) {
          const errMsg = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
          console.error('[GitHub DB] Failed to read from GitHub, falling back to local file:', errMsg);
        }
      }

      // Fallback: Read local file
      try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const parsed = JSON.parse(data);
        dbCache = parsed;
        dbCacheTime = Date.now();
        resolve(dbCache);
      } catch (error) {
        if (error.code === 'ENOENT') {
          const defaultDb = { leads: [], shortLinks: {} };
          try {
            await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf8');
          } catch (writeErr) {
            console.error('Failed to initialize empty leads_db.json:', writeErr);
          }
          resolve(defaultDb);
        } else {
          console.error('Failed to read leads_db.json:', error);
          resolve({ leads: [], shortLinks: {} });
        }
      }
    }).catch(err => {
      console.error('Queue error in readDb:', err);
      resolve({ leads: [], shortLinks: {} });
    });
  });
}

async function writeDb(data, syncToGithub = true) {
  return new Promise((resolve) => {
    dbQueue = dbQueue.then(async () => {
      // 1. Keep local file updated for local runtime fallback
      try {
        const dataCopy = { ...data };
        delete dataCopy.sha;
        dataCopy.activeVisits = activeVisits; // Keep activeVisits persistent
        await fs.writeFile(DB_PATH, JSON.stringify(dataCopy, null, 2), 'utf8');
      } catch (error) {
        console.error('Failed to write local database file:', error);
      }

      dbCache = data;
      dbCacheTime = Date.now();

      // 2. Synchronize to GitHub repository if token is set and sync is enabled
      const token = process.env.GITHUB_TOKEN;
      if (syncToGithub && token && token.startsWith('ghp_')) {
        try {
          let sha = data.sha;
          if (!sha) {
            try {
              const metaResponse = await axios.get(
                `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`,
                {
                  headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                    'User-Agent': 'LeadScope-App'
                  }
                }
              );
              sha = metaResponse.data.sha;
            } catch (metaErr) {
              console.warn('[GitHub DB] No existing database file found on GitHub (creating new).');
            }
          }

          const dataCopy = { ...data };
          delete dataCopy.sha;
          dataCopy.activeVisits = activeVisits; // Keep activeVisits persistent on GitHub
          const jsonStr = JSON.stringify(dataCopy, null, 2);
          const base64Content = Buffer.from(jsonStr).toString('base64');

          const updateResponse = await axios.put(
            `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`,
            {
              message: 'db: synchronize CRM database',
              content: base64Content,
              sha: sha
            },
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'LeadScope-App'
              }
            }
          );
          
          data.sha = updateResponse.data.content.sha;
          console.log('[GitHub DB] Successfully synchronized database with GitHub.');
          return resolve(true);
        } catch (error) {
          const errMsg = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
          console.error('[GitHub DB] Failed to push database to GitHub:', errMsg);
        }
      }

      resolve(true);
    }).catch(err => {
      console.error('Queue error in writeDb:', err);
      resolve(true);
    });
  });
}

// CRM Endpoints
app.get('/api/crm', async (req, res) => {
  try {
    const db = await readDb();
    let updated = false;

    if (!db.shortLinks) {
      db.shortLinks = {};
    }

    if (db.leads && Array.isArray(db.leads)) {
      for (let lead of db.leads) {
        if (!lead.shortAlias) {
          let baseAlias = slugify(lead.name);
          if (!baseAlias) baseAlias = 'lead-' + lead.id;

          let alias = baseAlias;
          if (db.shortLinks[alias]) {
            let attempts = 0;
            do {
              const hash = Math.random().toString(36).substring(2, 6);
              alias = `${baseAlias}-${hash}`;
              attempts++;
            } while (db.shortLinks[alias] && attempts < 100);
          }

          const baseUrl = getBaseUrlFromReq(req);
          const cleanNiche = (lead.niche || 'cafe').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
          let longUrl = '';
          if (lead.portfolioLink && (lead.portfolioLink.startsWith('http://') || lead.portfolioLink.startsWith('https://'))) {
            longUrl = lead.portfolioLink;
          } else {
            const tNiche = lead.portfolioLink || cleanNiche;
            longUrl = `${baseUrl}/preview/${tNiche}/${lead.id}?name=${encodeURIComponent(lead.name || '')}&phone=${encodeURIComponent(lead.phone || '')}&address=${encodeURIComponent(lead.address || '')}`;
          }

          db.shortLinks[alias] = longUrl;
          lead.shortAlias = alias;
          lead.updatedAt = new Date().toISOString();
          updated = true;
        }
      }
    }

    if (updated) {
      await writeDb(db);
    }
    res.json({ success: true, leads: db.leads });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve CRM leads: ' + error.message });
  }
});

app.post('/api/crm', async (req, res) => {
  const { lead } = req.body;
  if (!lead || !lead.name) {
    return res.status(400).json({ error: 'Lead data with a name is required.' });
  }
  
  try {
    const db = await readDb();
    if (!db.shortLinks) {
      db.shortLinks = {};
    }
    
    // Generate simple unique ID if missing
    if (!lead.id) {
      lead.id = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    const index = db.leads.findIndex(l => l.id === lead.id || (l.name === lead.name && l.phone === lead.phone && l.phone && l.phone !== 'N/A'));
    let savedLead;
    
    if (index !== -1) {
      // Update existing lead
      savedLead = {
        ...db.leads[index],
        ...lead,
        updatedAt: new Date().toISOString()
      };
      db.leads[index] = savedLead;
    } else {
      // Create new lead
      savedLead = {
        ...lead,
        status: lead.status || 'new',
        notes: lead.notes || '',
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.leads.push(savedLead);
    }

    // Auto-generate shortAlias if missing
    if (!savedLead.shortAlias) {
      let baseAlias = slugify(savedLead.name);
      if (!baseAlias) baseAlias = 'lead-' + savedLead.id;

      let alias = baseAlias;
      if (db.shortLinks[alias]) {
        let attempts = 0;
        do {
          const hash = Math.random().toString(36).substring(2, 6);
          alias = `${baseAlias}-${hash}`;
          attempts++;
        } while (db.shortLinks[alias] && attempts < 100);
      }
      savedLead.shortAlias = alias;
    }

    // Always update shortlink destination URL in map to match current template/niche
    const baseUrl = getBaseUrlFromReq(req);
    const cleanNiche = (savedLead.niche || 'cafe').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
    let longUrl = '';
    if (savedLead.portfolioLink && (savedLead.portfolioLink.startsWith('http://') || savedLead.portfolioLink.startsWith('https://'))) {
      longUrl = savedLead.portfolioLink;
    } else {
      const tNiche = savedLead.portfolioLink || cleanNiche;
      longUrl = `${baseUrl}/preview/${tNiche}/${savedLead.id}?name=${encodeURIComponent(savedLead.name || '')}&phone=${encodeURIComponent(savedLead.phone || '')}&address=${encodeURIComponent(savedLead.address || '')}`;
    }
    db.shortLinks[savedLead.shortAlias] = longUrl;
    
    await writeDb(db);
    res.json({ success: true, lead: savedLead });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save CRM lead: ' + error.message });
  }
});

app.delete('/api/crm/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await readDb();
    db.leads = db.leads.filter(l => l.id !== id);
    await writeDb(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete CRM lead: ' + error.message });
  }
});

// URL Shortening & Redirect APIs
function getBaseUrlFromReq(req) {
  let domain = process.env.PUBLIC_SHARING_DOMAIN;
  if (domain && domain.trim() !== '') {
    domain = domain.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'https://' + domain;
    }
    return domain.replace(/\/$/, '');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}`;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Redirect Route - placed early to handle short URLs quickly
app.get('/go/:alias', async (req, res) => {
  const { alias } = req.params;
  
  try {
    const db = await readDb();
    const shortLinks = db.shortLinks || {};
    
    let longUrl = shortLinks[alias];
    
    // Fallback: Check active scan cache first, then CRM database
    if (!longUrl) {
      let lead = latestScannedLeads.find(l => l.id === alias);
      if (!lead && db.leads) {
        lead = db.leads.find(l => l.shortAlias === alias || l.id === alias);
      }
      if (lead) {
        const baseUrl = getBaseUrlFromReq(req);
        const cleanNiche = (lead.niche || 'cafe').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
        if (lead.portfolioLink && (lead.portfolioLink.startsWith('http://') || lead.portfolioLink.startsWith('https://'))) {
          longUrl = lead.portfolioLink;
        } else {
          const tNiche = lead.portfolioLink || cleanNiche;
          longUrl = `${baseUrl}/preview/${tNiche}/${lead.id}?name=${encodeURIComponent(lead.name || '')}&phone=${encodeURIComponent(lead.phone || '')}&address=${encodeURIComponent(lead.address || '')}`;
        }
      }
    }

    if (longUrl) {
      if (longUrl.includes('/preview/')) {
        const idx = longUrl.indexOf('/preview/');
        longUrl = longUrl.substring(idx);
      }
      return res.redirect(longUrl);
    }

    // Render a premium dark-mode 404 page if alias not found
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo Link Expired or Not Found</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          :root {
            --color-bg: #0b0f19;
            --color-surface: #131b2e;
            --color-border: rgba(255, 255, 255, 0.08);
            --color-text-primary: #f8fafc;
            --color-text-secondary: #94a3b8;
            --color-cyan: #00d9f5;
            --color-rose: #f43f5e;
          }
          body {
            background-color: var(--color-bg);
            color: var(--color-text-primary);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1.5rem;
            box-sizing: border-box;
          }
          .card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 16px;
            padding: 3rem 2rem;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
          }
          .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--color-rose) 0%, var(--color-cyan) 100%);
          }
          .icon-container {
            width: 80px;
            height: 80px;
            background: rgba(244, 63, 94, 0.1);
            border: 1px solid rgba(244, 63, 94, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            color: var(--color-rose);
            font-size: 2.2rem;
          }
          h1 {
            font-size: 1.6rem;
            font-weight: 700;
            margin: 0 0 0.75rem;
            letter-spacing: -0.025em;
          }
          p {
            color: var(--color-text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 2rem;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(0, 217, 245, 0.2);
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 217, 245, 0.35);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon-container">
            <i class="fa-solid fa-link-slash"></i>
          </div>
          <h1>Proposal Link Expired</h1>
          <p>The personalized proposal preview link you clicked is invalid, expired, or has been removed by the sender.</p>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 1.5rem; line-height: 1.4;">If you believe this is an error, please contact the sender directly.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Redirection error:', error);
    res.status(500).send('An error occurred while redirecting.');
  }
});

app.post('/api/shorten', async (req, res) => {
  let { longUrl, customAlias, name } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required.' });
  }

  // 🔒 Sanitize: if the longUrl contains localhost/127.0.0.1, replace it with the
  // configured PUBLIC_SHARING_DOMAIN so stored links always point to the live cloud server.
  const publicDomain = process.env.PUBLIC_SHARING_DOMAIN ? process.env.PUBLIC_SHARING_DOMAIN.trim().replace(/\/$/, '') : null;
  if (publicDomain) {
    try {
      const parsed = new URL(longUrl);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        parsed.hostname = new URL(publicDomain).hostname;
        parsed.protocol = new URL(publicDomain).protocol;
        parsed.port = '';
        longUrl = parsed.toString();
        console.log(`[Shorten] Rewrote localhost URL to: ${longUrl}`);
      }
    } catch (e) { /* not a full URL, leave as-is */ }
  }

  try {
    const db = await readDb();
    if (!db.shortLinks) {
      db.shortLinks = {};
    }

    let alias = '';
    
    // Check if this exact longUrl is already shortened to prevent duplicate links (only if no custom alias is requested)
    if (!customAlias) {
      const existing = Object.keys(db.shortLinks).find(k => db.shortLinks[k] === longUrl);
      if (existing) {
        const baseUrl = getBaseUrlFromReq(req);
        return res.json({ success: true, shortUrl: `${baseUrl}/go/${existing}`, alias: existing });
      }
    }

    if (customAlias) {
      alias = slugify(customAlias);
      if (!alias) {
        return res.status(400).json({ error: 'Invalid custom alias format.' });
      }
      if (db.shortLinks[alias]) {
        return res.status(400).json({ error: 'This custom alias is already in use.' });
      }
    } else {
      let baseAlias = '';
      if (name) {
        baseAlias = slugify(name);
      }
      if (!baseAlias) {
        baseAlias = 'link';
      }

      if (!db.shortLinks[baseAlias]) {
        alias = baseAlias;
      } else {
        let attempts = 0;
        do {
          const hash = Math.random().toString(36).substring(2, 6);
          alias = `${baseAlias}-${hash}`;
          attempts++;
        } while (db.shortLinks[alias] && attempts < 100);
      }
    }

    db.shortLinks[alias] = longUrl;
    await writeDb(db);

    const baseUrl = getBaseUrlFromReq(req);
    res.json({ success: true, shortUrl: `${baseUrl}/go/${alias}`, alias });
  } catch (error) {
    console.error('Failed to shorten link:', error);
    res.status(500).json({ error: 'Failed to shorten link: ' + error.message });
  }
});

app.post('/api/shorten/bulk', async (req, res) => {
  const { name, links } = req.body;
  if (!links || !Array.isArray(links)) {
    return res.status(400).json({ error: 'links array is required.' });
  }

  try {
    const db = await readDb();
    if (!db.shortLinks) {
      db.shortLinks = {};
    }

    const baseUrl = getBaseUrlFromReq(req);
    const results = [];
    const baseBizName = name ? slugify(name) : 'biz';

    for (const item of links) {
      const { niche, longUrl } = item;
      if (!longUrl) continue;

      // Check if existing
      const existing = Object.keys(db.shortLinks).find(k => db.shortLinks[k] === longUrl);
      if (existing) {
        results.push({ niche, shortUrl: `${baseUrl}/go/${existing}`, alias: existing });
        continue;
      }

      // Generate a nice name-niche alias
      const cleanNiche = slugify(niche || 'preview');
      let alias = `${baseBizName}-${cleanNiche}`;
      
      if (db.shortLinks[alias]) {
        let attempts = 0;
        do {
          const hash = Math.random().toString(36).substring(2, 6);
          alias = `${baseBizName}-${cleanNiche}-${hash}`;
          attempts++;
        } while (db.shortLinks[alias] && attempts < 100);
      }

      db.shortLinks[alias] = longUrl;
      results.push({ niche, shortUrl: `${baseUrl}/go/${alias}`, alias });
    }

    await writeDb(db);
    res.json({ success: true, shortLinks: results });
  } catch (error) {
    console.error('Failed to bulk shorten links:', error);
    res.status(500).json({ error: 'Failed to bulk shorten links: ' + error.message });
  }
});

app.post('/api/crm/shorten', async (req, res) => {
  const { leadId, customAlias } = req.body;
  if (!leadId) {
    return res.status(400).json({ error: 'leadId is required.' });
  }

  try {
    const db = await readDb();
    const leadIndex = db.leads.findIndex(l => l.id === leadId);
    if (leadIndex === -1) {
      return res.status(404).json({ error: 'Lead not found in CRM.' });
    }

    const lead = db.leads[leadIndex];
    if (!db.shortLinks) {
      db.shortLinks = {};
    }

    let alias = '';
    if (customAlias) {
      alias = slugify(customAlias);
      if (!alias) {
        return res.status(400).json({ error: 'Invalid custom alias.' });
      }
      if (db.shortLinks[alias] && db.shortLinks[alias] !== leadId) {
        return res.status(400).json({ error: 'This custom alias is already in use.' });
      }
    } else {
      let baseAlias = slugify(lead.name);
      if (!baseAlias) baseAlias = 'lead-' + leadId;

      if (!db.shortLinks[baseAlias]) {
        alias = baseAlias;
      } else {
        let attempts = 0;
        do {
          const hash = Math.random().toString(36).substring(2, 6);
          alias = `${baseAlias}-${hash}`;
          attempts++;
        } while (db.shortLinks[alias] && attempts < 100);
      }
    }

    // Determine the actual long URL for this lead
    const baseUrl = getBaseUrlFromReq(req);
    const cleanNiche = (lead.niche || 'cafe').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
    let longUrl = '';
    if (lead.portfolioLink && (lead.portfolioLink.startsWith('http://') || lead.portfolioLink.startsWith('https://'))) {
      longUrl = lead.portfolioLink;
    } else {
      const tNiche = lead.portfolioLink || cleanNiche;
      longUrl = `${baseUrl}/preview/${tNiche}/${lead.id}?name=${encodeURIComponent(lead.name || '')}&phone=${encodeURIComponent(lead.phone || '')}&address=${encodeURIComponent(lead.address || '')}`;
    }

    // Save alias mapping
    db.shortLinks[alias] = longUrl;
    
    // Save shortAlias inside lead object
    lead.shortAlias = alias;
    lead.updatedAt = new Date().toISOString();
    db.leads[leadIndex] = lead;

    await writeDb(db);

    res.json({ success: true, shortUrl: `${baseUrl}/go/${alias}`, alias });
  } catch (error) {
    console.error('Failed to shorten CRM lead link:', error);
    res.status(500).json({ error: 'Failed to shorten lead link: ' + error.message });
  }
});

// Helper: set correct Content-Type and send asset buffer
function sendAsset(res, filePath, content) {
  if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
  else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
  else if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
  else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) res.setHeader('Content-Type', 'image/jpeg');
  else if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
  else if (filePath.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
  res.send(content);
}

// Serve and personalize sub-pages of multi-page templates (e.g. services.html, packages.html)
app.get('/preview/:niche/:leadId/:page.html', async (req, res) => {
  const { niche, leadId, page } = req.params;
  const pageFile = `${page}.html`;
  
  try {
    // 1. Fetch lead
    let lead = latestScannedLeads.find(l => l.id === leadId);
    if (!lead) {
      const db = await readDb();
      lead = db.leads.find(l => l.id === leadId);
    }
    if (!lead && req.query.name) {
      lead = { id: leadId, name: req.query.name, phone: req.query.phone || 'N/A', address: req.query.address || 'N/A' };
    }
    if (!lead) {
      return res.status(404).send('<h1>Lead Proposal Not Found</h1>');
    }

    // 2. Load custom subpage locally
    let html;
    const fs = require('fs').promises;
    const resolvedLocalFolder = await resolveLocalNicheFolder(niche);
    if (resolvedLocalFolder) {
      const localHtmlPath = path.join(__dirname, 'my_raw_templates', resolvedLocalFolder, pageFile);
      html = await fs.readFile(localHtmlPath, 'utf8').catch(() => null);
    }
    
    // Fallback to GitHub for sub-page if not found locally
    if (!html) {
      try {
        const resolvedGithubFolder = await resolveGithubNicheFolder(niche);
        const githubFolder = resolvedGithubFolder || niche;
        html = await fetchFromGithub(`${githubFolder}/${pageFile}`, 'utf8').catch(() => null);
      } catch (e) {}
    }

    if (!html) {
      return res.status(404).send(`<h1>Sub-page "${pageFile}" Not Found</h1>`);
    }

    // 3. Replace placeholders in subpage
    const businessName = lead.name || 'Our Premium Business';
    const phone = (lead.phone && lead.phone !== 'N/A') ? lead.phone : 'Contact Us';
    const address = (lead.address && lead.address !== 'N/A') ? lead.address : 'Our Location';
    
    html = html.replace(/\{\{BUSINESS_NAME\}\}/g, businessName);
    html = html.replace(/\{\{PHONE\}\}/g, phone);
    html = html.replace(/\{\{ADDRESS\}\}/g, address);

    // 4. Rewrite relative links inside the sub-page (preserving query parameters for stateless linkgen leads)
    const nameParam = req.query.name ? `name=${encodeURIComponent(req.query.name)}` : '';
    const phoneParam = req.query.phone ? `phone=${encodeURIComponent(req.query.phone)}` : '';
    const addrParam = req.query.address ? `address=${encodeURIComponent(req.query.address)}` : '';
    const paramsList = [nameParam, phoneParam, addrParam].filter(Boolean).join('&');
    const queryStr = paramsList ? `?${paramsList}` : '';

    html = html.replace(/href="(?!\/\/|http|https|mailto|tel|#)([^"]+\.html)([^"]*)"/g, (match, p, hash) => {
      const linkBase = p === 'index.html' 
        ? `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}`
        : `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}/${p}`;
      return `href="${linkBase}${queryStr}${hash || ''}"`;
    });
    html = html.replace(/href='(?!\/\/|http|https|mailto|tel|#)([^']+\.html)([^']*)'/g, (match, p, hash) => {
      const linkBase = p === 'index.html' 
        ? `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}`
        : `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}/${p}`;
      return `href='${linkBase}${queryStr}${hash || ''}'`;
    });

    // 5. Inject tracking scripts so navigation transitions still log visits!
    const hideScrollbarStyle = `
      <style>
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      </style>
    `;

    const personalizationScript = `
      <script>
        (function() {
          const logoText = document.querySelector('.logo');
          if (logoText) {
            logoText.setAttribute('href', '/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}');
          }
        })();
      </script>
    `;

    const trackingScript = `
      <script>
        (function() {
          const leadId = ${JSON.stringify(leadId)};
          const leadName = ${JSON.stringify(businessName + ' (' + niche + ' - ' + page + ')')};
          const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
          
          async function sendEvent(event, details = {}) {
            try {
              await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, leadName, event, details: { device, ...details } })
              });
            } catch (err) {}
          }
          
          // Track sub-page load
          sendEvent('open_page', { page: ${JSON.stringify(pageFile)} });

          // Scroll and active duration tracking runs inside the scrollable embedded page
          let totalSeconds = 0;
          let maxScroll = 0;
          
          setInterval(() => {
            totalSeconds += 10;
            
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
            
            if (scrollPercent > maxScroll) {
              maxScroll = scrollPercent;
            }
            
            sendEvent('heartbeat', { seconds: 10, scrollPercent: maxScroll, page: ${JSON.stringify(pageFile)} });
          }, 10000);
        })();
      </script>
    `;

    html = html.replace('</head>', `${hideScrollbarStyle}</head>`);
    html = html.replace('</body>', `${personalizationScript}${trackingScript}</body>`);
    
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (err) {
    console.error('[Sub-page Load Error]', err);
    res.status(500).send('<h1>Error Loading Sub-page</h1>');
  }
});

// Dynamic Asset Proxy from GitHub Templates Repository
app.get('/preview/:niche/*', async (req, res, next) => {
  const { niche } = req.params;
  const rawPath = req.params[0]; // Wildcard matches relative assets
  
  if (!rawPath || !rawPath.includes('.')) {
    return next(); // Fall through to index.html lead preview route
  }

  // Clean leadId segment if browser resolved relative to a subpage URL (e.g. leadId/style.css)
  let filePath = rawPath;
  const parts = rawPath.split('/');
  if (parts.length > 1) {
    const firstPart = parts[0];
    if (firstPart.startsWith('lead') || firstPart.startsWith('preview') || /^[a-z0-9_-]{8,}$/i.test(firstPart)) {
      filePath = parts.slice(1).join('/');
    }
  }
  
  // Try local filesystem first (with fuzzy folder resolution)
  try {
    const fs = require('fs').promises;
    const resolvedFolder = await resolveLocalNicheFolder(niche);
    const localAssetPath = path.join(__dirname, 'my_raw_templates', resolvedFolder || niche, filePath);
    const content = await fs.readFile(localAssetPath);
    return sendAsset(res, filePath, content);
  } catch (localErr) {
    // If not found locally, fall through to GitHub
  }
  
  try {
    const fileContent = await fetchFromGithub(`${niche}/${filePath}`, 'arraybuffer');
    // If the above failed due to wrong folder name, try resolving the GitHub folder
    return sendAsset(res, filePath, fileContent);
  } catch (err) {
    // Try with resolved GitHub folder name
    try {
      const resolvedFolder = await resolveGithubNicheFolder(niche);
      if (resolvedFolder && resolvedFolder !== niche) {
        const fileContent = await fetchFromGithub(`${resolvedFolder}/${filePath}`, 'arraybuffer');
        return sendAsset(res, filePath, fileContent);
      }
    } catch (e2) { /* ignore */ }
    console.warn(`[GitHub/Local Asset Load Fail] ${niche}/${filePath}:`, err.message);
    res.status(404).send('Asset not found');
  }
});

// Dynamic Website Preview Personalizer & Sticky Header Banner
app.get('/preview/:niche/:leadId', async (req, res) => {
  const { niche, leadId } = req.params;
  
  try {
    // 1. Fetch lead from memory cache or CRM database
    let lead = latestScannedLeads.find(l => l.id === leadId);
    if (!lead) {
      const db = await readDb();
      lead = db.leads.find(l => l.id === leadId);
    }
    
    // Stateless fallback: if lead is not found, check if business details are supplied in query params
    if (!lead && req.query.name) {
      lead = {
        id: leadId,
        name: req.query.name,
        phone: req.query.phone || 'N/A',
        address: req.query.address || 'N/A'
      };
    }
    
    if (!lead) {
      return res.status(404).send('<h1>Lead Proposal Not Found</h1><p>Ensure the scan was run or the lead is saved in CRM.</p>');
    }
    
    // 2. Fetch template HTML (Try local folder, local sites file, or GitHub fallback)
    let html;
    let resolvedLocalFolder = null;
    try {
      // a. Try custom local folder — with fuzzy folder name resolution
      const fs = require('fs').promises;
      resolvedLocalFolder = await resolveLocalNicheFolder(niche);
      if (resolvedLocalFolder) {
        const localHtmlPath = path.join(__dirname, 'my_raw_templates', resolvedLocalFolder, 'index.html');
        html = await fs.readFile(localHtmlPath, 'utf8');
        console.log(`[Template Loader] Local folder match: "${niche}" → "${resolvedLocalFolder}"`);
      }
    } catch (localErr) {
      // b. Try matching one of the template files in local sites folder
      const matchedFile = await findNicheTemplate(niche);
      if (matchedFile) {
        try {
          const fs = require('fs').promises;
          const sitesHtmlPath = path.join(__dirname, 'my_raw_templates', 'sites', matchedFile);
          html = await fs.readFile(sitesHtmlPath, 'utf8');
        } catch (sitesErr) {
          // Fall through to GitHub fallback for sites/
        }
      }
    }

    if (!html) {
      try {
        // c. Fallback: Try custom folder on GitHub — with fuzzy folder name resolution
        const resolvedGithubFolder = await resolveGithubNicheFolder(niche);
        const githubFolder = resolvedGithubFolder || niche;
        html = await fetchFromGithub(`${githubFolder}/index.html`, 'utf8');
      } catch (githubErr) {
        // d. Fallback: Try matching site file on GitHub sites/ folder
        const matchedFile = await findNicheTemplate(niche);
        if (matchedFile) {
          try {
            html = await fetchFromGithub(`sites/${matchedFile}`, 'utf8');
          } catch (githubSitesErr) {
            console.error(`[Template Load Fail] GitHub sites/${matchedFile}:`, githubSitesErr.message);
          }
        }
      }
    }

    if (!html) {
      console.error(`[Template Load Fail] No template found for "${niche}" locally or on GitHub.`);
      return res.status(404).send(`<h1>Template Not Found</h1><p>Ensure the template for niche <strong>"${niche}"</strong> exists locally or in your GitHub repository.</p>`);
    }
    
    // 3. Replace placeholders
    const businessName = lead.name || 'Our Premium Business';
    const phone = (lead.phone && lead.phone !== 'N/A') ? lead.phone : 'Contact Us';
    const address = (lead.address && lead.address !== 'N/A') ? lead.address : 'Our Location';
    
    html = html.replace(/\{\{BUSINESS_NAME\}\}/g, businessName);
    html = html.replace(/\{\{PHONE\}\}/g, phone);
    html = html.replace(/\{\{ADDRESS\}\}/g, address);
    
    // Rewrite relative HTML links to be lead-specific (preserving leadId, niche, and query parameters)
    const nameParam = req.query.name ? `name=${encodeURIComponent(req.query.name)}` : '';
    const phoneParam = req.query.phone ? `phone=${encodeURIComponent(req.query.phone)}` : '';
    const addrParam = req.query.address ? `address=${encodeURIComponent(req.query.address)}` : '';
    const paramsList = [nameParam, phoneParam, addrParam].filter(Boolean).join('&');
    const queryStr = paramsList ? `?${paramsList}` : '';

    html = html.replace(/href="(?!\/\/|http|https|mailto|tel|#)([^"]+\.html)([^"]*)"/g, (match, p, hash) => {
      const linkBase = p === 'index.html' 
        ? `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}`
        : `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}/${p}`;
      return `href="${linkBase}${queryStr}${hash || ''}"`;
    });
    html = html.replace(/href='(?!\/\/|http|https|mailto|tel|#)([^']+\.html)([^']*)'/g, (match, p, hash) => {
      const linkBase = p === 'index.html' 
        ? `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}`
        : `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}/${p}`;
      return `href='${linkBase}${queryStr}${hash || ''}'`;
    });
    
    // 4. Check if we are loading inside the device preview iframe
    const isEmbed = req.query.embed === 'true';
    
    const whatsappPhone = process.env.AGENCY_WHATSAPP_PHONE || '917696507509';
    const fiverrUrl = process.env.AGENCY_FIVERR_URL || 'https://www.fiverr.com/s/gDeZRvL';
    const emailAddress = process.env.AGENCY_EMAIL || 'nobizweb@gmail.com';
    const waText = encodeURIComponent(`Hi! I am looking at the custom website proposal for my business, "${businessName}". I would like to request some custom modifications!`);
    const waLink = `https://wa.me/${whatsappPhone}?text=${waText}`;
    const emailSubject = encodeURIComponent(`Feedback on Custom Website Proposal for ${businessName}`);
    const emailBody = encodeURIComponent(`Hi!\n\nI was looking at the custom website proposal draft you created for my business, "${businessName}". I would like to request some modifications!`);
    const emailLink = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;
    
    // Extract a clean city name from address for the marquee social proof
    let cityName = '';
    if (lead.address && lead.address !== 'N/A') {
      const parts = lead.address.split(',');
      if (parts.length > 1) {
        cityName = parts[parts.length - 2].trim();
      } else {
        cityName = parts[0].trim();
      }
    }
    if (!cityName || cityName === 'India' || cityName === 'USA' || cityName === 'N/A') {
      cityName = 'your area';
    }

    if (!isEmbed) {
      // ─── OUTER DEVICE PREVIEW WRAPPER PAGE ──────────────────────────────────
      const tawkEmbedUrl = process.env.TAWK_EMBED_URL || '';
      const hasTawk = tawkEmbedUrl.trim() !== '';
      
      const queryParams = new URLSearchParams();
      if (req.query.name) queryParams.set('name', req.query.name);
      if (req.query.phone) queryParams.set('phone', req.query.phone);
      if (req.query.address) queryParams.set('address', req.query.address);
      queryParams.set('embed', 'true');
      const iframeSrc = `/preview/${encodeURIComponent(niche)}/${encodeURIComponent(leadId)}?${queryParams.toString()}`;
      
      const wrapperHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Website Proposal - ${businessName}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* Base Reset and Styling */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: #0b0f19 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      overflow: hidden !important;
      color: #f1f5f9 !important;
      box-sizing: border-box !important;
    }
    *, *:before, *:after {
      box-sizing: inherit !important;
    }

    /* 3-Layer Sticky Header Banner */
    .ls-proposal-banner {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 140px !important;
      background: #0b0f19 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      display: flex !important;
      flex-direction: column !important;
      z-index: 2147483647 !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
    }

    #ls-viewport-container {
      margin-top: 140px !important;
      width: 100% !important;
      height: calc(100vh - 140px) !important;
      overflow: auto !important;
      background: #090d16 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      transition: all 0.3s ease !important;
      padding: 0 !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    #ls-viewport-container::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* TOP LAYER: Marquee styling */
    .ls-marquee-wrapper {
      background: linear-gradient(90deg, #d31a1a 0%, #f97316 100%) !important;
      height: 28px !important;
      display: flex !important;
      align-items: center !important;
      overflow: hidden !important;
      width: 100% !important;
    }
    .ls-marquee-content {
      display: inline-block !important;
      white-space: nowrap !important;
      animation: ls_marquee 25s linear infinite !important;
      color: #ffffff !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      letter-spacing: 0.5px !important;
      padding-left: 100% !important;
    }
    @keyframes ls_marquee {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-100%, 0, 0); }
    }

    /* MIDDLE LAYER styling */
    .ls-middle-layer {
      height: 50px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 24px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      background: #131b2e !important;
    }
    .ls-countdown-box {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .ls-timer-label {
      font-size: 12px !important;
      color: #94a3b8 !important;
      font-weight: 500 !important;
    }
    .ls-timer-clock {
      font-family: 'Courier New', Courier, monospace !important;
      font-size: 18px !important;
      font-weight: 800 !important;
      color: #f97316 !important;
      text-shadow: 0 0 10px rgba(249, 115, 22, 0.3) !important;
    }
    .ls-welcome-box {
      font-size: 13px !important;
      color: #e2e8f0 !important;
    }
    .ls-highlight-name {
      color: #00d9f5 !important;
      text-shadow: 0 0 8px rgba(0, 217, 245, 0.2) !important;
    }

    /* Central Device Switcher buttons */
    .ls-banner-devices {
      display: flex !important;
      align-items: center !important;
      background: rgba(255, 255, 255, 0.04) !important;
      padding: 3px !important;
      border-radius: 9999px !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      gap: 2px !important;
    }
    .ls-device-btn {
      background: none !important;
      border: none !important;
      color: #64748b !important;
      padding: 4px 12px !important;
      border-radius: 9999px !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      outline: none !important;
    }
    .ls-device-btn:hover {
      color: #cbd5e1 !important;
      background: rgba(255, 255, 255, 0.03) !important;
    }
    .ls-device-btn.active {
      background: #00d9f5 !important;
      color: #0f172a !important;
      font-weight: 700 !important;
      box-shadow: 0 2px 8px rgba(0, 217, 245, 0.3) !important;
    }
    .ls-device-btn svg {
      width: 14px !important;
      height: 14px !important;
      fill: currentColor !important;
    }

    /* BOTTOM LAYER: Buttons container */
    .ls-bottom-layer {
      height: 62px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 24px !important;
      background: #0b0f19 !important;
    }
    .ls-buttons-container {
      display: flex !important;
      gap: 12px !important;
      width: 100% !important;
      max-width: 900px !important;
      justify-content: center !important;
    }
    .ls-btn-container-sub {
      display: contents !important;
    }

    /* BUTTONS styling */
    .ls-btn-action {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      padding: 10px 24px !important;
      border-radius: 9999px !important;
      font-size: 13px !important;
      font-weight: 800 !important;
      text-decoration: none !important;
      cursor: pointer !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      white-space: nowrap !important;
      letter-spacing: 0.5px !important;
    }
    .ls-btn-action:hover {
      transform: translateY(-2px) !important;
    }
    .ls-btn-action:active {
      transform: translateY(-0.5px) !important;
    }

    /* WhatsApp Button styling (Heartbeat Scale + Notification Badge) */
    .ls-btn-wa-pulse {
      background: #25d366 !important;
      color: #ffffff !important;
      animation: ls_wa_heartbeat 1.8s infinite ease-in-out !important;
      flex: 1.4 !important;
      max-width: 320px !important;
      position: relative !important;
      overflow: visible !important; /* must be visible so the badge can extend outside */
    }
    
    .ls-btn-wa-pulse i,
    .ls-btn-wa-pulse .ls-btn-txt {
      position: relative !important;
      z-index: 2 !important;
    }

    .ls-btn-wa-pulse:hover {
      animation: none !important; /* stop heartbeat on hover for normal scale transition */
      transform: scale(1.05) translateY(-2px) !important;
      background: #20ba5a !important;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4) !important;
    }
    
    /* Red Notification Badge */
    .ls-btn-badge-notif {
      position: absolute !important;
      top: -6px !important;
      right: -6px !important;
      background: #ef4444 !important; /* Urgent Red */
      color: #ffffff !important;
      font-size: 10px !important;
      font-weight: 900 !important;
      width: 18px !important;
      height: 18px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5) !important;
      border: 1.5px solid #0f172a !important; /* matches dark bottom layer background */
      z-index: 10 !important;
      animation: ls_badge_wiggle 2.5s infinite ease-in-out !important;
    }

    @keyframes ls_wa_heartbeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.05); }
      40% { transform: scale(1.02); }
      55% { transform: scale(1.06); }
    }

    @keyframes ls_badge_wiggle {
      0%, 80%, 100% { transform: scale(1) rotate(0deg); }
      83% { transform: scale(1.25) rotate(15deg); }
      86% { transform: scale(1.25) rotate(-15deg); }
      89% { transform: scale(1.25) rotate(15deg); }
      92% { transform: scale(1.25) rotate(-15deg); }
      95% { transform: scale(1.1) rotate(0deg); }
    }

    /* Email button */
    .ls-btn-email-glow {
      background: transparent !important;
      color: #ffffff !important;
      border: 2px solid #00d9f5 !important;
      box-shadow: 0 0 8px rgba(0, 217, 245, 0.1) !important;
      flex: 1 !important;
      max-width: 200px !important;
    }
    .ls-btn-email-glow:hover {
      background: rgba(0, 217, 245, 0.1) !important;
      box-shadow: 0 0 15px rgba(0, 217, 245, 0.3) !important;
    }

    /* Fiverr button */
    .ls-btn-fiv-glow {
      background: transparent !important;
      color: #ffffff !important;
      border: 2px solid #f59e0b !important;
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.1) !important;
      animation: ls_wa_heartbeat 1.8s infinite ease-in-out !important;
      animation-delay: 0.3s !important; /* staggered beat from WhatsApp button */
      flex: 1 !important;
      max-width: 200px !important;
      position: relative !important;
      overflow: visible !important;
    }
    .ls-btn-fiv-glow i,
    .ls-btn-fiv-glow .ls-btn-txt {
      position: relative !important;
      z-index: 2 !important;
    }
    .ls-btn-fiv-glow:hover {
      animation: none !important;
      transform: scale(1.05) translateY(-2px) !important;
      background: rgba(245, 158, 11, 0.1) !important;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.3) !important;
    }

    /* Viewport screens iframe bezels */
    #ls-viewport-screen {
      width: 100% !important;
      height: 100% !important;
      background: #ffffff !important;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      margin: 0 auto !important;
      position: relative !important;
      display: flex !important;
    }
    iframe {
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      background: #ffffff !important;
    }

    body.device-mobile #ls-viewport-container {
      padding: 40px 10px !important;
      align-items: flex-start !important;
    }
    body.device-mobile #ls-viewport-screen {
      box-sizing: content-box !important;
      width: 375px !important;
      height: 812px !important;
      min-height: 812px !important;
      max-height: 812px !important;
      border: 12px solid #1e293b !important;
      border-radius: 40px !important;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8) !important;
      overflow: hidden !important;
    }
    body.device-mobile #ls-viewport-screen::before {
      content: "" !important;
      position: absolute !important;
      top: -1px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 140px !important;
      height: 24px !important;
      background: #1e293b !important;
      border-bottom-left-radius: 16px !important;
      border-bottom-right-radius: 16px !important;
      z-index: 999999 !important;
      pointer-events: none !important;
    }

    body.device-tablet #ls-viewport-container {
      padding: 40px 10px !important;
      align-items: flex-start !important;
    }
    body.device-tablet #ls-viewport-screen {
      box-sizing: content-box !important;
      width: 768px !important;
      height: 1024px !important;
      min-height: 1024px !important;
      max-height: 1024px !important;
      border: 16px solid #1e293b !important;
      border-radius: 28px !important;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8) !important;
      overflow: hidden !important;
    }

    /* Fallback Glassmorphic Live Chat widget overlay */
    ${!hasTawk ? `
    .ls-chat-widget {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 320px !important;
      background: rgba(15, 23, 42, 0.9) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
      z-index: 2147483647 !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
      transform: translateY(150%) scale(0.9) !important;
      opacity: 0 !important;
    }
    .ls-chat-widget.active {
      transform: translateY(0) scale(1) !important;
      opacity: 1 !important;
    }
    .ls-chat-header {
      background: linear-gradient(135deg, #00d9f5 0%, #0072ff 100%) !important;
      padding: 12px 16px !important;
      color: #0f172a !important;
      font-weight: 700 !important;
      font-size: 13px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
    }
    .ls-chat-close {
      background: none !important;
      border: none !important;
      color: #0f172a !important;
      cursor: pointer !important;
      font-size: 18px !important;
      line-height: 1 !important;
      padding: 0 !important;
      opacity: 0.7 !important;
    }
    .ls-chat-body {
      padding: 14px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
    }
    .ls-chat-msg {
      background: rgba(255, 255, 255, 0.05) !important;
      color: #e2e8f0 !important;
      padding: 10px 12px !important;
      border-radius: 12px !important;
      font-size: 12px !important;
      line-height: 1.45 !important;
    }
    .ls-chat-input-container {
      display: flex !important;
      gap: 6px !important;
    }
    .ls-chat-input {
      flex: 1 !important;
      background: rgba(255, 255, 255, 0.06) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 8px !important;
      color: #ffffff !important;
      padding: 8px 10px !important;
      font-size: 12px !important;
      outline: none !important;
    }
    .ls-chat-input:focus { border-color: #00d9f5 !important; }
    .ls-chat-send {
      background: #00d9f5 !important;
      border: none !important;
      border-radius: 8px !important;
      color: #0f172a !important;
      cursor: pointer !important;
      padding: 8px 12px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
    }
    .ls-chat-success-msg {
      color: #10b981 !important;
      font-size: 11px !important;
      text-align: center !important;
      margin-top: 2px !important;
      display: none !important;
    }
    ` : ''}

    /* Small Screen adaptations (Tablet viewports) */
    @media (max-width: 800px) {
      .ls-proposal-banner {
        height: 175px !important;
      }
      #ls-viewport-container {
        margin-top: 175px !important;
        height: calc(100vh - 175px) !important;
      }
      .ls-middle-layer {
        height: 85px !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 6px !important;
        padding: 8px 16px !important;
      }
      .ls-banner-devices {
        display: none !important;
      }
      .ls-welcome-box {
        text-align: center !important;
      }
      .ls-bottom-layer {
        height: 62px !important;
        padding: 0 12px !important;
      }
      .ls-buttons-container {
        gap: 8px !important;
      }
      .ls-btn-action {
        padding: 8px 12px !important;
        font-size: 11px !important;
      }
    }

    /* Small Screen adaptations (Mobile phone viewports) */
    @media (max-width: 480px) {
      .ls-proposal-banner {
        height: 195px !important;
      }
      #ls-viewport-container {
        margin-top: 195px !important;
        height: calc(100vh - 195px) !important;
        padding: 0 !important;
        align-items: stretch !important;
      }
      #ls-viewport-screen {
        width: 100% !important;
        height: 100% !important;
        min-height: 100% !important;
        max-height: 100% !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      #ls-viewport-screen::before {
        display: none !important;
      }
      .ls-marquee-wrapper {
        height: 24px !important;
      }
      .ls-middle-layer {
        height: 82px !important;
        padding: 4px 8px !important;
        gap: 2px !important;
      }
      .ls-timer-clock {
        font-size: 15px !important;
      }
      .ls-timer-label {
        font-size: 11px !important;
      }
      .ls-welcome-box {
        font-size: 12px !important;
      }
      .ls-bottom-layer {
        height: 89px !important;
        padding: 8px !important;
      }
      .ls-buttons-container {
        flex-direction: column !important;
        gap: 6px !important;
        max-width: 100% !important;
      }
      .ls-btn-action {
        width: 100% !important;
        max-width: 100% !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        font-size: 11px !important;
      }
      .ls-btn-wa-pulse {
        flex: none !important;
        order: 1 !important;
        animation: none !important;
      }
      .ls-btn-container-sub {
        display: flex !important;
        gap: 6px !important;
        width: 100% !important;
        order: 2 !important;
      }
      .ls-btn-email-glow, .ls-btn-fiv-glow {
        flex: 1 !important;
        max-width: 50% !important;
      }
    }
  </style>
</head>
<body class="device-desktop">

  <!-- Fixed Proposal Banner overlay -->
  <div class="ls-proposal-banner">
    <!-- TOP LAYER: Scrolling marquee -->
    <div class="ls-marquee-wrapper">
      <div class="ls-marquee-content">
        <span>📉 80% of customers search online first · Don't lose them to competitors who have a website · 📉 80% of customers search online first · Don't lose them to competitors who have a website</span>
      </div>
    </div>
    
    <!-- MIDDLE LAYER: countdown and personalized message -->
    <div class="ls-middle-layer">
      <div class="ls-countdown-box">
        <span class="ls-timer-label">⏳ Offer expires in:</span>
        <span class="ls-timer-clock" id="ls-countdown-clock">23:59:59</span>
      </div>
      
      <!-- Central Device Switcher buttons -->
      <div class="ls-banner-devices">
        <button class="ls-device-btn active" id="btn-view-desktop" title="Desktop View">
          <svg viewBox="0 0 576 512"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V288H64V64H512z"/></svg>
        </button>
        <button class="ls-device-btn" id="btn-view-tablet" title="Tablet View">
          <svg viewBox="0 0 448 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM256 464c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zM384 64V384H64V64H384z"/></svg>
        </button>
        <button class="ls-device-btn" id="btn-view-mobile" title="Mobile View">
          <svg viewBox="0 0 384 512"><path d="M80 0C44.7 0 16 28.7 16 64V448c0 35.3 28.7 64 64 64H304c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H80zM192 464c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zM320 64V384H64V64H320z"/></svg>
        </button>
      </div>

      <div class="ls-welcome-box">
        <span>👋 Built exclusively for <strong class="ls-highlight-name">${businessName}</strong></span>
      </div>
    </div>

    <!-- BOTTOM LAYER: Contact / Order Buttons -->
    <div class="ls-bottom-layer">
      <div class="ls-buttons-container">
        <!-- WhatsApp -->
        <a href="${waLink}" target="_blank" class="ls-btn-action ls-btn-wa-pulse" id="ls-whatsapp-lnk">
          <i class="fa-brands fa-whatsapp"></i> <span class="ls-btn-txt">MESSAGE ON WHATSAPP</span>
          <div class="ls-btn-badge-notif">1</div>
        </a>
        <div class="ls-btn-container-sub">
          <!-- Email -->
          <a href="${emailLink}" target="_blank" class="ls-btn-action ls-btn-email-glow" id="ls-email-lnk">
            <i class="fa-solid fa-envelope"></i> EMAIL US
          </a>
          <!-- Fiverr -->
          <a href="${fiverrUrl}" target="_blank" class="ls-btn-action ls-btn-fiv-glow" id="ls-fiverr-lnk">
            <i class="fa-solid fa-cart-shopping"></i> <span class="ls-btn-txt">ORDER ON FIVERR</span>
            <div class="ls-btn-badge-notif" style="animation-delay: 0.5s !important;">1</div>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- Inner Iframe Viewer screen -->
  <div id="ls-viewport-container">
    <div id="ls-viewport-screen">
      <iframe src="${iframeSrc}"></iframe>
    </div>
  </div>

  <!-- Fallback Chat widget overlay -->
  ${!hasTawk ? `
  <div class="ls-chat-widget" id="ls-chat-box">
    <div class="ls-chat-header">
      <span>💬 Design Consultation</span>
      <button class="ls-chat-close" id="ls-chat-close-btn">&times;</button>
    </div>
    <div class="ls-chat-body">
      <div class="ls-chat-msg">
        Hi there! 👋 Let me know if you would like any custom changes, adjustments, or to request the source files for this design.
      </div>
      <div class="ls-chat-input-container">
        <input type="text" class="ls-chat-input" id="ls-chat-msg-input" placeholder="Type a message..." maxlength="300">
        <button class="ls-chat-send" id="ls-chat-send-btn">Send</button>
      </div>
      <div class="ls-chat-success-msg" id="ls-chat-success">✓ Sent to our design team!</div>
    </div>
  </div>
  ` : ''}

  <!-- Viewport Switch Controller Script -->
  <script>
    (function() {
      const body = document.body;
      const btnDesktop = document.getElementById('btn-view-desktop');
      const btnTablet = document.getElementById('btn-view-tablet');
      const btnMobile = document.getElementById('btn-view-mobile');

      function setDeviceView(viewName, activeBtn) {
        body.className = '';
        body.classList.add('device-' + viewName);
        
        document.querySelectorAll('.ls-device-btn').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
      }

      if (btnDesktop) btnDesktop.addEventListener('click', () => setDeviceView('desktop', btnDesktop));
      if (btnTablet) btnTablet.addEventListener('click', () => setDeviceView('tablet', btnTablet));
      if (btnMobile) btnMobile.addEventListener('click', () => setDeviceView('mobile', btnMobile));

      // Real-time countdown timer script
      function startCountdown() {
        const clock = document.getElementById('ls-countdown-clock');
        if (!clock) return;
        
        let hours = 23;
        let minutes = 59;
        let seconds = 59;
        
        function updateClock() {
          seconds--;
          if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
              minutes = 59;
              hours--;
              if (hours < 0) {
                // Loop countdown back to 24h
                hours = 23;
                minutes = 59;
                seconds = 59;
              }
            }
          }
          
          const hStr = String(hours).padStart(2, '0');
          const mStr = String(minutes).padStart(2, '0');
          const sStr = String(seconds).padStart(2, '0');
          clock.textContent = hStr + " : " + mStr + " : " + sStr;
        }
        
        setInterval(updateClock, 1000);
      }
      startCountdown();

      // Dispatch tracking events for proposal open and click events
      const leadId = ${JSON.stringify(leadId)};
      const leadName = ${JSON.stringify(businessName + ' (' + niche + ')')};
      const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
      
      async function sendEvent(event, details = {}) {
        try {
          await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId, leadName, event, details: { device, ...details } })
          });
        } catch (err) {}
      }
      
      // Page open tracking
      sendEvent('open');
      
      // Clicks tracking
      document.getElementById('ls-fiverr-lnk').addEventListener('click', () => sendEvent('fiverr_click'));
      document.getElementById('ls-whatsapp-lnk').addEventListener('click', () => sendEvent('whatsapp_click'));
      document.getElementById('ls-email-lnk').addEventListener('click', () => sendEvent('email_click'));

      ${!hasTawk ? `
      // Chat Trigger
      setTimeout(() => {
        const chatBox = document.getElementById('ls-chat-box');
        if (chatBox) chatBox.classList.add('active');
      }, 15000);

      // Chat Close
      const closeBtn = document.getElementById('ls-chat-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const chatBox = document.getElementById('ls-chat-box');
          if (chatBox) chatBox.classList.remove('active');
        });
      }

      // Chat Send
      const sendBtn = document.getElementById('ls-chat-send-btn');
      const msgInput = document.getElementById('ls-chat-msg-input');
      const successMsg = document.getElementById('ls-chat-success');

      if (sendBtn && msgInput) {
        sendBtn.addEventListener('click', async () => {
          const text = msgInput.value.trim();
          if (!text) return;

          sendBtn.disabled = true;
          msgInput.disabled = true;
          sendBtn.textContent = '...';

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ leadId, leadName, message: text })
            });
            const data = await res.json();
            if (data.success) {
              successMsg.style.display = 'block';
              sendBtn.style.display = 'none';
              msgInput.style.display = 'none';
            } else {
              throw new Error('Failed');
            }
          } catch (e) {
            alert('Failed to send message. Please try again.');
            sendBtn.disabled = false;
            msgInput.disabled = false;
            sendBtn.textContent = 'Send';
          }
        });

        msgInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            sendBtn.click();
          }
        });
      }
      ` : `
      // Inject Tawk.to Script on outer wrapper
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='${tawkEmbedUrl.trim()}';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
      })();
      `}
    })();
  </script>
</body>
</html>
      `;
      
      return res.send(wrapperHtml);
    }
    
    // ─── INNER EMBEDDED SITE PREVIEW PAGE (RAW SITE WITH ANALYTICS SCROLL HEARTBEAT) ────
    const personalizationScript = `
      <script>
        (function() {
          const realName = ${JSON.stringify(businessName)};
          const realPhone = ${JSON.stringify(phone)};
          const realAddress = ${JSON.stringify(address)};
          
          // 1. Replace logo and text occurrences of Business Name
          const logoEl = document.querySelector('header .navbar-start a.font-bold, header a.font-bold');
          if (logoEl) {
            const mockName = logoEl.innerText.trim();
            if (mockName && realName && mockName !== realName) {
              function replaceText(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                  if (node.nodeValue.includes(mockName)) {
                    node.nodeValue = node.nodeValue.replaceAll(mockName, realName);
                  }
                } else if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                  for (let child of node.childNodes) {
                    replaceText(child);
                  }
                }
              }
              replaceText(document.body);
              document.title = document.title.replaceAll(mockName, realName);
            }
          }
          
          // 2. Replace phone links
          const telLink = document.querySelector('a[href^="tel:"]');
          if (telLink) {
            const mockPhone = telLink.getAttribute('href').replace('tel:', '').trim();
            document.querySelectorAll('a[href^="tel:"]').forEach(el => {
              el.href = 'tel:' + realPhone;
              if (/\\d/.test(el.innerText)) {
                el.innerText = realPhone;
              }
            });
            if (mockPhone && realPhone && mockPhone !== realPhone) {
              function replacePhone(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                  if (node.nodeValue.includes(mockPhone)) {
                    node.nodeValue = node.nodeValue.replaceAll(mockPhone, realPhone);
                  }
                } else if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                  for (let child of node.childNodes) {
                    replacePhone(child);
                  }
                }
              }
              replacePhone(document.body);
            }
          }
          
          // 3. Replace address text & Google Maps embeds
          if (realAddress && realAddress !== 'N/A' && realAddress !== 'Our Location') {
            const addressSpan = document.querySelector('span.text-primary.not-italic');
            if (addressSpan) {
              addressSpan.innerText = realAddress;
            }
            const mapIframe = document.querySelector('iframe[src*="google.com/maps"]');
            if (mapIframe) {
              mapIframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(realAddress) + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
            }
          }
          
          // 4. Replace mock mailto links
          const mailLink = document.querySelector('a[href^="mailto:"]');
          if (mailLink) {
            const mockEmail = mailLink.getAttribute('href').replace('mailto:', '').trim();
            const realEmail = 'contact@' + realName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
            document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
              el.href = 'mailto:' + realEmail;
              if (el.innerText.includes('@')) {
                el.innerText = realEmail;
              }
            });
          }
        })();
      </script>
    `;

    const trackingScript = `
      <script>
        (function() {
          const leadId = ${JSON.stringify(leadId)};
          const leadName = ${JSON.stringify(businessName + ' (' + niche + ')')};
          const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
          
          async function sendEvent(event, details = {}) {
            try {
              await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, leadName, event, details: { device, ...details } })
              });
            } catch (err) {}
          }
          
          // Scroll and active duration tracking runs inside the scrollable embedded page
          let totalSeconds = 0;
          let maxScroll = 0;
          
          setInterval(() => {
            totalSeconds += 10;
            
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
            
            if (scrollPercent > maxScroll) {
              maxScroll = scrollPercent;
            }
            
            sendEvent('heartbeat', { seconds: 10, scrollPercent: maxScroll });
          }, 10000);
        })();
      </script>
    `;
    
    const hideScrollbarStyle = `
      <style>
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      </style>
    `;
    
    html = html.replace('</head>', `${hideScrollbarStyle}</head>`);
    html = html.replace('</body>', `${personalizationScript}${trackingScript}</body>`);
    return res.send(html);
  } catch (err) {
    console.error('[Preview Load Error]', err);
    res.status(500).send('<h1>Error Loading Preview Template</h1><p>' + err.message + '</p>');
  }
});



// Send real-time phone notifications via Telegram Bot or Discord Webhook
async function sendPhoneNotification(message) {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const userId = process.env.DISCORD_USER_ID;

  // Discord Notification (Discord uses Markdown, so we convert basic HTML tags to Markdown)
  if (discordWebhookUrl && discordWebhookUrl !== 'your_discord_webhook_url_here' && discordWebhookUrl.trim() !== '') {
    try {
      const mention = (userId && userId.trim() !== "") ? `<@${userId.trim()}>` : "@everyone";
      let discordMsg = mention + ' ' + message
        .replace(/<b>/g, '**').replace(/<\/b>/g, '**')
        .replace(/<i>/g, '*').replace(/<\/i>/g, '*');
      await postDiscordWebhook(discordWebhookUrl, {
        content: discordMsg,
        allowed_mentions: {
          parse: ["everyone", "users"]
        }
      }, { timeout: 4000 });
    } catch (err) {
      console.error('[Notification Error] Discord delivery failed:', err.message);
    }
  }
}

const geoCache = {};

function parseUserAgent(uaString) {
  const ua = uaString || '';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  // Detect OS
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Detect Browser
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  return { os, browser };
}

async function getIpLocation(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::ffff:127.0.0.1') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return { location: 'Local Network', countryCode: 'IN', isp: 'Localhost' };
  }
  if (geoCache[ip]) return geoCache[ip];
  try {
    const res = await axios.get(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,regionName,city,isp`, { timeout: 3500 });
    if (res.data && res.data.status === 'success') {
      const info = {
        location: `${res.data.city}, ${res.data.regionName}, ${res.data.country}`,
        countryCode: res.data.countryCode,
        isp: res.data.isp
      };
      geoCache[ip] = info;
      return info;
    }
  } catch (e) {
    console.error('[Geo-IP Error]:', e.message);
  }
  return { location: 'Unknown Location', countryCode: '', isp: 'Unknown ISP' };
}

// Global view counter in-memory
if (!global.viewCounts) global.viewCounts = {};

// Analytics tracking logs receiver
app.post('/api/track', async (req, res) => {
  const { leadId, leadName: payloadLeadName, event, details } = req.body;
  if (!leadId) {
    return res.status(400).json({ error: 'Lead ID is required.' });
  }
  
  try {
    const db = await readDb();
    const leadIndex = db.leads.findIndex(l => l.id === leadId);
    let leadName = payloadLeadName || 'Unknown Lead';
    
    if (leadIndex !== -1) {
      leadName = db.leads[leadIndex].name;
    } else {
      const memLead = latestScannedLeads.find(l => l.id === leadId);
      if (memLead) leadName = memLead.name;
    }
    
    const timestamp = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString();
    
    // Resolve IP & Geolocation
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = rawIp ? rawIp.split(',')[0].trim() : '';
    const geo = await getIpLocation(clientIp);
    const uaInfo = parseUserAgent(req.headers['user-agent']);

    // Group activeVisits by session/leadId
    if (event === 'open') {
      global.viewCounts[leadId] = (global.viewCounts[leadId] || 0) + 1;
    }
    const totalViews = global.viewCounts[leadId] || 1;
    const isHot = totalViews >= 3;

    let session = activeVisits.find(v => v.leadId === leadId);
    if (!session) {
      session = {
        leadId,
        name: leadName,
        openedAt: timestamp,
        lastActiveAt: timestamp,
        duration: 0,
        scrollPercent: 0,
        location: geo.location,
        countryCode: geo.countryCode || '',
        isp: geo.isp,
        views: totalViews,
        device: (details && details.device) || 'desktop',
        os: uaInfo.os,
        browser: uaInfo.browser,
        events: [],
        isHot: isHot
      };
      activeVisits.unshift(session);
      if (activeVisits.length > 50) activeVisits.pop();
    } else {
      session.lastActiveAt = timestamp;
      session.views = Math.max(session.views, totalViews);
      if (isHot) session.isHot = true;
      if (details && details.device) session.device = details.device;
      session.os = uaInfo.os;
      session.browser = uaInfo.browser;
      if (session.location === 'Loading...' || session.location === 'Unknown Location') {
        session.location = geo.location;
        session.countryCode = geo.countryCode || '';
        session.isp = geo.isp;
      }
    }

    session.events.push({ event, timestamp, details });
    if (session.events.length > 20) session.events.shift();

    // Accumulate metrics on heartbeat
    if (event === 'heartbeat') {
      session.duration += details.seconds || 0;
      if (details.scrollPercent > session.scrollPercent) {
        session.scrollPercent = details.scrollPercent;
      }
    }
    
    console.log(`[Track Log] "${leadName}" triggered: ${event} ${JSON.stringify(details || {})} (Loc: ${geo.location})`);
    
    let shouldNotify = false;
    let notificationMsg = '';
    
    if (leadIndex !== -1) {
      const analytics = db.leads[leadIndex].analytics || {
        opened: 'No',
        timeSpent: 0,
        maxScroll: 0,
        fiverrClicked: 'No',
        whatsappClicked: 'No',
        emailClicked: 'No'
      };
      
      analytics.opened = 'Yes';
      
      if (event === 'heartbeat') {
        analytics.timeSpent += details.seconds || 0;
        if (details.scrollPercent > analytics.maxScroll) {
          analytics.maxScroll = details.scrollPercent;
        }
        // Notify on 60 seconds (1 minute) of active reading engagement
        if (analytics.timeSpent === 60) {
          notificationMsg = `⏱️ <b>Lead Engagement!</b>\n"${leadName}" has been actively reading for 1 minute.\n📍 Location: ${geo.location}\n📊 Scroll depth: ${analytics.maxScroll}%`;
          shouldNotify = true;
        }
      } else if (event === 'fiverr_click') {
        analytics.fiverrClicked = 'Yes';
      } else if (event === 'whatsapp_click') {
        analytics.whatsappClicked = 'Yes';
      } else if (event === 'email_click') {
        analytics.emailClicked = 'Yes';
      }
      
      let newLog = `[${timeStr}] `;
      if (event === 'open') {
        newLog += 'Opened Proposal Preview Link';
        if (isHot) {
          notificationMsg = `🚨 <b>HOT LEAD RE-OPENED! (Viewed ${totalViews} times)</b>\n"${leadName}" is actively looking at your proposal again!\n📍 Location: ${geo.location} (${geo.isp})`;
        } else {
          notificationMsg = `🔔 <b>Lead Opened Proposal!</b>\n"${leadName}" just opened your website proposal on ${details.device || 'desktop'}.\n📍 Location: ${geo.location} (${geo.isp})`;
        }
        shouldNotify = true;
      } else if (event === 'heartbeat') {
        newLog += `Visited for ${analytics.timeSpent}s (Scrolled: ${analytics.maxScroll}%)`;
      } else if (event === 'fiverr_click') {
        newLog += 'Clicked Fiverr Checkout CTA';
        notificationMsg = `💼 <b>Lead Action!</b>\n"${leadName}" clicked your <b>Fiverr Checkout</b> CTA button!\n📍 Location: ${geo.location}`;
        shouldNotify = true;
      } else if (event === 'whatsapp_click') {
        newLog += 'Clicked WhatsApp Contact CTA';
        notificationMsg = `💬 <b>Lead Action!</b>\n"${leadName}" clicked your <b>WhatsApp Contact</b> CTA button!\n📍 Location: ${geo.location}`;
        shouldNotify = true;
      } else if (event === 'email_click') {
        newLog += 'Clicked Direct Email CTA';
        notificationMsg = `📧 <b>Lead Action!</b>\n"${leadName}" clicked your <b>Direct Email</b> CTA button!\n📍 Location: ${geo.location}`;
        shouldNotify = true;
      } else {
        newLog += `Triggered event: ${event}`;
      }
      
      db.leads[leadIndex] = {
        ...db.leads[leadIndex],
        analytics,
        notes: (db.leads[leadIndex].notes ? db.leads[leadIndex].notes + '\n' : '') + newLog,
        updatedAt: timestamp
      };
      
      // Heartbeats are written locally only to prevent spamming GitHub push builds
      const syncToGithub = (event !== 'heartbeat');
      await writeDb(db, syncToGithub);
    } else {
      // Unsaved lead: update activeVisits locally on disk (no GitHub push)
      await writeDb(db, false);
      // For leads that are still in cache and not saved to CRM database yet
      if (event === 'open') {
        if (isHot) {
          notificationMsg = `🚨 <b>HOT LEAD RE-OPENED! (Viewed ${totalViews} times)</b>\n"${leadName}" is actively looking at your proposal again!\n📍 Location: ${geo.location} (${geo.isp})`;
        } else {
          notificationMsg = `🔔 <b>Lead Opened Proposal!</b>\n"${leadName}" just opened your website proposal link on ${details.device || 'desktop'}.\n📍 Location: ${geo.location} (${geo.isp})`;
        }
        shouldNotify = true;
      } else if (event === 'fiverr_click') {
        notificationMsg = `💼 <b>Lead Action!</b>\n"${leadName}" clicked your <b>Fiverr Checkout</b> CTA button!\n📍 Location: ${geo.location}`;
        shouldNotify = true;
      } else if (event === 'whatsapp_click') {
        notificationMsg = `💬 <b>Lead Action!</b>\n"${leadName}" clicked your <b>WhatsApp Contact</b> CTA button!\n📍 Location: ${geo.location}`;
        shouldNotify = true;
      } else if (event === 'email_click') {
        notificationMsg = `📧 <b>Lead Action!</b>\n"${leadName}" clicked your <b>Direct Email</b> CTA button!\n📍 Location: ${geo.location}`;
        shouldNotify = true;
      }
    }
    
    // Dispatch phone notification asynchronously (fire and forget)
    if (shouldNotify && notificationMsg) {
      sendPhoneNotification(notificationMsg).catch(err => {
        console.error('[Notification Dispatch Fail]:', err.message);
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('[Tracking Server Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// New Live Chat endpoint for templates
app.post('/api/chat', async (req, res) => {
  const { leadId, leadName, message } = req.body;
  if (!leadId || !message) {
    return res.status(400).json({ error: 'Lead ID and message are required.' });
  }

  console.log(`[Live Chat] "${leadName || 'Unknown Lead'}" says: ${message}`);

  // Append to activeVisits logs
  let session = activeVisits.find(v => v.leadId === leadId);
  if (session) {
    session.lastActiveAt = new Date().toISOString();
    session.events.push({
      event: 'chat',
      timestamp: new Date().toISOString(),
      details: { message }
    });
  }

  // Send message directly to Discord webhook
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const userId = process.env.DISCORD_USER_ID;
  if (discordWebhookUrl && discordWebhookUrl !== 'your_discord_webhook_url_here' && discordWebhookUrl.trim() !== '') {
    try {
      const mention = (userId && userId.trim() !== "") ? `<@${userId.trim()}>` : "";
      const discordMsg = `${mention} 💬 **Live Chat from Lead:** "${leadName || 'Unknown Lead'}"\n> ${message}`;
      await postDiscordWebhook(discordWebhookUrl, { content: discordMsg }, { timeout: 4000 });
    } catch (err) {
      console.error('[Notification Error] Live Chat Discord delivery failed:', err.message);
    }
  }

  res.json({ success: true });
});

// Endpoint for dashboard activity feed long-polling
app.get('/api/active-visits', (req, res) => {
  res.json({ success: true, visits: activeVisits });
});

// ─── API Credits Check Endpoint ───────────────────────────────────────────────
// GET /api/credits-check
// Returns live credit/quota status for each configured API service
app.get('/api/credits-check', async (req, res) => {
  const results = {};

  // ── Serper.dev ────────────────────────────────────────────────────────────
  const serperKey = process.env.SERPER_API_KEY || process.env.SERPERDEV_API_KEY || '';
  if (serperKey && serperKey !== 'your_serper_api_key_here') {
    try {
      const r = await axios.get('https://google.serper.dev/account', {
        headers: { 'X-API-KEY': serperKey },
        timeout: 8000
      });
      const data = r.data || {};
      const remaining = data.credits ?? data.creditsRemaining ?? null;
      const total     = data.totalCredits ?? data.planCredits ?? 2500;
      const used      = total - (remaining ?? total);
      results.serper = {
        configured: true,
        remaining,
        used,
        total,
        pct: remaining != null ? Math.round(((total - remaining) / total) * 100) : null,
        label: remaining != null ? `${remaining.toLocaleString()} credits left` : 'Connected ✓',
        status: 'ok'
      };
    } catch (err) {
      results.serper = { configured: true, status: 'error', label: 'Key error: ' + err.message.slice(0, 60) };
    }
  } else {
    results.serper = { configured: false, status: 'missing', label: 'Not configured' };
  }

  // ── Google Places ─────────────────────────────────────────────────────────
  const placesKey = process.env.GOOGLE_PLACES_API_KEY || '';
  if (placesKey && placesKey !== 'your_google_places_api_key_here') {
    // Google Places doesn't have a simple credits endpoint — just confirm key is set
    results.places = {
      configured: true,
      status: 'ok',
      label: 'API key configured',
      note: '$200 free credit (~10,000 searches/mo)'
    };
  } else {
    results.places = { configured: false, status: 'missing', label: 'Not configured' };
  }

  // ── Yelp Fusion ───────────────────────────────────────────────────────────
  const yelpKey = process.env.YELP_API_KEY || '';
  if (yelpKey && yelpKey !== 'your_yelp_api_key_here') {
    results.yelp = {
      configured: true,
      status: 'ok',
      label: 'API key configured',
      note: '5,000 free requests/day'
    };
  } else {
    results.yelp = { configured: false, status: 'missing', label: 'Not configured' };
  }

  // ── DuckDuckGo (always free) ──────────────────────────────────────────────
  results.ddg = {
    configured: true,
    status: 'ok',
    label: '∞ Unlimited — No key needed',
    remaining: Infinity
  };

  // ── Meta Ad Library (Puppeteer — cloud blocked) ────────────────────────────
  results.meta = {
    configured: true,
    status: 'cloud_blocked',
    label: 'Local: works | Cloud: mock fallback'
  };

  res.json({ success: true, credits: results, checkedAt: new Date().toISOString() });
});

// Endpoint to list template folders dynamically from GitHub API
app.get('/api/templates', async (req, res) => {
  // Try local first
  try {
    const fs = require('fs').promises;
    const localPath = path.join(__dirname, 'my_raw_templates');
    const files = await fs.readdir(localPath, { withFileTypes: true });
    const localTemplates = files
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && !dirent.name.endsWith('-src'))
      .map(dirent => dirent.name);
    if (localTemplates.length > 0) {
      return res.json({ success: true, templates: localTemplates });
    }
  } catch (localErr) {
    // Fall back to GitHub listing
  }

  const owner = process.env.GITHUB_USERNAME || 'pms5566';
  const repo = process.env.GITHUB_REPO || 'my-leadscope-templates';
  const pathPrefix = repo === 'leadscope' ? '/my_raw_templates' : '';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents${pathPrefix}`;
  
  const headers = {
    'User-Agent': 'LeadScope-SaaS-App'
  };
  
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here') {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  try {
    const response = await axios.get(url, { headers });
    const directories = response.data
      .filter(item => item.type === 'dir' && !item.name.startsWith('.') && !item.name.endsWith('-src'))
      .map(item => item.name);
      
    res.json({ success: true, templates: directories });
  } catch (err) {
    console.warn('[GitHub Listing Fail]:', err.message);
    // Fallback: try reading from local my_raw_templates if GitHub fails
    try {
      const fs2 = require('fs').promises;
      const localPath2 = path.join(__dirname, 'my_raw_templates');
      const files2 = await fs2.readdir(localPath2, { withFileTypes: true });
      const localFallback = files2
        .filter(d => d.isDirectory() && !d.name.startsWith('.') && !d.name.endsWith('-src'))
        .map(d => d.name);
      if (localFallback.length > 0) {
        return res.json({ success: true, templates: localFallback });
      }
    } catch (localErr2) { /* ignore */ }
    // Last resort hardcoded list — only real templates we know exist
    res.json({ success: true, templates: ['dermatologist', 'dentist', 'gym', 'doctor', 'garage', 'jewelry', 'nail-art', 'luxurious-salon-website', 'roofing contractors', 'SPA'] });
  }
});


const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`====================================================`);
  console.log(`        LOCAL BUSINESS LEAD SCANNER SERVER`);
  console.log(`====================================================`);
  console.log(`Server is running at: http://0.0.0.0:${PORT}`);
  console.log(`Live mode configured: ${isLiveModeConfigured() ? 'Yes' : 'No (falling back to Mock Mode)'}`);
  console.log(`====================================================`);

  // Load persistent active visits into memory cache on startup
  try {
    const db = await readDb();
    if (Array.isArray(db.activeVisits)) {
      activeVisits = db.activeVisits;
      console.log(`[Startup] Loaded ${activeVisits.length} active visits from database.`);
    }
  } catch (e) {
    console.error('[Startup] Failed to load active visits:', e.message);
  }

  // 🔒 Fix any existing shortlinks that point to localhost on startup
  const publicDomain = process.env.PUBLIC_SHARING_DOMAIN ? process.env.PUBLIC_SHARING_DOMAIN.trim().replace(/\/$/, '') : null;
  if (publicDomain) {
    try {
      const db = await readDb();
      const shortLinks = db.shortLinks || {};
      let fixed = 0;
      for (const [alias, url] of Object.entries(shortLinks)) {
        try {
          const parsed = new URL(url);
          if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
            parsed.hostname = new URL(publicDomain).hostname;
            parsed.protocol = new URL(publicDomain).protocol;
            parsed.port = '';
            db.shortLinks[alias] = parsed.toString();
            fixed++;
          }
        } catch (e) { /* skip non-URLs */ }
      }
      if (fixed > 0) {
        await writeDb(db);
        console.log(`[Startup] Fixed ${fixed} shortlink(s) that pointed to localhost → now pointing to ${publicDomain}`);
      } else {
        console.log(`[Startup] All shortlinks OK — no localhost URLs found.`);
      }
    } catch (e) {
      console.warn('[Startup] Could not run shortlink cleanup:', e.message);
    }
  }
});

// Set server timeout to 3 minutes (180,000 ms)
server.timeout = 180000;
