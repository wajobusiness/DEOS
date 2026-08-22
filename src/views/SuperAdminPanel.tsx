import React, { useState } from 'react';
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
  ExternalLink
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
import { UserRole, Member } from '../types';

interface SuperAdminPanelProps {
  onImpersonateUser?: (user: Member) => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ onImpersonateUser }) => {
  const {
    branding,
    theme,
    homepage,
    features,
    updateBranding,
    updateTheme,
    updateHomepage,
    updateFeatures,
  } = usePlatformSettings();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'branding'
    | 'appearance'
    | 'users'
    | 'memberships'
    | 'marketplace'
    | 'corporate_leads'
    | 'treasury'
    | 'binary_rules'
    | 'academy'
    | 'domains'
    | 'audit_log'
    | 'system'
  >('overview');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState(branding);
  // Theme Form State
  const [themeForm, setThemeForm] = useState(theme);
  // Homepage Form State
  const [homepageForm, setHomepageForm] = useState(homepage);
  // Feature Flags Form State
  const [featuresForm, setFeaturesForm] = useState(features);

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [usersList, setUsersList] = useState<any[]>([
    {
      id: 'DEOS-USR-101',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      role: 'member',
      plan: 'growth',
      status: 'active',
      walletBalance: 3450.0,
      binaryVolume: 125000,
      activeReferrals: 14,
      joinedDate: 'May 12, 2024',
    },
    {
      id: 'DEOS-USR-102',
      name: 'Elena Rostova',
      email: 'elena@cryptoempire.io',
      role: 'member',
      plan: 'legacy',
      status: 'active',
      walletBalance: 12840.0,
      binaryVolume: 340000,
      activeReferrals: 42,
      joinedDate: 'Apr 02, 2024',
    },
    {
      id: 'DEOS-USR-103',
      name: 'Marcus Vance',
      email: 'marcus@deos-admin.internal',
      role: 'admin',
      plan: 'legacy',
      status: 'active',
      walletBalance: 0.0,
      binaryVolume: 0,
      activeReferrals: 0,
      joinedDate: 'Jan 15, 2024',
    },
    {
      id: 'DEOS-USR-104',
      name: 'Sarah Chen',
      email: 'sarah.c@growthlabs.co',
      role: 'member',
      plan: 'launch',
      status: 'suspended',
      walletBalance: 120.0,
      binaryVolume: 12000,
      activeReferrals: 2,
      joinedDate: 'Jun 19, 2024',
    },
  ]);

  // KYC & Payouts
  const [kycList, setKycList] = useState<KYCSubmission[]>(initialKYCList);
  const [payoutList, setPayoutList] = useState<PayoutRequest[]>(initialPayoutQueue);
  const [selectedKyc, setSelectedKyc] = useState<KYCSubmission | null>(null);
  const [sustainabilityFund, setSustainabilityFund] = useState(45820.0);

  // Corporate Inbound Leads (Book 7)
  const [corporateLeads, setCorporateLeads] = useState<any[]>([
    {
      id: 'LED-CORP-201',
      name: 'Alexander Wright',
      email: 'alex@enterprise-global.com',
      phone: '+1 800 555 0199',
      company: 'Enterprise Global Corp',
      leadSource: 'company_website',
      source: 'Corporate Website (Contact Sales / Demo)',
      ownerType: 'company',
      assignedTo: 'Marcus (Enterprise Sales)',
      status: 'New',
      stage: 'Qualified',
      createdAt: 'Today, 08:30 AM',
    },
    {
      id: 'LED-CORP-202',
      name: 'David K. O’Connor',
      email: 'david@apexholdings.org',
      phone: '+44 20 7946 0912',
      company: 'Apex Digital Capital',
      leadSource: 'company_website',
      source: 'Corporate Landing Page (Book 7 §2)',
      ownerType: 'company',
      assignedTo: 'Super Admin',
      status: 'Contacted',
      stage: 'Negotiation',
      createdAt: 'Yesterday, 04:15 PM',
    },
  ]);

  // Domain Management Requests
  const [domainRequests, setDomainRequests] = useState<any[]>([
    {
      id: 'DOM-01',
      memberId: 'DEOS-USR-101',
      memberName: 'Alex Morgan',
      domain: 'alexmorganofficial.com',
      cnameTarget: 'cname.deos.com',
      sslStatus: 'Active',
      dnsStatus: 'Verified',
      requestedAt: 'May 10, 2025',
    },
    {
      id: 'DOM-02',
      memberId: 'DEOS-USR-102',
      memberName: 'Elena Rostova',
      domain: 'cryptoempiredigital.io',
      cnameTarget: 'cname.deos.com',
      sslStatus: 'Pending',
      dnsStatus: 'Propagating',
      requestedAt: 'May 14, 2025',
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

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBranding(brandingForm);
    logAdminAction('Platform Branding Update', 'Updated platform title, logo, contact, and social links');
    setSaveSuccessMsg('Platform branding updated and stored in database successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTheme(themeForm);
    await updateHomepage(homepageForm);
    logAdminAction('Appearance & Theme Update', 'Updated homepage hero text, colors, and banner settings');
    setSaveSuccessMsg('Theme & Homepage appearance updated live across the platform!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          logAdminAction(`User Status Modified`, `User ${u.email} set to ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          logAdminAction(`User Role Modified`, `User ${u.email} assigned role ${newRole}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
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

  const handleApprovePayout = (payoutId: string) => {
    setPayoutList((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'Approved' } : p))
    );
    logAdminAction('Payout Request Approved', `Approved payout ${payoutId}`);
  };

  const handleRejectPayout = (payoutId: string) => {
    setPayoutList((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'Rejected' } : p))
    );
    logAdminAction('Payout Request Rejected', `Rejected payout ${payoutId}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Navigation Tab Rail */}
      <div className="bg-slate-900/90 rounded-2xl p-2 border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & BI', icon: TrendingUp },
          { id: 'branding', label: 'Branding & Identity', icon: Globe },
          { id: 'appearance', label: 'Theme & Appearance', icon: Palette },
          { id: 'users', label: 'User Directory & RBAC', icon: Users },
          { id: 'memberships', label: 'Plans & Pricing', icon: Layers },
          { id: 'marketplace', label: 'Marketplace Moderation', icon: Store },
          { id: 'corporate_leads', label: 'Corporate Leads (Book 7)', icon: Building2 },
          { id: 'treasury', label: 'Treasury & Payouts', icon: Wallet },
          { id: 'binary_rules', label: 'Binary MLM Engine', icon: Network },
          { id: 'academy', label: 'Academy Governance', icon: GraduationCap },
          { id: 'domains', label: 'Custom Domains', icon: Globe },
          { id: 'audit_log', label: 'Audit Trail (Book 17)', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & BI ANALYTICS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 6 Executive KPI Strip */}
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Status</span>
              <p className="text-xl font-black text-emerald-400">NOMINAL</p>
              <span className="text-[10px] font-bold text-emerald-500">100% Uptime</span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Quick RBAC Operations</span>
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 text-left flex items-center justify-between"
                >
                  <span>Assign Administrator / Staff Roles</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => setActiveTab('branding')}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 text-left flex items-center justify-between"
                >
                  <span>Update Platform Branding & Logo</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => setActiveTab('treasury')}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 text-left flex items-center justify-between"
                >
                  <span>Review Pending Withdrawal Queue</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Real-Time Audit Stream (Book 17)</span>
                </h4>
                <button
                  onClick={() => setActiveTab('audit_log')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  View Complete Log
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
      {/* 2. PLATFORM BRANDING & IDENTITY (DYNAMIC SETTINGS)                        */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Platform Branding & Company Details</h3>
            <p className="text-xs text-slate-400">
              Changes made here are stored in the database and automatically reflect on the public website, member dashboard, and emails.
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
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
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
              <label className="block font-bold text-slate-300 mb-1">Support Phone</label>
              <input
                type="text"
                value={brandingForm.supportPhone}
                onChange={(e) => setBrandingForm({ ...brandingForm, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Footer Copyright Text</label>
              <input
                type="text"
                value={brandingForm.copyrightText}
                onChange={(e) => setBrandingForm({ ...brandingForm, copyrightText: e.target.value })}
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
              <span>Save Branding Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. THEME & HOMEPAGE APPEARANCE (DYNAMIC CMS)                             */}
      {/* ========================================================================= */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSaveAppearance} className="max-w-4xl space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Homepage & Theme Customization</h3>
            <p className="text-xs text-slate-400">
              Customize primary colors, hero copy, and the home page video without deploying new code.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Homepage Hero Badge Text</label>
              <input
                type="text"
                value={homepageForm.heroBadge}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={homepageForm.heroHeadline}
                  onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Headline Highlight Text (Gradient)</label>
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
              <label className="block font-bold text-slate-300 mb-1">Homepage YouTube Master Video URL</label>
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
              <span>Save Appearance & CMS Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. USER DIRECTORY, ROLES & IMPERSONATION                                  */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, email, or member ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="member">Member</option>
                <option value="admin">Administrator</option>
                <option value="super_admin">Super Administrator</option>
              </select>
            </div>
          </div>

          {/* User Table */}
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
      {/* 5. MEMBERSHIP PLANS & PRICING                                             */}
      {/* ========================================================================= */}
      {activeTab === 'memberships' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tier: 'Launch Plan', price: 100, renewal: 50, bvCap: 1000, features: ['1 Landing Page (3 Templates)', 'CRM (100 Leads)', '10% Binary Bonus'] },
            { tier: 'Growth Plan', price: 300, renewal: 50, bvCap: 5000, features: ['1 Landing Page (3 Templates)', 'AI Business Center', 'CRM Automation', 'Marketplace Seller Store', '10% Binary Bonus'] },
            { tier: 'Legacy Plan', price: 500, renewal: 50, bvCap: 25000, features: ['1 Landing Page (3 Templates)', 'VIP Binary Placement', 'Full AI Suite', 'Max Commission Caps', 'Dedicated Mentorship'] },
          ].map((plan, i) => (
            <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{plan.tier}</span>
                <span className="text-xs text-slate-400 font-mono">${plan.price}/yr</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p><b>Annual Renewal Fee:</b> ${plan.renewal}/yr</p>
                <p><b>Weekly Binary Cap:</b> ${plan.bvCap.toLocaleString()}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                {plan.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert(`Plan parameters saved for ${plan.tier}.`)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Configure Entitlements
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CORPORATE INBOUND LEADS (BOOK 7)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'corporate_leads' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Inbound Corporate Sales Inquiries</h3>
            <span className="text-xs text-slate-400">Captured via Corporate Contact Form</span>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Contact Name & Company</th>
                  <th className="p-4">Lead Source</th>
                  <th className="p-4">Assigned Rep</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {corporateLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      <p className="font-bold text-white">{lead.name}</p>
                      <p className="text-[10px] text-slate-400">{lead.company} • {lead.email}</p>
                    </td>
                    <td className="p-4 font-mono text-indigo-400">{lead.source}</td>
                    <td className="p-4">{lead.assignedTo}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => alert(`Opening CRM communications thread with ${lead.name}`)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                      >
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TREASURY & WITHDRAWAL QUEUE                                            */}
      {/* ========================================================================= */}
      {activeTab === 'treasury' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Pending Withdrawal Authorizations</h3>

            <div className="space-y-3">
              {payoutList.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{p.memberName} ({p.memberId})</p>
                    <p className="text-[10px] text-slate-400">{p.method} • {p.destinationAddress}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-white text-sm">${p.amount.toFixed(2)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      p.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {p.status}
                    </span>

                    {p.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectPayout(p.id)}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. AUDIT LOGS (BOOK 17)                                                   */}
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
    </div>
  );
};
