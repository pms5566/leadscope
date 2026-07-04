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
  'detailing': 'auto_detailing_ceramic_coating_shops',
  'car_detailing': 'auto_detailing_ceramic_coating_shops',
  'auto_detailing': 'auto_detailing_ceramic_coating_shops',
  'ceramic_coating': 'auto_detailing_ceramic_coating_shops',
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
  'spa': 'luxurious-salon-website',
  'beauty_spa': 'luxurious-salon-website',
  'massage_center': 'luxurious-salon-website',
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

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultDb = { leads: [] };
      try {
        await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf8');
      } catch (writeErr) {
        console.error('Failed to initialize empty leads_db.json:', writeErr);
      }
      return defaultDb;
    }
    console.error('Failed to read leads_db.json:', error);
    return { leads: [] };
  }
}

async function writeDb(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Failed to write to leads_db.json:', error);
    return false;
  }
}

// CRM Endpoints
app.get('/api/crm', async (req, res) => {
  try {
    const db = await readDb();
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

// Dynamic Asset Proxy from GitHub Templates Repository
app.get('/preview/:niche/*', async (req, res, next) => {
  const { niche } = req.params;
  const filePath = req.params[0]; // Wildcard matches relative assets
  
  if (!filePath || !filePath.includes('.')) {
    return next(); // Fall through to index.html lead preview route
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
        if (resolvedGithubFolder) {
          console.log(`[Template Loader] GitHub folder match: "${niche}" → "${resolvedGithubFolder}"`);
        }
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
    
    // 4. Inject Sticky Top Banner & Analytics heart-beat script
    const whatsappPhone = process.env.AGENCY_WHATSAPP_PHONE || '917696507509';
    const fiverrUrl = process.env.AGENCY_FIVERR_URL || 'https://www.fiverr.com/s/gDeZRvL';
    const emailAddress = process.env.AGENCY_EMAIL || 'nobizweb@gmail.com';
    const waText = encodeURIComponent(`Hi! I am looking at the custom website proposal for my business, "${businessName}". I would like to request some custom modifications!`);
    const waLink = `https://wa.me/${whatsappPhone}?text=${waText}`;
    const emailSubject = encodeURIComponent(`Feedback on Custom Website Proposal for ${businessName}`);
    const emailBody = encodeURIComponent(`Hi!\n\nI was looking at the custom website proposal draft you created for my business, "${businessName}". I would like to request some modifications!`);
    const emailLink = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;
    
    const bannerStyle = `
      <style>
        .ls-proposal-banner {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          min-height: 50px !important;
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 8px 24px !important;
          z-index: 2147483647 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
          color: #f8fafc !important;
          font-size: 14px !important;
          box-sizing: border-box !important;
        }
        .ls-proposal-banner * {
          box-sizing: border-box !important;
        }
        .ls-banner-title {
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          max-width: 50% !important;
        }
        .ls-banner-title strong {
          color: #fff !important;
          font-weight: 700 !important;
        }
        .ls-banner-ctas {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          flex-shrink: 0 !important;
        }
        .ls-banner-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 8px 16px !important;
          border-radius: 9999px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
        }
        .ls-banner-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }
        .ls-banner-btn:active {
          transform: translateY(0) !important;
        }
        .ls-btn-fiv {
          background: #1dbf73 !important;
          color: #fff !important;
        }
        .ls-btn-fiv:hover {
          background: #10a862 !important;
          box-shadow: 0 0 12px rgba(29, 191, 115, 0.4) !important;
        }
        .ls-btn-wa {
          background: #25d366 !important;
          color: #fff !important;
        }
        .ls-btn-wa:hover {
          background: #1ebe57 !important;
          box-shadow: 0 0 12px rgba(37, 211, 102, 0.4) !important;
        }
        .ls-btn-email {
          background: #3b82f6 !important;
          color: #fff !important;
        }
        .ls-btn-email:hover {
          background: #1d4ed8 !important;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4) !important;
        }
        
        .ls-btn-text-mobile {
          display: none !important;
        }
        
        /* Offset page layout initially so sticky banner doesn't cover top links */
        body {
          padding-top: 50px !important;
        }

        /* Mobile styling */
        @media (max-width: 768px) {
          .ls-proposal-banner {
            padding: 8px 16px !important;
          }
          .ls-banner-title {
            font-size: 13px !important;
            max-width: 40% !important;
          }
          .ls-banner-btn {
            padding: 7px 12px !important;
            font-size: 12px !important;
          }
        }
        @media (max-width: 600px) {
          .ls-proposal-banner {
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 8px 12px !important;
            gap: 6px !important;
          }
          .ls-banner-title {
            display: flex !important;
            max-width: 100% !important;
            font-size: 11px !important;
            text-align: center !important;
            justify-content: center !important;
            margin-bottom: 2px !important;
          }
          .ls-banner-ctas {
            width: 100% !important;
            justify-content: space-between !important;
            gap: 6px !important;
          }
          .ls-banner-btn {
            flex: 1 1 auto !important;
            justify-content: center !important;
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
          .ls-btn-text-desktop {
            display: none !important;
          }
          .ls-btn-text-mobile {
            display: inline-block !important;
          }
        }
        
        
        /* Chat Widget styling (disabled if Tawk.to is active) */
        ${!(process.env.TAWK_EMBED_URL && process.env.TAWK_EMBED_URL.trim() !== "") ? `
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          z-index: 2147483647 !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
          transform: translateY(150%) scale(0.9) !important;
          opacity: 0 !important;
          box-sizing: border-box !important;
        }
        .ls-chat-widget * {
          box-sizing: border-box !important;
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
        .ls-chat-close:hover {
          opacity: 1 !important;
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
        .ls-chat-input:focus {
          border-color: #00d9f5 !important;
        }
        .ls-chat-send {
          background: #00d9f5 !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0f172a !important;
          cursor: pointer !important;
          padding: 8px 12px !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .ls-chat-success-msg {
          color: #10b981 !important;
          font-size: 11px !important;
          text-align: center !important;
          margin-top: 2px !important;
          display: none !important;
        }
        ` : ''}
      </style>
    `;
    
    const bannerHtml = `
      <div class="ls-proposal-banner">
        <div class="ls-banner-title">
          <span>☕ Concept Website Proposal for <strong>${businessName}</strong></span>
        </div>
        <div class="ls-banner-ctas">
          <a href="${fiverrUrl}" target="_blank" class="ls-banner-btn ls-btn-fiv" id="ls-fiverr-lnk">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; display: inline-block; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.83-.487l1.425.4c-.351.848-1.22 1.364-2.255 1.364-1.748 0-2.549-1.355-2.549-2.515 0-1.14.703-2.505 2.45-2.505 1.856 0 2.471 1.384 2.471 2.408 0 .224-.01.37-.02.477zm-1.562-.945c-.04-.42-.342-.81-.889-.81-.508 0-.81.225-.908.81h1.797zM7.508 15.44h1.416l1.767-4.874h-1.62l-.86 2.837-.878-2.837H5.72l1.787 4.874zm-6.6 0H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z"/>
            </svg>
            <span class="ls-btn-text-desktop">Order on Fiverr</span>
            <span class="ls-btn-text-mobile">Fiverr</span>
          </a>
          <a href="${waLink}" target="_blank" class="ls-banner-btn ls-btn-wa" id="ls-whatsapp-lnk">
            <svg viewBox="0 0 448 512" style="width: 14px; height: 14px; fill: currentColor; display: inline-block; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <span class="ls-btn-text-desktop">Request Changes</span>
            <span class="ls-btn-text-mobile">WhatsApp</span>
          </a>
          <a href="${emailLink}" target="_blank" class="ls-banner-btn ls-btn-email" id="ls-email-lnk">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; display: inline-block; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67zM22.5 6.908V6a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.908l9.714 5.978a1 1 0 0 0 1.048 0L22.5 6.908z"/>
            </svg>
            <span class="ls-btn-text-desktop">Email Us</span>
            <span class="ls-btn-text-mobile">Email</span>
          </a>
        </div>
      </div>
      
      <!-- Injected Chat widget HTML (disabled if Tawk.to is active) -->
      ${!(process.env.TAWK_EMBED_URL && process.env.TAWK_EMBED_URL.trim() !== "") ? `
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
    `;
    
    let trackingScript = `
      <script>
        (function() {
          const leadId = ${JSON.stringify(leadId)};
          const leadName = ${JSON.stringify(businessName)};
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
          
          // Send page load event immediately
          sendEvent('open');
          
          // Send click events
          document.getElementById('ls-fiverr-lnk').addEventListener('click', () => sendEvent('fiverr_click'));
          document.getElementById('ls-whatsapp-lnk').addEventListener('click', () => sendEvent('whatsapp_click'));
          document.getElementById('ls-email-lnk').addEventListener('click', () => sendEvent('email_click'));
          
          // Scroll and session duration heartbeats
          let totalSeconds = 0;
          let maxScroll = 0;
          
          setInterval(() => {
            totalSeconds += 10;
            
            // Calculate max scroll depth percentage reached
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
            
            if (scrollPercent > maxScroll) {
              maxScroll = scrollPercent;
            }
            
            sendEvent('heartbeat', { seconds: 10, scrollPercent: maxScroll });
          }, 10000);

          ${!(process.env.TAWK_EMBED_URL && process.env.TAWK_EMBED_URL.trim() !== "") ? `
          // Chat Trigger (Slide up after 15 seconds)
          setTimeout(() => {
            const chatBox = document.getElementById('ls-chat-box');
            if (chatBox) chatBox.classList.add('active');
          }, 15000);

          // Chat Close Button
          const closeBtn = document.getElementById('ls-chat-close-btn');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              const chatBox = document.getElementById('ls-chat-box');
              if (chatBox) chatBox.classList.remove('active');
            });
          }

          // Chat Send Action
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

            // Handle pressing enter
            msgInput.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                sendBtn.click();
              }
            });
          }
          ` : ''}
        })();
      </script>
    `;

    if (process.env.TAWK_EMBED_URL && process.env.TAWK_EMBED_URL.trim() !== "") {
      trackingScript += `
        <!--Start of Tawk.to Script-->
        <script type="text/javascript">
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='${process.env.TAWK_EMBED_URL.trim()}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        </script>
        <!--End of Tawk.to Script-->
      `;
    }

  const personalizationScript = `
    <script>
      (function() {
        const realName = ${JSON.stringify(businessName)};
        const realPhone = ${JSON.stringify(phone)};
        const realAddress = ${JSON.stringify(address)};
        
        // 1. Traverse and replace business name
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
        
        // 2. Replace phone links and plain text phone numbers
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
        
        // 3. Replace address text and update maps iframe
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
        
        // 4. Replace email links
        const mailLink = document.querySelector('a[href^="mailto:"]:not(#ls-email-lnk)');
        if (mailLink) {
          const mockEmail = mailLink.getAttribute('href').replace('mailto:', '').trim();
          const realEmail = 'contact@' + realName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
          document.querySelectorAll('a[href^="mailto:"]:not(#ls-email-lnk)').forEach(el => {
            el.href = 'mailto:' + realEmail;
            if (el.innerText.includes('@')) {
              el.innerText = realEmail;
            }
          });
        }
      })();
    </script>
  `;
  
  // Inject stylesheet inside head tag
  html = html.replace('</head>', `${bannerStyle}</head>`);
  
  // Inject banner HTML right below body tag
  const bodyOpenIndex = html.indexOf('<body');
  if (bodyOpenIndex !== -1) {
    const bodyCloseIndex = html.indexOf('>', bodyOpenIndex);
    if (bodyCloseIndex !== -1) {
      html = html.substring(0, bodyCloseIndex + 1) + bannerHtml + html.substring(bodyCloseIndex + 1);
    }
  } else {
    html = bannerHtml + html;
  }
  
  // Layout adjustment script to prevent banner from overlapping fixed/sticky navbars
  const layoutScript = `
    <script>
      (function() {
        try {
          const banner = document.querySelector('.ls-proposal-banner');
          if (banner) {
            const adjustLayout = () => {
              try {
                const bannerHeight = banner.offsetHeight;
                document.body.style.setProperty('padding-top', bannerHeight + 'px', 'important');
                
                // Select only candidate header/navbar/menu elements for safety and speed
                const selectors = 'header, nav, .header, .navbar, #header, #navbar, .nav-container, [class*="nav-menu"], [class*="nav-bar"], [class*="header"]';
                const allElems = document.querySelectorAll(selectors);
                
                for (let el of allElems) {
                  if (el === banner || banner.contains(el)) continue;
                  const style = window.getComputedStyle(el);
                  if (!style) continue;
                  
                  const isFixedOrSticky = style.position === 'fixed' || style.position === 'sticky';
                  if (isFixedOrSticky) {
                    if (el.dataset.lsOriginalTop === undefined) {
                      el.dataset.lsOriginalTop = el.style.top || 'auto';
                    }
                    
                    const rect = el.getBoundingClientRect();
                    const isBottomAnchored = rect.top > (window.innerHeight * 0.75);
                    
                    if (!isBottomAnchored) {
                      const originalTop = el.dataset.lsOriginalTop;
                      const parsedTop = parseFloat(originalTop);
                      const isAtTopCSS = originalTop === 'auto' || originalTop === '' || 
                        (!isNaN(parsedTop) && parsedTop < 15);
                      
                      if (isAtTopCSS) {
                        const topVal = originalTop === 'auto' || originalTop === '' ? 0 : parsedTop;
                        el.style.setProperty('top', (topVal + bannerHeight) + 'px', 'important');
                        el.dataset.lsOffsetAdjusted = 'true';
                      }
                    }
                  } else if (el.dataset.lsOffsetAdjusted === 'true') {
                    if (el.dataset.lsOriginalTop === 'auto' || el.dataset.lsOriginalTop === '') {
                      el.style.removeProperty('top');
                    } else {
                      el.style.setProperty('top', el.dataset.lsOriginalTop);
                    }
                    delete el.dataset.lsOffsetAdjusted;
                    delete el.dataset.lsOriginalTop;
                  }
                }
              } catch (err) {
                console.error('[Layout Offset Error]', err);
              }
            };
            
            // Initial run and event bindings
            adjustLayout();
            window.addEventListener('load', adjustLayout);
            window.addEventListener('resize', adjustLayout);
            window.addEventListener('scroll', adjustLayout);
            
            // Fallback timers for lazy stylesheets & reflows
            setTimeout(adjustLayout, 50);
            setTimeout(adjustLayout, 150);
            setTimeout(adjustLayout, 300);
            setTimeout(adjustLayout, 600);
            setTimeout(adjustLayout, 1200);
            setTimeout(adjustLayout, 2500);
          }
        } catch (e) {
          console.error('[Layout Init Error]', e);
        }
      })();
    </script>
  `;
  
  // Inject script tag before body close
  html = html.replace('</body>', `${personalizationScript}${trackingScript}${layoutScript}</body>`);
    
    res.send(html);
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

async function getIpLocation(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::ffff:127.0.0.1') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return { location: 'Local Network', isp: 'Localhost' };
  }
  if (geoCache[ip]) return geoCache[ip];
  try {
    const res = await axios.get(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,regionName,city,isp`, { timeout: 3500 });
    if (res.data && res.data.status === 'success') {
      const info = {
        location: `${res.data.city}, ${res.data.regionName}, ${res.data.country}`,
        isp: res.data.isp
      };
      geoCache[ip] = info;
      return info;
    }
  } catch (e) {
    console.error('[Geo-IP Error]:', e.message);
  }
  return { location: 'Unknown Location', isp: 'Unknown ISP' };
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
        isp: geo.isp,
        views: totalViews,
        device: details.device || 'desktop',
        events: [],
        isHot: isHot
      };
      activeVisits.unshift(session);
      if (activeVisits.length > 50) activeVisits.pop();
    } else {
      session.lastActiveAt = timestamp;
      session.views = Math.max(session.views, totalViews);
      if (isHot) session.isHot = true;
      if (details.device) session.device = details.device;
      if (session.location === 'Loading...' || session.location === 'Unknown Location') {
        session.location = geo.location;
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
      
      await writeDb(db);
    } else {
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
    res.json({ success: true, templates: ['dermatologist', 'dentist', 'gym', 'doctor', 'garage', 'jewelry', 'nail-art', 'luxurious-salon-website', 'roofing contractors'] });
  }
});


const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`        LOCAL BUSINESS LEAD SCANNER SERVER`);
  console.log(`====================================================`);
  console.log(`Server is running at: http://0.0.0.0:${PORT}`);
  console.log(`Live mode configured: ${isLiveModeConfigured() ? 'Yes' : 'No (falling back to Mock Mode)'}`);
  console.log(`====================================================`);
});

// Set server timeout to 3 minutes (180,000 ms)
server.timeout = 180000;
