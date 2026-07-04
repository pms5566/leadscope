/* ==========================================================================
   VELINA & CO. BEAUTY ATELIER - CORE JS INTERACTION
   Interactive service tabs, drawer cart management, and booking modal wizard
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. STICKY HEADER & MOBILE NAVIGATION
    // ==========================================================================
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close Mobile Menu on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuToggle && navMenu) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });


    // ==========================================================================
    // 2. DYNAMIC OFFERINGS TABS
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status from current active tab
            document.querySelector('.tab-btn.active').classList.remove('active');
            // Add active status to clicked tab
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            // Toggle visibility of service cards with transition
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.style.display = 'flex';
                    // Trigger reflow for transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // ==========================================================================
    // 3. CART SELECTION SYSTEM (S-SPA INTERACTIVE DRAWER)
    // ==========================================================================
    let selectedServices = [];
    const cartTrigger = document.getElementById('cart-trigger');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    
    const cartCount = document.getElementById('cart-count');
    const emptyCartMsg = document.getElementById('empty-cart-message');
    const cartItemsList = document.getElementById('cart-items-list');
    
    const cartTotalTime = document.getElementById('cart-total-time');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const selectServiceBtns = document.querySelectorAll('.select-service-btn');

    // Cart Panel Toggling
    function toggleCartDrawer() {
        cartDrawer.classList.toggle('active');
    }

    if (cartTrigger) cartTrigger.addEventListener('click', toggleCartDrawer);
    if (closeCart) closeCart.addEventListener('click', toggleCartDrawer);
    if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', toggleCartDrawer);

    // Add / Remove from Selection Buttons
    selectServiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const duration = parseInt(btn.getAttribute('data-duration'));

            const serviceIndex = selectedServices.findIndex(item => item.id === id);

            if (serviceIndex === -1) {
                // Add Service
                selectedServices.push({ id, name, price, duration });
                btn.textContent = 'Selected';
                btn.classList.add('added');
                // Open drawer to give instant visual response
                setTimeout(() => {
                    if (!cartDrawer.classList.contains('active')) {
                        toggleCartDrawer();
                    }
                }, 150);
            } else {
                // Remove Service
                selectedServices.splice(serviceIndex, 1);
                btn.textContent = 'Add to Session';
                btn.classList.remove('added');
            }

            updateCartUI();
        });
    });

    // Update Cart HTML and Summary
    function updateCartUI() {
        // Count update
        cartCount.textContent = selectedServices.length;

        if (selectedServices.length === 0) {
            emptyCartMsg.style.display = 'flex';
            cartItemsList.style.display = 'none';
            checkoutBtn.disabled = true;
        } else {
            emptyCartMsg.style.display = 'none';
            cartItemsList.style.display = 'block';
            checkoutBtn.disabled = false;
        }

        // Render Cart Items
        cartItemsList.innerHTML = '';
        let totalCost = 0;
        let totalDuration = 0;

        selectedServices.forEach(item => {
            totalCost += item.price;
            totalDuration += item.duration;

            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-meta">${item.duration} Mins</span>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-price">$${item.price}</span>
                    <button class="remove-cart-item" data-id="${item.id}" aria-label="Remove ${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });

        // Update Totals
        cartTotalTime.textContent = `${totalDuration} Mins`;
        cartTotalPrice.textContent = `$${totalCost}`;

        // Bind remove actions in drawer
        const removeBtns = document.querySelectorAll('.remove-cart-item');
        removeBtns.forEach(rBtn => {
            rBtn.addEventListener('click', () => {
                const id = rBtn.getAttribute('data-id');
                const serviceIndex = selectedServices.findIndex(item => item.id === id);
                if (serviceIndex !== -1) {
                    selectedServices.splice(serviceIndex, 1);
                    
                    // Reset styling on corresponding catalog card button
                    const catalogBtn = document.getElementById(`btn-${id}`);
                    if (catalogBtn) {
                        catalogBtn.textContent = 'Add to Session';
                        catalogBtn.classList.remove('added');
                    }
                    
                    updateCartUI();
                }
            });
        });
    }


    // ==========================================================================
    // 4. INTERACTIVE BOOKING WIZARD MODAL
    // ==========================================================================
    const bookingModalWrapper = document.getElementById('booking-modal-wrapper');
    const bookingModalCloseOverlay = document.getElementById('booking-modal-close-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const progressFill = document.getElementById('progress-fill');
    
    // Wizard step components
    const stepLabels = [
        document.getElementById('step-label-1'),
        document.getElementById('step-label-2'),
        document.getElementById('step-label-3')
    ];
    const steps = [
        document.getElementById('modal-step-1'),
        document.getElementById('modal-step-2'),
        document.getElementById('modal-step-3')
    ];

    // Form inputs and selection items
    const calendarDays = document.querySelectorAll('.calendar-day:not(.disabled)');
    const timeSlots = document.querySelectorAll('.time-slot');
    const stylistSelect = document.getElementById('stylist-select');
    const step1Summary = document.getElementById('step-1-summary');
    
    const nextBtn1 = document.getElementById('modal-next-1');
    const backBtn2 = document.getElementById('modal-back-2');
    const submitBookingBtn = document.getElementById('modal-submit');
    const finishBtn = document.getElementById('modal-finish-btn');
    const bookingForm = document.getElementById('booking-form');

    // State Variables for Booking Wizard
    let selectedDate = '2026-07-01'; // Default first item
    let selectedTime = '10:30 AM'; // Default first selected
    let selectedStylist = 'any';

    // Show/Hide Booking Wizard Modal
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Close Cart Drawer first
            cartDrawer.classList.remove('active');
            // Reset Wizard to Step 1
            goToStep(0);
            // Open Modal
            bookingModalWrapper.classList.add('active');
        });
    }

    function closeModal() {
        bookingModalWrapper.classList.remove('active');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (bookingModalCloseOverlay) bookingModalCloseOverlay.addEventListener('click', closeModal);

    // Switch Wizard Steps
    function goToStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.style.display = 'flex';
                stepLabels[index].classList.add('active');
            } else {
                step.style.display = 'none';
                stepLabels[index].classList.remove('active');
            }
        });

        // Update progress bar width
        const progressPercentage = ((stepIndex + 1) / 3) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    // Step 1: Calendar Date Selection
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            const currentSelected = document.querySelector('.calendar-day.selected');
            if (currentSelected) currentSelected.classList.remove('selected');
            
            day.classList.add('selected');
            selectedDate = day.getAttribute('data-date');
            updateStep1Summary();
        });
    });

    // Step 1: Time Slot Selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const currentSelected = document.querySelector('.time-slot.selected');
            if (currentSelected) currentSelected.classList.remove('selected');

            slot.classList.add('selected');
            selectedTime = slot.getAttribute('data-time');
            updateStep1Summary();
        });
    });

    // Step 1: Stylist Select Option
    if (stylistSelect) {
        stylistSelect.addEventListener('change', () => {
            selectedStylist = stylistSelect.value;
        });
    }

    function updateStep1Summary() {
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        step1Summary.textContent = `Selected: ${formattedDate} at ${selectedTime}`;
    }

    // Next from Step 1 to Step 2
    if (nextBtn1) {
        nextBtn1.addEventListener('click', () => {
            goToStep(1);
        });
    }

    // Back from Step 2 to Step 1
    if (backBtn2) {
        backBtn2.addEventListener('click', () => {
            goToStep(0);
        });
    }

    // Step 2 Submission (Reservation Booking)
    if (submitBookingBtn) {
        submitBookingBtn.addEventListener('click', (e) => {
            // Validate form
            if (bookingForm.checkValidity()) {
                e.preventDefault();
                processBookingConfirmation();
            } else {
                // Focus on invalid inputs
                bookingForm.reportValidity();
            }
        });
    }

    // Process confirmation values and finalize session
    function processBookingConfirmation() {
        // Generate random confirmation code
        const confCode = 'VLN-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('conf-code').textContent = confCode;

        // Map stylist display name
        let stylistName = 'No Preference';
        if (selectedStylist === 'isabella') stylistName = 'Isabella Vance (Color Director)';
        else if (selectedStylist === 'marcus') stylistName = 'Marcus Chen (Precision Cutting)';
        else if (selectedStylist === 'sophia') stylistName = 'Dr. Sophia Laurent (Aesthetician)';
        else if (selectedStylist === 'david') stylistName = 'David Sterling (Body Therapist)';
        document.getElementById('conf-artisan').textContent = stylistName;

        // Map date & time
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        document.getElementById('conf-datetime').textContent = `${formattedDate} at ${selectedTime}`;

        // Map service offerings list
        const serviceNames = selectedServices.map(s => s.name).join(', ');
        document.getElementById('conf-services').textContent = serviceNames;

        // Map total price
        let totalPrice = 0;
        selectedServices.forEach(s => totalPrice += s.price);
        document.getElementById('conf-price').textContent = `$${totalPrice.toFixed(2)}`;

        // Move to step 3
        goToStep(2);

        // Clear cart selections
        clearCartSelection();
    }

    function clearCartSelection() {
        selectedServices = [];
        selectServiceBtns.forEach(btn => {
            btn.textContent = 'Add to Session';
            btn.classList.remove('added');
        });
        updateCartUI();
    }

    // Step 3 Finish Button
    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            closeModal();
            // Reset wizard step
            setTimeout(() => {
                goToStep(0);
                if (bookingForm) bookingForm.reset();
            }, 300);
        });
    }


    // ==========================================================================
    // 5. MASTER ARTISANS HORIZONTAL CAROUSEL
    // ==========================================================================
    const artisansTrack = document.getElementById('artisans-track');
    const prevArtisanBtn = document.getElementById('prev-artisan');
    const nextArtisanBtn = document.getElementById('next-artisan');
    
    if (artisansTrack && prevArtisanBtn && nextArtisanBtn) {
        let artisanIndex = 0;
        const totalCards = document.querySelectorAll('.artisan-card').length;
        
        function getCardsPerPage() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 1200) return 2;
            return 3;
        }

        function slideArtisans() {
            const cardsPerPage = getCardsPerPage();
            const maxIdx = totalCards - cardsPerPage;
            
            if (artisanIndex > maxIdx) artisanIndex = maxIdx;
            if (artisanIndex < 0) artisanIndex = 0;

            const cardWidth = document.querySelector('.artisan-card').offsetWidth;
            const gap = parseFloat(window.getComputedStyle(artisansTrack).gap);
            const translateValue = -artisanIndex * (cardWidth + gap);
            
            artisansTrack.style.transform = `translateX(${translateValue}px)`;

            // Toggle arrow states
            prevArtisanBtn.disabled = artisanIndex === 0;
            nextArtisanBtn.disabled = artisanIndex === maxIdx;
            prevArtisanBtn.style.opacity = artisanIndex === 0 ? '0.5' : '1';
            nextArtisanBtn.style.opacity = artisanIndex === maxIdx ? '0.5' : '1';
        }

        nextArtisanBtn.addEventListener('click', () => {
            const cardsPerPage = getCardsPerPage();
            if (artisanIndex < totalCards - cardsPerPage) {
                artisanIndex++;
                slideArtisans();
            }
        });

        prevArtisanBtn.addEventListener('click', () => {
            if (artisanIndex > 0) {
                artisanIndex--;
                slideArtisans();
            }
        });

        // Initialize state
        slideArtisans();

        // Responsive slide adjust
        window.addEventListener('resize', () => {
            slideArtisans();
        });
    }


    // ==========================================================================
    // 6. CLIENT TESTIMONIALS SLIDER
    // ==========================================================================
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
    let currentSlide = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        testimonialSlides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showTestimonial(index);
            resetTestimonialTimer();
        });
    });

    function autoSlideTestimonial() {
        let next = currentSlide + 1;
        if (next >= testimonialSlides.length) next = 0;
        showTestimonial(next);
    }

    function resetTestimonialTimer() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(autoSlideTestimonial, 8000);
    }

    // Initialize auto slider
    resetTestimonialTimer();

});
