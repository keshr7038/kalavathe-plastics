// --- SUPABASE DATABASE CONFIGURATION & OPERATIONS HELPER ---

const DEFAULT_SUPABASE_URL = 'https://nxgxqbnljnnsyqlvrnfs.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_8R7Co9LKIjPK4pZQP3b_CQ_w1RxoiV2';

const SupabaseDB = {
  client: null,
  isConfigured: false,

  // Helper for safe localStorage JSON parsing
  safeParseLocalItem(key, defaultVal) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultVal;
      return JSON.parse(item) || defaultVal;
    } catch (e) {
      console.error(`Error parsing localStorage item for key "${key}":`, e);
      return defaultVal;
    }
  },

  // Helper to map database rows to full details schema
  enrichProduct(p) {
    if (!p) return null;
    
    // 1. Slug
    const slug = p.slug || p.name.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // 2. Short/Full Description
    const shortDesc = p.shortDescription || p.description || '';
    const fullDesc = p.fullDescription || (shortDesc ? `${shortDesc} Crafted with premium attention to detail, this product coordinates effortlessly with our editorial, warm boutique aesthetic to elevate your everyday routines.` : '');

    // 3. Category based specs
    const categorySpecs = {
      'Storage & Utility': { 'Material': 'Premium Virgin Polymer', 'Usage': 'Home Storage', 'Installation': 'Freestanding' },
      'Kitchen & Dining': { 'Material': 'Food-Grade BPA-Free Acrylic', 'Usage': 'Dining & Kitchen', 'Installation': 'Freestanding' },
      'Cleaning Essentials': { 'Material': 'Heavy-duty Polyurethane & Steel', 'Usage': 'Household Cleaning', 'Installation': 'Manual' },
      'Bathroom Accessories': { 'Material': 'Curated Virgin Plastic', 'Usage': 'Bathroom Organizer', 'Installation': 'Adhesive Wall Mount / Freestanding' },
      'Home & Garden': { 'Material': 'Weather-resistant Virgin Polymer', 'Usage': 'Garden & Outdoor', 'Installation': 'Freestanding' }
    };
    const specs = p.specifications || {
      'Brand': 'Kalavathi Plastics',
      'Origin': 'Made in India',
      ...categorySpecs[p.category] || { 'Material': 'Premium Virgin Polymer', 'Usage': 'Multi-purpose' }
    };

    // 4. Colors
    const categoryColors = {
      'Storage & Utility': ['#F5F5DC', '#D2B48C', '#2F4F4F', '#8FBC8F'],
      'Kitchen & Dining': ['#FFFFFF', '#F0E68C', '#E6E6FA', '#BC8F8F'],
      'Cleaning Essentials': ['#2E8B57', '#4682B4', '#708090', '#F7F3EC'],
      'Bathroom Accessories': ['#FFFFFF', '#FAF0E6', '#B0C4DE', '#5F9EA0'],
      'Home & Garden': ['#556B2F', '#8B4513', '#A0522D', '#D8BFD8']
    };
    const colors = p.colors || categoryColors[p.category] || ['#FFFFFF', '#D2B48C'];

    // 5. Sizes
    const sizes = p.sizes || p.variants || ['Standard'];

    // 6. Gallery Images
    let galleryImages = p.images && Array.isArray(p.images) ? [...p.images] : [];
    if (galleryImages.length === 0) {
      galleryImages.push('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23777">No Image</text></svg>');
    }
    const baseImg = galleryImages[0];
    while (galleryImages.length < 5) {
      galleryImages.push(baseImg);
    }

    return {
      ...p,
      id: p.id,
      slug: slug,
      name: p.name,
      category: p.category,
      badge: p.badge || null,
      shortDescription: shortDesc,
      fullDescription: fullDesc,
      features: p.features || [],
      specifications: specs,
      colors: colors,
      sizes: sizes,
      images: galleryImages,
      thumbnail: p.thumbnail || baseImg,
      whatsappMessage: p.whatsappMessage || `Hello, I'm interested in your wholesale product: ${p.name}. Please provide pricing and minimum order quantity (MOQ) details.`
    };
  },

  // Initialize client if credentials exist in localStorage
  init() {
    const isDisconnected = localStorage.getItem('supabaseDisconnected') === 'true';
    
    let url = localStorage.getItem('supabaseUrl');
    let key = localStorage.getItem('supabaseKey');

    if (!url && !key && !isDisconnected) {
      url = DEFAULT_SUPABASE_URL;
      key = DEFAULT_SUPABASE_KEY;
      localStorage.setItem('supabaseUrl', url);
      localStorage.setItem('supabaseKey', key);
    }

    if (url && key && typeof supabase !== 'undefined') {
      try {
        this.client = supabase.createClient(url, key);
        this.isConfigured = true;
        console.log('Supabase client successfully initialized.');
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  },

  // Test connection credentials
  async testConnection(url, key) {
    if (typeof supabase === 'undefined') {
      throw new Error('Supabase SDK not loaded. Check internet connection or script order.');
    }
    try {
      const testClient = supabase.createClient(url, key);
      // Try to query the products table (even a limit 1 check)
      const { data, error } = await testClient.from('products').select('id').limit(1);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase connection test failed:', err);
      throw new Error(err.message || 'Connection test failed. Check URL, key, and table setup.');
    }
  },

  // Fetch all products
  async fetchProducts() {
    let localProducts = this.safeParseLocalItem('products', []);
    
    // Check if localProducts cache contains old soap dishes images
    let localUpdated = false;
    const localSoapDish = localProducts.find(p => p.id === 'ba1');
    if (localSoapDish) {
      if (localSoapDish.images && localSoapDish.images.length === 5 && 
          (localSoapDish.images[3] === 'assets/products/soap-holder-1.webp' || 
           localSoapDish.images[3] === '/assets/products/soap-holder-1.webp') && 
          (localSoapDish.images[4] === 'assets/products/soap-holder-1.webp' || 
           localSoapDish.images[4] === '/assets/products/soap-holder-1.webp')) {
        localSoapDish.images = [
          'assets/products/soap-holder-1.webp',
          'assets/products/soap-holder-2.webp',
          'assets/products/soap-holder-3.webp',
          'assets/products/soap-holder-detail-1.jpg',
          'assets/products/soap-holder-detail-2.jpg'
        ];
        localUpdated = true;
      }
    }

    if (localProducts.length === 0 && typeof DEFAULT_PRODUCTS !== 'undefined') {
      localProducts = DEFAULT_PRODUCTS;
      localUpdated = true;
    }
    
    if (localUpdated) {
      try {
        localStorage.setItem('products', JSON.stringify(localProducts));
      } catch (e) {
        console.error('Failed to cache products:', e);
      }
    }
    
    if (!this.isConfigured || !this.client) {
      console.log('Using local storage products (Supabase not connected).');
      return localProducts.map(p => this.enrichProduct(p));
    }

    try {
      const { data, error } = await this.client
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('Successfully fetched products from Supabase cloud.');
        
        // Dynamic sync for Soap Dish images in Supabase database
        const soapDishIndex = data.findIndex(p => p.id === 'ba1');
        if (soapDishIndex !== -1) {
          const soapDish = data[soapDishIndex];
          if (soapDish.images && soapDish.images.length === 5 && 
              (soapDish.images[3] === 'assets/products/soap-holder-1.webp' || 
               soapDish.images[3] === '/assets/products/soap-holder-1.webp') && 
              (soapDish.images[4] === 'assets/products/soap-holder-1.webp' || 
               soapDish.images[4] === '/assets/products/soap-holder-1.webp')) {
            
            console.log('Migrating Soap Dish images in Supabase...');
            soapDish.images = [
              'assets/products/soap-holder-1.webp',
              'assets/products/soap-holder-2.webp',
              'assets/products/soap-holder-3.webp',
              'assets/products/soap-holder-detail-1.jpg',
              'assets/products/soap-holder-detail-2.jpg'
            ];
            
            // Push update to database async
            this.saveProduct(soapDish).catch(e => console.error('Failed to sync migrated Soap Dish to database:', e));
          }
        }

        // Cache products locally to support offline fallback
        localStorage.setItem('products', JSON.stringify(data));
        return data.map(p => this.enrichProduct(p));
      } else {
        console.log('Supabase products table is empty. Falling back to local catalog.');
        return localProducts.map(p => this.enrichProduct(p));
      }
    } catch (err) {
      console.error('Error fetching products from Supabase, using local cache fallback:', err);
      return localProducts.map(p => this.enrichProduct(p));
    }
  },

  // Save/Upsert product
  async saveProduct(product) {
    // 1. Save locally first
    try {
      let localProducts = this.safeParseLocalItem('products', []);
      const idx = localProducts.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        localProducts[idx] = product;
      } else {
        localProducts.push(product);
      }
      localStorage.setItem('products', JSON.stringify(localProducts));
    } catch (err) {
      console.error('Failed to save product locally:', err);
      throw new Error('Local browser storage is full. Try reducing image dimensions/sizes.');
    }

    // 2. Save to Supabase if connected
    if (this.isConfigured && this.client) {
      try {
        const { error } = await this.client
          .from('products')
          .upsert({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            badge: product.badge || null,
            variants: product.variants || [],
            features: product.features || [],
            images: product.images || []
          });
        if (error) throw error;
        console.log(`Product ${product.name} saved to Supabase.`);
      } catch (err) {
        console.error('Failed to sync product save to Supabase:', err);
        throw err;
      }
    }
  },

  // Delete product
  async deleteProduct(id) {
    // 1. Delete locally first
    let localProducts = this.safeParseLocalItem('products', []);
    localProducts = localProducts.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(localProducts));

    // 2. Delete from Supabase if connected
    if (this.isConfigured && this.client) {
      try {
        const { error } = await this.client
          .from('products')
          .delete()
          .eq('id', id);
        if (error) throw error;
        console.log(`Product id ${id} deleted from Supabase.`);
      } catch (err) {
        console.error('Failed to sync product deletion to Supabase:', err);
      }
    }
  },

  // Log WhatsApp Inquiry
  async logInquiry(inquiry) {
    // 1. Log locally first
    let localInquiries = this.safeParseLocalItem('whatsappInquiries', []);
    localInquiries.push(inquiry);
    localStorage.setItem('whatsappInquiries', JSON.stringify(localInquiries));

    // 2. Save to Supabase if connected
    if (this.isConfigured && this.client) {
      try {
        const { error } = await this.client
          .from('inquiries')
          .insert({
            timestamp: inquiry.timestamp,
            items: inquiry.items,
            notes: inquiry.notes || ''
          });
        if (error) throw error;
        console.log('WhatsApp inquiry successfully logged to Supabase.');
      } catch (err) {
        console.error('Failed to sync inquiry log to Supabase:', err);
      }
    }
  },

  // Fetch all inquiry logs
  async fetchInquiries() {
    const localInquiries = this.safeParseLocalItem('whatsappInquiries', []);

    if (!this.isConfigured || !this.client) {
      return localInquiries;
    }

    try {
      const { data, error } = await this.client
        .from('inquiries')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      if (data) {
        localStorage.setItem('whatsappInquiries', JSON.stringify(data));
        return data;
      }
      return localInquiries;
    } catch (err) {
      console.error('Error fetching inquiries from Supabase, using local logs:', err);
      return localInquiries;
    }
  },

  // Sync entire local storage database to cloud
  async syncLocalToCloud() {
    if (!this.isConfigured || !this.client) {
      throw new Error('Supabase is not connected. Connect first in settings.');
    }

    const products = this.safeParseLocalItem('products', []);
    const inquiries = this.safeParseLocalItem('whatsappInquiries', []);

    // 1. Upload products
    if (products.length > 0) {
      const dbProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        badge: p.badge || null,
        variants: p.variants || [],
        features: p.features || [],
        images: p.images || []
      }));

      const { error: prodError } = await this.client
        .from('products')
        .upsert(dbProducts);

      if (prodError) throw new Error('Product sync failed: ' + prodError.message);
    }

    // 2. Upload inquiries
    if (inquiries.length > 0) {
      const dbInquiries = inquiries.map(inq => ({
        timestamp: inq.timestamp,
        items: inq.items,
        notes: inq.notes || ''
      }));

      // Inquiries can have duplicates, so we just insert them
      const { error: inqError } = await this.client
        .from('inquiries')
        .insert(dbInquiries);

      if (inqError) throw new Error('Inquiries sync failed: ' + inqError.message);
    }

    return {
      productsCount: products.length,
      inquiriesCount: inquiries.length
    };
  }
};

// Auto-initialize on load
SupabaseDB.init();
