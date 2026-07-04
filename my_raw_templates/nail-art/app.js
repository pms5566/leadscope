/* ==========================================================================
   LUXURY by JEMM - Application Logic (Vanilla JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Loader Animation Fade Out --- */
    const loader = document.getElementById('loader');
    
    // Simulate loading for loading bar effect
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 2200);

    /* --- Custom Cursor Logic (Desktop Only) --- */
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor dot position
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });
    
    // Smooth lagging follower cursor
    function animateCursor() {
        // Calculate the lag
        const lagSpeed = 0.15; // lower is slower
        cursorX += (mouseX - cursorX) * lagSpeed;
        cursorY += (mouseY - cursorY) * lagSpeed;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover states for interactive items
    const hoverElements = document.querySelectorAll('a, button, input, select, textarea, label, .filter-btn, .time-slot-btn, .service-option');
    
    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
        });
        elem.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
        });
    });

    /* --- Navigation Scroll Handler --- */
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Overlay --- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* --- Scroll Reveal (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });

    /* --- Portfolio Gallery Filter --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Trigger fade in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400); // match CSS transitions
                }
            });
        });
    });

    /* --- Interactive Multi-Step Booking Widget --- */
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    let currentStep = 1;
    let selectedServices = [];
    let selectedDate = 'July 1, 2026';
    let selectedTime = '12:00 PM';
    
    // Step navigation buttons
    const nextToStep2 = document.getElementById('next-to-step2');
    const nextToStep3 = document.getElementById('next-to-step3');
    const prevToStep1 = document.getElementById('prev-to-step1');
    const prevToStep2 = document.getElementById('prev-to-step2');
    const submitBtn = document.getElementById('btn-submit-booking');
    const resetBtn = document.getElementById('btn-reset-booking');
    
    // Helper to transition steps
    function navigateToStep(stepNumber) {
        // Transition form body
        steps.forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Update Step Indicators
        stepIndicators.forEach(ind => {
            const indStep = parseInt(ind.getAttribute('data-step'));
            ind.classList.remove('active', 'completed');
            
            if (indStep === stepNumber) {
                ind.classList.add('active');
            } else if (indStep < stepNumber) {
                ind.classList.add('completed');
            }
        });
        
        currentStep = stepNumber;
    }
    
    // Step 1 check selection & continue
    if (nextToStep2) {
        nextToStep2.addEventListener('click', () => {
            const checkedBoxes = document.querySelectorAll('input[name="services"]:checked');
            selectedServices = Array.from(checkedBoxes).map(cb => cb.value);
            
            if (selectedServices.length === 0) {
                alert('Please select at least one beauty service to continue.');
                return;
            }
            
            navigateToStep(2);
        });
    }
    
    // Step 2 time slot selection
    const timeSlots = document.querySelectorAll('.time-slot-btn');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTime = slot.getAttribute('data-time');
        });
    });
    
    // Step 2 mock calendar select day
    const calendarDays = document.querySelectorAll('.calendar-days span.active-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            calendarDays.forEach(d => d.classList.remove('selected'));
            day.classList.add('selected');
            selectedDate = `July ${day.textContent}, 2026`;
        });
    });
    
    if (nextToStep3) {
        nextToStep3.addEventListener('click', () => {
            navigateToStep(3);
        });
    }
    
    if (prevToStep1) {
        prevToStep1.addEventListener('click', () => {
            navigateToStep(1);
        });
    }
    
    if (prevToStep2) {
        prevToStep2.addEventListener('click', () => {
            navigateToStep(2);
        });
    }
    
    // Step 3 validation & submit
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('guest-name');
            const phoneInput = document.getElementById('guest-phone');
            
            if (!nameInput.value.trim() || !phoneInput.value.trim()) {
                alert('Please fill out your Name and Phone / WhatsApp number.');
                return;
            }
            
            // Build Success Summary
            document.getElementById('summary-name').textContent = nameInput.value;
            document.getElementById('summary-services').textContent = selectedServices.join(', ');
            document.getElementById('summary-datetime').textContent = `${selectedDate} at ${selectedTime}`;
            document.getElementById('summary-phone').textContent = phoneInput.value;
            
            // Navigate to Success state
            navigateToStep('success');
        });
    }
    
    // Reset booking widget
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Uncheck checkboxes
            document.querySelectorAll('input[name="services"]').forEach(cb => cb.checked = false);
            
            // Reset input values
            document.getElementById('guest-name').value = '';
            document.getElementById('guest-phone').value = '';
            document.getElementById('guest-notes').value = '';
            
            // Back to Step 1
            navigateToStep(1);
        });
    }
});
