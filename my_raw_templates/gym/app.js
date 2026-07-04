/* 
========================================================================
   BULL GYM - PREMIUM INTERACTION SCRIPT
   Author: AntigravityPair
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STICKY HEADER & ACTIVE NAV SCROLL
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header scrolled state
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTop = document.getElementById('back-to-top');
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }

    // Scroll active link update
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Smooth scroll click handler (especially to adjust scroll padding for fixed header)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Close sidebar if mobile link clicked
        closeMobileMenu();

        const offsetPosition = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top trigger
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // ==========================================
  // 2. MOBILE MENU & SIDEBAR TRIGGER
  // ==========================================
  const burgerMenuBtn = document.getElementById('burger-menu');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  burgerMenuBtn.addEventListener('click', toggleMobileMenu);
  sidebarOverlay.addEventListener('click', closeMobileMenu);

  function toggleMobileMenu() {
    burgerMenuBtn.classList.toggle('open');
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
    
    // Prevent background scrolling when menu is open
    if (sidebar.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    burgerMenuBtn.classList.remove('open');
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }


  // ==========================================
  // 3. MEMBERSHIP PRICING TOGGLE
  // ==========================================
  const pricingCheckbox = document.getElementById('pricing-checkbox');
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleYearly = document.getElementById('toggle-yearly');

  // Prices variables
  const priceBasic = document.getElementById('price-basic');
  const priceAdvanced = document.getElementById('price-advanced');
  const pricePremium = document.getElementById('price-premium');

  const periodBasic = document.getElementById('period-basic');
  const periodAdvanced = document.getElementById('period-advanced');
  const periodPremium = document.getElementById('period-premium');

  const plansPrices = {
    monthly: { basic: '29', advanced: '49', premium: '89', period: '/ month' },
    yearly: { basic: '23', advanced: '39', premium: '71', period: '/ month (billed yearly)' }
  };

  pricingCheckbox.addEventListener('change', updatePricing);
  toggleMonthly.addEventListener('click', () => {
    pricingCheckbox.checked = false;
    updatePricing();
  });
  toggleYearly.addEventListener('click', () => {
    pricingCheckbox.checked = true;
    updatePricing();
  });

  function updatePricing() {
    const isYearly = pricingCheckbox.checked;
    const selectedMode = isYearly ? 'yearly' : 'monthly';

    // Add visual classes to toggles
    if (isYearly) {
      toggleYearly.classList.add('active');
      toggleMonthly.classList.remove('active');
    } else {
      toggleMonthly.classList.add('active');
      toggleYearly.classList.remove('active');
    }

    // Update prices with subtle fade animation
    const priceElements = [
      { el: priceBasic, val: plansPrices[selectedMode].basic },
      { el: priceAdvanced, val: plansPrices[selectedMode].advanced },
      { el: pricePremium, val: plansPrices[selectedMode].premium }
    ];

    const periodElements = [periodBasic, periodAdvanced, periodPremium];

    priceElements.forEach((item, index) => {
      // Fade out
      item.el.style.opacity = '0';
      item.el.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        item.el.textContent = item.val;
        periodElements[index].textContent = plansPrices[selectedMode].period;
        
        // Fade in
        item.el.style.opacity = '1';
        item.el.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Set initial transition styles on price elements
  [priceBasic, priceAdvanced, pricePremium].forEach(el => {
    if (el) {
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }
  });


  // ==========================================
  // 4. TESTIMONIAL SUCCESS STORIES CAROUSEL
  // ==========================================
  const carouselTrack = document.getElementById('carousel-track');
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentSlideIndex = 0;
  const totalSlides = carouselSlides.length;

  function updateCarousel() {
    const slideOffset = -currentSlideIndex * 100;
    carouselTrack.style.transform = `translateX(${slideOffset}%)`;
    
    // Manage button disabled states (if loop is not wanted, otherwise loop)
    // We will do looping for seamless UX
  }

  nextBtn.addEventListener('click', () => {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  // Auto slide testimonials every 8 seconds
  let autoSlideTimer = setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateCarousel();
  }, 8000);

  // Pause auto slide on manual interaction
  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      updateCarousel();
    }, 8000);
  };

  [prevBtn, nextBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', resetAutoSlide);
  });


  // ==========================================
  // 5. TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconClass = 'fa-circle-check';
    if (type === 'info') iconClass = 'fa-circle-info';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <div class="toast-content">
        <h6>${title}</h6>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Slide in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Slide out and remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }


  // ==========================================
  // 6. SIMULATED FORM SUBMISSIONS & INTERACTIONS
  // ==========================================
  
  // Free Trial Card Button
  const claimTrialBtn = document.getElementById('claim-trial-btn');
  claimTrialBtn.addEventListener('click', () => {
    claimTrialBtn.textContent = 'Processing...';
    claimTrialBtn.disabled = true;

    setTimeout(() => {
      showToast('Trial Activated', 'Your 7-Day Free Pass code has been sent to your email.');
      claimTrialBtn.textContent = 'Claim Your Pass';
      claimTrialBtn.disabled = false;
    }, 1500);
  });

  // Pricing SignUp Buttons
  const pricingButtons = document.querySelectorAll('.pricing-signup');
  pricingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      btn.textContent = 'Opening checkout...';
      btn.disabled = true;

      setTimeout(() => {
        showToast('Checkout Initiated', `Opening securing gateway for the ${planName} Plan.`, 'info');
        btn.textContent = planName === 'Advanced' ? 'Get Started' : 'Get Started';
        btn.disabled = false;
      }, 1200);
    });
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('.form-input');
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');

    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('Subscribed!', 'Welcome to the pack. Check your inbox for your first blueprint.');
      emailInput.value = '';
      submitBtn.textContent = 'Subscribe Now';
      submitBtn.disabled = false;
    }, 1500);
  });

  // App Store Download buttons
  const appIosBtn = document.getElementById('app-ios');
  const appAndroidBtn = document.getElementById('app-android');

  appIosBtn.addEventListener('click', () => {
    showToast('App Store Redirect', 'Opening Bull Gym Companion App page on iOS App Store...', 'info');
  });

  appAndroidBtn.addEventListener('click', () => {
    showToast('Play Store Redirect', 'Opening Bull Gym Companion App page on Google Play Store...', 'info');
  });


  // ==========================================
  // 7. SCROLL OBSERVER FOR REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .scale-in');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});
