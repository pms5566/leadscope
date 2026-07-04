/* ==========================================
   PREETI AGRAWAL JEWELRY - ETHEREAL LUXURY
   JavaScript Behaviors & E-commerce Operations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PRODUCT DATABASE (Foxtale Inspired details)
  const PRODUCTS_DB = {
    "ring-1": {
      id: "ring-1",
      name: "Aurelia Citrine Ring",
      stone: "Citrine (Abundance)",
      price: "NPR 18,500",
      priceNumber: 18500,
      img: "assets/product_ring.png",
      desc: "Handcrafted 18K yellow gold band holding a radiant oval-cut Himalayan Citrine.",
      benefits: "✦ Invites wealth, success, and positive solar energy. Aligns the Solar Plexus Chakra.",
      category: "rings",
      sizes: ["6", "7", "8", "9"]
    },
    "earring-1": {
      id: "earring-1",
      name: "Elysian Drop Earrings",
      stone: "Tourmaline (Protection)",
      price: "NPR 24,000",
      priceNumber: 24000,
      img: "assets/product_earrings.png",
      desc: "Intricate watermelon tourmaline droplets hanging from delicate filigree threads.",
      benefits: "✦ Provides energetic grounding, shielding from negativity, and emotional balance.",
      category: "earrings",
      sizes: []
    },
    "necklace-1": {
      id: "necklace-1",
      name: "Imperial Ruby Pendant",
      stone: "Ruby (Passion & Vitality)",
      price: "NPR 45,000",
      priceNumber: 45000,
      img: "assets/product_necklace.png",
      desc: "Deep red natural ruby set in an ornate vintage-style crown pendant.",
      benefits: "✦ Amplifies life-force energy, passion, courage, and root chakra grounding.",
      category: "necklaces",
      sizes: []
    },
    "bracelet-1": {
      id: "bracelet-1",
      name: "Serene Beaded Bracelet",
      stone: "Amazonite (Calm & Courage)",
      price: "NPR 15,200",
      priceNumber: 15200,
      img: "assets/product_bracelet.png",
      desc: "Double-strung polished amazonite beads punctuated by 14K gold spacer rings.",
      benefits: "✦ Disperses worry, balances throat chakra expression, and calms the nervous system.",
      category: "bracelets",
      sizes: ["6.5 in", "7.0 in", "7.5 in"]
    },
    "pendant-1": {
      id: "pendant-1",
      name: "Raw Amethyst Wire Pendant",
      stone: "Amethyst (Inner Peace)",
      price: "NPR 19,800",
      priceNumber: 19800,
      img: "assets/product_pendant.png",
      desc: "A rough-cut, high-clarity amethyst crystal point hand-wrapped in gold wire.",
      benefits: "✦ Clears the mind, enhances intuition, and stimulates the crown chakra for peace.",
      category: "pendants",
      sizes: []
    },
    "brooch-1": {
      id: "brooch-1",
      name: "Glittering Uvarovite Brooch",
      stone: "Uvarovite (Prosperity)",
      price: "NPR 28,500",
      priceNumber: 28500,
      img: "assets/product_brooch.png",
      desc: "A rare green garnet druzy cluster brooch accented with gold leafing details.",
      benefits: "✦ Manifests material abundance, promotes spiritual growth, and opens heart chakra.",
      category: "brooches",
      sizes: []
    }
  };

  // Global E-commerce States
  let cart = [];
  let wishlistCount = 0;
  const wishlistedItems = new Set();
  let selectedProductIdForModal = null;

  // Header Elements
  const header = document.querySelector('.header-wrapper');
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const closeMenuBtn = document.querySelector('.close-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');

  // Cart Drawer Elements
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerClose = document.getElementById('cart-drawer-close');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartRewardsMessage = document.getElementById('cart-rewards-message');
  const cartRewardsProgressBar = document.getElementById('cart-rewards-progress-bar');
  const cartEmptyMessage = document.getElementById('cart-empty-message');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartUpsellContainer = document.getElementById('cart-upsell-container');
  const cartUpsellRow = document.getElementById('cart-upsell-row');
  const cartDrawerFooter = document.getElementById('cart-drawer-footer');
  const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
  const cartCloseShopBtn = document.getElementById('cart-close-shop-btn');

  // Variant Modal Elements
  const variantModalOverlay = document.getElementById('variant-modal-overlay');
  const variantModal = document.getElementById('variant-modal');
  const variantModalClose = document.getElementById('variant-modal-close');
  const variantForm = document.getElementById('variant-form');
  const variantModalImg = document.getElementById('variant-modal-img');
  const variantModalStone = document.getElementById('variant-modal-stone');
  const variantModalTitle = document.getElementById('variant-modal-title');
  const variantModalPrice = document.getElementById('variant-modal-price');
  const variantModalProperties = document.getElementById('variant-modal-properties');
  const sizeOptionGroup = document.getElementById('size-option-group');
  const sizePillsContainer = document.getElementById('size-pills-container');
  const metalPillsContainer = document.getElementById('metal-pills-container');

  // Sticky Purchase Bar Elements
  const stickyPurchaseBar = document.getElementById('sticky-purchase-bar');
  const stickyPurchaseThumb = document.getElementById('sticky-purchase-thumb');
  const stickyPurchaseName = document.getElementById('sticky-purchase-name');
  const stickyPurchasePrice = document.getElementById('sticky-purchase-price');
  const stickyPurchaseBtn = document.getElementById('sticky-purchase-btn');

  // ==========================================
  // 2. STICKY NAVIGATION & SCROLL EVENTS
  // ==========================================
  window.addEventListener('scroll', () => {
    // Header Scroll class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Mobile Sticky Purchase Bar scroll trigger
    if (window.innerWidth <= 768) {
      const collectionsSection = document.getElementById('collections');
      if (collectionsSection) {
        const rect = collectionsSection.getBoundingClientRect();
        // If we scrolled past the top of the collections section
        if (rect.top < 100 && rect.bottom > 200) {
          // Find which product is closest to center
          const cards = document.querySelectorAll('.product-card');
          let closestCard = null;
          let minDistance = Infinity;
          const centerY = window.innerHeight / 2;

          cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.top + cardRect.height / 2;
            const distance = Math.abs(cardCenter - centerY);
            if (distance < minDistance) {
              minDistance = distance;
              closestCard = card;
            }
          });

          if (closestCard) {
            const prodId = closestCard.getAttribute('data-id');
            const product = PRODUCTS_DB[prodId];
            if (product) {
              stickyPurchaseThumb.src = product.img;
              stickyPurchaseName.textContent = product.name;
              stickyPurchasePrice.textContent = product.price;
              stickyPurchaseBtn.setAttribute('data-id', prodId);
              stickyPurchaseBar.classList.add('active');
            }
          }
        } else {
          stickyPurchaseBar.classList.remove('active');
        }
      }
    } else {
      stickyPurchaseBar.classList.remove('active');
    }
  });

  // Mobile Menu Navigation Toggles
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ==========================================
  // 3. CART DRAWER OPERATIONS
  // ==========================================
  function openCartDrawer() {
    cartDrawerOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCartUI();
  }

  function closeCartDrawer() {
    cartDrawerOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind Cart header icon and drawer triggers
  const cartIconBtn = document.querySelector('button[aria-label="Shopping Cart"]');
  if (cartIconBtn) {
    cartIconBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', closeCartDrawer);
  }
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  }
  if (cartCloseShopBtn) {
    cartCloseShopBtn.addEventListener('click', closeCartDrawer);
  }

  // Format price helper
  function formatNPR(num) {
    return "NPR " + num.toLocaleString('en-IN');
  }

  // Update Cart State & Elements
  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.priceNumber * item.quantity), 0);

    // Update Badges & Counts
    cartDrawerCount.textContent = totalItems;
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Toggle Empty State vs List
    if (cart.length === 0) {
      cartEmptyMessage.style.display = 'block';
      cartItemsList.style.display = 'none';
      cartUpsellContainer.style.display = 'none';
      cartDrawerFooter.style.display = 'none';
    } else {
      cartEmptyMessage.style.display = 'none';
      cartItemsList.style.display = 'block';
      cartUpsellContainer.style.display = 'block';
      cartDrawerFooter.style.display = 'block';

      // 1. Render Items
      cartItemsList.innerHTML = '';
      cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h5 class="cart-item-title">${item.name}</h5>
            <span class="cart-item-meta">${item.metal}${item.size ? ` / Size ${item.size}` : ''}</span>
            <div class="cart-item-qty">
              <button class="qty-btn minus" data-index="${index}">&minus;</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn plus" data-index="${index}">&plus;</button>
            </div>
          </div>
          <div class="cart-item-right">
            <span class="cart-item-price">${formatNPR(item.priceNumber * item.quantity)}</span>
            <span class="cart-item-remove" data-index="${index}">Remove</span>
          </div>
        `;
        cartItemsList.appendChild(itemEl);
      });

      // Bind dynamic quantity and remove listeners
      cartItemsList.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => adjustQty(parseInt(btn.getAttribute('data-index')), -1));
      });
      cartItemsList.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => adjustQty(parseInt(btn.getAttribute('data-index')), 1));
      });
      cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.getAttribute('data-index'))));
      });

      // 2. Render Subtotal
      cartSubtotalPrice.textContent = formatNPR(subtotal);

      // 3. Render Progressive Rewards Stepper (Foxtale inspired)
      let progressWidth = 0;
      let milestone1 = false;
      let milestone2 = false;
      let milestone3 = false;
      let rewardsMsg = "";

      if (subtotal < 2000) {
        progressWidth = (subtotal / 2000) * 15;
        rewardsMsg = `Add <strong>NPR ${(2000 - subtotal).toLocaleString('en-IN')}</strong> to unlock <strong>Free Insured Shipping</strong>!`;
      } else if (subtotal < 25000) {
        milestone1 = true;
        progressWidth = 15 + ((subtotal - 2000) / 23000) * 40;
        rewardsMsg = `🎉 Free Shipping unlocked! Add <strong>NPR ${(25000 - subtotal).toLocaleString('en-IN')}</strong> to get a <strong>Free Silk Pouch</strong>!`;
      } else if (subtotal < 45000) {
        milestone1 = true;
        milestone2 = true;
        progressWidth = 55 + ((subtotal - 25000) / 20000) * 40;
        rewardsMsg = `🎁 Silk Pouch unlocked! Add <strong>NPR ${(45000 - subtotal).toLocaleString('en-IN')}</strong> to get a <strong>Selenite Cleansing Plate</strong>!`;
      } else {
        milestone1 = true;
        milestone2 = true;
        milestone3 = true;
        progressWidth = 100;
        rewardsMsg = `✨ <strong>Divine Chest Completed!</strong> Free Shipping, Silk Protective Pouch & Selenite Plate unlocked!`;
      }

      cartRewardsProgressBar.style.width = `${progressWidth}%`;

      // Update milestone bubbles
      const ms1 = document.querySelector('.cart-rewards-milestone.milestone-1');
      const ms2 = document.querySelector('.cart-rewards-milestone.milestone-2');
      const ms3 = document.querySelector('.cart-rewards-milestone.milestone-3');

      if (milestone1) ms1.classList.add('active'); else ms1.classList.remove('active');
      if (milestone2) ms2.classList.add('active'); else ms2.classList.remove('active');
      if (milestone3) ms3.classList.add('active'); else ms3.classList.remove('active');

      cartRewardsMessage.innerHTML = rewardsMsg;

      // 4. Render Upsells
      renderUpsells();
    }
  }

  // Adjust item quantity
  function adjustQty(index, change) {
    if (cart[index]) {
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      updateCartUI();
    }
  }

  // Remove item
  function removeFromCart(index) {
    if (cart[index]) {
      cart.splice(index, 1);
      updateCartUI();
    }
  }

  // Render cross-sell recommendation upsell row
  function renderUpsells() {
    // Recommend items not currently in the cart
    const itemsInCart = new Set(cart.map(item => item.id));
    const upsellItems = Object.keys(PRODUCTS_DB)
      .filter(id => !itemsInCart.has(id))
      .slice(0, 2); // Show top 2 matches

    if (upsellItems.length === 0) {
      cartUpsellContainer.style.display = 'none';
      return;
    }

    cartUpsellContainer.style.display = 'block';
    cartUpsellRow.innerHTML = '';

    upsellItems.forEach(id => {
      const prod = PRODUCTS_DB[id];
      const upsellEl = document.createElement('div');
      upsellEl.className = 'cart-upsell-item';
      upsellEl.innerHTML = `
        <img src="${prod.img}" alt="${prod.name}" class="cart-upsell-img">
        <div class="cart-upsell-details">
          <span class="cart-upsell-name">${prod.name}</span>
          <span class="cart-upsell-price">${prod.price}</span>
        </div>
        <button class="cart-upsell-btn" data-id="${prod.id}">Add</button>
      `;
      cartUpsellRow.appendChild(upsellEl);

      // Handle upsell click (adds default variant)
      upsellEl.querySelector('.cart-upsell-btn').addEventListener('click', () => {
        addDefaultProductToCart(prod.id);
      });
    });
  }

  // Add item with default variants instantly (used for upsell or no-size products)
  function addDefaultProductToCart(productId) {
    const product = PRODUCTS_DB[productId];
    if (!product) return;

    const defaultSize = product.sizes.length > 0 ? product.sizes[0] : null;
    const defaultMetal = "18K Yellow Gold";

    // Check if matching item is in cart
    const existingIndex = cart.findIndex(item => 
      item.id === productId && 
      item.size === defaultSize && 
      item.metal === defaultMetal
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity++;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        priceNumber: product.priceNumber,
        img: product.img,
        quantity: 1,
        size: defaultSize,
        metal: defaultMetal,
        stone: product.stone
      });
    }

    updateCartUI();
    // Open drawer to give instant feedback
    openCartDrawer();
  }

  // Checkout handler
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      alert(`Thank you for shopping! Proceeding to secure checkout for total ${cartSubtotalPrice.textContent}`);
      cart = [];
      closeCartDrawer();
      updateCartUI();
    });
  }


  // ==========================================
  // 4. QUICK VARIANT MODAL DIALOG
  // ==========================================
  function openVariantModal(productId) {
    const product = PRODUCTS_DB[productId];
    if (!product) return;

    selectedProductIdForModal = productId;

    // Populate static fields
    variantModalImg.src = product.img;
    variantModalImg.alt = product.name;
    variantModalStone.textContent = product.stone;
    variantModalTitle.textContent = product.name;
    variantModalPrice.textContent = product.price;
    variantModalProperties.textContent = product.desc + " " + product.benefits;

    // Populate sizes
    if (product.sizes.length > 0) {
      sizeOptionGroup.style.display = 'block';
      sizePillsContainer.innerHTML = '';
      product.sizes.forEach((sz, idx) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `variant-pill ${idx === 0 ? 'active' : ''}`;
        pill.textContent = sz;
        pill.setAttribute('data-value', sz);
        pill.addEventListener('click', () => {
          sizePillsContainer.querySelectorAll('.variant-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
        sizePillsContainer.appendChild(pill);
      });
    } else {
      sizeOptionGroup.style.display = 'none';
      sizePillsContainer.innerHTML = '';
    }

    // Reset metal pills to default
    metalPillsContainer.querySelectorAll('.variant-pill').forEach((pill, idx) => {
      if (idx === 0) pill.classList.add('active');
      else pill.classList.remove('active');
    });

    // Toggle Modal visibility
    variantModalOverlay.classList.add('active');
    variantModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVariantModal() {
    variantModalOverlay.classList.remove('active');
    variantModal.classList.remove('active');
    document.body.style.overflow = '';
    selectedProductIdForModal = null;
  }

  // Handle metal pill selection in modal
  metalPillsContainer.querySelectorAll('.variant-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      metalPillsContainer.querySelectorAll('.variant-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  if (variantModalClose) variantModalClose.addEventListener('click', closeVariantModal);
  if (variantModalOverlay) variantModalOverlay.addEventListener('click', closeVariantModal);

  // Modal form submit handler
  if (variantForm) {
    variantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedProductIdForModal) return;

      const product = PRODUCTS_DB[selectedProductIdForModal];
      const selectedMetal = metalPillsContainer.querySelector('.variant-pill.active').getAttribute('data-value');
      
      let selectedSize = null;
      if (product.sizes.length > 0) {
        const activeSizePill = sizePillsContainer.querySelector('.variant-pill.active');
        if (activeSizePill) {
          selectedSize = activeSizePill.getAttribute('data-value');
        }
      }

      // Add to cart
      const existingIndex = cart.findIndex(item => 
        item.id === selectedProductIdForModal && 
        item.size === selectedSize && 
        item.metal === selectedMetal
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity++;
      } else {
        cart.push({
          id: selectedProductIdForModal,
          name: product.name,
          priceNumber: product.priceNumber,
          img: product.img,
          quantity: 1,
          size: selectedSize,
          metal: selectedMetal,
          stone: product.stone
        });
      }

      // Close modal and reveal Cart Drawer
      closeVariantModal();
      openCartDrawer();
    });
  }

  // Bind Quick Add clicks on main product cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const quickAdd = card.querySelector('.quick-add-btn');
    const prodId = card.getAttribute('data-id');

    if (quickAdd && prodId) {
      quickAdd.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const product = PRODUCTS_DB[prodId];
        // If product has sizes, open modal. Otherwise, add directly.
        if (product && product.sizes.length > 0) {
          openVariantModal(prodId);
        } else {
          addDefaultProductToCart(prodId);
        }
      });
    }
  });

  // Bind Sticky bottom Quick Add button
  if (stickyPurchaseBtn) {
    stickyPurchaseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = stickyPurchaseBtn.getAttribute('data-id');
      if (prodId) {
        const product = PRODUCTS_DB[prodId];
        if (product && product.sizes.length > 0) {
          openVariantModal(prodId);
        } else {
          addDefaultProductToCart(prodId);
        }
      }
    });
  }


  // ==========================================
  // 5. METAPHYSICAL BENEFIT TOGGLES ("How they heal")
  // ==========================================
  const benefitToggleBtns = document.querySelectorAll('.benefit-toggle-btn');
  benefitToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('.product-card');
      if (!card) return;

      const descText = card.querySelector('.product-desc-text');
      const benefitText = card.querySelector('.product-benefit-text');

      if (descText && benefitText) {
        const isShowingBenefit = benefitText.style.display !== 'none';

        if (isShowingBenefit) {
          // Switch back to description
          benefitText.style.display = 'none';
          descText.style.display = 'block';
          btn.textContent = 'Show Healing Aura';
          card.classList.remove('showing-benefit');
        } else {
          // Switch to healing benefit
          descText.style.display = 'none';
          benefitText.style.display = 'block';
          btn.textContent = 'Show Details';
          card.classList.add('showing-benefit');
        }
      }
    });
  });


  // ==========================================
  // 6. CATEGORY FILTER TABS
  // ==========================================
  const filterPills = document.querySelectorAll('.filter-pill');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Remove active class from other pills
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-category');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Hide/Show with small transition
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });


  // ==========================================
  // 7. WISHLIST INTERACTIVE BADGES
  // ==========================================
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');

  wishlistBtns.forEach(btn => {
    const card = btn.closest('.product-card');
    const productId = card ? card.getAttribute('data-id') : Math.random().toString();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (wishlistedItems.has(productId)) {
        // Remove from wishlist
        wishlistedItems.delete(productId);
        btn.classList.remove('active');
        wishlistCount = Math.max(0, wishlistCount - 1);
      } else {
        // Add to wishlist
        wishlistedItems.add(productId);
        btn.classList.add('active');
        wishlistCount++;
        
        // Scale pulse effect
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => btn.style.transform = '', 300);
      }

      if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
        wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
        
        // Bounce animation
        wishlistBadge.style.transform = 'scale(1.4)';
        setTimeout(() => {
          wishlistBadge.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });


  // ==========================================
  // 8. TESTIMONIALS SLIDER & SCROLL REVEALS
  // ==========================================
  const testimonialsSlider = document.querySelector('.testimonials-slider');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (testimonialsSlider && testimonialCards.length > 0) {
    let currentIndex = 0;
    
    // Generate dots based on count
    testimonialCards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
      currentIndex = index;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        testimonialsSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      } else {
        testimonialsSlider.style.transform = `none`;
      }
      
      dots.forEach((d, i) => {
        if (i === currentIndex) d.classList.add('active');
        else d.classList.remove('active');
      });
    }

    window.addEventListener('resize', () => {
      goToSlide(currentIndex);
    });

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;
    
    testimonialsSlider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    testimonialsSlider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diffX = startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentIndex < testimonialCards.length - 1) {
          goToSlide(currentIndex + 1);
        } else if (diffX < 0 && currentIndex > 0) {
          goToSlide(currentIndex - 1);
        }
      }
    }
  }

  // Scroll Reveal Fade-in Observer
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
