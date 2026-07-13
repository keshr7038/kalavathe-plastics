// --- ADMINISTRATIVE CREDENTIALS SYSTEM ---
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSCODE = 'admin123';

// Ensure credentials exist in localStorage
if (!localStorage.getItem('adminUsername')) {
  localStorage.setItem('adminUsername', DEFAULT_USERNAME);
}
if (!localStorage.getItem('adminPasscode')) {
  localStorage.setItem('adminPasscode', DEFAULT_PASSCODE);
}

// --- DOM ELEMENTS ---
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('admin-dashboard-container');
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasscodeInput = document.getElementById('login-passcode');
const loginErrorMsg = document.getElementById('login-error-msg');
const logoutBtn = document.getElementById('logout-btn');

const tabBtns = document.querySelectorAll('.admin-tab-btn');
const tabContents = document.querySelectorAll('.admin-tab-content');

// Overview Tab Elements
const statTotalClicks = document.getElementById('stat-total-clicks');
const statInquiredItems = document.getElementById('stat-inquired-items');
const statAvgQty = document.getElementById('stat-avg-qty');
const inquiryLogBody = document.getElementById('inquiry-log-body');
const popularProductsList = document.getElementById('popular-products-list');

// Product Manager Tab Elements
const productManagerBody = document.getElementById('product-manager-body');
const addProductBtn = document.getElementById('add-product-btn');

// Settings Tab Elements
const changePasscodeForm = document.getElementById('change-passcode-form');
const settingsUsername = document.getElementById('settings-username');
const settingsOldPasscode = document.getElementById('settings-old-passcode');
const settingsNewPasscode = document.getElementById('settings-new-passcode');
const exportDbBtn = document.getElementById('export-db-btn');
const resetDbBtn = document.getElementById('reset-db-btn');

// Supabase Form Elements
const supabaseConfigForm = document.getElementById('supabase-config-form');
const settingsSbUrl = document.getElementById('settings-sb-url');
const settingsSbKey = document.getElementById('settings-sb-key');
const connectSbBtn = document.getElementById('connect-sb-btn');
const disconnectSbBtn = document.getElementById('disconnect-sb-btn');
const sbSyncPanel = document.getElementById('sb-sync-panel');
const syncSbBtn = document.getElementById('sync-sb-btn');
const dbStatusBadge = document.getElementById('db-status-badge');
const headerDbBadge = document.getElementById('header-db-badge');

// Edit Modal Form Elements
const productEditModal = document.getElementById('product-edit-modal');
const productEditForm = document.getElementById('product-edit-form');
const editProductId = document.getElementById('edit-product-id');
const editProductMode = document.getElementById('edit-product-mode');
const editProductName = document.getElementById('edit-product-name');
const editProductCategory = document.getElementById('edit-product-category');
const editProductDesc = document.getElementById('edit-product-desc');
const editProductBadge = document.getElementById('edit-product-badge');
const editProductVariants = document.getElementById('edit-product-variants');
const editProductImage1 = document.getElementById('edit-product-image-1');
const editProductImage2 = document.getElementById('edit-product-image-2');
const editProductImage3 = document.getElementById('edit-product-image-3');
const editModalClose = document.getElementById('edit-modal-close');
const editModalCancel = document.getElementById('edit-modal-cancel');
const modalFormTitle = document.getElementById('modal-form-title');

// Cached memory variables
let cachedProductsList = [];
let cachedInquiriesList = [];

// --- AUTHENTICATION FLOW ---
function checkAuthState() {
  const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
  if (isAuth) {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    loadDashboardData();
  } else {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUser = loginUsernameInput.value.trim();
    const enteredPass = loginPasscodeInput.value.trim();
    const storedUser = localStorage.getItem('adminUsername');
    const storedPass = localStorage.getItem('adminPasscode');

    if (enteredUser === storedUser && enteredPass === storedPass) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      loginErrorMsg.style.display = 'none';
      checkAuthState();
    } else {
      loginErrorMsg.style.display = 'block';
      loginPasscodeInput.value = '';
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.reload();
  });
}

// --- TAB ROUTING SYSTEM ---
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    const targetEl = document.getElementById(target);
    if (targetEl) targetEl.classList.add('active');
  });
});

// --- CONNECTION STATUS RENDERING ---
function updateConnectionStatus() {
  const isCloud = typeof SupabaseDB !== 'undefined' && SupabaseDB.isConfigured;
  
  if (isCloud) {
    // Top header badge
    if (headerDbBadge) {
      headerDbBadge.textContent = 'Cloud Mode';
      headerDbBadge.className = 'db-status-badge status-connected';
    }
    // Settings panel badge
    if (dbStatusBadge) {
      dbStatusBadge.textContent = 'Connected to Cloud';
      dbStatusBadge.className = 'db-status-badge status-connected';
    }
    // Form buttons & panel
    if (connectSbBtn) connectSbBtn.style.display = 'none';
    if (disconnectSbBtn) disconnectSbBtn.style.display = 'inline-flex';
    if (sbSyncPanel) sbSyncPanel.style.display = 'block';
    
    // Autofill fields
    if (settingsSbUrl) settingsSbUrl.value = localStorage.getItem('supabaseUrl') || '';
    if (settingsSbKey) settingsSbKey.value = localStorage.getItem('supabaseKey') || '';
  } else {
    // Top header badge
    if (headerDbBadge) {
      headerDbBadge.textContent = 'Local Mode';
      headerDbBadge.className = 'db-status-badge status-disconnected';
    }
    // Settings panel badge
    if (dbStatusBadge) {
      dbStatusBadge.textContent = 'Local Storage Mode';
      dbStatusBadge.className = 'db-status-badge status-disconnected';
    }
    // Form buttons & panel
    if (connectSbBtn) connectSbBtn.style.display = 'inline-flex';
    if (disconnectSbBtn) disconnectSbBtn.style.display = 'none';
    if (sbSyncPanel) sbSyncPanel.style.display = 'none';

    if (settingsSbUrl) settingsSbUrl.value = '';
    if (settingsSbKey) settingsSbKey.value = '';
  }
}

// --- DATA ACCESS LAYER ---
async function loadDashboardData() {
  updateConnectionStatus();

  // Load asynchronously using Supabase client
  if (typeof SupabaseDB !== 'undefined') {
    cachedProductsList = await SupabaseDB.fetchProducts();
    cachedInquiriesList = await SupabaseDB.fetchInquiries();
  } else {
    cachedProductsList = JSON.parse(localStorage.getItem('products')) || [];
    cachedInquiriesList = JSON.parse(localStorage.getItem('whatsappInquiries')) || [];
  }

  renderOverviewAnalytics(cachedInquiriesList);
  renderProductManagerTable(cachedProductsList);
  populateSettingsForm();
}

// 1. Overview & Analytics Tab
function renderOverviewAnalytics(inquiries) {
  let totalClicks = inquiries.length;
  let totalItemsCount = 0;
  let itemPopularityMap = {};

  inquiries.forEach(inq => {
    if (inq.items && Array.isArray(inq.items)) {
      inq.items.forEach(item => {
        totalItemsCount += (item.quantity || 0);
        const baseTitle = item.title.split('–')[0].trim();
        itemPopularityMap[baseTitle] = (itemPopularityMap[baseTitle] || 0) + (item.quantity || 0);
      });
    }
  });

  let avgQty = totalClicks > 0 ? (totalItemsCount / totalClicks).toFixed(1) : '0.0';

  if (statTotalClicks) statTotalClicks.textContent = totalClicks;
  if (statInquiredItems) statInquiredItems.textContent = totalItemsCount;
  if (statAvgQty) statAvgQty.textContent = avgQty;

  // Render recent inquiries
  if (inquiryLogBody) {
    inquiryLogBody.innerHTML = '';
    if (inquiries.length === 0) {
      inquiryLogBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; color: var(--color-secondary-text); padding: 2rem;">No WhatsApp clicks logged yet.</td>
        </tr>
      `;
    } else {
      inquiries.forEach(inq => {
        const row = document.createElement('tr');
        
        let formattedDate = 'Unknown Date';
        try {
          const dateObj = new Date(inq.timestamp);
          formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (err) {}

        let itemsHtml = '';
        if (inq.items && Array.isArray(inq.items)) {
          inq.items.forEach(item => {
            itemsHtml += `<div class="inquiry-log-item">📦 <strong>${item.title}</strong> &times; ${item.quantity}</div>`;
          });
        }

        row.innerHTML = `
          <td style="font-size: 0.85rem; color: var(--color-primary-blue); font-weight: 700; white-space: nowrap;">${formattedDate}</td>
          <td>${itemsHtml}</td>
          <td style="font-size: 0.9rem; color: var(--color-primary-text); font-style: italic;">${inq.notes ? `"${inq.notes}"` : '—'}</td>
        `;
        inquiryLogBody.appendChild(row);
      });
    }
  }

  // Render popularity charts
  if (popularProductsList) {
    popularProductsList.innerHTML = '';
    const sortedPopularity = Object.entries(itemPopularityMap)
      .sort((a, b) => b[1] - a[1]);

    if (sortedPopularity.length === 0) {
      popularProductsList.innerHTML = `
        <p style="color: var(--color-secondary-text); text-align: center; padding: 2rem 0;">No inquiries tracked yet.</p>
      `;
    } else {
      const maxVal = sortedPopularity[0][1];
      sortedPopularity.forEach(([name, count]) => {
        const percent = maxVal > 0 ? Math.round((count / maxVal) * 100) : 0;
        const itemEl = document.createElement('div');
        itemEl.className = 'popular-item-row';
        itemEl.innerHTML = `
          <div class="popular-item-info">
            <span class="popular-item-name">${name}</span>
            <span class="popular-item-count">${count} units</span>
          </div>
          <div class="popular-progress-bar">
            <div class="popular-progress-fill" style="width: ${percent}%;"></div>
          </div>
        `;
        popularProductsList.appendChild(itemEl);
      });
    }
  }
}

// 2. Product Manager Table
function renderProductManagerTable(products) {
  if (productManagerBody) {
    productManagerBody.innerHTML = '';
    
    if (products.length === 0) {
      productManagerBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--color-secondary-text); padding: 2rem;">No products found in database. Click Add Product to create one.</td>
        </tr>
      `;
      return;
    }

    products.forEach(product => {
      const row = document.createElement('tr');
      const imageSrc = product.images && product.images[0] ? product.images[0] : '';
      const variantsText = product.variants ? product.variants.join(', ') : '—';
      
      row.innerHTML = `
        <td style="white-space: nowrap;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${imageSrc}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-divider);" 
                 onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22%23eee%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2210%22 fill=%22%23777%22>No Image</text></svg>'">
            <strong style="color: var(--color-primary-text);">${product.name}</strong>
          </div>
        </td>
        <td><span class="admin-badge" style="background: rgba(52, 105, 135, 0.08); color: var(--color-primary-blue); font-weight: 700;">${product.category}</span></td>
        <td style="font-size: 0.85rem; max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${product.description}">${product.description}</td>
        <td>${product.badge ? `<span style="font-size: 0.75rem; background: rgba(170, 126, 59, 0.08); color: #AA7E3B; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">${product.badge}</span>` : '—'}</td>
        <td style="font-size: 0.8rem; color: var(--color-secondary-text);">${variantsText}</td>
        <td>
          <div style="display: flex; justify-content: center; gap: 0.75rem;">
            <button class="btn btn-secondary edit-action-btn" data-id="${product.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-radius: 6px;">Edit</button>
            <button class="btn btn-secondary delete-action-btn" data-id="${product.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-radius: 6px; border-color: #d9534f; color: #d9534f;">Delete</button>
          </div>
        </td>
      `;
      productManagerBody.appendChild(row);
    });

    // Attach row button actions
    document.querySelectorAll('.edit-action-btn').forEach(btn => {
      btn.addEventListener('click', () => openFormModal('edit', btn.dataset.id));
    });

    document.querySelectorAll('.delete-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this product?')) {
          deleteProduct(btn.dataset.id);
        }
      });
    });
  }
}

// 3. Settings Form Setup
function populateSettingsForm() {
  if (settingsUsername) {
    settingsUsername.value = localStorage.getItem('adminUsername') || DEFAULT_USERNAME;
  }
  if (settingsOldPasscode) settingsOldPasscode.value = '';
  if (settingsNewPasscode) settingsNewPasscode.value = '';
}

// --- CRUD & DATABASE MANAGEMENT ACTIONS ---
async function deleteProduct(id) {
  if (typeof SupabaseDB !== 'undefined') {
    await SupabaseDB.deleteProduct(id);
  } else {
    let localProducts = JSON.parse(localStorage.getItem('products')) || [];
    localProducts = localProducts.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(localProducts));
  }
  loadDashboardData();
}

function openFormModal(mode, id = null) {
  if (!productEditModal) return;

  editProductMode.value = mode;
  productEditForm.reset();

  if (mode === 'add') {
    modalFormTitle.textContent = 'Add New Catalog Product';
    editProductId.value = '';
    editProductImage1.value = 'assets/products/';
    editProductImage2.value = 'assets/products/';
    editProductImage3.value = 'assets/products/';
  } else if (mode === 'edit' && id) {
    modalFormTitle.textContent = 'Edit Catalog Product';
    const product = cachedProductsList.find(p => p.id === id);
    if (product) {
      editProductId.value = product.id;
      editProductName.value = product.name;
      editProductCategory.value = product.category;
      editProductDesc.value = product.description;
      editProductBadge.value = product.badge || '';
      editProductVariants.value = product.variants ? product.variants.join(', ') : '';
      editProductImage1.value = product.images && product.images[0] ? product.images[0] : '';
      editProductImage2.value = product.images && product.images[1] ? product.images[1] : '';
      editProductImage3.value = product.images && product.images[2] ? product.images[2] : '';
    }
  }

  productEditModal.classList.add('open');
}

function closeFormModal() {
  if (productEditModal) productEditModal.classList.remove('open');
}

if (addProductBtn) {
  addProductBtn.addEventListener('click', () => openFormModal('add'));
}
if (editModalClose) editModalClose.addEventListener('click', closeFormModal);
if (editModalCancel) editModalCancel.addEventListener('click', closeFormModal);

if (productEditForm) {
  productEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = editProductMode.value;
    const id = editProductId.value;

    const name = editProductName.value.trim();
    const category = editProductCategory.value;
    const description = editProductDesc.value.trim();
    const badge = editProductBadge.value.trim();
    const variants = editProductVariants.value.split(',').map(v => v.trim()).filter(v => v.length > 0);
    const imagePath1 = editProductImage1.value.trim();
    const imagePath2 = editProductImage2.value.trim();
    const imagePath3 = editProductImage3.value.trim();
    const imagesArray = [imagePath1, imagePath2, imagePath3];

    let productObj = {};

    if (mode === 'add') {
      const newId = 'prod-' + Date.now();
      productObj = {
        id: newId,
        name: name,
        category: category,
        description: description,
        badge: badge,
        variants: variants,
        features: ['✓ High durability', '✓ Premium materials', '✓ Wholesale availability', '✓ Direct distribution'],
        images: imagesArray
      };
    } else if (mode === 'edit' && id) {
      const existingProduct = cachedProductsList.find(p => p.id === id);
      productObj = {
        ...existingProduct,
        name: name,
        category: category,
        description: description,
        badge: badge,
        variants: variants,
        images: imagesArray
      };
    }

    try {
      if (typeof SupabaseDB !== 'undefined') {
        await SupabaseDB.saveProduct(productObj);
      } else {
        let localProducts = JSON.parse(localStorage.getItem('products')) || [];
        const idx = localProducts.findIndex(p => p.id === productObj.id);
        if (idx !== -1) {
          localProducts[idx] = productObj;
        } else {
          localProducts.push(productObj);
        }
        localStorage.setItem('products', JSON.stringify(localProducts));
      }
      alert('Product saved successfully.');
      closeFormModal();
      loadDashboardData();
    } catch (err) {
      console.error('Save product error:', err);
      alert('Error: Failed to save product. ' + (err.message || 'Check database connection or image size limits.'));
    }
  });
}

// --- SETTINGS FORM CONTROL LOGIC ---
if (changePasscodeForm) {
  changePasscodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPass = settingsOldPasscode.value.trim();
    const newPass = settingsNewPasscode.value.trim();
    const newUsername = settingsUsername.value.trim();

    const storedPass = localStorage.getItem('adminPasscode');

    if (oldPass !== storedPass) {
      alert('Error: Old passcode is incorrect.');
      settingsOldPasscode.value = '';
      return;
    }

    if (newPass.length < 4) {
      alert('Error: New passcode must be at least 4 characters long.');
      return;
    }

    localStorage.setItem('adminUsername', newUsername);
    localStorage.setItem('adminPasscode', newPass);
    alert('Access credentials updated successfully.');
    populateSettingsForm();
  });
}

// --- SUPABASE CONNECT / DISCONNECT FORM CONTROLLER ---
if (supabaseConfigForm) {
  supabaseConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = settingsSbUrl.value.trim();
    const key = settingsSbKey.value.trim();

    connectSbBtn.textContent = 'Connecting...';
    connectSbBtn.disabled = true;

    try {
      if (typeof SupabaseDB === 'undefined') {
        throw new Error('Supabase client SDK script missing or failing to run.');
      }

      // Run connection check
      await SupabaseDB.testConnection(url, key);

      // Save credentials on success
      localStorage.setItem('supabaseUrl', url);
      localStorage.setItem('supabaseKey', key);
      localStorage.removeItem('supabaseDisconnected');

      // Re-initialize Database Manager
      SupabaseDB.init();

      alert('Successfully connected to Supabase Cloud Database!');
      loadDashboardData();
    } catch (err) {
      alert('Connection Error: ' + err.message);
    } finally {
      connectSbBtn.textContent = 'Connect';
      connectSbBtn.disabled = false;
    }
  });
}

if (disconnectSbBtn) {
  disconnectSbBtn.addEventListener('click', () => {
    if (confirm('Disconnect from Supabase and return to local storage mode?')) {
      localStorage.removeItem('supabaseUrl');
      localStorage.removeItem('supabaseKey');
      localStorage.setItem('supabaseDisconnected', 'true');
      
      if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.init();
      }

      alert('Disconnected from Supabase database. Switched back to Local Mode.');
      loadDashboardData();
    }
  });
}

if (syncSbBtn) {
  syncSbBtn.addEventListener('click', async () => {
    syncSbBtn.textContent = 'Syncing...';
    syncSbBtn.disabled = true;

    try {
      if (typeof SupabaseDB === 'undefined') {
        throw new Error('Supabase database client not loaded.');
      }
      
      const result = await SupabaseDB.syncLocalToCloud();
      alert(`Database sync complete!\n✓ Uploaded ${result.productsCount} products.\n✓ Uploaded ${result.inquiriesCount} inquiry logs.`);
      loadDashboardData();
    } catch (err) {
      alert('Sync Error: ' + err.message);
    } finally {
      syncSbBtn.textContent = 'Sync Local Storage to Cloud';
      syncSbBtn.disabled = false;
    }
  });
}

// --- DATABASE DOWNLOADS & RESET CONTROLS ---
if (exportDbBtn) {
  exportDbBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cachedProductsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "products.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });
}

if (resetDbBtn) {
  resetDbBtn.addEventListener('click', () => {
    if (confirm('WARNING: Are you sure you want to clear all product listings changes and reset to default code templates? This action cannot be undone.')) {
      localStorage.removeItem('products');
      
      // If Supabase is connected, we might want to warn they should reset table. We only clear local cache first.
      alert('Database successfully reset. Loading default listings.');
      window.location.reload();
    }
  });
}

// --- IMAGE FILE UPLOAD TO BASE64 TRANSLATORS (WITH COMPRESSION) ---
function compressAndReadImage(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 800; // standard display resolution
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Export as highly compressed JPEG data URL
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      callback(null, compressedBase64);
    };
    img.onerror = (err) => {
      callback(new Error('Failed to parse image file.'));
    };
    img.src = event.target.result;
  };
  reader.onerror = (err) => {
    callback(err);
  };
  reader.readAsDataURL(file);
}

const fileInputs = [
  { fileEl: document.getElementById('file-product-image-1'), textEl: document.getElementById('edit-product-image-1') },
  { fileEl: document.getElementById('file-product-image-2'), textEl: document.getElementById('edit-product-image-2') },
  { fileEl: document.getElementById('file-product-image-3'), textEl: document.getElementById('edit-product-image-3') }
];

fileInputs.forEach(({ fileEl, textEl }) => {
  if (fileEl && textEl) {
    fileEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Show temporary UI text change inside the file upload icon parent label
        const originalText = fileEl.parentElement ? fileEl.parentElement.title : 'Choose File';
        if (fileEl.parentElement) {
          fileEl.parentElement.title = 'Processing...';
        }
        
        compressAndReadImage(file, (err, compressedBase64) => {
          if (fileEl.parentElement) {
            fileEl.parentElement.title = originalText;
          }
          if (err) {
            console.error('File reading/compress error:', err);
            alert('Failed to read and process image file.');
            return;
          }
          textEl.value = compressedBase64;
          textEl.dispatchEvent(new Event('input'));
        });
      }
    });
  }
});

// --- INITIALIZE PORTAL STAGE ---
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
});
