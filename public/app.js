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
  window.publicSharingDomain = '';

  window.getPreviewBaseUrl = function() {
    if (window.publicSharingDomain && window.publicSharingDomain.trim() !== '') {
      let domain = window.publicSharingDomain.trim();
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = 'https://' + domain;
      }
      return domain.replace(/\/$/, '');
    }
    return window.location.origin;
  }

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

  async function handleLaunchPreview(lead, templateValue, buttonEl) {
    const cleanNiche = (templateValue || lead.niche || 'cafe').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
    
    let url = '';
    if (templateValue === 'custom') {
      const container = buttonEl.closest('.template-selector-container');
      const input = container ? container.querySelector('input.crm-portfolio-link-input, input.scan-portfolio-input') : null;
      url = (input && input.value.trim()) ? input.value.trim() : '';
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('Please enter a valid custom portfolio link starting with http:// or https://');
        return;
      }
    } else {
      url = `/go/${lead.id}`;
    }

    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Unable to generate preview link. Ensure a template is selected.');
    }
  }

  function updateScreenProposalLink(id, container, newLink) {
    const parentDiv = container.closest('div');
    if (parentDiv) {
      const anchor = parentDiv.parentElement ? parentDiv.parentElement.querySelector('a.crm-proposal-link') : null;
      if (anchor) {
        if (newLink.startsWith('http://') || newLink.startsWith('https://')) {
          anchor.href = newLink;
        } else {
          const shortAnchor = parentDiv.parentElement ? parentDiv.parentElement.querySelector('a.crm-short-link-anchor') : null;
          if (shortAnchor && shortAnchor.href) {
            anchor.href = shortAnchor.href;
          } else {
            anchor.href = `${getPreviewBaseUrl()}/go/${id}`;
          }
        }
      }

      // If a shortlink container exists under this column, reset it to allow shortening the new link
      const shortContainer = parentDiv.parentElement ? parentDiv.parentElement.querySelector('.crm-short-link-container') : null;
      if (shortContainer) {
        shortContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 4px;">
            <input type="text" placeholder="Custom Alias (Optional)" class="crm-short-alias-input" data-id="${id}" oninput="if(window.handleAliasInput) window.handleAliasInput(this)" style="font-size: 10px; padding: 2px 4px; background: rgba(0,0,0,0.25); border: 1px solid var(--color-border); border-radius: 4px; color: #fff; width: 110px;" title="Enter custom alias">
            <button class="btn-action" onclick="shortenCrmLeadLink('${id}', this)" style="padding: 2px 6px; font-size: 10px; background: rgba(0,217,245,0.1); border: 1px solid rgba(0,217,245,0.2); color: var(--color-cyan); white-space: nowrap;">
              Shorten 🔗
            </button>
          </div>
          <div class="crm-short-link-status" style="font-size: 10px; display: none;"></div>
        `;
      }
    }
  }

  function buildCrmShortLinkHtml(lead, proposalUrl) {
    const shortAlias = lead.shortAlias || '';
    const base = getPreviewBaseUrl();
    const shortUrl = shortAlias ? `${base}/go/${shortAlias}` : '';

    if (shortAlias) {
      return `
        <div class="crm-short-link-container" style="margin-top: 0.25rem; display: flex; flex-direction: column; gap: 2px;">
          <span style="font-size: 0.68rem; color: var(--color-green); font-weight: bold; display: inline-flex; align-items: center; gap: 4px;">
            <i class="fa-solid fa-shield-halved"></i> Trust Link:
          </span>
          <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
            <a class="crm-short-link-anchor" href="/go/${shortAlias}" target="_blank" style="font-size: 0.72rem; color: var(--color-green); text-decoration: none; font-family: monospace; word-break: break-all;" title="Open Short Link">
              /go/${shortAlias}
            </a>
            <button onclick="navigator.clipboard.writeText('${shortUrl}'); alert('Copied short link!');" style="background: transparent; border: none; color: var(--color-green); font-size: 0.7rem; cursor: pointer; padding: 0 4px;" title="Copy Short Link">
              <i class="fa-solid fa-copy"></i>
            </button>
            <button onclick="this.parentElement.nextElementSibling.style.display='flex'; this.parentElement.style.display='none';" style="background: transparent; border: none; color: var(--color-cyan); font-size: 0.65rem; cursor: pointer; padding: 0 4px;" title="Customize Alias">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
          <div class="crm-short-link-edit" style="display: none; align-items: center; gap: 4px;">
            <input type="text" placeholder="New Alias" value="${shortAlias}" class="crm-short-alias-input" data-id="${lead.id}" oninput="if(window.handleAliasInput) window.handleAliasInput(this)" style="font-size: 10px; padding: 2px 4px; background: rgba(0,0,0,0.25); border: 1px solid var(--color-border); border-radius: 4px; color: #fff; width: 90px;" title="Enter new custom alias">
            <button class="btn-action" onclick="shortenCrmLeadLink('${lead.id}', this)" style="padding: 2px 4px; font-size: 9px; background: rgba(0,217,245,0.1); border: 1px solid rgba(0,217,245,0.2); color: var(--color-cyan); white-space: nowrap;">
              Save
            </button>
          </div>
          <div class="crm-short-link-status" style="font-size: 10px; display: none;"></div>
        </div>
      `;
    } else {
      return `
        <div class="crm-short-link-container" style="margin-top: 0.35rem; display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <input type="text" placeholder="Custom Alias (Optional)" class="crm-short-alias-input" data-id="${lead.id}" oninput="if(window.handleAliasInput) window.handleAliasInput(this)" style="font-size: 10px; padding: 2px 4px; background: rgba(0,0,0,0.25); border: 1px solid var(--color-border); border-radius: 4px; color: #fff; width: 110px;" title="Enter custom alias">
            <button class="btn-action" onclick="shortenCrmLeadLink('${lead.id}', this)" style="padding: 2px 6px; font-size: 10px; background: rgba(0,217,245,0.1); border: 1px solid rgba(0,217,245,0.2); color: var(--color-cyan); white-space: nowrap;">
              Shorten 🔗
            </button>
          </div>
          <div class="crm-short-link-status" style="font-size: 10px; display: none;"></div>
        </div>
      `;
    }
  }

  window.shortenCrmLeadLink = async function (leadId, buttonEl) {
    const container = buttonEl.closest('.crm-short-link-container');
    const input = container ? container.querySelector('.crm-short-alias-input') : null;
    const statusEl = container ? container.querySelector('.crm-short-link-status') : null;
    const customAlias = input ? input.value.trim() : '';

    if (statusEl) {
      statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Shortening...`;
      statusEl.style.color = 'var(--color-cyan)';
      statusEl.style.display = 'block';
    }

    try {
      const response = await fetch('/api/crm/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, customAlias })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to shorten');
      }

      const shortUrl = result.shortUrl;
      const shortAlias = result.alias;

      // Update UI
      if (container) {
        container.innerHTML = `
          <span style="font-size: 0.68rem; color: var(--color-green); font-weight: bold; display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;">
            <i class="fa-solid fa-shield-halved"></i> Trust Link:
          </span>
          <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
            <a class="crm-short-link-anchor" href="/go/${shortAlias}" target="_blank" style="font-size: 0.72rem; color: var(--color-green); text-decoration: none; font-family: monospace; word-break: break-all;" title="Open Short Link">
              /go/${shortAlias}
            </a>
            <button onclick="navigator.clipboard.writeText('${shortUrl}'); alert('Copied short link!');" style="background: transparent; border: none; color: var(--color-green); font-size: 0.7rem; cursor: pointer; padding: 0 4px;" title="Copy Short Link">
              <i class="fa-solid fa-copy"></i>
            </button>
            <button onclick="this.parentElement.nextElementSibling.style.display='flex'; this.parentElement.style.display='none';" style="background: transparent; border: none; color: var(--color-cyan); font-size: 0.65rem; cursor: pointer; padding: 0 4px;" title="Customize Alias">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
          <div class="crm-short-link-edit" style="display: none; align-items: center; gap: 4px;">
            <input type="text" placeholder="New Alias" value="${shortAlias}" class="crm-short-alias-input" data-id="${leadId}" oninput="if(window.handleAliasInput) window.handleAliasInput(this)" style="font-size: 10px; padding: 2px 4px; background: rgba(0,0,0,0.25); border: 1px solid var(--color-border); border-radius: 4px; color: #fff; width: 90px;" title="Enter new custom alias">
            <button class="btn-action" onclick="shortenCrmLeadLink('${leadId}', this)" style="padding: 2px 4px; font-size: 9px; background: rgba(0,217,245,0.1); border: 1px solid rgba(0,217,245,0.2); color: var(--color-cyan); white-space: nowrap;">
              Save
            </button>
          </div>
          <div class="crm-short-link-status" style="font-size: 10px; display: none;"></div>
        `;
      }

      // Update internal crmLeads array cache
      const index = crmLeads.findIndex(l => l.id === leadId);
      if (index !== -1) {
        crmLeads[index].shortAlias = shortAlias;
      }
    } catch (err) {
      if (statusEl) {
        statusEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${err.message}`;
        statusEl.style.color = 'var(--color-rose)';
      }
    }
  };

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
        <div style="display: flex; gap: 4px; align-items: center;">
          <select class="crm-portfolio-input ${dropdownClass}" ${dataAttr} style="flex: 1; font-size: 11px; padding: 4px 6px; cursor: pointer;">
            <option value="" ${!currentVal ? 'selected' : ''}>-- Use Dynamic Match --</option>
            ${optionsHtml}
            <option value="custom" ${isCustomLink ? 'selected' : ''}>-- Custom Link... --</option>
          </select>
          <button type="button" class="btn-launch" ${dataAttr} style="background: var(--color-cyan-dim); border: 1px solid var(--color-cyan); color: var(--color-cyan); border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer;" title="Launch preview template">
            <i class="fa-solid fa-up-right-from-square"></i> Launch
          </button>
        </div>
        <input type="text" class="crm-portfolio-input ${inputClass}" ${dataAttr} placeholder="Paste custom portfolio/template link" value="${isCustomLink ? escapeHtml(currentVal) : ''}" style="display: ${isCustomLink ? 'block' : 'none'}; font-size: 11px; padding: 4px 6px; width: 100%;">
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
      
      // Determine what proposal link to pitch (use short link format only)
      let pitchLink = '';
      const baseUrl = getPreviewBaseUrl();
      if (lead.shortAlias) {
        pitchLink = `${baseUrl}/go/${lead.shortAlias}`;
      } else if (lead.portfolioLink && (lead.portfolioLink.startsWith('http://') || lead.portfolioLink.startsWith('https://'))) {
        pitchLink = lead.portfolioLink;
      } else {
        // Fallback to the short lead ID route
        pitchLink = `${baseUrl}/go/${lead.id}`;
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
        let proposalUrl = '';
        if (lead.portfolioLink && (lead.portfolioLink.startsWith('http://') || lead.portfolioLink.startsWith('https://'))) {
          proposalUrl = lead.portfolioLink;
        } else {
          const tNiche = lead.portfolioLink || cleanNiche;
          proposalUrl = `${getPreviewBaseUrl()}/preview/${tNiche}/${lead.id}?name=${encodeURIComponent(lead.name || '')}&phone=${encodeURIComponent(lead.phone || '')}&address=${encodeURIComponent(lead.address || '')}`;
        }
        
        const activeShortLink = lead.shortAlias ? `/go/${lead.shortAlias}` : `/go/${lead.id}`;

        const proposalLinkHtml = `
          <div style="margin-top: 0.35rem; display: flex; flex-direction: column; gap: 4px;">
            <a class="crm-proposal-link" href="${activeShortLink}" target="_blank" data-id="${lead.id}" data-name="${escapeHtml(lead.name || '')}" data-phone="${escapeHtml(lead.phone || '')}" data-address="${escapeHtml(lead.address || '')}" style="font-size: 0.75rem; color: var(--color-cyan); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;" title="Preview proposal page">
              <i class="fa-solid fa-link"></i> Proposal Link <i class="fa-solid fa-up-right-from-square" style="font-size:0.6rem;"></i>
            </a>
            ${buildTemplateSelectorHtml(lead, true, lead.id)}
            ${buildCrmShortLinkHtml(lead, proposalUrl)}
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
        
        let link = val;
        if (val === 'custom') {
          input.style.display = 'block';
          link = input.value.trim();
        } else {
          input.style.display = 'none';
        }
        updateCrmField(id, { portfolioLink: link });
        updateScreenProposalLink(id, container, link);
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
        
        const container = portfolioInput.closest('.template-selector-container');
        updateScreenProposalLink(id, container, portfolioLink);
      }
    });

    // Handle delete buttons & pitch gen click events
    crmTableBody.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-delete-crm');
      const pitchBtn = e.target.closest('.crm-pitch-gen');
      const launchBtn = e.target.closest('.btn-launch');
      
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
      } else if (launchBtn) {
        e.preventDefault();
        const id = launchBtn.getAttribute('data-id');
        const lead = crmLeads.find(l => l.id === id);
        const selEl = crmTableBody.querySelector(`select[data-id="${id}"]`);
        if (lead && selEl) handleLaunchPreview(lead, selEl.value, launchBtn);
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
        const response = await fetch(`${getPreviewBaseUrl()}/api/active-visits`);
        const data = await response.json();
        if (data.success && data.visits) {
          renderActiveVisits(data.visits);
        }
      } catch (error) {
        console.warn('Failed to fetch active visitor logs:', error);
      }
    }

    const miniSpyFeedContainer = document.getElementById('miniSpyFeedContainer');

    // Expandable click history delegation
    const handleSpyExpand = (e) => {
      const toggleBtn = e.target.closest('.spy-toggle-btn');
      if (toggleBtn) {
        const leadId = toggleBtn.getAttribute('data-lead-id');
        const detailsEl = document.getElementById(`history_${leadId}`);
        const icon = toggleBtn.querySelector('i');
        
        window.expandedActiveVisitIds = window.expandedActiveVisitIds || new Set();
        
        if (window.expandedActiveVisitIds.has(leadId)) {
          window.expandedActiveVisitIds.delete(leadId);
          if (detailsEl) detailsEl.style.display = 'none';
          if (icon) {
            icon.className = 'fa-solid fa-chevron-down';
          }
        } else {
          window.expandedActiveVisitIds.add(leadId);
          if (detailsEl) detailsEl.style.display = 'block';
          if (icon) {
            icon.className = 'fa-solid fa-chevron-up';
          }
        }
      }
    };
    if (spyFeedContainer) spyFeedContainer.addEventListener('click', handleSpyExpand);
    if (miniSpyFeedContainer) miniSpyFeedContainer.addEventListener('click', handleSpyExpand);

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
      window.expandedActiveVisitIds = window.expandedActiveVisitIds || new Set();

      function formatIndiaTime(isoString) {
        if (!isoString) return 'N/A';
        try {
          return new Date(isoString).toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
        } catch (e) {
          return new Date(isoString).toLocaleTimeString();
        }
      }

      function getFlagEmoji(countryCode) {
        if (!countryCode) return '🌐';
        try {
          const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
          return String.fromCodePoint(...codePoints);
        } catch (e) {
          return '🌐';
        }
      }

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
      
      list.forEach(session => {
        const item = document.createElement('div');
        item.className = 'spy-log-item';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.alignItems = 'stretch';
        item.style.gap = '8px';
        item.style.padding = '12px 16px';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
        
        // Format duration
        const mins = Math.floor(session.duration / 60);
        const secs = session.duration % 60;
        const durationText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        
        // Hot Lead Badge
        const hotBadge = session.isHot 
          ? `<span style="background: linear-gradient(135deg, #ff453a 0%, #ff9f0a 100%); color: #000; font-weight: 800; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 2px; text-transform: uppercase;"><i class="fa-solid fa-fire"></i> Hot Lead (${session.views} views)</span>`
          : `<span style="background: rgba(255,255,255,0.06); color: var(--text-secondary); font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">${session.views} views</span>`;
          
        const deviceIcon = session.device === 'mobile' 
          ? `<i class="fa-solid fa-mobile-screen-button" title="Mobile Device" style="color: var(--color-purple); font-size: 0.8rem;"></i>`
          : (session.device === 'tablet'
            ? `<i class="fa-solid fa-tablet-screen-button" title="Tablet Device" style="color: var(--color-orange); font-size: 0.8rem;"></i>`
            : `<i class="fa-solid fa-desktop" title="Desktop Device" style="color: var(--color-cyan); font-size: 0.8rem;"></i>`);

        const osBadge = session.os 
          ? `<span style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px;" title="Operating System"><i class="fa-solid fa-gears" style="opacity:0.7; font-size:0.6rem;"></i> ${session.os}</span>` 
          : '';
        const browserBadge = session.browser 
          ? `<span style="background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.15); color: var(--color-cyan); font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px;" title="Web Browser"><i class="fa-solid fa-window-restore" style="opacity:0.7; font-size:0.6rem;"></i> ${session.browser}</span>` 
          : '';

        // Format scroll progress color
        let scrollColor = 'var(--color-purple)';
        if (session.scrollPercent > 50) scrollColor = 'var(--color-cyan)';
        if (session.scrollPercent > 80) scrollColor = 'var(--color-green)';

        // Actions triggered icons
        let hasFiverr = false;
        let hasWa = false;
        let hasEmail = false;
        const chatMessages = [];

        if (session.events) {
          session.events.forEach(e => {
            if (e.event === 'fiverr_click') hasFiverr = true;
            if (e.event === 'whatsapp_click') hasWa = true;
            if (e.event === 'email_click') hasEmail = true;
            if (e.event === 'chat' && e.details && e.details.message) {
              chatMessages.push({ msg: e.details.message, time: e.timestamp });
            }
          });
        }

        const fiverrBadge = hasFiverr ? `<span style="color: #10b981; font-size: 0.65rem; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; background: rgba(16,185,129,0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(16,185,129,0.15);"><i class="fa-solid fa-cart-shopping"></i> Fiverr CTA</span>` : '';
        const waBadge = hasWa ? `<span style="color: #25d366; font-size: 0.65rem; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; background: rgba(37,211,102,0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(37,211,102,0.15);"><i class="fa-brands fa-whatsapp"></i> WhatsApp CTA</span>` : '';
        const emailBadge = hasEmail ? `<span style="color: #3b82f6; font-size: 0.65rem; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; background: rgba(59,130,246,0.08); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59,130,246,0.15);"><i class="fa-solid fa-envelope"></i> Email CTA</span>` : '';
        
        // Render chat messages Speech Bubbles
        let chatBubblesHtml = '';
        if (chatMessages.length > 0) {
          chatBubblesHtml = `
            <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px; width: 100%;">
              <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--color-cyan); font-weight: 600; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-comments"></i> Visitor Live Chat:</span>
              ${chatMessages.map(c => `
                <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.12); padding: 8px 10px; border-radius: 8px; font-size: 0.75rem; color: #fff; line-height: 1.35; position: relative;">
                  <span>${escapeHtml(c.msg)}</span>
                  <span style="font-size: 0.6rem; opacity: 0.4; display: block; text-align: right; margin-top: 2px;">${formatIndiaTime(c.time)}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        // Format active time representation
        const timeDiff = Math.round((new Date() - new Date(session.lastActiveAt)) / 1000);
        let timeStatusText = '';
        if (timeDiff < 25) {
          timeStatusText = `<span style="color: #10b981; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><span style="width:6px; height:6px; background:#10b981; border-radius:50%; display:inline-block; box-shadow:0 0 8px #10b981;"></span> Active Now</span>`;
        } else {
          timeStatusText = `<span style="color: var(--text-secondary); font-size: 0.7rem;">Active ${formatIndiaTime(session.lastActiveAt)}</span>`;
        }

        const isExpanded = window.expandedActiveVisitIds.has(session.leadId);

        // Icon mapping for events
        function getEventIcon(evName) {
          switch (evName) {
            case 'open': return '<i class="fa-solid fa-door-open" style="color: var(--color-green);"></i>';
            case 'heartbeat': return '<i class="fa-solid fa-heartpulse" style="color: #ff5e97;"></i>';
            case 'fiverr_click': return '<i class="fa-solid fa-cart-shopping" style="color: #10b981;"></i>';
            case 'whatsapp_click': return '<i class="fa-solid fa-comment-sms" style="color: #25d366;"></i>';
            case 'email_click': return '<i class="fa-solid fa-envelope" style="color: #3b82f6;"></i>';
            case 'chat': return '<i class="fa-solid fa-comment" style="color: var(--color-cyan);"></i>';
            default: return '<i class="fa-solid fa-circle-dot" style="opacity:0.5;"></i>';
          }
        }
        
        function getEventLabel(evName, details) {
          switch (evName) {
            case 'open': return 'Opened Proposal Link';
            case 'heartbeat': return `Active reading time +10s (Scroll: ${details.scrollPercent || 0}%)`;
            case 'fiverr_click': return 'Clicked Order on Fiverr';
            case 'whatsapp_click': return 'Clicked Request Changes (WhatsApp)';
            case 'email_click': return 'Clicked Email Us';
            case 'chat': return `Sent Message: "${details.message || ''}"`;
            default: return evName;
          }
        }

        const historyItemsHtml = session.events && session.events.length > 0 
          ? session.events.map(ev => `
            <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.72rem; padding: 4px 0; border-left: 1px dashed rgba(255,255,255,0.1); margin-left: 5px; padding-left: 8px;">
              <span style="font-size:0.75rem; flex-shrink: 0; margin-top:1px;">${getEventIcon(ev.event)}</span>
              <div style="display:flex; flex-direction:column; flex:1;">
                <span style="color:#e2e8f0;">${getEventLabel(ev.event, ev.details || {})}</span>
                <span style="font-size:0.6rem; opacity:0.4; margin-top:1px;">${formatIndiaTime(ev.timestamp)}</span>
              </div>
            </div>
          `).join('')
          : '<div style="font-size:0.7rem; color:var(--text-secondary); font-style:italic; padding:4px 0;">No tracking events recorded yet.</div>';

        item.innerHTML = `
          <!-- Header Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
              <span style="color: #ffffff; font-weight: 700; font-size: 0.85rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeHtml(session.name)}</span>
              ${hotBadge}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
              ${deviceIcon}
              ${timeStatusText}
              <button class="spy-toggle-btn" data-lead-id="${session.leadId}" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; outline: none; transition: color 0.2s;">
                <i class="fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
              </button>
            </div>
          </div>
          
          <!-- Location and ISP -->
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: var(--text-secondary); width: 100%;">
            <span style="font-size: 0.85rem; line-height: 1; margin-right: 1px;">${getFlagEmoji(session.countryCode)}</span>
            <span>${escapeHtml(session.location || 'Unknown Location')}</span>
            <span style="opacity: 0.4;">•</span>
            <span style="opacity: 0.8; font-style: italic;">${escapeHtml(session.isp || 'Local Network')}</span>
          </div>

          <!-- Browser & OS Badges -->
          <div style="display: flex; gap: 4px; margin-top: 1px; align-items: center; flex-wrap: wrap; width: 100%;">
            ${osBadge}
            ${browserBadge}
          </div>

          <!-- Engagement Metrics -->
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; color: var(--text-secondary); width: 100%; gap: 12px; margin-top: 2px;">
            <span style="display: flex; align-items: center; gap: 4px; white-space: nowrap;"><i class="fa-regular fa-clock" style="color: #ff5e97;"></i> Reading Time: <strong style="color:#fff;">${durationText}</strong></span>
            
            <div style="display: flex; align-items: center; gap: 6px; flex: 1; justify-content: flex-end; overflow: hidden;">
              <span style="white-space: nowrap;">Scroll: <strong style="color:#fff;">${session.scrollPercent}%</strong></span>
              <div style="width: 50px; height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div style="width: ${session.scrollPercent}%; height: 100%; background: ${scrollColor}; border-radius: 3px; transition: width 0.3s;"></div>
              </div>
            </div>
          </div>

          <!-- Interaction badging -->
          ${(hasFiverr || hasWa || hasEmail) ? `
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px;">
              ${fiverrBadge}
              ${waBadge}
              ${emailBadge}
            </div>
          ` : ''}

          <!-- Chat bubble outputs -->
          ${chatBubblesHtml}

          <!-- Expanded click history dropdown panel -->
          <div class="spy-history-details" id="history_${session.leadId}" style="display: ${isExpanded ? 'block' : 'none'}; border-top: 1px solid rgba(255,255,255,0.04); margin-top: 8px; padding-top: 8px; width: 100%;">
            <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; display: block; margin-bottom: 6px; letter-spacing: 0.05em;"><i class="fa-solid fa-clock-rotate-left" style="color:var(--color-cyan);"></i> Activity Log (IST India Time):</span>
            <div style="display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin;">
              ${historyItemsHtml}
            </div>
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

    // ─── API Credits Monitor ───────────────────────────────────────────────────
    window.refreshCredits = async function() {
      const icon = document.getElementById('creditsRefreshIcon');
      const lastChecked = document.getElementById('creditsLastChecked');
      if (icon) icon.classList.add('fa-spin');
      try {
        const resp = await fetch('/api/credits-check').then(r => r.json());
        if (!resp.success) return;
        const { credits, checkedAt } = resp;
        if (lastChecked) {
          const t = new Date(checkedAt);
          lastChecked.textContent = t.toLocaleTimeString();
        }

        // Helper: update one credit row
        const updateRow = (key, badge, bar, used, left) => {
          const c = credits[key];
          if (!c) return;
          const badgeEl = document.getElementById(badge);
          const barEl   = document.getElementById(bar);
          const usedEl  = document.getElementById(used);
          const leftEl  = document.getElementById(left);

          if (!c.configured || c.status === 'missing') {
            if (badgeEl) { badgeEl.textContent = 'Not configured'; badgeEl.style.background = 'rgba(255,255,255,0.08)'; badgeEl.style.color = 'var(--text-secondary)'; }
            if (barEl)   { barEl.style.width = '0%'; }
            return;
          }
          if (c.status === 'error') {
            if (badgeEl) { badgeEl.textContent = '⚠ Key Error'; badgeEl.style.background = 'rgba(248,131,121,0.2)'; badgeEl.style.color = '#f88379'; }
            return;
          }
          // Configured & ok
          if (badgeEl) {
            badgeEl.textContent = c.label || 'Active';
            if (c.pct !== null && c.pct !== undefined) {
              // Color: green < 50%, yellow 50–80%, red > 80% used
              if (c.pct < 50) { badgeEl.style.background = 'rgba(0,245,160,0.15)'; badgeEl.style.color = '#00f5a0'; }
              else if (c.pct < 80) { badgeEl.style.background = 'rgba(245,166,35,0.2)'; badgeEl.style.color = '#f5a623'; }
              else { badgeEl.style.background = 'rgba(248,131,121,0.2)'; badgeEl.style.color = '#f88379'; }
            } else {
              badgeEl.style.background = 'rgba(0,245,160,0.15)'; badgeEl.style.color = '#00f5a0';
            }
          }
          if (barEl && c.pct !== null && c.pct !== undefined) {
            barEl.style.width = `${c.pct}%`;
            if (c.pct < 50) barEl.style.background = 'linear-gradient(90deg,#00f5a0,#00d9f5)';
            else if (c.pct < 80) barEl.style.background = 'linear-gradient(90deg,#f5a623,#f7b731)';
            else barEl.style.background = 'linear-gradient(90deg,#f88379,#e8402a)';
          } else if (barEl && c.configured) {
            barEl.style.width = '10%'; // small indicator showing it's configured
          }
          if (usedEl && c.used !== undefined) usedEl.textContent = `${c.used.toLocaleString()} used`;
          if (leftEl && c.remaining !== undefined && c.remaining !== null && c.remaining !== Infinity) {
            leftEl.textContent = `${c.remaining.toLocaleString()} remaining`;
          } else if (leftEl && c.note) {
            leftEl.textContent = c.note;
          }
        };

        updateRow('serper', 'creditBadgeSerper', 'creditBarSerper', 'creditUsedSerper', 'creditLeftSerper');
        updateRow('places', 'creditBadgePlaces', 'creditBarPlaces', 'creditUsedPlaces', 'creditLeftPlaces');
        updateRow('yelp',   'creditBadgeYelp',   'creditBarYelp',   'creditUsedYelp',   'creditLeftYelp');

      } catch(err) {
        console.error('[Credits Monitor]', err);
      } finally {
        if (icon) icon.classList.remove('fa-spin');
      }
    };

    // Auto-load credits when settings tab is visible
    setTimeout(() => { if (document.getElementById('creditsMonitorPanel')) window.refreshCredits(); }, 800);

    // Settings elements
    const googleSettingsForm = document.getElementById('googleSettingsForm');
    const githubSettingsForm = document.getElementById('githubSettingsForm');
    const discordSettingsForm = document.getElementById('discordSettingsForm');
    
    const placesKeyInput = document.getElementById('placesKeyInput');
    const serperKeyInput = document.getElementById('serperKeyInput');
    const yelpKeyInput = document.getElementById('yelpKeyInput');
    const searchKeyInput = document.getElementById('searchKeyInput');
    const searchEngineIdInput = document.getElementById('searchEngineIdInput');
    
    const githubUsernameInput = document.getElementById('githubUsernameInput');
    const githubRepoInput = document.getElementById('githubRepoInput');
    const githubBranchInput = document.getElementById('githubBranchInput');
    const githubTokenInput = document.getElementById('githubTokenInput');

    const publicSharingDomainInput = document.getElementById('publicSharingDomainInput');
    const tawkEmbedUrlInput = document.getElementById('tawkEmbedUrlInput');
    const discordWebhookInput = document.getElementById('discordWebhookInput');
    const discordUserIdInput = document.getElementById('discordUserIdInput');
    
    // Diagnostic Badges & Descs
    const badgePlaces = document.getElementById('badgePlaces');
    const descPlaces = document.getElementById('descPlaces');
    const btnTestPlaces = document.getElementById('btnTestPlaces');

    const badgeSerper = document.getElementById('badgeSerper');
    const descSerper = document.getElementById('descSerper');
    const btnTestSerper = document.getElementById('btnTestSerper');
    
    const badgeYelp = document.getElementById('badgeYelp');
    const descYelp = document.getElementById('descYelp');
    const btnTestYelp = document.getElementById('btnTestYelp');
    
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
        if (data.yelpKey) yelpKeyInput.value = data.yelpKey;
        if (data.searchKey) searchKeyInput.value = data.searchKey;
        if (data.searchEngineId) searchEngineIdInput.value = data.searchEngineId;
        
        if (data.githubUsername) githubUsernameInput.value = data.githubUsername;
        if (data.githubRepo) githubRepoInput.value = data.githubRepo;
        if (data.githubBranch) githubBranchInput.value = data.githubBranch;
        if (data.githubToken) githubTokenInput.value = data.githubToken;

        if (data.publicSharingDomain) {
          publicSharingDomainInput.value = data.publicSharingDomain;
          window.publicSharingDomain = data.publicSharingDomain;
        } else {
          publicSharingDomainInput.value = '';
          window.publicSharingDomain = '';
        }
        if (data.tawkEmbedUrl) {
          tawkEmbedUrlInput.value = data.tawkEmbedUrl;
        } else {
          tawkEmbedUrlInput.value = '';
        }
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
      
      // Yelp API Status
      if (config.yelpKeyConfigured) {
        badgeYelp.className = "diag-badge badge-connected";
        badgeYelp.textContent = "Configured";
        descYelp.textContent = "Yelp Fusion API key is loaded. Live Yelp searches (Option B) are active.";
      } else {
        badgeYelp.className = "diag-badge badge-missing";
        badgeYelp.textContent = "Missing";
        descYelp.textContent = "Yelp API key is not configured. Fallback: Google Maps Puppeteer scraper.";
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
          yelpKey: yelpKeyInput.value.trim(),
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

    // Save Discord/Outreach Settings
    if (discordSettingsForm) {
      discordSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          publicSharingDomain: publicSharingDomainInput.value.trim(),
          tawkEmbedUrl: tawkEmbedUrlInput.value.trim(),
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
            alert('Outreach and tracking settings saved successfully!');
            await loadConfigSettings();
          } else {
            alert('Failed to save settings: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          alert('Error saving settings.');
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

    // Test Yelp Connection
    if (btnTestYelp) {
      btnTestYelp.addEventListener('click', async () => {
        const originalText = btnTestYelp.textContent;
        btnTestYelp.textContent = "Testing...";
        btnTestYelp.disabled = true;
        badgeYelp.className = "diag-badge badge-testing";
        badgeYelp.textContent = "Testing...";
        
        try {
          const res = await fetch('/api/config/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'yelp' })
          });
          const result = await res.json();
          if (result.success) {
            badgeYelp.className = "diag-badge badge-connected";
            badgeYelp.textContent = "Success";
            descYelp.textContent = "Yelp Fusion API connection test successful! Ready for live business scans.";
            alert('Yelp Fusion API connection test succeeded!');
          } else {
            badgeYelp.className = "diag-badge badge-missing";
            badgeYelp.textContent = "Error";
            descYelp.textContent = "Connection test failed: " + result.error;
            alert('Yelp Fusion API connection test failed: ' + result.error);
          }
        } catch (error) {
          console.error(error);
          badgeYelp.className = "diag-badge badge-missing";
          badgeYelp.textContent = "Error";
          descYelp.textContent = "Network error during diagnostic test.";
          alert('Network error testing Yelp Fusion API.');
        } finally {
          btnTestYelp.textContent = originalText;
          btnTestYelp.disabled = false;
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
  // ═══════════════════════════════════════════════════════════════════════
  // AD SCANNER — Frontend Logic
  // ═══════════════════════════════════════════════════════════════════════
  const adScanForm        = document.getElementById('adScanForm');
  const adNicheInput      = document.getElementById('adNicheInput');
  const adCityInput       = document.getElementById('adCityInput');
  const adBtnSearch       = document.getElementById('adBtnSearch');
  const adSearchSpinner   = document.getElementById('adSearchSpinner');
  const adSearchText      = document.getElementById('adSearchText');
  const adLoadingPanel    = document.getElementById('adLoadingPanel');
  const adEmptyState      = document.getElementById('adEmptyState');
  const adStatsGrid       = document.getElementById('adStatsGrid');
  const adResultsCard     = document.getElementById('adResultsCard');
  const adLeadsTableBody  = document.getElementById('adLeadsTableBody');
  const adStatTotal       = document.getElementById('adStatTotal');
  const adStatIG          = document.getElementById('adStatIG');
  const adStatFB          = document.getElementById('adStatFB');
  const adStatTT          = document.getElementById('adStatTT');
  const adStatGoogle      = document.getElementById('adStatGoogle');
  const adBtnExportCSV    = document.getElementById('adBtnExportCSV');
  const adBtnExportJSON   = document.getElementById('adBtnExportJSON');
  const adPlatformIG      = document.getElementById('adPlatformIG');
  const adPlatformFB      = document.getElementById('adPlatformFB');
  const adPlatformTT      = document.getElementById('adPlatformTT');
  const adPlatformGoogle  = document.getElementById('adPlatformGoogle');
  const googleAdScanForm  = document.getElementById('googleAdScanForm');
  const googleAdNicheInput= document.getElementById('googleAdNicheInput');
  const googleAdCityInput = document.getElementById('googleAdCityInput');
  const googleAdBtnSearch = document.getElementById('googleAdBtnSearch');
  const googleAdSearchSpinner = document.getElementById('googleAdSearchSpinner');
  const googleAdSearchText= document.getElementById('googleAdSearchText');
  const tiktokAdScanForm  = document.getElementById('tiktokAdScanForm');
  const tiktokAdNicheInput= document.getElementById('tiktokAdNicheInput');
  const tiktokAdCityInput = document.getElementById('tiktokAdCityInput');
  const tiktokAdBtnSearch = document.getElementById('tiktokAdBtnSearch');
  const tiktokAdSearchSpinner = document.getElementById('tiktokAdSearchSpinner');
  const tiktokAdSearchText= document.getElementById('tiktokAdSearchText');

  // ─── Sub-tab switcher (3 tabs: meta | tiktok | google) ────────────────────
  window.switchAdTab = function(tab) {
    const metaBtn    = document.getElementById('adTabMeta');
    const tiktokBtn  = document.getElementById('adTabTikTok');
    const googleBtn  = document.getElementById('adTabGoogle');
    const metaForm   = document.getElementById('adScanForm');
    const tiktokForm = document.getElementById('tiktokAdScanForm');
    const googleForm = document.getElementById('googleAdScanForm');
    const inactiveStyle = { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '2px solid rgba(255,255,255,0.12)' };
    const resetBtn = (btn) => {
      if (!btn) return;
      btn.style.background = inactiveStyle.bg;
      btn.style.color      = inactiveStyle.color;
      btn.style.border     = inactiveStyle.border;
    };
    // Reset all
    resetBtn(metaBtn); resetBtn(tiktokBtn); resetBtn(googleBtn);
    if (metaForm)   metaForm.style.display   = 'none';
    if (tiktokForm) tiktokForm.style.display = 'none';
    if (googleForm) googleForm.style.display = 'none';
    // Activate selected
    if (tab === 'meta') {
      metaBtn.style.background = 'linear-gradient(135deg,#e1306c,#1877f2)';
      metaBtn.style.color = '#fff'; metaBtn.style.border = 'none';
      if (metaForm) metaForm.style.display = '';
    } else if (tab === 'tiktok') {
      tiktokBtn.style.background = 'linear-gradient(135deg,#010101,#69C9D0)';
      tiktokBtn.style.color = '#fff'; tiktokBtn.style.border = 'none';
      if (tiktokForm) tiktokForm.style.display = '';
    } else {
      googleBtn.style.background = 'linear-gradient(135deg,#4285F4,#34A853)';
      googleBtn.style.color = '#fff'; googleBtn.style.border = 'none';
      if (googleForm) googleForm.style.display = '';
    }
  };

  let adCurrentLeads = [];

  function startAdLoadingAnimation() {
    const s1 = document.getElementById('adStep1');
    const s2 = document.getElementById('adStep2');
    const s3 = document.getElementById('adStep3');
    if (!s1) return;
    s1.className = 'step-item step-active';
    s1.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Connecting to Meta & Google Ad Networks...';
    s2.className = 'step-item';
    s2.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Scanning active ads in your niche...';
    s3.className = 'step-item';
    s3.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Filtering & scoring current websites...';
    setTimeout(() => {
      if (adLoadingPanel && adLoadingPanel.style.display === 'flex') {
        s1.className = 'step-item step-done';
        s1.innerHTML = '<i class="fa-solid fa-circle-check"></i> Ad Networks connected.';
        s2.className = 'step-item step-active';
        s2.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Scanning active ads in your niche...';
      }
    }, 4000);
    setTimeout(() => {
      if (adLoadingPanel && adLoadingPanel.style.display === 'flex') {
        s2.className = 'step-item step-done';
        s2.innerHTML = '<i class="fa-solid fa-circle-check"></i> Active ads extracted.';
        s3.className = 'step-item step-active';
        s3.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Filtering & scoring current websites...';
      }
    }, 9000);
  }

  function adPlatformBadge(platform) {
    const b = {
      instagram: `<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#e1306c,#833ab4);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;font-weight:600;"><i class="fa-brands fa-instagram"></i> Instagram</span>`,
      facebook:  `<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#1877f2,#42b4ff);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;font-weight:600;"><i class="fa-brands fa-facebook-f"></i> Facebook</span>`,
      meta:      `<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#1877f2,#833ab4);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;font-weight:600;"><i class="fa-brands fa-meta"></i> Meta</span>`,
      tiktok:    `<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#010101,#69C9D0);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;font-weight:600;"><i class="fa-brands fa-tiktok"></i> TikTok</span>`,
      google:    `<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#4285F4,#34A853);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;font-weight:600;"><i class="fa-brands fa-google"></i> Google Ads</span>`,
      bing:      `<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#FF6900,#00B4D8);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;font-weight:600;"><svg width="10" height="10" viewBox="0 0 24 24" fill="white" style="display:inline-block;vertical-align:middle;margin-right:2px;"><path d="M6 17V7h4.5c2.485 0 4 1.342 4 3.5 0 2.217-1.515 3.5-4 3.5H8v3H6Zm2-5h2.4c1.35 0 2.1-.6 2.1-1.5S11.75 9 10.4 9H8v3Z"/></svg> Bing Ads</span>`
    };
    return b[platform] || `<span style="background:rgba(255,255,255,0.1);color:#fff;border-radius:6px;padding:2px 8px;font-size:0.72rem;">${platform}</span>`;
  }

  function renderAdResults() {
    if (!adLeadsTableBody) return;
    adLeadsTableBody.innerHTML = '';
    if (adCurrentLeads.length === 0) {
      if (adEmptyState) {
        adEmptyState.innerHTML = `<div class="empty-state-logo"><i class="fa-solid fa-circle-info"></i></div><h3>No Ad Leads Found</h3><p>Try a different niche or city.</p>`;
        adEmptyState.style.display = 'flex';
      }
      return;
    }

    let igCount = 0, fbCount = 0, ttCount = 0, googleCount = 0;

    adCurrentLeads.forEach((lead, index) => {
      const p = lead.adPlatform || 'meta';
      if (p === 'instagram') igCount++;
      else if (p === 'facebook') fbCount++;
      else if (p === 'tiktok') ttCount++;
      else if (p === 'google') googleCount++;
      else if (p === 'meta') { igCount++; fbCount++; }

      // Website Score display
      let scoreHtml = '';
      if (lead.websiteScore) {
        const score = lead.websiteScore.score;
        const label = lead.websiteScore.label;
        const colorClass = score <= 40 ? 'score-poor' : (score <= 70 ? 'score-average' : 'score-good');
        const reasonText = (lead.websiteScore.reasons || []).join(', ') || 'Optimised';

        if (score !== null && score !== undefined) {
          scoreHtml = `
            <span class="score-badge ${colorClass}">${score}/100</span>
            <div class="score-reason">${escapeHtml(label)} - ${escapeHtml(reasonText)}</div>
          `;
        } else {
          scoreHtml = `
            <span class="score-badge score-none">Unscored</span>
            <div class="score-reason">${escapeHtml(reasonText)}</div>
          `;
        }
      } else {
        // Meta / TikTok leads that have no website
        scoreHtml = `
          <span class="score-badge score-poor">No Website</span>
          <div class="score-reason">Best pitch opportunity!</div>
        `;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="biz-name" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:linear-gradient(135deg,#f77062,#fe5196);border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.65rem;flex-shrink:0;">🔥</span>
            <span style="color:var(--color-cyan);font-weight:600;">${escapeHtml(lead.name)}</span>
          </div>
          ${lead.adHeadline ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; font-style: italic;">"${escapeHtml(lead.adHeadline)}"</div>` : ''}
          <div class="biz-meta" style="margin-top:4px;">${adPlatformBadge(p)}</div>
        </td>
        <td>
          <div class="contact-item"><i class="fa-solid fa-location-dot"></i><span>${escapeHtml(lead.address || 'N/A')}</span></div>
          <div class="contact-item" style="margin-top:0.25rem;"><i class="fa-solid fa-phone"></i><span>${escapeHtml(lead.phone || 'N/A')}</span></div>
          ${lead.website ? `<div class="contact-item" style="margin-top:0.25rem;"><i class="fa-solid fa-globe"></i><span style="font-size:0.8rem; color: var(--color-cyan);">${escapeHtml(lead.website)}</span></div>` : ''}
        </td>
        <td>
          <div class="score-container">${scoreHtml}</div>
        </td>
        <td>
          <div class="social-pill-container">
            <a href="#" class="social-pill crm-save" data-ad-lead-index="${index}" title="Save to CRM"><i class="fa-solid fa-folder-plus"></i></a>
            
            ${lead.websiteUrl ? `<a href="${lead.websiteUrl}" target="_blank" class="social-pill" style="background:rgba(255,255,255,0.1);color:#fff;" title="Visit Website"><i class="fa-solid fa-globe"></i></a>` : ''}
            ${lead.instagram ? `<a href="${lead.instagram}" target="_blank" class="social-pill ig" title="Instagram Profile"><i class="fa-brands fa-instagram"></i></a>` : `<a href="#" class="social-pill ig inactive" title="Instagram N/A"><i class="fa-brands fa-instagram"></i></a>`}
            ${lead.facebook ? `<a href="${lead.facebook}" target="_blank" class="social-pill fb" title="Facebook Page"><i class="fa-brands fa-facebook-f"></i></a>` : `<a href="#" class="social-pill fb inactive" title="Facebook N/A"><i class="fa-brands fa-facebook-f"></i></a>`}
            ${lead.tiktok ? `<a href="${lead.tiktok}" target="_blank" class="social-pill tt" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>` : ''}
            
            <a href="${lead.whatsapp || '#'}" target="_blank" class="social-pill wa ${lead.whatsapp ? '' : 'inactive'}" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + (lead.address || ''))}" target="_blank" class="social-pill" style="background:rgba(66,180,255,0.15);color:#42b4ff;" title="Find on Google Maps"><i class="fa-solid fa-map-location-dot"></i></a>
          </div>
          <div style="margin-top:0.5rem;">${buildTemplateSelectorHtml(lead, false, index)}</div>
        </td>
      `;
      adLeadsTableBody.appendChild(tr);
    });

    if (adStatTotal) adStatTotal.textContent = adCurrentLeads.length;
    if (adStatIG) adStatIG.textContent = igCount;
    if (adStatFB) adStatFB.textContent = fbCount;
    if (adStatTT) adStatTT.textContent = ttCount;
    if (adStatGoogle) adStatGoogle.textContent = googleCount;
    if (adStatsGrid) adStatsGrid.style.display = 'grid';
    if (adResultsCard) adResultsCard.style.display = 'block';

    // Wire CRM save buttons — use event delegation on the table body
    adLeadsTableBody.addEventListener('click', async (e) => {
      const saveBtn = e.target.closest('.crm-save[data-ad-lead-index]');
      if (!saveBtn) return;
      e.preventDefault();

      if (saveBtn.classList.contains('saved')) {
        alert('Already saved to CRM Tracker!');
        return;
      }

      const idx = parseInt(saveBtn.getAttribute('data-ad-lead-index'), 10);
      const lead = adCurrentLeads[idx];
      if (!lead) return;

      // Mark button saved immediately
      saveBtn.classList.add('saved');
      saveBtn.innerHTML = '<i class="fa-solid fa-folder-minus"></i>';
      saveBtn.title = 'Saved to CRM';

      // Enrich with niche/location from form
      lead.niche = adNicheInput.value.trim() || 'business';
      lead.location = adCityInput.value.trim() || 'your area';
      lead.source = 'Ad Scanner';

      await saveLeadToCrm(lead);
    });

    // Wire template launch buttons — event delegation
    adLeadsTableBody.addEventListener('click', async (e) => {
      const launchBtn = e.target.closest('.btn-launch[data-lead-index]');
      if (!launchBtn) return;
      e.preventDefault();
      const idx = parseInt(launchBtn.getAttribute('data-lead-index'), 10);
      const lead = adCurrentLeads[idx];
      const selEl = adLeadsTableBody.querySelector(`select[data-lead-index="${idx}"]`);
      if (lead && selEl) await handleLaunchPreview(lead, selEl.value, launchBtn);
    });
  }

  function startSearchCooldown(button, spinner, textEl, originalText, seconds = 15) {
    if (!button || !textEl) return;
    button.disabled = true;
    if (spinner) spinner.style.display = 'none';
    
    let remaining = seconds;
    textEl.innerHTML = `<i class="fa-solid fa-clock"></i> Wait (${remaining}s)`;
    
    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(interval);
        button.disabled = false;
        textEl.innerHTML = originalText;
      } else {
        textEl.innerHTML = `<i class="fa-solid fa-clock"></i> Wait (${remaining}s)`;
      }
    }, 1000);
  }

  if (adScanForm) {
    adScanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const niche = adNicheInput.value.trim();
      const city  = adCityInput.value.trim();
      if (!niche || !city) return;

      const metaPlatforms = [];
      if (adPlatformIG && adPlatformIG.checked) metaPlatforms.push('instagram');
      if (adPlatformFB && adPlatformFB.checked) metaPlatforms.push('facebook');
      if (adPlatformTT && adPlatformTT.checked) metaPlatforms.push('tiktok');

      const engines = [];
      if (adPlatformGoogle && adPlatformGoogle.checked) engines.push('google');

      if (metaPlatforms.length === 0 && engines.length === 0) {
        alert('Please select at least one platform.');
        return;
      }

      if (adEmptyState) adEmptyState.style.display = 'none';
      if (adStatsGrid) adStatsGrid.style.display = 'none';
      if (adResultsCard) adResultsCard.style.display = 'none';
      if (adLoadingPanel) adLoadingPanel.style.display = 'flex';
      adBtnSearch.disabled = true;
      adSearchSpinner.style.display = 'inline-block';
      adSearchText.textContent = 'Scanning...';
      startAdLoadingAnimation();

      try {
        const requests = [];

        // Meta Ads Request
        if (metaPlatforms.length > 0) {
          requests.push(
            fetch('/api/scan-ads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ niche, city, platforms: metaPlatforms })
            }).then(res => res.json()).catch(err => {
              console.error('Meta ad scan error:', err);
              return { success: false, leads: [] };
            })
          );
        }

        // Google Ads Request
        if (engines.length > 0) {
          requests.push(
            fetch('/api/scan-google-ads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ niche, city, engines, scoreWebsites: true })
            }).then(res => res.json()).catch(err => {
              console.error('Google ad scan error:', err);
              return { success: false, leads: [] };
            })
          );
        }

        const responses = await Promise.all(requests);
        let allLeads = [];
        responses.forEach(r => {
          if (r.success && Array.isArray(r.leads)) {
            allLeads = allLeads.concat(r.leads);
          }
        });

        adCurrentLeads = allLeads;
        renderAdResults();
      } catch (err) {
        console.error(err);
        alert('Network error during ad scan.');
        if (adEmptyState) adEmptyState.style.display = 'flex';
      } finally {
        if (adLoadingPanel) adLoadingPanel.style.display = 'none';
        startSearchCooldown(
          adBtnSearch, 
          adSearchSpinner, 
          adSearchText, 
          '<i class="fa-solid fa-satellite-dish"></i> Scan Ads', 
          60
        );
      }
    });
  }

  // ─── Google Ads Form Submit ─────────────────────────────────────────────────
  if (googleAdScanForm) {
    googleAdScanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const niche = (googleAdNicheInput && googleAdNicheInput.value.trim()) || (adNicheInput && adNicheInput.value.trim());
      const city  = (googleAdCityInput  && googleAdCityInput.value.trim())  || (adCityInput  && adCityInput.value.trim());
      if (!niche || !city) return;

      if (adEmptyState) adEmptyState.style.display = 'none';
      if (adStatsGrid) adStatsGrid.style.display = 'none';
      if (adResultsCard) adResultsCard.style.display = 'none';
      if (adLoadingPanel) adLoadingPanel.style.display = 'flex';
      if (googleAdBtnSearch) googleAdBtnSearch.disabled = true;
      if (googleAdSearchSpinner) googleAdSearchSpinner.style.display = 'inline-block';
      if (googleAdSearchText) googleAdSearchText.innerHTML = 'Scanning...';
      startAdLoadingAnimation();

      try {
        const resp = await fetch('/api/scan-google-ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ niche, city, engines: ['google'], scoreWebsites: true })
        }).then(r => r.json()).catch(err => {
          console.error('Google ad scan error:', err);
          return { success: false, leads: [] };
        });

        adCurrentLeads = (resp.success && Array.isArray(resp.leads)) ? resp.leads : [];
        renderAdResults();
      } catch (err) {
        console.error(err);
        if (adEmptyState) adEmptyState.style.display = 'flex';
      } finally {
        if (adLoadingPanel) adLoadingPanel.style.display = 'none';
        startSearchCooldown(
          googleAdBtnSearch, 
          googleAdSearchSpinner, 
          googleAdSearchText, 
          '<i class="fa-brands fa-google"></i> Scan Google', 
          60
        );
      }
    });
  }

  if (adBtnExportCSV) {
    adBtnExportCSV.addEventListener('click', () => {
      if (!adCurrentLeads.length) return;
      const hdr = ['Name','City','Phone','Email','Ad Platform','Facebook','Instagram','TikTok','WhatsApp'];
      const rows = adCurrentLeads.map(l => [
        `"${(l.name||'').replace(/"/g,'""')}"`, `"${(l.address||'').replace(/"/g,'""')}"`,
        `"${(l.phone||'').replace(/"/g,'""')}"`, `"${(l.email||'').replace(/"/g,'""')}"`,
        `"${(l.adPlatform||'').replace(/"/g,'""')}"`, `"${(l.facebook||'').replace(/"/g,'""')}"`,
        `"${(l.instagram||'').replace(/"/g,'""')}"`, `"${(l.tiktok||'').replace(/"/g,'""')}"`,
        `"${(l.whatsapp||'').replace(/"/g,'""')}"`
      ]);
      const csv = "data:text/csv;charset=utf-8," + [hdr.join(','), ...rows.map(r => r.join(','))].join('\n');
      const a = document.createElement('a');
      a.setAttribute('href', encodeURI(csv));
      a.setAttribute('download', `ad_leads_${adNicheInput.value}_${adCityInput.value}.csv`);
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  }

  if (adBtnExportJSON) {
    adBtnExportJSON.addEventListener('click', () => {
      if (!adCurrentLeads.length) return;
      const j = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adCurrentLeads, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', j);
      a.setAttribute('download', `ad_leads_${adNicheInput.value}_${adCityInput.value}.json`);
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  }
  // ═══════════════════════════════════════════════════════════════════════
  // DIRECTORY SCANNER — Frontend Logic
  // ═══════════════════════════════════════════════════════════════════════
  const dirScanForm        = document.getElementById('dirScanForm');
  const dirNicheInput      = document.getElementById('dirNicheInput');
  const dirCityInput       = document.getElementById('dirCityInput');
  const dirMinReviews      = document.getElementById('dirMinReviews');
  const dirBtnSearch       = document.getElementById('dirBtnSearch');
  const dirSearchSpinner   = document.getElementById('dirSearchSpinner');
  const dirSearchText      = document.getElementById('dirSearchText');
  const dirLoadingPanel    = document.getElementById('dirLoadingPanel');
  const dirEmptyState      = document.getElementById('dirEmptyState');
  const dirStatsGrid       = document.getElementById('dirStatsGrid');
  const dirResultsCard     = document.getElementById('dirResultsCard');
  const dirLeadsTableBody  = document.getElementById('dirLeadsTableBody');
  const dirStatTotal       = document.getElementById('dirStatTotal');
  const dirStatAvgRating   = document.getElementById('dirStatAvgRating');
  const dirStatDirectoryOnly = document.getElementById('dirStatDirectoryOnly');
  const dirBtnExportCSV    = document.getElementById('dirBtnExportCSV');
  const dirBtnExportJSON   = document.getElementById('dirBtnExportJSON');

  let dirCurrentLeads = [];

  function startDirLoadingAnimation() {
    const s1 = document.getElementById('dirStep1');
    const s2 = document.getElementById('dirStep2');
    const s3 = document.getElementById('dirStep3');
    if (!s1) return;
    s1.className = 'step-item step-active';
    s1.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Connecting to Business Directories...';
    s2.className = 'step-item';
    s2.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Fetching active listings & reviews...';
    s3.className = 'step-item';
    s3.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Filtering out businesses that own websites...';
    
    setTimeout(() => {
      if (dirLoadingPanel && dirLoadingPanel.style.display === 'flex') {
        s1.className = 'step-item step-done';
        s1.innerHTML = '<i class="fa-solid fa-circle-check"></i> Connected to Directories.';
        s2.className = 'step-item step-active';
        s2.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Fetching active listings & reviews...';
      }
    }, 3000);
    
    setTimeout(() => {
      if (dirLoadingPanel && dirLoadingPanel.style.display === 'flex') {
        s2.className = 'step-item step-done';
        s2.innerHTML = '<i class="fa-solid fa-circle-check"></i> Extracted listings & review counts.';
        s3.className = 'step-item step-active';
        s3.innerHTML = '<i class="fa-solid fa-circle-notch"></i> Filtering out businesses that own websites...';
      }
    }, 7000);
  }

  function renderDirResults() {
    if (!dirLeadsTableBody) return;
    dirLeadsTableBody.innerHTML = '';
    if (dirCurrentLeads.length === 0) {
      if (dirEmptyState) {
        dirEmptyState.innerHTML = `<div class="empty-state-logo"><i class="fa-solid fa-circle-info"></i></div><h3>No Directory Leads Found</h3><p>Try lowering the minimum reviews threshold or change inputs.</p>`;
        dirEmptyState.style.display = 'flex';
      }
      return;
    }

    let totalRating = 0;
    dirCurrentLeads.forEach((lead, index) => {
      totalRating += lead.rating || 4.0;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="biz-name" style="display:flex;align-items:center;gap:0.5rem;">
            <span style="background:linear-gradient(135deg,#11998e,#38ef7d);border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.65rem;flex-shrink:0;">📖</span>
            <span style="color:var(--color-cyan);font-weight:600;">${escapeHtml(lead.name)}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">
            <span style="color:#ffc107;"><i class="fa-solid fa-star"></i> ${lead.rating ? lead.rating.toFixed(1) : 'N/A'}</span> 
            (${lead.reviewsCount} reviews)
          </div>
        </td>
        <td>
          <div class="contact-item"><i class="fa-solid fa-location-dot"></i><span>${escapeHtml(lead.address || 'N/A')}</span></div>
          <div class="contact-item" style="margin-top:0.25rem;"><i class="fa-solid fa-phone"></i><span>${escapeHtml(lead.phone || 'N/A')}</span></div>
        </td>
        <td>
          <span class="score-badge score-poor">No Website</span>
          <div class="score-reason">Highly-reviewed, has budget. Pitch optimization!</div>
        </td>
        <td>
          <div class="social-pill-container">
            <a href="#" class="social-pill crm-save" data-dir-lead-index="${index}" title="Save to CRM"><i class="fa-solid fa-folder-plus"></i></a>
            
            ${lead.instagram ? `<a href="${lead.instagram}" target="_blank" class="social-pill ig" title="Instagram Profile"><i class="fa-brands fa-instagram"></i></a>` : `<a href="#" class="social-pill ig inactive" title="Instagram N/A"><i class="fa-brands fa-instagram"></i></a>`}
            ${lead.facebook ? `<a href="${lead.facebook}" target="_blank" class="social-pill fb" title="Facebook Page"><i class="fa-brands fa-facebook-f"></i></a>` : `<a href="#" class="social-pill fb inactive" title="Facebook N/A"><i class="fa-brands fa-facebook-f"></i></a>`}
            ${lead.tiktok ? `<a href="${lead.tiktok}" target="_blank" class="social-pill tt" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>` : ''}
            
            <a href="${lead.whatsapp || '#'}" target="_blank" class="social-pill wa ${lead.whatsapp ? '' : 'inactive'}" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + (lead.address || ''))}" target="_blank" class="social-pill" style="background:rgba(66,180,255,0.15);color:#42b4ff;" title="Find on Google Maps"><i class="fa-solid fa-map-location-dot"></i></a>
          </div>
          <div style="margin-top:0.5rem;">${buildTemplateSelectorHtml(lead, false, index)}</div>
        </td>
      `;
      dirLeadsTableBody.appendChild(tr);
    });

    const avgRating = (totalRating / dirCurrentLeads.length).toFixed(1);
    if (dirStatTotal) dirStatTotal.textContent = dirCurrentLeads.length;
    if (dirStatAvgRating) dirStatAvgRating.textContent = `${avgRating} ★`;
    if (dirStatDirectoryOnly) dirStatDirectoryOnly.textContent = '100%';
    if (dirStatsGrid) dirStatsGrid.style.display = 'grid';
    if (dirResultsCard) dirResultsCard.style.display = 'block';

    // Event delegation for CRM save
    dirLeadsTableBody.addEventListener('click', async (e) => {
      const saveBtn = e.target.closest('.crm-save[data-dir-lead-index]');
      if (!saveBtn) return;
      e.preventDefault();

      if (saveBtn.classList.contains('saved')) {
        alert('Already saved to CRM Tracker!');
        return;
      }

      const idx = parseInt(saveBtn.getAttribute('data-dir-lead-index'), 10);
      const lead = dirCurrentLeads[idx];
      if (!lead) return;

      saveBtn.classList.add('saved');
      saveBtn.innerHTML = '<i class="fa-solid fa-folder-minus"></i>';
      saveBtn.title = 'Saved to CRM';

      lead.niche = dirNicheInput.value.trim() || 'business';
      lead.location = dirCityInput.value.trim() || 'your area';
      lead.source = `Directory (${lead.source || 'Scraper'})`;

      await saveLeadToCrm(lead);
    });

    // Event delegation for template launch
    dirLeadsTableBody.addEventListener('click', async (e) => {
      const launchBtn = e.target.closest('.btn-launch[data-lead-index]');
      if (!launchBtn) return;
      e.preventDefault();
      const idx = parseInt(launchBtn.getAttribute('data-lead-index'), 10);
      const lead = dirCurrentLeads[idx];
      const selEl = dirLeadsTableBody.querySelector(`select[data-lead-index="${idx}"]`);
      if (lead && selEl) await handleLaunchPreview(lead, selEl.value, launchBtn);
    });

    // Handle directory finder table template select dropdown changes
    dirLeadsTableBody.addEventListener('change', (e) => {
      const select = e.target.closest('.scan-template-select');
      if (select) {
        const index = parseInt(select.getAttribute('data-lead-index'), 10);
        const lead = dirCurrentLeads[index];
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

    // Handle directory finder table custom portfolio text input changes
    dirLeadsTableBody.addEventListener('input', (e) => {
      const input = e.target.closest('.scan-portfolio-input');
      if (input) {
        const index = parseInt(input.getAttribute('data-lead-index'), 10);
        if (dirCurrentLeads[index]) {
          dirCurrentLeads[index].portfolioLink = input.value.trim();
        }
      }
    });
  }

  if (dirScanForm) {
    dirScanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const niche = dirNicheInput.value.trim();
      const city  = dirCityInput.value.trim();
      const minReviews = parseInt(dirMinReviews.value, 10) || 0;

      if (!niche || !city) return;

      if (dirEmptyState) dirEmptyState.style.display = 'none';
      if (dirStatsGrid) dirStatsGrid.style.display = 'none';
      if (dirResultsCard) dirResultsCard.style.display = 'none';
      if (dirLoadingPanel) dirLoadingPanel.style.display = 'flex';
      
      dirBtnSearch.disabled = true;
      dirSearchSpinner.style.display = 'inline-block';
      dirSearchText.textContent = 'Searching...';
      startDirLoadingAnimation();

      try {
        const res = await fetch('/api/scan-directory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ niche, city, minReviews })
        });
        const data = await res.json();
        if (data.success) {
          dirCurrentLeads = data.leads;
          renderDirResults();
        } else {
          alert('Directory Scan Error: ' + (data.error || 'Unknown failure'));
          if (dirEmptyState) dirEmptyState.style.display = 'flex';
        }
      } catch (err) {
        console.error(err);
        alert('Network error during directory scan.');
        if (dirEmptyState) dirEmptyState.style.display = 'flex';
      } finally {
        if (dirLoadingPanel) dirLoadingPanel.style.display = 'none';
        dirBtnSearch.disabled = false;
        dirSearchSpinner.style.display = 'none';
        dirSearchText.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search Listings';
      }
    });
  }

  if (dirBtnExportCSV) {
    dirBtnExportCSV.addEventListener('click', () => {
      if (!dirCurrentLeads.length) return;
      const hdr = ['Name','City','Phone','Rating','Reviews Count','Source'];
      const rows = dirCurrentLeads.map(l => [
        `"${(l.name||'').replace(/"/g,'""')}"`, `"${(l.address||'').replace(/"/g,'""')}"`,
        `"${(l.phone||'').replace(/"/g,'""')}"`, `"${l.rating}"`, `"${l.reviewsCount}"`,
        `"${l.source}"`
      ]);
      const csv = "data:text/csv;charset=utf-8," + [hdr.join(','), ...rows.map(r => r.join(','))].join('\n');
      const a = document.createElement('a');
      a.setAttribute('href', encodeURI(csv));
      a.setAttribute('download', `directory_leads_${dirNicheInput.value}_${dirCityInput.value}.csv`);
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  }

  if (dirBtnExportJSON) {
    dirBtnExportJSON.addEventListener('click', () => {
      if (!dirCurrentLeads.length) return;
      const j = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dirCurrentLeads, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', j);
      a.setAttribute('download', `directory_leads_${dirNicheInput.value}_${dirCityInput.value}.json`);
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  }

  // ═══ END AD SCANNER ════════════════════════════════════════════════════

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

// ─────────────────────────────────────────────────────────────────────────────
// LINK GENERATOR — generate & share personalised proposal preview links
// ─────────────────────────────────────────────────────────────────────────────
// Clean alias input on keypress (lowercase, hyphens only)
window.handleAliasInput = function (input) {
  const selectionStart = input.selectionStart;
  const originalVal = input.value;
  const cleanedVal = originalVal.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  if (originalVal !== cleanedVal) {
    input.value = cleanedVal;
    try { input.setSelectionRange(selectionStart, selectionStart); } catch(e) {}
  }
  window.generateLinkDraft();
};

window.generateLinkDraft = function () {
  const niche   = (document.getElementById('lg_niche')   || {}).value   || '';
  const name    = (document.getElementById('lg_name')    || {}).value   || '';
  const tag     = (document.getElementById('lg_tag')     || {}).value   || '';
  const phone   = (document.getElementById('lg_phone')   || {}).value   || '';
  const address = (document.getElementById('lg_address') || {}).value   || '';

  const outputEl    = document.getElementById('lg_output');
  const copyBtn     = document.getElementById('lg_btn_copy');
  const openBtn     = document.getElementById('lg_btn_open');
  const waBtn       = document.getElementById('lg_whatsapp');
  const emailBtn    = document.getElementById('lg_email');
  const smsBtn      = document.getElementById('lg_sms');

  if (!niche || !name) {
    if (outputEl) outputEl.innerHTML = '<span style="color: var(--color-text-secondary);">Fill in the form to generate your link...</span>';
    return;
  }

  const base      = getPreviewBaseUrl();
  const leadId    = 'preview_' + niche.replace(/\s+/g, '_') + '_' + Date.now();
  const fullName  = tag ? `${name} - ${tag}` : name;
  const url       = `${base}/preview/${encodeURIComponent(niche)}/${leadId}?name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}`;

  if (outputEl) {
    outputEl.innerHTML = `<span style="font-size:0.75rem; color:#facc15; font-weight:bold; display:block; margin-bottom:4px;"><i class="fa-solid fa-triangle-exclamation"></i> Draft Preview (Click "Generate Link" to Shorten)</span>` + url;
  }

  if (copyBtn) copyBtn.disabled = true;
  if (openBtn) { openBtn.href = "#"; openBtn.style.pointerEvents = 'none'; openBtn.style.opacity = '0.4'; }
  if (waBtn) { waBtn.href = "#"; waBtn.style.pointerEvents = 'none'; waBtn.style.opacity = '0.4'; }
  if (emailBtn) { emailBtn.href = "#"; emailBtn.style.pointerEvents = 'none'; emailBtn.style.opacity = '0.4'; }
  if (smsBtn) { smsBtn.href = "#"; smsBtn.style.pointerEvents = 'none'; smsBtn.style.opacity = '0.4'; }
};

window.generateLink = async function () {
  const niche   = (document.getElementById('lg_niche')   || {}).value   || '';
  const name    = (document.getElementById('lg_name')    || {}).value   || '';
  const tag     = (document.getElementById('lg_tag')     || {}).value   || '';
  const phone   = (document.getElementById('lg_phone')   || {}).value   || '';
  const address = (document.getElementById('lg_address') || {}).value   || '';
  const customAlias = (document.getElementById('lg_alias') || {}).value || '';

  const outputEl    = document.getElementById('lg_output');
  const copyBtn     = document.getElementById('lg_btn_copy');
  const openBtn     = document.getElementById('lg_btn_open');
  const waBtn       = document.getElementById('lg_whatsapp');
  const emailBtn    = document.getElementById('lg_email');
  const smsBtn      = document.getElementById('lg_sms');

  if (!niche || !name) {
    if (outputEl) outputEl.textContent = 'Please enter at least a Niche and Business Name.';
    return;
  }

  if (outputEl) {
    outputEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating trust link...`;
  }

  const base      = getPreviewBaseUrl();
  const leadId    = 'preview_' + niche.replace(/\s+/g, '_') + '_' + Date.now();
  const fullName  = tag ? `${name} - ${tag}` : name;
  const longUrl   = `${base}/preview/${encodeURIComponent(niche)}/${leadId}?name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}`;

  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longUrl, customAlias, name: fullName })
    });
    
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to shorten link');
    }

    const shortUrl = result.shortUrl;

    if (outputEl) {
      outputEl.innerHTML = `<span style="font-size:0.75rem; color:var(--color-green); font-weight:bold; display:block; margin-bottom:4px;"><i class="fa-solid fa-shield-halved"></i> Active Trust Link</span>` + shortUrl;
    }

    if (copyBtn) { copyBtn.disabled = false; copyBtn.dataset.url = shortUrl; }
    if (openBtn) { openBtn.href = shortUrl; openBtn.style.pointerEvents = 'auto'; openBtn.style.opacity = '1'; }

    const waMsg = `Hi! I've built you a personalised website demo. Have a look 👉 ${shortUrl}`;
    if (waBtn) {
      waBtn.href = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;
      waBtn.style.pointerEvents = 'auto';
      waBtn.style.opacity = '1';
    }

    const emailSubject = `Your Free Website Demo — ${name}`;
    const emailBody    = `Hi,\n\nI've created a personalised website demo for ${name}. Click the link below to view it:\n\n${shortUrl}\n\nLet me know what you think!\n\nBest regards`;
    if (emailBtn) {
      emailBtn.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      emailBtn.style.pointerEvents = 'auto';
      emailBtn.style.opacity = '1';
    }

    const smsMsg = `Hi! Here's your free website demo: ${shortUrl}`;
    if (smsBtn) {
      smsBtn.href = `sms:?body=${encodeURIComponent(smsMsg)}`;
      smsBtn.style.pointerEvents = 'auto';
      smsBtn.style.opacity = '1';
    }
  } catch (err) {
    if (outputEl) {
      outputEl.innerHTML = `<span style="color: var(--color-rose);"><i class="fa-solid fa-circle-exclamation"></i> Error: ${err.message}</span>`;
    }
  }
};

window.copyProposalLink = function () {
  const copyBtn = document.getElementById('lg_btn_copy');
  const url = (copyBtn || {}).dataset.url || document.getElementById('lg_output').textContent;
  if (!url || url.startsWith('Fill') || url.startsWith('Please')) return;

  navigator.clipboard.writeText(url).then(() => {
    const orig = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    copyBtn.style.background = 'rgba(0,245,160,0.2)';
    setTimeout(() => {
      copyBtn.innerHTML = orig;
      copyBtn.style.background = '';
    }, 2000);
  }).catch(() => {
    // Fallback for non-HTTPS
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => { copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Link'; }, 2000);
  });
};

window.generateAllLinks = async function () {
  const name    = (document.getElementById('lg_name')    || {}).value   || '';
  const tag     = (document.getElementById('lg_tag')     || {}).value   || '';
  const phone   = (document.getElementById('lg_phone')   || {}).value   || '';
  const address = (document.getElementById('lg_address') || {}).value   || '';

  const container = document.getElementById('lg_all_links_container');
  const tbody     = document.getElementById('lg_all_links_tbody');

  if (!name) {
    alert('Please enter at least a Business Name.');
    return;
  }

  const base = typeof window.getPreviewBaseUrl === 'function' ? window.getPreviewBaseUrl() : window.location.origin;

  const nicheSelect = document.getElementById('lg_niche');
  if (!nicheSelect) return;

  const options = Array.from(nicheSelect.options);
  tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:2rem; color:var(--color-cyan);"><i class="fa-solid fa-spinner fa-spin"></i> Generating trust links for all niches...</td></tr>`;
  if (container) container.style.display = 'flex';

  const fullName = tag ? `${name} - ${tag}` : name;
  const timestamp = Date.now();

  const linksToShorten = [];
  const labelsMap = {};

  options.forEach(opt => {
    const val = opt.value;
    const label = opt.text;
    if (val === 'custom') return;

    const leadId = 'preview_' + val.replace(/\s+/g, '_') + '_' + timestamp;
    const url = `${base}/preview/${encodeURIComponent(val)}/${leadId}?name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}`;
    
    linksToShorten.push({ niche: val, longUrl: url });
    labelsMap[val] = label;
  });

  try {
    const response = await fetch('/api/shorten/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName, links: linksToShorten })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to generate bulk links');
    }

    tbody.innerHTML = '';
    result.shortLinks.forEach(item => {
      const label = labelsMap[item.niche] || item.niche;
      const url = item.shortUrl;

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      tr.innerHTML = `
        <td style="padding: 0.75rem 0.5rem; font-weight: 700; color: #fff;">${label}</td>
        <td style="padding: 0.75rem 0.5rem; word-break: break-all; color: var(--color-cyan); font-family: monospace; font-size: 0.78rem;">${url}</td>
        <td style="padding: 0.75rem 0.5rem; text-align: center;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-action btn-copy" onclick="navigator.clipboard.writeText('${url}'); alert('Copied link for ${label.replace(/'/g, "\\'")}!');" style="padding: 4px 8px; font-size: 0.75rem; background: rgba(0,217,245,0.1); border: 1px solid rgba(0,217,245,0.2); color: var(--color-cyan);">
              <i class="fa-solid fa-copy"></i> Copy
            </button>
            <a href="${url}" target="_blank" class="btn-action btn-launch" style="padding: 4px 8px; font-size: 0.75rem; text-decoration: none;">
              <i class="fa-solid fa-eye"></i> View
            </a>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:2rem; color:var(--color-rose);"><i class="fa-solid fa-circle-exclamation"></i> Error: ${err.message}</td></tr>`;
  }
};

