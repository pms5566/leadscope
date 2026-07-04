/* ==========================================================================
   APEX DETAILING & CERAMIC COATING - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. SCROLL HEADER & ACTIVE LINK HANDLING
     --------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header background change on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Dynamic active navigation indicator
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });


  /* ---------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER TOGGLE
     --------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navItems = document.querySelectorAll('.main-nav a');

  mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    const isExpanded = mainNav.classList.contains('active');
    mobileToggle.innerHTML = isExpanded ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Close nav on click (for mobile experience)
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mainNav.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });


  /* ---------------------------------------------------------
     3. REVEAL-ON-SCROLL ANIMATION (INTERSECTION OBSERVER)
     --------------------------------------------------------- */
  const scrollElements = document.querySelectorAll('.reveal-on-scroll');

  const elementInView = (el, dividend = 1.15) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('revealed');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.1)) {
        displayScrollElement(el);
      }
    });
  };

  window.addEventListener('scroll', handleScrollAnimation);
  // Initial check on load
  setTimeout(handleScrollAnimation, 300);


  /* ---------------------------------------------------------
     4. SERVICE SECTION TAB CONTROL
     --------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      // Update active button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active content with smooth transition
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === `tab-${tabTarget}`) {
          // Trigger slight reflow to restart transition
          void content.offsetWidth;
          content.classList.add('active');
        }
      });
    });
  });


  /* ---------------------------------------------------------
     5. BEFORE/AFTER SLIDER INTERACTIVE DRAG
     --------------------------------------------------------- */
  const slider = document.getElementById('paint-slider');
  const beforeWrapper = document.getElementById('before-wrapper');
  const handle = document.getElementById('slider-handle');
  const beforeImg = beforeWrapper.querySelector('img');

  let isDragging = false;

  const updateSliderWidth = () => {
    // Dynamic matching of the underlying before image's width to the slider container container size
    const sliderWidth = slider.offsetWidth;
    beforeImg.style.width = sliderWidth + 'px';
  };

  window.addEventListener('resize', updateSliderWidth);
  updateSliderWidth(); // Trigger initially

  const moveSlider = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    
    // Convert to percentage and constrain
    let percentage = (x / width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    // Apply values
    beforeWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Mouse & Touch events
  const startDrag = () => { isDragging = true; };
  const endDrag = () => { isDragging = false; };

  handle.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });

  handle.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', endDrag);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      moveSlider(e.touches[0].clientX);
    }
  }, { passive: true });

  // Optional: Click anywhere on slider to jump position
  slider.addEventListener('click', (e) => {
    // Avoid double clicking triggers if handle button itself is clicked
    if (e.target.closest('#slider-handle')) return;
    moveSlider(e.clientX);
  });


  /* ---------------------------------------------------------
     6. INTERACTIVE PRICING ESTIMATOR & FORM PRE-FILL
     --------------------------------------------------------- */
  const vehicleRadios = document.querySelectorAll('input[name="vehicle-type"]');
  const radioCards = document.querySelectorAll('.radio-card');
  const servicesCheckboxes = document.querySelectorAll('input[name="services"]');
  const checkboxCards = document.querySelectorAll('.checkbox-card');

  // DOM Elements for summary
  const summaryVehicleName = document.getElementById('summary-vehicle-name');
  const priceBase = document.getElementById('price-base');
  const rowCorrection = document.getElementById('row-correction');
  const priceCorrection = document.getElementById('price-correction');
  const rowCeramic = document.getElementById('row-ceramic');
  const priceCeramic = document.getElementById('price-ceramic');
  const priceTotal = document.getElementById('price-total');
  const durationVal = document.getElementById('duration-val');
  
  const bookingSelect = document.getElementById('booking-package');
  const preFillBtn = document.getElementById('btn-pre-fill');

  // Interactive UI highlights for selections
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radioInput = card.querySelector('input[type="radio"]');
      radioInput.checked = true;
      calculateEstimate();
    });
  });

  checkboxCards.forEach(card => {
    const chk = card.querySelector('input[type="checkbox"]');
    
    // Detailing base checkbox is locked
    if (chk.disabled) return;

    card.addEventListener('click', (e) => {
      // Prevent double trigger if clicking directly on checkbox input
      if (e.target !== chk) {
        chk.checked = !chk.checked;
      }
      card.classList.toggle('active', chk.checked);
      calculateEstimate();
    });
  });

  // Estimation pricing matrices
  const PRICING = {
    sedan: {
      name: "Sedan / Coupe",
      base: 199,
      correction: 250,
      ceramic: 400,
      preFillValues: {
        base: 'sedan-detailing',
        correction: 'sedan-correction',
        ceramic: 'sedan-all'
      }
    },
    suv: {
      name: "Crossover / SUV",
      base: 249,
      correction: 300,
      ceramic: 500,
      preFillValues: {
        base: 'suv-detailing',
        correction: 'suv-correction',
        ceramic: 'suv-all'
      }
    },
    truck: {
      name: "Truck / Van",
      base: 299,
      correction: 350,
      ceramic: 600,
      preFillValues: {
        base: 'truck-detailing',
        correction: 'truck-correction',
        ceramic: 'truck-all'
      }
    }
  };

  function calculateEstimate() {
    // Get active vehicle type
    let selectedVehicle = 'sedan';
    vehicleRadios.forEach(radio => {
      if (radio.checked) {
        selectedVehicle = radio.value;
      }
    });

    const rates = PRICING[selectedVehicle];
    summaryVehicleName.textContent = rates.name;
    
    // Base detailing calculations
    priceBase.textContent = `$${rates.base}`;
    let total = rates.base;
    let hasCorrection = false;
    let hasCeramic = false;

    // Check optional packages
    servicesCheckboxes.forEach(chk => {
      if (chk.checked) {
        if (chk.value === 'correction') {
          hasCorrection = true;
          total += rates.correction;
          priceCorrection.textContent = `$${rates.correction}`;
          rowCorrection.classList.remove('hidden');
        }
        if (chk.value === 'ceramic') {
          hasCeramic = true;
          total += rates.ceramic;
          priceCeramic.textContent = `$${rates.ceramic}`;
          rowCeramic.classList.remove('hidden');
        }
      }
    });

    if (!hasCorrection) rowCorrection.classList.add('hidden');
    if (!hasCeramic) rowCeramic.classList.add('hidden');

    // Update prices & duration text
    priceTotal.textContent = `$${total}`;

    let durationText = "4 - 6 Hours";
    if (hasCorrection && hasCeramic) {
      durationText = "2 - 3 Days (Complex Cure)";
    } else if (hasCorrection) {
      durationText = "1 - 2 Days";
    } else if (hasCeramic) {
      durationText = "1 - 2 Days (Coating Cure)";
    }
    durationVal.textContent = durationText;

    // Determine booking dropdown value matching calculations
    let selectVal = rates.preFillValues.base;
    if (hasCorrection && hasCeramic) {
      selectVal = rates.preFillValues.ceramic;
    } else if (hasCorrection || hasCeramic) {
      // If they have only one, we map to correction packages as fallback/best fit
      selectVal = hasCorrection ? rates.preFillValues.correction : rates.preFillValues.ceramic;
    }
    bookingSelect.value = selectVal;
  }

  // Pre-fill booking form scroll trigger
  preFillBtn.addEventListener('click', () => {
    // Calculate one more time just to verify sync
    calculateEstimate();
    
    // Highlight contact package block briefly
    bookingSelect.style.borderColor = 'var(--accent-cyan)';
    bookingSelect.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.4)';
    
    setTimeout(() => {
      bookingSelect.style.borderColor = '';
      bookingSelect.style.boxShadow = '';
    }, 2000);
  });

  // Calculate initially to establish defaults
  calculateEstimate();


  /* ---------------------------------------------------------
     7. TESTIMONIAL CAROUSEL DYNAMIC LOOP
     --------------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let carouselInterval;

  const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startCarousel = () => {
    carouselInterval = setInterval(nextSlide, 5000);
  };

  const stopCarousel = () => {
    clearInterval(carouselInterval);
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopCarousel();
      const slideIndex = parseInt(dot.getAttribute('data-slide'));
      showSlide(slideIndex);
      startCarousel(); // Restart interval timer
    });
  });

  // Start automation
  startCarousel();


  /* ---------------------------------------------------------
     8. RESERVATION FORM VALIDATION & SUCCESS FEEDBACK
     --------------------------------------------------------- */
  const bookingForm = document.getElementById('booking-form');
  const successMsg = document.getElementById('booking-success');
  const resetBtn = document.getElementById('btn-reset-form');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation checks
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const date = document.getElementById('booking-date').value;

    if (!name || !phone || !email || !date) {
      alert('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    // Successful submission simulation
    bookingForm.classList.add('hidden');
    successMsg.classList.remove('hidden');
    
    // Smooth scroll success box into view if needed
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  resetBtn.addEventListener('click', () => {
    bookingForm.reset();
    calculateEstimate(); // Reset calculator values too
    successMsg.classList.add('hidden');
    bookingForm.classList.remove('hidden');
  });

  // Prevent selecting dates in the past for appointment booking
  const dateInput = document.getElementById('booking-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

});
