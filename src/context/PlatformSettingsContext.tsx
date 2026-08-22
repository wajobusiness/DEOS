import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlatformBrandingSettings,
  PlatformThemeSettings,
  HomepageContentSettings,
  DashboardConfigSettings,
  NavigationMenuConfig,
  SystemFeatureSettings,
  ViewType,
} from '../types';
import { supabase } from '../lib/supabaseClient';

export interface PlatformSettingsState {
  branding: PlatformBrandingSettings;
  theme: PlatformThemeSettings;
  homepage: HomepageContentSettings;
  dashboard: DashboardConfigSettings;
  navigation: NavigationMenuConfig;
  features: SystemFeatureSettings;
  updateBranding: (branding: Partial<PlatformBrandingSettings>) => Promise<void>;
  updateTheme: (theme: Partial<PlatformThemeSettings>) => Promise<void>;
  updateHomepage: (homepage: Partial<HomepageContentSettings>) => Promise<void>;
  updateDashboard: (dashboard: Partial<DashboardConfigSettings>) => Promise<void>;
  updateNavigation: (navigation: Partial<NavigationMenuConfig>) => Promise<void>;
  updateFeatures: (features: Partial<SystemFeatureSettings>) => Promise<void>;
  resetToDefaults: () => void;
}

const DEFAULT_BRANDING: PlatformBrandingSettings = {
  platformName: 'Eviona Ecosystem',
  tagline: 'The Digital Entrepreneurship Operating System',
  logoUrl: '',
  darkLogoUrl: '',
  lightLogoUrl: '',
  faviconUrl: '',
  companyName: 'Eviona Global Technologies Inc.',
  supportEmail: 'support@eviona.com',
  supportPhone: '+1 (800) 555-EVIONA',
  copyrightText: '© 2026 Eviona Ecosystem. All rights reserved.',
  defaultCurrency: 'USD',
  defaultLanguage: 'en',
  timezone: 'UTC',
  socialLinks: {
    twitter: 'https://twitter.com/eviona_eco',
    telegram: 'https://t.me/eviona_official',
    discord: 'https://discord.gg/eviona',
    youtube: 'https://youtube.com/@eviona',
  },
};

const DEFAULT_THEME: PlatformThemeSettings = {
  primaryColor: '#4F46E5', // Indigo-600
  secondaryColor: '#9333EA', // Purple-600
  accentColor: '#10B981', // Emerald-500
  fontFamily: 'Inter, sans-serif',
  borderRadius: '16px',
  darkModeDefault: true,
  buttonStyle: 'rounded',
};

const DEFAULT_HOMEPAGE: HomepageContentSettings = {
  heroBadge: '⭐ Eviona Ecosystem v2.5',
  heroHeadline: 'The All-In-One Digital Entrepreneurship',
  heroHighlightText: 'Operating System',
  heroSubtitle:
    'Deploy your personal website, automate lead capture funnels, sell on the global digital marketplace, and scale with our 10% flat binary network architecture.',
  heroCtaText: 'Launch Your Business in 60 Seconds',
  heroVideoUrl: 'https://youtu.be/Td8gmK7HrS4',
  announcementBanner: {
    enabled: true,
    text: '🚀 Eviona Ecosystem Live: EVO Utility Token & Instant Stripe / USDT TRC20 Gateway Active.',
    link: '#pricing',
  },
  stats: {
    activeUsers: '50K+',
    productsCount: '15,000+',
    totalPaidCommissions: '$1.4M+',
    uptimePercentage: '99.99%',
  },
  faqList: [
    {
      q: 'What is the Eviona Ecosystem?',
      a: 'Eviona Ecosystem is the complete all-in-one infrastructure uniting multi-tenant personal websites, CRM funnels, a digital marketplace, AI business tools, academy masterclasses, and an immutable 10% binary compensation network.',
    },
    {
      q: 'How does the 10% Flat Binary Commission work?',
      a: 'Under the binary compensation engine, you earn a flat 10% commission on your weaker-leg Business Volume (BV) every weekly settlement cycle, with all un-matched volume carried forward indefinitely. No arbitrary flushing or structural penalizations.',
    },
    {
      q: 'Can non-members buy from the Marketplace?',
      a: 'Yes! Eviona Marketplace is open to public traffic. Any customer can purchase digital goods or services via guest checkout, with promoter commissions and 3% upline overrides automatically routed to referring members.',
    },
    {
      q: 'What is EVO Token?',
      a: 'EVO is the utility token powering the Eviona Ecosystem, enabling transactions and future digital economy features within the platform.',
    },
    {
      q: 'Do I get a website and domain when I register?',
      a: 'Yes. Upon account creation, your personalized website (username.eviona.com) is provisioned instantly, along with DNS configuration tools to connect your custom domain with free automatic SSL.',
    },
  ],
};

const DEFAULT_DASHBOARD: DashboardConfigSettings = {
  welcomeHeadline: 'Good morning, {name}! 👋',
  welcomeSubtitle: 'Your digital business workspace is fully synchronized and operational.',
  announcementBar: {
    enabled: false,
    text: '⚡ System Notice: Weekly binary commission settlement runs every Sunday at 23:59 UTC.',
    severity: 'info',
  },
};

const DEFAULT_NAVIGATION: NavigationMenuConfig = {
  enabledViews: {
    dashboard: true,
    wallet: true,
    binary: true,
    partner: true,
    marketplace: true,
    sellers: true,
    academy: true,
    builder: true,
    domains: true,
    crm: true,
    'ai-center': true,
    marketing: true,
    analytics: true,
    events: true,
    team: true,
    settings: true,
    support: true,
  },
};

const DEFAULT_FEATURES: SystemFeatureSettings = {
  maintenanceMode: false,
  registrationOpen: true,
  withdrawalsEnabled: true,
  binaryEngineActive: true,
  marketplaceSellingEnabled: true,
  aiCenterEnabled: true,
  defaultCoinRateUsd: 1.0,
};

const STORAGE_KEY = 'eviona_platform_settings_v3';

const PlatformSettingsContext = createContext<PlatformSettingsState | undefined>(undefined);

export const PlatformSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<PlatformBrandingSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_branding`);
      return saved ? { ...DEFAULT_BRANDING, ...JSON.parse(saved) } : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  });

  const [theme, setTheme] = useState<PlatformThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [homepage, setHomepage] = useState<HomepageContentSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_homepage`);
      return saved ? { ...DEFAULT_HOMEPAGE, ...JSON.parse(saved) } : DEFAULT_HOMEPAGE;
    } catch {
      return DEFAULT_HOMEPAGE;
    }
  });

  const [dashboard, setDashboard] = useState<DashboardConfigSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_dashboard`);
      return saved ? { ...DEFAULT_DASHBOARD, ...JSON.parse(saved) } : DEFAULT_DASHBOARD;
    } catch {
      return DEFAULT_DASHBOARD;
    }
  });

  const [navigation, setNavigation] = useState<NavigationMenuConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_navigation`);
      return saved ? { ...DEFAULT_NAVIGATION, ...JSON.parse(saved) } : DEFAULT_NAVIGATION;
    } catch {
      return DEFAULT_NAVIGATION;
    }
  });

  const [features, setFeatures] = useState<SystemFeatureSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_features`);
      return saved ? { ...DEFAULT_FEATURES, ...JSON.parse(saved) } : DEFAULT_FEATURES;
    } catch {
      return DEFAULT_FEATURES;
    }
  });

  // Inject Theme CSS variables into Document Root
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.style.setProperty('--eviona-primary', theme.primaryColor);
      root.style.setProperty('--eviona-secondary', theme.secondaryColor);
      root.style.setProperty('--eviona-accent', theme.accentColor);
      root.style.setProperty('--eviona-radius', theme.borderRadius);
      root.style.setProperty('--deos-primary', theme.primaryColor);
      root.style.setProperty('--deos-secondary', theme.secondaryColor);
      root.style.setProperty('--deos-accent', theme.accentColor);
      root.style.setProperty('--deos-radius', theme.borderRadius);
    } catch (e) {
      console.warn('CSS variable injection note:', e);
    }
  }, [theme]);

  // Load from Supabase Database on mount
  useEffect(() => {
    async function loadSettingsFromDatabase() {
      try {
        const { data, error } = await supabase
          .from('PlatformSetting')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (data && !error && data.config) {
          const cfg = typeof data.config === 'string' ? JSON.parse(data.config) : data.config;
          if (cfg.branding) setBranding((prev) => ({ ...prev, ...cfg.branding }));
          if (cfg.theme) setTheme((prev) => ({ ...prev, ...cfg.theme }));
          if (cfg.homepage) setHomepage((prev) => ({ ...prev, ...cfg.homepage }));
          if (cfg.dashboard) setDashboard((prev) => ({ ...prev, ...cfg.dashboard }));
          if (cfg.navigation) setNavigation((prev) => ({ ...prev, ...cfg.navigation }));
          if (cfg.features) setFeatures((prev) => ({ ...prev, ...cfg.features }));
        }
      } catch (err) {
        console.warn('PlatformSetting table sync note:', err);
      }
    }
    loadSettingsFromDatabase();
  }, []);

  const persistToDatabase = async (newConfig: any) => {
    try {
      await supabase.from('PlatformSetting').upsert({
        id: 'global_config',
        config: newConfig,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Settings database persistence notice:', e);
    }
  };

  const updateBranding = async (newBranding: Partial<PlatformBrandingSettings>) => {
    const updated = { ...branding, ...newBranding };
    setBranding(updated);
    localStorage.setItem(`${STORAGE_KEY}_branding`, JSON.stringify(updated));
    await persistToDatabase({ branding: updated, theme, homepage, dashboard, navigation, features });
  };

  const updateTheme = async (newTheme: Partial<PlatformThemeSettings>) => {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);
    localStorage.setItem(`${STORAGE_KEY}_theme`, JSON.stringify(updated));
    await persistToDatabase({ branding, theme: updated, homepage, dashboard, navigation, features });
  };

  const updateHomepage = async (newHomepage: Partial<HomepageContentSettings>) => {
    const updated = { ...homepage, ...newHomepage };
    setHomepage(updated);
    localStorage.setItem(`${STORAGE_KEY}_homepage`, JSON.stringify(updated));
    await persistToDatabase({ branding, theme, homepage: updated, dashboard, navigation, features });
  };

  const updateDashboard = async (newDashboard: Partial<DashboardConfigSettings>) => {
    const updated = { ...dashboard, ...newDashboard };
    setDashboard(updated);
    localStorage.setItem(`${STORAGE_KEY}_dashboard`, JSON.stringify(updated));
    await persistToDatabase({ branding, theme, homepage, dashboard: updated, navigation, features });
  };

  const updateNavigation = async (newNavigation: Partial<NavigationMenuConfig>) => {
    const updated = { ...navigation, ...newNavigation };
    setNavigation(updated);
    localStorage.setItem(`${STORAGE_KEY}_navigation`, JSON.stringify(updated));
    await persistToDatabase({ branding, theme, homepage, dashboard, navigation: updated, features });
  };

  const updateFeatures = async (newFeatures: Partial<SystemFeatureSettings>) => {
    const updated = { ...features, ...newFeatures };
    setFeatures(updated);
    localStorage.setItem(`${STORAGE_KEY}_features`, JSON.stringify(updated));
    await persistToDatabase({ branding, theme, homepage, dashboard, navigation, features: updated });
  };

  const resetToDefaults = () => {
    setBranding(DEFAULT_BRANDING);
    setTheme(DEFAULT_THEME);
    setHomepage(DEFAULT_HOMEPAGE);
    setDashboard(DEFAULT_DASHBOARD);
    setNavigation(DEFAULT_NAVIGATION);
    setFeatures(DEFAULT_FEATURES);
    localStorage.removeItem(`${STORAGE_KEY}_branding`);
    localStorage.removeItem(`${STORAGE_KEY}_theme`);
    localStorage.removeItem(`${STORAGE_KEY}_homepage`);
    localStorage.removeItem(`${STORAGE_KEY}_dashboard`);
    localStorage.removeItem(`${STORAGE_KEY}_navigation`);
    localStorage.removeItem(`${STORAGE_KEY}_features`);
  };

  return (
    <PlatformSettingsContext.Provider
      value={{
        branding,
        theme,
        homepage,
        dashboard,
        navigation,
        features,
        updateBranding,
        updateTheme,
        updateHomepage,
        updateDashboard,
        updateNavigation,
        updateFeatures,
        resetToDefaults,
      }}
    >
      {children}
    </PlatformSettingsContext.Provider>
  );
};

export const usePlatformSettings = () => {
  const context = useContext(PlatformSettingsContext);
  if (!context) {
    throw new Error('usePlatformSettings must be used within a PlatformSettingsProvider');
  }
  return context;
};
