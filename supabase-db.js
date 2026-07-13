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
    if (localProducts.length === 0 && typeof DEFAULT_PRODUCTS !== 'undefined') {
      localProducts = DEFAULT_PRODUCTS;
      try {
        localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
      } catch (e) {
        console.error('Failed to cache default products:', e);
      }
    }
    
    if (!this.isConfigured || !this.client) {
      console.log('Using local storage products (Supabase not connected).');
      return localProducts;
    }

    try {
      const { data, error } = await this.client
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('Successfully fetched products from Supabase cloud.');
        // Cache products locally to support offline fallback
        localStorage.setItem('products', JSON.stringify(data));
        return data;
      } else {
        console.log('Supabase products table is empty. Falling back to local catalog.');
        return localProducts;
      }
    } catch (err) {
      console.error('Error fetching products from Supabase, using local cache fallback:', err);
      return localProducts;
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
