#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { scanLocalLeads } = require('./scanner');

program
  .version('1.0.0')
  .description('Scan local businesses without websites and discover their social media details.')
  .requiredOption('-n, --niche <niche>', 'Business type (e.g. bakery, dentist, gym)')
  .requiredOption('-l, --location <location>', 'City or area (e.g. Paris, New York, Tokyo)')
  .option('-o, --output <output>', 'Path to save findings as CSV (e.g. leads.csv)')
  .option('-m, --mock', 'Force mock/demo mode (ignores environment variables)')
  .parse(process.argv);

const options = program.opts();

async function run() {
  const { niche, location, output, mock } = options;

  console.log('====================================================');
  console.log('         LOCAL BUSINESS LEAD SCANNER CLI');
  console.log('====================================================');
  console.log(`Niche:    ${niche}`);
  console.log(`Location: ${location}`);
  console.log('----------------------------------------------------');
  
  try {
    const leads = await scanLocalLeads(niche, location, mock);
    
    if (leads.length === 0) {
      console.log('\n[!] No businesses without websites were found.');
      return;
    }
    
    console.log(`\n[+] Found ${leads.length} business(es) without a website:\n`);
    
    leads.forEach((lead, index) => {
      console.log(`${index + 1}. \x1b[36m${lead.name}\x1b[0m`);
      console.log(`   Google Maps: ${lead.googleMapsUri}`);
      console.log(`   Address:     ${lead.address}`);
      console.log(`   Phone:       ${lead.phone}`);
      console.log(`   Facebook:    ${lead.facebook || 'N/A'}`);
      console.log(`   Instagram:   ${lead.instagram || 'N/A'}`);
      console.log(`   LinkedIn:    ${lead.linkedin || 'N/A'}`);
      console.log(`   WhatsApp:    ${lead.whatsapp || 'N/A'}`);
      console.log(`   Email:       ${lead.email || 'N/A'}`);
      console.log('----------------------------------------------------');
    });

    if (output) {
      const outputPath = path.resolve(output);
      
      // Build CSV content
      const headers = ['Name', 'Google Maps Link', 'Address', 'Phone', 'Facebook', 'Instagram', 'LinkedIn', 'WhatsApp', 'Email'];
      const rows = leads.map(lead => [
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.googleMapsUri.replace(/"/g, '""')}"`,
        `"${lead.address.replace(/"/g, '""')}"`,
        `"${lead.phone.replace(/"/g, '""')}"`,
        `"${(lead.facebook || '').replace(/"/g, '""')}"`,
        `"${(lead.instagram || '').replace(/"/g, '""')}"`,
        `"${(lead.linkedin || '').replace(/"/g, '""')}"`,
        `"${(lead.whatsapp || '').replace(/"/g, '""')}"`,
        `"${(lead.email || '').replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      fs.writeFileSync(outputPath, csvContent, 'utf-8');
      console.log(`\x1b[32m[✓] Success! Exported ${leads.length} leads to: ${outputPath}\x1b[0m\n`);
    }
    
  } catch (error) {
    console.error('\n\x1b[31m[!] Scanner failed during execution:\x1b[0m', error.message);
    process.exit(1);
  }
}

run();
