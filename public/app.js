document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const scanForm = document.getElementById('scanForm');
  const nicheInput = document.getElementById('nicheInput');
  const locationInput = document.getElementById('locationInput');
  const mockModeToggle = document.getElementById('mockModeToggle');
  const btnSearch = document.getElementById('btnSearch');
  const searchSpinner = document.getElementById('searchSpinner');
  const searchText = document.getElementById('searchText');
  const statusBadgeContainer = document.getElementById('statusBadgeContainer');
  
  const loadingPanel = document.getElementById('loadingPanel');
  const emptyState = document.getElementById('emptyState');
  const statsGrid = document.getElementById('statsGrid');
  const resultsCard = document.getElementById('resultsCard');
  
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  
  const statTotalLeads = document.getElementById('statTotalLeads');
  const statSocialChannels = document.getElementById('statSocialChannels');
  const statWhatsApp = document.getElementById('statWhatsApp');
  
  const leadsTableBody = document.getElementById('leadsTableBody');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnExportJSON = document.getElementById('btnExportJSON');
  
  // CRM Selectors
  const crmCard = document.getElementById('crmCard');
  const crmTableBody = document.getElementById('crmTableBody');
  const crmFilterStatus = document.getElementById('crmFilterStatus');
  
  let currentLeads = [];
  let isLiveMode = false;
  let crmLeads = [];
  let githubTemplates = [];

  async function loadGithubTemplates() {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      if (data.success && data.templates) {
        githubTemplates = data.templates;
      }
    } catch (error) {
      console.warn('Failed to load GitHub templates:', error);
      githubTemplates = ['cafe', 'gym', 'bakery', 'dentist', 'plumber'];
    }
  }

  // Initialize and check configuration mode
  async function checkServerConfig() {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      isLiveMode = data.liveModeAvailable;
      updateStatusBadge();
      
      if (!isLiveMode) {
        mockModeToggle.checked = true;
        // Keep it checked and add a custom styling class if desired
      }
    } catch (error) {
      console.error('Failed to retrieve server configuration:', error);
      statusBadgeContainer.innerHTML = `
        <span class="badge badge-demo">
          <i class="fa-solid fa-triangle-exclamation"></i> API connection error
        </span>
      `;
    }
  }

  function updateStatusBadge() {
    if (isLiveMode) {
      statusBadgeContainer.innerHTML = `
        <span class="badge badge-live">
          <i class="fa-solid fa-circle"></i> Live Search Ready
        </span>
      `;
    } else {
      statusBadgeContainer.innerHTML = `
        <span class="badge badge-demo">
          <i class="fa-solid fa-circle"></i> Demo Mode Active
        </span>
      `;
    }
  }

  // Animate the loading phase step-by-step
  function startLoadingAnimation() {
    // Reset steps
    step1.className = 'step-item step-active';
    step1.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Connecting to Google Places API...';
    
    step2.className = 'step-item';
    step2.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Filtering out businesses with active websites...';
    
    step3.className = 'step-item';
    step3.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Resolving search engine queries for social channels...';
    
    // Animate Step 1 -> Step 2
    setTimeout(() => {
      if (loadingPanel.style.display === 'flex') {
        step1.className = 'step-item step-done';
        step1.innerHTML = '<i class="fa-solid fa-circle-check"></i> Google Places API query completed.';
        
        step2.className = 'step-item step-active';
        step2.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Filtering out businesses with active websites...';
      }
    }, 1200);

    // Animate Step 2 -> Step 3
    setTimeout(() => {
      if (loadingPanel.style.display === 'flex') {
        step2.className = 'step-item step-done';
        step2.innerHTML = '<i class="fa-solid fa-circle-check"></i> Discarded places with registered websites.';
        
        step3.className = 'step-item step-active';
        step3.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Resolving search engine queries for social channels...';
      }
    }, 2400);
  }

  // Handle Form Submission
  scanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const niche = nicheInput.value.trim();
    const location = locationInput.value.trim();
    const forceMock = mockModeToggle.checked;
    
    if (!niche || !location) return;
    
    // UI Transitions
    emptyState.style.display = 'none';
    statsGrid.style.display = 'none';
    resultsCard.style.display = 'none';
    loadingPanel.style.display = 'flex';
    
    btnSearch.disabled = true;
    searchSpinner.style.display = 'inline-block';
    searchText.textContent = 'Scanning...';
    
    startLoadingAnimation();
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ niche, location, forceMock })
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentLeads = data.leads;
        renderResults();
      } else {
        alert('Scanner Error: ' + (data.error || 'Unknown failure'));
        emptyState.style.display = 'flex';
      }
      
    } catch (error) {
      console.error(error);
      alert('An unexpected network error occurred.');
      emptyState.style.display = 'flex';
    } finally {
      loadingPanel.style.display = 'none';
      btnSearch.disabled = false;
      searchSpinner.style.display = 'none';
      searchText.innerHTML = '<i class="fa-solid fa-radar"></i> Start Scan';
    }
  });

  // Render scan results
  function renderResults() {
    leadsTableBody.innerHTML = '';
    
    if (currentLeads.length === 0) {
      emptyState.innerHTML = `
        <div class="empty-state-logo">
          <i class="fa-solid fa-circle-info"></i>
        </div>
        <h3>No Leads Found</h3>
        <p>We couldn't find any local businesses without websites matching your query. Try searching in another region or niche.</p>
      `;
      emptyState.style.display = 'flex';
      return;
    }
    
    // Calculate Stats
    let socialCount = 0;
    let whatsappCount = 0;
    
    currentLeads.forEach((lead, index) => {
      let hasSocial = false;
      if (lead.facebook) { hasSocial = true; }
      if (lead.instagram) { hasSocial = true; }
      if (lead.linkedin) { hasSocial = true; }
      if (lead.tiktok) { hasSocial = true; }
      if (lead.whatsapp) { whatsappCount++; hasSocial = true; }
      if (hasSocial) { socialCount++; }
      
      // Check if lead is already saved in CRM
      const isSaved = crmLeads.some(l => l.name === lead.name && l.phone === lead.phone && l.phone !== 'N/A');
      const crmButtonHtml = isSaved 
        ? `<a href="#" class="social-pill crm-save saved" data-lead-index="${index}" title="Saved to CRM"><i class="fa-solid fa-folder-minus"></i></a>`
        : `<a href="#" class="social-pill crm-save" data-lead-index="${index}" title="Save to CRM"><i class="fa-solid fa-folder-plus"></i></a>`;

      // Populate row
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>
          <div class="biz-name">
            <a href="${lead.googleMapsUri}" target="_blank" style="color: var(--color-cyan); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;" title="View on Google Maps">
              ${escapeHtml(lead.name)} <i class="fa-solid fa-up-right-from-square" style="font-size: 0.75rem;"></i>
            </a>
          </div>
          <div class="biz-meta">ID: ${escapeHtml(lead.id || 'N/A')}</div>
        </td>
        <td>
          <div class="contact-item">
            <i class="fa-solid fa-phone"></i>
            <span>${escapeHtml(lead.phone || 'No phone number')}</span>
          </div>
          <div class="contact-item" style="margin-top: 0.25rem;">
            <i class="fa-solid fa-location-dot"></i>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(lead.address || 'No address')}</span>
          </div>
        </td>
        <td>
          <div class="social-pill-container">
            ${crmButtonHtml}
            <a href="#" class="social-pill pitch-gen" data-lead-index="${index}" title="Generate Outreach Pitch">
              <i class="fa-solid fa-paper-plane"></i>
            </a>
            <a href="${lead.facebook || '#'}" target="_blank" class="social-pill fb ${lead.facebook ? '' : 'inactive'}" title="Facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="${lead.instagram || '#'}" target="_blank" class="social-pill ig ${lead.instagram ? '' : 'inactive'}" title="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="${lead.linkedin || '#'}" target="_blank" class="social-pill in ${lead.linkedin ? '' : 'inactive'}" title="LinkedIn">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="${lead.tiktok || '#'}" target="_blank" class="social-pill tt ${lead.tiktok ? '' : 'inactive'}" title="TikTok">
              <i class="fa-brands fa-tiktok"></i>
            </a>
            <a href="${lead.whatsapp || '#'}" target="_blank" class="social-pill wa ${lead.whatsapp ? '' : 'inactive'}" title="WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="${lead.email ? 'mailto:' + lead.email : '#'}" target="_blank" class="social-pill mail ${lead.email ? '' : 'inactive'}" title="Email: ${lead.email || 'None'}">
              <i class="fa-solid fa-envelope"></i>
            </a>
          </div>
          <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 0.7rem; color: var(--text-secondary); white-space: nowrap;">Portfolio:</span>
            ${buildTemplateSelectorHtml(lead, false, index)}
          </div>
        </td>
      `;
      leadsTableBody.appendChild(tr);
    });
    
    // Update Stats Display
    statTotalLeads.textContent = currentLeads.length;
    statSocialChannels.textContent = socialCount;
    statWhatsApp.textContent = whatsappCount;
    
    statsGrid.style.display = 'grid';
    resultsCard.style.display = 'block';
  }

  // Export CSV Action
  btnExportCSV.addEventListener('click', () => {
    if (currentLeads.length === 0) return;
    
    const headers = ['Name', 'Google Maps Link', 'Address', 'Phone', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'WhatsApp', 'Email'];
    const rows = currentLeads.map(lead => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.googleMapsUri.replace(/"/g, '""')}"`,
      `"${(lead.address || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.facebook || '').replace(/"/g, '""')}"`,
      `"${(lead.instagram || '').replace(/"/g, '""')}"`,
      `"${(lead.linkedin || '').replace(/"/g, '""')}"`,
      `"${(lead.tiktok || '').replace(/"/g, '""')}"`,
      `"${(lead.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(lead.email || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${nicheInput.value}_${locationInput.value}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Export JSON Action
  btnExportJSON.addEventListener('click', () => {
    if (currentLeads.length === 0) return;
    
    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentLeads, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `leads_${nicheInput.value}_${locationInput.value}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Helper utility to escape HTML inputs
  function escapeHtml(string) {
    if (!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Helper to build template selector dropdown HTML
  function buildTemplateSelectorHtml(lead, isCrm = false, indexOrId = '') {
    const currentVal = lead.portfolioLink || '';
    const isCustomLink = currentVal.startsWith('http://') || currentVal.startsWith('https://');
    const selectedTemplate = (!isCustomLink && currentVal) ? currentVal : '';
    
    const optionsHtml = githubTemplates.map(t => 
      `<option value="${t}" ${selectedTemplate === t ? 'selected' : ''}>Template: ${t}</option>`
    ).join('');

    const dropdownClass = isCrm ? 'crm-template-select' : 'scan-template-select';
    const inputClass = isCrm ? 'crm-portfolio-link-input' : 'scan-portfolio-input';
    const dataAttr = isCrm ? `data-id="${indexOrId}"` : `data-lead-index="${indexOrId}"`;
    
    return `
      <div class="template-selector-container" style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 4px;">
        <select class="crm-portfolio-input ${dropdownClass}" ${dataAttr} style="font-size: 11px; padding: 4px 6px; cursor: pointer;">
          <option value="" ${!currentVal ? 'selected' : ''}>-- Use Dynamic Match --</option>
          ${optionsHtml}
          <option value="custom" ${isCustomLink ? 'selected' : ''}>-- Custom Link... --</option>
        </select>
        <input type="text" class="crm-portfolio-input ${inputClass}" ${dataAttr} placeholder="Paste custom portfolio/template link" value="${isCustomLink ? escapeHtml(currentVal) : ''}" style="display: ${isCustomLink ? 'block' : 'none'}; font-size: 11px; padding: 4px 6px;">
      </div>
    `;
  }

    // Modal Elements & Event Listeners
    const pitchModal = document.getElementById('pitchModal');
    const modalBizName = document.getElementById('modalBizName');
    const modalBizMeta = document.getElementById('modalBizMeta');
    const btnMinClose = document.getElementById('btnMinClose');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const pitchAngleSelect = document.getElementById('pitchAngleSelect');
    
    const modalTabs = document.querySelectorAll('.modal-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    let activeTabId = 'instagram';
    let activeLead = null;

    // Event delegation on table body for dynamic pitch trigger clicks
    leadsTableBody.addEventListener('click', async (e) => {
      const trigger = e.target.closest('.social-pill.pitch-gen');
      if (trigger) {
        e.preventDefault();
        const index = parseInt(trigger.getAttribute('data-lead-index'), 10);
        const lead = currentLeads[index];
        if (lead) {
          showPitchModal(lead);
        }
      }
      
      const saveBtn = e.target.closest('.social-pill.crm-save');
      if (saveBtn) {
        e.preventDefault();
        const index = parseInt(saveBtn.getAttribute('data-lead-index'), 10);
        const lead = currentLeads[index];
        if (lead) {
          if (saveBtn.classList.contains('saved')) {
            alert(`"${lead.name}" is already saved in your CRM Tracker below.`);
            return;
          }
          saveBtn.classList.add('saved');
          saveBtn.innerHTML = '<i class="fa-solid fa-folder-minus"></i>';
          saveBtn.title = 'Saved to CRM';
          
          // Enrich lead with search parameters
          lead.niche = nicheInput.value.trim() || 'business';
          lead.location = locationInput.value.trim() || 'your area';
          
          await saveLeadToCrm(lead);
        }
      }
    });

    // Handle scan table template dropdown change
    leadsTableBody.addEventListener('change', (e) => {
      const select = e.target.closest('.scan-template-select');
      if (select) {
        const index = parseInt(select.getAttribute('data-lead-index'), 10);
        const lead = currentLeads[index];
        if (lead) {
          const val = select.value;
          const container = select.closest('.template-selector-container');
          const input = container.querySelector('.scan-portfolio-input');
          
          if (val === 'custom') {
            input.style.display = 'block';
            lead.portfolioLink = input.value.trim();
          } else {
            input.style.display = 'none';
            lead.portfolioLink = val;
          }
        }
      }
    });

    // Handle scan table portfolio text inputs
    leadsTableBody.addEventListener('input', (e) => {
      const input = e.target.closest('.scan-portfolio-input');
      if (input) {
        const index = parseInt(input.getAttribute('data-lead-index'), 10);
        if (currentLeads[index]) {
          currentLeads[index].portfolioLink = input.value.trim();
        }
      }
    });

    // Close Modal actions
    const closeModal = () => {
      pitchModal.classList.remove('active');
    };
    btnMinClose.addEventListener('click', closeModal);
    btnCloseModal.addEventListener('click', closeModal);
    pitchModal.addEventListener('click', (e) => {
      if (e.target === pitchModal) closeModal();
    });

    // Tab Switcher logic
    modalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        activeTabId = targetTab;
        
        // Toggle tab highlights
        modalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Toggle tab texts display
        tabContents.forEach(tc => tc.classList.remove('active'));
        document.getElementById(`tabContent_${targetTab}`).classList.add('active');
      });
    });

    // Copy to Clipboard logic for multiple buttons
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const targetTab = btn.getAttribute('data-target');
        const textarea = document.getElementById(`scriptText_${targetTab}`);
        if (!textarea || !textarea.value) return;
        
        let textToCopy = textarea.value;
        // If there's a warning badge in the textarea, extract the actual draft body
        if (textToCopy.startsWith('[⚠️')) {
          const draftIndex = textToCopy.indexOf('Draft:\n');
          if (draftIndex !== -1) {
            textToCopy = textToCopy.substring(draftIndex + 7);
          }
        }
        
        try {
          await navigator.clipboard.writeText(textToCopy);
          
          // Visual Copy Feedback
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Copied! ✓';
          btn.style.background = 'linear-gradient(135deg, #00d9f5 0%, #00f5a0 100%)';
          btn.style.color = '#07080d';
          
          setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy text:', err);
          alert('Could not copy automatically. Please select the text and copy manually.');
        }
      });
    });

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
        console.error('Failed to parse Instagram URL:', e);
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
        console.error('Failed to parse Facebook URL:', e);
      }
      return null;
    }

    // Update pitches when outreach angle changes
    pitchAngleSelect.addEventListener('change', () => {
      if (activeLead) {
        generateAndRenderPitch(activeLead, pitchAngleSelect.value);
      }
    });

    // Build and display customized cold pitches
    function showPitchModal(lead) {
      activeLead = lead;
      pitchAngleSelect.value = 'mockup'; // Default to mockup template
      generateAndRenderPitch(lead, 'mockup');
      
      // Reset active tab to default (Instagram) on modal open
      activeTabId = 'instagram';
      modalTabs.forEach(t => t.classList.remove('active'));
      modalTabs[0].classList.add('active');
      tabContents.forEach(tc => tc.classList.remove('active'));
      tabContents[0].classList.add('active');
      
      // Open overlay
      pitchModal.classList.add('active');
    }

    function generateAndRenderPitch(lead, angle) {
      const niche = lead.niche || nicheInput.value.trim() || 'business';
      const city = lead.location || locationInput.value.trim() || 'your area';
      
      modalBizName.textContent = lead.name;
      modalBizMeta.textContent = `${niche.toUpperCase()} — ${city.toUpperCase()}`;
      
      // Determine what proposal link to pitch
      let pitchLink = '';
      if (lead.portfolioLink) {
        pitchLink = lead.portfolioLink;
      } else {
        // Fallback to the dynamic preview route on this local server / ngrok tunnel!
        const baseUrl = window.location.origin;
        const cleanNiche = niche.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
        pitchLink = `${baseUrl}/preview/${cleanNiche}/${lead.id}`;
      }
      
      // Add custom hooks based on CRM Audit checklist choices
      let customHook = '';
      if (lead.auditNoWeb) {
        customHook += ` I noticed your business doesn't have an active website online yet.`;
      }
      if (lead.auditNoEmail) {
        customHook += ` I noticed you don't have a contact email address listed for customer inquiries.`;
      }
      if (lead.auditNoIgLink) {
        customHook += ` I noticed your Instagram profile is missing a website link in your bio.`;
      }
      
      let igScript = '';
      let whatsappScript = '';
      let emailScript = '';
      
      if (angle === 'mockup') {
        igScript = `Hey ${lead.name}! Love your profile page. 📸 I noticed you have amazing reviews here in ${city} but don't have a website listed on your profile.${customHook} I actually designed a quick, modern 1-page website mockup for you: ${pitchLink}`;
        whatsappScript = `Hi ${lead.name}! 👋 Saw your business on Google Maps in ${city} and noticed you have a great local rating but no website yet.${customHook}\n\nI'm a local web designer and built a quick demo layout showing how you could take bookings. Check it out here: ${pitchLink} 😊`;
        emailScript = `Subject: Quick website mockup for ${lead.name} in ${city}\n\nHi ${lead.name} Team,\n\nI was researching local ${niche} services in ${city} and came across your business. Your ratings are fantastic, but I noticed you don't have an active website yet.${customHook}\n\nI went ahead and created a modern landing page draft for you to review:\n${pitchLink}\n\nI'd love to get your feedback.\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'reviews') {
        igScript = `Hey ${lead.name}! 🌟 I saw you guys have stellar reviews on Google Maps here in ${city}.${customHook} I noticed there's no website listed on your profile to help turn that traffic into bookings. I put together a quick design to show your customer reviews: ${pitchLink}`;
        whatsappScript = `Hi ${lead.name}! 👋 Congrats on the great Google reviews in ${city}.${customHook} Since you guys are doing so well on Maps but don't have a website link listed, I created a mobile template to display your reviews: ${pitchLink}`;
        emailScript = `Subject: Displaying Google Reviews on a custom site for ${lead.name}\n\nHi ${lead.name} Team,\n\nI came across your business on Google Maps in ${city} and was blown away by your reviews. You guys are clearly delivering awesome service!\n\nHowever, I noticed that you don't have a website link listed on your Google business profile.${customHook}\n\nI put together a quick demo website showing how you can display your great reviews: ${pitchLink}\n\nWould you be open to a quick look?\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'competitor') {
        igScript = `Hey ${lead.name}! I was looking up ${niche} services in ${city} and noticed other local spots are capturing bookings online with websites. I created a mobile-friendly site mockup specifically for you guys: ${pitchLink}`;
        whatsappScript = `Hi ${lead.name}! Saw your maps listing in ${city}. I noticed some other local ${niche} businesses are ranking high because of their websites, but you guys have better reviews! I drafted a quick 1-page site mockup to help you stand out: ${pitchLink}`;
        emailScript = `Subject: Website mockup to help ${lead.name} beat local competitors in ${city}\n\nHi ${lead.name} Team,\n\nI was reviewing local search rankings for ${niche} businesses in ${city}. Your reviews are top-tier, but you are currently losing out on Google search traffic because competitors have websites and you don't.${customHook}\n\nI went ahead and drafted a high-converting landing page specifically tailored for your brand to help you stand out. Here is the link:\n${pitchLink}\n\nWould you be open to checking out the mockup? It takes 10 seconds to look at.\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'seo') {
        igScript = `Hey ${lead.name}! 🔍 Did you know that when locals search Google for "${niche} in ${city}", Google prioritizes website links? I created a fast-loading mobile-friendly site template to help you rank higher: ${pitchLink}`;
        whatsappScript = `Hi ${lead.name}! 👋 I was checking local SEO listings in ${city} and noticed you guys have amazing reviews but no website. Google ranks businesses with websites much higher. I put together a mobile-optimized demo site to show how: ${pitchLink}`;
        emailScript = `Subject: Google search traffic opportunity for ${lead.name} in ${city}\n\nHi ${lead.name} Team,\n\nI was analyzing Google search volume for "${niche} in ${city}" and noticed there are hundreds of searches monthly.\n\nSince your Google Maps listing doesn't have an active website link, you are missing out on this search traffic.${customHook}\n\nI created a fast-loading, mobile-friendly landing page mockup for you to show how we can capture this local search traffic. Would you be open to reviewing the draft?\n${pitchLink}\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'audit') {
        igScript = `Hey ${lead.name}! Love your page. 📸 I recorded a quick 45-second screen recording showing 3 minor tweaks you can make to your Google business listing (including adding this simple website booking link: ${pitchLink}). Mind if I drop the link to the video here?`;
        whatsappScript = `Hi ${lead.name}! 👋 I recorded a short 45-second video overview showing how you guys can get more direct mobile bookings in ${city} without spending money on ads. You can see the mockup link: ${pitchLink} here. Do you mind if I share the video link? 😊`;
        emailScript = `Subject: 45-second video audit for ${lead.name}\n\nHi ${lead.name} Team,\n\nI recorded a short 45-second screen recording showing 3 simple improvements you can make to your Google listing in ${city}. One of the recommendations is adding a fast mobile booking page (I've included a free mockup in the video).\n\nYou can view the demo concept here:\n${pitchLink}\n\nWould it be okay if I sent over the quick video link?\n\nBest regards,\n[Your Name]`;
      }
      
      // Assign scripts
      document.getElementById('scriptText_instagram').value = igScript;
      
      // WhatsApp dynamic warning
      const waTextarea = document.getElementById('scriptText_whatsapp');
      if (lead.phone && lead.phone !== 'N/A') {
        waTextarea.value = whatsappScript;
      } else {
        waTextarea.value = `[⚠️ WhatsApp phone number unavailable for this lead]\n\nDraft:\n${whatsappScript}`;
      }
      
      // Email dynamic warning
      const emailTextarea = document.getElementById('scriptText_email');
      if (lead.email) {
        emailTextarea.value = emailScript;
      } else {
        emailTextarea.value = `[⚠️ Email address not found. Recommended to contact via Instagram DM or WhatsApp instead]\n\nDraft:\n${emailScript}`;
      }

      // Helper to update launcher links on-the-fly
      function updateLaunchers() {
        // 1. Instagram / FB DM Launcher
        const btnLaunchInstagram = document.getElementById('btnLaunchInstagram');
        if (lead.instagram) {
          const username = getInstagramUsername(lead.instagram);
          if (username) {
            btnLaunchInstagram.href = `https://ig.me/m/${username}`;
          } else {
            btnLaunchInstagram.href = lead.instagram;
          }
          btnLaunchInstagram.innerHTML = '<i class="fa-brands fa-instagram"></i> Open Instagram DM';
          btnLaunchInstagram.classList.remove('disabled');
        } else if (lead.facebook) {
          const fbUser = getFacebookUsername(lead.facebook);
          if (fbUser) {
            btnLaunchInstagram.href = `https://m.me/${fbUser}`;
          } else {
            btnLaunchInstagram.href = lead.facebook;
          }
          btnLaunchInstagram.innerHTML = '<i class="fa-brands fa-facebook-messenger"></i> Open Facebook DM';
          btnLaunchInstagram.classList.remove('disabled');
        } else {
          btnLaunchInstagram.removeAttribute('href');
          btnLaunchInstagram.innerHTML = '<i class="fa-brands fa-instagram"></i> Open DM (None)';
          btnLaunchInstagram.classList.add('disabled');
        }

        // 2. WhatsApp Launcher
        const btnLaunchWhatsApp = document.getElementById('btnLaunchWhatsApp');
        if (lead.phone && lead.phone !== 'N/A') {
          const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
          btnLaunchWhatsApp.href = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(waTextarea.value)}`;
          btnLaunchWhatsApp.classList.remove('disabled');
        } else {
          btnLaunchWhatsApp.removeAttribute('href');
          btnLaunchWhatsApp.classList.add('disabled');
        }

        // 3. Email Launcher
        const btnLaunchEmail = document.getElementById('btnLaunchEmail');
        if (lead.email) {
          let emailSubject = `Quick website mockup for ${lead.name}`;
          let emailBody = emailTextarea.value;
          
          if (emailTextarea.value.startsWith('Subject:')) {
            const subjectMatch = emailTextarea.value.match(/^Subject:\s*(.*?)\n+(.*)$/s);
            if (subjectMatch) {
              emailSubject = subjectMatch[1];
              emailBody = subjectMatch[2];
            }
          }
          
          btnLaunchEmail.href = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          btnLaunchEmail.classList.remove('disabled');
        } else {
          btnLaunchEmail.removeAttribute('href');
          btnLaunchEmail.classList.add('disabled');
        }
      }

      // Initial launcher bindings
      updateLaunchers();

      // Bind input events to textareas for live launcher updates
      waTextarea.oninput = updateLaunchers;
      emailTextarea.oninput = updateLaunchers;
    }

    // --- Outreach CRM Client-Side Handlers ---

    // Fetch CRM leads on load
    async function loadCrmLeads() {
      try {
        const response = await fetch('/api/crm');
        const data = await response.json();
        if (data.success) {
          crmLeads = data.leads;
          renderCrm();
          updateTodayAgenda();
          updateDashboardStats();
        }
      } catch (error) {
        console.error('Failed to load CRM leads:', error);
      }
    }

    // Save lead to CRM API call
    async function saveLeadToCrm(lead) {
      try {
        const response = await fetch('/api/crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead })
        });
        const data = await response.json();
        if (data.success) {
          await loadCrmLeads();
        }
      } catch (error) {
        console.error('Error saving lead to CRM:', error);
      }
    }

    // Update CRM lead fields dynamically
    async function updateCrmField(id, fieldUpdates) {
      try {
        const leadToUpdate = crmLeads.find(l => l.id === id);
        if (!leadToUpdate) return;
        
        // Optimistically update locally
        Object.assign(leadToUpdate, fieldUpdates);
        
        const response = await fetch('/api/crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead: leadToUpdate })
        });
        const data = await response.json();
        if (data.success) {
          const index = crmLeads.findIndex(l => l.id === id);
          if (index !== -1) {
            crmLeads[index] = data.lead;
            
            // If the followUpDate was modified, update Today's Agenda alert
            if ('followUpDate' in fieldUpdates) {
              updateTodayAgenda();
            }
            
            // Recalculate stats
            updateDashboardStats();
          }
        }
      } catch (error) {
        console.error('Error updating CRM field:', error);
      }
    }

    // Update Today's Agenda Follow-up Alert
    function updateTodayAgenda() {
      const localDate = new Date();
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      const todaysLeads = crmLeads.filter(lead => lead.followUpDate === todayStr);
      const agendaAlert = document.getElementById('crmAgendaAlert');
      const agendaText = document.getElementById('crmAgendaText');
      
      if (todaysLeads.length > 0) {
        const names = todaysLeads.map(l => `<strong>${escapeHtml(l.name)}</strong>`).join(', ');
        agendaText.innerHTML = `Today's Outreach Agenda: You have ${todaysLeads.length} follow-up${todaysLeads.length > 1 ? 's' : ''} scheduled for today: ${names}. Let's get pitching!`;
        agendaAlert.style.display = 'flex';
      } else {
        agendaAlert.style.display = 'none';
      }
    }

    // Update Dashboard Metrics Overview
    function updateDashboardStats() {
      const totalLeadsEl = document.getElementById('statCrmTotalLeads');
      const closedLeadsEl = document.getElementById('statCrmClosedLeads');
      
      if (totalLeadsEl) totalLeadsEl.textContent = crmLeads.length;
      if (closedLeadsEl) closedLeadsEl.textContent = crmLeads.filter(l => l.status === 'closed').length;
    }

    // Delete CRM lead
    async function deleteCrmLead(id) {
      if (!confirm('Are you sure you want to remove this lead from the CRM?')) return;
      try {
        const response = await fetch(`/api/crm/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          crmLeads = crmLeads.filter(l => l.id !== id);
          renderCrm();
          // Also refresh the results table to update folder buttons
          renderResults();
        }
      } catch (error) {
        console.error('Error deleting lead from CRM:', error);
      }
    }

    // Render CRM pipeline list
    // Render CRM pipeline list
    function renderCrm() {
      crmTableBody.innerHTML = '';
      
      const filter = crmFilterStatus.value;
      const filteredLeads = crmLeads.filter(lead => {
        if (filter === 'all') return true;
        return lead.status === filter;
      });
      
      if (filteredLeads.length === 0) {
        crmTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
              No leads in this status category. Click the folder icon on scanned results to add them!
            </td>
          </tr>
        `;
        return;
      }
      
      filteredLeads.forEach(lead => {
        const tr = document.createElement('tr');
        
        // Status formatting class
        const statusClass = `status-${lead.status || 'new'}`;
        
        // Generate option values
        const statuses = [
          { val: 'new', label: 'New Lead' },
          { val: 'pitched_ig', label: 'Pitched (IG/FB/TikTok)' },
          { val: 'pitched_wa', label: 'Pitched (WhatsApp)' },
          { val: 'pitched_email', label: 'Pitched (Email)' },
          { val: 'interested', label: 'Interested' },
          { val: 'closed', label: 'Closed Client' }
        ];
        
        const optionsHtml = statuses.map(s => 
          `<option value="${s.val}" ${lead.status === s.val ? 'selected' : ''}>${s.label}</option>`
        ).join('');

        // Social links list
        const fbHtml = lead.facebook ? `<a href="${lead.facebook}" target="_blank" class="social-pill fb" style="font-size:0.75rem;"><i class="fa-brands fa-facebook-f"></i></a>` : '';
        const igHtml = lead.instagram ? `<a href="${lead.instagram}" target="_blank" class="social-pill ig" style="font-size:0.75rem;"><i class="fa-brands fa-instagram"></i></a>` : '';
        const inHtml = lead.linkedin ? `<a href="${lead.linkedin}" target="_blank" class="social-pill in" style="font-size:0.75rem;"><i class="fa-brands fa-linkedin-in"></i></a>` : '';
        const ttHtml = lead.tiktok ? `<a href="${lead.tiktok}" target="_blank" class="social-pill tt" style="font-size:0.75rem;"><i class="fa-brands fa-tiktok"></i></a>` : '';
        const waHtml = lead.whatsapp ? `<a href="${lead.whatsapp}" target="_blank" class="social-pill wa" style="font-size:0.75rem;"><i class="fa-brands fa-whatsapp"></i></a>` : '';
        const mailHtml = lead.email ? `<a href="mailto:${lead.email}" target="_blank" class="social-pill mail" style="font-size:0.75rem;"><i class="fa-solid fa-envelope"></i></a>` : '';

        // Generate proposal and custom portfolio links
        const cleanNiche = (lead.niche || 'cafe').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
        const proposalUrl = lead.portfolioLink || `${window.location.origin}/preview/${cleanNiche}/${lead.id}`;
        
        const proposalLinkHtml = `
          <div style="margin-top: 0.35rem; display: flex; flex-direction: column; gap: 4px;">
            <a href="${proposalUrl}" target="_blank" style="font-size: 0.75rem; color: var(--color-cyan); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;" title="Preview proposal page">
              <i class="fa-solid fa-link"></i> Proposal Link <i class="fa-solid fa-up-right-from-square" style="font-size:0.6rem;"></i>
            </a>
            ${buildTemplateSelectorHtml(lead, true, lead.id)}
          </div>
        `;

        const checklistHtml = `
          <div class="crm-checklist">
            <label class="crm-checklist-item">
              <input type="checkbox" class="crm-audit-checkbox" data-id="${lead.id}" data-field="auditNoWeb" ${lead.auditNoWeb ? 'checked' : ''}>
              <span>No Web</span>
            </label>
            <label class="crm-checklist-item">
              <input type="checkbox" class="crm-audit-checkbox" data-id="${lead.id}" data-field="auditNoEmail" ${lead.auditNoEmail ? 'checked' : ''}>
              <span>No Email</span>
            </label>
            <label class="crm-checklist-item">
              <input type="checkbox" class="crm-audit-checkbox" data-id="${lead.id}" data-field="auditNoIgLink" ${lead.auditNoIgLink ? 'checked' : ''}>
              <span>No IG Link</span>
            </label>
          </div>
        `;

        const datepickerHtml = `
          <input type="date" class="crm-datepicker crm-followup-date-input" data-id="${lead.id}" value="${lead.followUpDate || ''}">
        `;

        const statusNotesHtml = `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <select class="crm-status-select ${statusClass}" data-id="${lead.id}">
              ${optionsHtml}
            </select>
            <textarea class="crm-notes-textarea" data-id="${lead.id}" placeholder="Type conversation logs or notes here...">${escapeHtml(lead.notes || '')}</textarea>
          </div>
        `;

        tr.innerHTML = `
          <td>
            <div class="biz-name">
              <a href="${lead.googleMapsUri}" target="_blank" style="color: var(--color-purple); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;" title="View on Google Maps">
                ${escapeHtml(lead.name)} <i class="fa-solid fa-up-right-from-square" style="font-size: 0.75rem;"></i>
              </a>
            </div>
            <div class="biz-meta">${escapeHtml(lead.address || 'No address')}</div>
          </td>
          <td>
            <div style="font-size: 0.85rem; color: var(--text-primary);"><i class="fa-solid fa-phone" style="font-size:0.75rem; margin-right:4px;"></i> ${escapeHtml(lead.phone || 'N/A')}</div>
            <div class="social-pill-container" style="margin-top: 0.35rem; gap: 0.25rem;">
              <a href="#" class="social-pill crm-pitch-gen" data-id="${lead.id}" title="Generate Outreach Pitch" style="background: rgba(186, 36, 239, 0.15); color: var(--color-magenta); border-color: var(--color-magenta); font-size: 0.75rem;">
                <i class="fa-solid fa-paper-plane"></i>
              </a>
              ${fbHtml} ${igHtml} ${inHtml} ${ttHtml} ${waHtml} ${mailHtml}
            </div>
            ${proposalLinkHtml}
          </td>
          <td>
            ${checklistHtml}
          </td>
          <td>
            ${datepickerHtml}
          </td>
          <td>
            ${statusNotesHtml}
          </td>
          <td>
            <button class="btn-delete-crm" data-id="${lead.id}"><i class="fa-solid fa-trash-can"></i> Remove</button>
          </td>
        `;
        crmTableBody.appendChild(tr);
      });
    }

    // Handle status select, date picker, and audit checkbox changes (one-off selections)
    crmTableBody.addEventListener('change', (e) => {
      const select = e.target.closest('.crm-status-select');
      const dateInput = e.target.closest('.crm-followup-date-input');
      const checkbox = e.target.closest('.crm-audit-checkbox');
      const templateSelect = e.target.closest('.crm-template-select');
      
      if (select) {
        const id = select.getAttribute('data-id');
        const newStatus = select.value;
        updateCrmField(id, { status: newStatus });
      } else if (dateInput) {
        const id = dateInput.getAttribute('data-id');
        const followUpDate = dateInput.value;
        updateCrmField(id, { followUpDate });
      } else if (checkbox) {
        const id = checkbox.getAttribute('data-id');
        const field = checkbox.getAttribute('data-field');
        const val = checkbox.checked;
        updateCrmField(id, { [field]: val });
      } else if (templateSelect) {
        const id = templateSelect.getAttribute('data-id');
        const val = templateSelect.value;
        const container = templateSelect.closest('.template-selector-container');
        const input = container.querySelector('.crm-portfolio-link-input');
        
        if (val === 'custom') {
          input.style.display = 'block';
          updateCrmField(id, { portfolioLink: input.value.trim() });
        } else {
          input.style.display = 'none';
          updateCrmField(id, { portfolioLink: val });
        }
      }
    });

    // Handle notes and portfolio link inputs with debounce auto-save (keystrokes)
    let crmInputSaveTimeout = null;
    crmTableBody.addEventListener('input', (e) => {
      const textarea = e.target.closest('.crm-notes-textarea');
      const portfolioInput = e.target.closest('.crm-portfolio-link-input');
      
      if (textarea) {
        const id = textarea.getAttribute('data-id');
        const notes = textarea.value;
        if (crmInputSaveTimeout) clearTimeout(crmInputSaveTimeout);
        crmInputSaveTimeout = setTimeout(() => {
          updateCrmField(id, { notes });
        }, 1000);
      } else if (portfolioInput) {
        const id = portfolioInput.getAttribute('data-id');
        const portfolioLink = portfolioInput.value.trim();
        if (crmInputSaveTimeout) clearTimeout(crmInputSaveTimeout);
        crmInputSaveTimeout = setTimeout(() => {
          updateCrmField(id, { portfolioLink });
        }, 1000);
      }
    });

    // Handle delete buttons & pitch gen click events
    crmTableBody.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-delete-crm');
      const pitchBtn = e.target.closest('.crm-pitch-gen');
      
      if (delBtn) {
        const id = delBtn.getAttribute('data-id');
        deleteCrmLead(id);
      } else if (pitchBtn) {
        e.preventDefault();
        const id = pitchBtn.getAttribute('data-id');
        const lead = crmLeads.find(l => l.id === id);
        if (lead) {
          showPitchModal(lead);
        }
      }
    });

    // Handle crm filter selector
    crmFilterStatus.addEventListener('change', () => {
      renderCrm();
    });

    // Long poll active visitor tracker
    const spyFeedContainer = document.getElementById('spyFeedContainer');

    async function pollActiveVisits() {
      try {
        const response = await fetch('/api/active-visits');
        const data = await response.json();
        if (data.success && data.visits) {
          renderActiveVisits(data.visits);
        }
      } catch (error) {
        console.warn('Failed to fetch active visitor logs:', error);
      }
    }

    const miniSpyFeedContainer = document.getElementById('miniSpyFeedContainer');

    function renderActiveVisits(visits) {
      // Update proposal views count
      const viewsEl = document.getElementById('statDashboardTotalVisits');
      if (viewsEl) {
        // Count unique leads viewed
        const uniqueLeadsViewed = new Set(visits.map(v => v.leadId)).size;
        viewsEl.textContent = uniqueLeadsViewed;
      }

      // Render main Sales Spy feed
      if (spyFeedContainer) {
        renderVisitsList(spyFeedContainer, visits);
      }
      
      // Render mini Overview dashboard feed (limited to top 5)
      if (miniSpyFeedContainer) {
        renderVisitsList(miniSpyFeedContainer, visits, 5);
      }
    }

    function renderVisitsList(container, visits, limit = null) {
      const list = limit ? visits.slice(0, limit) : visits;
      
      if (list.length === 0) {
        container.innerHTML = `
          <div style="color: var(--text-secondary); text-align: center; padding: 1.5rem; font-size: 0.9rem;">
            <i class="fa-solid fa-satellite fa-spin" style="margin-right: 6px; color: var(--color-cyan);"></i> Waiting for visitor activity...
          </div>
        `;
        return;
      }
      
      container.innerHTML = '';
      
      list.forEach(visit => {
        const item = document.createElement('div');
        item.className = 'spy-log-item';
        
        let icon = '';
        let text = '';
        
        if (visit.event === 'open') {
          icon = `<i class="fa-solid fa-door-open" style="color: var(--color-cyan);"></i>`;
          text = `opened proposal page`;
        } else if (visit.event === 'fiverr_click') {
          icon = `<i class="fa-solid fa-cart-shopping" style="color: #10b981;"></i>`;
          text = `<span style="color: #10b981; font-weight: 700;">Clicked "Secure Order on Fiverr"</span>`;
        } else if (visit.event === 'whatsapp_click') {
          icon = `<i class="fa-brands fa-whatsapp" style="color: #25d366;"></i>`;
          text = `<span style="color: #25d366; font-weight: 700;">Clicked "Custom Modifications" (WhatsApp)</span>`;
        } else if (visit.event === 'heartbeat') {
          icon = `<i class="fa-solid fa-heartbeat" style="color: #ff5e97; font-size: 0.75rem;"></i>`;
          const scrollPct = visit.details.scrollPercent || 0;
          text = `still viewing proposal (Scroll depth: ${scrollPct}%)`;
        } else {
          icon = `<i class="fa-solid fa-magnifying-glass" style="color: var(--color-purple);"></i>`;
          text = `triggered event "${visit.event}"`;
        }
        
        const deviceIcon = (visit.details && visit.details.device === 'mobile') 
          ? `<i class="fa-solid fa-mobile-screen-button" title="Mobile Device"></i>`
          : `<i class="fa-solid fa-desktop" title="Desktop Device"></i>`;
          
        item.innerHTML = `
          <div class="spy-log-item-details">
            ${icon}
            <span><strong>${escapeHtml(visit.name)}</strong> ${text}</span>
          </div>
          <div class="spy-log-item-meta">
            <span>${deviceIcon}</span>
            <span>•</span>
            <span>${escapeHtml(visit.timeStr)}</span>
          </div>
        `;
        container.appendChild(item);
      });
    }

    // Sidebar navigation logic
    const navItems = document.querySelectorAll('.nav-item');
    const screenViews = document.querySelectorAll('.screen-view');
    const mobileMenuToggleBtn = document.getElementById('mobileMenuToggleBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggleBtn && sidebar) {
      mobileMenuToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('active');
        const icon = mobileMenuToggleBtn.querySelector('i');
        if (sidebar.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      });
    }
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetScreen = item.getAttribute('data-screen');
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        screenViews.forEach(view => {
          if (view.id === `screen_${targetScreen}`) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
        
        // Auto-close mobile sidebar drawer on selection
        if (sidebar && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          if (mobileMenuToggleBtn) {
            const icon = mobileMenuToggleBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
          }
        }
      });
    });

    // Settings elements
    const googleSettingsForm = document.getElementById('googleSettingsForm');
    const githubSettingsForm = document.getElementById('githubSettingsForm');
    const discordSettingsForm = document.getElementById('discordSettingsForm');
    
    const placesKeyInput = document.getElementById('placesKeyInput');
    const serperKeyInput = document.getElementById('serperKeyInput');
    const searchKeyInput = document.getElementById('searchKeyInput');
    const searchEngineIdInput = document.getElementById('searchEngineIdInput');
    
    const githubUsernameInput = document.getElementById('githubUsernameInput');
    const githubRepoInput = document.getElementById('githubRepoInput');
    const githubBranchInput = document.getElementById('githubBranchInput');
    const githubTokenInput = document.getElementById('githubTokenInput');

    const discordWebhookInput = document.getElementById('discordWebhookInput');
    const discordUserIdInput = document.getElementById('discordUserIdInput');
    
    // Diagnostic Badges & Descs
    const badgePlaces = document.getElementById('badgePlaces');
    const descPlaces = document.getElementById('descPlaces');
    const btnTestPlaces = document.getElementById('btnTestPlaces');

    const badgeSerper = document.getElementById('badgeSerper');
    const descSerper = document.getElementById('descSerper');
    const btnTestSerper = document.getElementById('btnTestSerper');
    
    const badgeSearch = document.getElementById('badgeSearch');
    const descSearch = document.getElementById('descSearch');
    const btnTestSearch = document.getElementById('btnTestSearch');
    
    const badgeGithub = document.getElementById('badgeGithub');
    const descGithub = document.getElementById('descGithub');
    const btnTestGithub = document.getElementById('btnTestGithub');

    const badgeDiscord = document.getElementById('badgeDiscord');
    const descDiscord = document.getElementById('descDiscord');
    const btnTestDiscord = document.getElementById('btnTestDiscord');

    async function loadConfigSettings() {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        
        // Populate inputs (masked value or empty)
        if (data.placesKey) placesKeyInput.value = data.placesKey;
        if (data.serperKey) serperKeyInput.value = data.serperKey;
        if (data.searchKey) searchKeyInput.value = data.searchKey;
        if (data.searchEngineId) searchEngineIdInput.value = data.searchEngineId;
        
        if (data.githubUsername) githubUsernameInput.value = data.githubUsername;
        if (data.githubRepo) githubRepoInput.value = data.githubRepo;
        if (data.githubBranch) githubBranchInput.value = data.githubBranch;
        if (data.githubToken) githubTokenInput.value = data.githubToken;

        if (data.discordWebhookUrl) discordWebhookInput.value = data.discordWebhookUrl;
        if (data.discordUserId) discordUserIdInput.value = data.discordUserId;
        
        // Update diagnostic statuses
        updateDiagnosticUI(data);
        
      } catch (error) {
        console.error('Failed to load settings configuration:', error);
      }
    }

    function updateDiagnosticUI(config) {
      // Places API Status
      if (config.placesKeyConfigured) {
        badgePlaces.className = "diag-badge badge-connected";
        badgePlaces.textContent = "Configured";
        descPlaces.textContent = "Google Places API key is loaded. Live Places searches are enabled.";
      } else {
        badgePlaces.className = "diag-badge badge-missing";
        badgePlaces.textContent = "Missing";
        descPlaces.textContent = "Google Places API key is not configured. Fallback: Puppeteer scraper.";
      }

      // Serper.dev API Status
      if (config.serperKeyConfigured) {
        badgeSerper.className = "diag-badge badge-connected";
        badgeSerper.textContent = "Configured";
        descSerper.textContent = "Serper.dev Search API is loaded. Fast, captcha-free social enrichment active.";
      } else {
        badgeSerper.className = "diag-badge badge-missing";
        badgeSerper.textContent = "Missing";
        descSerper.textContent = "Serper API key is not configured. Fallback: Google Custom Search API or Puppeteer.";
      }
      
      // Search API Status (Option A)
      if (config.searchKeyConfigured && config.searchEngineIdConfigured) {
        badgeSearch.className = "diag-badge badge-connected";
        badgeSearch.textContent = "Configured";
        descSearch.textContent = "Google Custom Search (Option A) is loaded. Fast, captcha-free social enrichment active.";
      } else {
        badgeSearch.className = "diag-badge badge-missing";
        badgeSearch.textContent = "Missing";
        descSearch.textContent = "Option A keys not set. Social enrichment will fall back to Puppeteer scraper (slow).";
      }
      
      // GitHub Status
      if (config.githubConfigured) {
        badgeGithub.className = "diag-badge badge-connected";
        badgeGithub.textContent = "Active";
        descGithub.textContent = `Connected to repository "${config.githubUsername}/${config.githubRepo}".`;
      } else {
        badgeGithub.className = "diag-badge badge-missing";
        badgeGithub.textContent = "Presets Mode";
        descGithub.textContent = "GitHub details missing. Standard presets (cafe, gym, bakery, etc.) are in use.";
      }

      // Discord Status
      if (config.discordConfigured) {
        badgeDiscord.className = "diag-badge badge-connected";
        badgeDiscord.textContent = "Active";
        descDiscord.textContent = "Discord webhook notifications configured. Ready to push alerts.";
      } else {
        badgeDiscord.className = "diag-badge badge-missing";
        badgeDiscord.textContent = "Inactive";
        descDiscord.textContent = "Discord webhook URL not configured. Setup to receive real-time phone push alerts.";
      }
    }

    // Save Google Settings
    if (googleSettingsForm) {
      googleSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          placesKey: placesKeyInput.value.trim(),
          serperKey: serperKeyInput.value.trim(),
          searchKey: searchKeyInput.value.trim(),
          searchEngineId: searchEngineIdInput.value.trim()
        };
        
        try {
          const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            alert('Google API keys saved successfully!');
            await checkServerConfig();
            await loadConfigSettings();
          } else {
            alert('Failed to save settings: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          alert('Error saving Google API settings.');
        }
      });
    }

    // Save GitHub Settings
    if (githubSettingsForm) {
      githubSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          githubUsername: githubUsernameInput.value.trim(),
          githubRepo: githubRepoInput.value.trim(),
          githubBranch: githubBranchInput.value.trim(),
          githubToken: githubTokenInput.value.trim()
        };
        
        try {
          const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            alert('GitHub templates configuration saved!');
            await loadGithubTemplates();
            await loadConfigSettings();
          } else {
            alert('Failed to save GitHub settings: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          alert('Error saving GitHub settings.');
        }
      });
    }

    // Save Discord Settings
    if (discordSettingsForm) {
      discordSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          discordWebhookUrl: discordWebhookInput.value.trim(),
          discordUserId: discordUserIdInput.value.trim()
        };
        
        try {
          const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            alert('Discord notification settings saved successfully!');
            await loadConfigSettings();
          } else {
            alert('Failed to save Discord settings: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          alert('Error saving Discord settings.');
        }
      });
    }

    // Test Places Connection
    if (btnTestPlaces) {
      btnTestPlaces.addEventListener('click', async () => {
        const originalText = btnTestPlaces.textContent;
        btnTestPlaces.textContent = "Testing...";
        btnTestPlaces.disabled = true;
        badgePlaces.className = "diag-badge badge-testing";
        badgePlaces.textContent = "Testing...";
        
        try {
          const res = await fetch('/api/config/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'places' })
          });
          const result = await res.json();
          if (result.success) {
            badgePlaces.className = "diag-badge badge-connected";
            badgePlaces.textContent = "Success";
            descPlaces.textContent = "Google Places API connection test successful! Ready to query Places.";
            alert('Places API connection test succeeded!');
          } else {
            badgePlaces.className = "diag-badge badge-missing";
            badgePlaces.textContent = "Error";
            descPlaces.textContent = "Connection test failed: " + result.error;
            alert('Places API connection test failed: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          badgePlaces.className = "diag-badge badge-missing";
          badgePlaces.textContent = "Error";
          descPlaces.textContent = "Network error during diagnostic test.";
          alert('Network error testing Places API.');
        } finally {
          btnTestPlaces.textContent = originalText;
          btnTestPlaces.disabled = false;
        }
      });
    }

    // Test Serper.dev Connection
    if (btnTestSerper) {
      btnTestSerper.addEventListener('click', async () => {
        const originalText = btnTestSerper.textContent;
        btnTestSerper.textContent = "Testing...";
        btnTestSerper.disabled = true;
        badgeSerper.className = "diag-badge badge-testing";
        badgeSerper.textContent = "Testing...";
        
        try {
          const res = await fetch('/api/config/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'serper' })
          });
          const result = await res.json();
          if (result.success) {
            badgeSerper.className = "diag-badge badge-connected";
            badgeSerper.textContent = "Success";
            descSerper.textContent = "Serper.dev Search API connection test successful! Ready for live social enrichment.";
            alert('Serper.dev API connection test succeeded!');
          } else {
            badgeSerper.className = "diag-badge badge-missing";
            badgeSerper.textContent = "Error";
            descSerper.textContent = "Connection test failed: " + result.error;
            alert('Serper.dev API connection test failed: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          badgeSerper.className = "diag-badge badge-missing";
          badgeSerper.textContent = "Error";
          descSerper.textContent = "Network error during diagnostic test.";
          alert('Network error testing Serper.dev API.');
        } finally {
          btnTestSerper.textContent = originalText;
          btnTestSerper.disabled = false;
        }
      });
    }

    // Test Search Connection (Option A)
    if (btnTestSearch) {
      btnTestSearch.addEventListener('click', async () => {
        const originalText = btnTestSearch.textContent;
        btnTestSearch.textContent = "Testing...";
        btnTestSearch.disabled = true;
        badgeSearch.className = "diag-badge badge-testing";
        badgeSearch.textContent = "Testing...";
        
        try {
          const res = await fetch('/api/config/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'search' })
          });
          const result = await res.json();
          if (result.success) {
            badgeSearch.className = "diag-badge badge-connected";
            badgeSearch.textContent = "Success";
            descSearch.textContent = "Google Custom Search API connection test successful! Ready for live social enrichment.";
            alert('Custom Search API connection test succeeded!');
          } else {
            badgeSearch.className = "diag-badge badge-missing";
            badgeSearch.textContent = "Error";
            descSearch.textContent = "Connection test failed: " + result.error;
            alert('Custom Search API connection test failed: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          badgeSearch.className = "diag-badge badge-missing";
          badgeSearch.textContent = "Error";
          descSearch.textContent = "Network error during diagnostic test.";
          alert('Network error testing Custom Search API.');
        } finally {
          btnTestSearch.textContent = originalText;
          btnTestSearch.disabled = false;
        }
      });
    }

    // Reload GitHub Templates (Test)
    if (btnTestGithub) {
      btnTestGithub.addEventListener('click', async () => {
        const originalText = btnTestGithub.textContent;
        btnTestGithub.textContent = "Reloading...";
        btnTestGithub.disabled = true;
        badgeGithub.className = "diag-badge badge-testing";
        badgeGithub.textContent = "Reloading...";
        
        try {
          await loadGithubTemplates();
          const response = await fetch('/api/config');
          const config = await response.json();
          updateDiagnosticUI(config);
          
          if (config.githubConfigured) {
            alert('GitHub templates reloaded successfully!');
          } else {
            alert('Reloaded presets. Setup GitHub repository configuration to use custom template lists.');
          }
        } catch (error) {
          console.error(error);
          badgeGithub.className = "diag-badge badge-missing";
          badgeGithub.textContent = "Error";
          alert('Failed to reload GitHub templates.');
        } finally {
          btnTestGithub.textContent = originalText;
          btnTestGithub.disabled = false;
        }
      });
    }

    // Test Discord Connection
    if (btnTestDiscord) {
      btnTestDiscord.addEventListener('click', async () => {
        const originalText = btnTestDiscord.textContent;
        btnTestDiscord.textContent = "Testing...";
        btnTestDiscord.disabled = true;
        badgeDiscord.className = "diag-badge badge-testing";
        badgeDiscord.textContent = "Testing...";
        
        try {
          const res = await fetch('/api/config/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'discord' })
          });
          const result = await res.json();
          if (result.success) {
            badgeDiscord.className = "diag-badge badge-connected";
            badgeDiscord.textContent = "Success";
            descDiscord.textContent = "Discord test message sent successfully! Check your phone.";
            alert('Discord test alert sent successfully! Check your phone.');
          } else {
            badgeDiscord.className = "diag-badge badge-missing";
            badgeDiscord.textContent = "Error";
            descDiscord.textContent = "Connection test failed: " + result.error;
            alert('Discord connection test failed: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          badgeDiscord.className = "diag-badge badge-missing";
          badgeDiscord.textContent = "Error";
          descDiscord.textContent = "Network error during diagnostic test.";
          alert('Network error testing Discord connection.');
        } finally {
          btnTestDiscord.textContent = originalText;
          btnTestDiscord.disabled = false;
        }
      });
    }

    // Trigger config check and CRM load on startup
    checkServerConfig();
    loadConfigSettings();
    loadGithubTemplates().then(() => {
      loadCrmLeads();
    });
    
    // Poll visitor tracking logs
    pollActiveVisits();
    setInterval(pollActiveVisits, 3000);
  });

  // Global helper for toggling input type (password/text)
  window.togglePasswordVisibility = function(inputId) {
    const input = document.getElementById(inputId);
    const wrapper = input.closest('.input-wrapper');
    const icon = wrapper.querySelector('.btn-toggle-visibility i');
    
    if (input.type === "password") {
      input.type = "text";
      icon.className = "fa-solid fa-eye-slash";
    } else {
      input.type = "password";
      icon.className = "fa-solid fa-eye";
    }
  };
