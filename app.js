// --- PRODUCTS DATA ---
// DEFAULT_PRODUCTS is loaded globally from products-data.js

let PRODUCTS = JSON.parse(localStorage.getItem('products')) || DEFAULT_PRODUCTS;
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
}

// --- APP STATE ---
let inquiryCart = [];
let currentModalProduct = null;
let currentModalQty = 1;
let selectedVariant = "";

// --- ELEMENTS ---
const productGrid = document.getElementById('product-grid');

const searchInput = document.getElementById('search-product');
const searchSuggestions = document.getElementById('search-suggestions');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartCountBadge = document.querySelector('.cart-count');
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const drawerClose = document.getElementById('drawer-close');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountSummary = document.getElementById('cart-count-summary');
const clientNotes = document.getElementById('client-notes');
const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');

// Modal Elements
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalMainImage = document.getElementById('modal-main-image');
const modalImageSkeleton = document.getElementById('modal-image-skeleton');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalBadge = document.getElementById('modal-badge');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalVariants = document.getElementById('modal-variants');
const modalFeatures = document.getElementById('modal-features');
const modalAddBtn = document.getElementById('modal-add-btn');
const modalQtyVal = document.getElementById('modal-qty-val');
const modalQtyDec = document.getElementById('modal-qty-dec');
const modalQtyInc = document.getElementById('modal-qty-inc');

// --- INITIALIZE PRODUCTS ---
// --- PREMIUM VECTOR SVG FALLBACKS ---
function getProductFallbackSVG(productName) {
  let svgInner = '';
  switch (productName) {
    case 'Buckets':
      svgInner = `<ellipse cx="12" cy="7" rx="8" ry="2" />
                  <path d="M4 7l2 12c.3 1.8 1.8 3 3.6 3h4.8c1.8 0 3.3-1.2 3.6-3l2-12" />
                  <path d="M4 7C4 3.5 7.5 2 12 2s8 1.5 8 5" stroke-dasharray="1 1" stroke="var(--color-accent)" />`;
      break;
    case 'Storage Containers':
      svgInner = `<rect x="4" y="8" width="16" height="12" rx="2" />
                  <rect x="3" y="5" width="18" height="3" rx="1.5" fill="rgba(214, 187, 128, 0.2)" />
                  <path d="M3 6.5v2M21 6.5v2" stroke="var(--color-accent)" stroke-width="2" />
                  <line x1="8" y1="12" x2="8" y2="16" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="16" y1="12" x2="16" y2="16" />`;
      break;

    case 'Water Tubs':
      svgInner = `<ellipse cx="12" cy="7" rx="9" ry="2.5" />
                  <path d="M3 7l2 11c.2 1.5 1.5 3 3.2 3h7.6c1.7 0 3-1.5 3.2-3l2-11" />
                  <path d="M2 7h20" stroke="var(--color-accent)" stroke-width="1.5" />`;
      break;
    case 'Water Bottles':
      svgInner = `<rect x="10" y="2" width="4" height="2" rx="0.5" fill="var(--color-accent)" />
                  <path d="M9 4h6v3H9z" />
                  <path d="M9 7h6a2 2 0 0 1 2 2v1h-10V9a2 2 0 0 1 2-2z" />
                  <rect x="7" y="10" width="10" height="11" rx="1.5" />
                  <path d="M7 13h10M7 16h10" stroke="var(--color-accent)" />`;
      break;
    case 'Lunch Boxes':
      svgInner = `<rect x="5" y="12" width="14" height="8" rx="2" />
                  <rect x="6" y="5" width="12" height="7" rx="1.5" />
                  <path d="M4 9h2M18 9h2M4 16h2M18 16h2" stroke="var(--color-accent)" stroke-width="2" />
                  <path d="M9 5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" />`;
      break;
    case 'Bread Boxes':
      svgInner = `<path d="M3 18V9c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v9H3z" />
                  <line x1="2" y1="18" x2="22" y2="18" stroke-width="2" />
                  <rect x="10" y="12" width="4" height="2" rx="0.5" fill="var(--color-accent)" />
                  <path d="M6 6c3 0 6 1 6 3v9M18 6c-3 0-6 1-6 3v9" stroke-width="1" stroke="rgba(24, 42, 58, 0.3)" />`;
      break;
    case 'Plates':
      svgInner = `<circle cx="10" cy="12" r="7" />
                  <circle cx="10" cy="12" r="5" stroke-dasharray="2 2" />
                  <circle cx="15" cy="12" r="7" fill="rgba(255, 255, 255, 0.7)" />
                  <circle cx="15" cy="12" r="5" stroke-dasharray="2 2" stroke="var(--color-accent)" />`;
      break;
    case 'Trays':
      svgInner = `<path d="M2 7l3 11h14l3-11H2z" />
                  <path d="M4 9l2 7h12l2-7H4z" stroke-dasharray="2 2" />
                  <path d="M1 11h2M21 11h2" stroke="var(--color-accent)" stroke-width="2" />`;
      break;
    case 'Juicers':
      svgInner = `<path d="M12 3L6 14h12L12 3z" />
                  <line x1="12" y1="3" x2="12" y2="14" />
                  <line x1="9" y1="8" x2="12" y2="14" />
                  <line x1="15" y1="8" x2="12" y2="14" />
                  <path d="M4 14c0 3.3 2.7 6 6 6h4c3.3 0 6-2.7 6-6H4z" fill="rgba(214, 187, 128, 0.2)" />
                  <path d="M3 14l-2 1.5L3 17" />`;
      break;
    case 'Cleaning Mops':
      svgInner = `<line x1="17" y1="3" x2="9" y2="14" stroke-width="2.5" />
                  <circle cx="17.5" cy="2.5" r="1" fill="var(--color-accent)" />
                  <path d="M8.5 13.5l2 2-2 2.5-2-2z" fill="var(--color-accent)" />
                  <path d="M5.5 17c-2 2-2.5 4-1.5 5s3 .5 5-1.5c1.8-1.8 1.8-4.2-.2-5.3" />
                  <path d="M1 18l2 1M2 21h2" stroke-width="1" stroke="rgba(24, 42, 58, 0.4)" />`;
      break;
    case 'Brooms':
      svgInner = `<line x1="18" y1="3" x2="10" y2="15" stroke-width="2" />
                  <path d="M7 16l4 3-2 3-5-3.5L7 16z" fill="rgba(214, 187, 128, 0.2)" />
                  <line x1="8" y1="17.5" x2="5" y2="21" />
                  <line x1="9.5" y1="18.5" x2="6.5" y2="22" />
                  <line x1="6.5" y1="16.5" x2="3.5" y2="20" />`;
      break;
    case 'Cleaning Brushes':
      svgInner = `<path d="M4 14h16c1 0 2-.8 2-2s-.8-2-2-2H4c-1 0-2 .8-2 2s.8 2 2 2z" />
                  <path d="M7 10V6c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v4" stroke="var(--color-accent)" />
                  <path d="M3 14v4M6 14v4M9 14v4M12 14v4M15 14v4M18 14v4M21 14v4" stroke-width="1.5" />`;
      break;
    case 'Washroom Brushes':
      svgInner = `<rect x="7" y="11" width="10" height="10" rx="2" />
                  <ellipse cx="12" cy="11" rx="5" ry="1.5" fill="rgba(214, 187, 128, 0.2)" />
                  <line x1="12" y1="12" x2="12" y2="4" stroke-width="2" />
                  <circle cx="12" cy="3.5" r="1.5" fill="var(--color-accent)" />
                  <circle cx="12" cy="14" r="3" stroke-dasharray="2 2" />`;
      break;
    case 'Dustbins':
      svgInner = `<path d="M5 6h14l-1.5 14c-.2 1.3-1.3 2-2.5 2h-6c-1.2 0-2.3-.7-2.5-2L5 6z" />
                  <ellipse cx="12" cy="6" rx="7" ry="1.5" />
                  <path d="M10 22h4" stroke-width="3" stroke="var(--color-accent)" />
                  <line x1="12" y1="7" x2="12" y2="20" stroke-width="1" stroke-dasharray="2 2" />`;
      break;
    case 'Soap Holders':
      svgInner = `<rect x="10" y="3" width="4" height="4" rx="1" fill="var(--color-accent)" />
                  <path d="M12 7v4" stroke-width="2" />
                  <ellipse cx="12" cy="13" rx="8" ry="2.5" />
                  <line x1="9" y1="12.5" x2="9" y2="13.5" />
                  <line x1="12" y1="12" x2="12" y2="14" />
                  <line x1="15" y1="12.5" x2="15" y2="13.5" />`;
      break;
    case 'Soap Cases':
      svgInner = `<rect x="4" y="6" width="16" height="12" rx="3" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <rect x="10" y="11" width="4" height="2" rx="0.5" fill="var(--color-accent)" />`;
      break;
    case 'Toothbrush Holders':
      svgInner = `<rect x="6" y="11" width="12" height="10" rx="2" />
                  <path d="M8 11V4l1.5-1 1 1v7" />
                  <path d="M14 11V3l1.5-1 1 1v8" stroke="var(--color-accent)" />
                  <path d="M10 11V5h4v6" fill="rgba(214, 187, 128, 0.15)" />`;
      break;
    case 'Mirrors':
      svgInner = `<ellipse cx="12" cy="12" rx="7" ry="9" stroke-width="2.5" />
                  <path d="M9 8l2-2M8 11l4-4M10 15l4-4" stroke="var(--color-accent)" stroke-width="1.5" />`;
      break;
    case 'Plastic Stools':
      svgInner = `<ellipse cx="12" cy="6" rx="7" ry="2" />
                  <ellipse cx="12" cy="6" rx="1.5" ry="0.5" fill="var(--color-primary-text)" />
                  <path d="M6 7l-2 14M18 7l2 14" stroke-width="2" />
                  <path d="M7 13h10M4.5 17h15" stroke="var(--color-accent)" />`;
      break;
    case 'Mats':
      svgInner = `<ellipse cx="6" cy="12" rx="2" ry="5" fill="rgba(214, 187, 128, 0.2)" />
                  <path d="M6 7h14c1 0 2 2.2 2 5s-1 5-2 5H6" />
                  <path d="M10 7v10M14 7v10M18 7v10" stroke-width="1" stroke="rgba(24, 42, 58, 0.3)" />`;
      break;
    case 'Door Mats':
      svgInner = `<rect x="3" y="6" width="18" height="12" rx="1.5" />
                  <rect x="5" y="8" width="14" height="8" rx="0.5" stroke-dasharray="2 2" stroke="var(--color-accent)" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke-width="2" />`;
      break;
    case 'Plastic Pots':
      svgInner = `<path d="M12 9c0-3 3-5 3-5s-1.5 3.5-3 5c0 0-3-2-3-5s3 5 3 5z" fill="var(--color-accent)" />
                  <line x1="12" y1="9" x2="12" y2="12" />
                  <rect x="7" y="11" width="10" height="2" rx="0.5" />
                  <path d="M8 13l1.5 7c.2.8.8 1.5 1.7 1.5h1.6c.9 0 1.5-.7 1.7-1.5l1.5-7H8z" />`;
      break;
    case 'Shoe Racks':
      svgInner = `<rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="2 2" />
                  <line x1="3" y1="4" x2="3" y2="20" stroke-width="2" />
                  <line x1="21" y1="4" x2="21" y2="20" stroke-width="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="14" x2="21" y2="14" />
                  <line x1="3" y1="19" x2="21" y2="19" />
                  <path d="M6 8h2M14 8h2M6 13h2M14 13h2" stroke="var(--color-accent)" stroke-width="1.5" />`;
      break;
    case 'Water Cans':
      svgInner = `<rect x="6" y="9" width="10" height="11" rx="2" />
                  <path d="M16 14l6-5v2l-6 5" />
                  <line x1="22" y1="8" x2="23" y2="12" stroke-width="2.5" stroke="var(--color-accent)" />
                  <path d="M8 9V6.5c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5V9" />
                  <path d="M6 11H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2" stroke="var(--color-accent)" />`;
      break;
    default:
      svgInner = `<rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 2v20M2 12h20" stroke-dasharray="2 2" stroke="var(--color-accent)" fill="none" />`;
      break;
  }
  return `
    <div class="fallback-svg-container">
      <svg class="fallback-svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${svgInner}
      </svg>
    </div>
  `;
}

function handleProductImageError(imgEl, productId, productName, type) {
  const skelId = type === 'featured' ? `skel-feat-${productId}` : `skel-${productId}`;
  const skel = document.getElementById(skelId);
  if (skel) skel.style.display = 'none';

  const container = imgEl.parentElement;
  if (container) {
    container.innerHTML = `
      <span class="product-badge">${container.querySelector('.product-badge')?.textContent || ''}</span>
      ${getProductFallbackSVG(productName)}
    `;
  }
}

// --- INITIALIZE PRODUCTS ---
function renderProducts(items) {
  if (!productGrid) return;
  productGrid.innerHTML = '';
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--color-secondary-text);">
        <p>No products match your search. Try resetting your search filter.</p>
      </div>
    `;
    return;
  }

  items.forEach(product => {
    if (!product) return;
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.dataset.id = product.id;
    const mainImg = product.images && product.images[0] ? product.images[0] : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23777">No Image</text></svg>';
    const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
    
    card.innerHTML = `
      <div class="product-image-container" style="cursor: pointer;" id="img-container-${product.id}">
        ${badgeHtml}
        <div class="skeleton-shimmer" id="skel-${product.id}"></div>
        <img class="product-image" src="${mainImg}" alt="${product.name}" loading="lazy" 
             onload="document.getElementById('skel-${product.id}').style.display='none'; this.classList.add('loaded');"
             onerror="handleProductImageError(this, '${product.id}', '${product.name}', 'normal');">
      </div>
      <div class="product-details">
        <h3 class="product-title" style="cursor: pointer;">${product.name}</h3>
        <p class="product-desc" style="cursor: pointer;">${product.description}</p>
        <div class="product-footer">
          <div class="product-price-info">
            <span class="price-label">Wholesale status</span>
            <span class="price-range" style="font-size: 0.95rem; font-weight: 700; color: var(--color-accent);">Wholesale Available</span>
          </div>
          <button class="btn-add-inquiry" data-id="${product.id}" title="Add to Inquiry">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
  
  // Refresh intersection observers
  setTimeout(initScrollReveal, 50);
}



// --- FILTER & SEARCH ---
function handleFilterAndSearch() {
  const query = searchInput.value.toLowerCase().trim();
  const activeTab = document.querySelector('.filter-btn.active').dataset.filter;

  const filtered = PRODUCTS.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(query) || prod.category.toLowerCase().includes(query);
    const matchesFilter = activeTab === 'all' || prod.category === activeTab;
    return matchesSearch && matchesFilter;
  });

  renderProducts(filtered);
}

if (searchInput) {
  searchInput.addEventListener('input', handleFilterAndSearch);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    handleFilterAndSearch();
  });
});

// --- SEARCH AUTOCOMPLETE SUGGESTIONS ---
if (searchInput && searchSuggestions) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchSuggestions.innerHTML = '';

    if (query.length < 2) {
      searchSuggestions.classList.remove('open');
      return;
    }

    // Filter matching product names or categories
    const matches = PRODUCTS.filter(prod => 
      prod.name.toLowerCase().includes(query) || 
      prod.category.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length === 0) {
      searchSuggestions.classList.remove('open');
      return;
    }

    matches.forEach(match => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = match.name;
      div.addEventListener('click', () => {
        searchInput.value = match.name;
        searchSuggestions.classList.remove('open');
        handleFilterAndSearch();
      });
      searchSuggestions.appendChild(div);
    });

    searchSuggestions.classList.add('open');
  });

  // Close suggestions box clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      searchSuggestions.classList.remove('open');
    }
  });
}

// --- PRODUCT DETAIL PREVIEW MODAL ---
// --- PRODUCT DETAIL PREVIEW MODAL ---
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentModalProduct = product;
  currentModalQty = 1;
  selectedVariant = product.variants[0];

  if (modalQtyVal) modalQtyVal.textContent = currentModalQty;
  if (modalTitle) modalTitle.textContent = product.name;
  if (modalDesc) modalDesc.textContent = product.description;
  if (modalCategory) modalCategory.textContent = product.category;
  if (modalBadge) modalBadge.textContent = product.badge;

  // Build Variants Pill Buttons
  if (modalVariants) {
    modalVariants.innerHTML = '';
    product.variants.forEach((v, index) => {
      const btn = document.createElement('button');
      btn.className = `modal-variant-pill ${index === 0 ? 'active' : ''}`;
      btn.textContent = v;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-variant-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedVariant = v;
      });
      modalVariants.appendChild(btn);
    });
  }

  // Build Highlights List
  if (modalFeatures) {
    modalFeatures.innerHTML = '';
    product.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      modalFeatures.appendChild(li);
    });
  }

  // Load Main Image
  if (modalMainImage && modalImageSkeleton) {
    modalMainImage.style.display = 'block';
    modalMainImage.style.opacity = '0';
    modalImageSkeleton.style.display = 'block';
    
    // Clean up any previous fallback SVG container
    const prevFallback = modalMainImage.parentElement.querySelector('.fallback-svg-container');
    if (prevFallback) prevFallback.remove();

    modalMainImage.src = product.images[0];
    modalMainImage.onload = () => {
      modalImageSkeleton.style.display = 'none';
      modalMainImage.style.opacity = '1';
    };
    modalMainImage.onerror = () => {
      modalImageSkeleton.style.display = 'none';
      modalMainImage.style.display = 'none';
      const wrapper = modalMainImage.parentElement;
      const fallbackHtml = getProductFallbackSVG(product.name);
      wrapper.insertAdjacentHTML('beforeend', fallbackHtml);
      // Hide thumbnails row since there are no images to show
      if (modalThumbnails) modalThumbnails.style.display = 'none';
    };
  }

  // Render Thumbnails Gallery
  if (modalThumbnails) {
    modalThumbnails.style.display = 'flex';
    modalThumbnails.innerHTML = '';
    product.images.forEach((img, idx) => {
      const thumb = document.createElement('img');
      thumb.className = `modal-thumbnail ${idx === 0 ? 'active' : ''}`;
      thumb.src = img;
      thumb.alt = `${product.name} Angle ${idx + 1}`;
      thumb.loading = 'lazy';
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Clean up previous fallback in main view
        const prevFallback = modalMainImage.parentElement.querySelector('.fallback-svg-container');
        if (prevFallback) prevFallback.remove();
        modalMainImage.style.display = 'block';
        
        // Fading thumbnail switch transition
        modalMainImage.style.opacity = '0';
        setTimeout(() => {
          modalMainImage.src = img;
          modalMainImage.onload = () => {
            modalMainImage.style.opacity = '1';
          };
          modalMainImage.onerror = () => {
            modalImageSkeleton.style.display = 'none';
            modalMainImage.style.display = 'none';
            const wrapper = modalMainImage.parentElement;
            const fallbackHtml = getProductFallbackSVG(product.name);
            wrapper.insertAdjacentHTML('beforeend', fallbackHtml);
          };
        }, 150);
      });
      thumb.onerror = () => {
        thumb.style.display = 'none';
      };
      modalThumbnails.appendChild(thumb);
    });
  }

  if (productModal) productModal.classList.add('open');
}

function closeProductModal() {
  if (productModal) productModal.classList.remove('open');
  currentModalProduct = null;
}

if (modalClose) modalClose.addEventListener('click', closeProductModal);
if (productModal) {
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });
}

// Modal Qty bindings
if (modalQtyInc) {
  modalQtyInc.addEventListener('click', () => {
    currentModalQty++;
    modalQtyVal.textContent = currentModalQty;
  });
}
if (modalQtyDec) {
  modalQtyDec.addEventListener('click', () => {
    if (currentModalQty > 1) {
      currentModalQty--;
      modalQtyVal.textContent = currentModalQty;
    }
  });
}

// Modal Add to Cart
if (modalAddBtn) {
  modalAddBtn.addEventListener('click', () => {
    if (currentModalProduct) {
      addToInquiryWithQty(currentModalProduct.id, currentModalQty, selectedVariant);
      closeProductModal();
    }
  });
}

// --- INQUIRY CART ---
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
    if (cartCountSummary) cartCountSummary.textContent = '0 Items';
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
    cartCountSummary.textContent = `${totalItems} Item${totalItems > 1 ? 's' : ''}`;
  }
}

// Add directly with 1 unit and default variant
function addToInquiry(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  addToInquiryWithQty(id, 1, product.variants[0]);
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
  updateCartCount();
  renderCartItems();
}

function removeCartItem(id) {
  inquiryCart = inquiryCart.filter(item => item.id !== id);
  updateCartCount();
  renderCartItems();
}

function openDrawer() {
  if (cartDrawer) cartDrawer.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  const noticeBanner = document.getElementById('delivery-notice-banner');
  if (noticeBanner) {
    noticeBanner.classList.add('dismissed');
  }
}

function closeDrawer() {
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
  
  const noticeBanner = document.getElementById('delivery-notice-banner');
  if (noticeBanner && sessionStorage.getItem('deliveryNoticeDismissed') !== 'true') {
    noticeBanner.classList.remove('dismissed');
  }
}

if (cartToggle) cartToggle.addEventListener('click', openDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

// Cart delegation
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

// Product delegation (click card to open modal, click plus to add directly)
if (productGrid) {
  productGrid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-inquiry');
    if (addBtn) {
      e.stopPropagation();
      addToInquiry(addBtn.dataset.id);
      return;
    }
    const card = e.target.closest('.product-card');
    if (card) {
      openProductModal(card.dataset.id);
    }
  });
}



// --- WHATSAPP INQUIRY REDIRECT ---
if (sendWhatsAppBtn) {
  sendWhatsAppBtn.addEventListener('click', () => {
    if (inquiryCart.length === 0) return;

    let message = `Hello Kalavathi Plastics,\n\n`;
    message += `I am interested in the following products:\n`;

    inquiryCart.forEach(item => {
      message += `• ${item.title} – Qty: ${item.quantity}\n`;
    });

    message += `\nPlease share:\n`;
    message += `✓ Wholesale Pricing\n`;
    message += `✓ Available Sizes\n`;
    message += `✓ Minimum Order Quantity\n`;
    message += `✓ Delivery Information\n\n`;
    message += `Thank You.`;

    // Record inquiry click analytics via Supabase (or local fallback)
    try {
      const notesField = document.getElementById('client-notes');
      const inquiryRecord = {
        timestamp: new Date().toISOString(),
        items: inquiryCart.map(item => ({ title: item.title, quantity: item.quantity })),
        notes: notesField ? notesField.value : ""
      };
      if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.logInquiry(inquiryRecord);
      } else {
        let inquiries = JSON.parse(localStorage.getItem('whatsappInquiries')) || [];
        inquiries.push(inquiryRecord);
        localStorage.setItem('whatsappInquiries', JSON.stringify(inquiries));
      }
    } catch (e) {
      console.error('Error saving inquiry log:', e);
    }

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '916302263377'; // Verified business phone
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });
}



// --- SCROLL REVEALS ---
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// --- STATS COUNT ANIMATION ---
function initStatsAnimation() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.dataset.target);
          const duration = 2000;
          let startTime = null;

          function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            
            if (target >= 1000) {
              stat.textContent = `${value.toLocaleString()}+`;
            } else if (stat.id.includes('quality')) {
              stat.textContent = `${value}%`;
            } else if (stat.id.includes('exp')) {
              stat.textContent = `${value}+`;
            } else {
              stat.textContent = value;
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        });
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

// --- PROGRESS TIMELINE ANIMATION ---
function initTimelineAnimation() {
  const timelineSection = document.getElementById('process');
  if (!timelineSection) return;

  const steps = document.querySelectorAll('.timeline-step');
  const progressLine = document.querySelector('.timeline-progress');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (progressLine) progressLine.style.width = '100%';
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.classList.add('active');
          }, i * 300);
        });
        observer.unobserve(timelineSection);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(timelineSection);
}

// --- ACTIVE LINK SCROLLING ---
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 250;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

function initFloatingNotice() {
  const noticeBanner = document.getElementById('delivery-notice-banner');
  const closeNoticeBtn = document.getElementById('close-notice-btn');
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

// --- CATEGORY TILES NAVIGATION ---
function initCategoryTiles() {
  const categoryTiles = document.querySelectorAll('.category-tile');
  categoryTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const category = tile.dataset.category;
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
      if (targetBtn) {
        targetBtn.click();
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize scroll reveals immediately so layout contents show
  initScrollReveal();
  
  // Load products from Supabase cloud (or local fallback)
  if (typeof SupabaseDB !== 'undefined') {
    PRODUCTS = await SupabaseDB.fetchProducts();
  }
  renderProducts(PRODUCTS);
  initStatsAnimation();
  initTimelineAnimation();
  initActiveNavLinks();
  initFloatingNotice();
  initCategoryTiles();
});
