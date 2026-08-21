import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileText,
  PhoneCall,
  Video,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { systemStatuses } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const SupportCommunity: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const categories = [
    { title: 'Getting Started', desc: '15-step Business Launch Wizard guide', count: '14 Articles' },
    { title: 'Wallet & Deposits', desc: 'TRC20, card, and coin conversions', count: '18 Articles' },
    { title: 'Binary Network Plan', desc: '10% binary rules, spillover & BV', count: '22 Articles' },
    { title: 'Website Builder', desc: 'Custom domains, DNS & templates', count: '16 Articles' },
    { title: 'AI Business Center', desc: 'Prompts, credits, and disclosures', count: '12 Articles' },
  ];

  const tickets = [
    { id: '#TKT-2487', subject: 'Custom Domain SSL Auto-renewal confirmation', status: 'In Progress', date: 'Today, 09:30 AM' },
    { id: '#TKT-2481', subject: 'Binary Leg Carry Forward BV reconciliation', status: 'Closed', date: 'May 18, 2025' },
    { id: '#TKT-2470', subject: 'Marketplace Seller Payout schedule question', status: 'Closed', date: 'May 12, 2025' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Knowledge Search Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-card text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How Can We Help You Today?
          </h2>

          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search help articles, binary guides, payout tutorials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-xs font-semibold placeholder-slate-400 outline-none shadow-lg"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-1 text-[11px] text-indigo-200">
            <span>Popular:</span>
            <button className="underline hover:text-white">Connecting Custom Domain</button>
            <span>•</span>
            <button className="underline hover:text-white">USDT TRC20 Deposit Time</button>
            <span>•</span>
            <button className="underline hover:text-white">Binary 10% Calculation</button>
          </div>
        </div>
      </div>

      {/* 5 Help Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((c) => (
          <div
            key={c.title}
            onClick={() => alert(`Opening knowledge category: ${c.title}`)}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {c.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">{c.desc}</p>
            </div>
            <p className="text-[10px] font-bold text-indigo-600 mt-4">{c.count}</p>
          </div>
        ))}
      </div>

      {/* 4 Support Channels & Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support Channels & Tickets (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 4 Support Channel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setShowNewTicketModal(true)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <Plus className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-slate-900">Submit Ticket</h5>
              <p className="text-[10px] text-slate-400">Response within 2 hours</p>
            </div>

            <div
              onClick={() => alert('Starting Live Chat session...')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-slate-900">Live Chat</h5>
              <p className="text-[10px] text-emerald-600 font-semibold">● Online Now</p>
            </div>

            <div
              onClick={() => alert('Requesting callback support...')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-slate-900">Request Call</h5>
              <p className="text-[10px] text-slate-400">VIP & Legacy tier</p>
            </div>

            <div
              onClick={() => alert('Opening Video Tutorials hub...')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <Video className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-slate-900">Video Guides</h5>
              <p className="text-[10px] text-slate-400">50+ Walkthroughs</p>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Your Support Tickets</h4>
                <p className="text-xs text-slate-500">Track and respond to open inquiries</p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
              >
                + New Ticket
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6">Ticket ID</th>
                    <th className="py-3 px-6">Subject</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                      <td className="py-3.5 px-6 font-mono font-bold text-indigo-600">{t.id}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900">{t.subject}</td>
                      <td className="py-3.5 px-6">
                        <Badge variant={t.status === 'In Progress' ? 'warning' : 'success'} size="sm">
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-6 text-right text-slate-400">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live System Status & Community Highlights (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live System Status */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live System Health</h4>
              <Badge variant="success" size="sm">● All Operational</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              {systemStatuses.map((s) => (
                <div key={s.service} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-semibold text-slate-700">{s.service}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{s.latency}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Card */}
          <div className="bg-gradient-to-tr from-indigo-950 to-purple-950 text-white rounded-2xl p-6 border border-indigo-500/30 shadow-card space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-300" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">DEOS Global Community</h4>
            </div>
            <p className="text-xs text-indigo-200">
              Join 50,000+ entrepreneurs sharing funnels, marketing strategies, and mastermind insights.
            </p>
            <button
              onClick={() => alert('Redirecting to DEOS Community Discord / Forum...')}
              className="w-full py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md"
            >
              Join Discussion Forum
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Support Ticket</h3>
            <p className="text-xs text-slate-500 mb-4">Our dedicated technical support team responds within 2 hours.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500">
                  <option>Technical & Website Builder</option>
                  <option>Wallet & Payout Operations</option>
                  <option>Binary Network & Commissions</option>
                  <option>Marketplace Orders</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Summary of issue..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide transaction IDs or specific page URLs if applicable..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Ticket #TKT-2488 created successfully.');
                    setShowNewTicketModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

