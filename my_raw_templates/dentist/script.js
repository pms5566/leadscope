document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Navbar Scroll Effect ---
  const header = document.querySelector('.navbar-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Hamburger Menu ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      
      // Update active link highlight
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // --- Treatments/Services Tab System ---
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const servicePanels = document.querySelectorAll('.service-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Update active tab buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Swap active panels
      servicePanels.forEach(panel => {
        panel.classList.remove('active');
        // If it matches target tab
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- Testimonials / Reviews Slider ---
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  let currentSlideIndex = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Boundary check
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    slides[currentSlideIndex].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    showSlide(currentSlideIndex + 1);
  });

  prevBtn.addEventListener('click', () => {
    showSlide(currentSlideIndex - 1);
  });

  // Auto-play testimonial slides every 8 seconds
  let slideInterval = setInterval(() => {
    showSlide(currentSlideIndex + 1);
  }, 8000);

  // Clear auto-play when user manually navigates
  const resetSlideTimer = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 8000);
  };

  prevBtn.addEventListener('click', resetSlideTimer);
  nextBtn.addEventListener('click', resetSlideTimer);

  // --- FAQ Accordion System ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const faqItem = trigger.parentElement;
      const faqContent = faqItem.querySelector('.faq-content');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items for a clean accordion behavior
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-content').style.maxHeight = null;
      });

      // Toggle current FAQ item
      if (!isActive) {
        faqItem.classList.add('active');
        // Set dynamic height for smooth animation
        faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
      }
    });
  });

  // --- Appointment Booking Simulation ---
  const bookingForm = document.getElementById('appointment-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');
  
  // Modal placeholder targets
  const modalUserTarget = document.getElementById('modal-user-name');
  const modalServiceTarget = document.getElementById('modal-service-name');
  const modalDateTarget = document.getElementById('modal-date-val');
  const modalPhoneTarget = document.getElementById('modal-phone-val');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const nameVal = document.getElementById('form-name').value;
    const phoneVal = document.getElementById('form-phone').value;
    const serviceSelect = document.getElementById('form-service');
    const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
    
    // Format date nicely
    const dateInputVal = document.getElementById('form-date').value;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateInputVal).toLocaleDateString('en-US', dateOptions);

    // Populate Success Modal Values
    modalUserTarget.textContent = nameVal;
    modalServiceTarget.textContent = serviceText;
    modalDateTarget.textContent = formattedDate;
    modalPhoneTarget.textContent = phoneVal;

    // Show Success Modal
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling background

    // Reset Form fields
    bookingForm.reset();
  });

  // Close success modal click listener
  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling background
  });

  // Close modal when clicking on overlay background
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

});
