const express = require('express');
const path = require('path');
const axios = require('axios');
const { scanLocalLeads, isLiveModeConfigured } = require('./scanner');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory cache for latest scanned leads and visitor tracking
let latestScannedLeads = [];
let activeVisits = [];

// Helper to fetch files from configured GitHub repository
async function fetchFromGithub(pathWithinRepo, responseType = 'text') {
  const owner = process.env.GITHUB_USERNAME || 'parmeetsingh';
  const repo = process.env.GITHUB_REPO || 'leadscope-templates';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${pathWithinRepo}`;
  
  const headers = {};
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here') {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  const response = await axios.get(url, { headers, responseType });
  return response.data;
}

// Enable JSON parsing
app.use(express.json());

// Serve frontend assets
app.use(express.static(path.join(__dirname, 'public')));


// API Endpoint to check configuration status
app.get('/api/config', (req, res) => {
  res.json({
    liveModeAvailable: isLiveModeConfigured()
  });
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

const fs = require('fs').promises;
const DB_PATH = path.join(__dirname, 'leads_db.json');

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
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

// Dynamic Asset Proxy from GitHub Templates Repository
app.get('/preview/:niche/*', async (req, res, next) => {
  const { niche } = req.params;
  const filePath = req.params[0]; // Wildcard matches relative assets
  
  if (!filePath || !filePath.includes('.')) {
    return next(); // Fall through to index.html lead preview route
  }
  
  try {
    const fileContent = await fetchFromGithub(`${niche}/${filePath}`, 'arraybuffer');
    
    // Set headers
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    else if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) res.setHeader('Content-Type', 'image/jpeg');
    else if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
    
    res.send(fileContent);
  } catch (err) {
    console.warn(`[GitHub Asset Load Fail] ${niche}/${filePath}:`, err.message);
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
    
    if (!lead) {
      return res.status(404).send('<h1>Lead Proposal Not Found</h1><p>Ensure the scan was run or the lead is saved in CRM.</p>');
    }
    
    // 2. Fetch index.html from GitHub
    let html;
    try {
      html = await fetchFromGithub(`${niche}/index.html`, 'utf8');
    } catch (githubErr) {
      console.error(`[GitHub Fetch Fail] ${niche}/index.html:`, githubErr.message);
      return res.status(404).send(`<h1>Template Not Found on GitHub</h1><p>Ensure the folder <strong>"${niche}"</strong> exists in your templates repository on GitHub and contains <strong>index.html</strong>.</p>`);
    }
    
    // 3. Replace placeholders
    const businessName = lead.name || 'Our Premium Business';
    const phone = (lead.phone && lead.phone !== 'N/A') ? lead.phone : 'Contact Us';
    const address = (lead.address && lead.address !== 'N/A') ? lead.address : 'Our Location';
    
    html = html.replace(/\{\{BUSINESS_NAME\}\}/g, businessName);
    html = html.replace(/\{\{PHONE\}\}/g, phone);
    html = html.replace(/\{\{ADDRESS\}\}/g, address);
    
    // 4. Inject Sticky Top Banner & Analytics heart-beat script
    const whatsappPhone = process.env.AGENCY_WHATSAPP_PHONE || '919999999999';
    const fiverrUrl = process.env.AGENCY_FIVERR_URL || 'https://www.fiverr.com';
    const waText = encodeURIComponent(`Hi! I am looking at the custom website proposal for my business, "${businessName}". I would like to request some custom modifications!`);
    const waLink = `https://wa.me/${whatsappPhone}?text=${waText}`;
    
    const bannerStyle = `
      <style>
        .ls-proposal-banner {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 55px !important;
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 0 25px !important;
          z-index: 2147483647 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
          color: #f8fafc !important;
          font-size: 14px !important;
          box-sizing: border-box !important;
        }
        .ls-proposal-banner * {
          box-sizing: border-box !important;
        }
        .ls-banner-title {
          font-weight: 600 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        .ls-banner-ctas {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .ls-banner-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 8px 14px !important;
          border-radius: 6px !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: transform 0.2s !important;
        }
        .ls-banner-btn:active {
          transform: scale(0.97) !important;
        }
        .ls-btn-fiv {
          background: #10b981 !important;
          color: #fff !important;
        }
        .ls-btn-fiv:hover { background: #059669 !important; }
        .ls-btn-wa {
          background: #25d366 !important;
          color: #fff !important;
        }
        .ls-btn-wa:hover { background: #20ba5a !important; }
        
        /* Offset page layout so sticky banner doesn't cover top links */
        body {
          padding-top: 55px !important;
        }
      </style>
    `;
    
    const bannerHtml = `
      <div class="ls-proposal-banner">
        <div class="ls-banner-title">
          <span>☕ Custom Website Concept for <strong>${businessName}</strong></span>
        </div>
        <div class="ls-banner-ctas">
          <a href="${fiverrUrl}" target="_blank" class="ls-banner-btn ls-btn-fiv" id="ls-fiverr-lnk">
            🟢 Secure Order on Fiverr
          </a>
          <a href="${waLink}" target="_blank" class="ls-banner-btn ls-btn-wa" id="ls-whatsapp-lnk">
            💬 Custom Modifications
          </a>
        </div>
      </div>
    `;
    
    const trackingScript = `
      <script>
        (function() {
          const leadId = ${JSON.stringify(leadId)};
          const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
          
          async function sendEvent(event, details = {}) {
            try {
              await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, event, details: { device, ...details } })
              });
            } catch (err) {}
          }
          
          // Send page load event immediately
          sendEvent('open');
          
          // Send click events
          document.getElementById('ls-fiverr-lnk').addEventListener('click', () => sendEvent('fiverr_click'));
          document.getElementById('ls-whatsapp-lnk').addEventListener('click', () => sendEvent('whatsapp_click'));
          
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
    
    // Inject script tag before body close
    html = html.replace('</body>', `${trackingScript}</body>`);
    
    res.send(html);
  } catch (err) {
    console.error('[Preview Load Error]', err);
    res.status(500).send('<h1>Error Loading Preview Template</h1><p>' + err.message + '</p>');
  }
});

// Analytics tracking logs receiver
app.post('/api/track', async (req, res) => {
  const { leadId, event, details } = req.body;
  if (!leadId) {
    return res.status(400).json({ error: 'Lead ID is required.' });
  }
  
  try {
    const db = await readDb();
    const leadIndex = db.leads.findIndex(l => l.id === leadId);
    let leadName = 'Unknown Lead';
    
    if (leadIndex !== -1) {
      leadName = db.leads[leadIndex].name;
    } else {
      const memLead = latestScannedLeads.find(l => l.id === leadId);
      if (memLead) leadName = memLead.name;
    }
    
    const timestamp = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString();
    
    // Log active visits in memory for activity feed
    activeVisits.unshift({
      leadId,
      name: leadName,
      event,
      details,
      timestamp,
      timeStr
    });
    if (activeVisits.length > 50) activeVisits.pop();
    
    console.log(`[Track Log] "${leadName}" triggered: ${event} ${JSON.stringify(details || {})}`);
    
    if (leadIndex !== -1) {
      const analytics = db.leads[leadIndex].analytics || {
        opened: 'No',
        timeSpent: 0,
        maxScroll: 0,
        fiverrClicked: 'No',
        whatsappClicked: 'No'
      };
      
      analytics.opened = 'Yes';
      
      if (event === 'heartbeat') {
        analytics.timeSpent += details.seconds || 0;
        if (details.scrollPercent > analytics.maxScroll) {
          analytics.maxScroll = details.scrollPercent;
        }
      } else if (event === 'fiverr_click') {
        analytics.fiverrClicked = 'Yes';
      } else if (event === 'whatsapp_click') {
        analytics.whatsappClicked = 'Yes';
      }
      
      let newLog = `[${timeStr}] `;
      if (event === 'open') {
        newLog += 'Opened Proposal Preview Link';
      } else if (event === 'heartbeat') {
        newLog += `Visited for ${analytics.timeSpent}s (Scrolled: ${analytics.maxScroll}%)`;
      } else if (event === 'fiverr_click') {
        newLog += 'Clicked Fiverr Checkout CTA';
      } else if (event === 'whatsapp_click') {
        newLog += 'Clicked WhatsApp Contact CTA';
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
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('[Tracking Server Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for dashboard activity feed long-polling
app.get('/api/active-visits', (req, res) => {
  res.json({ success: true, visits: activeVisits });
});


const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`        LOCAL BUSINESS LEAD SCANNER SERVER`);
  console.log(`====================================================`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(`Live mode configured: ${isLiveModeConfigured() ? 'Yes' : 'No (falling back to Mock Mode)'}`);
  console.log(`====================================================`);
});

// Set server timeout to 3 minutes (180,000 ms)
server.timeout = 180000;
