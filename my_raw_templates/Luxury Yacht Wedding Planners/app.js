document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Header Scroll Effect
     ========================================================================== */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. Mobile Navigation Toggle
     ========================================================================== */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navbar.classList.toggle('active');
    });
  }

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navbar.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. Yacht Fleet Carousel
     ========================================================================== */
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  let currentSlide = 0;

  function showSlide(index) {
    // Wrap index around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    indicators.forEach((indicator, idx) => {
      if (idx === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }

  indicators.forEach(indicator => {
    indicator.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.target.getAttribute('data-slide'), 10);
      showSlide(targetIdx);
    });
  });

  /* ==========================================================================
     4. Interactive Cost Estimator Logic
     ========================================================================== */
  const calcYacht = document.getElementById('calc-yacht');
  const calcGuests = document.getElementById('calc-guests');
  const guestValue = document.getElementById('guest-value');
  const calcTiers = document.getElementsByName('calc-tier');
  
  // Add-ons
  const addCatering = document.getElementById('add-catering');
  const addBar = document.getElementById('add-bar');
  const addOrchestra = document.getElementById('add-orchestra');
  const addFireworks = document.getElementById('add-fireworks');

  // Breakdown fields
  const bdYacht = document.getElementById('breakdown-yacht');
  const bdTier = document.getElementById('breakdown-tier');
  const bdCatering = document.getElementById('breakdown-catering');
  const bdAddons = document.getElementById('breakdown-addons');
  const totalPriceEl = document.getElementById('total-price');

  // Pricing constants mapping
  const prices = {
    yachts: {
      empress: 25000,
      serenade: 18000,
      horizon: 12000
    },
    tiers: {
      boutique: 12500,
      grand: 28000,
      royal: 55000
    }
  };

  function updateCalculator() {
    // 1. Get Yacht Price
    const yachtKey = calcYacht.value;
    const yachtPrice = prices.yachts[yachtKey] || 0;
    
    // 2. Get Guest Count
    const guests = parseInt(calcGuests.value, 10);
    guestValue.textContent = `${guests} Guests`;

    // 3. Get Package Tier Price
    let tierPrice = 0;
    let selectedTier = 'grand';
    calcTiers.forEach(radio => {
      if (radio.checked) {
        tierPrice = parseFloat(radio.getAttribute('data-price')) || prices.tiers[radio.value];
        selectedTier = radio.value;
        
        // Add visual active state class to the label parent
        radio.closest('.radio-card').classList.add('active');
      } else {
        radio.closest('.radio-card').classList.remove('active');
      }
    });

    // 4. Calculate Catering & Bar Upgrades
    let cateringPerGuest = 0;
    if (addCatering.checked) cateringPerGuest += parseFloat(addCatering.value);
    if (addBar.checked) cateringPerGuest += parseFloat(addBar.value);
    
    const totalCateringCost = cateringPerGuest * guests;

    // 5. Calculate Flat Add-ons
    let flatAddons = 0;
    if (addOrchestra.checked) flatAddons += parseFloat(addOrchestra.value);
    if (addFireworks.checked) flatAddons += parseFloat(addFireworks.value);

    // 6. Total Calculation
    const totalCost = yachtPrice + tierPrice + totalCateringCost + flatAddons;

    // 7. Update display numbers (with currency formatting)
    bdYacht.textContent = `$${yachtPrice.toLocaleString()}`;
    bdTier.textContent = `$${tierPrice.toLocaleString()}`;
    bdCatering.textContent = `$${totalCateringCost.toLocaleString()}`;
    bdAddons.textContent = `$${flatAddons.toLocaleString()}`;
    
    // Update main total with a slight count-up effect for premium feeling
    animateCountUp(totalPriceEl, totalCost);
  }

  // Count-up helper function
  let animationFrameId = null;
  function animateCountUp(element, targetVal) {
    const currentVal = parseInt(element.textContent.replace(/[$,]/g, ''), 10) || 0;
    if (currentVal === targetVal) return;

    const duration = 400; // ms
    const startTime = performance.now();

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(currentVal + (targetVal - currentVal) * easeProgress);
      
      element.textContent = `$${currentCount.toLocaleString()}`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        element.textContent = `$${targetVal.toLocaleString()}`;
      }
    }
    
    animationFrameId = requestAnimationFrame(step);
  }

  // Event Listeners for inputs
  if (calcYacht) calcYacht.addEventListener('change', updateCalculator);
  if (calcGuests) calcGuests.addEventListener('input', updateCalculator);
  calcTiers.forEach(radio => {
    radio.addEventListener('change', updateCalculator);
  });
  [addCatering, addBar, addOrchestra, addFireworks].forEach(addon => {
    if (addon) addon.addEventListener('change', updateCalculator);
  });

  // Yacht Fleet Cards "Select Yacht" Integration
  const selectYachtBtns = document.querySelectorAll('.select-yacht-btn');
  selectYachtBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const yacht = e.target.getAttribute('data-yacht');
      calcYacht.value = yacht;
      updateCalculator();
      
      // Scroll smoothly to the calculator section
      document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Package Tier Cards "Select Package" Integration
  const selectTierBtns = document.querySelectorAll('.select-tier-btn');
  selectTierBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tier = e.target.getAttribute('data-tier');
      const radioBtn = document.querySelector(`input[name="calc-tier"][value="${tier}"]`);
      if (radioBtn) {
        radioBtn.checked = true;
        updateCalculator();
        
        // Scroll smoothly to the calculator section
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial Calculation Run
  if (calcYacht) {
    updateCalculator();
  }

  /* ==========================================================================
     5. Scroll Reveal Animation using IntersectionObserver
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. Booking Form Simulation
     ========================================================================== */
  const bookingForm = document.getElementById('booking-form');
  const formStatus = document.getElementById('form-status');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Premium loading animation
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Reservation Request...';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      // Simulate API post request
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success state
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Thank you! Your private yacht wedding consultation request has been received. Our concierge team will contact you shortly.';
        
        // Reset form
        bookingForm.reset();
        
        // Reset inputs layout label states
        const inputs = bookingForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          // Trigger label float back down by setting placeholder spacer
          input.value = '';
        });
        
        updateCalculator();
      }, 2000);
    });
  }

  // Pre-fill form details if user clicks "Proceed to Consultation" in the calculator
  const calcBookBtn = document.getElementById('calc-book-btn');
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const selectedYachtVal = calcYacht.value;
      const guestsCountVal = calcGuests.value;
      
      const formYachtSelect = document.getElementById('form-yacht');
      const formGuestsInput = document.getElementById('form-guests');
      
      if (formYachtSelect) formYachtSelect.value = selectedYachtVal;
      if (formGuestsInput) {
        formGuestsInput.value = guestsCountVal;
        // Trigger floating label state by inputting value
        formGuestsInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }
});
