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
  Sparkles
} from 'lucide-react';
import { Member, ViewType } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { Badge } from '../components/common/Badge';

import { LaunchWizardModal } from '../components/common/LaunchWizardModal';

interface UserDashboardProps {
  currentUser: Member;
  onNavigate: (view: ViewType) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [showWizard, setShowWizard] = React.useState(false);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 15-Step Launch Wizard Modal */}
      <LaunchWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onNavigate={onNavigate}
      />

      {/* Plan Status & Launch Progress Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-xl">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Good morning, {currentUser.name}! 👋
              </h2>
              <Badge variant="purple" size="sm">
                GROWTH PLAN
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Member since {currentUser.memberSince} • Annual renewal due {currentUser.renewalDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowWizard(true)}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Launch Wizard (10/15)</span>
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

      {/* 5 KPI Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Earnings"
          value="$24,560.00"
          change="+12.5%"
          subtitle="vs last month"
          icon={DollarSign}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          onClick={() => onNavigate('wallet')}
        />
        <MetricCard
          title="Wallet Balance"
          value={`$${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="USDT Available"
          icon={Wallet}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          onClick={() => onNavigate('wallet')}
        />
        <MetricCard
          title="Binary Volume (BV)"
          value="125,000 BV"
          change="+18.2%"
          subtitle="10% flat rate"
          icon={Network}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => onNavigate('binary')}
        />
        <MetricCard
          title="Active Referrals"
          value="256"
          change="+15"
          subtitle="this week"
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
        {/* Earnings Overview Chart Card (7 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Earnings Overview
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-extrabold text-slate-900">$24,560.00</h3>
                <span className="text-xs font-bold text-emerald-600">↑ 12.5%</span>
              </div>
            </div>
            <select className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 outline-none">
              <option>This Month</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Styled SVG Line Chart */}
          <div className="h-48 w-full mt-4 flex flex-col justify-end">
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 120 Q 50 100 100 80 T 200 60 T 300 40 T 400 20 L 400 150 L 0 150 Z"
                fill="url(#earningsGradient)"
              />
              <path
                d="M 0 120 Q 50 100 100 80 T 200 60 T 300 40 T 400 20"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Highlight points */}
              <circle cx="200" cy="60" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="400" cy="20" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
              <span>1 May</span>
              <span>6 May</span>
              <span>11 May</span>
              <span>16 May</span>
              <span>21 May</span>
              <span>26 May</span>
              <span>31 May</span>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown Donut Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Earnings Breakdown
            </h4>
            <span className="text-xs text-indigo-600 font-bold">$24,560 Total</span>
          </div>

          <div className="flex items-center gap-6 my-auto">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="4" />
                {/* Binary 50.5% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#4F46E5" strokeWidth="4" strokeDasharray="44.4 100" strokeDashoffset="0" />
                {/* Partner 25.5% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="22.4 100" strokeDashoffset="-44.4" />
                {/* Generation 15.9% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="14 100" strokeDashoffset="-66.8" />
                {/* Marketplace 8.1% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="7.1 100" strokeDashoffset="-80.8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-900">$24.5k</span>
                <span className="text-[9px] text-slate-400 font-medium">Earned</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  Binary Bonus
                </span>
                <span className="font-bold text-slate-900">$12,400</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Partner Comm.
                </span>
                <span className="font-bold text-slate-900">$6,250</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Generation
                </span>
                <span className="font-bold text-slate-900">$3,900</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Marketplace
                </span>
                <span className="font-bold text-slate-900">$2,010</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities (3 cols) */}
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
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Binary Bonus</p>
                  <p className="text-[10px] text-slate-400">Today, 10:24 AM</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600">+$250.00</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Partner Comm.</p>
                  <p className="text-[10px] text-slate-400">Today, 09:15 AM</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600">+$120.00</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Marketplace Sale</p>
                  <p className="text-[10px] text-slate-400">Yesterday, 08:45 PM</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600">+$80.00</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Withdrawal</p>
                  <p className="text-[10px] text-slate-400">May 15, 2025</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">-$200.00</span>
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
                  <p className="text-xs font-bold text-white">johnsonagency.com</p>
                  <p className="text-[10px] text-slate-400">SSL & Hosting Active</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>

            <p className="text-[11px] text-slate-500">
              Last updated: Today, 08:30 AM • Connected to CRM Lead Capture
            </p>
          </div>

          <div className="flex gap-2.5 mt-4">
            <button
              onClick={() => onNavigate('builder')}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Edit Website
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              View Live
            </button>
          </div>
        </div>

        {/* AI Business Assistant Banner (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl p-6 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <Bot className="w-6 h-6 text-indigo-200" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">
              AI Business Assistant
            </h4>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              Get content ideas, marketing copy, and automated business strategies to scale your revenue.
            </p>
          </div>

          <button
            onClick={() => onNavigate('ai-center')}
            className="mt-4 inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 text-xs font-bold shadow-md transition-all group"
          >
            <span>Open AI Business Center</span>
            <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Quick Actions 8-Grid (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h4>

          <div className="grid grid-cols-4 gap-2.5 text-center">
            <button
              onClick={() => onNavigate('deposit')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Deposit</span>
            </button>

            <button
              onClick={() => onNavigate('wallet')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Withdraw</span>
            </button>

            <button
              onClick={() => onNavigate('binary')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Buy BV</span>
            </button>

            <button
              onClick={() => onNavigate('team')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Invite</span>
            </button>

            <button
              onClick={() => onNavigate('sellers')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Product</span>
            </button>

            <button
              onClick={() => onNavigate('marketing')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Megaphone className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Campaign</span>
            </button>

            <button
              onClick={() => onNavigate('ai-center')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">AI Writer</span>
            </button>

            <button
              onClick={() => onNavigate('support')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex flex-col items-center gap-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700">Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Team Overview, Academy Progress & Marketplace Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                My Team Overview
              </h4>
              <Badge variant="info" size="sm">Balanced (2:1)</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Total Size</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">256</p>
              </div>
              <div className="border-x border-slate-200 px-1">
                <p className="text-[10px] text-slate-400 font-semibold">Left Leg</p>
                <p className="text-lg font-bold text-indigo-600 mt-0.5">128</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Right Leg</p>
                <p className="text-lg font-bold text-purple-600 mt-0.5">128</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('binary')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Binary Tree</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Academy Progress (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Academy Progress
              </h4>
              <span className="text-xs font-bold text-indigo-600">75% Complete</span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Digital Marketing Masterclass
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Lesson 14: Social Media Ad Funnels
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-[75%]" />
            </div>
          </div>

          <button
            onClick={() => onNavigate('academy')}
            className="w-full mt-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            Continue Learning
          </button>
        </div>

        {/* Marketplace Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Marketplace Overview
              </h4>
              <button onClick={() => onNavigate('marketplace')} className="text-xs font-bold text-indigo-600">
                View Catalog
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Total Sales</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">$1,850</p>
              </div>
              <div className="border-x border-slate-200 px-1">
                <p className="text-[10px] text-slate-400 font-semibold">Orders</p>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">27</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Earned</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">$925</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('sellers')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Open Seller Center
          </button>
        </div>
      </div>
    </div>
  );
};
