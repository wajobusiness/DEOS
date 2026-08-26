import { Lead } from '../types';
import { supabase } from '../lib/supabaseClient';
import { crmEngine } from './crmEngine';

export interface WebsiteConfig {
  userId: string;
  subdomain: string;
  customDomain?: string;
  isDomainVerified?: boolean;
  sslStatus?: 'active' | 'pending' | 'unverified';
  published: boolean;
  branding: {
    siteTitle: string;
    tagline: string;
    logoUrl?: string;
    themeColor: 'indigo' | 'purple' | 'emerald' | 'rose' | 'amber' | 'blue';
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaAction: 'lead_form' | 'store' | 'register';
    videoUrl?: string;
    bgStyle: 'gradient' | 'dark' | 'glass';
  };
  leadForm: {
    enabled: boolean;
    headline: string;
    subhead: string;
    buttonText: string;
    fields: { name: boolean; email: boolean; phone: boolean; notes: boolean };
    successMessage: string;
  };
  benefits: Array<{ id: string; title: string; description: string; icon: string }>;
  videoSection: {
    enabled: boolean;
    title: string;
    description: string;
    embedUrl: string;
  };
  testimonials: Array<{ id: string; name: string; role: string; avatar: string; quote: string; rating: number }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImageUrl?: string;
  };
  tracking: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    tiktokPixelId?: string;
    linkedinInsightId?: string;
  };
  updatedAt: string;
}

const STORAGE_WEBSITES_KEY = 'eviona_user_websites_v3';
const STORAGE_CRM_LEADS_KEY = 'eviona_crm_leads_v2';

export const websiteBuilderEngine = {
  // 1. Get or Initialize User Website Configuration
  getWebsiteConfig(userId: string, userName?: string): WebsiteConfig {
    const cleanId = (userId || 'EVO-ID-100245').trim();
    try {
      const saved = localStorage.getItem(STORAGE_WEBSITES_KEY);
      if (saved) {
        const map: Record<string, WebsiteConfig> = JSON.parse(saved);
        if (map[cleanId]) return map[cleanId];
      }
    } catch (e) {
      console.warn('[WebsiteBuilderEngine] Error loading site config:', e);
    }

    const defaultName = userName || (cleanId.startsWith('EVO-ID-') ? `Member ${cleanId}` : cleanId);
    const cleanSubdomain = (userName || cleanId).toLowerCase().replace(/[^a-z0-9]/g, '') || 'mybusiness';

    const defaultConfig: WebsiteConfig = {
      userId: cleanId,
      subdomain: `${cleanSubdomain}.evionaecosystem.com`,
      customDomain: `${cleanSubdomain}agency.com`,
      isDomainVerified: true,
      sslStatus: 'active',
      published: true,
      branding: {
        siteTitle: `${defaultName}'s Digital Growth Center`,
        tagline: 'Scale Your Venture with High-Converting Digital Tools & Automation',
        logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        themeColor: 'indigo',
      },
      hero: {
        badge: 'Official Eviona Business Hub',
        headline: 'We Help Digital Entrepreneurs Build & Scale 6-Figure Ventures',
        subheadline: 'Access battle-tested marketing frameworks, automated sales funnels, and enterprise SaaS solutions designed for sustainable growth.',
        ctaText: 'Get Free Growth Blueprint',
        ctaAction: 'lead_form',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        bgStyle: 'gradient',
      },
      leadForm: {
        enabled: true,
        headline: 'Claim Your Free Growth Playbook & 1-on-1 Strategy Session',
        subhead: 'Enter your contact details below to get immediate access and join our private mentorship group.',
        buttonText: 'Get Instant Access Now',
        fields: { name: true, email: true, phone: true, notes: false },
        successMessage: 'Thank you! Your growth blueprint has been sent to your inbox.',
      },
      benefits: [
        { id: 'b1', title: 'Automated Revenue Systems', description: 'Plug-and-play sales funnels with built-in payment rails and CRM pipelines.', icon: 'Zap' },
        { id: 'b2', title: 'AI-Powered Growth Tools', description: '10,000+ marketing prompts and copywriting bots for rapid market execution.', icon: 'Bot' },
        { id: 'b3', title: 'Global Digital Storefront', description: 'Curated software and mastermind courses delivered instantly worldwide.', icon: 'Store' },
        { id: 'b4', title: 'Decentralized Compensation', description: 'Zero-lockup wallet settlements with instant P2P transfers and binary commissions.', icon: 'ShieldCheck' },
      ],
      videoSection: {
        enabled: true,
        title: 'Masterclass: How to Automate & Scale Your Digital Business',
        description: 'Watch this 12-minute breakdown on how entrepreneurs leverage our unified business center to generate recurring revenue.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      testimonials: [
        { id: 't1', name: 'Sarah Jenkins', role: 'Agency Founder', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', quote: 'This platform replaced 6 different monthly subscriptions. My team scaled from $4k to $28k MRR in 90 days.', rating: 5 },
        { id: 't2', name: 'Marcus Vance', role: 'Course Creator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', quote: 'The integrated store and instant affiliate engine mobilized over 200 promoters for my launch.', rating: 5 },
      ],
      faqs: [
        { id: 'f1', question: 'How do I get started with your digital tools?', answer: 'Simply fill out the form above to receive our starter kit and complete access to the member portal.' },
        { id: 'f2', question: 'Can I sell my own products on this website?', answer: 'Yes! Your website includes an integrated storefront where you can publish and sell digital templates, courses, and software.' },
        { id: 'f3', question: 'How are affiliate commissions paid out?', answer: 'All affiliate and product sales credit directly to your Eviona Wallet with instant 1:1 USD valuation.' },
      ],
      seo: {
        metaTitle: `${defaultName} — Digital Business Center & Store`,
        metaDescription: `Discover high-converting tools, templates, and courses by ${defaultName}. Instant digital delivery and mentorship.`,
        keywords: ['digital business', 'marketing automation', 'eviona store', 'affiliate network'],
      },
      tracking: {
        googleAnalyticsId: 'G-EVIONA9281',
        facebookPixelId: '109283749102938',
        tiktokPixelId: 'C98127391823',
      },
      updatedAt: new Date().toISOString(),
    };

    this.saveWebsiteConfig(defaultConfig);
    return defaultConfig;
  },

  // 2. Save User Website Configuration
  saveWebsiteConfig(config: WebsiteConfig): WebsiteConfig {
    try {
      const saved = localStorage.getItem(STORAGE_WEBSITES_KEY);
      const map: Record<string, WebsiteConfig> = saved ? JSON.parse(saved) : {};
      map[config.userId] = {
        ...config,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_WEBSITES_KEY, JSON.stringify(map));

      // Optional background sync to Supabase
      (async () => {
        try {
          await supabase.from('UserWebsite').upsert({
            userId: config.userId,
            subdomain: config.subdomain,
            customDomain: config.customDomain,
            configJson: JSON.stringify(config),
            published: config.published,
            updatedAt: new Date().toISOString(),
          });
        } catch {}
      })();
    } catch (e) {
      console.warn('[WebsiteBuilderEngine] Error saving website config:', e);
    }
    return config;
  },

  // 3. Real Lead Capture & Direct CRM Ingestion Workflow
  async captureLead(data: {
    websiteOwnerId: string;
    websiteOwnerName?: string;
    name: string;
    email: string;
    phone: string;
    notes?: string;
    campaignSource?: string;
  }): Promise<{ success: boolean; lead: Lead; message: string }> {
    const { websiteOwnerId, websiteOwnerName, name, email, phone, notes, campaignSource } = data;

    if (!name.trim() || !email.trim()) {
      throw new Error('Name and email are required to claim this blueprint.');
    }

    const newLead = crmEngine.addLead({
      ownerId: websiteOwnerId,
      ownerName: websiteOwnerName || 'Member',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: 'Landing Page Lead',
      source: campaignSource ? `Landing Page Form (${campaignSource})` : 'Personal Landing Page Lead Form',
      status: 'New',
      stage: 'New',
      dealValue: 2500,
    });

    return {
      success: true,
      lead: newLead,
      message: `Success! Welcome ${name.trim()}, your growth blueprint has been sent.`,
    };
  },

  // 4. Get Captured Leads for a specific website owner
  getWebsiteLeads(websiteOwnerId: string): Lead[] {
    return crmEngine.getMemberLeads(websiteOwnerId);
  },

  // 5. Custom Domain Verification Simulator
  verifyCustomDomain(domainName: string): { verified: boolean; ssl: 'active' | 'pending'; cnameTarget: string } {
    const cleanDomain = domainName.trim().toLowerCase();
    const isValid = cleanDomain.includes('.') && !cleanDomain.includes(' ');
    return {
      verified: isValid,
      ssl: isValid ? 'active' : 'pending',
      cnameTarget: 'cname.evionaecosystem.com',
    };
  },

  // 6. Hostname-to-Tenant Dynamic Domain Resolver (Book 6 §2 & §7)
  resolveDomain(rawHostname: string): { isTenantDomain: boolean; userId: string; isCustomDomain: boolean } | null {
    if (!rawHostname) return null;
    const hostname = rawHostname.toLowerCase().trim();

    const platformHosts = [
      'localhost',
      '127.0.0.1',
      'evionaecosystem.com',
      'www.evionaecosystem.com',
      'deos.com',
      'www.deos.com',
      'app.evionaecosystem.com',
      'app.deos.com',
      'api.evionaecosystem.com',
      'api.deos.com',
      'admin.evionaecosystem.com',
    ];
    if (platformHosts.includes(hostname)) return null;

    if (hostname.endsWith('.evionaecosystem.com') || hostname.endsWith('.deos.com')) {
      const parts = hostname.split('.');
      const sub = parts[0];
      if (sub && !['app', 'api', 'admin', 'www', 'cname'].includes(sub)) {
        return { isTenantDomain: true, userId: sub, isCustomDomain: false };
      }
      return null;
    }

    try {
      const saved = localStorage.getItem(STORAGE_WEBSITES_KEY);
      if (saved) {
        const map: Record<string, WebsiteConfig> = JSON.parse(saved);
        for (const [uid, config] of Object.entries(map)) {
          if (
            config.customDomain &&
            (config.customDomain.toLowerCase() === hostname ||
              `www.${config.customDomain.toLowerCase()}` === hostname ||
              config.customDomain.toLowerCase() === `www.${hostname}`)
          ) {
            return { isTenantDomain: true, userId: uid, isCustomDomain: true };
          }
        }
      }
    } catch {}

    return { isTenantDomain: true, userId: hostname, isCustomDomain: true };
  }
};
