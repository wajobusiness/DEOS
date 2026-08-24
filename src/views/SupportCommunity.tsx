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
  Users,
  Clock,
  Send,
  ShieldCheck
} from 'lucide-react';
import { systemStatuses } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const SupportCommunity: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketDepartment, setTicketDepartment] = useState('Technical & Website Builder');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const categories = [
    { title: 'Getting Started', desc: '15-step Business Launch Wizard guide', count: '14 Articles' },
    { title: 'Wallet & Deposits', desc: 'TRC20, card, and coin conversions', count: '18 Articles' },
    { title: 'Binary Network Plan', desc: '10% binary rules, spillover & BV', count: '22 Articles' },
    { title: 'Website Builder', desc: 'Custom domains, DNS & templates', count: '16 Articles' },
    { title: 'AI Business Center', desc: 'Prompts, credits, and disclosures', count: '12 Articles' },
  ];

  const [userTickets, setUserTickets] = useState([
    { id: '#TKT-2487', subject: 'Custom Domain SSL Auto-renewal confirmation', department: 'Website Builder', status: 'In Progress', date: 'Today, 09:30 AM' },
    { id: '#TKT-2481', subject: 'Binary Leg Carry Forward BV reconciliation', department: 'Binary Network', status: 'Resolved', date: 'May 18, 2026' },
    { id: '#TKT-2470', subject: 'Marketplace Seller Payout schedule question', department: 'Wallet Operations', status: 'Resolved', date: 'May 12, 2026' },
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    const newTicket = {
      id: `#TKT-${Math.floor(2488 + Math.random() * 1000)}`,
      subject: ticketSubject,
      department: ticketDepartment,
      status: 'Open',
      date: 'Just now',
    };

    setUserTickets(prev => [newTicket, ...prev]);
    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketDescription('');
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Knowledge Search Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-8 text-white shadow-card text-center relative overflow-hidden border border-indigo-500/20">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            How Can We Help You Scale Today?
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
            <button onClick={() => setSearch('Connecting Custom Domain')} className="underline hover:text-white">Connecting Custom Domain</button>
            <span>•</span>
            <button onClick={() => setSearch('USDT TRC20 Deposit Time')} className="underline hover:text-white">USDT TRC20 Deposit Time</button>
            <span>•</span>
            <button onClick={() => setSearch('Binary 10% Calculation')} className="underline hover:text-white">Binary 10% Calculation</button>
          </div>
        </div>
      </div>

      {/* 5 Help Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((c) => (
          <div
            key={c.title}
            onClick={() => setSearch(c.title)}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
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
            {[
              { title: 'Live Chat', desc: 'Instant 24/7 AI & Agent Support', icon: MessageSquare, action: 'Start Chat', color: 'bg-blue-50 text-blue-600' },
              { title: 'Tickets', desc: 'Guaranteed 2-hour response SLA', icon: FileText, action: 'Open Ticket', color: 'bg-purple-50 text-purple-600', onClick: () => setShowNewTicketModal(true) },
              { title: 'Community', desc: '50,000+ Mastermind Members', icon: Users, action: 'Join Community', color: 'bg-emerald-50 text-emerald-600' },
              { title: '1-on-1 Call', desc: 'VIP Concierge for Legacy Tier', icon: PhoneCall, action: 'Book Strategy', color: 'bg-amber-50 text-amber-600' },
            ].map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.title} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col justify-between">
                  <div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${ch.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{ch.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ch.desc}</p>
                  </div>
                  <button
                    onClick={ch.onClick || (() => alert(`Triggered ${ch.title}`))}
                    className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-[11px] text-slate-700 transition-colors"
                  >
                    {ch.action}
                  </button>
                </div>
              );
            })}
          </div>

          {/* User Active Tickets Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Your Support Tickets</h4>
                <p className="text-xs text-slate-500">Track and respond to your active technical inquiries</p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Ticket</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {userTickets.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600">{t.id}</span>
                      <h5 className="font-bold text-slate-900">{t.subject}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400">{t.department} • {t.date}</p>
                  </div>

                  <Badge variant={t.status === 'Resolved' ? 'emerald' : t.status === 'In Progress' ? 'purple' : 'warning'} size="sm">
                    {t.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Status & Community (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Real-time System Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Live System Status</h4>
              <Badge variant="emerald" size="sm">100% Operational</Badge>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { service: 'Central API Gateway', latency: '12ms', status: 'operational' },
                { service: 'TRON TRC20 RPC Node', latency: '45ms', status: 'operational' },
                { service: 'Dynamic Domain Routing (DNS)', latency: '8ms', status: 'operational' },
                { service: 'AI Co-Pilot LLM Cluster', latency: '120ms', status: 'operational' },
              ].map((s) => (
                <div key={s.service} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-700">{s.service}</span>
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
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Eviona Global Mastermind</h4>
            </div>
            <p className="text-xs text-indigo-200">
              Join 50,000+ entrepreneurs sharing funnels, marketing campaigns, and growth playbooks.
            </p>
            <button
              onClick={() => alert('Redirecting to Eviona Community Mastermind forum...')}
              className="w-full py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md"
            >
              Join Discussion Forum
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Create Support Ticket</h3>
                <p className="text-xs text-slate-500">Our dedicated team responds within 2 business hours.</p>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={ticketDepartment}
                  onChange={(e) => setTicketDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option>Technical & Website Builder</option>
                  <option>Wallet & Payout Operations</option>
                  <option>Binary Network & Commissions</option>
                  <option>Marketplace Orders</option>
                  <option>AI Business Center</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide transaction IDs or specific page URLs if applicable..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
