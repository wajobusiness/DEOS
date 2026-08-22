import React from 'react';
import {
  DollarSign,
  Wallet,
  Network,
  Users,
  Award,
  Globe,
  Bot,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ArrowDownLeft,
  Share2,
  Package,
  Megaphone,
  PenTool,
  HelpCircle,
  Play,
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Member, ViewType } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { Badge } from '../components/common/Badge';
import { LaunchWizardModal } from '../components/common/LaunchWizardModal';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

interface UserDashboardProps {
  currentUser: Member;
  onNavigate: (view: ViewType) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [showWizard, setShowWizard] = React.useState(false);
  const { branding, dashboard } = usePlatformSettings();

  // Dynamic user computations based on authenticated member profile
  const totalEarnings = currentUser.walletBalance + (currentUser.binaryVolume * 0.10);
  const binaryBV = currentUser.binaryVolume || 0;
  const directReferrals = currentUser.activeReferrals || 0;
  const subdomain = `${currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mybusiness'}.eviona.com`;

  const dynamicWelcome = (dashboard.welcomeHeadline || 'Good morning, {name}! 👋').replace(
    '{name}',
    currentUser.name || 'Entrepreneur'
  );

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Dynamic Global Admin Announcement Banner */}
      {dashboard.announcementBar?.enabled && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-sm animate-slideDown ${
            dashboard.announcementBar.severity === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : dashboard.announcementBar.severity === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 shrink-0" />
            <span>{dashboard.announcementBar.text}</span>
          </div>
        </div>
      )}

      {/* Launch Wizard Modal */}
      <LaunchWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onNavigate={onNavigate}
      />

      {/* Plan Status Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-xl">
            {currentUser.name?.charAt(0)?.toUpperCase() || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {dynamicWelcome}
              </h2>
              <Badge variant="purple" size="sm">
                {currentUser.plan.toUpperCase()} PLAN
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {branding.platformName} ID: <span className="font-mono font-bold text-indigo-600">{currentUser.id}</span> • Renewal Date: {currentUser.renewalDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowWizard(true)}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Launch Guide</span>
          </button>
          <button
            onClick={() => onNavigate('deposit')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>
        </div>
      </div>

      {/* 5 Dynamic KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Earnings"
          value={`$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Net commissions earned"
          icon={DollarSign}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          onClick={() => onNavigate('wallet')}
        />
        <MetricCard
          title="Wallet Balance"
          value={`$${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="EVO Available"
          icon={Wallet}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          onClick={() => onNavigate('wallet')}
        />
        <MetricCard
          title="Binary Volume (BV)"
          value={`${binaryBV.toLocaleString()} BV`}
          subtitle="10% flat binary payout"
          icon={Network}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => onNavigate('binary')}
        />
        <MetricCard
          title="Active Referrals"
          value={`${directReferrals}`}
          subtitle="Direct sponsors"
          icon={Users}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          onClick={() => onNavigate('team')}
        />
        <MetricCard
          title="Rank"
          value={currentUser.rank}
          subtitle={`Next: ${currentUser.nextRank}`}
          icon={Award}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          onClick={() => onNavigate('binary')}
        />
      </div>

      {/* Row 1: Earnings Analytics, Donut & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Earnings Overview Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Earnings Overview
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <select className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 outline-none">
              <option>This Month</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>

          {/* Styled SVG Chart */}
          <div className="h-48 w-full mt-4 flex flex-col justify-end">
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 Q 100 120 200 110 T 300 90 T 400 70 L 400 150 L 0 150 Z"
                fill="url(#earningsGradient)"
              />
              <path
                d="M 0 130 Q 100 120 200 110 T 300 90 T 400 70"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="200" cy="110" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="400" cy="70" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown Donut Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Earnings Breakdown
            </h4>
            <span className="text-xs text-indigo-600 font-bold">${totalEarnings.toFixed(2)} Total</span>
          </div>

          <div className="flex items-center gap-6 my-auto">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#4F46E5" strokeWidth="4" strokeDasharray="50 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-50" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-80" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-900">${totalEarnings.toFixed(0)}</span>
                <span className="text-[9px] text-slate-400 font-medium">Earned</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  Binary Bonus (10%)
                </span>
                <span className="font-bold text-slate-900">${(binaryBV * 0.10).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Direct Referrals
                </span>
                <span className="font-bold text-slate-900">${(directReferrals * 20).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Marketplace Store
                </span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recent Activity
            </h4>
            <button onClick={() => onNavigate('wallet')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Plan Activated</p>
                  <p className="text-[10px] text-slate-400">{currentUser.plan.toUpperCase()} Tier</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600">Active</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Eviona Wallet</p>
                  <p className="text-[10px] text-slate-400">Initialized</p>
                </div>
              </div>
              <span className="font-bold text-slate-700">0.00 EVO</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Landing Page Site</p>
                  <p className="text-[10px] text-slate-400">DNS Ready</p>
                </div>
              </div>
              <span className="font-bold text-indigo-600">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Website Card, AI Assistant Banner, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Website Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Your Business Website
              </span>
              <Badge variant="success" size="sm">● Live</Badge>
            </div>

            <div className="rounded-xl bg-slate-900 p-3 text-white flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-white">{subdomain}</p>
                  <p className="text-[10px] text-slate-400">SSL & Hosting Active</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('builder')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Edit Website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Theme Template:</span>
                <span className="font-semibold text-slate-900">Modern SaaS Pro</span>
              </div>
              <div className="flex justify-between">
                <span>Total Page Views:</span>
                <span className="font-semibold text-slate-900">0 views</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('builder')}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Edit Page</span>
            </button>
            <button
              onClick={() => onNavigate('domains')}
              className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Connect Domain</span>
            </button>
          </div>
        </div>

        {/* AI Business Assistant Banner (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 text-white border border-indigo-500/20 shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span>AI Business Center</span>
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Launch Your Next Marketing Campaign with AI
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Generate landing page copy, sales email sequences, and social media captions in seconds.
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={() => onNavigate('ai-center')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              <span>Open AI Business Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Operations Strip (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
            Quick Operations
          </span>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('crm')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <span>Manage CRM Leads</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <span>Browse Marketplace</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigate('binary')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <span>View Binary Matrix</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
            >
              <span>Digital Academy</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
