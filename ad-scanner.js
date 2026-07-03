/**
 * ad-scanner.js
 * Scrapes Meta Ad Library (Instagram/Facebook) and TikTok Ad Library
 * to find businesses running paid ads but with no proper website.
 */

const puppeteer = require('puppeteer');

// ─── Country Code Resolver ─────────────────────────────────────────────────
const CITY_TO_COUNTRY = {
  // India — major + Punjab cities
  'mumbai': 'IN', 'delhi': 'IN', 'bangalore': 'IN', 'bengaluru': 'IN',
  'hyderabad': 'IN', 'chennai': 'IN', 'kolkata': 'IN', 'pune': 'IN',
  'ahmedabad': 'IN', 'jaipur': 'IN', 'surat': 'IN', 'lucknow': 'IN',
  'chandigarh': 'IN', 'amritsar': 'IN', 'ludhiana': 'IN', 'jalandhar': 'IN',
  'patiala': 'IN', 'rajpura': 'IN', 'mohali': 'IN', 'zirakpur': 'IN',
  'bathinda': 'IN', 'moga': 'IN', 'pathankot': 'IN', 'gurdaspur': 'IN',
  'nagpur': 'IN', 'indore': 'IN', 'bhopal': 'IN', 'visakhapatnam': 'IN',
  'agra': 'IN', 'varanasi': 'IN', 'patna': 'IN', 'ranchi': 'IN',
  'bhubaneswar': 'IN', 'coimbatore': 'IN', 'madurai': 'IN', 'kochi': 'IN',
  'thiruvananthapuram': 'IN', 'guwahati': 'IN', 'dehradun': 'IN',
  'jodhpur': 'IN', 'udaipur': 'IN', 'ajmer': 'IN', 'bikaner': 'IN',
  'noida': 'IN', 'gurgaon': 'IN', 'gurugram': 'IN', 'faridabad': 'IN',
  'ghaziabad': 'IN', 'meerut': 'IN', 'kanpur': 'IN',
  'vadodara': 'IN', 'rajkot': 'IN', 'gandhinagar': 'IN',
  'mysore': 'IN', 'mysuru': 'IN', 'hubli': 'IN', 'mangalore': 'IN',
  'india': 'IN',
  // UAE
  'dubai': 'AE', 'abu dhabi': 'AE', 'sharjah': 'AE', 'uae': 'AE',
  'ajman': 'AE', 'fujairah': 'AE', 'ras al khaimah': 'AE',
  // USA
  'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'houston': 'US',
  'dallas': 'US', 'miami': 'US', 'san francisco': 'US', 'seattle': 'US',
  'boston': 'US', 'atlanta': 'US', 'usa': 'US', 'us': 'US',
  // UK
  'london': 'GB', 'manchester': 'GB', 'birmingham': 'GB', 'uk': 'GB',
  // Australia
  'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'perth': 'AU', 'australia': 'AU',
  // Canada
  'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA', 'canada': 'CA',
  // Singapore, Saudi, Pakistan
  'singapore': 'SG',
  'riyadh': 'SA', 'jeddah': 'SA', 'saudi': 'SA',
  'karachi': 'PK', 'lahore': 'PK', 'islamabad': 'PK', 'pakistan': 'PK',
};

function getCountryCode(location) {
  const lower = location.toLowerCase().trim();
  for (const [key, code] of Object.entries(CITY_TO_COUNTRY)) {
    if (lower.includes(key)) return code;
  }
  // Fallback to India — default use case. Avoids garbage like 'RA' for 'Rajpura'
  return 'IN';
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
      const pageLinks = new Set();

      // Blacklist Meta's own UI links that appear in the page
      const JUNK_NAMES = new Set([
        'log in', 'login', 'sign up', 'sign in', 'create account',
        'about ads and data use', 'about ads', 'about meta',
        'ad choices', 'privacy', 'terms', 'cookies', 'help center',
        'see all results', 'see more', 'load more', 'show more',
        'facebook', 'meta', 'instagram', 'messenger', 'whatsapp',
        'report a problem', 'language', 'people', 'pages', 'groups',
        'search', 'marketplace', 'watch', 'memory',
        'english (uk)', 'english (us)', 'english', 'हिन्दी', 'français',
        'español', 'deutsch', 'português', 'italiano', 'arabic',
        'more', 'back', 'next', 'previous', 'close', 'cancel'
      ]);

      const JUNK_URLS = [
        '/ads/library', '/login', '/help', '/sharer', '/privacy',
        '/policies', '/terms', '/about', 'l.facebook.com',
        '/ads/about', 'facebook.com/ads', 'facebook.com/help',
        'facebook.com/privacy', 'facebook.com/terms',
        'facebook.com/policies', 'facebook.com/people',
        'facebook.com/groups', 'facebook.com/marketplace',
        'facebook.com/watch', 'facebook.com/gaming',
        'facebook.com/fundraisers', 'facebook.com/events',
        'instagram.com', 'messenger.com', 'whatsapp.com'
      ];

      allLinks.forEach(link => {
        const href = link.href || '';
        const text = (link.textContent || '').trim();
        const textLower = text.toLowerCase();

        if (
          href.includes('facebook.com/') &&
          !JUNK_URLS.some(j => href.toLowerCase().includes(j)) &&
          text.length > 1 && text.length < 80 &&
          !JUNK_NAMES.has(textLower) &&
          !textLower.startsWith('see ') &&
          !textLower.startsWith('load ') &&
          !textLower.startsWith('show ')
        ) {
          pageLinks.add(JSON.stringify({ url: href, name: text }));
        }
      });

      // Only extract real phone numbers — must have spaces/dashes/brackets
      // This avoids picking up numeric Facebook page IDs
      const allText = document.body.innerText;
      const phones = (allText.match(/(\+?[0-9]{1,4}[\s\-().][0-9]{2,5}[\s\-().][0-9]{3,10})/g) || []).slice(0, 10);
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

      // Skip if name looks like a language switcher or pure numeric Facebook ID used as name
      const nameLower = item.name.toLowerCase().trim();
      if (/^[\d\s]+$/.test(item.name)) continue;           // pure numbers
      if (nameLower.includes('(uk)') || nameLower.includes('(us)') || nameLower.includes('(in)')) continue;  // language strings
      if (nameLower.startsWith('english') || nameLower.startsWith('español') || nameLower.startsWith('français')) continue;

      seenUrls.add(clean);

      // Extract page handle/slug from Facebook URL
      // e.g. https://www.facebook.com/SabkadentistIndia → "SabkadentistIndia"
      let pageHandle = '';
      try {
        const urlObj = new URL(clean);
        pageHandle = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')[0];
        if (/^\d+$/.test(pageHandle)) pageHandle = ''; // skip numeric IDs
      } catch(e) { pageHandle = ''; }

      // Try Instagram URL using same handle (works ~70% of time — most businesses share handle)
      const instagramUrl = pageHandle ? `https://www.instagram.com/${pageHandle}/` : null;

      const lead = {
        id: `meta-${Date.now()}-${i}`,
        name: item.name,
        address: city,
        phone: rawAds.phones[i] || 'N/A',
        email: rawAds.emails[i] || null,
        // Always keep facebook link — it is the reliable link we extract from Meta Ad Library
        facebook: clean,
        // Instagram: use guessed handle for instagram/both platform modes
        instagram: (platform === 'instagram' || platform === 'both') ? instagramUrl : null,
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
