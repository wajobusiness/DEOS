import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Network,
  Users,
  ShoppingBag,
  Store,
  GraduationCap,
  Globe,
  Contact2,
  Bot,
  Megaphone,
  BarChart3,
  Calendar,
  Settings,
  HelpCircle,
  ShieldCheck,
  Zap,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { ViewType, Member } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePlatformSettings } from '../../context/PlatformSettingsContext';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  currentUser: Member;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  isAdminMode,
  onToggleAdminMode,
  isOpen,
  onCloseMobile,
}) => {
  const { signOut } = useAuth();
  const { branding, navigation } = usePlatformSettings();

  const allNavItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet' as ViewType, label: 'Eviona Wallet', icon: Wallet, badge: 'EVO' },
    { id: 'binary' as ViewType, label: 'Eviona Network', icon: Network },
    { id: 'partner' as ViewType, label: 'Partner Center', icon: Users },
    { id: 'marketplace' as ViewType, label: 'Eviona Marketplace', icon: ShoppingBag },
    { id: 'sellers' as ViewType, label: 'Sellers Dashboard', icon: Store },
    { id: 'academy' as ViewType, label: 'Eviona Academy', icon: GraduationCap },
    { id: 'builder' as ViewType, label: 'Eviona Business Center', icon: Globe, highlight: true },
    { id: 'domains' as ViewType, label: 'Domains & DNS', icon: Globe },
    { id: 'crm' as ViewType, label: 'Eviona CRM', icon: Contact2, badge: '36' },
    { id: 'ai-center' as ViewType, label: 'Eviona AI', icon: Bot, badge: 'AI' },
    { id: 'marketing' as ViewType, label: 'Marketing Tools', icon: Megaphone },
    { id: 'analytics' as ViewType, label: 'Eviona Analytics', icon: BarChart3 },
    { id: 'events' as ViewType, label: 'Events & Webinars', icon: Calendar },
    { id: 'team' as ViewType, label: 'My Team', icon: Users },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
    { id: 'support' as ViewType, label: 'Support & Help', icon: HelpCircle },
  ];

  const mainNavItems = allNavItems.filter((item) => navigation.enabledViews[item.id] !== false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0F19] text-slate-300 flex flex-col border-r border-[#1F2937] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-[#1F2937]">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.platformName} className="h-9 w-auto rounded-lg object-contain" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                  {branding.platformName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {isAdminMode ? 'Admin' : 'OS'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 truncate max-w-[140px]">
                {branding.tagline || 'Your Business. Your Legacy.'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar-dark">
          {/* Main Workspace Group */}
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isAdminMode ? 'Admin Controls' : 'Main Workspace'}
          </div>

          {isAdminMode ? (
            <div className="space-y-1 mb-4">
              <button
                onClick={() => onNavigate('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-[#161F30] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Admin Control Center</span>
              </button>
            </div>
          ) : null}

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-[#161F30] hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1F2937] text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Banner & Profile Card */}
        <div className="p-3 border-t border-[#1F2937] space-y-3">
          {/* Membership Tier or Admin Switcher Pill */}
          {currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'support_staff' ? (
            <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 rounded-xl p-3 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="text-[11px] font-bold text-white">
                    {currentUser.role === 'super_admin' ? 'Super Admin' : 'Staff Admin'}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Platform Control Active
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleAdminMode}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Backoffice</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 rounded-xl p-3 border border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-[11px] font-semibold text-white">
                    {currentUser.plan.toUpperCase()} Plan Active
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Auto-Renews: {currentUser.renewalDate || '1 Year'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          )}

          {/* User Profile Footer */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/40"
              />
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium">
                  ● {currentUser.rank}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                await signOut();
                onNavigate('landing');
              }}
              title="Logout from Eviona"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#1F2937] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
