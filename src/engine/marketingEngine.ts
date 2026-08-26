import { Lead, SellerOrder } from '../types';
import { supabase } from '../lib/supabaseClient';
import { marketplaceEngine } from './marketplaceEngine';
import { crmEngine } from './crmEngine';

export interface TrackingPixelsConfig {
  metaPixelId: string;
  metaCapiToken?: string;
  ga4MeasurementId: string;
  gtmContainerId?: string;
  googleAdsId?: string;
  tiktokPixelId: string;
  tiktokApiToken?: string;
  linkedinTagId?: string;
  snapchatPixelId?: string;
}

export interface MarketingCampaign {
  id: string;
  userId?: string;
  name: string;
  channel: 'meta' | 'google' | 'tiktok' | 'whatsapp' | 'email' | 'twitter' | 'youtube';
  targetUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  fullCampaignUrl: string;
  clicks: number;
  leadsGenerated: number;
  salesGenerated: number;
  revenue: number;
  createdAt: string;
}

export interface PromoSwipeFile {
  id: string;
  category: 'whatsapp' | 'email' | 'social_post' | 'sms' | 'ad_script';
  title: string;
  description: string;
  content: string; // contains {{REF_LINK}} and {{USER_NAME}}
}

function getUserMarketingKey(userId: string | undefined, suffix: 'pixels' | 'campaigns'): string {
  const cleanId = (userId || 'EVO-ID-100245').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `eviona_user_${cleanId}_marketing_${suffix}`;
}

export const INITIAL_SWIPE_FILES: PromoSwipeFile[] = [
  {
    id: 'swp-01',
    category: 'whatsapp',
    title: 'WhatsApp Viral Launch Broadcast',
    description: 'Send to warm contacts, broadcast lists, and business mastermind groups.',
    content: `🔥 Big Announcement! I just launched my official digital business center and marketplace on Eviona.\n\nI’ve put together premium AI tools, high-converting templates, and growth courses with instant access.\n\nCheck out my official store & claim your access here:\n👉 {{REF_LINK}}\n\nLet me know what you think! 🚀`,
  },
  {
    id: 'swp-02',
    category: 'email',
    title: 'Email: The 1-Platform Business OS Solution',
    description: 'High-converting email newsletter swipe for email list broadcasts.',
    content: `Subject: Stop paying $500/month for 7 different software tools...\n\nHey,\n\nIf you've been trying to build an online business, you know the pain: one tool for your website, another for CRM, another for email automation, another for courses, and another for affiliate tracking.\n\nI just migrated everything to Eviona Ecosystem — a unified Business OS that gives you:\n✓ Instant Branded Website & Storefront\n✓ Built-in CRM Pipeline\n✓ 10,000+ AI Prompts & Marketing Assistants\n✓ 10% Binary & 40% Affiliate Commissions\n\nTake a look at my storefront and see how it works:\n👉 {{REF_LINK}}\n\nBest regards,\n{{USER_NAME}}`,
  },
  {
    id: 'swp-03',
    category: 'social_post',
    title: 'Twitter / LinkedIn High-Engagement Post',
    description: 'Hook-based organic social copy designed for maximum shares and clicks.',
    content: `Most entrepreneurs fail because they spend 80% of their time gluing software tools together instead of selling.\n\nHere is how I automated my digital storefront, CRM, and AI copywriter under one roof:\n\n1. Launch your verified storefront\n2. Curate 1-click digital products with 40% commissions\n3. Deploy automated lead capture funnels\n\nExplore my official digital hub:\n{{REF_LINK}}\n\n#Entrepreneurship #Automation #SaaS #AI`,
  },
  {
    id: 'swp-04',
    category: 'sms',
    title: 'SMS Short Blast (160 Chars)',
    description: 'High open-rate SMS message for quick follow-ups.',
    content: `Hey! Check out my new official digital business center & exclusive courses here: {{REF_LINK}} - {{USER_NAME}}`,
  }
];

export const marketingEngine = {
  // 1. Get Tracking Pixels Configuration (Tenant Scoped)
  getTrackingPixels(userId?: string): TrackingPixelsConfig {
    const key = getUserMarketingKey(userId, 'pixels');
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    const defaults: TrackingPixelsConfig = {
      metaPixelId: '',
      metaCapiToken: '',
      ga4MeasurementId: '',
      gtmContainerId: '',
      googleAdsId: '',
      tiktokPixelId: '',
      tiktokApiToken: '',
      linkedinTagId: '',
      snapchatPixelId: '',
    };
    return defaults;
  },

  // 2. Save Tracking Pixels Configuration
  saveTrackingPixels(userId: string | undefined, pixels: TrackingPixelsConfig): TrackingPixelsConfig {
    const key = getUserMarketingKey(userId, 'pixels');
    try {
      localStorage.setItem(key, JSON.stringify(pixels));
      (async () => {
        try {
          await supabase.from('MarketingSettings').upsert({
            userId: userId || 'EVO-ID-100245',
            configJson: JSON.stringify(pixels),
            updatedAt: new Date().toISOString(),
          });
        } catch {}
      })();
    } catch {}
    return pixels;
  },

  // 3. Get Tracking Campaigns (Tenant Scoped)
  getCampaigns(userId?: string): MarketingCampaign[] {
    const key = getUserMarketingKey(userId, 'campaigns');
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const list: MarketingCampaign[] = JSON.parse(saved);
        if (Array.isArray(list)) return list;
      }
    } catch {}

    return [];
  },

  // 4. Create New Tracking Campaign Link
  createCampaign(data: {
    userId?: string;
    name: string;
    channel: MarketingCampaign['channel'];
    baseUrl: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  }): MarketingCampaign {
    const separator = data.baseUrl.includes('?') ? '&' : '?';
    const fullUrl = `${data.baseUrl}${separator}utm_source=${encodeURIComponent(data.utmSource)}&utm_medium=${encodeURIComponent(data.utmMedium)}&utm_campaign=${encodeURIComponent(data.utmCampaign)}`;

    const newCampaign: MarketingCampaign = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      userId: data.userId,
      name: data.name.trim(),
      channel: data.channel,
      targetUrl: data.baseUrl,
      utmSource: data.utmSource.trim(),
      utmMedium: data.utmMedium.trim(),
      utmCampaign: data.utmCampaign.trim(),
      fullCampaignUrl: fullUrl,
      clicks: 0,
      leadsGenerated: 0,
      salesGenerated: 0,
      revenue: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const current = this.getCampaigns(data.userId);
    const updated = [newCampaign, ...current];
    const key = getUserMarketingKey(data.userId, 'campaigns');
    localStorage.setItem(key, JSON.stringify(updated));
    return newCampaign;
  },

  // 5. Get Real Marketing Intelligence KPI metrics
  getMarketingMetrics(userId?: string) {
    if (!userId) {
      return {
        totalVisitors: 0,
        leadsCaptured: 0,
        totalSales: 0,
        revenueGenerated: 0,
        conversionRate: '0.0%',
        bestTrafficSource: 'None yet',
      };
    }

    const orders: SellerOrder[] = marketplaceEngine.getSellerOrders(userId);
    const leads = crmEngine.getMemberLeads(userId);
    const totalLeadsCount = leads.length;

    const campaigns = this.getCampaigns(userId);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
    const totalSalesCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.netSellerEarned, 0);
    const conversionRate = totalClicks > 0 ? ((totalLeadsCount / totalClicks) * 100).toFixed(1) : totalLeadsCount > 0 ? '100.0' : '0.0';

    return {
      totalVisitors: totalClicks,
      leadsCaptured: totalLeadsCount,
      totalSales: totalSalesCount,
      revenueGenerated: totalRevenue,
      conversionRate: `${conversionRate}%`,
      bestTrafficSource: campaigns.length > 0 ? `${campaigns[0].name} (${campaigns[0].channel.toUpperCase()})` : 'Direct Link',
    };
  },

  // 6. AI Ad Copy Generator
  generateAdCopy(prompt: { niche: string; platform: string; offer: string }) {
    const { niche, platform, offer } = prompt;
    const cleanNiche = niche.trim() || 'Digital Business & AI Automation';

    return {
      headline: `Stop Wasting Time on Disconnected Tools. Scale Your ${cleanNiche} Fast.`,
      bodyCopy: `Are you tired of paying $400+/month for 6 different subscriptions? With Eviona Ecosystem, you get your branded storefront, CRM pipelines, AI copywriter, and 40% affiliate commissions under ONE roof.\n\n⚡ Instant digital delivery\n⚡ Automated follow-up sequences\n⚡ 10% binary network overrides`,
      ctaText: 'Claim Your Free Tour Now',
      targetAudience: `Entrepreneurs, Agency Founders, Affiliate Marketers (Ages 24-55)`,
      suggestedBudget: '$15 - $35 / day',
    };
  }
};
