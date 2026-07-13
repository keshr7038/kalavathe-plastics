// --- PRODUCT DETAILS PAGE CONTROLLER ---

let PRODUCTS = [];
let inquiryCart = [];
let activeProduct = null;
let selectedColor = "";
let selectedSize = "";

// --- ELEMENTS ---
const breadcrumbContainer = document.getElementById('product-breadcrumb');
const detailTitle = document.getElementById('detail-title');
const detailBadge = document.getElementById('detail-badge');
const detailCategory = document.getElementById('detail-category');
const detailShortDesc = document.getElementById('detail-short-desc');
const detailFullDesc = document.getElementById('detail-full-desc');
const detailFeatures = document.getElementById('detail-features');
const detailSpecsBody = document.getElementById('detail-specs-body');
const detailColorsSection = document.getElementById('detail-colors-section');
const detailColorsContainer = document.getElementById('detail-colors');
const detailSizesSection = document.getElementById('detail-sizes-section');
const detailSizesContainer = document.getElementById('detail-sizes');
const detailMainImage = document.getElementById('detail-main-image');
const detailImageSkeleton = document.getElementById('detail-image-skeleton');
const detailThumbnails = document.getElementById('detail-thumbnails');
const relatedGrid = document.getElementById('related-products-grid');

const detailWhatsappBtn = document.getElementById('detail-whatsapp-btn');
const detailCallBtn = document.getElementById('detail-call-btn');

// Cart Drawer Elements
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const drawerClose = document.getElementById('drawer-close');
const cartOverlay = document.getElementById('cart-overlay');
const cartCountBadge = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountSummary = document.querySelector('.drawer-header h3');
const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');
const clientNotes = document.getElementById('client-notes');

// Notice Banner Elements
const noticeBanner = document.getElementById('delivery-notice-banner');
const closeNoticeBtn = document.getElementById('close-notice-btn');

// --- HELPER: SAFE LOCALSTORAGE PARSER ---
function safeParseLocalItem(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultVal;
    return JSON.parse(item) || defaultVal;
  } catch (e) {
    console.error(`Error parsing localStorage item for key "${key}":`, e);
    return defaultVal;
  }
}

// --- BOOTSTRAP DETAILS PAGE ---
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Cart state
  inquiryCart = safeParseLocalItem('inquiryCart', []);
  updateCartCount();
  renderCartItems();

  // 2. Fetch products catalog
  if (typeof SupabaseDB !== 'undefined') {
    PRODUCTS = await SupabaseDB.fetchProducts();
  } else {
    PRODUCTS = typeof DEFAULT_PRODUCTS !== 'undefined' ? DEFAULT_PRODUCTS : [];
  }

  // 3. Extract slug and locate active product
  const urlParams = new URLSearchParams(window.location.search);
  let slug = urlParams.get('slug');
  if (!slug) {
    const parts = window.location.pathname.split('/');
    if (parts[1] === 'products' && parts[2]) {
      slug = parts[2];
    }
  }

  if (slug) {
    activeProduct = PRODUCTS.find(p => p.slug === slug || p.id === slug);
  }

  // Fallback to first product if not found
  if (!activeProduct && PRODUCTS.length > 0) {
    activeProduct = PRODUCTS[0];
  }

  if (activeProduct) {
    renderProductDetails(activeProduct);
    renderRelatedProducts(activeProduct);
  }

  // 4. Attach common header/footer listeners
  initCartListeners();
  initNoticeBanner();
});

// --- RENDER DETAILED PRODUCT SPECIFICATIONS ---
function renderProductDetails(product) {
  // Dynamic SEO Metadata updates
  document.title = `${product.name} | Kalavathi Plastics`;
  updateMetaTag('name', 'description', product.shortDescription || product.description);
  updateMetaTag('property', 'og:title', `${product.name} | Kalavathi Plastics`);
  updateMetaTag('property', 'og:description', product.shortDescription || product.description);
  updateMetaTag('property', 'og:image', getAbsoluteAssetPath(product.thumbnail || (product.images && product.images[0]) || ''));
  updateMetaTag('property', 'og:url', window.location.href);

  // Breadcrumbs
  if (breadcrumbContainer) {
    breadcrumbContainer.innerHTML = `
      <a href="/">Home</a>
      <span>&gt;</span>
      <a href="/#products">Products</a>
      <span>&gt;</span>
      <span style="color: var(--color-primary-text); font-weight: 600;">${product.name}</span>
    `;
  }

  // Title, Badge, Category
  if (detailTitle) detailTitle.textContent = product.name;
  if (detailCategory) detailCategory.textContent = product.category;
  
  if (detailBadge && product.badge) {
    detailBadge.textContent = product.badge;
    detailBadge.style.display = 'inline-flex';
  } else if (detailBadge) {
    detailBadge.style.display = 'none';
  }

  // Descriptions
  if (detailShortDesc) detailShortDesc.textContent = product.shortDescription || product.description;
  if (detailFullDesc) detailFullDesc.textContent = product.fullDescription || product.description;

  // Features list
  if (detailFeatures && product.features) {
    detailFeatures.innerHTML = product.features.map(f => `
      <li style="margin-bottom: 0.5rem; position: relative;">${f}</li>
    `).join('');
  }

  // Specifications table
  if (detailSpecsBody && product.specifications) {
    detailSpecsBody.innerHTML = Object.entries(product.specifications).map(([key, value]) => `
      <tr>
        <td>${key}</td>
        <td>${value}</td>
      </tr>
    `).join('');
  }

  // Color options swatches
  if (product.colors && product.colors.length > 0) {
    selectedColor = product.colors[0];
    detailColorsSection.style.display = 'block';
    detailColorsContainer.innerHTML = product.colors.map((color, index) => {
      const colorName = getColorName(color);
      return `
        <div class="color-swatch-wrapper ${index === 0 ? 'active' : ''}" data-color="${color}">
          <span class="color-swatch-circle" style="background-color: ${color};"></span>
          <span>${colorName}</span>
        </div>
      `;
    }).join('');

    // Colors click binding
    detailColorsContainer.querySelectorAll('.color-swatch-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', (e) => {
        detailColorsContainer.querySelectorAll('.color-swatch-wrapper').forEach(w => w.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        selectedColor = target.dataset.color;
      });
    });
  } else {
    detailColorsSection.style.display = 'none';
  }

  // Size option selectors
  if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard') {
    selectedSize = product.sizes[0];
    detailSizesSection.style.display = 'block';
    detailSizesContainer.innerHTML = product.sizes.map((size, index) => `
      <button class="size-button ${index === 0 ? 'active' : ''}" data-size="${size}">${size}</button>
    `).join('');

    // Sizes click binding
    detailSizesContainer.querySelectorAll('.size-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        detailSizesContainer.querySelectorAll('.size-button').forEach(b => b.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        selectedSize = target.dataset.size;
      });
    });
  } else {
    detailSizesSection.style.display = 'none';
  }

  // Gallery viewports and thumbnails
  if (product.images && product.images.length > 0) {
    const mainImg = product.images[0];
    if (detailMainImage) {
      detailMainImage.src = getAbsoluteAssetPath(mainImg);
      detailMainImage.onload = () => {
        if (detailImageSkeleton) detailImageSkeleton.style.display = 'none';
        detailMainImage.style.opacity = '1';
      };
    }

    if (detailThumbnails) {
      detailThumbnails.innerHTML = product.images.map((imgUrl, idx) => `
        <button class="thumbnail-button ${idx === 0 ? 'active' : ''}" data-img="${getAbsoluteAssetPath(imgUrl)}">
          <img src="${getAbsoluteAssetPath(imgUrl)}" alt="Thumbnail View ${idx + 1}" onerror="this.parentElement.style.display='none';">
        </button>
      `).join('');

      // Thumbnail clicks with smooth transitions
      detailThumbnails.querySelectorAll('.thumbnail-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          detailThumbnails.querySelectorAll('.thumbnail-button').forEach(b => b.classList.remove('active'));
          const target = e.currentTarget;
          target.classList.add('active');
          
          const newSrc = target.dataset.img;
          if (detailMainImage.src !== newSrc) {
            detailMainImage.style.opacity = '0';
            setTimeout(() => {
              detailMainImage.src = newSrc;
              detailMainImage.style.opacity = '1';
            }, 250);
          }
        });
      });
    }
  }

  // WhatsApp Quote button handler
  if (detailWhatsappBtn) {
    detailWhatsappBtn.onclick = () => {
      const phoneNum = '916302263377';
      const colorLabel = selectedColor ? ` (Color: ${getColorName(selectedColor)})` : '';
      const sizeLabel = selectedSize ? ` (Size: ${selectedSize})` : '';
      const msg = `Hello Kalavathi Plastics,\n\nI am interested in your product: ${product.name}${colorLabel}${sizeLabel}.\n\nPlease provide wholesale pricing and minimum order quantity (MOQ) details.`;
      
      const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      // Log transaction to DB
      if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.logInquiry({
          timestamp: new Date().toISOString(),
          items: [{ title: `${product.name}${colorLabel}${sizeLabel}`, quantity: 1 }],
          notes: 'Direct Quote from Product Details Page'
        });
      }
    };
  }
}

// --- RENDER RELATED PRODUCTS SECTION (4 ITEMS) ---
function renderRelatedProducts(product) {
  if (!relatedGrid) return;
  relatedGrid.innerHTML = '';

  // Filter products by same category first, excluding active product
  let related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id);
  
  // Fallback to random products if category matches are too few
  if (related.length < 4) {
    const extras = PRODUCTS.filter(p => p.id !== product.id && !related.includes(p));
    related = [...related, ...extras];
  }

  related = related.slice(0, 4);

  related.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = item.id;
    card.dataset.slug = item.slug;
    
    const mainImg = getAbsoluteAssetPath(item.images && item.images[0] ? item.images[0] : '');
    const badgeHtml = item.badge ? `<span class="product-badge">${item.badge}</span>` : '';

    card.innerHTML = `
      <div class="product-image-container" style="cursor: pointer;" onclick="navigateToProduct('${item.slug}')">
        ${badgeHtml}
        <div class="skeleton-shimmer" id="skel-${item.id}"></div>
        <img class="product-image" src="${mainImg}" alt="${item.name}" loading="lazy" 
             onload="document.getElementById('skel-${item.id}').style.display='none'; this.classList.add('loaded');"
             onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><rect width=%22300%22 height=%22300%22 fill=%22%23eee%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2216%22 fill=%22%23777%22>No Image</text></svg>';">
      </div>
      <div class="product-details">
        <h3 class="product-title" style="cursor: pointer;" onclick="navigateToProduct('${item.slug}')">${item.name}</h3>
        <p class="product-desc" style="cursor: pointer;" onclick="navigateToProduct('${item.slug}')">${item.description || item.shortDescription}</p>
        <div class="product-footer">
          <div class="product-price-info">
            <span class="price-label">Wholesale status</span>
            <span class="price-range" style="font-size: 0.95rem; font-weight: 700; color: var(--color-accent);">Wholesale Available</span>
          </div>
          <button class="btn-add-inquiry" data-id="${item.id}" title="Add to Inquiry">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    `;
    relatedGrid.appendChild(card);
  });

  // Related Grid card button click delegation
  relatedGrid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-inquiry');
    if (addBtn) {
      e.stopPropagation();
      const productItem = PRODUCTS.find(p => p.id === addBtn.dataset.id);
      if (productItem) {
        addToInquiryWithQty(productItem.id, 1, productItem.sizes[0] || 'Standard');
      }
    }
  });
}

function navigateToProduct(slug) {
  // Preserves scroll coordinates in sessionStorage before leaving page
  sessionStorage.setItem('homeScrollPosition', window.scrollY);
  window.location.href = `/products/${slug}`;
}

// --- UTILITY: META UPDATES ---
function updateMetaTag(property, attribute, value) {
  let element = document.querySelector(`meta[${property}="${attribute}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(property, attribute);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

// --- UTILITY: ABSOLUTE ASSETS RESOLVER ---
function getAbsoluteAssetPath(pathStr) {
  if (!pathStr) return '';
  if (pathStr.startsWith('http') || pathStr.startsWith('data:') || pathStr.startsWith('/')) {
    return pathStr;
  }
  return '/' + pathStr;
}

// --- UTILITY: HEX COLOR LABELS ---
function getColorName(hex) {
  const map = {
    '#ffffff': 'White',
    '#cccccc': 'Linen',
    '#faf0e6': 'Ivory Cream',
    '#f5f5bc': 'Sand Beige',
    '#d2b48c': 'Natural Tan',
    '#2f4f4f': 'Charcoal Slate',
    '#8fbc8f': 'Sage Green',
    '#e6e6fa': 'Lavender Mist',
    '#f0e6kh': 'Soft Gold',
    '#f0e68c': 'Soft Gold',
    '#bc8f8f': 'Terracotta Clay',
    '#a0522d': 'Bronze Terracotta',
    '#2e8b57': 'Forest Green',
    '#4682b4': 'Steel Blue',
    '#708090': 'Slate Grey',
    '#b0c4de': 'Powder Blue',
    '#5f9ea0': 'Cadis Blue',
    '#556b2f': 'Olive Green',
    '#8b4513': 'Bronze Wood',
    '#d8bfd8': 'Linen Clay'
  };
  return map[hex.toLowerCase()] || hex;
}

// --- PERSISTENT INQUIRY DRAWER ENGINE ---
function initCartListeners() {
  if (cartToggle) cartToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('.qty-btn');
      const removeBtn = e.target.closest('.cart-item-remove');

      if (qtyBtn) {
        updateQuantity(qtyBtn.dataset.id, qtyBtn.dataset.action);
      }
      if (removeBtn) {
        removeCartItem(removeBtn.dataset.id);
      }
    });
  }

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      if (inquiryCart.length === 0) return;

      let message = `Hello Kalavathi Plastics,\n\nI want to inquire about wholesale pricing and MOQs for these items:\n\n`;
      inquiryCart.forEach((item, index) => {
        message += `${index + 1}. ${item.title} — Qty: ${item.quantity}\n`;
      });

      const notes = clientNotes ? clientNotes.value.trim() : '';
      if (notes) {
        message += `\nOrder Notes:\n${notes}\n`;
      }

      const phoneNum = '916302263377';
      const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Log transaction to DB
      if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.logInquiry({
          timestamp: new Date().toISOString(),
          items: inquiryCart.map(i => ({ title: i.title, quantity: i.quantity })),
          notes: notes || 'Product Details Page Drawer Submit'
        });
      }
    });
  }
}

function addToInquiryWithQty(id, qty, variant) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const cartItemTitle = `${product.name} – Size: ${variant}`;
  const existingItem = inquiryCart.find(item => item.title === cartItemTitle);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    inquiryCart.push({
      id: `${product.id}-${variant}`,
      title: cartItemTitle,
      priceRange: 'Wholesale Pricing',
      quantity: qty
    });
  }

  localStorage.setItem('inquiryCart', JSON.stringify(inquiryCart));
  updateCartCount();
  renderCartItems();
  openDrawer();
}

function updateQuantity(id, action) {
  const itemIndex = inquiryCart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  if (action === 'increase') {
    inquiryCart[itemIndex].quantity += 1;
  } else if (action === 'decrease') {
    inquiryCart[itemIndex].quantity -= 1;
    if (inquiryCart[itemIndex].quantity <= 0) {
      inquiryCart.splice(itemIndex, 1);
    }
  }

  localStorage.setItem('inquiryCart', JSON.stringify(inquiryCart));
  updateCartCount();
  renderCartItems();
}

function removeCartItem(id) {
  inquiryCart = inquiryCart.filter(item => item.id !== id);
  localStorage.setItem('inquiryCart', JSON.stringify(inquiryCart));
  updateCartCount();
  renderCartItems();
}

function updateCartCount() {
  const totalCount = inquiryCart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountBadge) {
    cartCountBadge.textContent = totalCount;
    cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }
}

function renderCartItems() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';

  if (inquiryCart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Inquiry list is empty.</p>
      </div>
    `;
    if (cartCountSummary) cartCountSummary.textContent = 'Inquiry List (0)';
    return;
  }

  let totalItems = 0;
  inquiryCart.forEach(item => {
    totalItems += item.quantity;
    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    cartItemEl.innerHTML = `
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <span class="cart-item-price">${item.priceRange}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
        <span class="qty-val">${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" title="Remove Item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    `;
    cartItemsContainer.appendChild(cartItemEl);
  });

  if (cartCountSummary) {
    cartCountSummary.textContent = `Inquiry List (${totalItems})`;
  }
}

function openDrawer() {
  if (cartDrawer) cartDrawer.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// --- NOTICE BANNER ---
function initNoticeBanner() {
  localStorage.removeItem('deliveryNoticeDismissed');
  if (noticeBanner && closeNoticeBtn) {
    closeNoticeBtn.addEventListener('click', () => {
      noticeBanner.classList.add('dismissed');
      sessionStorage.setItem('deliveryNoticeDismissed', 'true');
    });
    if (sessionStorage.getItem('deliveryNoticeDismissed') === 'true') {
      noticeBanner.classList.add('dismissed');
    }
  }
}
