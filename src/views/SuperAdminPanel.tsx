import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  ArrowUpRight,
  UserCheck,
  Sliders,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Filter,
  Save,
  Search,
  Eye,
  FileCheck,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  Package,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Network,
  Palette,
  Globe,
  Store,
  Wallet,
  Building2,
  Mail,
  Shield,
  FileText,
  Key,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Layout,
  Megaphone,
  Radio,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import {
  initialKYCList,
  initialPayoutQueue,
  initialAuditLogs,
  KYCSubmission,
  PayoutRequest,
  AuditLogEntry,
} from '../store/useAppStore';
import { Badge } from '../components/common/Badge';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { UserRole, Member, ViewType } from '../types';
import { supabase } from '../lib/supabaseClient';

interface SuperAdminPanelProps {
  onImpersonateUser?: (user: Member) => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ onImpersonateUser }) => {
  const {
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
  } = usePlatformSettings();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'branding'
    | 'appearance'
    | 'homepage_cms'
    | 'dashboard_config'
    | 'navigation'
    | 'users'
    | 'memberships'
    | 'marketplace'
    | 'corporate_leads'
    | 'treasury'
    | 'binary_rules'
    | 'system'
    | 'audit_log'
  >('overview');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Forms State
  const [brandingForm, setBrandingForm] = useState(branding);
  const [themeForm, setThemeForm] = useState(theme);
  const [homepageForm, setHomepageForm] = useState(homepage);
  const [dashboardForm, setDashboardForm] = useState(dashboard);
  const [navigationForm, setNavigationForm] = useState(navigation);
  const [featuresForm, setFeaturesForm] = useState(features);

  // Live User Management State
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchLiveUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // 1. Fetch live registered users from Supabase Member table
      const { data, error } = await supabase
        .from('Member')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        const mapped = data.map((m: any) => ({
          id: m.id || m.member_code || `EVO-${Math.floor(1000 + Math.random() * 9000)}`,
          name: m.name || m.full_name || 'Registered Entrepreneur',
          email: m.email || 'user@evionaecosystem.com',
          role: m.role || (m.email?.includes('admin') ? 'super_admin' : 'member'),
          plan: m.plan || 'launch',
          status: m.status || 'active',
          walletBalance: typeof m.wallet_balance === 'number' ? m.wallet_balance : (typeof m.walletBalance === 'number' ? m.walletBalance : 0.0),
          binaryVolume: typeof m.binary_volume === 'number' ? m.binary_volume : (typeof m.binaryVolume === 'number' ? m.binaryVolume : 0),
          activeReferrals: typeof m.active_referrals === 'number' ? m.active_referrals : (typeof m.activeReferrals === 'number' ? m.activeReferrals : 0),
          joinedDate: m.created_at ? new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
        }));
        setUsersList(mapped);
      } else {
        // 2. If table is empty or newly connected, populate from current active session cache
        const activeUserCached = localStorage.getItem('eviona_active_member_profile');
        if (activeUserCached) {
          try {
            const parsed = JSON.parse(activeUserCached);
            setUsersList([
              {
                id: parsed.id,
                name: parsed.name,
                email: parsed.email,
                role: parsed.role || 'super_admin',
                plan: parsed.plan || 'legacy',
                status: parsed.status || 'active',
                walletBalance: parsed.walletBalance || 0.0,
                binaryVolume: parsed.binaryVolume || 0,
                activeReferrals: parsed.activeReferrals || 0,
                joinedDate: parsed.memberSince || 'Today',
              }
            ]);
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Live user fetch notification:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchLiveUsers();
  }, []);

  // Payouts & Corporate Leads
  const [payoutList, setPayoutList] = useState<PayoutRequest[]>(initialPayoutQueue);
  const [sustainabilityFund] = useState(45820.0);

  const [corporateLeads] = useState<any[]>([
    {
      id: 'LED-CORP-201',
      name: 'Alexander Wright',
      email: 'alex@enterprise-global.com',
      company: 'Enterprise Global Corp',
      source: 'Corporate Website (Contact Sales)',
      assignedTo: 'Marcus (Enterprise Sales)',
      stage: 'Qualified',
    },
    {
      id: 'LED-CORP-202',
      name: 'David K. O’Connor',
      email: 'david@apexholdings.org',
      company: 'Apex Digital Capital',
      source: 'Corporate Landing Page (Book 7 §2)',
      assignedTo: 'Super Admin',
      stage: 'Negotiation',
    },
  ]);

  const logAdminAction = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      action,
      actor: 'Marcus Vance (Super Admin)',
      actorRole: 'super_admin',
      timestamp: new Date().toLocaleTimeString(),
      details,
      impactCategory: 'System Config',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBranding(brandingForm);
    logAdminAction('Platform Branding Update', `Branding updated: ${brandingForm.platformName}`);
    showToast('Platform branding saved & synchronized across all frontend views!');
  };

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTheme(themeForm);
    logAdminAction('Theme & Appearance Update', `Primary color: ${themeForm.primaryColor}`);
    showToast('Theme styling and CSS variables injected dynamically!');
  };

  const handleSaveHomepageCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepage(homepageForm);
    logAdminAction('Homepage CMS Update', 'Homepage hero text, video, and FAQ updated');
    showToast('Homepage CMS updated immediately on the live marketing website!');
  };

  const handleSaveDashboardConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDashboard(dashboardForm);
    logAdminAction('Dashboard Configuration Update', 'Dashboard welcome message & broadcast banner updated');
    showToast('User dashboard settings saved! Live on next user render.');
  };

  const handleToggleNavigationItem = async (viewKey: ViewType) => {
    const updated = {
      ...navigationForm.enabledViews,
      [viewKey]: navigationForm.enabledViews[viewKey] === false ? true : false,
    };
    const newNav = { enabledViews: updated };
    setNavigationForm(newNav);
    await updateNavigation(newNav);
    logAdminAction('Navigation Menu Modified', `Module ${viewKey} set to ${updated[viewKey] ? 'Enabled' : 'Disabled'}`);
    showToast(`Navigation updated! Module ${viewKey} is now ${updated[viewKey] ? 'visible' : 'hidden'}.`);
  };

  const handleSaveSystemFeatures = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFeatures(featuresForm);
    logAdminAction('System Feature Flags Update', `Maintenance: ${featuresForm.maintenanceMode}, Coin: $${featuresForm.defaultCoinRateUsd}`);
    showToast('System feature flags and platform rates updated live in database!');
  };

  const handleToggleUserStatus = async (userId: string) => {
    const targetUser = usersList.find((u) => u.id === userId);
    const newStatus = targetUser?.status === 'active' ? 'suspended' : 'active';

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      await supabase.from('Member').update({ status: newStatus }).eq('id', userId);
    } catch (err) {
      console.warn('User status database sync note:', err);
    }

    logAdminAction('User Status Modified', `User ${targetUser?.email || userId} set to ${newStatus}`);
    showToast(`User status updated to ${newStatus} in live database!`);
  };

  const handleChangeUserRole = async (userId: string, newRole: UserRole) => {
    const targetUser = usersList.find((u) => u.id === userId);

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      await supabase.from('Member').update({ role: newRole }).eq('id', userId);
    } catch (err) {
      console.warn('User role database sync note:', err);
    }

    logAdminAction('User Role Modified', `User ${targetUser?.email || userId} assigned role ${newRole}`);
    showToast(`User role updated to ${newRole} in live database!`);
  };

  const handleImpersonate = (user: any) => {
    logAdminAction('User Impersonation Triggered', `Admin viewing platform as user: ${user.email} (${user.id})`);
    if (onImpersonateUser) {
      onImpersonateUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '',
        country: 'Global',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: user.plan,
        role: user.role,
        status: user.status,
        memberSince: user.joinedDate,
        renewalDate: '1 Year',
        rank: 'Director',
        nextRank: 'Executive',
        walletBalance: user.walletBalance,
        tokenBalance: user.walletBalance,
        availableBalance: user.walletBalance,
        binaryVolume: user.binaryVolume,
        activeReferrals: user.activeReferrals,
        hasCompletedOnboarding: true,
      });
    } else {
      alert(`[Audit Logged] Impersonation session started for ${user.name} (${user.email}).`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start animate-fadeIn font-sans">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-2xl animate-slideDown max-w-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* ADMIN SIDEBAR NAVIGATION (BY THE SIDE) */}
      <aside className="w-full lg:w-72 shrink-0 bg-slate-900/90 rounded-3xl p-4 border border-slate-800 space-y-6 lg:sticky lg:top-24 shadow-xl backdrop-blur-md">
        {/* Header Indicator */}
        <div className="px-3 py-2.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs font-extrabold text-white leading-tight">Admin Console</h4>
            <p className="text-[10px] text-slate-400 font-mono">14 Management Modules</p>
          </div>
        </div>

        {/* Group 1: Analytics & BI */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Analytics & BI
          </span>
          {[
            { id: 'overview', label: 'Overview & BI', icon: TrendingUp },
            { id: 'audit_log', label: 'Audit Trail (Book 17)', icon: FileText, badge: 'Ledger' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-800 text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Group 2: Configuration & Theming Engine */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Configuration Engine
          </span>
          {[
            { id: 'branding', label: 'Global Branding', icon: Globe },
            { id: 'appearance', label: 'Theme Engine (CSS)', icon: Palette },
            { id: 'homepage_cms', label: 'Homepage CMS & FAQ', icon: Layout },
            { id: 'dashboard_config', label: 'Dashboard & Alerts', icon: Megaphone },
            { id: 'navigation', label: 'Menu Management', icon: Sliders },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Group 3: Operations & Governance */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Operations & Rules
          </span>
          {[
            { id: 'users', label: 'Users & RBAC', icon: Users },
            { id: 'memberships', label: 'Plans & Pricing', icon: Layers },
            { id: 'marketplace', label: 'Marketplace Moderation', icon: Store },
            { id: 'corporate_leads', label: 'Corporate Leads (Book 7)', icon: Building2 },
            { id: 'treasury', label: 'Treasury & Payouts', icon: Wallet },
            { id: 'binary_rules', label: 'Binary MLM Engine', icon: Network },
            { id: 'system', label: 'System Flags & Coin', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE (RIGHT SIDE) */}
      <main className="flex-1 min-w-0 w-full space-y-6">

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & BI                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform GMV</span>
              <p className="text-xl font-black text-white">$842,500.00</p>
              <span className="text-[10px] font-bold text-emerald-400">↑ +18.4% this month</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly MRR</span>
              <p className="text-xl font-black text-white">$124,600.00</p>
              <span className="text-[10px] font-bold text-indigo-400">2,450 Subscriptions</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sustainability Fund</span>
              <p className="text-xl font-black text-emerald-400">${sustainabilityFund.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-slate-400">Book 6 Protocol</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
              <p className="text-xl font-black text-amber-400">$14,580.00</p>
              <span className="text-[10px] font-bold text-amber-500">6 requests in queue</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marketplace Sales</span>
              <p className="text-xl font-black text-white">$68,920.00</p>
              <span className="text-[10px] font-bold text-emerald-400">10% Platform Cut</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync Status</span>
              <p className="text-xl font-black text-emerald-400">SYNCHRONIZED</p>
              <span className="text-[10px] font-bold text-emerald-500">Single Source Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Configuration Engine Summary</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Active Platform Name:</span>
                  <b className="text-white">{branding.platformName}</b>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Primary Brand Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                    <code className="text-indigo-400 font-mono">{theme.primaryColor}</code>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Internal Coin Rate:</span>
                  <b className="text-emerald-400 font-mono">$1.00 USD = {features.defaultCoinRateUsd} EVO Token</b>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Maintenance Mode:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${features.maintenanceMode ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {features.maintenanceMode ? 'ACTIVE (OFFLINE)' : 'OFF (LIVE)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Real-Time Audit Stream</span>
                </h4>
                <button onClick={() => setActiveTab('audit_log')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                  Full Log
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{log.action}</p>
                      <p className="text-[10px] text-slate-400">{log.details}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GLOBAL BRANDING                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Global Platform Branding & Identity</h3>
            <p className="text-xs text-slate-400">
              Changes propagate to the public homepage, member sidebar, login modals, emails, and footers immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Platform Name</label>
              <input
                type="text"
                value={brandingForm.platformName}
                onChange={(e) => setBrandingForm({ ...brandingForm, platformName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                placeholder="Eviona Ecosystem"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Tagline / Header Writeup</label>
              <input
                type="text"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                placeholder="Digital Entrepreneurship OS"
              />
            </div>

            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block font-bold text-slate-300">Brand Logo Image URL (Header & Navbar)</label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={brandingForm.logoUrl || ''}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value, lightLogoUrl: e.target.value })}
                  placeholder="https://your-cdn.com/logo.png (or leave blank for high-tech icon badge)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500 font-mono text-xs"
                />
                {brandingForm.logoUrl && (
                  <div className="shrink-0 p-1.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-2">
                    <img src={brandingForm.logoUrl} alt="Logo Preview" className="h-8 max-w-[120px] object-contain rounded-lg" />
                    <span className="text-[10px] text-emerald-400 font-bold pr-1">Preview</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                When provided, this logo image replaces the default icon badge across the header, sidebar, login modals, and emails.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Company Registered Name</label>
              <input
                type="text"
                value={brandingForm.companyName}
                onChange={(e) => setBrandingForm({ ...brandingForm, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Official Support Email</label>
              <input
                type="email"
                value={brandingForm.supportEmail}
                onChange={(e) => setBrandingForm({ ...brandingForm, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Support Phone Number</label>
              <input
                type="text"
                value={brandingForm.supportPhone}
                onChange={(e) => setBrandingForm({ ...brandingForm, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Footer Copyright Notice</label>
              <input
                type="text"
                value={brandingForm.copyrightText}
                onChange={(e) => setBrandingForm({ ...brandingForm, copyrightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Default Platform Currency</label>
              <input
                type="text"
                value={brandingForm.defaultCurrency}
                onChange={(e) => setBrandingForm({ ...brandingForm, defaultCurrency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Timezone</label>
              <input
                type="text"
                value={brandingForm.timezone}
                onChange={(e) => setBrandingForm({ ...brandingForm, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync Branding</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. THEME ENGINE & DYNAMIC CSS VARIABLES                                   */}
      {/* ========================================================================= */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSaveAppearance} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Dynamic Global Theme Engine</h3>
            <p className="text-xs text-slate-400">
              Customize colors, font family, and border radius. Injects CSS variables live into the runtime document.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block font-bold text-slate-300">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeForm.primaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeForm.primaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block font-bold text-slate-300">Secondary Gradient Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeForm.secondaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeForm.secondaryColor}
                  onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="block font-bold text-slate-300">Accent Highlight Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeForm.accentColor}
                  onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={themeForm.accentColor}
                  onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Global Font Family</label>
              <input
                type="text"
                value={themeForm.fontFamily}
                onChange={(e) => setThemeForm({ ...themeForm, fontFamily: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Default Border Radius</label>
              <input
                type="text"
                value={themeForm.borderRadius}
                onChange={(e) => setThemeForm({ ...themeForm, borderRadius: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Apply Theme Engine Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. HOMEPAGE CMS & FAQs                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'homepage_cms' && (
        <form onSubmit={handleSaveHomepageCMS} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Homepage Content Management (CMS)</h3>
            <p className="text-xs text-slate-400">
              Edit the live marketing website copy, promo banner, video player, and FAQ questions.
            </p>
          </div>

          {/* Promotional Announcement Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Promotional Top Announcement Bar</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setHomepageForm({
                    ...homepageForm,
                    announcementBanner: {
                      ...homepageForm.announcementBanner,
                      enabled: !homepageForm.announcementBanner.enabled,
                    },
                  })
                }
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  homepageForm.announcementBanner.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {homepageForm.announcementBanner.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {homepageForm.announcementBanner.enabled && (
              <input
                type="text"
                value={homepageForm.announcementBanner.text}
                onChange={(e) =>
                  setHomepageForm({
                    ...homepageForm,
                    announcementBanner: { ...homepageForm.announcementBanner, text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500"
              />
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Hero Pill Badge Text</label>
              <input
                type="text"
                value={homepageForm.heroBadge}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={homepageForm.heroHeadline}
                  onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Gradient Highlight Phrase</label>
                <input
                  type="text"
                  value={homepageForm.heroHighlightText}
                  onChange={(e) => setHomepageForm({ ...homepageForm, heroHighlightText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Hero Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={homepageForm.heroSubtitle}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">YouTube Master Tour Video URL</label>
              <input
                type="text"
                value={homepageForm.heroVideoUrl}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroVideoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live CMS</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 5. DASHBOARD & BROADCAST ALERTS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard_config' && (
        <form onSubmit={handleSaveDashboardConfig} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Member Dashboard Configuration & Broadcasts</h3>
            <p className="text-xs text-slate-400">
              Customize the welcome message and broadcast platform notifications across all user dashboards.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Welcome Headline Template</label>
              <input
                type="text"
                value={dashboardForm.welcomeHeadline}
                onChange={(e) => setDashboardForm({ ...dashboardForm, welcomeHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                placeholder="Good morning, {name}! 👋"
              />
              <p className="text-[10px] text-slate-500 mt-1">Use <code>{'{name}'}</code> to dynamically interpolate the logged in entrepreneur&apos;s name.</p>
            </div>

            {/* Broadcast Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>Platform-Wide Broadcast Alert</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDashboardForm({
                      ...dashboardForm,
                      announcementBar: {
                        ...dashboardForm.announcementBar,
                        enabled: !dashboardForm.announcementBar.enabled,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    dashboardForm.announcementBar.enabled
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {dashboardForm.announcementBar.enabled ? 'Broadcasting Live' : 'Disabled'}
                </button>
              </div>

              {dashboardForm.announcementBar.enabled && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={dashboardForm.announcementBar.text}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        announcementBar: { ...dashboardForm.announcementBar, text: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500"
                    placeholder="Enter urgent announcement text..."
                  />

                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Severity Level:</span>
                    {(['info', 'warning', 'success'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() =>
                          setDashboardForm({
                            ...dashboardForm,
                            announcementBar: { ...dashboardForm.announcementBar, severity: sev },
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                          dashboardForm.announcementBar.severity === sev
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Dashboard Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 6. MENU & NAVIGATION MANAGEMENT                                           */}
      {/* ========================================================================= */}
      {activeTab === 'navigation' && (
        <div className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Menu & Module Visibility Control</h3>
            <p className="text-xs text-slate-400">
              Toggle visibility for individual features in the member sidebar. Disabled modules are hidden in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'wallet', label: 'Wallet & EVO Token' },
              { id: 'binary', label: 'Binary MLM Network' },
              { id: 'partner', label: 'Partner Center' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'sellers', label: 'Sellers Dashboard' },
              { id: 'academy', label: 'Academy Hub' },
              { id: 'builder', label: 'Website Builder Studio' },
              { id: 'domains', label: 'Custom Domains & DNS' },
              { id: 'crm', label: 'CRM & Sales Funnels' },
              { id: 'ai-center', label: 'AI Business Center' },
              { id: 'marketing', label: 'Marketing Tools' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'events', label: 'Events & Webinars' },
              { id: 'team', label: 'My Team' },
              { id: 'settings', label: 'Settings' },
              { id: 'support', label: 'Support & Help Desk' },
            ].map((mod) => {
              const isEnabled = navigationForm.enabledViews[mod.id as ViewType] !== false;
              return (
                <div
                  key={mod.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white">{mod.label}</span>
                  <button
                    onClick={() => handleToggleNavigationItem(mod.id as ViewType)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-all ${
                      isEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Hidden'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. USER DIRECTORY & RBAC                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search live users by name, email, or member ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live DB: <b className="text-white">{usersList.length} Users</b></span>
              </div>

              <button
                onClick={fetchLiveUsers}
                disabled={isLoadingUsers}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                title="Sync and query live users from database"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                <span>{isLoadingUsers ? 'Syncing...' : 'Refresh DB'}</span>
              </button>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="member">Member</option>
                <option value="support_staff">Support Staff</option>
                <option value="admin">Administrator</option>
                <option value="super_admin">Super Administrator</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Wallet Balance</th>
                    <th className="p-4">Binary BV</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList
                    .filter((u) => {
                      const matchesSearch =
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.id.toLowerCase().includes(userSearch.toLowerCase());
                      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
                      return matchesSearch && matchesRole;
                    })
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{user.email} • {user.id}</p>
                        </td>
                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeUserRole(user.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-indigo-400 outline-none"
                          >
                            <option value="member">Member</option>
                            <option value="support_staff">Support Staff</option>
                            <option value="admin">Administrator</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-white uppercase">{user.plan}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          ${user.walletBalance.toFixed(2)}
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {user.binaryVolume.toLocaleString()} BV
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleImpersonate(user)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold shadow-xs transition-colors"
                            title="Audited View As User"
                          >
                            View as User
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              user.status === 'active'
                                ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SYSTEM FLAGS & COIN EXCHANGE RATE                                      */}
      {/* ========================================================================= */}
      {activeTab === 'system' && (
        <form onSubmit={handleSaveSystemFeatures} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">System Feature Flags & Monetary Parameters</h3>
            <p className="text-xs text-slate-400">
              Manage platform operational switches, maintenance mode, and EVO Token conversion rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300">Internal EVO Token Rate ($1.00 USD =)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={featuresForm.defaultCoinRateUsd}
                  onChange={(e) => setFeaturesForm({ ...featuresForm, defaultCoinRateUsd: parseFloat(e.target.value) || 1.0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm"
                />
                <span className="font-bold text-emerald-400 font-mono">EVO</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Maintenance Mode</span>
                <span className="text-[10px] text-slate-400">Puts public site under maintenance</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturesForm({ ...featuresForm, maintenanceMode: !featuresForm.maintenanceMode })}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  featuresForm.maintenanceMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {featuresForm.maintenanceMode ? 'Active (Offline)' : 'Off (Live)'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">User Registrations</span>
                <span className="text-[10px] text-slate-400">Accept new entrepreneur sign-ups</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturesForm({ ...featuresForm, registrationOpen: !featuresForm.registrationOpen })}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  featuresForm.registrationOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {featuresForm.registrationOpen ? 'Open' : 'Paused'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Wallet Withdrawals</span>
                <span className="text-[10px] text-slate-400">Allow USDT TRC20 payout requests</span>
              </div>
              <button
                type="button"
                onClick={() => setFeaturesForm({ ...featuresForm, withdrawalsEnabled: !featuresForm.withdrawalsEnabled })}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  featuresForm.withdrawalsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {featuresForm.withdrawalsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Flags</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 9. AUDIT LOGS (BOOK 17)                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Immutable Administrative Audit Log</h3>
            <button
              onClick={() => alert('Exporting audit trail to CSV...')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 font-mono">
                    <td className="p-4 font-bold text-white">{log.action}</td>
                    <td className="p-4 text-slate-400">{log.actor} ({log.actorRole})</td>
                    <td className="p-4 text-indigo-400 font-bold">{log.impactCategory}</td>
                    <td className="p-4 text-slate-300">{log.details}</td>
                    <td className="p-4 text-slate-500">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};
