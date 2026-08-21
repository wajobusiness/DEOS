import React from 'react';
import {
  Megaphone,
  Mail,
  Smartphone,
  Share2,
  GitFork,
  Globe,
  Magnet,
  FormInput,
  Bot,
  Calendar,
  Bell,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const MarketingCenter: React.FC = () => {
  const tools = [
    { title: 'Email Marketing', desc: 'Automated newsletters & broadcasts', icon: Mail, stats: '32.6% Open Rate' },
    { title: 'SMS Marketing', desc: 'Direct mobile alerts & SMS blasts', icon: Smartphone, stats: '98% Deliverability' },
    { title: 'Social Media Planner', desc: 'Schedule posts across 5 networks', icon: Share2, stats: '12 Scheduled' },
    { title: 'Automation Workflows', desc: 'Trigger-based customer nurture funnels', icon: GitFork, stats: '8 Active' },
    { title: 'Landing Page Funnels', desc: 'High-converting lead capture pages', icon: Globe, stats: '14 Live' },
    { title: 'Lead Magnets', desc: 'Deliver free ebooks & resources', icon: Magnet, stats: '840 Downloads' },
    { title: 'Forms & Surveys', desc: 'Embeddable interactive feedback forms', icon: FormInput, stats: '1,240 Responses' },
    { title: 'AI Chatbot Builder', desc: '24/7 lead qualification assistant', icon: Bot, stats: '94% Answer Rate' },
    { title: 'Webinars & Live Streams', desc: 'Host live sales events & training', icon: Calendar, stats: '4 Upcoming' },
    { title: 'Web Push Notifications', desc: 'Instant browser alerts & updates', icon: Bell, stats: '3,200 Subscribers' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Growth & Multichannel Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Plan. Create. Automate. Grow.
          </h2>
          <p className="text-xs text-indigo-200">
            Scale your business audience using AI-driven campaigns, SMS relays, and automated funnel flows.
          </p>
        </div>

        <button
          onClick={() => alert('New campaign creation wizard opened.')}
          className="px-6 py-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* Campaign KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Campaigns</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">68</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ 4 active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Leads</p>
          <h3 className="text-xl font-black text-indigo-600 mt-1">2,450</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">All sources</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Emails Sent</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">24,580</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">This month</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Open Rate</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">32.6%</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ +4.2%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Click Rate</p>
          <h3 className="text-xl font-black text-purple-600 mt-1">8.7%</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">High intent</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Conversions</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">186</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Deals won</p>
        </div>
      </div>

      {/* 10 Marketing Modules Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Marketing Tools Suite
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                onClick={() => alert(`Opened ${t.title}`)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t.desc}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-700">{t.stats}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

