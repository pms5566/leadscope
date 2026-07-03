/**
 * ad-scanner.js
 * Scrapes Meta Ad Library (Instagram/Facebook) and TikTok Ad Library
 * to find businesses running paid ads but with no proper website.
 */

const puppeteer = require('puppeteer');

// ─── Country Code Resolver ─────────────────────────────────────────────────
const CITY_TO_COUNTRY = {
  'mumbai': 'IN', 'delhi': 'IN', 'bangalore': 'IN', 'bengaluru': 'IN',
  'hyderabad': 'IN', 'chennai': 'IN', 'kolkata': 'IN', 'pune': 'IN',
  'ahmedabad': 'IN', 'jaipur': 'IN', 'surat': 'IN', 'lucknow': 'IN',
  'chandigarh': 'IN', 'amritsar': 'IN', 'india': 'IN',
  'dubai': 'AE', 'abu dhabi': 'AE', 'sharjah': 'AE', 'uae': 'AE',
  'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'houston': 'US',
  'dallas': 'US', 'miami': 'US', 'san francisco': 'US', 'usa': 'US', 'us': 'US',
  'london': 'GB', 'manchester': 'GB', 'birmingham': 'GB', 'uk': 'GB',
  'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'australia': 'AU',
  'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA', 'canada': 'CA',
  'singapore': 'SG',
  'riyadh': 'SA', 'jeddah': 'SA', 'saudi': 'SA',
  'karachi': 'PK', 'lahore': 'PK', 'islamabad': 'PK', 'pakistan': 'PK',
};

function getCountryCode(location) {
  const lower = location.toLowerCase().trim();
  for (const [key, code] of Object.entries(CITY_TO_COUNTRY)) {
    if (lower.includes(key)) return code;
  }
  return lower.slice(0, 2).toUpperCase();
}

const SOCIAL_DOMAINS = ['facebook.com', 'instagram.com', 'wa.me', 'tiktok.com', 'whatsapp.com'];

function isWebsiteUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    return !SOCIAL_DOMAINS.some(d => u.hostname.includes(d));
  } catch { return false; }
}

function cleanAdPageUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    return u.origin + u.pathname.replace(/\/$/, '');
  } catch { return url; }
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1280,900']
  });
}

// ─── Meta Ad Library Scraper ───────────────────────────────────────────────
async function scrapeMetaAdLeads(niche, city, platform = 'both') {
  const countryCode = getCountryCode(city);
  const searchQuery = `${niche} ${city}`;
  let platformParam = '';
  if (platform === 'instagram') platformParam = '&publisher_platforms[0]=instagram';
  else if (platform === 'facebook') platformParam = '&publisher_platforms[0]=facebook';

  const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${countryCode}&q=${encodeURIComponent(searchQuery)}&search_type=keyword_unordered${platformParam}`;
  console.log(`[Ad Scanner] Meta: "${searchQuery}" [${platform}] → ${url}`);

  const browser = await launchBrowser();
  const page = await browser.newPage();
  const leads = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (['image', 'font', 'media'].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 5000));

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await new Promise(r => setTimeout(r, 1200));
    }

    const rawAds = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const allText = document.body.innerText;
      const pageLinks = new Set();

      allLinks.forEach(link => {
        const href = link.href || '';
        const text = (link.textContent || '').trim();
        if (
          href.includes('facebook.com/') &&
          !href.includes('/ads/library') &&
          !href.includes('/login') &&
          !href.includes('/help') &&
          !href.includes('/sharer') &&
          !href.includes('l.facebook.com') &&
          !href.includes('/privacy') &&
          !href.includes('/policies') &&
          text.length > 1 && text.length < 80
        ) {
          pageLinks.add(JSON.stringify({ url: href, name: text }));
        }
      });

      const phones = (allText.match(/(\+?\d[\d\s\-().]{8,14}\d)/g) || []).slice(0, 15);
      const emails = (allText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || []).slice(0, 10);

      return {
        pageLinks: Array.from(pageLinks).map(s => JSON.parse(s)),
        phones,
        emails
      };
    });

    console.log(`[Ad Scanner] Meta: Found ${rawAds.pageLinks.length} page links`);

    const seenUrls = new Set();
    for (let i = 0; i < Math.min(rawAds.pageLinks.length, 25); i++) {
      const item = rawAds.pageLinks[i];
      const clean = cleanAdPageUrl(item.url);
      if (!clean || seenUrls.has(clean) || !item.name || item.name.length < 2) continue;
      seenUrls.add(clean);

      const lead = {
        id: `meta-${Date.now()}-${i}`,
        name: item.name,
        address: city,
        phone: rawAds.phones[i] || 'N/A',
        email: rawAds.emails[i] || null,
        facebook: platform === 'facebook' || platform === 'both' ? clean : null,
        instagram: platform === 'instagram' ? clean.replace('facebook.com', 'instagram.com') : null,
        linkedin: null,
        tiktok: null,
        whatsapp: null,
        adPlatform: platform === 'instagram' ? 'instagram' : platform === 'facebook' ? 'facebook' : 'meta',
        adActive: true,
        hasWebsite: false,
        googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + city)}`
      };

      if (lead.phone !== 'N/A') {
        const c = lead.phone.replace(/[^0-9]/g, '');
        if (c.length >= 10) lead.whatsapp = `https://wa.me/${c}`;
      }

      leads.push(lead);
    }
  } catch (err) {
    console.error(`[Ad Scanner] Meta scrape error:`, err.message);
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  console.log(`[Ad Scanner] Meta returning ${leads.length} leads`);
  return leads;
}

// ─── TikTok Ad Library Scraper ─────────────────────────────────────────────
async function scrapeTikTokAdLeads(niche, city) {
  const countryCode = getCountryCode(city);
  const searchQuery = `${niche} ${city}`;
  const url = `https://library.tiktok.com/ads?region=${countryCode}&search=${encodeURIComponent(searchQuery)}&period=30&sort_by=reach`;
  console.log(`[Ad Scanner] TikTok: "${searchQuery}" → ${url}`);

  const browser = await launchBrowser();
  const page = await browser.newPage();
  const leads = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (['font', 'media'].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 6000));

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await new Promise(r => setTimeout(r, 1000));
    }

    const rawAds = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const allText = document.body.innerText;
      const tiktokLinks = [];

      allLinks.forEach(link => {
        const href = link.href || '';
        const text = (link.textContent || '').trim();
        if (
          href.includes('tiktok.com/@') &&
          !href.includes('/tag/') &&
          !href.includes('/music/') &&
          text.length > 0 && text.length < 80
        ) {
          tiktokLinks.push({ url: href, name: text });
        }
      });

      // Fallback: parse brand names from page text cards
      const brandCards = document.querySelectorAll('[class*="advertiser"], [class*="brand"], [class*="card-title"]');
      const brandNames = [];
      brandCards.forEach(el => {
        const t = (el.textContent || '').trim().split('\n')[0].trim();
        if (t.length > 1 && t.length < 80) brandNames.push(t);
      });

      const phones = (allText.match(/(\+?\d[\d\s\-().]{8,14}\d)/g) || []).slice(0, 15);
      const emails = (allText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || []).slice(0, 10);

      return { tiktokLinks, brandNames: [...new Set(brandNames)], phones, emails };
    });

    console.log(`[Ad Scanner] TikTok: Found ${rawAds.tiktokLinks.length} TT links, ${rawAds.brandNames.length} brands`);

    const items = rawAds.tiktokLinks.length > 0
      ? rawAds.tiktokLinks
      : rawAds.brandNames.map(n => ({ url: null, name: n }));

    const seenNames = new Set();
    for (let i = 0; i < Math.min(items.length, 25); i++) {
      const item = items[i];
      if (!item.name || item.name.length < 2 || seenNames.has(item.name.toLowerCase())) continue;
      seenNames.add(item.name.toLowerCase());

      const lead = {
        id: `tiktok-${Date.now()}-${i}`,
        name: item.name,
        address: city,
        phone: rawAds.phones[i] || 'N/A',
        email: rawAds.emails[i] || null,
        facebook: null,
        instagram: null,
        linkedin: null,
        tiktok: item.url || null,
        whatsapp: null,
        adPlatform: 'tiktok',
        adActive: true,
        hasWebsite: false,
        googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + city)}`
      };

      if (lead.phone !== 'N/A') {
        const c = lead.phone.replace(/[^0-9]/g, '');
        if (c.length >= 10) lead.whatsapp = `https://wa.me/${c}`;
      }

      leads.push(lead);
    }
  } catch (err) {
    console.error(`[Ad Scanner] TikTok scrape error:`, err.message);
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  console.log(`[Ad Scanner] TikTok returning ${leads.length} leads`);
  return leads;
}

// ─── Main Entry ────────────────────────────────────────────────────────────
async function scanAdLeads(niche, city, platforms = ['instagram', 'facebook', 'tiktok']) {
  console.log(`[Ad Scanner] START: niche="${niche}", city="${city}", platforms=[${platforms.join(',')}]`);
  const tasks = [];

  const hasIG = platforms.includes('instagram');
  const hasFB = platforms.includes('facebook');
  const hasTT = platforms.includes('tiktok');

  if (hasIG && hasFB) tasks.push(scrapeMetaAdLeads(niche, city, 'both'));
  else if (hasIG) tasks.push(scrapeMetaAdLeads(niche, city, 'instagram'));
  else if (hasFB) tasks.push(scrapeMetaAdLeads(niche, city, 'facebook'));

  if (hasTT) tasks.push(scrapeTikTokAdLeads(niche, city));

  const results = await Promise.allSettled(tasks);
  let allLeads = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') allLeads = allLeads.concat(r.value);
    else console.error('[Ad Scanner] Platform failed:', r.reason?.message);
  });

  // Deduplicate by name
  const seen = new Set();
  const deduped = allLeads.filter(l => {
    const k = l.name.toLowerCase().trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  console.log(`[Ad Scanner] DONE. Total leads: ${deduped.length}`);
  return deduped;
}

module.exports = { scanAdLeads, getCountryCode };
