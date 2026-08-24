import { Product, SellerOrder, UserStoreSettings, StoreCoupon, StoreReview } from '../types';
import { supabase } from '../lib/supabaseClient';
import { calculateMarketplaceFeeSplit } from './binaryEngine';

const STORAGE_PRODUCTS_KEY = 'eviona_unified_products_v4';
const STORAGE_ORDERS_KEY = 'eviona_unified_orders_v4';
const STORAGE_STORES_KEY = 'eviona_unified_stores_v4';
const STORAGE_COUPONS_KEY = 'eviona_unified_coupons_v4';
const STORAGE_REVIEWS_KEY = 'eviona_unified_reviews_v4';

export interface AIProductCopyPrompt {
  topic: string;
  category: string;
  targetAudience?: string;
  price?: number;
}

export interface AIProductCopyResult {
  title: string;
  description: string;
  features: string[];
  suggestedPrice: number;
  suggestedAffiliatePct: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export const INITIAL_MARKETPLACE_CATALOG: Product[] = [
  {
    id: 'PRD-001',
    slug: 'ai-prompts-mastery-kit',
    title: 'AI Prompts Mastery Kit',
    description: '10,000+ battle-tested prompts for ChatGPT, Claude, and Midjourney to automate marketing copy and sales funnels.',
    category: 'Software & Tools',
    price: 49.00,
    originalPrice: 99.00,
    affiliateCommissionRate: 0.40, // 40%
    commissionPercentage: 40,
    salesCount: 142,
    rating: 4.9,
    reviewsCount: 38,
    seller: 'Eviona Labs',
    sellerId: 'EVO-ID-100245',
    storeId: 'eviona-labs',
    sellerName: 'Eviona Labs',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'BEST SELLER',
    badgeColor: 'bg-emerald-600 text-white',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    licenseType: 'Commercial License',
    status: 'active',
    approved: true,
    visibility: 'public',
    isFeatured: true,
    inventoryCount: 9999,
    features: ['10,000+ Categorized Prompts', 'Midjourney v6 Image Recipes', 'SaaS Cold Email Templates', 'Lifetime Updates'],
    seoTitle: 'AI Prompts Mastery Kit — 10k+ ChatGPT & Midjourney Prompts',
    seoDescription: 'Supercharge your marketing and automation workflow with 10k+ battle-tested AI prompts.',
    seoKeywords: ['ai prompts', 'chatgpt templates', 'midjourney prompts', 'prompt engineering'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PRD-002',
    slug: 'enterprise-saas-boilerplate',
    title: 'Enterprise SaaS Boilerplate',
    description: 'Production-ready React, Tailwind, and Supabase starter codebase with built-in multi-tenancy and Stripe billing.',
    category: 'Templates',
    price: 149.00,
    originalPrice: 299.00,
    affiliateCommissionRate: 0.50, // 50%
    commissionPercentage: 50,
    salesCount: 89,
    rating: 5.0,
    reviewsCount: 24,
    seller: 'Apex Digital',
    sellerId: 'EVO-ID-100246',
    storeId: 'apex-digital',
    sellerName: 'Apex Digital',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badge: 'TOP RATED',
    badgeColor: 'bg-teal-600 text-white',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    licenseType: 'Developer License',
    status: 'active',
    approved: true,
    visibility: 'public',
    isFeatured: true,
    inventoryCount: 500,
    features: ['Full TypeScript Codebase', 'Supabase Auth & RLS', 'Stripe Billing & Invoicing', 'Dark Mode UI Kit'],
    seoTitle: 'Enterprise SaaS Boilerplate (React + Supabase)',
    seoDescription: 'Launch your next software venture in hours with a battle-tested enterprise architecture.',
    seoKeywords: ['saas boilerplate', 'react template', 'supabase starter', 'fullstack template'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PRD-003',
    slug: 'high-converting-funnel-pack',
    title: 'E-Commerce High-Converting Funnel',
    description: 'High-converting ClickFunnels and Webflow landing page templates engineered for dropshipping and DTC brands.',
    category: 'Templates',
    price: 79.00,
    originalPrice: 159.00,
    affiliateCommissionRate: 0.35, // 35%
    commissionPercentage: 35,
    salesCount: 64,
    rating: 4.8,
    reviewsCount: 19,
    seller: 'Apex Digital',
    sellerId: 'EVO-ID-100246',
    storeId: 'apex-digital',
    sellerName: 'Apex Digital',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badge: 'HOT',
    badgeColor: 'bg-rose-600 text-white',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    licenseType: 'Commercial License',
    status: 'active',
    approved: true,
    visibility: 'public',
    isFeatured: false,
    inventoryCount: 9999,
    features: ['Mobile Responsive', 'High Speed A/B Tested', 'Figma Source Files', '1-Click Install'],
    seoTitle: 'High-Converting DTC E-Commerce Landing Page Funnel',
    seoDescription: 'Convert visitors into buyers with battle-tested DTC funnel templates.',
    seoKeywords: ['funnel template', 'ecommerce landing page', 'webflow template'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PRD-004',
    slug: 'digital-growth-masterclass',
    title: 'Digital Growth Masterclass',
    description: 'Step-by-step video academy on building 6-figure recurring affiliate channels and organic traffic systems.',
    category: 'Digital Courses',
    price: 99.00,
    originalPrice: 199.00,
    affiliateCommissionRate: 0.40, // 40%
    commissionPercentage: 40,
    salesCount: 112,
    rating: 4.9,
    reviewsCount: 47,
    seller: 'Eviona Academy',
    sellerId: 'EVO-ID-100245',
    storeId: 'eviona-labs',
    sellerName: 'Eviona Academy',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'FEATURED',
    badgeColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    isCreatorCourse: true,
    licenseType: 'Lifetime Access',
    status: 'active',
    approved: true,
    visibility: 'public',
    isFeatured: true,
    inventoryCount: 9999,
    features: ['18 HD Video Lessons', 'Private Mastermind Access', 'Actionable Growth Checklists', 'Certificate of Completion'],
    seoTitle: 'Digital Growth Masterclass — 6-Figure Affiliate Systems',
    seoDescription: 'Learn how to build high-converting traffic systems and automated affiliate funnels.',
    seoKeywords: ['growth masterclass', 'affiliate course', 'digital marketing'],
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_STORES_DIRECTORY: UserStoreSettings[] = [
  {
    userId: 'EVO-ID-100245',
    storeSlug: 'eviona-labs',
    storeName: 'Eviona Labs Official Store',
    tagline: 'Official core tools, courses, and AI mastery resources.',
    bio: 'Pioneering decentralized business infrastructure, prompt mastery kits, and high-growth venture systems.',
    themeColor: 'indigo',
    category: 'Software & Tools',
    rating: 4.9,
    reviewsCount: 85,
    verifiedSeller: true,
    isFeaturedStore: true,
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    supportEmail: 'support@evionaecosystem.com',
    whatsappNumber: '+1 (555) 019-2834',
    socialLinks: {
      twitter: 'https://twitter.com/evionaecosystem',
      youtube: 'https://youtube.com',
      website: 'https://evionaecosystem.com',
    },
    featuredProductIds: ['PRD-001', 'PRD-004'],
    curatedMarketplaceProductIds: ['PRD-001', 'PRD-002', 'PRD-003', 'PRD-004'],
    announcementActive: true,
    announcementText: '🚀 Global Launch Special: Instant digital access & 40% affiliate commissions across all assets!',
  },
  {
    userId: 'EVO-ID-100246',
    storeSlug: 'apex-digital',
    storeName: 'Apex Digital Studio',
    tagline: 'Elite UI kits, SaaS boilerplates, and high-converting funnels.',
    bio: 'Crafting developer-grade templates and enterprise UI kits that accelerate startup launches by 10x.',
    themeColor: 'purple',
    category: 'Templates',
    rating: 5.0,
    reviewsCount: 43,
    verifiedSeller: true,
    isFeaturedStore: true,
    logoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    supportEmail: 'sarah@agency.com',
    socialLinks: {
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
    },
    featuredProductIds: ['PRD-002', 'PRD-003'],
    curatedMarketplaceProductIds: ['PRD-001', 'PRD-002', 'PRD-003'],
    announcementActive: true,
    announcementText: '⚡ Top Rated: 50% commission for all verified affiliates promoting our SaaS boilerplates!',
  },
  {
    userId: 'EVO-ID-100248',
    storeSlug: 'davis-consulting',
    storeName: 'Emily Davis Masterminds',
    tagline: 'Business strategy frameworks, consulting blueprints, and legal templates.',
    bio: 'Helping solo entrepreneurs and digital agencies scale to 7-figures with standardized operational blueprints.',
    themeColor: 'emerald',
    category: 'Business & Legal',
    rating: 4.8,
    reviewsCount: 29,
    verifiedSeller: true,
    isFeaturedStore: false,
    logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    supportEmail: 'emily@consulting.com',
    featuredProductIds: ['PRD-001'],
    curatedMarketplaceProductIds: ['PRD-001', 'PRD-004'],
    announcementActive: false,
    announcementText: '',
  }
];

export const marketplaceEngine = {
  // ==========================================
  // 1. Unified Product Catalog Engine
  // ==========================================
  getProducts(filterApprovedOnly = true): Product[] {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return filterApprovedOnly ? parsed.filter(p => p.approved !== false && p.status !== 'archived') : parsed;
        }
      }
    } catch (e) {
      console.warn('[MarketplaceEngine] Error loading products:', e);
    }
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_MARKETPLACE_CATALOG));
    return INITIAL_MARKETPLACE_CATALOG;
  },

  getProductById(idOrSlug: string): Product | undefined {
    const products = this.getProducts(false);
    return products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  },

  // Create Product Once (Automatically published to Personal Store, Global Marketplace, and Affiliate Marketplace)
  async createProduct(data: {
    title: string;
    description: string;
    category: string;
    price: number;
    commissionPercentage: number; // 1 to 100
    downloadUrl?: string;
    licenseType?: string;
    inventoryCount?: number;
    sellerId: string;
    sellerName: string;
    sellerEmail?: string;
    image?: string;
    features?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  }): Promise<Product> {
    const safePercentage = Math.min(Math.max(Number(data.commissionPercentage) || 40, 1), 100);
    const affiliateRate = Number((safePercentage / 100).toFixed(4));
    const generatedSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: `PRD-${Date.now().toString().slice(-5)}`,
      slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
      title: data.title.trim(),
      description: data.description?.trim() || 'Premium digital product with instant download.',
      category: data.category || 'Templates',
      price: Number(data.price) || 49.00,
      originalPrice: Number((Number(data.price) * 1.5).toFixed(2)),
      affiliateCommissionRate: affiliateRate,
      commissionPercentage: safePercentage,
      salesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      seller: data.sellerName,
      sellerId: data.sellerId,
      storeId: data.sellerId.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      sellerName: data.sellerName,
      sellerEmail: data.sellerEmail,
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badge: 'NEW',
      badgeColor: 'bg-blue-600 text-white',
      image: data.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      instantDownload: true,
      licenseType: data.licenseType || 'Commercial License',
      downloadUrl: data.downloadUrl || '',
      inventoryCount: data.inventoryCount || 9999,
      status: 'active',
      approved: true, // Default auto-approval; superadmin can moderate
      visibility: 'public',
      isFeatured: false,
      features: data.features || ['Instant Secure Download', 'Commercial License Included', 'Priority Email Support'],
      seoTitle: data.seoTitle || `${data.title} — Instant Download`,
      seoDescription: data.seoDescription || data.description?.slice(0, 160),
      seoKeywords: data.seoKeywords || [data.category.toLowerCase(), 'digital download', 'eviona store'],
      createdAt: new Date().toISOString(),
    };

    const currentList = this.getProducts(false);
    const updated = [newProduct, ...currentList];
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));

    // Also auto-add to Seller's Storefront featured products
    const store = this.getStoreSettings(data.sellerId);
    store.curatedMarketplaceProductIds = [...new Set([newProduct.id, ...(store.curatedMarketplaceProductIds || [])])];
    this.saveStoreSettings(store);

    // Sync to Supabase in background
    (async () => {
      try {
        await supabase.from('Product').upsert({
          id: newProduct.id,
          slug: newProduct.slug,
          title: newProduct.title,
          description: newProduct.description,
          category: newProduct.category,
          price: newProduct.price,
          affiliateCommissionRate: newProduct.affiliateCommissionRate,
          sellerId: newProduct.sellerId,
          sellerName: newProduct.sellerName,
          status: newProduct.status,
          approved: newProduct.approved,
          createdAt: newProduct.createdAt,
        });
      } catch {}
    })();

    return newProduct;
  },

  updateProduct(productId: string, updates: Partial<Product>): Product[] {
    const list = this.getProducts(false);
    const updated = list.map(p => {
      if (p.id === productId) {
        let commRate = p.affiliateCommissionRate;
        let commPct = p.commissionPercentage;
        if (typeof updates.commissionPercentage === 'number') {
          commPct = Math.min(Math.max(updates.commissionPercentage, 1), 100);
          commRate = Number((commPct / 100).toFixed(4));
        }
        return {
          ...p,
          ...updates,
          affiliateCommissionRate: commRate,
          commissionPercentage: commPct,
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteProduct(productId: string): Product[] {
    const list = this.getProducts(false);
    const updated = list.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // ==========================================
  // 2. Stores Directory & Storefront Engine
  // ==========================================
  getAllStores(): UserStoreSettings[] {
    try {
      const saved = localStorage.getItem(STORAGE_STORES_KEY);
      if (saved) {
        const parsed: Record<string, UserStoreSettings> | UserStoreSettings[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') return Object.values(parsed);
      }
    } catch (e) {
      console.warn('[MarketplaceEngine] Error loading stores:', e);
    }
    const storeMap: Record<string, UserStoreSettings> = {};
    INITIAL_STORES_DIRECTORY.forEach(s => { storeMap[s.userId] = s; });
    localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(storeMap));
    return INITIAL_STORES_DIRECTORY;
  },

  getStoreSettings(userIdOrSlug: string, userName?: string): UserStoreSettings {
    const clean = (userIdOrSlug || '').trim();
    const allStores = this.getAllStores();

    const existing = allStores.find(s =>
      s.userId.toUpperCase() === clean.toUpperCase() ||
      s.storeSlug.toLowerCase() === clean.toLowerCase() ||
      s.userId.replace('EVO-ID-', '').toUpperCase() === clean.toUpperCase()
    );

    if (existing) return existing;

    // Create fresh default store for user
    const defaultStore: UserStoreSettings = {
      userId: clean.startsWith('EVO-ID-') ? clean : `EVO-ID-${clean.replace(/^EVO-?I?D?-?/i, '')}`,
      storeSlug: clean.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      storeName: `${userName || clean}'s Storefront`,
      tagline: 'Official curated digital products, software tools, and mastermind courses.',
      bio: 'Welcome to my official digital boutique on Eviona. Explore handpicked templates and courses with instant delivery.',
      themeColor: 'indigo',
      category: 'Templates',
      rating: 5.0,
      reviewsCount: 0,
      verifiedSeller: true,
      logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      supportEmail: `${clean.toLowerCase()}@evionaecosystem.com`,
      featuredProductIds: ['PRD-001', 'PRD-002'],
      curatedMarketplaceProductIds: ['PRD-001', 'PRD-002', 'PRD-003', 'PRD-004'],
      announcementActive: true,
      announcementText: '⚡ Instant digital delivery & 100% money-back satisfaction guarantee.',
    };

    this.saveStoreSettings(defaultStore);
    return defaultStore;
  },

  saveStoreSettings(settings: UserStoreSettings): UserStoreSettings {
    try {
      const saved = localStorage.getItem(STORAGE_STORES_KEY);
      const storeMap: Record<string, UserStoreSettings> = saved ? JSON.parse(saved) : {};
      storeMap[settings.userId] = settings;
      if (settings.storeSlug) {
        storeMap[settings.storeSlug] = settings;
      }
      localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(storeMap));
    } catch (e) {
      console.warn('[MarketplaceEngine] Error saving store settings:', e);
    }
    return settings;
  },

  getStoreProducts(userIdOrSlug: string): Product[] {
    const store = this.getStoreSettings(userIdOrSlug);
    const allProducts = this.getProducts(true);

    const createdBySeller = allProducts.filter(p =>
      p.sellerId === store.userId ||
      p.storeId === store.storeSlug ||
      p.sellerName === store.storeName
    );

    const curated = allProducts.filter(p =>
      store.curatedMarketplaceProductIds?.includes(p.id) &&
      !createdBySeller.some(c => c.id === p.id)
    );

    const combined = [...createdBySeller, ...curated];
    return combined.length > 0 ? combined : allProducts.slice(0, 3);
  },

  // ==========================================
  // 3. Coupons & Discounts Engine
  // ==========================================
  getStoreCoupons(storeId: string): StoreCoupon[] {
    try {
      const saved = localStorage.getItem(STORAGE_COUPONS_KEY);
      if (saved) {
        const coupons: StoreCoupon[] = JSON.parse(saved);
        return coupons.filter(c => c.storeId === storeId || c.storeId === 'global');
      }
    } catch {}
    const defaultCoupons: StoreCoupon[] = [
      { id: 'CPN-1', storeId: 'global', code: 'LAUNCH20', discountType: 'percentage', discountValue: 20, timesUsed: 14, isActive: true },
      { id: 'CPN-2', storeId: storeId, code: 'VIP10', discountType: 'percentage', discountValue: 10, timesUsed: 8, isActive: true },
    ];
    return defaultCoupons;
  },

  createCoupon(coupon: Omit<StoreCoupon, 'id' | 'timesUsed'>): StoreCoupon {
    const newCoupon: StoreCoupon = {
      ...coupon,
      id: `CPN-${Date.now().toString().slice(-4)}`,
      timesUsed: 0,
      code: coupon.code.toUpperCase().trim(),
    };
    try {
      const saved = localStorage.getItem(STORAGE_COUPONS_KEY);
      const list: StoreCoupon[] = saved ? JSON.parse(saved) : [];
      list.push(newCoupon);
      localStorage.setItem(STORAGE_COUPONS_KEY, JSON.stringify(list));
    } catch {}
    return newCoupon;
  },

  validateCoupon(code: string, storeId: string, orderTotal: number): { valid: boolean; discountAmount: number; message: string } {
    const coupons = this.getStoreCoupons(storeId);
    const match = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive);
    if (!match) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }
    let discount = 0;
    if (match.discountType === 'percentage') {
      discount = (orderTotal * (match.discountValue / 100));
    } else {
      discount = match.discountValue;
    }
    discount = Math.min(discount, orderTotal);
    return {
      valid: true,
      discountAmount: Number(discount.toFixed(2)),
      message: `Coupon applied: Saved $${discount.toFixed(2)} (${match.discountValue}${match.discountType === 'percentage' ? '%' : '$'} OFF)`,
    };
  },

  // ==========================================
  // 4. Financial Settlement & Orders Engine
  // ==========================================
  getSellerOrders(sellerIdentifier?: string): SellerOrder[] {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) {
        const parsed: SellerOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (!sellerIdentifier) return parsed;
          const clean = sellerIdentifier.toLowerCase().trim();
          return parsed.filter(o =>
            (o.sellerId && o.sellerId.toLowerCase().includes(clean)) ||
            (o.sellerName && o.sellerName.toLowerCase().includes(clean))
          );
        }
      }
    } catch (e) {
      console.warn('[MarketplaceEngine] Error loading orders:', e);
    }
    return [];
  },

  recordPurchase(orderData: {
    product: Product;
    buyerEmail: string;
    buyerName?: string;
    promoterCode?: string;
    couponCode?: string;
    discountAmount?: number;
  }): SellerOrder {
    const { product, buyerEmail, buyerName, promoterCode, couponCode, discountAmount = 0 } = orderData;
    const finalPrice = Math.max(0, product.price - discountAmount);
    const isPromoterSale = Boolean(promoterCode && promoterCode.trim() !== '');

    const split = calculateMarketplaceFeeSplit(
      finalPrice,
      isPromoterSale ? (product.affiliateCommissionRate || 0.40) : 0
    );

    const now = new Date();
    const newOrder: SellerOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      productId: product.id,
      productName: product.title,
      buyerName: buyerName || 'Customer',
      buyerEmail: buyerEmail,
      sellerId: product.sellerId || 'EVO-ID-100245',
      sellerName: product.sellerName || product.seller || 'Seller',
      amountUsd: finalPrice,
      netSellerEarned: split.sellerPayoutNet,
      promoterAttributed: promoterCode ? `${promoterCode} (Affiliate)` : 'Direct Organic Sale',
      promoterCommission: split.promoterCommissionNet,
      platformFee: split.platformFee,
      couponCodeUsed: couponCode,
      discountAmount: discountAmount,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Settled',
    };

    // 1. Persist Order to global order registry
    const existingOrders = this.getSellerOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updatedOrders));

    // 2. Increment sales count on product
    const products = this.getProducts(false);
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          salesCount: (p.salesCount || 0) + 1,
          inventoryCount: Math.max(0, (p.inventoryCount || 9999) - 1),
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updatedProducts));

    // 3. Ingest customer record into Seller CRM Leads
    try {
      const crmKey = 'eviona_crm_leads_v2';
      const crmRaw = localStorage.getItem(crmKey);
      const leads = crmRaw ? JSON.parse(crmRaw) : [];
      leads.unshift({
        id: `LED-${Date.now().toString().slice(-4)}`,
        name: buyerName || 'Customer',
        email: buyerEmail,
        company: 'Individual Buyer',
        leadSource: 'marketplace',
        ownerType: 'member',
        ownerId: product.sellerId || 'EVO-ID-100245',
        ownerName: product.sellerName || 'Seller',
        source: `Store Order #${newOrder.id} (${product.title})`,
        status: 'Converted',
        stage: 'Won',
        dealValue: finalPrice,
        createdAt: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
      localStorage.setItem(crmKey, JSON.stringify(leads));
    } catch {}

    return newOrder;
  },

  // ==========================================
  // 5. AI Recommendations & Copywriting Engine
  // ==========================================
  getAIRecommendations(currentProductId?: string, category?: string): Product[] {
    const all = this.getProducts(true);
    let candidates = all.filter(p => p.id !== currentProductId);
    if (category) {
      const sameCategory = candidates.filter(p => p.category === category);
      if (sameCategory.length > 0) candidates = sameCategory;
    }
    return candidates.slice(0, 3);
  },

  generateAIProductCopy(prompt: AIProductCopyPrompt): AIProductCopyResult {
    const { topic, category, targetAudience = 'Digital Entrepreneurs & Creators', price = 49 } = prompt;
    const cleanTopic = topic.trim() || 'High Performance Digital Business System';

    return {
      title: `${cleanTopic} — Master Edition`,
      description: `The complete step-by-step system engineered for ${targetAudience}. Includes battle-tested frameworks, automated templates, and commercial licensing for rapid execution.`,
      features: [
        'Production-ready digital assets and templates',
        'Commercial & agency usage license included',
        'Actionable implementation blueprint & checklist',
        'Lifetime access & automatic feature updates',
      ],
      suggestedPrice: price > 0 ? price : 79.00,
      suggestedAffiliatePct: 40,
      seoTitle: `${cleanTopic} — Instant Download & Commercial License`,
      seoDescription: `Download the complete ${cleanTopic} for ${targetAudience}. Instant delivery and commercial rights included.`,
      seoKeywords: [
        cleanTopic.toLowerCase(),
        category.toLowerCase(),
        'digital template',
        'business kit',
        'instant download',
      ],
    };
  }
};
