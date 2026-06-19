const axios = require('axios');
const puppeteer = require('puppeteer');
require('dotenv').config();

// Pre-configured mock data templates to generate high-quality realistic leads
const MOCK_BUSINESSES = {
  bakery: {
    names: {
      default: ["Golden Crust Bakery", "Sweet Treats Shop", "The Dough Knot", "Daily Bread Co."],
      "paris": ["Boulangerie Patisserie du Coin", "Le Petit Croissant", "L'Amour du Pain", "Maison Kayser Mock"],
      "new york": ["Broadway Bagels", "Manhattan Doughnuts", "Soho Sweet Shop", "East Side Bakery"]
    },
    addresses: {
      default: ["123 Main St", "456 Oak Ave", "789 Pine Rd"],
      "paris": ["12 Rue de la Paix", "45 Boulevard Saint-Germain", "78 Rue de Rivoli"],
      "new york": ["570 Lexington Ave", "120 Broadway", "45 Wall St"]
    }
  },
  coffee: {
    names: {
      default: ["The Daily Grind", "Espresso Express", "Mug Shot Coffee", "Bean & Leaf"],
      "paris": ["Café de Flore Mock", "Le Bourbon Café", "Café des Artistes", "L'Espresso Parisien"],
      "new york": ["Central Perk Mock", "Gotham Brews", "Brooklyn Bean", "Subway Coffee Co."]
    },
    addresses: {
      default: ["101 Maple St", "202 Elm Dr", "303 Birch Ln"],
      "paris": ["24 Rue de la Huchette", "8 Boulevard Saint-Denis", "14 Rue Mouffetard"],
      "new york": ["234 Fifth Ave", "89 Seventh Ave", "56 Bleecker St"]
    }
  },
  dentist: {
    names: {
      default: ["Bright Smiles Dental", "Family Dental Care", "Apex Orthodontics", "Elite Dental Clinique"],
      "paris": ["Cabinet Dentaire du Centre", "Dr. Jean Dupont Dentiste", "Clinique Dentaire Parisienne"],
      "new york": ["Manhattan Dental Arts", "Gotham Dental Care", "Broadway Smile Center", "NY Family Dentistry"]
    },
    addresses: {
      default: ["777 Health Blvd", "888 Wellness Way", "999 Care Rd"],
      "paris": ["5 Avenue de l'Opéra", "18 Rue de Rennes", "33 Boulevard Haussmann"],
      "new york": ["30 Rockefeller Plaza", "509 Madison Ave", "125 Park Ave"]
    }
  },
  gym: {
    names: {
      default: ["Iron Works Gym", "Fit & Flex Studio", "Peak Performance", "Active Life Fitness"],
      "paris": ["Gymnase de la Cité", "Le Club Fitness Paris", "Paris Athlétique Club"],
      "new york": ["Gotham Fitness Club", "Manhattan Iron Gym", "Broadway Athletics", "Central Park Fitness"]
    },
    addresses: {
      default: ["55 Gym St", "99 Muscle Rd", "11 Power Ave"],
      "paris": ["102 Rue Saint-Antoine", "56 Rue du Faubourg Saint-Honoré", "89 Rue de la Pompe"],
      "new york": ["420 Lexington Ave", "100 Broadway", "15 West 43rd St"]
    }
  }
};

/**
 * Generate a list of mock local businesses for demonstration and testing.
 */
function generateMockLeads(niche, location) {
  const normNiche = niche.toLowerCase();
  const normLoc = location.toLowerCase();
  
  // Try to find matching template or fallback
  let nicheData = MOCK_BUSINESSES.bakery; // default fallback
  for (const key of Object.keys(MOCK_BUSINESSES)) {
    if (normNiche.includes(key)) {
      nicheData = MOCK_BUSINESSES[key];
      break;
    }
  }
  
  const namesList = nicheData.names[normLoc] || nicheData.names.default;
  const addressList = nicheData.addresses[normLoc] || nicheData.addresses.default;
  
  const results = [];
  
  // Generate 8 businesses, some will have websites and some won't
  for (let i = 0; i < 8; i++) {
    const name = namesList[i % namesList.length] + (i >= namesList.length ? ` (${i + 1})` : "");
    const address = addressList[i % addressList.length] + `, ${location}`;
    const phone = location.toLowerCase() === "paris" 
      ? `+33 1 ${Math.floor(10000000 + Math.random() * 90000000)}`
      : `+1 (${Math.floor(200 + Math.random() * 800)}) 555-${Math.floor(1000 + Math.random() * 9000)}`;
      
    // 30% of businesses have a website in our mock data, 70% do not (leads!)
    const hasWebsite = i % 3 === 0;
    const websiteUri = hasWebsite ? `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` : null;
    
    results.push({
      displayName: { text: name },
      formattedAddress: address,
      nationalPhoneNumber: phone,
      websiteUri: websiteUri,
      id: `mock-id-${i + 1}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
    });
  }
  
  return results;
}

/**
 * Perform a mock social media search for a business.
 */
function getMockSocialMedia(name, location) {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const locSuffix = location.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Randomly simulate social media link availability (e.g. 70% have Facebook, 50% Instagram, etc.)
  return {
    facebook: Math.random() > 0.3 ? `https://facebook.com/${cleanName}-${locSuffix}` : null,
    instagram: Math.random() > 0.5 ? `https://instagram.com/${cleanName}` : null,
    linkedin: Math.random() > 0.8 ? `https://linkedin.com/company/${cleanName}` : null,
    whatsapp: Math.random() > 0.6 ? `https://wa.me/${Math.floor(10000000000 + Math.random() * 90000000000)}` : null,
    email: Math.random() > 0.7 ? `contact@${cleanName}.com` : null
  };
}

/**
 * Checks if the configured Google API keys are valid (non-placeholder).
 */
function isLiveModeConfigured() {
  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  const serperKey = process.env.SERPER_API_KEY;
  const searchKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cxId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  const hasPlaces = placesKey && placesKey !== "your_google_places_api_key_here" && placesKey.trim() !== "";
  const hasSerper = serperKey && serperKey !== "your_serper_api_key_here" && serperKey.trim() !== "";
  const hasGoogleSearch = searchKey && searchKey !== "your_google_search_api_key_here" && searchKey.trim() !== "" &&
                         cxId && cxId !== "your_google_search_engine_id_here" && cxId.trim() !== "";
                         
  return hasPlaces && (hasSerper || hasGoogleSearch);
}

/**
 * Scan local businesses using Google Places API (New).
 */
async function fetchLivePlaces(niche, location) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const url = "https://places.googleapis.com/v1/places:searchText";
  
  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.id"
  };
  
  const payload = {
    textQuery: `${niche} in ${location}`
  };
  
  const response = await axios.post(url, payload, { headers });
  return response.data.places || [];
}

/**
 * Search social media URLs and contact details for a business using Google Custom Search API.
 */
async function searchLiveSocialMedia(businessName, location) {
  const serperKey = process.env.SERPER_API_KEY;
  const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  const query = `"${businessName}" ${location} (site:facebook.com OR site:instagram.com OR site:linkedin.com OR site:whatsapp.com OR site:wa.me)`;
  let items = [];
  
  try {
    if (serperKey && serperKey !== "your_serper_api_key_here" && serperKey.trim() !== "") {
      const url = "https://google.serper.dev/search";
      const headers = {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json"
      };
      const payload = { q: query, num: 5 };
      console.log(`[Scanner] Fetching social media search via Serper.dev API...`);
      const response = await axios.post(url, payload, { headers });
      items = response.data.organic || [];
    } else if (googleKey && googleKey !== "your_google_search_api_key_here" && cx && cx !== "your_google_search_engine_id_here") {
      const url = "https://www.googleapis.com/customsearch/v1";
      console.log(`[Scanner] Fetching social media search via Google Custom Search API...`);
      const response = await axios.get(url, {
        params: {
          key: googleKey,
          cx: cx,
          q: query,
          num: 5
        }
      });
      items = response.data.items || [];
    }
  } catch (err) {
    console.error(`[Search API Error] Failed search query:`, err.message);
  }
  
  let facebook = null;
  let instagram = null;
  let linkedin = null;
  let whatsapp = null;
  let email = null;
  
  for (const item of items) {
    const link = item.link || "";
    const snippet = item.snippet || "";
    
    // Parse social links
    if (link.includes("facebook.com/") && !facebook) {
      facebook = link;
    } else if (link.includes("instagram.com/") && !instagram) {
      instagram = link;
    } else if ((link.includes("linkedin.com/company/") || link.includes("linkedin.com/in/")) && !linkedin) {
      linkedin = link;
    } else if ((link.includes("wa.me/") || link.includes("api.whatsapp.com/")) && !whatsapp) {
      whatsapp = link;
    }
    
    // Attempt basic regex email matching in snippets
    if (!email) {
      const emailMatch = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        email = emailMatch[0];
      }
    }
  }
  
  return { facebook, instagram, linkedin, whatsapp, email };
}

/**
 * Scrapes business listings from Google Maps search using Puppeteer.
 */
/**
 * Run an array of promise-returning functions in batches of a given size.
 */
async function runInBatches(tasks, batchSize = 6, batchDelayMs = 0) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    if (i > 0 && batchDelayMs > 0) {
      const jitter = Math.floor(Math.random() * 1000);
      console.log(`[Scanner] Waiting ${batchDelayMs + jitter}ms before next batch to prevent rate limiting...`);
      await new Promise(r => setTimeout(r, batchDelayMs + jitter));
    }
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(task => task()));
    results.push(...batchResults);
  }
  return results;
}

/**
 * Scrapes business listings from Google Maps search using Puppeteer.
 */
async function scrapePlacesWithPuppeteer(niche, location, browser) {
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(niche + ' in ' + location)}`;
  console.log(`[Puppeteer] Navigating to: ${searchUrl}`);
  
  const searchPage = await browser.newPage();
  
  // Set viewport and enable request interception to block images/fonts/media
  await searchPage.setViewport({ width: 1280, height: 900 });
  await searchPage.setRequestInterception(true);
  searchPage.on('request', (req) => {
    const type = req.resourceType();
    if (['image', 'font', 'media'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  await searchPage.goto(searchUrl, { waitUntil: 'domcontentloaded' });
  
  try {
    await searchPage.waitForSelector('a[href*="/maps/place/"]', { timeout: 12000 });
  } catch (err) {
    console.log(`[Puppeteer] No listing links found on search page.`);
    await searchPage.close().catch(() => {});
    return [];
  }
  
  // Scroll the left panel sidebar to load all results in the city
  console.log(`[Puppeteer] Scrolling sidebar to load all local businesses...`);
  await searchPage.evaluate(async () => {
    const feed = document.querySelector('div[role="feed"]');
    if (!feed) return;
    let lastHeight = feed.scrollHeight;
    let retriesWithoutChange = 0;
    
    for (let i = 0; i < 25; i++) {
      feed.scrollBy(0, 1500);
      await new Promise(r => setTimeout(r, 700));
      
      // Stop scrolling if we hit the bottom (height doesn't increase)
      if (feed.scrollHeight === lastHeight) {
        retriesWithoutChange++;
        if (retriesWithoutChange >= 3) break;
      } else {
        retriesWithoutChange = 0;
        lastHeight = feed.scrollHeight;
      }
      
      // Stop if the end of the list indicator is reached
      if (document.body.innerText.includes("reached the end of the list")) {
        break;
      }
    }
  });
  
  // Extract leads directly from the sidebar by checking for external links (website buttons)
  console.log(`[Puppeteer] Extracting and filtering leads from sidebar...`);
  const leads = await searchPage.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));
    const results = [];
    
    links.forEach((link) => {
      let cardContainer = link;
      // Search up to 10 levels for the card container
      for (let i = 0; i < 10; i++) {
        if (cardContainer.parentElement) {
          const hasMultipleLinks = cardContainer.parentElement.querySelectorAll('a[href*="/maps/place/"]').length > 1;
          if (hasMultipleLinks) {
            break;
          }
          cardContainer = cardContainer.parentElement;
        }
      }
      
      // Check for website button/link inside cardContainer
      const allLinks = Array.from(cardContainer.querySelectorAll('a'));
      const externalLink = allLinks.find(a => {
        const href = a.href || '';
        return href && !href.includes('google.com') && !href.startsWith('/') && !href.startsWith('#');
      });
      
      // If there is no external website link, it is a lead!
      if (!externalLink) {
        results.push({
          name: link.getAttribute('aria-label') || link.innerText || 'Unknown',
          url: link.href
        });
      }
    });
    
    // Deduplicate leads by name
    const uniqueMap = new Map();
    results.forEach(r => {
      if (r.name && !uniqueMap.has(r.name)) {
        uniqueMap.set(r.name, r);
      }
    });
    return Array.from(uniqueMap.values());
  });
  
  // Close searchPage to release resources
  await searchPage.close().catch(() => {});
  
  const uniqueLeads = leads.slice(0, 30); // Scrape details for top 30 leads (enough for full city discovery)
  console.log(`[Puppeteer] Found ${leads.length} potential leads. Scraping details in parallel batches for top ${uniqueLeads.length}...`);
  
  const detailTasks = uniqueLeads.map((lead) => async () => {
    let detailPage = null;
    try {
      detailPage = await browser.newPage();
      await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      await detailPage.setRequestInterception(true);
      detailPage.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });
      
      await detailPage.goto(lead.url, { waitUntil: 'domcontentloaded' });
      await detailPage.waitForSelector('h1', { timeout: 6000 });
      
      const details = await detailPage.evaluate(() => {
        const clean = (str) => str ? str.replace(/[\uE000-\uF8FF]/g, '').trim() : '';
        
        const nameEl = document.querySelector('h1');
        const name = nameEl ? nameEl.innerText.trim() : 'Unknown';
        
        const addrEl = document.querySelector('button[data-item-id="address"]');
        const formattedAddress = addrEl ? clean(addrEl.innerText) : 'N/A';
        
        const phoneEl = document.querySelector('button[data-item-id^="phone:tel:"]');
        const nationalPhoneNumber = phoneEl ? clean(phoneEl.innerText) : 'N/A';
        
        const webEl = document.querySelector('a[data-item-id="authority"]');
        const websiteUri = webEl ? webEl.href : null;
        
        return { name, formattedAddress, nationalPhoneNumber, websiteUri };
      });
      
      return {
        id: `scr-${Math.random().toString(36).substring(2, 9)}`,
        displayName: { text: details.name || lead.name },
        formattedAddress: details.formattedAddress,
        nationalPhoneNumber: details.nationalPhoneNumber,
        websiteUri: details.websiteUri,
        googleMapsUri: lead.url
      };
    } catch (e) {
      console.error(`[Puppeteer] Failed to scrape details for "${lead.name}": ${e.message}`);
      return null;
    } finally {
      if (detailPage) {
        await detailPage.close().catch(() => {});
      }
    }
  });
  
  const places = (await runInBatches(detailTasks, 6)).filter(p => p !== null);
  return places;
}

function getInstagramUsername(url) {
  if (!url) return null;
  try {
    let parsedUrl = url.trim();
    if (!parsedUrl.startsWith('http://') && !parsedUrl.startsWith('https://')) {
      parsedUrl = 'https://' + parsedUrl;
    }
    const urlObj = new URL(parsedUrl);
    if (urlObj.hostname.includes('instagram.com')) {
      const parts = urlObj.pathname.split('/').filter(p => p.length > 0);
      if (parts.length > 0) {
        return parts[0];
      }
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

function getFacebookUsername(url) {
  if (!url) return null;
  try {
    let parsedUrl = url.trim();
    if (!parsedUrl.startsWith('http://') && !parsedUrl.startsWith('https://')) {
      parsedUrl = 'https://' + parsedUrl;
    }
    const urlObj = new URL(parsedUrl);
    if (urlObj.hostname.includes('facebook.com')) {
      const parts = urlObj.pathname.split('/').filter(p => p.length > 0);
      if (parts.length > 0) {
        const first = parts[0];
        if (first === 'profile.php') {
          const id = urlObj.searchParams.get('id');
          if (id) return id;
        } else if (first === 'pages' && parts.length > 1) {
          return parts[parts.length - 1];
        } else if (['groups', 'sharer', 'search', 'notifications'].includes(first)) {
          return null;
        } else {
          return first;
        }
      }
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

function checkIsSocialOrDirectory(url) {
  if (!url) return true;
  try {
    let parsedUrl = url.trim();
    if (!parsedUrl.startsWith('http://') && !parsedUrl.startsWith('https://')) {
      parsedUrl = 'https://' + parsedUrl;
    }
    const urlObj = new URL(parsedUrl);
    const hostname = urlObj.hostname.toLowerCase();
    
    const excludedHosts = [
      'facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com',
      'youtube.com', 'whatsapp.com', 'wa.me', 'google.com', 'bing.com',
      'yelp.com', 'tripadvisor.com', 'justdial.com', 'yellowpages.com',
      'foursquare.com', 'mapquest.com', 'tiktok.com', 'pinterest.com',
      'wix.com', 'wordpress.com', 'squarespace.com', 'weebly.com',
      'groupon.com', 'apple.com', 'microsoft.com', 'yahoo.com', 'duckduckgo.com',
      'github.com', 'reddit.com', 'tumblr.com', 'medium.com', 'wikipedia.org',
      'indiamart.com', 'sulekha.com', 'dialme.com', 'dial.me', 'asklaila.com',
      'local.google.com', 'maps.google.com', 'play.google.com', 't.me'
    ];
    
    return excludedHosts.some(h => hostname === h || hostname.endsWith('.' + h));
  } catch (e) {
    return true;
  }
}

function extractWebsiteFromSnippet(text) {
  if (!text) return null;
  const matches = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g);
  if (matches) {
    const excludedDomains = [
      'facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com',
      'youtube.com', 'whatsapp.com', 'wa.me', 'google.com', 'bing.com',
      'yelp.com', 'tripadvisor.com', 'justdial.com', 'yellowpages.com',
      'foursquare.com', 'mapquest.com', 'tiktok.com', 'pinterest.com',
      'wix.com', 'wordpress.com', 'squarespace.com', 'weebly.com',
      'wikipedia.org', 't.me'
    ];
    for (const m of matches) {
      const cleanDomain = m.replace(/https?:\/\//, '').replace('www.', '').split('/')[0].toLowerCase();
      const isExcluded = excludedDomains.some(d => cleanDomain === d || cleanDomain.endsWith('.' + d));
      if (!isExcluded) {
        return m;
      }
    }
  }
  return null;
}

/**
 * Searches and scrapes social media links using DuckDuckGo with fallback to Bing.
 */
async function scrapeSocialLinksWithPuppeteer(name, location, page) {
  const query = `"${name}" ${location} facebook instagram`;
  
  let facebook = null;
  let instagram = null;
  let linkedin = null;
  let whatsapp = null;
  let email = null;
  let hasWebsiteInBio = false;
  let foundWebsiteUrl = null;
  
  try {
    // 1. DuckDuckGo Search (HTML-only search page - very low bot detection, highly reliable)
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    await page.goto(ddgUrl, { waitUntil: 'domcontentloaded' });
    
    let hasDdgResults = false;
    try {
      await page.waitForSelector('.result', { timeout: 3500 });
      hasDdgResults = true;
    } catch (e) {
      // DuckDuckGo failed or was empty, will fall back to Bing
    }
    
    let linksAndTexts = [];
    
    if (hasDdgResults) {
      const ddgRawResults = await page.evaluate(() => {
        const results = [];
        const cards = document.querySelectorAll('.result');
        
        cards.forEach(card => {
          const linkEl = card.querySelector('.result__title a, a.result__url');
          const snippetEl = card.querySelector('.result__snippet');
          if (!linkEl) return;
          
          results.push({
            link: linkEl.href || '',
            snippet: snippetEl ? snippetEl.innerText.trim() : ''
          });
        });
        return results;
      });
      
      // Decode DuckDuckGo redirect wrappers (uddg parameter containing raw URL)
      linksAndTexts = ddgRawResults.map(item => {
        let decodedLink = item.link;
        if (decodedLink.includes('uddg=')) {
          try {
            const urlObj = new URL(decodedLink);
            const uddg = urlObj.searchParams.get('uddg');
            if (uddg) decodedLink = decodeURIComponent(uddg);
          } catch (e) {
            const parts = decodedLink.split('uddg=');
            if (parts.length > 1) {
              decodedLink = decodeURIComponent(parts[1].split('&')[0]);
            }
          }
        }
        return { link: decodedLink, snippet: item.snippet };
      });
    }
    
    // 2. Fallback to Bing Search if DuckDuckGo failed
    if (linksAndTexts.length === 0) {
      console.log(`[Scanner] DuckDuckGo returned no results for "${name}". Falling back to Bing...`);
      const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      await page.goto(bingUrl, { waitUntil: 'domcontentloaded' });
      
      // Check for captcha or bot block page
      const pageTitle = await page.title().catch(() => '');
      const pageContent = await page.content().catch(() => '');
      if (pageTitle.includes('Security') || pageContent.includes('Verification') || pageContent.includes('challenge') || pageContent.includes('solve the challenge') || pageContent.includes('ref=Help') || pageContent.includes('IdentityVerification')) {
        console.warn(`[Scanner Warning] Bing rate limit or captcha detected for "${name}". Skipping social enrich fallback.`);
      } else {
        try {
          await page.waitForSelector('li.b_algo', { timeout: 3500 });
          
          const bingRawResults = await page.evaluate(() => {
            const results = [];
            const cards = document.querySelectorAll('li.b_algo');
            
            cards.forEach(card => {
              const linkEl = card.querySelector('h2 a');
              if (!linkEl) return;
              
              const paragraphs = Array.from(card.querySelectorAll('p, .b_caption, .b_snippet'));
              const snippetText = paragraphs
                .map(p => p.innerText.trim())
                .filter(Boolean)
                .join(' ');
                
              results.push({
                link: linkEl.href || '',
                snippet: snippetText
              });
            });
            return results;
          });
          
          // Decode Bing redirect wrappers (u parameter containing base64)
          linksAndTexts = bingRawResults.map(item => {
            let link = item.link;
            if (link.includes('/ck/a?!') && link.includes('&u=')) {
              try {
                const urlObj = new URL(link);
                let u = urlObj.searchParams.get('u');
                if (u && u.startsWith('a1')) {
                  u = u.substring(2);
                  u = u.replace(/-/g, '+').replace(/_/g, '/');
                  while (u.length % 4 !== 0) u += '=';
                  link = Buffer.from(u, 'base64').toString('utf-8');
                }
              } catch (e) {
                const parts = link.split('&u=');
                if (parts.length > 1) {
                  let uPart = parts[1].split('&')[0];
                  if (uPart.startsWith('a1')) {
                    uPart = uPart.substring(2).replace(/-/g, '+').replace(/_/g, '/');
                    while (uPart.length % 4 !== 0) uPart += '=';
                    link = Buffer.from(uPart, 'base64').toString('utf-8');
                  }
                }
              }
            }
            return { link, snippet: item.snippet };
          });
        } catch (e) {
          console.warn(`[Scanner Warning] Both DuckDuckGo and Bing search failed or timed out for "${name}".`);
        }
      }
    }
    
    // 3. Process extracted links and snippets
    for (const item of linksAndTexts) {
      const link = item.link;
      const snippet = item.snippet;
      
      // Check if snippet contains custom website links
      const websiteInSnippet = extractWebsiteFromSnippet(snippet);
      if (websiteInSnippet) {
        hasWebsiteInBio = true;
        foundWebsiteUrl = websiteInSnippet;
      }
      
      if (link.includes("facebook.com/") && !facebook) {
        facebook = link;
      } else if (link.includes("instagram.com/") && !instagram) {
        instagram = link;
      } else if ((link.includes("linkedin.com/company/") || link.includes("linkedin.com/in/")) && !linkedin) {
        linkedin = link;
      } else if ((link.includes("wa.me/") || link.includes("api.whatsapp.com/")) && !whatsapp) {
        whatsapp = link;
      }
      
      if (!email) {
        const emailMatch = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          email = emailMatch[0];
        }
      }
    }
    
    // --- Deep Bio Scraper (Email Extraction Fallback using DuckDuckGo) ---
    if (!email && (instagram || facebook)) {
      try {
        let deepQuery = '';
        if (instagram) {
          const igUser = getInstagramUsername(instagram);
          if (igUser) {
            deepQuery += `site:instagram.com/${igUser} email OR "@"`;
          }
        }
        if (facebook) {
          const fbUser = getFacebookUsername(facebook);
          if (fbUser) {
            if (deepQuery) deepQuery += ' OR ';
            deepQuery += `site:facebook.com/${fbUser} email OR "@"`;
          }
        }
        
        if (deepQuery) {
          const deepUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(deepQuery)}`;
          await page.goto(deepUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
          await new Promise(r => setTimeout(r, 1200));
          await page.waitForSelector('.result', { timeout: 3000 }).catch(() => {});
          
          const snippets = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.result__snippet')).map(s => s.innerText);
          }).catch(() => []);
          
          for (const snippet of snippets) {
            const emailMatch = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
              email = emailMatch[0];
              console.log(`[Deep Scraper] Successfully extracted email "${email}" for "${name}" from social snippet!`);
              break;
            }
          }
        }
      } catch (deepErr) {
        console.error(`[Deep Scraper] Secondary email lookup failed: ${deepErr.message}`);
      }
    }
    
  } catch (err) {
    console.error(`[Puppeteer] Social search error for "${name}": ${err.message}`);
  }
  
  return { facebook, instagram, linkedin, whatsapp, email, hasWebsiteInBio, foundWebsiteUrl };
}

/**
 * Main function to scan and enrich local leads.
 * @param {string} niche - The business niche (e.g. bakery)
 * @param {string} location - The city or area (e.g. Paris)
 * @param {boolean} forceMock - Force the use of mock generator
 * @returns {Promise<Array>} Array of leads (businesses with no website)
 */
async function scanLocalLeads(niche, location, forceMock = false) {
  const isMock = forceMock;
  const isLiveAPI = !forceMock && isLiveModeConfigured();
  const isScraper = !forceMock && !isLiveModeConfigured();
  
  const modeLabel = isMock ? "MOCK MODE" : (isLiveAPI ? "LIVE API MODE" : "LIVE SCRAPER MODE (PUPPETEER)");
  console.log(`[Scanner] Running scan for "${niche}" in "${location}" using [${modeLabel}]`);
  
  if (isMock) {
    // Generate simulated data
    const rawPlaces = generateMockLeads(niche, location);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter out businesses that already have a website
    const leadsWithoutWebsite = rawPlaces.filter(place => !place.websiteUri);
    const enrichedLeads = [];
    
    for (const place of leadsWithoutWebsite) {
      const name = place.displayName?.text || "Unknown Business";
      const address = place.formattedAddress || "N/A";
      const phone = place.nationalPhoneNumber || "N/A";
      const social = getMockSocialMedia(name, location);
      
      enrichedLeads.push({
        id: place.id,
        name,
        address,
        phone,
        googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`,
        ...social
      });
    }
    return enrichedLeads;
  }
  
  if (isLiveAPI) {
    let rawPlaces = [];
    try {
      rawPlaces = await fetchLivePlaces(niche, location);
    } catch (error) {
      console.error("[Scanner Error] Failed to fetch live places via API. Falling back to Mock.", error.message);
      return scanLocalLeads(niche, location, true);
    }
    
    const leadsWithoutWebsite = rawPlaces.filter(place => !place.websiteUri);
    const enrichedLeads = [];
    
    for (const place of leadsWithoutWebsite) {
      const name = place.displayName?.text || "Unknown Business";
      const address = place.formattedAddress || "N/A";
      const phone = place.nationalPhoneNumber || "N/A";
      let social = { facebook: null, instagram: null, linkedin: null, whatsapp: null, email: null };
      
      try {
        social = await searchLiveSocialMedia(name, location);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`[Scanner Error] Failed to enrich details for "${name}":`, error.message);
      }
      
      enrichedLeads.push({
        id: place.id,
        name,
        address,
        phone,
        googleMapsUri: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place.id}`,
        ...social
      });
    }
    return enrichedLeads;
  }
  
  if (isScraper) {
    let browser = null;
    try {
      console.log(`[Scanner] Initializing Puppeteer browser...`);
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // Fetch places using Puppeteer (passing the browser object to run tasks in parallel)
      const scrapedPlaces = await scrapePlacesWithPuppeteer(niche, location, browser);
      
      // Filter out businesses with website links and slice to top 30 leads (enough for full city coverage)
      const leadsWithoutWebsite = scrapedPlaces.filter(place => !place.websiteUri).slice(0, 30);
      
      console.log(`[Scanner] Scraping social links in parallel batches for ${leadsWithoutWebsite.length} leads...`);
      
      const hasSerper = process.env.SERPER_API_KEY && process.env.SERPER_API_KEY !== "your_serper_api_key_here" && process.env.SERPER_API_KEY.trim() !== "";
      const hasGoogleSearch = process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_API_KEY !== "your_google_search_api_key_here" && process.env.GOOGLE_SEARCH_ENGINE_ID;
      const hasSearchAPI = hasSerper || hasGoogleSearch;

      const enrichTasks = leadsWithoutWebsite.map((place, index) => async () => {
        // Stagger requests within the same batch to prevent simultaneous Bing searches (only if using scraper)
        const staggerDelay = hasSearchAPI ? 0 : ((index % 2) * (800 + Math.floor(Math.random() * 800)));
        if (staggerDelay > 0) {
          await new Promise(r => setTimeout(r, staggerDelay));
        }

        const name = place.displayName?.text || "Unknown Business";
        const address = place.formattedAddress || "N/A";
        const phone = place.nationalPhoneNumber || "N/A";
        
        let socialPage = null;
        let social = { facebook: null, instagram: null, linkedin: null, whatsapp: null, email: null };
        
        try {
          // If Search API keys are configured, use the fast API instead of Puppeteer scraping!
          if (hasSearchAPI) {
            console.log(`[Scanner] Enriching "${name}" using Search API...`);
            social = await searchLiveSocialMedia(name, location);
          } else {
            console.log(`[Scanner] Enriching "${name}" using Puppeteer scraper fallback...`);
            socialPage = await browser.newPage();
            await socialPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
            await socialPage.setRequestInterception(true);
            socialPage.on('request', (req) => {
              const type = req.resourceType();
              if (['image', 'font', 'media'].includes(type)) {
                req.abort();
              } else {
                req.continue();
              }
            });
            
            social = await scrapeSocialLinksWithPuppeteer(name, location, socialPage);
          }
        } catch (error) {
          console.error(`[Scanner Error] Failed to enrich details for "${name}":`, error.message);
        } finally {
          if (socialPage) {
            await socialPage.close().catch(() => {});
          }
        }
        
        // Auto-generate WhatsApp link if not found but phone is present
        let whatsapp = social.whatsapp;
        if (!whatsapp && phone && phone !== 'N/A') {
          const cleanPhone = phone.replace(/[^0-9]/g, '');
          if (cleanPhone.length >= 10) {
            whatsapp = `https://wa.me/${cleanPhone}`;
          }
        }
        
        if (social.hasWebsiteInBio) {
          console.log(`[Scanner] Filtering out "${name}" because website was found in social search: ${social.foundWebsiteUrl}`);
          return null;
        }

        return {
          id: place.id,
          name,
          address,
          phone,
          googleMapsUri: place.googleMapsUri,
          ...social,
          whatsapp
        };
      });
      
      // Use batch size of 10 and a 100ms delay if Search API is active, otherwise fallback to batch size of 2 and a 2.5-second delay
      const batchSize = hasSearchAPI ? 10 : 2;
      const batchDelay = hasSearchAPI ? 100 : 2500;
      const enrichedLeads = await runInBatches(enrichTasks, batchSize, batchDelay);
      return enrichedLeads.filter(l => l !== null);
      
    } catch (error) {
      console.error(`[Scanner Error] Puppeteer execution failed. Falling back to Mock.`, error.message);
      return scanLocalLeads(niche, location, true);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  
  return [];
}

module.exports = {
  scanLocalLeads,
  isLiveModeConfigured
};
