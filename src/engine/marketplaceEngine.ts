import { Product, SellerOrder } from '../types';
import { supabase } from '../lib/supabaseClient';
import { calculateMarketplaceFeeSplit } from './binaryEngine';

const STORAGE_PRODUCTS_KEY = 'eviona_marketplace_products_v3';
const STORAGE_ORDERS_KEY = 'eviona_marketplace_orders_v2';

export const INITIAL_MARKETPLACE_CATALOG: Product[] = [
  {
    id: 'PRD-001',
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
    sellerName: 'Eviona Labs',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    licenseType: 'Commercial',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PRD-002',
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
    sellerName: 'Apex Digital',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badge: 'TOP RATED',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    licenseType: 'Developer License',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PRD-003',
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
    sellerName: 'Apex Digital',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    licenseType: 'Commercial',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PRD-004',
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
    sellerName: 'Eviona Academy',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'FEATURED',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
    instantDownload: true,
    isCreatorCourse: true,
    licenseType: 'Lifetime Access',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
];

export const marketplaceEngine = {
  // Load All Marketplace Products
  getProducts(): Product[] {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[MarketplaceEngine] Error loading products:', e);
    }
    // Initialize default catalog
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_MARKETPLACE_CATALOG));
    return INITIAL_MARKETPLACE_CATALOG;
  },

  // Create New Product with Custom 1% to 100% Affiliate Rate
  async createProduct(data: {
    title: string;
    description: string;
    category: string;
    price: number;
    commissionPercentage: number; // 1 to 100
    downloadUrl?: string;
    licenseType?: string;
    sellerId: string;
    sellerName: string;
    sellerEmail?: string;
    image?: string;
  }): Promise<Product> {
    const safePercentage = Math.min(Math.max(Number(data.commissionPercentage) || 40, 1), 100);
    const affiliateRate = Number((safePercentage / 100).toFixed(4));

    const newProduct: Product = {
      id: `PRD-${Date.now().toString().slice(-5)}`,
      title: data.title.trim(),
      description: data.description?.trim() || 'Premium digital product delivered instantly.',
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
      sellerName: data.sellerName,
      sellerEmail: data.sellerEmail,
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badge: 'NEW',
      image: data.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      instantDownload: true,
      licenseType: data.licenseType || 'Commercial',
      downloadUrl: data.downloadUrl || '',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const currentList = this.getProducts();
    const updated = [newProduct, ...currentList];
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));

    // Optional background sync to Supabase table
    try {
      await supabase.from('Product').upsert({
        id: newProduct.id,
        title: newProduct.title,
        description: newProduct.description,
        category: newProduct.category,
        price: newProduct.price,
        affiliateCommissionRate: newProduct.affiliateCommissionRate,
        sellerId: newProduct.sellerId,
        sellerName: newProduct.sellerName,
        createdAt: newProduct.createdAt,
      });
    } catch (e) {
      console.warn('[MarketplaceEngine] Database sync notice:', e);
    }

    return newProduct;
  },

  // Update Product Details
  updateProduct(productId: string, updates: Partial<Product>): Product[] {
    const list = this.getProducts();
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

  // Delete Product
  deleteProduct(productId: string): Product[] {
    const list = this.getProducts();
    const updated = list.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // Get Seller Orders (Clean real orders, no fake numbers)
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
      console.warn('[MarketplaceEngine] Error loading seller orders:', e);
    }
    return [];
  },

  // Record a Real Marketplace Purchase & Credit Seller + Promoter
  recordPurchase(orderData: {
    product: Product;
    buyerEmail: string;
    buyerName?: string;
    promoterCode?: string;
  }): SellerOrder {
    const { product, buyerEmail, buyerName, promoterCode } = orderData;
    const isPromoterSale = Boolean(promoterCode && promoterCode.trim() !== '');

    const split = calculateMarketplaceFeeSplit(
      product.price,
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
      amountUsd: product.price,
      netSellerEarned: split.sellerPayoutNet,
      promoterAttributed: promoterCode ? `${promoterCode} (Affiliate)` : 'Direct Organic Sale',
      promoterCommission: split.promoterCommissionNet,
      platformFee: split.platformFee,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Settled',
    };

    // 1. Save to orders list
    const existing = this.getSellerOrders();
    const updatedOrders = [newOrder, ...existing];
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updatedOrders));

    // 2. Increment sales count on product
    const products = this.getProducts();
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return { ...p, salesCount: (p.salesCount || 0) + 1 };
      }
      return p;
    });
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updatedProducts));

    return newOrder;
  }
};
