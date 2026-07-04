/* Aura Medispa - Interactive Scripts */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navigation & Scroll Highlighting ---
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    // Toggle Mobile Navigation Menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close Mobile Navigation on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    });

    // Handle Navbar Backdrop and Scroll Spy
    window.addEventListener('scroll', () => {
        // Sticky Header Backdrop
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Scroll Spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

    // --- 2. Before / After Image Slider ---
    const sliderInput = document.getElementById('slider-input');
    const imageAfter = document.getElementById('image-after');
    const sliderBar = document.getElementById('slider-bar');

    if (sliderInput && imageAfter && sliderBar) {
        // Listen to native range input slider changes
        sliderInput.addEventListener('input', (e) => {
            const sliderPos = e.target.value;
            // Update width of the clipped radiant (after) image
            imageAfter.style.width = `${sliderPos}%`;
            // Update horizontal position of separating bar
            sliderBar.style.left = `${sliderPos}%`;
        });
    }

    // --- 3. Treatments Catalog Details & Modal Loader ---
    const treatmentsData = {
        'fillers': {
            title: 'Sculpt & Lift Dermal Fillers',
            category: 'Facial Rejuvenation',
            desc: 'A premium volume restoration treatment designed to sculpt, lift, and define facial structures. Utilizing high-cohesive hyaluronic acid, this procedure restores youthful contours in the cheeks, jawline, tear troughs, and temples, smoothing out deep creases for natural facial harmony.',
            recovery: '1 - 2 Days (Mild swelling/bruising possible)',
            duration: '30 - 45 Minutes',
            target: 'Cheeks, Jawline, Nasolabial Folds, Temples, Lips',
            science: 'Hyaluronic acid gel matrix integrates with local dermal tissues, attracting moisture molecules to instantly lift sagging skin and re-establish underlying skeletal volume.'
        },
        'botox': {
            title: 'Wrinkle-Relaxing Neuromodulators',
            category: 'Facial Rejuvenation',
            desc: 'Our signature wrinkle-relaxing injections target the underlying muscles responsible for expression lines. By temporarily softening muscular movements, this treatment minimizes forehead furrows, crow\'s feet, and glabella creases, delivering a rested and youthful expression without sacrificing natural mobility.',
            recovery: 'None (Immediate return to routine, no heavy workouts for 24h)',
            duration: '15 - 20 Minutes',
            target: 'Forehead, Frown Lines, Crow\'s Feet, Brow Area',
            science: 'Purified neuromodulator proteins temporarily intercept neural signals traveling to muscle fibers, allowing the overlying skin surface to relax and naturally flatten.'
        },
        'iv-drip': {
            title: 'NAD+ & Anti-Aging IV Infusion',
            category: 'Cellular Wellness',
            desc: 'A comprehensive cellular longevity therapy delivered directly into the bloodstream. Combining therapeutic doses of NAD+ (Nicotinamide Adenine Dinucleotide) with essential coenzymes and antioxidants, this drip recharges mitochondrial activity, enhances mental clarity, speeds up physical recovery, and boosts skin radiance from the inside out.',
            recovery: 'None',
            duration: '60 - 90 Minutes',
            target: 'Systemic cellular rejuvenation, mental fatigue, cellular hydration',
            science: 'By bypassing gastrointestinal digestion, intravenous delivery supplies maximum concentrations of NAD+ to restock cellular coenzymes required for mitochondrial ATP generation.'
        },
        'rf-sculpt': {
            title: 'High-Intensity RF Sculpting',
            category: 'Body Contouring & Tightening',
            desc: 'An advanced non-surgical body shaping and skin tightening modality. Utilizing temperature-controlled radiofrequency energy, this treatment safely heats deep dermal and sub-dermal fat layers, stimulating high-density collagen remodeling and targeting unwanted adipocytes to shape the abdomen, thighs, and jawline.',
            recovery: 'None (Mild localized warmth or redness for 1-2 hours)',
            duration: '45 - 60 Minutes',
            target: 'Abdomen, Submental (Double Chin), Thighs, Flanks',
            science: 'RF waves create targeted thermal energy in deep tissue beds, initiating immediate contraction of collagen bundles and triggering long-term neocollagenesis and lipolysis.'
        },
        'exosomes': {
            title: 'Microneedling with Exosomes',
            category: 'Facial Rejuvenation',
            desc: 'An ultra-advanced skin regeneration treatment that pairs automated microneedling with active clinical exosomes. The micro-channels created allow billions of cellular signaling vesicles to penetrate deeply, carrying growth factors, cofactors, and messenger RNA directly to fibroblasts to treat scars, wrinkles, and pigmentation.',
            recovery: '2 - 3 Days (Mild sunburn appearance)',
            duration: '45 - 60 Minutes',
            target: 'Full Face, Neck, Decolletage, Acne Scars',
            science: 'Exosomes act as microscopic cellular messengers that accelerate intercellular communication and repair, triggering up to a 500% increase in collagen production compared to standard microneedling.'
        },
        'bhrt': {
            title: 'Bioidentical Hormone Therapy',
            category: 'Cellular Wellness',
            desc: 'A physician-designed bioidentical hormone replacement therapy (BHRT) optimized for aging health. Through comprehensive blood panel analysis, we formulate personalized bio-equivalent hormones to balance biological systems, helping restore energy levels, enhance sleep cycles, clarify cognitive function, and regulate healthy body mass.',
            recovery: 'None (Requires periodic lab blood follow-ups)',
            duration: '30 Minute Initial Consultation',
            target: 'Endocrine system, cellular metabolism, biological sleep patterns',
            science: 'Bioidentical hormones match the molecular structure of endogenous human hormones exactly, ensuring precise cellular binding and minimal side effects compared to synthetic options.'
        }
    };

    const modal = document.getElementById('treatment-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const detailButtons = document.querySelectorAll('.btn-card-details');

    // Open Modal
    function openTreatmentModal(treatmentKey) {
        const data = treatmentsData[treatmentKey];
        if (!data) return;

        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-category">${data.category}</span>
                <h3 class="modal-title">${data.title}</h3>
            </div>
            <p class="modal-text">${data.desc}</p>
            <div class="modal-stats">
                <div class="modal-stat-item">
                    <h4>Clinical Session Time</h4>
                    <p>${data.duration}</p>
                </div>
                <div class="modal-stat-item">
                    <h4>Downtime / Recovery</h4>
                    <p>${data.recovery}</p>
                </div>
                <div class="modal-stat-item">
                    <h4>Target Concerns / Areas</h4>
                    <p>${data.target}</p>
                </div>
                <div class="modal-stat-item">
                    <h4>Mechanism of Action</h4>
                    <p>${data.science}</p>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#booking" class="btn btn-primary" id="modal-book-cta">Book Consultation for This Treatment</a>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        // Hook booking CTA inside modal
        const modalBookCta = document.getElementById('modal-book-cta');
        if (modalBookCta) {
            modalBookCta.addEventListener('click', () => {
                closeModal();
                // Pre-select service in form
                const serviceSelector = document.getElementById('booking-service');
                if (serviceSelector) {
                    serviceSelector.value = treatmentKey;
                }
            });
        }
    }

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    // Hook buttons to open details
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-treatment');
            openTreatmentModal(key);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Close modal on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 4. Treatments Category Filtering ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.treatment-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle Active Tab Styling
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    // Animation delay triggers
                    card.style.animation = 'fadeIn 0.5s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 5. Interactive Treatment Finder Quiz ---
    const next1 = document.getElementById('quiz-next-1');
    const next2 = document.getElementById('quiz-next-2');
    const prev2 = document.getElementById('quiz-prev-2');
    const prev3 = document.getElementById('quiz-prev-3');
    const submitQuiz = document.getElementById('quiz-submit');
    
    const step1 = document.getElementById('quiz-step-1');
    const step2 = document.getElementById('quiz-step-2');
    const step3 = document.getElementById('quiz-step-3');
    const resultsStep = document.getElementById('quiz-results');
    const resultsContent = document.getElementById('results-content');
    const progress = document.getElementById('quiz-progress');

    // Navigation triggers
    if (next1) {
        next1.addEventListener('click', () => {
            step1.classList.remove('active');
            step2.classList.add('active');
            progress.style.width = '66.6%';
        });
    }

    if (next2) {
        next2.addEventListener('click', () => {
            step2.classList.remove('active');
            step3.classList.add('active');
            progress.style.width = '100%';
        });
    }

    if (prev2) {
        prev2.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
            progress.style.width = '33.3%';
        });
    }

    if (prev3) {
        prev3.addEventListener('click', () => {
            step3.classList.remove('active');
            step2.classList.add('active');
            progress.style.width = '66.6%';
        });
    }

    if (submitQuiz) {
        submitQuiz.addEventListener('click', () => {
            // Gather quiz answers
            const concern = document.querySelector('input[name="concern"]:checked').value;
            const skintype = document.querySelector('input[name="skintype"]:checked').value;
            const age = document.querySelector('input[name="age"]:checked').value;
            
            // Calculate matches based on clinical rationale
            let recommendedKey = 'general';
            let rationale = '';
            
            if (concern === 'wrinkles') {
                if (age === '20s') {
                    recommendedKey = 'exosomes';
                    rationale = 'As you are in your 20s-30s looking to address fine lines, a cellular-renewing Microneedling with Exosomes treatment is perfect. It activates young skin cells, boosts collagen, and prevents deeper creases from settling, without dynamic freezing.';
                } else {
                    recommendedKey = 'botox';
                    rationale = 'For fine lines and dynamic expression folds, Wrinkle-Relaxing Neuromodulators represent the global gold standard. By softening micro-movements, the overlying skin relaxes and smooths out forehead and crow\'s feet lines.';
                }
            } else if (concern === 'volume') {
                recommendedKey = 'fillers';
                rationale = 'To restore skeletal balance and skin support, Dermal Fillers are highly recommended. Hyaluronic acid gel will naturally lift cheeks, clarify the jawline, and support volume loss to restore structural contours.';
            } else if (concern === 'dullness') {
                if (skintype === 'dry' || skintype === 'sensitive') {
                    recommendedKey = 'exosomes';
                    rationale = 'With skin hydration or reactivity concerns alongside dullness, Microneedling with Exosomes is ideal. It heals dry barrier cells while delivering heavy growth factors directly to stimulate glowing new dermal cells.';
                } else {
                    recommendedKey = 'iv-drip';
                    rationale = 'For metabolic dullness and hyperpigmentation, our NAD+ & Cellular Glow Drip supplies direct skin-brightening antioxidants and vitamins. This boosts cell turnover speed directly from the bloodstream for a premium, total-body glow.';
                }
            } else if (concern === 'energy') {
                if (age === '20s') {
                    recommendedKey = 'iv-drip';
                    rationale = 'For low energy levels, our NAD+ Intravenous therapy acts as a premium battery recharge for biological engines, supplying active cellular coenzymes that elevate focus, cell repair speed, and hydration.';
                } else {
                    recommendedKey = 'bhrt';
                    rationale = 'For metabolic fatigue and wellness aging, our physician-directed Hormone Replacement Therapy (BHRT) is highly indicated. It balances cellular hormone health to stabilize metabolic weight, energy, sleep cycle, and mental focus.';
                }
            }

            const rec = treatmentsData[recommendedKey] || {
                title: 'Comprehensive Aesthetic Assessment',
                category: 'Aesthetic Consultation',
                desc: 'Speak with our clinical team to layout a structural beauty blueprint.'
            };

            // Inject result content
            resultsContent.innerHTML = `
                <div class="results-icon-container">
                    <i class="fa-solid fa-wand-magic-sparkles results-icon"></i>
                </div>
                <span class="results-tag">Your Personalized Recommendation</span>
                <h3 class="results-title">${rec.title}</h3>
                <p class="results-desc">${rationale}</p>
                <div class="results-details">
                    <h4>Clinical Session Length:</h4>
                    <p style="margin-bottom: 1rem; font-size: 0.9rem;">${rec.duration || '30 Minutes'}</p>
                    <h4>Target Treatment Area:</h4>
                    <p style="font-size: 0.9rem;">${rec.target || 'Custom Areas'}</p>
                </div>
                <div class="results-cta-group">
                    <a href="#booking" class="btn btn-primary" id="btn-quiz-book">Book This Treatment</a>
                    <button class="btn btn-outline" id="btn-quiz-reset">Retake Quiz</button>
                </div>
            `;

            // Transition to Results Step
            step3.classList.remove('active');
            resultsStep.classList.add('active');

            // Add Event Listener to Result Buttons
            const quizBookBtn = document.getElementById('btn-quiz-book');
            const quizResetBtn = document.getElementById('btn-quiz-reset');

            if (quizBookBtn) {
                quizBookBtn.addEventListener('click', () => {
                    // Pre-select recommended service
                    const selectEl = document.getElementById('booking-service');
                    if (selectEl) selectEl.value = recommendedKey;
                });
            }

            if (quizResetBtn) {
                quizResetBtn.addEventListener('click', () => {
                    // Reset inputs
                    resultsStep.classList.remove('active');
                    step1.classList.add('active');
                    progress.style.width = '33.3%';
                });
            }
        });
    }

    // --- 6. Booking Form Handler ---
    const bookingForm = document.getElementById('booking-form');
    const bookingSubmitBtn = document.getElementById('booking-submit');
    const formSuccess = document.getElementById('form-success');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button, show active loading spinner icon
            if (bookingSubmitBtn) {
                bookingSubmitBtn.innerHTML = 'Sending Request <i class="fa-solid fa-circle-notch fa-spin"></i>';
                bookingSubmitBtn.disabled = true;
            }

            // Simulate server delivery API call
            setTimeout(() => {
                // Hide fields (fade out effect)
                bookingForm.querySelectorAll('.form-row, #booking-submit').forEach(el => {
                    el.style.display = 'none';
                });

                // Display custom luxurious confirmation
                if (formSuccess) {
                    formSuccess.style.display = 'flex';
                }
            }, 1200);
        });
    }
});
