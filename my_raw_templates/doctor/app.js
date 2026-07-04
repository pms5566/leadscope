document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. HEADER SCROLL SHADOW EFFECT
    // ==========================================================================
    const header = document.getElementById('site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // ==========================================================================
    // 2. MOBILE DRAWER NAVIGATION MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    const toggleMenu = () => {
        const isActive = menuToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        mobileDrawer.setAttribute('aria-hidden', !isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // ==========================================================================
    // 3. STATS COUNTUP ANIMATION (VIEWPORT TRIGGERED)
    // ==========================================================================
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 1500; // milliseconds
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                stat.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };
            
            requestAnimationFrame(updateCount);
        });
    };
    
    if ('IntersectionObserver' in window && statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateStats();
                    animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statsSection);
    } else {
        // Fallback for older browsers
        setTimeout(animateStats, 1000);
    }
    
    // ==========================================================================
    // 4. INTERACTIVE WELLNESS QUIZ
    // ==========================================================================
    const quizWidget = document.getElementById('quiz-widget');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const progressFill = document.getElementById('quiz-progress-fill');
    const prevButtons = document.querySelectorAll('.quiz-prev-btn');
    const resetQuizBtn = document.getElementById('reset-quiz-btn');
    
    let quizState = {
        currentStep: 1,
        answers: {
            goal: '',
            age: '',
            timing: ''
        }
    };
    
    const updateQuizUI = () => {
        // Update Step Active Class
        quizSteps.forEach(step => {
            step.classList.remove('active');
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum === quizState.currentStep) {
                step.classList.add('active');
            }
        });
        
        // Show result screen if we reach the end
        if (quizState.currentStep === 4) {
            document.getElementById('quiz-result-step').classList.add('active');
            showQuizResults();
        }
        
        // Progress Fill Percentages
        const progressPercentage = ((quizState.currentStep - 1) / 3) * 100 + 25;
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    };
    
    // Handle option click
    const handleOptionSelect = (btn, stepNum) => {
        // Clear previous selections in this step
        const stepContainer = btn.closest('.quiz-step');
        stepContainer.querySelectorAll('.quiz-opt-btn').forEach(o => o.classList.remove('selected'));
        
        // Add selected class
        btn.classList.add('selected');
        const selectedValue = btn.getAttribute('data-value');
        
        // Save answers
        if (stepNum === 1) quizState.answers.goal = selectedValue;
        if (stepNum === 2) quizState.answers.age = selectedValue;
        if (stepNum === 3) quizState.answers.timing = selectedValue;
        
        // Automatically advance with smooth visual delay
        setTimeout(() => {
            quizState.currentStep++;
            updateQuizUI();
        }, 350);
    };
    
    // Event listeners for Quiz Option buttons
    quizSteps.forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.querySelectorAll('.quiz-opt-btn').forEach(btn => {
            btn.addEventListener('click', () => handleOptionSelect(btn, stepNum));
        });
    });
    
    // Back Buttons
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (quizState.currentStep > 1) {
                quizState.currentStep--;
                updateQuizUI();
            }
        });
    });
    
    // Reset Quiz
    if (resetQuizBtn) {
        resetQuizBtn.addEventListener('click', () => {
            quizState.currentStep = 1;
            quizState.answers = { goal: '', age: '', timing: '' };
            // Clear all visual option states
            quizWidget.querySelectorAll('.quiz-opt-btn').forEach(o => o.classList.remove('selected'));
            updateQuizUI();
        });
    }
    
    // Process results
    const showQuizResults = () => {
        const resultTitle = document.getElementById('recommended-service-title');
        const resultDesc = document.getElementById('recommended-service-desc');
        const bookingSelect = document.getElementById('booking-service');
        
        let serviceValue = 'preventive'; // Default fallback
        let title = 'Preventive Health & Wellness';
        let desc = 'Based on your age and wellness goals, we recommend a proactive health consultation. This enables Dr. Jenkins to evaluate biometric parameters, schedule age-specific screenings, and construct a custom lifestyle blueprint.';
        
        if (quizState.answers.goal === 'primary-care') {
            serviceValue = 'primary-care';
            title = 'Comprehensive Primary Care';
            desc = 'Given your acute symptoms or check-up needs, our Primary Care service is ideal. We allocate up to 60 minutes for initial consults to complete a deep, unhurried assessment of your general health issues.';
        } else if (quizState.answers.goal === 'aesthetics') {
            serviceValue = 'aesthetics';
            title = 'Aesthetics & Skin Consultation';
            desc = 'For clinical skincare planning and healthy aging strategies, we suggest our specialized Skin Consultation. Dr. Jenkins reviews skin characteristics, products, and maps non-invasive options suited for you.';
        } else if (quizState.answers.goal === 'pediatrics' || quizState.answers.age === 'child') {
            serviceValue = 'pediatrics';
            title = 'Family Medicine & Pediatrics';
            desc = 'For child wellness checks, adolescent counseling, or family medicine, this service provides direct care. Dr. Jenkins is excellent with kids, facilitating sports physicals and developmental check-ins in a safe environment.';
        }
        
        // Display results
        resultTitle.textContent = title;
        resultDesc.textContent = desc;
        
        // Auto select service in the Booking Form
        if (bookingSelect) {
            bookingSelect.value = serviceValue;
            // Trigger visual validation update
            const formGroup = bookingSelect.closest('.form-group');
            if (formGroup) formGroup.classList.remove('invalid');
        }
    };
    
    // quiz-to-booking button transitions smoothly
    const quizToBookingBtn = document.getElementById('quiz-to-booking-btn');
    if (quizToBookingBtn) {
        quizToBookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = quizToBookingBtn.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                targetElem.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ==========================================================================
    // 5. TESTIMONIAL CAROUSEL SLIDER (WITH SWIPE SUPPORT)
    // ==========================================================================
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dot');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const track = document.getElementById('testimonials-track');
    
    let currentIndex = 0;
    
    const showTestimonial = (index) => {
        // Handle overflow boundaries
        if (index >= testimonials.length) index = 0;
        if (index < 0) index = testimonials.length - 1;
        
        currentIndex = index;
        
        // Slide track horizontally
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Toggle active states on cards and dots
        testimonials.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };
    
    if (nextSlideBtn && prevSlideBtn) {
        nextSlideBtn.addEventListener('click', () => showTestimonial(currentIndex + 1));
        prevSlideBtn.addEventListener('click', () => showTestimonial(currentIndex - 1));
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showTestimonial(index);
        });
    });
    
    // Swipe gestures support for Mobile Viewports
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });
    }
    
    const handleSwipeGesture = () => {
        if (touchStartX - touchEndX > 50) {
            // Swiped left (next)
            showTestimonial(currentIndex + 1);
        }
        if (touchEndX - touchStartX > 50) {
            // Swiped right (prev)
            showTestimonial(currentIndex - 1);
        }
    };
    
    // ==========================================================================
    // 6. ACCORDION FAQ LOGIC
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close other open accordions
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-content').style.maxHeight = '0';
                    otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
                }
            });
            
            // Toggle current accordion
            item.classList.toggle('active');
            trigger.setAttribute('aria-expanded', !isOpen);
            content.setAttribute('aria-hidden', isOpen);
            
            if (!isOpen) {
                content.style.maxHeight = `${content.scrollHeight}px`;
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
    
    // ==========================================================================
    // 7. BOOKING FORM VALIDATION & MODAL SUBMISSION
    // ==========================================================================
    const bookingForm = document.getElementById('booking-form');
    const dateInput = document.getElementById('booking-date');
    const timeSlots = document.getElementById('time-slots');
    const timeHiddenInput = document.getElementById('booking-time');
    
    // Modal Selectors
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const confNameSpan = document.getElementById('conf-patient-name');
    const confServiceSpan = document.getElementById('conf-service');
    const confDateTimeSpan = document.getElementById('conf-datetime');
    const confTypeSpan = document.getElementById('conf-type');
    const confPhoneSpan = document.getElementById('conf-phone');
    
    // Set Minimum Date Constraint on Date Input (cannot book past dates)
    const setMinDateConstraint = () => {
        if (dateInput) {
            const today = new Date();
            const year = today.getFullYear();
            let month = today.getMonth() + 1;
            let day = today.getDate();
            
            // Pad single digit months/days
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            
            const minDateString = `${year}-${month}-${day}`;
            dateInput.min = minDateString;
        }
    };
    
    setMinDateConstraint();
    
    // Custom Time Slot Selection Logic
    if (timeSlots) {
        const slotButtons = timeSlots.querySelectorAll('.time-slot-btn');
        slotButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Clear selection
                slotButtons.forEach(b => b.classList.remove('selected'));
                
                // Select clicked button
                btn.classList.add('selected');
                const selectedTime = btn.getAttribute('data-time');
                timeHiddenInput.value = selectedTime;
                
                // Remove error state if selected
                const formGroup = timeHiddenInput.closest('.form-group');
                if (formGroup) formGroup.classList.remove('invalid');
            });
        });
    }
    
    // Helper function to validate email structure
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    
    // Helper function to validate phone structure
    const validatePhone = (phone) => {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-s\.]?[0-9]{3}[-s\.]?[0-9]{4,6}$/im;
        return re.test(phone) && phone.replace(/\D/g,'').length >= 10;
    };
    
    // Realtime input listeners to remove errors
    const inputFields = ['booking-name', 'booking-email', 'booking-phone', 'booking-service', 'booking-date'];
    inputFields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('invalid');
            });
            input.addEventListener('change', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('invalid');
            });
        }
    });
    
    // Submit Handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Name validation
            const nameField = document.getElementById('booking-name');
            if (!nameField.value.trim()) {
                nameField.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            // Email validation
            const emailField = document.getElementById('booking-email');
            if (!validateEmail(emailField.value.trim())) {
                emailField.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            // Phone validation
            const phoneField = document.getElementById('booking-phone');
            if (!validatePhone(phoneField.value.trim())) {
                phoneField.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            // Service validation
            const serviceField = document.getElementById('booking-service');
            if (!serviceField.value) {
                serviceField.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            // Date validation
            const dateField = document.getElementById('booking-date');
            if (!dateField.value) {
                dateField.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            // Time validation
            if (!timeHiddenInput.value) {
                timeHiddenInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            // Form is valid - trigger modal confirmation
            if (isValid) {
                // Populate Confirmation fields
                const patientName = nameField.value.trim();
                const serviceText = serviceField.options[serviceField.selectedIndex].text;
                const appointmentDate = dateField.value;
                const appointmentTime = timeHiddenInput.value;
                const appointmentType = document.getElementById('booking-type').value === 'telehealth' 
                    ? 'Telehealth / Virtual Visit' 
                    : 'In-Person Clinic Visit';
                const patientPhone = phoneField.value.trim();
                
                // Format Date nicely
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', options);
                
                confNameSpan.textContent = patientName;
                confServiceSpan.textContent = serviceText;
                confDateTimeSpan.textContent = `${formattedDate} at ${appointmentTime}`;
                confTypeSpan.textContent = appointmentType;
                confPhoneSpan.textContent = patientPhone;
                
                // Open modal
                successModal.classList.add('active');
                successModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                // Reset form
                bookingForm.reset();
                timeHiddenInput.value = '';
                timeSlots.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
            }
        });
    }
    
    // Close Modal Button listener
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            successModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal if clicked outside card
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                successModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }
});
