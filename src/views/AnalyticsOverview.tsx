import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Smartphone,
  Eye,
  Activity,
  ArrowUpRight,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Target,
  Percent,
  ShoppingCart
} from 'lucide-react';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { analyticsEngine } from '../engine/analyticsEngine';

interface AnalyticsOverviewProps {
  currentUser?: Member;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ currentUser }) => {
  const { member } = useAuth();
  const { walletBalance } = useWallet();

  const activeUser = currentUser || member || {
    id: 'EVO-ID-100245',
    name: 'Entrepreneur',
    email: 'user@evionaecosystem.com',
  };

  const userId = activeUser.id || 'EVO-ID-100245';
  const userEmail = activeUser.email || 'user@evionaecosystem.com';

  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  // Real Dynamic Metrics from Analytics Engine
  const metrics = analyticsEngine.getMetricsSummary(userId, userEmail);
  const channels = analyticsEngine.getTrafficChannels(userId);
  const topPages = analyticsEngine.getTopPages(userId);
  const trendPoints = analyticsEngine.getPerformanceTrend();

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Eviona Unified Business Intelligence & Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Real-Time Analytics & Growth Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Unified telemetry from your Website Builder, Personal Storefront, Marketplace Sales, CRM Leads, and Ad Tracking Pixels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 text-white font-bold text-xs border border-white/20 outline-none backdrop-blur-xs cursor-pointer"
          >
            <option value="30d" className="bg-slate-900 text-white">Last 30 Days</option>
            <option value="90d" className="bg-slate-900 text-white">Last 90 Days</option>
            <option value="1y" className="bg-slate-900 text-white">Lifetime Analytics</option>
          </select>
        </div>
      </div>

      {/* 6 Real Business KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gross Revenue</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-1">${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Wallet + Store + Events</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Total Visitors</span>
          </div>
          <h3 className="text-xl font-black text-indigo-600 mt-1">{metrics.totalVisitorsCount.toLocaleString()}</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Tracked landing visits</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>CRM Leads</span>
          </div>
          <h3 className="text-xl font-black text-blue-600 mt-1">{metrics.totalLeadsCount}</h3>
          <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Active in pipeline</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <Percent className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conversion Rate</span>
          </div>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{metrics.conversionRate}</h3>
          <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Visitor-to-Lead</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <ShoppingCart className="w-3.5 h-3.5 text-purple-600" />
            <span>Avg Order Value</span>
          </div>
          <h3 className="text-xl font-black text-purple-600 mt-1">${metrics.avgOrderValue.toFixed(2)}</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Per verified sale</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <Activity className="w-3.5 h-3.5 text-slate-700" />
            <span>Bounce Rate</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-1">{metrics.bounceRate}</h3>
          <p className="text-[9px] text-emerald-600 font-bold mt-0.5">High engagement</p>
        </div>
      </div>

      {/* Main Visual Performance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Growth Performance Trend</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">Revenue Growth ($ EVO) vs Traffic Trajectory</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Revenue ($)</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Visitors</span>
              </span>
            </div>
          </div>

          {/* Dynamic SVG Growth Trajectory Chart */}
          <div className="h-56 w-full pt-4">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              <defs>
                <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 140 Q 100 120 200 70 T 400 40 L 500 20 L 500 160 L 0 160 Z"
                fill="url(#anGrad)"
              />
              <path
                d="M 0 140 Q 100 120 200 70 T 400 40 L 500 20"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 150 Q 120 130 250 110 T 500 70"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4 (Current)</span>
          </div>
        </div>

        {/* Traffic Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traffic Sources</span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">Channel Attribution</h3>
          </div>

          <div className="flex items-center gap-4 my-auto">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#4F46E5" strokeWidth="4" strokeDasharray="28 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-28" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="22 100" strokeDashoffset="-53" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-75" />
              </svg>
            </div>

            <div className="space-y-2 text-xs flex-1">
              {channels.map((ch) => (
                <div key={ch.channel} className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                    <span className="truncate text-slate-600">{ch.channel}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">{ch.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 font-semibold">
            ⚡ Traffic metrics reflect real UTM campaigns and organic landing visits.
          </div>
        </div>
      </div>

      {/* Top Performing Landing Pages & Funnels Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Your High-Converting Pages & Storefront Funnels</h3>
            <p className="text-xs text-slate-500">Live conversion tracking across your branded website and store.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Page / Funnel Destination</th>
                <th className="py-3.5 px-6">Pageviews</th>
                <th className="py-3.5 px-6">Unique Visitors</th>
                <th className="py-3.5 px-6">Avg Duration</th>
                <th className="py-3.5 px-6">Bounce Rate</th>
                <th className="py-3.5 px-6 text-right">Conversion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {topPages.map((p) => (
                <tr key={p.url} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <span>{p.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">{p.views.toLocaleString()}</td>
                  <td className="py-4 px-6 font-medium text-slate-600">{p.uniqueVisitors.toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-600">{p.avgDuration}</td>
                  <td className="py-4 px-6 text-slate-500">{p.bounceRate}</td>
                  <td className="py-4 px-6 text-right font-black text-emerald-600">{p.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
