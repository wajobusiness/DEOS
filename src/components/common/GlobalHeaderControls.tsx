import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, RefreshCw, Check, Sparkles, MapPin } from 'lucide-react';
import { useCurrency, SUPPORTED_CURRENCIES } from '../../context/CurrencyContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

interface GlobalHeaderControlsProps {
  theme?: 'dark' | 'light';
  showCountryIndicator?: boolean;
}

export const GlobalHeaderControls: React.FC<GlobalHeaderControlsProps> = ({
  theme = 'dark',
  showCountryIndicator = true,
}) => {
  const { currency, currencyConfig, setCurrency, rates, geo, isLoadingRates, refreshRates } = useCurrency();
  const { language, languageConfig, setLanguage, isRTL } = useLanguage();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      {/* 1. CURRENCY & COUNTRY SELECTOR */}
      <div className="relative" ref={currencyRef}>
        <button
          onClick={() => {
            setIsCurrencyOpen(!isCurrencyOpen);
            setIsLangOpen(false);
          }}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all min-h-[38px] border shadow-xs ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800'
          }`}
          title={`Active Currency: ${currencyConfig.name} (${currencyConfig.symbol})`}
        >
          <span className="text-sm leading-none">{currencyConfig.flag}</span>
          <span className="font-extrabold font-mono text-[11px]">{currencyConfig.code}</span>
          <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
            isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
          }`}>
            {currencyConfig.symbol}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCurrencyOpen ? 'rotate-180 text-indigo-400' : ''}`} />
        </button>

        {/* Currency Dropdown Menu */}
        {isCurrencyOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950 border border-slate-800 p-3 shadow-2xl z-50 animate-fadeIn text-left backdrop-blur-xl">
            {/* Header info */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Region & Currency</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  refreshRates();
                }}
                className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                title="Refresh Live Exchange Rates"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin text-indigo-400' : ''}`} />
                <span>Live Rates</span>
              </button>
            </div>

            {/* Geo Info Pill */}
            {geo && (
              <div className="mb-2.5 p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{geo.flag}</span>
                  <span className="font-medium truncate">Detected: {geo.countryName}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                  {geo.currency}
                </span>
              </div>
            )}

            {/* Currencies Grid */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {Object.values(SUPPORTED_CURRENCIES).map((curr) => {
                const isSelected = curr.code === currency;
                const rate = rates[curr.code] || 1;
                const rateFormatted = curr.code === 'USD' ? '1.00' : rate > 10 ? rate.toFixed(1) : rate.toFixed(3);

                return (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{curr.flag}</span>
                      <div className="text-left leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold">{curr.code}</span>
                          <span className="text-[11px] opacity-75">({curr.symbol})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                          {curr.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] opacity-80 font-mono">
                      <span>1 USD ≈ {curr.symbol}{rateFormatted}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-1 inline text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. LANGUAGE SELECTOR */}
      <div className="relative" ref={langRef}>
        <button
          onClick={() => {
            setIsLangOpen(!isLangOpen);
            setIsCurrencyOpen(false);
          }}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all min-h-[38px] border shadow-xs ${
            isDark
              ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800'
          }`}
          title={`Active Language: ${languageConfig.nativeName}`}
        >
          <span className="text-sm leading-none">{languageConfig.flag}</span>
          <span className="uppercase text-[11px] font-mono font-bold hidden sm:inline">
            {languageConfig.code}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180 text-indigo-400' : ''}`} />
        </button>

        {/* Language Dropdown Menu */}
        {isLangOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-950 border border-slate-800 p-2.5 shadow-2xl z-50 animate-fadeIn text-left backdrop-blur-xl">
            <div className="pb-1.5 mb-1.5 border-b border-slate-800 text-xs flex items-center gap-1.5 text-slate-300 font-bold px-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Language</span>
            </div>

            <div className="space-y-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <div className="text-left">
                        <span className="block font-bold leading-tight">{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

