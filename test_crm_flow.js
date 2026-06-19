const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('==================================================');
  console.log('       LEADSCOPE INTEGRATION TEST SUITE           ');
  console.log('==================================================\n');

  try {
    // Step 1: Scan Leads
    console.log('[Step 1] Triggering scan (Mock mode)...');
    const scanRes = await axios.post(`${BASE_URL}/api/scan`, {
      niche: 'cafe',
      location: 'Paris',
      forceMock: true
    });
    
    if (!scanRes.data.success || !scanRes.data.leads.length) {
      throw new Error('Scan failed or returned no leads.');
    }
    const lead = scanRes.data.leads[0];
    console.log(`✓ Scan succeeded. Found lead: "${lead.name}" (ID: ${lead.id})\n`);

    // Step 2: Save to CRM
    console.log('[Step 2] Saving lead to CRM with custom portfolio link...');
    lead.portfolioLink = 'https://custom-bakery-theme.com';
    lead.niche = 'cafe';
    lead.location = 'Paris';

    const saveRes = await axios.post(`${BASE_URL}/api/crm`, { lead });
    if (!saveRes.data.success) {
      throw new Error('Save to CRM failed.');
    }
    const savedId = saveRes.data.lead.id;
    console.log(`✓ Saved to CRM. Registered ID: ${savedId}\n`);

    // Step 3: Send visitor tracking events
    console.log('[Step 3] Sending visitor "open" event ping...');
    const trackOpen = await axios.post(`${BASE_URL}/api/track`, {
      leadId: savedId,
      event: 'open',
      details: { device: 'desktop' }
    });
    if (!trackOpen.data.success) throw new Error('Tracking open event failed.');
    console.log('✓ Sent "open" event.');

    console.log('Sending visitor "heartbeat" event ping (scroll depth 60%)...');
    const trackHeartbeat = await axios.post(`${BASE_URL}/api/track`, {
      leadId: savedId,
      event: 'heartbeat',
      details: { device: 'desktop', seconds: 10, scrollPercent: 60 }
    });
    if (!trackHeartbeat.data.success) throw new Error('Tracking heartbeat failed.');
    console.log('✓ Sent "heartbeat" event.');

    console.log('Sending visitor "fiverr_click" event ping...');
    const trackFiverr = await axios.post(`${BASE_URL}/api/track`, {
      leadId: savedId,
      event: 'fiverr_click',
      details: { device: 'desktop' }
    });
    if (!trackFiverr.data.success) throw new Error('Tracking fiverr_click failed.');
    console.log('✓ Sent "fiverr_click" event.\n');

    // Step 4: Verify visitor log feed (Active Visits)
    console.log('[Step 4] Querying active visits feed...');
    const visitsRes = await axios.get(`${BASE_URL}/api/active-visits`);
    if (!visitsRes.data.success) throw new Error('Querying active-visits failed.');
    
    const logs = visitsRes.data.visits.filter(v => v.leadId === savedId);
    console.log(`✓ Active visits found: ${logs.length} events logged.`);
    logs.forEach(log => {
      console.log(`  - [${log.timeStr}] Event: "${log.event}" (Device: ${log.details.device}, Scroll: ${log.details.scrollPercent || 0}%)`);
    });
    console.log('');

    // Step 5: Verify CRM database changes
    console.log('[Step 5] Checking CRM database persistence and notes logs...');
    const crmRes = await axios.get(`${BASE_URL}/api/crm`);
    const crmLead = crmRes.data.leads.find(l => l.id === savedId);
    
    if (!crmLead) throw new Error('Lead not found in CRM database.');
    console.log('✓ Lead retrieved from database successfully.');
    console.log(`  - Notes:\n${crmLead.notes.split('\n').map(n => '      ' + n).join('\n')}`);
    console.log('  - Analytics:', JSON.stringify(crmLead.analytics, null, 2));
    console.log('');

    // Step 6: Delete test lead to keep DB clean
    console.log('[Step 6] Cleaning up test lead from CRM...');
    const deleteRes = await axios.delete(`${BASE_URL}/api/crm/${savedId}`);
    if (!deleteRes.data.success) throw new Error('Deleting lead failed.');
    console.log('✓ Lead cleaned up successfully.\n');

    console.log('==================================================');
    console.log('      ALL SYSTEM INTEGRATION TESTS PASSED!        ');
    console.log('==================================================');
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

runTests();
