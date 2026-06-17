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
  
  let currentLeads = [];
  let isLiveMode = false;

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
      if (lead.whatsapp) { whatsappCount++; hasSocial = true; }
      if (hasSocial) { socialCount++; }
      
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
            <a href="${lead.whatsapp || '#'}" target="_blank" class="social-pill wa ${lead.whatsapp ? '' : 'inactive'}" title="WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="${lead.email ? 'mailto:' + lead.email : '#'}" target="_blank" class="social-pill mail ${lead.email ? '' : 'inactive'}" title="Email: ${lead.email || 'None'}">
              <i class="fa-solid fa-envelope"></i>
            </a>
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
    
    const headers = ['Name', 'Google Maps Link', 'Address', 'Phone', 'Facebook', 'Instagram', 'LinkedIn', 'WhatsApp', 'Email'];
    const rows = currentLeads.map(lead => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.googleMapsUri.replace(/"/g, '""')}"`,
      `"${(lead.address || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.facebook || '').replace(/"/g, '""')}"`,
      `"${(lead.instagram || '').replace(/"/g, '""')}"`,
      `"${(lead.linkedin || '').replace(/"/g, '""')}"`,
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
    leadsTableBody.addEventListener('click', (e) => {
      const trigger = e.target.closest('.social-pill.pitch-gen');
      if (trigger) {
        e.preventDefault();
        const index = parseInt(trigger.getAttribute('data-lead-index'), 10);
        const lead = currentLeads[index];
        if (lead) {
          showPitchModal(lead);
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
      const niche = nicheInput.value.trim() || 'business';
      const city = locationInput.value.trim() || 'your area';
      
      modalBizName.textContent = lead.name;
      modalBizMeta.textContent = `${niche.toUpperCase()} — ${city.toUpperCase()}`;
      
      let igScript = '';
      let whatsappScript = '';
      let emailScript = '';
      
      if (angle === 'mockup') {
        igScript = `Hey ${lead.name}! Love your profile page. 📸 I noticed you have amazing reviews here in ${city} but don't have a website listed on your profile. I actually designed a quick, modern 1-page website mockup for you guys to show how you could get more direct bookings. Do you mind if I send you a quick preview link?`;
        whatsappScript = `Hi ${lead.name}! 👋 Saw your business on Google Maps in ${city} and noticed you have a great local rating but no website yet. \n\nI'm a local web designer and built a quick demo layout showing how you could take orders/bookings directly via mobile. Do you mind if I share the link here? 😊`;
        emailScript = `Subject: Quick website mockup for ${lead.name} in ${city}\n\nHi ${lead.name} Team,\n\nI was researching local ${niche} services in ${city} and came across your business. Your ratings are fantastic, but I noticed you don't have an active website yet.\n\nI went ahead and created a modern landing page draft for you to show how a clean digital presence could double your online bookings.\n\nWould you be open to reviewing the preview link? I'd love to get your feedback.\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'reviews') {
        igScript = `Hey ${lead.name}! 🌟 I saw you guys have stellar reviews on Google Maps here in ${city}. You’re clearly the local favorite! I noticed there's no website listed on your profile to help turn that traffic into bookings. I put together a quick design showing how to turn your maps traffic into instant leads. Can I send it over?`;
        whatsappScript = `Hi ${lead.name}! 👋 Congrats on the great Google reviews in ${city}. Since you guys are doing so well on Maps but don't have a website link listed, I created a quick mobile template to display your customer reviews and take bookings directly. Do you mind if I send you a quick screenshot?`;
        emailScript = `Subject: Turning your Google Reviews into more customers for ${lead.name}\n\nHi ${lead.name} Team,\n\nI came across your business on Google Maps in ${city} and was blown away by your reviews. You guys are clearly delivering awesome service!\n\nHowever, I noticed that you don't have a website link listed on your Google business profile. Many local searchers look for a website to check prices or book immediately.\n\nI put together a quick demo website showing how you can display your great reviews and capture bookings directly. Would you be open to a quick look?\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'competitor') {
        igScript = `Hey ${lead.name}! I was looking up ${niche} services in ${city} and noticed other local spots are capturing bookings online with websites, while your Google listing doesn't link to one yet. I created a mobile-friendly site mockup specifically for you guys to close this gap. Mind if I share a preview link?`;
        whatsappScript = `Hi ${lead.name}! Saw your maps listing in ${city}. I noticed some other local ${niche} businesses are ranking high because of their websites, but you guys have better reviews! I drafted a quick 1-page site mockup to help you stand out. Do you mind if I share it here?`;
        emailScript = `Subject: Website mockup to help ${lead.name} beat local competitors in ${city}\n\nHi ${lead.name} Team,\n\nI was reviewing local search rankings for ${niche} businesses in ${city}. Your reviews are top-tier, but you are currently losing out on Google search traffic because competitors have websites and you don't.\n\nI went ahead and drafted a high-converting landing page specifically tailored for your brand to help you capture those local leads.\n\nWould you be open to checking out the mockup? It takes 10 seconds to look at.\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'seo') {
        igScript = `Hey ${lead.name}! 🔍 Did you know that when locals search Google for "${niche} in ${city}", Google prioritizes website links? I noticed you guys don't have one listed. I created a fast-loading mobile-friendly site template to help you rank higher. Can I send over a quick preview link?`;
        whatsappScript = `Hi ${lead.name}! 👋 I was checking local SEO listings in ${city} and noticed you guys have amazing reviews but no website. Google ranks businesses with websites much higher. I put together a quick mobile-optimized demo site to show how we can boost your rankings. Mind if I share the link?`;
        emailScript = `Subject: Google search traffic opportunity for ${lead.name} in ${city}\n\nHi ${lead.name} Team,\n\nI was analyzing Google search volume for "${niche} in ${city}" and noticed there are hundreds of searches monthly.\n\nSince your Google Maps listing doesn't have an active website link, you are missing out on this search traffic, which goes to competitors instead.\n\nI created a fast-loading, mobile-friendly landing page mockup for you to show how we can capture this local search traffic. Would you be open to reviewing the draft?\n\nBest regards,\n[Your Name]`;
      } else if (angle === 'audit') {
        igScript = `Hey ${lead.name}! Love your page. 📸 I recorded a quick 45-second screen recording showing 3 minor tweaks you can make to your Google business listing in ${city} to get more customers (including adding a simple website booking link). Mind if I drop the link to the video here?`;
        whatsappScript = `Hi ${lead.name}! 👋 I recorded a short 45-second video overview showing how you guys can get more direct mobile bookings in ${city} without spending money on ads. It's completely free value. Do you mind if I share the link here? 😊`;
        emailScript = `Subject: 45-second video audit for ${lead.name}\n\nHi ${lead.name} Team,\n\nI recorded a short 45-second screen recording showing 3 simple improvements you can make to your Google listing in ${city} to double your phone calls and bookings.\n\nOne of the recommendations is adding a fast, simple mobile booking page (I've included a free mockup in the video).\n\nWould it be okay if I sent over the quick video link?\n\nBest regards,\n[Your Name]`;
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

      // --- Outreach Launcher Actions ---
      
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
        // Strip non-numbers except leading plus if any
        const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
        btnLaunchWhatsApp.href = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(whatsappScript)}`;
        btnLaunchWhatsApp.classList.remove('disabled');
      } else {
        btnLaunchWhatsApp.removeAttribute('href');
        btnLaunchWhatsApp.classList.add('disabled');
      }

      // 3. Email Launcher
      const btnLaunchEmail = document.getElementById('btnLaunchEmail');
      if (lead.email) {
        let emailSubject = `Quick website mockup for ${lead.name}`;
        let emailBody = emailScript;
        
        if (emailScript.startsWith('Subject:')) {
          const subjectMatch = emailScript.match(/^Subject:\s*(.*?)\n+(.*)$/s);
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

    // Trigger config check on startup
    checkServerConfig();
  });
