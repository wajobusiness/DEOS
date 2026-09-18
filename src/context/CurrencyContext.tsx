import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
  countryCode: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2, countryCode: 'US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2, countryCode: 'EU' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2, countryCode: 'GB' },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', decimals: 0, countryCode: 'NG' },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', decimals: 2, countryCode: 'GH' },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', decimals: 0, countryCode: 'KE' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', decimals: 2, countryCode: 'ZA' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', decimals: 2, countryCode: 'CA' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', decimals: 2, countryCode: 'AU' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', decimals: 2, countryCode: 'IN' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', decimals: 2, countryCode: 'AE' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0, countryCode: 'JP' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', decimals: 2, countryCode: 'BR' },
  USDT: { code: 'USDT', name: 'Tether USD', symbol: '₮', flag: '🟢', decimals: 2, countryCode: 'US' },
};

// Robust baseline fallback exchange rates vs 1 USD
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1650.0,
  GHS: 15.5,
  KES: 130.0,
  ZAR: 18.2,
  CAD: 1.36,
  AUD: 1.52,
  INR: 83.5,
  AED: 3.67,
  JPY: 155.0,
  BRL: 5.45,
  USDT: 1.0,
};

// Country code to primary currency mapping
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  NG: 'NGN',
  GH: 'GHS',
  KE: 'KES',
  ZA: 'ZAR',
  CA: 'CAD',
  AU: 'AUD',
  IN: 'INR',
  AE: 'AED',
  JP: 'JPY',
  BR: 'BRL',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
};

// Country details
export interface DetectedGeo {
  countryCode: string;
  countryName: string;
  city?: string;
  currency: string;
  flag: string;
  isAutoDetected: boolean;
}

interface CurrencyContextType {
  currency: string;
  currencyConfig: CurrencyConfig;
  rates: Record<string, number>;
  geo: DetectedGeo;
  isLoadingRates: boolean;
  setCurrency: (code: string) => void;
  setCountry: (countryCode: string) => void;
  formatPrice: (usdAmount: number, overrideCurrency?: string) => string;
  convertAmount: (usdAmount: number, targetCurrency?: string) => number;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('eviona_preferred_currency');
      if (saved && SUPPORTED_CURRENCIES[saved]) return saved;
    } catch {}
    return 'USD';
  });

  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  const [geo, setGeo] = useState<DetectedGeo>(() => {
    try {
      const savedGeo = localStorage.getItem('eviona_geo_info');
      if (savedGeo) {
        return JSON.parse(savedGeo);
      }
    } catch {}

    return {
      countryCode: 'US',
      countryName: 'United States',
      currency: 'USD',
      flag: '🇺🇸',
      isAutoDetected: false,
    };
  });

  // Fetch Live Rates from open exchange API
  const refreshRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD', {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates) {
          const newRates: Record<string, number> = { ...FALLBACK_RATES };
          Object.keys(SUPPORTED_CURRENCIES).forEach((curr) => {
            if (curr === 'USDT' || curr === 'USD') {
              newRates[curr] = 1.0;
            } else if (data.rates[curr]) {
              newRates[curr] = data.rates[curr];
            }
          });
          setRates(newRates);
          try {
            localStorage.setItem('eviona_cached_rates', JSON.stringify(newRates));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Currency exchange rate fetch fallback to local matrix:', err);
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Auto-detect Country & Currency on load
  useEffect(() => {
    // 1. Check cached rates
    try {
      const cached = localStorage.getItem('eviona_cached_rates');
      if (cached) {
        setRates(prev => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch {}

    // 2. Refresh live rates
    refreshRates();

    // 3. Auto Geo-Lookup if not manually set by user
    const hasManualGeo = localStorage.getItem('eviona_manual_geo_override');
    if (!hasManualGeo) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      fetch('https://ipapi.co/json/', { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          clearTimeout(timeoutId);
          if (data && data.country_code) {
            const countryCode = data.country_code.toUpperCase();
            const matchedCurrency = COUNTRY_TO_CURRENCY[countryCode] || data.currency || 'USD';
            const validCurrency = SUPPORTED_CURRENCIES[matchedCurrency] ? matchedCurrency : 'USD';
            const flag = SUPPORTED_CURRENCIES[validCurrency]?.flag || '🌐';

            const detected: DetectedGeo = {
              countryCode,
              countryName: data.country_name || countryCode,
              city: data.city,
              currency: validCurrency,
              flag,
              isAutoDetected: true,
            };

            setGeo(detected);
            setCurrencyState(validCurrency);
            try {
              localStorage.setItem('eviona_geo_info', JSON.stringify(detected));
              localStorage.setItem('eviona_preferred_currency', validCurrency);
            } catch {}
          }
        })
        .catch(() => {
          // Fallback to Intl Timezone detection
          try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timeZone.includes('Lagos') || timeZone.includes('Africa/Lagos')) {
              setGeo({ countryCode: 'NG', countryName: 'Nigeria', currency: 'NGN', flag: '🇳🇬', isAutoDetected: true });
              setCurrencyState('NGN');
            } else if (timeZone.includes('London') || timeZone.includes('Europe/London')) {
              setGeo({ countryCode: 'GB', countryName: 'United Kingdom', currency: 'GBP', flag: '🇬🇧', isAutoDetected: true });
              setCurrencyState('GBP');
            } else if (timeZone.includes('Accra')) {
              setGeo({ countryCode: 'GH', countryName: 'Ghana', currency: 'GHS', flag: '🇬🇭', isAutoDetected: true });
              setCurrencyState('GHS');
            } else if (timeZone.includes('Nairobi')) {
              setGeo({ countryCode: 'KE', countryName: 'Kenya', currency: 'KES', flag: '🇰🇪', isAutoDetected: true });
              setCurrencyState('KES');
            } else if (timeZone.includes('Johannesburg')) {
              setGeo({ countryCode: 'ZA', countryName: 'South Africa', currency: 'ZAR', flag: '🇿🇦', isAutoDetected: true });
              setCurrencyState('ZAR');
            } else if (timeZone.includes('Paris') || timeZone.includes('Berlin') || timeZone.includes('Madrid') || timeZone.includes('Rome')) {
              setGeo({ countryCode: 'EU', countryName: 'Europe', currency: 'EUR', flag: '🇪🇺', isAutoDetected: true });
              setCurrencyState('EUR');
            }
          } catch {}
        });
    }
  }, []);

  const setCurrency = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem('eviona_preferred_currency', code);
        localStorage.setItem('eviona_manual_geo_override', 'true');
      } catch {}
    }
  };

  const setCountry = (countryCode: string) => {
    const matchedCurrency = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
    const validCurrency = SUPPORTED_CURRENCIES[matchedCurrency] ? matchedCurrency : 'USD';
    const flag = SUPPORTED_CURRENCIES[validCurrency]?.flag || '🌐';

    const updated: DetectedGeo = {
      countryCode,
      countryName: countryCode,
      currency: validCurrency,
      flag,
      isAutoDetected: false,
    };

    setGeo(updated);
    setCurrency(validCurrency);
    try {
      localStorage.setItem('eviona_geo_info', JSON.stringify(updated));
      localStorage.setItem('eviona_manual_geo_override', 'true');
    } catch {}
  };

  const convertAmount = (usdAmount: number, targetCurrency?: string): number => {
    const curr = targetCurrency || currency;
    const rate = rates[curr] || FALLBACK_RATES[curr] || 1.0;
    return usdAmount * rate;
  };

  const formatPrice = (usdAmount: number, overrideCurrency?: string): string => {
    const curr = overrideCurrency || currency;
    const conf = SUPPORTED_CURRENCIES[curr] || SUPPORTED_CURRENCIES.USD;
    const converted = convertAmount(usdAmount, curr);

    const formattedNumber = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: conf.decimals,
      maximumFractionDigits: conf.decimals,
    }).format(converted);

    return `${conf.symbol}${formattedNumber}`;
  };

  const currencyConfig = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig,
        rates,
        geo,
        isLoadingRates,
        setCurrency,
        setCountry,
        formatPrice,
        convertAmount,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

