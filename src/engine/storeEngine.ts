import { UserStoreSettings, Product } from '../types';
import { marketplaceEngine } from './marketplaceEngine';
import { supabase } from '../lib/supabaseClient';

const STORAGE_USER_STORES_KEY = 'eviona_user_stores_v2';
const STORAGE_STORE_STATS_KEY = 'eviona_user_store_stats_v2';

export interface StoreStats {
  viewsCount: number;
  ordersCount: number;
  revenueEarned: number;
}

export const storeEngine = {
  // Get or Initialize Store Settings for a specific user ID or Slug
  getStoreSettings(userIdOrSlug: string, userName?: string): UserStoreSettings {
    const cleanId = userIdOrSlug.trim();
    try {
      const saved = localStorage.getItem(STORAGE_USER_STORES_KEY);
      if (saved) {
        const stores: Record<string, UserStoreSettings> = JSON.parse(saved);
        // Look up by direct key, storeSlug, or uppercase ID
        for (const key of Object.keys(stores)) {
          const s = stores[key];
          if (
            s.userId.toUpperCase() === cleanId.toUpperCase() ||
            s.storeSlug.toLowerCase() === cleanId.toLowerCase() ||
            s.userId.replace('EVO-ID-', '').toUpperCase() === cleanId.toUpperCase()
          ) {
            return s;
          }
        }
      }
    } catch (e) {
      console.warn('[StoreEngine] Error loading store settings:', e);
    }

    // Default Store Settings
    const displayName = userName || (cleanId.startsWith('EVO-ID-') ? `Member ${cleanId}` : cleanId);
    const defaultSettings: UserStoreSettings = {
      userId: cleanId.startsWith('EVO-ID-') ? cleanId : `EVO-ID-${cleanId.replace(/^EVO-?I?D?-?/i, '')}`,
      storeSlug: cleanId.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      storeName: `${displayName}'s Digital Storefront`,
      tagline: 'Curated digital products, software tools, and mastermind courses.',
      bio: 'Welcome to my official Eviona Store. Explore handpicked premium templates, courses, and automation systems delivered instantly upon purchase.',
      themeColor: 'indigo',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      supportEmail: `${cleanId.toLowerCase()}@evionaecosystem.com`,
      whatsappNumber: '',
      socialLinks: {
        twitter: '',
        instagram: '',
        youtube: '',
        website: '',
      },
      featuredProductIds: ['PRD-001', 'PRD-002'],
      curatedMarketplaceProductIds: ['PRD-001', 'PRD-002', 'PRD-003', 'PRD-004'],
      announcementActive: true,
      announcementText: '⚡ Limited Time Offer: Instant digital delivery on all mastermind resources!',
    };

    this.saveStoreSettings(defaultSettings);
    return defaultSettings;
  },

  // Save Store Settings
  saveStoreSettings(settings: UserStoreSettings): UserStoreSettings {
    try {
      const saved = localStorage.getItem(STORAGE_USER_STORES_KEY);
      const stores: Record<string, UserStoreSettings> = saved ? JSON.parse(saved) : {};
      stores[settings.userId] = settings;
      if (settings.storeSlug) {
        stores[settings.storeSlug] = settings;
      }
      localStorage.setItem(STORAGE_USER_STORES_KEY, JSON.stringify(stores));

      // Optional background sync to Supabase
      (async () => {
        try {
          await supabase.from('UserStore').upsert({
            userId: settings.userId,
            storeSlug: settings.storeSlug,
            storeName: settings.storeName,
            tagline: settings.tagline,
            bio: settings.bio,
            themeColor: settings.themeColor,
            settingsJson: JSON.stringify(settings),
            updatedAt: new Date().toISOString(),
          });
        } catch {}
      })();
    } catch (e) {
      console.warn('[StoreEngine] Error saving store settings:', e);
    }
    return settings;
  },

  // Get Store Products (Both User Created and Curated from Marketplace)
  getStoreProducts(userId: string): Product[] {
    const settings = this.getStoreSettings(userId);
    const allProducts = marketplaceEngine.getProducts();

    // 1. Products created by this user
    const myCreated = allProducts.filter(p =>
      p.sellerId === settings.userId ||
      p.sellerName === settings.storeName ||
      p.seller === settings.storeName
    );

    // 2. Curated Marketplace Products
    const curated = allProducts.filter(p =>
      settings.curatedMarketplaceProductIds?.includes(p.id) &&
      !myCreated.some(m => m.id === p.id)
    );

    const combined = [...myCreated, ...curated];
    return combined.length > 0 ? combined : allProducts.slice(0, 4);
  },

  // Toggle product in curated store catalog
  toggleProductInStore(userId: string, productId: string): UserStoreSettings {
    const settings = this.getStoreSettings(userId);
    let curated = settings.curatedMarketplaceProductIds || [];
    if (curated.includes(productId)) {
      curated = curated.filter(id => id !== productId);
    } else {
      curated = [...curated, productId];
    }
    settings.curatedMarketplaceProductIds = curated;
    return this.saveStoreSettings(settings);
  },

  // Store Analytics / Views
  recordStoreView(storeIdOrSlug: string): void {
    try {
      const clean = storeIdOrSlug.toLowerCase();
      const raw = localStorage.getItem(STORAGE_STORE_STATS_KEY);
      const stats: Record<string, StoreStats> = raw ? JSON.parse(raw) : {};
      const current = stats[clean] || { viewsCount: 24, ordersCount: 0, revenueEarned: 0 };
      stats[clean] = {
        ...current,
        viewsCount: current.viewsCount + 1,
      };
      localStorage.setItem(STORAGE_STORE_STATS_KEY, JSON.stringify(stats));
    } catch {}
  },

  getStoreStats(storeIdOrSlug: string): StoreStats {
    try {
      const clean = storeIdOrSlug.toLowerCase();
      const raw = localStorage.getItem(STORAGE_STORE_STATS_KEY);
      if (raw) {
        const stats: Record<string, StoreStats> = JSON.parse(raw);
        if (stats[clean]) return stats[clean];
      }
    } catch {}
    return { viewsCount: 142, ordersCount: 8, revenueEarned: 392.00 };
  }
};
