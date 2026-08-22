import React from 'react';
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
  Filter
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { Badge } from '../components/common/Badge';

export const AnalyticsOverview: React.FC = () => {
  const topPages = [
    { url: '/home (johnsonagency.com)', views: '14,250', unique: '9,840', avgTime: '3m 24s', bounce: '28.4%', conv: '8.2%' },
    { url: '/services/digital-marketing', views: '8,420', unique: '6,120', avgTime: '2m 45s', bounce: '32.1%', conv: '6.4%' },
    { url: '/products/ai-business-mastery', views: '6,890', unique: '5,200', avgTime: '4m 10s', bounce: '24.0%', conv: '12.5%' },
    { url: '/join-our-team (Binary Placement)', views: '4,520', unique: '3,890', avgTime: '5m 12s', bounce: '18.2%', conv: '15.4%' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 6 BI KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">$128,540</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ +15.4%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p>
          <h3 className="text-xl font-black text-indigo-600 mt-1">8,642</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Active profiles</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">New Leads</p>
          <h3 className="text-xl font-black text-blue-600 mt-1">2,450</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Captured</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Conversion Rate</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">6.42%</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ +0.8%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Order Value</p>
          <h3 className="text-xl font-black text-purple-600 mt-1">$85.32</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Per cart</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Bounce Rate</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">32.16%</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↓ 2.4% better</p>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multi-Metric Performance Trend</h4>
              <p className="text-lg font-bold text-slate-900 mt-0.5">Revenue ($) vs Visitor Traffic</p>
            </div>
            <select className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
          </div>

          <div className="h-52 w-full mt-4">
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
        </div>

        {/* Traffic Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Traffic Channels
          </h4>

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

            <div className="space-y-1 text-xs flex-1">
              <div className="flex justify-between"><span>Direct</span><span className="font-bold">28.4%</span></div>
              <div className="flex justify-between"><span>Organic</span><span className="font-bold">24.5%</span></div>
              <div className="flex justify-between"><span>Social</span><span className="font-bold">21.5%</span></div>
              <div className="flex justify-between"><span>Referral</span><span className="font-bold">15.5%</span></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500">
            Real-time tracking powered by Eviona Unified Analytics Engine.
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h4 className="text-sm font-bold text-slate-900">Top Performing Pages & Conversion Rates</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Page URL</th>
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
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{p.url}</td>
                  <td className="py-4 px-6">{p.views}</td>
                  <td className="py-4 px-6">{p.unique}</td>
                  <td className="py-4 px-6">{p.avgTime}</td>
                  <td className="py-4 px-6 text-slate-500">{p.bounce}</td>
                  <td className="py-4 px-6 text-right font-bold text-emerald-600">{p.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

