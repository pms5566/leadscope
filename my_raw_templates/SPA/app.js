/* ==========================================
   CHÉRIE Spa & Salon - Core Application JS
   ========================================== */

// Services Data Store (Salon, Lashes, Massages, Bridal, VIP)
const SERVICES_DATA = [
    {
        id: 'hair-balayage',
        name: 'Luxury Balayage & Blowout',
        category: 'hair',
        duration: '120 Min',
        price: 210.00,
        desc: 'Bespoke hand-painted color melting tailored to your features, followed by a botanical hair mask and signature blowout.',
        features: ['Signature Blowout', 'Restorative Mask']
    },
    {
        id: 'hair-keratin',
        name: 'Keratin Gloss Treatment',
        category: 'hair',
        duration: '90 Min',
        price: 185.00,
        desc: 'Advanced liquid keratin infusion designed to eliminate frizz, seal cuticles, and deliver liquid-glass shine for up to 12 weeks.',
        features: ['Formaldehyde-free', 'Intense Frizz Seal']
    },
    {
        id: 'nail-couture',
        name: 'Couture Gel Manicure',
        category: 'nails-lashes',
        duration: '60 Min',
        price: 75.00,
        desc: 'Bespoke cuticle care, nail shaping, structural gel reinforcement, and hand-painted fine-line nail art with luxury oils.',
        features: ['Bespoke Nail Art', 'Sugar Scrub Exfoliation']
    },
    {
        id: 'lash-volume',
        name: 'Lash Volume Extension',
        category: 'nails-lashes',
        duration: '90 Min',
        price: 140.00,
        desc: 'Custom set of premium lightweight mink lashes applied individually to create rich volume, tailored density, and eye-lift effect.',
        features: ['Premium Mink Lashes', 'Custom Volume Mapping']
    },
    {
        id: 'msg-deep-tissue',
        name: 'Restorative Deep Tissue',
        category: 'massage',
        duration: '75 Min',
        price: 135.00,
        desc: 'Focused massage therapy utilizing slow, deep pressure to relieve chronic muscular tension and accelerate physical recovery.',
        features: ['Warm Aroma Balm', 'Hyperice Gun Therapy']
    },
    {
        id: 'msg-hot-stone',
        name: 'Hot Stone Aromatherapy',
        category: 'massage',
        duration: '90 Min',
        price: 160.00,
        desc: 'Polished volcanic basalt stones are heated and combined with organic lavender and cherry-blossom oil for total tranquility.',
        features: ['Heated Basalt Stones', 'Wild Blossom Essence']
    },
    {
        id: 'bridal-elite',
        name: 'Bridal Elite Package',
        category: 'bridal-vip',
        duration: '180 Min',
        price: 380.00,
        desc: 'The ultimate pre-wedding ritual: a deep hydration facial, hair trial styling session, deluxe pedicure, and glass of champagne.',
        features: ['Champagne Service', 'Facial & Styling Trial']
    },
    {
        id: 'vip-retreat',
        name: 'VIP Private Suite Retreat',
        category: 'bridal-vip',
        duration: '120 Min',
        price: 250.00,
        desc: 'Bespoke 90-minute treatment in our soundproof private suite, featuring a personal thermal bath, steam room, and organic caviar platter.',
        features: ['Private Suite Access', 'Caviar & Hors-d’oeuvres']
    }
];

// App State
let bookingCart = [];
let selectedDate = '';
let selectedTimeSlot = '';

// DOM Elements
const servicesGrid = document.getElementById('services-grid');
const filterTabs = document.querySelectorAll('.filter-tab');
const bookingDrawer = document.getElementById('booking-drawer');
const drawerBackdrop = document.getElementById('drawer-backdrop');
const cartCountElement = document.getElementById('cart-count');
const cartItemsElement = document.getElementById('cart-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');
const timeSlots = document.querySelectorAll('.time-slot');
const datePicker = document.getElementById('booking-date');
const bookingForm = document.getElementById('booking-checkout-form');
const successModal = document.getElementById('success-modal');

// Close Drawer Button
const btnCloseDrawer = document.getElementById('btn-close-drawer');
// Open Drawer Buttons
const btnCartIcon = document.getElementById('btn-cart-icon');
const btnNavBook = document.getElementById('btn-nav-book');
const btnHeroBook = document.getElementById('btn-hero-book');

/* ==========================================
   INITIALIZATION & NAVIGATION LOGIC
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Render initial services (all)
    renderServices('all');

    // Sticky Navbar & Scroll Triggers
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', highlightActiveNavLink);
    window.addEventListener('scroll', animateTimelineOnScroll);

    // Setup Date Picker to restrict past dates
    const today = new Date().toISOString().split('T')[0];
    if (datePicker) {
        datePicker.min = today;
    }
});

// Sticky Navbar Background
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Active Nav Link Highlighting
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
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
}

// Timeline Scroll Animation
function animateTimelineOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const triggerBottom = window.innerHeight * 0.85;

    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < triggerBottom) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

/* ==========================================
   SERVICES FILTERING & RENDERING
   ========================================== */
// Handle Tab Clicks
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filterVal = tab.getAttribute('data-filter');
        renderServices(filterVal);
    });
});

// Render Services Grid
function renderServices(category) {
    if (!servicesGrid) return;
    
    // Clear current grid
    servicesGrid.innerHTML = '';
    
    // Filter data
    const filtered = category === 'all' 
        ? SERVICES_DATA 
        : SERVICES_DATA.filter(s => s.category === category);
        
    filtered.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-item-card glass-card';
        
        // Build features list
        const featuresHtml = service.features.map(f => `
            <span class="service-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold-color)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ${f}
            </span>
        `).join('');

        card.innerHTML = `
            <div class="service-item-header">
                <div class="service-item-title">
                    <h3>${service.name}</h3>
                    <span class="service-item-duration">${service.duration}</span>
                </div>
                <div class="service-item-price">$${service.price.toFixed(2)}</div>
            </div>
            <p class="service-item-desc">${service.desc}</p>
            <div class="service-item-footer">
                <div class="service-item-features">${featuresHtml}</div>
                <button class="btn-add-booking" onclick="addServiceToBooking('${service.id}')" title="Add to Booking">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        `;
        
        servicesGrid.appendChild(card);
    });
}

/* ==========================================
   BOOKING CART DRAWER LOGIC
   ========================================== */
function openDrawer() {
    if (bookingDrawer) bookingDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
}

function closeDrawer() {
    if (bookingDrawer) bookingDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
}

// Event Listeners for Open/Close Drawer
if (btnCartIcon) btnCartIcon.addEventListener('click', openDrawer);
if (btnNavBook) btnNavBook.addEventListener('click', openDrawer);
if (btnHeroBook) btnHeroBook.addEventListener('click', openDrawer);
if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

// Add Service To Booking Cart
function addServiceToBooking(id) {
    // Check if it is a retail product from quick buy
    if (id.startsWith('prod-')) {
        const productsMap = {
            'prod-oil': { name: 'Cherry Face Oil', price: 95.00, duration: 'Retail Product' },
            'prod-cream': { name: 'Hydrating Day Cream', price: 72.00, duration: 'Retail Product' },
            'prod-serum': { name: 'Revitalizing Cherry Serum', price: 88.00, duration: 'Retail Product' }
        };
        const product = productsMap[id];
        if (product) {
            bookingCart.push({ id, name: product.name, price: product.price, duration: product.duration });
            updateCartUI();
            openDrawer();
        }
        return;
    }

    const service = SERVICES_DATA.find(s => s.id === id);
    if (!service) return;
    
    // Check if already in cart
    if (bookingCart.some(item => item.id === id)) {
        openDrawer();
        return;
    }
    
    bookingCart.push(service);
    updateCartUI();
    openDrawer();
}

// Remove Service From Booking Cart
function removeServiceFromBooking(id) {
    bookingCart = bookingCart.filter(item => item.id !== id);
    updateCartUI();
}

// Update Cart Badge & Items UI
function updateCartUI() {
    if (cartCountElement) cartCountElement.textContent = bookingCart.length;
    if (!cartItemsElement) return;
    
    cartItemsElement.innerHTML = '';
    
    if (bookingCart.length === 0) {
        cartItemsElement.innerHTML = '<div class="empty-cart-message">Select services to begin your booking ritual.</div>';
        if (summarySubtotal) summarySubtotal.textContent = '$0.00';
        if (summaryTotal) summaryTotal.textContent = '$0.00';
        return;
    }
    
    let subtotal = 0;
    bookingCart.forEach(item => {
        subtotal += item.price;
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.duration}</p>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <button class="btn-remove-item" onclick="removeServiceFromBooking('${item.id}')" title="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;
        cartItemsElement.appendChild(itemRow);
    });
    
    const serviceFee = bookingCart.some(item => item.duration !== 'Retail Product') ? 10.00 : 0.00; 
    const total = subtotal + serviceFee;
    
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
}

/* ==========================================
   DATE & TIME SCHEDULER
   ========================================== */
if (datePicker) {
    datePicker.addEventListener('change', (e) => {
        selectedDate = e.target.value;
    });
}

timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTimeSlot = slot.getAttribute('data-time');
    });
});

/* ==========================================
   BOOKING SUBMISSION & MODAL FLOW
   ========================================== */
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById('client-name').value.trim();
        const clientEmail = document.getElementById('client-email').value.trim();
        
        // Validations
        if (bookingCart.length === 0) {
            alert('Please select at least one salon service or retail product.');
            return;
        }
        
        const requiresSchedule = bookingCart.some(item => item.duration !== 'Retail Product');
        
        if (requiresSchedule) {
            if (!selectedDate) {
                alert('Please select an appointment date.');
                return;
            }
            if (!selectedTimeSlot) {
                alert('Please choose a time slot.');
                return;
            }
        }
        
        if (!clientName || !clientEmail) {
            alert('Please fill out your contact details.');
            return;
        }
        
        // Success booking compilation
        let summaryText = '';
        if (requiresSchedule) {
            summaryText = `Your luxury retreat on ${formatDate(selectedDate)} at ${selectedTimeSlot} has been scheduled. Detailed instructions have been sent to ${clientEmail}.`;
        } else {
            summaryText = `Your CHÉRIE Organics retail order has been received. Your invoice has been sent to ${clientEmail}.`;
        }
        
        document.getElementById('booking-success-summary').textContent = summaryText;
        
        // Show success modal
        if (successModal) successModal.classList.add('active');
        closeDrawer();
        
        // Reset app state
        bookingCart = [];
        selectedDate = '';
        selectedTimeSlot = '';
        if (datePicker) datePicker.value = '';
        timeSlots.forEach(s => s.classList.remove('selected'));
        bookingForm.reset();
        updateCartUI();
    });
}

function closeSuccessModal() {
    if (successModal) successModal.classList.remove('active');
}

// Utility function to format dates
function formatDate(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
}
