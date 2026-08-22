import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Wallet,
  Network,
  ShoppingBag,
  Store,
  Globe,
  Contact2,
  Bot,
  Megaphone,
  GraduationCap,
  Calendar,
  Settings,
  ShieldCheck,
  X,
  ArrowRight
} from 'lucide-react';
import { ViewType } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'Dashboard Overview', category: 'Navigation', icon: LayoutDashboard, view: 'dashboard' as ViewType },
    { title: 'Eviona Wallet (EVO Token)', category: 'Wallet', icon: Wallet, view: 'wallet' as ViewType },
    { title: 'Deposit Funds & EVO Token', category: 'Wallet', icon: Wallet, view: 'deposit' as ViewType },
    { title: 'Eviona Network (Binary Tree)', category: 'Network', icon: Network, view: 'binary' as ViewType },
    { title: 'Eviona Business Center Studio', category: 'Website', icon: Globe, view: 'builder' as ViewType },
    { title: 'Domains & DNS Integration', category: 'Website', icon: Globe, view: 'domains' as ViewType },
    { title: 'Partner & Affiliate Center', category: 'Network', icon: Network, view: 'partner' as ViewType },
    { title: 'Eviona Marketplace', category: 'Marketplace', icon: ShoppingBag, view: 'marketplace' as ViewType },
    { title: 'Sellers Dashboard', category: 'Seller', icon: Store, view: 'sellers' as ViewType },
    { title: 'Eviona CRM & Leads Pipeline', category: 'Sales', icon: Contact2, view: 'crm' as ViewType },
    { title: 'Eviona AI Business Center', category: 'AI Tools', icon: Bot, view: 'ai-center' as ViewType },
    { title: 'Marketing Tools & Automation', category: 'Marketing', icon: Megaphone, view: 'marketing' as ViewType },
    { title: 'Eviona Academy Masterclasses', category: 'Learning', icon: GraduationCap, view: 'academy' as ViewType },
    { title: 'Events & Webinars', category: 'Community', icon: Calendar, view: 'events' as ViewType },
    { title: 'Admin Control Center', category: 'Admin', icon: ShieldCheck, view: 'admin' as ViewType },
    { title: 'Platform Settings', category: 'Preferences', icon: Settings, view: 'settings' as ViewType },
  ];

  const filtered = quickLinks.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools, leads, courses, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No matching modules or actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/80 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Navigate with <b>↑</b> <b>↓</b></span>
          <span>Select with <b>↵ Enter</b></span>
          <span>Close with <b>ESC</b></span>
        </div>
      </div>
    </div>
  );
};
