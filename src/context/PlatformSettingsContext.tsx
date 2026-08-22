import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlatformBrandingSettings,
  PlatformThemeSettings,
  HomepageContentSettings,
  SystemFeatureSettings,
} from '../types';
import { supabase } from '../lib/supabaseClient';

export interface PlatformSettingsState {
  branding: PlatformBrandingSettings;
  theme: PlatformThemeSettings;
  homepage: HomepageContentSettings;
  features: SystemFeatureSettings;
  updateBranding: (branding: Partial<PlatformBrandingSettings>) => Promise<void>;
  updateTheme: (theme: Partial<PlatformThemeSettings>) => Promise<void>;
  updateHomepage: (homepage: Partial<HomepageContentSettings>) => Promise<void>;
  updateFeatures: (features: Partial<SystemFeatureSettings>) => Promise<void>;
  resetToDefaults: () => void;
}

const DEFAULT_BRANDING: PlatformBrandingSettings = {
  platformName: 'DEOS',
  tagline: 'Digital Entrepreneurship Operating System',
  logoUrl: '',
  faviconUrl: '',
  companyName: 'DEOS Global Technologies Inc.',
  supportEmail: 'support@deos.com',
  supportPhone: '+1 (800) 555-DEOS',
  copyrightText: '© 2026 DEOS Operating System. All rights reserved.',
  socialLinks: {
    twitter: 'https://twitter.com/deos_os',
    telegram: 'https://t.me/deos_official',
    discord: 'https://discord.gg/deos',
    youtube: 'https://youtube.com/@deos',
  },
};

const DEFAULT_THEME: PlatformThemeSettings = {
  primaryColor: '#4F46E5', // Indigo-600
  secondaryColor: '#9333EA', // Purple-600
  accentColor: '#10B981', // Emerald-500
  fontFamily: 'Inter, sans-serif',
  borderRadius: '16px',
  darkModeDefault: true,
};

const DEFAULT_HOMEPAGE: HomepageContentSettings = {
  heroBadge: '⭐ Multi-Tenant Business Infrastructure v2.5',
  heroHeadline: 'The All-In-One Digital Entrepreneurship',
  heroHighlightText: 'Operating System',
  heroSubtitle:
    'Deploy your personal website, automate lead capture funnels, sell on the global digital marketplace, and scale with our 10% flat binary network architecture.',
  heroCtaText: 'Launch Your Business in 60 Seconds',
  heroVideoUrl: 'https://youtu.be/Td8gmK7HrS4',
  announcementBanner: {
    enabled: true,
    text: '🚀 DEOS 2.0 Live: Model A Fixed Utility Coin & Instant Stripe / USDT TRC20 Gateway Active.',
    link: '#pricing',
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

const STORAGE_KEY = 'deos_platform_settings_v1';

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

  const [features, setFeatures] = useState<SystemFeatureSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_features`);
      return saved ? { ...DEFAULT_FEATURES, ...JSON.parse(saved) } : DEFAULT_FEATURES;
    } catch {
      return DEFAULT_FEATURES;
    }
  });

  // Sync settings to database on initial load
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
          if (cfg.branding) setBranding(prev => ({ ...prev, ...cfg.branding }));
          if (cfg.theme) setTheme(prev => ({ ...prev, ...cfg.theme }));
          if (cfg.homepage) setHomepage(prev => ({ ...prev, ...cfg.homepage }));
          if (cfg.features) setFeatures(prev => ({ ...prev, ...cfg.features }));
        }
      } catch (err) {
        console.warn('PlatformSetting table sync note:', err);
      }
    }
    loadSettingsFromDatabase();
  }, []);

  const updateBranding = async (newBranding: Partial<PlatformBrandingSettings>) => {
    const updated = { ...branding, ...newBranding };
    setBranding(updated);
    localStorage.setItem(`${STORAGE_KEY}_branding`, JSON.stringify(updated));

    try {
      await supabase.from('PlatformSetting').upsert({
        id: 'global_config',
        config: { branding: updated, theme, homepage, features },
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Settings persist notice:', e);
    }
  };

  const updateTheme = async (newTheme: Partial<PlatformThemeSettings>) => {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);
    localStorage.setItem(`${STORAGE_KEY}_theme`, JSON.stringify(updated));

    try {
      await supabase.from('PlatformSetting').upsert({
        id: 'global_config',
        config: { branding, theme: updated, homepage, features },
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Settings persist notice:', e);
    }
  };

  const updateHomepage = async (newHomepage: Partial<HomepageContentSettings>) => {
    const updated = { ...homepage, ...newHomepage };
    setHomepage(updated);
    localStorage.setItem(`${STORAGE_KEY}_homepage`, JSON.stringify(updated));

    try {
      await supabase.from('PlatformSetting').upsert({
        id: 'global_config',
        config: { branding, theme, homepage: updated, features },
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Settings persist notice:', e);
    }
  };

  const updateFeatures = async (newFeatures: Partial<SystemFeatureSettings>) => {
    const updated = { ...features, ...newFeatures };
    setFeatures(updated);
    localStorage.setItem(`${STORAGE_KEY}_features`, JSON.stringify(updated));

    try {
      await supabase.from('PlatformSetting').upsert({
        id: 'global_config',
        config: { branding, theme, homepage, features: updated },
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Settings persist notice:', e);
    }
  };

  const resetToDefaults = () => {
    setBranding(DEFAULT_BRANDING);
    setTheme(DEFAULT_THEME);
    setHomepage(DEFAULT_HOMEPAGE);
    setFeatures(DEFAULT_FEATURES);
    localStorage.removeItem(`${STORAGE_KEY}_branding`);
    localStorage.removeItem(`${STORAGE_KEY}_theme`);
    localStorage.removeItem(`${STORAGE_KEY}_homepage`);
    localStorage.removeItem(`${STORAGE_KEY}_features`);
  };

  return (
    <PlatformSettingsContext.Provider
      value={{
        branding,
        theme,
        homepage,
        features,
        updateBranding,
        updateTheme,
        updateHomepage,
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
