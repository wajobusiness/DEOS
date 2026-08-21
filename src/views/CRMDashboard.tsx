import React, { useState } from 'react';
import {
  Contact2,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { initialLeads, initialDeals } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const CRMDashboard: React.FC = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  const funnelStages = [
    { name: 'New Leads', count: 128, pct: '100%', color: 'bg-indigo-600' },
    { name: 'Qualified', count: 85, pct: '66%', color: 'bg-blue-500' },
    { name: 'Proposal Sent', count: 56, pct: '44%', color: 'bg-purple-500' },
    { name: 'In Negotiation', count: 36, pct: '28%', color: 'bg-amber-500' },
    { name: 'Deals Won', count: 18, pct: '14%', color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Leads</span>
            <Contact2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">1,248</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +18.4% this month</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Contacts</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">842</h3>
          <p className="text-xs text-slate-400 mt-1">Verified prospects</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Deals</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">36</h3>
          <p className="text-xs text-slate-400 mt-1">In active sales pipeline</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Deals Won</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">18</h3>
          <p className="text-xs text-slate-400 mt-1">50% closing velocity</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pipeline Value</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$24,560</h3>
          <p className="text-xs text-slate-400 mt-1">Forecasted Q2 revenue</p>
        </div>
      </div>

      {/* 5-Stage Sales Funnel & Source Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5-Stage Funnel Visualizer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Conversion Funnel</h4>
                <p className="text-xs text-slate-400">Step-by-step pipeline conversion rate</p>
              </div>
              <Badge variant="info" size="sm">Real-time Attribution</Badge>
            </div>

            <div className="space-y-4 my-2">
              {funnelStages.map((st) => (
                <div key={st.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{st.name} ({st.count})</span>
                    <span className="text-slate-500">{st.pct}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${st.color}`} style={{ width: st.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 mt-4">
            <b>Rule (Book 7):</b> Leads captured from member websites carry permanent immutable attribution.
          </div>
        </div>

        {/* Lead Sources Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Lead Source Breakdown
          </h4>

          <div className="flex items-center gap-4 my-auto">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="4" />
                {/* Website Form 35% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#4F46E5" strokeWidth="4" strokeDasharray="35 100" strokeDashoffset="0" />
                {/* Facebook Ads 25% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-35" />
                {/* LinkedIn 20% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-60" />
                {/* Referral 10% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-80" />
              </svg>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-600"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Website Form</span>
                <span className="font-bold text-slate-900">35%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-600"><span className="w-2 h-2 rounded-full bg-blue-500" /> FB Ads</span>
                <span className="font-bold text-slate-900">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> LinkedIn</span>
                <span className="font-bold text-slate-900">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-500" /> Referral</span>
                <span className="font-bold text-slate-900">10%</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900">
            Automated email nurture sequences trigger upon lead capture.
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Recent Prospect Leads</h4>
            <p className="text-xs text-slate-500">Tracked with immutable source origin and contact histories</p>
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Lead Name</th>
                <th className="py-3.5 px-6">Company</th>
                <th className="py-3.5 px-6">Source (Immutable)</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date Added</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={l.avatar} alt={l.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{l.name}</p>
                      <p className="text-[10px] text-slate-400">ID: {l.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{l.company}</td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {l.source}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={l.status === 'New' ? 'info' : l.status === 'Qualified' ? 'success' : 'warning'} size="sm">
                      {l.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{l.createdAt}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1 hover:text-indigo-600"><Mail className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-indigo-600"><Phone className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New CRM Lead</h3>
            <p className="text-xs text-slate-500 mb-4">Record prospect information into your sales pipeline.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Rivera Media"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source Attribution</label>
                <input
                  type="text"
                  defaultValue="Manual Direct Entry"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Lead saved into pipeline.');
                    setShowAddLeadModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Save Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

