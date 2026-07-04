document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     Custom Cursor Logic
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  // Track exact mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Make dot instantly follow the cursor
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth out the ring movement using lerp (Linear Interpolation)
  function animateCursor() {
    // Lerp calculation: current position + (target position - current position) * ease factor
    const ease = 0.15;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Highlight cursor on hoverable elements
  const hoverElements = document.querySelectorAll('a, button, .btn, .program-card, .pricing-card, .slider-arrow, .slider-dot, .hamburger, #pricing-checkbox');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('custom-cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('custom-cursor-hover');
    });
  });


  /* ==========================================================================
     Navbar & Navigation Sticky State + Dynamic Section Highlight
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Add scrolled class to navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic nav link active state based on section scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Triggers active when section covers at least the upper center of screen
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  /* ==========================================================================
     Mobile Navigation Hamburger Toggle
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    
    // Prevent background scrolling when menu is active on mobile
    if (navLinksContainer.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile navigation when clicking on a link
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  /* ==========================================================================
     Scroll Reveal Animation (Intersection Observer API)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to prevent animations re-triggering (portfolio performance best practice)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  /* ==========================================================================
     Pricing Toggle Monthly/Annually with Number Animation
     ========================================================================== */
  const pricingCheckbox = document.getElementById('pricing-checkbox');
  const labelMonthly = document.getElementById('label-monthly');
  const labelYearly = document.getElementById('label-yearly');
  
  const pricingCards = [
    { element: document.getElementById('price-standard'), target: 'price-standard' },
    { element: document.getElementById('price-performance'), target: 'price-performance' },
    { element: document.getElementById('price-vip'), target: 'price-vip' }
  ];

  pricingCheckbox.addEventListener('change', () => {
    const isYearly = pricingCheckbox.checked;

    if (isYearly) {
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
    }

    pricingCards.forEach(card => {
      const el = card.element;
      const targetVal = parseInt(isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly'));
      const startVal = parseInt(el.textContent);
      
      // Animate price numbers transitioning
      animateValue(el, startVal, targetVal, 300);
    });
  });

  // Smooth integer counter animation
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }


  /* ==========================================================================
     Testimonial Dynamic Carousel Slider with Touch Drag support
     ========================================================================== */
  const slider = document.getElementById('testimonials-slider');
  const cards = slider.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('slider-dots');
  const arrowPrev = document.getElementById('slide-prev');
  const arrowNext = document.getElementById('slide-next');

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragOffset = 0;

  // Determine items per page/slide based on viewport width
  function getVisibleItemsCount() {
    const width = window.innerWidth;
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  function getSlideLimit() {
    return cards.length - getVisibleItemsCount();
  }

  // Generate Navigation Dots dynamically based on count limits
  function setupDots() {
    dotsContainer.innerHTML = '';
    const dotsCount = getSlideLimit() + 1;
    
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateActiveDot() {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (index === currentIndex) {
        dot.classList.add('active');
      }
    });
  }

  function goToSlide(index) {
    const limit = getSlideLimit();
    // Clamp slide boundaries
    currentIndex = Math.max(0, Math.min(index, limit));
    
    // Slide container translation logic
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(slider).gap);
    const offset = currentIndex * (cardWidth + gap);
    
    slider.style.transform = `translateX(-${offset}px)`;
    updateActiveDot();
  }

  // Navigation Arrows click listeners
  arrowNext.addEventListener('click', () => {
    if (currentIndex < getSlideLimit()) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0); // Loop back to start
    }
  });

  arrowPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(getSlideLimit()); // Loop back to end
    }
  });

  // Touch and Mouse Drag Sliding
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    // Extract current CSS translation value
    const transformMatrix = window.getComputedStyle(slider).transform;
    if (transformMatrix !== 'none') {
      scrollLeft = parseFloat(transformMatrix.split(',')[4]);
    } else {
      scrollLeft = 0;
    }
    slider.style.transition = 'none'; // Disable transition during drag
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    dragOffset = x - startX;
    slider.style.transform = `translateX(${scrollLeft + dragOffset}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    
    // Evaluate drag offset distance
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(slider).gap);
    const threshold = cardWidth / 4; // Slide must be dragged at least 25% of card width
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    } else {
      goToSlide(currentIndex); // Snap back to original position
    }
    dragOffset = 0;
  });

  // Touch handlers for mobile
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
    const transformMatrix = window.getComputedStyle(slider).transform;
    if (transformMatrix !== 'none') {
      scrollLeft = parseFloat(transformMatrix.split(',')[4]);
    } else {
      scrollLeft = 0;
    }
    slider.style.transition = 'none';
  });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    dragOffset = x - startX;
    slider.style.transform = `translateX(${scrollLeft + dragOffset}px)`;
  });

  slider.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    
    const cardWidth = cards[0].offsetWidth;
    const threshold = cardWidth / 4;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    } else {
      goToSlide(currentIndex);
    }
    dragOffset = 0;
  });

  // Re-adjust slider calculations on window resizing
  window.addEventListener('resize', () => {
    setupDots();
    goToSlide(currentIndex);
  });

  // Init Carousel Slider
  setupDots();
  goToSlide(0);

});
