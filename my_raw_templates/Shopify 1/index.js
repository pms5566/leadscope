/* ==========================================================================
   AURA Skincare & Wellness - Client-side Functionality
   ========================================================================== */

// 1. Mock Database of Products
const PRODUCTS = [
    {
        id: "serum-1",
        name: "Radiance Glow Serum",
        category: "serum",
        price: 60.00,
        comparePrice: 75.00,
        rating: 4.9,
        reviewsCount: 245,
        tag: "Bestseller",
        image: "assets/serum_product.png",
        shortDesc: "A lightweight, vitamin-C rich glow serum that transforms dull skin into bright, facial-like radiance.",
        description: "Experience the ultimate skin transformation. Formulated with a potent blend of Vitamin C, papaya enzymes, and a 5-ceramide complex, our Radiance Glow Serum targets dark spots, balances skin tone, and hydrates deeply. Clinically tested to improve skin glow in just 7 days.",
        sizes: ["30ml", "60ml"],
        ingredients: "Water (Aqua), Ethyl Ascorbic Acid (Vitamin C), Niacinamide, Glycerin, Carica Papaya Fruit Extract, Ceramide NP, Ceramide AP, Sodium Hyaluronate, Tocopherol, Phenoxyethanol, Ethylhexylglycerin.",
        directions: "Apply 2-3 drops to clean, slightly damp skin in the morning and evening. Pat gently until fully absorbed. Follow with moisturizer and daily sun protection."
    },
    {
        id: "cream-1",
        name: "Hydrating Facial Cream",
        category: "moisturizer",
        price: 48.00,
        comparePrice: 60.00,
        rating: 4.8,
        reviewsCount: 189,
        tag: "New in",
        image: "assets/cream_product.png",
        shortDesc: "A rich, deeply nourishing daily cream to protect the skin barrier and deliver 24-hour intense moisture.",
        description: "Lock in deep moisture with Saintes Hydrating Facial Cream. Nourished with squalane, shea butter, and ceramides, this fast-absorbing moisturizer fortifies the skin barrier against environmental stressors while keeping skin looking plump, healthy, and smooth all day.",
        sizes: ["50ml", "100ml"],
        ingredients: "Water (Aqua), Squalane, Butyrospermum Parkii (Shea) Butter, Caprylic/Capric Triglyceride, Ceramide EOP, Ceramide EOP, Phytosphingosine, Hyaluronic Acid, Centella Asiatica Extract, Panthenol, Carbomer.",
        directions: "After cleansing and applying serums, smooth a dime-sized amount onto the face and neck. Massage in upward, circular motions. Use daily, morning and night."
    },
    {
        id: "supplement-1",
        name: "Collagen Peptides",
        category: "supplement",
        price: 45.00,
        comparePrice: 55.00,
        rating: 4.9,
        reviewsCount: 320,
        tag: "Wellness",
        image: "assets/supplement_product.png",
        shortDesc: "Premium marine and botanical collagen peptides to support skin elasticity, nail strength, and hair growth from within.",
        description: "True radiance starts from within. AURA Collagen Peptides is a clean, doctor-formulated blend of bioavailable marine collagen, Vitamin C, biotin, and hyaluronic acid. Formulated to stimulate natural collagen production, reduce fine lines, and strengthen hair and nails.",
        sizes: ["120 Capsules", "240 Capsules"],
        ingredients: "Hydrolyzed Marine Collagen (Type I & III), Vitamin C (as Ascorbic Acid), Biotin, Sodium Hyaluronate, Silica (from Bamboo Extract), Organic Alfalfa Leaf, Vegetable Capsule.",
        directions: "Take 2 capsules daily, preferably with a meal or a glass of water. For best results, use consistently for at least 8-12 weeks."
    },
    {
        id: "cleanser-1",
        name: "Gentle Gel Cleanser",
        category: "cleanser",
        price: 36.00,
        comparePrice: null,
        rating: 4.7,
        reviewsCount: 98,
        tag: "Daily Care",
        image: "assets/cleanser_product.png",
        shortDesc: "A pH-balanced, non-stripping cleanser that washes away dirt, oil, and makeup while leaving skin hydrated.",
        description: "Start your skincare routine right. This gentle gel cleanser foams lightly to lift away daily toxins, makeup, and excess oils. Infused with soothing chamomile and aloe vera extracts to ensure your skin is never left feeling tight, dry, or stripped.",
        sizes: ["150ml", "300ml"],
        ingredients: "Water (Aqua), Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Glycerin, Aloe Barbadensis Leaf Juice, Chamomilla Recutita (Chamomile) Flower Extract, Camellia Sinensis (Green Tea) Leaf Extract, Citric Acid.",
        directions: "Massage a small pump into damp hands to build a light lather. Apply to wet face and neck, massaging gently for 60 seconds. Rinse thoroughly with lukewarm water."
    },
    {
        id: "sunscreen-1",
        name: "Invisible SPF 50",
        category: "moisturizer",
        price: 52.00,
        comparePrice: 65.00,
        rating: 4.9,
        reviewsCount: 412,
        tag: "12% off",
        image: "assets/sunscreen_product.png",
        shortDesc: "Ultra-lightweight, invisible sunscreen that doubles as a makeup-gripping primer. Leaves zero white cast.",
        description: "Protect your glow daily. Our Invisible SPF 50 is a broad-spectrum chemical sunscreen that goes on completely clear, absorbing immediately without oiliness or white cast. Formulated with antioxidant red algae and hyaluronic acid to hydrate and prevent photo-aging.",
        sizes: ["50ml"],
        ingredients: "Avobenzone 3%, Homosalate 8%, Octisalate 5%, Octocrylene 4%, Zinc Oxide, Porphyra Umbilicalis (Red Algae) Extract, Sodium Hyaluronate, Tocopheryl Acetate (Vitamin E), Bisabolol.",
        directions: "Apply generously as the final step of your morning skincare routine, at least 15 minutes before sun exposure. Reapply every 2 hours if swimming or sweating."
    },
    {
        id: "kit-1",
        name: "Radiance Booster Kit",
        category: "serum",
        price: 78.00,
        comparePrice: 98.00,
        rating: 5.0,
        reviewsCount: 64,
        tag: "Bestseller",
        image: "assets/kit_product.png",
        shortDesc: "Our two-step power routine combining the Radiance Glow Serum and Hydrating Facial Cream for double the glow.",
        description: "Get the ultimate skin glow with our curated Radiance Booster Kit. Contains our two award-winning bestsellers at an exclusive bundle price. Together, they stimulate skin cell turnover, flood cells with moisture, and repair skin barriers.",
        sizes: ["Standard Kit"],
        ingredients: "Please refer to individual products (Radiance Glow Serum & Hydrating Facial Cream) for ingredient details.",
        directions: "Apply 2-3 drops of Radiance Glow Serum onto cleansed damp skin. Once absorbed, smooth a dime-sized layer of Hydrating Facial Cream to lock in the nutrients."
    },
    {
        id: "serum-2",
        name: "HydraLuxe Serum",
        category: "serum",
        price: 35.00,
        comparePrice: 70.00,
        rating: 4.8,
        reviewsCount: 112,
        tag: "50% off",
        image: "assets/hydraluxe_product.png",
        shortDesc: "Deep hydrating hyaluronic acid serum that plumps the skin and smooths skin texture.",
        description: "Drench dry, thirsty skin in deep hydration. HydraLuxe Serum delivers multi-weight hyaluronic acid molecules that penetrate deep skin layers. Promotes instant plumping, softens fine lines, and strengthens moisture barriers.",
        sizes: ["30ml"],
        ingredients: "Water (Aqua), Sodium Hyaluronate, Panthenol (Vitamin B5), Aloe Barbadensis Leaf Juice, Phenoxyethanol, Sea Silt Extract, Centella Asiatica Extract.",
        directions: "Apply 3 drops to clean, damp face and neck morning and night. Press gently until absorbed. Follow with moisturizer."
    },
    {
        id: "moisturizer-2",
        name: "OceanMist Moisturizer",
        category: "moisturizer",
        price: 20.00,
        comparePrice: 40.00,
        rating: 4.8,
        reviewsCount: 89,
        tag: "50% off",
        image: "assets/oceanmist_product.png",
        shortDesc: "Light gel moisturizer infused with marine algae extracts for an instant burst of cooling hydration.",
        description: "Ideal for oily and combination skin. This oil-free, lightweight gel-cream formula delivers cooling, long-lasting moisture. Active ocean minerals soothe irritation, refine pores, and control excess sebum shine.",
        sizes: ["50ml"],
        ingredients: "Water (Aqua), Glycerin, Algae Extract, Laminaria Digitata (Kelp) Extract, Sea Water, Sodium Hyaluronate, Cucumis Sativus (Cucumber) Fruit Extract, Carbomer, Sodium Hydroxide.",
        directions: "Smooth over clean skin on face and neck morning and night. Can be used as a lightweight hydrating primer before makeup."
    }
];

const SKIN_ROUTINES = {
    all: [
        { id: 'cleanser-1', name: 'Gentle Gel Cleanser', desc: 'Remove impurities, excess sebum, and makeup gently without stripping moisture.' },
        { id: 'serum-1', name: 'Radiance Glow Serum', desc: 'Apply 2-3 drops of active serums to target dark spots, fine lines, and dullness.' },
        { id: 'cream-1', name: 'Hydrating Facial Cream', desc: 'Lock in moisture and strengthen the skin barrier with deep 24H hydration.' },
        { id: 'supplement-1', name: 'Collagen Peptides', desc: 'Nourish cells internally to accelerate repair and keep skin glowing.' }
    ],
    dry: [
        { id: 'cleanser-1', name: 'Gentle Gel Cleanser', desc: 'Soothe and wash skin gently without stripping vital barrier moisture.' },
        { id: 'hydraluxe-1', name: 'HydraLuxe Hyaluronic Serum', desc: 'Apply to damp skin for intense moisture retention and immediate plumping.' },
        { id: 'oceanmist-1', name: 'OceanMist Daily Moisturizer', desc: 'Lock in multi-layer deep hydration to soothe dry, flaky areas.' },
        { id: 'supplement-1', name: 'Collagen Peptides', desc: 'Improve skin elasticity and tissue repair from within.' }
    ],
    oily: [
        { id: 'cleanser-1', name: 'Gentle Gel Cleanser', desc: 'Cleanse deep inside congested pores to balance oil production.' },
        { id: 'serum-1', name: 'Radiance Glow Serum', desc: 'Soothe active breakouts and fade post-blemish dark marks.' },
        { id: 'oceanmist-1', name: 'OceanMist Daily Moisturizer', desc: 'Hydrate with a lightweight gel-cream formula that won\'t clog pores.' },
        { id: 'supplement-1', name: 'Collagen Peptides', desc: 'Help cell recovery and skin barrier regeneration.' }
    ],
    sensitive: [
        { id: 'cleanser-1', name: 'Gentle Gel Cleanser', desc: 'Ultra-gentle botanical cleanser that calms irritation and redness.' },
        { id: 'hydraluxe-1', name: 'HydraLuxe Hyaluronic Serum', desc: 'Soothe sensitive skin cells with moisture-binding hyaluronic acids.' },
        { id: 'cream-1', name: 'Hydrating Facial Cream', desc: 'Protect and heal compromised outer skin barrier layers.' },
        { id: 'supplement-1', name: 'Collagen Peptides', desc: 'Reinforce skin structural integrity without sensitivities.' }
    ]
};

// 2. Global State Variables
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('aura_wishlist')) || [];
let activeFilters = {
    search: '',
    categories: [],
    maxPrice: 80,
    onlyWishlist: false
};
let activeSort = 'featured';
let currentTestimonialIndex = 0;
let testimonialTimer = null;

// DOM Elements
const promoModalOverlay = document.getElementById('promo-modal-overlay');
const closePromoModalBtn = document.getElementById('close-promo-modal-btn');
const promoModalCtaBtn = document.getElementById('promo-modal-cta-btn');

const announcementBar = document.getElementById('announcement-bar');
const closeAnnouncementBtn = document.getElementById('close-announcement-btn');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle-btn');
const navMenu = document.getElementById('nav-menu-container');
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchOverlayInput = document.getElementById('search-overlay-input');
const closeSearchBtn = document.getElementById('close-search-btn');
const searchLiveGrid = document.getElementById('search-live-grid');
const searchTrending = document.getElementById('search-trending');

// Cart Elements
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartCountBadge = document.getElementById('cart-count');
const wishlistCountBadge = document.getElementById('wishlist-count');
const shippingProgressText = document.getElementById('shipping-progress-text');
const shippingProgressFill = document.getElementById('shipping-progress-fill');
const emptyCartView = document.getElementById('empty-cart-message');
const cartFooterView = document.getElementById('cart-drawer-footer');
const startShoppingBtn = document.getElementById('start-shopping-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const buyBundleBtn = document.getElementById('btn-buy-bundle');

// Catalog Elements
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const closeFiltersBtn = document.getElementById('close-filters-btn');
const shopContainer = document.querySelector('.shop-container');
const productGrid = document.getElementById('product-grid');
const productResultsCount = document.getElementById('product-results-count');
const sortSelect = document.getElementById('sort-select');
const clearFiltersBtn = document.getElementById('clear-filters-btn');
const sidebarSearch = document.getElementById('sidebar-search');
const priceRangeInput = document.getElementById('price-range');
const priceValueLabel = document.getElementById('price-value');
const categoryPills = document.querySelectorAll('.category-circle-link');

// Modal Elements
const productModal = document.getElementById('product-modal');
const productModalOverlay = document.getElementById('product-modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalMainImg = document.getElementById('modal-main-img');
const modalProductTag = document.getElementById('modal-product-tag');
const modalProductName = document.getElementById('modal-product-name');
const modalRatingStars = document.getElementById('modal-rating-stars');
const modalRatingCount = document.getElementById('modal-rating-count');
const modalCurrentPrice = document.getElementById('modal-current-price');
const modalComparePrice = document.getElementById('modal-compare-price');
const modalDiscount = document.getElementById('modal-discount');
const modalShortDesc = document.getElementById('modal-short-desc');
const modalSizeOptions = document.getElementById('modal-size-options');
const modalQtyInput = document.getElementById('modal-qty-input');
const modalQtyMinus = document.getElementById('modal-qty-minus');
const modalQtyPlus = document.getElementById('modal-qty-plus');
const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Testimonial Elements
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialPrev = document.getElementById('testimonial-prev');
const testimonialNext = document.getElementById('testimonial-next');
const testimonialDots = document.querySelectorAll('.slider-dot');

let selectedModalProduct = null;
let selectedModalSize = '';

/* ==========================================================================
   3. Initialization & Event Listeners
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    startTestimonialSlider();
    initAnnouncementRotator();
    
    // Show Promo Popup modal after 1.5 seconds delay
    setTimeout(() => {
        if (promoModalOverlay) {
            promoModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }, 1500);
}

function setupEventListeners() {
    // Mobile Bottom Navigation Bar Event Listeners
    const mobileNavShopBtn = document.getElementById('mobile-nav-shop');
    const mobileNavWishlistBtn = document.getElementById('mobile-nav-wishlist');
    const mobileNavCartBtn = document.getElementById('mobile-nav-cart');

    if (mobileNavShopBtn) {
        mobileNavShopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear wishlist filter if it was active
            if (activeFilters.onlyWishlist) {
                activeFilters.onlyWishlist = false;
                mobileNavWishlistBtn.classList.remove('active');
                renderProducts();
            }
            const shopSection = document.getElementById('shop-section');
            if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (mobileNavWishlistBtn) {
        mobileNavWishlistBtn.addEventListener('click', () => {
            activeFilters.onlyWishlist = !activeFilters.onlyWishlist;
            mobileNavWishlistBtn.classList.toggle('active', activeFilters.onlyWishlist);
            
            // If wishlist is empty and filter is turned on, alert user
            if (activeFilters.onlyWishlist && wishlist.length === 0) {
                mobileNavWishlistBtn.classList.remove('active');
                activeFilters.onlyWishlist = false;
                
                // Keep parent active classes in sync
                if (window.parent && window.parent.document) {
                    const pWish = window.parent.document.getElementById('mobile-nav-wishlist');
                    if (pWish) pWish.classList.remove('active');
                }
                
                alert("Your Wishlist is currently empty! Tap the heart icons on products to add them to your wishlist.");
            } else {
                renderProducts();
                const shopSection = document.getElementById('shop-section');
                if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
                
                // Keep parent active classes in sync
                if (window.parent && window.parent.document) {
                    const pWish = window.parent.document.getElementById('mobile-nav-wishlist');
                    const pShop = window.parent.document.getElementById('mobile-nav-shop');
                    if (pWish) pWish.classList.toggle('active', activeFilters.onlyWishlist);
                    if (pShop) pShop.classList.toggle('active', !activeFilters.onlyWishlist);
                }
            }
        });
    }

    if (mobileNavCartBtn) {
        mobileNavCartBtn.addEventListener('click', toggleCartDrawer);
    }

    // Promo Modal Event Listeners
    if (closePromoModalBtn) {
        closePromoModalBtn.addEventListener('click', () => {
            promoModalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    if (promoModalOverlay) {
        promoModalOverlay.addEventListener('click', (e) => {
            if (e.target === promoModalOverlay) {
                promoModalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    if (promoModalCtaBtn) {
        promoModalCtaBtn.addEventListener('click', () => {
            promoModalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Announcement Bar Close
    if (closeAnnouncementBtn) {
        closeAnnouncementBtn.addEventListener('click', () => {
            announcementBar.classList.add('hidden');
        });
    }

    // Mobile Navigation Hamburger
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Toggle Search Overlay (Orvélia Style)
    if (searchToggleBtn && searchOverlay) {
        searchToggleBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (searchOverlayInput) {
                searchOverlayInput.value = '';
                searchOverlayInput.focus();
            }
            if (searchLiveGrid) searchLiveGrid.innerHTML = '';
            if (searchTrending) searchTrending.style.display = 'block';
        });
    }

    if (closeSearchBtn && searchOverlay) {
        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Keyup search execution
    if (searchOverlayInput) {
        searchOverlayInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                if (searchLiveGrid) searchLiveGrid.innerHTML = '';
                if (searchTrending) searchTrending.style.display = 'block';
                return;
            }

            if (searchTrending) searchTrending.style.display = 'none';

            const results = PRODUCTS.filter(p => 
                (p.name && p.name.toLowerCase().includes(query)) || 
                (p.category && p.category.toLowerCase().includes(query)) ||
                (p.shortDesc && p.shortDesc.toLowerCase().includes(query))
            );

            if (searchLiveGrid) {
                if (results.length === 0) {
                    searchLiveGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.5); padding: 2rem 0;">No matching products found.</p>`;
                } else {
                    searchLiveGrid.innerHTML = results.map(p => `
                        <div class="search-live-card" data-product-id="${p.id}">
                            <img src="${p.image}" alt="${p.name}">
                            <div class="search-live-card-info">
                                <h4>${p.name}</h4>
                                <span>$${p.price.toFixed(2)}</span>
                            </div>
                        </div>
                    `).join('');

                    searchLiveGrid.querySelectorAll('.search-live-card').forEach(card => {
                        card.addEventListener('click', () => {
                            const prodId = card.getAttribute('data-product-id');
                            openProductDetailModal(prodId);
                            searchOverlay.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        });
                    });
                }
            }
        });
    }

    // Trending tags listener
    document.querySelectorAll('.trend-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagValue = tag.getAttribute('data-tag');
            if (searchOverlayInput) {
                searchOverlayInput.value = tagValue;
                searchOverlayInput.dispatchEvent(new Event('input'));
            }
        });
    });
    if (sidebarSearch) {
        sidebarSearch.addEventListener('input', (e) => {
            activeFilters.search = e.target.value;
            renderProducts();
        });
    }

    // Cart Drawer Toggle
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', toggleCartDrawer);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartDrawer);
    }
    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', toggleCartDrawer);
    }
    if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', () => {
            toggleCartDrawer();
            document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert("Thank you for shopping with AURA! Proceeding to checkout checkout (simulated Shopify checkout)...");
            cart = [];
            localStorage.setItem('aura_cart', JSON.stringify(cart));
            updateCartUI();
            toggleCartDrawer();
        });
    }

    // Category pills filter (Sephora style)
    categoryPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            categoryPills.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.getAttribute('data-category');
            
            // Sync with sidebar checkboxes
            document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            if (category === 'all') {
                activeFilters.categories = [];
            } else {
                activeFilters.categories = [category];
                const sidebarCheckbox = document.getElementById(`filter-${category}`);
                if (sidebarCheckbox) sidebarCheckbox.checked = true;
            }
            
            renderProducts();
        });
    });

    // Sidebar Category Filter Checkboxes
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCategories = [];
            document.querySelectorAll('.filters-sidebar input[type="checkbox"]:checked').forEach(cb => {
                checkedCategories.push(cb.value);
            });
            activeFilters.categories = checkedCategories;
            
            // Sync with category pills
            categoryPills.forEach(pill => pill.classList.remove('active'));
            if (checkedCategories.length === 0) {
                document.getElementById('cat-all').classList.add('active');
            } else if (checkedCategories.length === 1) {
                const activePill = document.querySelector(`.category-pill[data-category="${checkedCategories[0]}"]`);
                if (activePill) activePill.classList.add('active');
            }
            
            renderProducts();
        });
    });

    // Price range slider (uema style)
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', (e) => {
            const val = e.target.value;
            priceValueLabel.textContent = `$${val}`;
            activeFilters.maxPrice = parseFloat(val);
            renderProducts();
        });
    }

    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            activeFilters = {
                search: '',
                categories: [],
                maxPrice: 80
            };
            
            // Reset inputs
            if (sidebarSearch) sidebarSearch.value = '';
            if (searchInput) searchInput.value = '';
            if (priceRangeInput) {
                priceRangeInput.value = 80;
                priceValueLabel.textContent = '$80';
            }
            document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
            categoryPills.forEach(pill => pill.classList.remove('active'));
            document.getElementById('cat-all').classList.add('active');
            
            renderProducts();
        });
    }

    // Filter Sidebar Toggle Button
    if (filterToggleBtn && shopContainer) {
        filterToggleBtn.addEventListener('click', () => {
            shopContainer.classList.toggle('filters-open');
            filterToggleBtn.classList.toggle('active');
        });
    }
    if (closeFiltersBtn && shopContainer && filterToggleBtn) {
        closeFiltersBtn.addEventListener('click', () => {
            shopContainer.classList.remove('filters-open');
            filterToggleBtn.classList.remove('active');
        });
    }

    // Sort Selector
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            activeSort = e.target.value;
            renderProducts();
        });
    }

    // Supplement Promo Panel button redirect
    const promoShopBtn = document.getElementById('promo-shop-btn');
    if (promoShopBtn) {
        promoShopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear other filters, select supplement
            clearFiltersBtn.click();
            const supplementPill = document.getElementById('cat-supplements');
            if (supplementPill) supplementPill.click();
            document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Step-by-step Routine Add-to-cart click handler
    document.querySelectorAll('.add-step-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prodId = e.target.getAttribute('data-id');
            const product = PRODUCTS.find(p => p.id === prodId);
            if (product) {
                const defaultSize = product.sizes[0];
                addToCart(product.id, defaultSize, 1);
                // Open drawer to show item added
                if (!cartDrawer.classList.contains('active')) {
                    toggleCartDrawer();
                }
            }
        });
    });

    // Testimonial Controls
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', () => {
            changeTestimonial(currentTestimonialIndex - 1);
            resetTestimonialTimer();
        });
    }
    if (testimonialNext) {
        testimonialNext.addEventListener('click', () => {
            changeTestimonial(currentTestimonialIndex + 1);
            resetTestimonialTimer();
        });
    }
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            changeTestimonial(idx);
            resetTestimonialTimer();
        });
    });

    // Modal Close
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', toggleProductModal);
    }
    if (productModalOverlay) {
        productModalOverlay.addEventListener('click', (e) => {
            if (e.target === productModalOverlay) toggleProductModal();
        });
    }

    // Modal Quantity adjustments
    if (modalQtyMinus) {
        modalQtyMinus.addEventListener('click', () => {
            let val = parseInt(modalQtyInput.value);
            if (val > 1) {
                modalQtyInput.value = val - 1;
            }
        });
    }
    if (modalQtyPlus) {
        modalQtyPlus.addEventListener('click', () => {
            let val = parseInt(modalQtyInput.value);
            modalQtyInput.value = val + 1;
        });
    }

    // Modal Add To Cart
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            if (selectedModalProduct) {
                const qty = parseInt(modalQtyInput.value) || 1;
                addToCart(selectedModalProduct.id, selectedModalSize, qty);
                toggleProductModal();
                toggleCartDrawer();
            }
        });
    }

    // Skin Routine Tab Switcher
    const skinTabBtns = document.querySelectorAll('.skin-tab-btn');
    const routineStepsGrid = document.getElementById('routine-steps-grid');
    
    if (skinTabBtns && routineStepsGrid) {
        skinTabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                skinTabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const skinType = e.target.getAttribute('data-skin');
                const routine = SKIN_ROUTINES[skinType] || SKIN_ROUTINES.all;
                
                routineStepsGrid.classList.add('switching');
                
                setTimeout(() => {
                    routine.forEach((step, idx) => {
                        const stepNum = idx + 1;
                        const actionEl = document.getElementById(`step-action-${stepNum}`);
                        const descEl = document.getElementById(`step-desc-${stepNum}`);
                        const buttonEl = document.getElementById(`btn-add-step-${stepNum}`);
                        
                        if (actionEl) actionEl.textContent = step.name;
                        if (descEl) descEl.textContent = step.desc;
                        if (buttonEl) {
                            buttonEl.setAttribute('data-id', step.id);
                        }
                    });
                    
                    routineStepsGrid.classList.remove('switching');
                }, 300);
            });
        });
    }

    // Buy Bundle Event Listener
    if (buyBundleBtn) {
        buyBundleBtn.addEventListener('click', () => {
            const productsToAdd = [
                { id: 'cleanser-1', size: '150ml' },
                { id: 'serum-1', size: '30ml' },
                { id: 'cream-1', size: '50ml' }
            ];
            
            productsToAdd.forEach(item => {
                addToCart(item.id, item.size, 1);
            });
            
            if (!cartDrawer.classList.contains('active')) {
                toggleCartDrawer();
            }
        });
    }

    // Modal Tabs logic
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            const tabId = e.target.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Dark Services Tabs switcher (PureGlow style)
    const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
    const serviceTabContents = document.querySelectorAll('.service-tab-content');
    const servicesTabImg = document.getElementById('services-tab-img');
    
    const servicesImages = {
        'tab-acne': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        'tab-hydration': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        'tab-aging': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    };

    serviceTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            serviceTabBtns.forEach(b => b.classList.remove('active'));
            serviceTabContents.forEach(c => c.classList.remove('active'));
            
            const targetTab = e.target.getAttribute('data-tab');
            e.target.classList.add('active');
            
            const contentBox = document.getElementById(targetTab);
            if (contentBox) contentBox.classList.add('active');
            
            if (servicesTabImg && servicesImages[targetTab]) {
                servicesTabImg.src = servicesImages[targetTab];
            }
        });
    });

    // Clean Ingredients Selector
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    const ingredientPanels = document.querySelectorAll('.ingredient-panel-content');
    
    if (ingredientCards && ingredientPanels) {
        ingredientCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetIngred = card.getAttribute('data-ingred');
                
                ingredientCards.forEach(c => c.classList.remove('active'));
                ingredientPanels.forEach(p => p.classList.remove('active'));
                
                card.classList.add('active');
                const panel = document.getElementById(targetIngred);
                if (panel) panel.classList.add('active');
            });
        });
    }
}

/* ==========================================================================
   4. Search & Filtering Core
   ========================================================================== */
function executeSearch() {
    const val = searchOverlayInput ? searchOverlayInput.value : '';
    activeFilters.search = val;
    if (sidebarSearch) sidebarSearch.value = val;
    renderProducts();
    document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
}

function renderProducts() {
    // 1. Filter Products
    let filtered = PRODUCTS.filter(prod => {
        // Keyword Search match
        const searchLower = activeFilters.search.toLowerCase().trim();
        const matchesSearch = searchLower === '' || 
            prod.name.toLowerCase().includes(searchLower) ||
            prod.shortDesc.toLowerCase().includes(searchLower) ||
            prod.category.toLowerCase().includes(searchLower);

        // Category Filter match
        const matchesCategory = activeFilters.categories.length === 0 || 
            activeFilters.categories.includes(prod.category);

        // Price Filter match
        const matchesPrice = prod.price <= activeFilters.maxPrice;

        // Wishlist Filter match
        const matchesWishlist = !activeFilters.onlyWishlist || wishlist.includes(prod.id);

        return matchesSearch && matchesCategory && matchesPrice && matchesWishlist;
    });

    // 2. Sort Products
    if (activeSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } // 'featured' retains natural array order

    // Update product results header text
    if (productResultsCount) {
        if (filtered.length === 0) {
            productResultsCount.textContent = "No products match your filters";
        } else if (filtered.length === 1) {
            productResultsCount.textContent = "Showing 1 product";
        } else {
            productResultsCount.textContent = `Showing all ${filtered.length} products`;
        }
    }

    // 3. Render HTML
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    filtered.forEach(prod => {
        const isWishlisted = wishlist.includes(prod.id);
        const cardHTML = `
            <article class="product-card" data-id="${prod.id}">
                <div class="product-card-image">
                    ${prod.tag ? `<span class="card-badge sale">${prod.tag}</span>` : ''}
                    <button class="wishlist-btn-overlay ${isWishlisted ? 'active' : ''}" aria-label="Toggle Wishlist" data-id="${prod.id}">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <img src="${prod.image}" alt="${prod.name}">
                    <div class="quick-add-overlay">
                        <button class="quick-add-btn" data-id="${prod.id}">Quick View</button>
                    </div>
                </div>
                <div class="product-card-info">
                    <div>
                        <span class="product-card-tag">${prod.category}</span>
                        <h3 class="product-card-title">${prod.name}</h3>
                        <div class="product-card-rating">
                            <span class="stars">★ ${prod.rating}</span>
                            <span>(${prod.reviewsCount} reviews)</span>
                        </div>
                    </div>
                    <div class="product-card-price-row">
                        <span class="current-price">$${prod.price.toFixed(2)}</span>
                        ${prod.comparePrice ? `<span class="compare-price">$${prod.comparePrice.toFixed(2)}</span>` : ''}
                    </div>
                </div>
            </article>
        `;
        productGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Reattach listeners to product cards
    attachCardListeners();
}

function attachCardListeners() {
    // 1. Wishlist Buttons
    document.querySelectorAll('.wishlist-btn-overlay').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prodId = btn.getAttribute('data-id');
            toggleWishlist(prodId);
        });
    });

    // 2. Card click or Quick Add View button click opens modal
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If clicked wishlist, stop propagation
            if (e.target.closest('.wishlist-btn-overlay')) return;
            
            const prodId = card.getAttribute('data-id');
            openProductDetailModal(prodId);
        });
    });

    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prodId = btn.getAttribute('data-id');
            openProductDetailModal(prodId);
        });
    });
}

/* ==========================================================================
   5. Cart Logic & UI Updates
   ========================================================================== */
function toggleCartDrawer() {
    cartDrawer.classList.toggle('active');
    cartDrawerOverlay.classList.toggle('active');
}

function addToCart(productId, size, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Check if matching item exists in cart already
    const existing = cart.find(item => item.id === productId && item.size === size);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            size: size,
            qty: qty
        });
    }

    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateCartUI();
}

function changeCartQty(productId, size, offset) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (!item) return;

    item.qty += offset;
    
    if (item.qty <= 0) {
        cart = cart.filter(it => !(it.id === productId && it.size === size));
    }

    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(productId, size) {
    cart = cart.filter(it => !(it.id === productId && it.size === size));
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    if (!cartItemsContainer) return;

    // Remove old items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Update counts
    cartCountBadge.textContent = totalItems;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    // Update mobile bottom nav badge
    const mobileCartBadge = document.getElementById('mobile-cart-count');
    if (mobileCartBadge) {
        mobileCartBadge.textContent = totalItems;
        mobileCartBadge.setAttribute('data-count', totalItems);
    }

    // Update mobile bottom nav badge in parent wrapper
    if (window.parent && window.parent.document) {
        const parentCartBadge = window.parent.document.getElementById('mobile-cart-badge');
        if (parentCartBadge) {
            parentCartBadge.textContent = totalItems;
            parentCartBadge.setAttribute('data-count', totalItems);
        }
    }

    if (cart.length === 0) {
        emptyCartView.style.display = 'flex';
        cartFooterView.style.display = 'none';
        shippingProgressText.textContent = "Spend $75.00 more for Free Shipping!";
        shippingProgressFill.style.width = "0%";
    } else {
        emptyCartView.style.display = 'none';
        cartFooterView.style.display = 'block';

        // Populate items
        cart.forEach(item => {
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img-wrapper">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div>
                            <div class="cart-item-title-row">
                                <span class="cart-item-title">${item.name}</span>
                                <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">Remove</button>
                            </div>
                            <div class="cart-item-meta">Size: ${item.size}</div>
                        </div>
                        <div class="cart-item-bottom">
                            <div class="qty-controls">
                                <button class="qty-minus" data-id="${item.id}" data-size="${item.size}">-</button>
                                <span>${item.qty}</span>
                                <button class="qty-plus" data-id="${item.id}" data-size="${item.size}">+</button>
                            </div>
                            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Setup Cart Item Action Listeners
        cartItemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                changeCartQty(btn.getAttribute('data-id'), btn.getAttribute('data-size'), -1);
            });
        });
        cartItemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                changeCartQty(btn.getAttribute('data-id'), btn.getAttribute('data-size'), 1);
            });
        });
        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.getAttribute('data-id'), btn.getAttribute('data-size'));
            });
        });

        // Shipping Progress Calculations
        const FREE_SHIPPING_LIMIT = 75.00;
        if (subtotal >= FREE_SHIPPING_LIMIT) {
            shippingProgressText.textContent = "You've unlocked Free Shipping! 🎉";
            shippingProgressFill.style.width = "100%";
        } else {
            const remaining = FREE_SHIPPING_LIMIT - subtotal;
            shippingProgressText.textContent = `Spend $${remaining.toFixed(2)} more for Free Shipping!`;
            const percentage = (subtotal / FREE_SHIPPING_LIMIT) * 100;
            shippingProgressFill.style.width = `${percentage}%`;
        }
    }
}

/* ==========================================================================
   6. Wishlist Logic
   ========================================================================== */
function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
    } else {
        wishlist.push(productId);
    }
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts(); // Re-render to update wishlist active heart status on grid cards
}

function updateWishlistUI() {
    wishlistCountBadge.textContent = wishlist.length;

    // Update mobile bottom nav badge
    const mobileWishlistBadge = document.getElementById('mobile-wishlist-count');
    if (mobileWishlistBadge) {
        mobileWishlistBadge.textContent = wishlist.length;
        mobileWishlistBadge.setAttribute('data-count', wishlist.length);
    }

    // Update mobile bottom nav badge in parent wrapper
    if (window.parent && window.parent.document) {
        const parentWishlistBadge = window.parent.document.getElementById('mobile-wishlist-badge');
        if (parentWishlistBadge) {
            parentWishlistBadge.textContent = wishlist.length;
            parentWishlistBadge.setAttribute('data-count', wishlist.length);
        }
    }
}

/* ==========================================================================
   7. Product Detail Modal Logic (Beauty Shop Style)
   ========================================================================== */
function toggleProductModal() {
    productModalOverlay.classList.toggle('active');
    document.body.style.overflow = productModalOverlay.classList.contains('active') ? 'hidden' : 'auto';
}

function openProductDetailModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    selectedModalProduct = product;
    selectedModalSize = product.sizes[0];
    modalQtyInput.value = 1;

    // Reset Active Tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(cont => cont.classList.remove('active'));
    document.getElementById('tab-desc-btn').classList.add('active');
    document.getElementById('tab-description').classList.add('active');

    // Populate Fields
    modalMainImg.src = product.image;
    modalMainImg.alt = product.name;
    modalProductTag.textContent = product.category;
    modalProductName.textContent = product.name;
    modalRatingStars.textContent = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));
    modalRatingCount.textContent = `${product.rating} (${product.reviewsCount} Reviews)`;
    modalCurrentPrice.textContent = `$${product.price.toFixed(2)}`;
    
    if (product.comparePrice) {
        modalComparePrice.textContent = `$${product.comparePrice.toFixed(2)}`;
        modalComparePrice.style.display = 'inline';
        const pct = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
        modalDiscount.textContent = `${pct}% off`;
        modalDiscount.style.display = 'inline-block';
    } else {
        modalComparePrice.style.display = 'none';
        modalDiscount.style.display = 'none';
    }

    modalShortDesc.textContent = product.shortDesc;

    // Size badges populating dynamically
    modalSizeOptions.innerHTML = '';
    product.sizes.forEach(size => {
        const badge = document.createElement('button');
        badge.className = `size-badge ${size === selectedModalSize ? 'active' : ''}`;
        badge.textContent = size;
        badge.addEventListener('click', () => {
            modalSizeOptions.querySelectorAll('.size-badge').forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
            selectedModalSize = size;
        });
        modalSizeOptions.appendChild(badge);
    });

    // Populate descriptions
    document.getElementById('tab-description').innerHTML = `<p>${product.description}</p>`;
    document.getElementById('tab-ingredients').innerHTML = `<p>${product.ingredients}</p>`;
    document.getElementById('tab-directions').innerHTML = `<p>${product.directions}</p>`;

    toggleProductModal();
}

/* ==========================================================================
   8. Testimonial Carousel Auto-Slider Logic
   ========================================================================== */
function startTestimonialSlider() {
    testimonialTimer = setInterval(() => {
        changeTestimonial(currentTestimonialIndex + 1);
    }, 5000);
}

function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    startTestimonialSlider();
}

function changeTestimonial(newIndex) {
    testimonialSlides[currentTestimonialIndex].classList.remove('active');
    
    if (newIndex >= testimonialSlides.length) {
        currentTestimonialIndex = 0;
    } else if (newIndex < 0) {
        currentTestimonialIndex = testimonialSlides.length - 1;
    } else {
        currentTestimonialIndex = newIndex;
    }

    testimonialSlides[currentTestimonialIndex].classList.add('active');
    
    // Sync Dot indicators
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentTestimonialIndex]) {
        dots[currentTestimonialIndex].classList.add('active');
    }
}

/* ==========================================================================
   9. Announcement Bar Auto-Carousel Rotator
   ========================================================================== */
function initAnnouncementRotator() {
    const slides = document.querySelectorAll('.announcement-slide');
    if (slides.length <= 1) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        const activeSlide = slides[currentIndex];
        activeSlide.classList.remove('active');
        activeSlide.classList.add('exit');
        
        currentIndex = (currentIndex + 1) % slides.length;
        
        const nextSlide = slides[currentIndex];
        nextSlide.classList.remove('exit');
        nextSlide.classList.add('active');
        
        setTimeout(() => {
            slides.forEach((slide, idx) => {
                if (idx !== currentIndex) {
                    slide.classList.remove('exit');
                }
            });
        }, 400);
    }, 4000);
}
