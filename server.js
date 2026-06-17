const express = require('express');
const path = require('path');
const { scanLocalLeads, isLiveModeConfigured } = require('./scanner');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
