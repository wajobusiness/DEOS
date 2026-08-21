import React from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  Menu,
  ChevronDown,
  Globe,
  Plus
} from 'lucide-react';
import { Member, ViewType } from '../../types';

interface HeaderProps {
  currentUser: Member;
  currentView: ViewType;
  onOpenCommandPalette: () => void;
  onOpenMobileSidebar: () => void;
  onNavigate: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  onOpenCommandPalette,
  onOpenMobileSidebar,
  onNavigate,
}) => {
  const getPageTitle = (view: ViewType): string => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'wallet': return 'Wallet & Transactions';
      case 'deposit': return 'Deposit Funds & DEOS Coin';
      case 'binary': return 'Binary Network Engine';
      case 'partner': return 'Partner Center';
      case 'marketplace': return 'DEOS Marketplace';
      case 'sellers': return 'Sellers Dashboard';
      case 'academy': return 'Digital Entrepreneur Academy';
      case 'builder': return 'Website Builder Studio';
      case 'crm': return 'CRM & Sales Pipeline';
      case 'ai-center': return 'AI Business Center';
      case 'marketing': return 'Marketing Tools & Automation';
      case 'analytics': return 'Performance & Analytics';
      case 'events': return 'Events & Live Webinars';
      case 'team': return 'Team Management & Roles';
      case 'settings': return 'Settings & Preferences';
      case 'support': return 'Support & Help Desk';
      case 'admin': return 'Admin Control Center';
      default: return 'DEOS Business OS';
    }
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      {/* Left: Mobile Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {getPageTitle(currentView)}
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Welcome back, {currentUser.name} 👋
          </p>
        </div>
      </div>

      {/* Center/Right: Search Bar Trigger, CTAs & Account Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar (⌘K Trigger) */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 text-slate-500 text-xs font-medium transition-all w-64 lg:w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search leads, tools, transactions...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white rounded border border-slate-200 shadow-sm text-slate-600">
            ⌘K
          </kbd>
        </button>

        {/* Deposit Quick Action */}
        <button
          onClick={() => onNavigate('deposit')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/60 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deposit</span>
        </button>

        {/* Upgrade Plan Pill */}
        <button
          onClick={() => onNavigate('settings')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {/* Public Website Preview Link */}
        <button
          onClick={() => onNavigate('landing')}
          title="View Public Marketing Site"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
        >
          <Globe className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* User Account Quick Dropdown */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              ID: {currentUser.id}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden xl:block" />
        </div>
      </div>
    </header>
  );
};
