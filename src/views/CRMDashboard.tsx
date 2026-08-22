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
  CheckCircle2,
  Search,
  ShieldCheck,
  Building2,
  ExternalLink,
  MessageSquare,
  X,
  UserCheck
} from 'lucide-react';
import { initialLeads, initialDeals } from '../store/mockData';
import { Lead } from '../types';
import { Badge } from '../components/common/Badge';

export const CRMDashboard: React.FC = () => {
  // Member CRM only displays leads owned by the member (ownerType === 'member')
  const [memberLeads, setMemberLeads] = useState<Lead[]>(
    initialLeads.filter(l => l.ownerType === 'member')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('Personal Website Form');

  const funnelStages = [
    { name: 'New Leads', count: 128, pct: '100%', color: 'bg-indigo-600' },
    { name: 'Qualified', count: 85, pct: '66%', color: 'bg-blue-500' },
    { name: 'Proposal Sent', count: 56, pct: '44%', color: 'bg-purple-500' },
    { name: 'In Negotiation', count: 36, pct: '28%', color: 'bg-amber-500' },
    { name: 'Deals Won', count: 18, pct: '14%', color: 'bg-emerald-500' },
  ];

  const filteredLeads = memberLeads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;

    const newLead: Lead = {
      id: `LED-${Date.now().toString().slice(-4)}`,
      name: newLeadName,
      email: newLeadEmail || 'lead@example.com',
      phone: newLeadPhone || '+1 555 000 0000',
      company: newLeadCompany || 'Independent Prospect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      leadSource: 'member_landing_page',
      ownerType: 'member',
      ownerId: 'EVO100245',
      ownerName: 'You',
      source: newLeadSource,
      status: 'New',
      stage: 'New',
      dealValue: 5000,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setMemberLeads(prev => [newLead, ...prev]);
    setShowAddLeadModal(false);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadCompany('');
  };

  const handleStatusChange = (leadId: string, newStatus: any) => {
    setMemberLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Member Isolated CRM with Permanent Source Tagging */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200">
              Personal Member CRM (Book 7)
            </span>
            <span className="text-[10px] text-emerald-300 font-bold">● Isolated Tenant Workspace</span>
          </div>
          <h2 className="text-2xl font-extrabold">Your Customer Pipeline & Lead Engine</h2>
          <p className="text-xs text-indigo-200 mt-0.5">
            Every lead captured on your personal landing page (<code className="font-mono text-white">johnsonagency.com</code>) is owned by you.
          </p>
        </div>

        <button
          onClick={() => setShowAddLeadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-stretch md:self-auto justify-center transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Lead</span>
        </button>
      </div>

      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">My Total Leads</span>
            <Contact2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{memberLeads.length}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +100% Owned by You</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Qualified</span>
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">
            {memberLeads.filter(l => l.status === 'Qualified' || l.status === 'Contacted').length}
          </h3>
          <p className="text-xs text-slate-400 mt-1">High conversion intent</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Deals</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">4</h3>
          <p className="text-xs text-slate-400 mt-1">In active sales funnel</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Deals Won</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">2</h3>
          <p className="text-xs text-slate-400 mt-1">Converted to clients</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pipeline Value</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$27,450</h3>
          <p className="text-xs text-slate-400 mt-1">Forecasted Q2 volume</p>
        </div>
      </div>

      {/* 5-Stage Sales Funnel & Source Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${st.color} rounded-full`} style={{ width: st.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Average closing velocity: 12 days</span>
            <span className="font-semibold text-indigo-600">62% Funnel Efficiency</span>
          </div>
        </div>

        {/* Lead Sources Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Top Lead Sources</h4>
            <div className="space-y-3">
              {[
                { source: 'Personal Landing Page', count: '48%', color: 'bg-indigo-600' },
                { source: 'Facebook Ad Campaign', count: '28%', color: 'bg-purple-600' },
                { source: 'LinkedIn Direct Message', count: '14%', color: 'bg-blue-500' },
                { source: 'Direct Referral Code', count: '10%', color: 'bg-emerald-500' },
              ].map((s) => (
                <div key={s.source} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="font-medium text-slate-700">{s.source}</span>
                  </div>
                  <span className="font-bold text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-4 text-[11px] text-slate-500">
            🔒 <b>Data Ownership Guarantee:</b> All leads belong exclusively to your entrepreneur profile.
          </div>
        </div>
      </div>

      {/* Leads Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Leads Directory</h3>
            <p className="text-xs text-slate-500">Filter, update status, and manage contact relationships</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, company, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
              <tr>
                <th className="p-4">Lead Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Immutable Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{lead.name}</p>
                        <p className="text-[10px] text-slate-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 font-semibold">{lead.company}</td>
                  <td className="p-4">
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                        lead.status === 'New'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : lead.status === 'Contacted'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : lead.status === 'Qualified'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <Badge variant={lead.stage === 'Proposal' ? 'purple' : lead.stage === 'Negotiation' ? 'warning' : 'info'} size="sm">
                      {lead.stage || 'Qualified'}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{lead.createdAt}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="rachel@company.com"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 555 1234"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Media"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source Tag</label>
                <select
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Personal Website Form">Personal Landing Page Form</option>
                  <option value="Direct Networking / WhatsApp">Direct Networking / WhatsApp</option>
                  <option value="Facebook Ad Campaign">Facebook Ad Campaign</option>
                  <option value="Referral Code Direct">Referral Code Direct</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all mt-2"
              >
                Save Lead to CRM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={selectedLead.avatar} alt={selectedLead.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-500">{selectedLead.company}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email</span>
                <span className="font-bold text-slate-800 break-all">{selectedLead.email || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone</span>
                <span className="font-bold text-slate-800">{selectedLead.phone || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Source</span>
                <span className="font-bold text-indigo-700">{selectedLead.source}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Owner</span>
                <span className="font-bold text-emerald-700">{selectedLead.ownerName || 'You (John Doe)'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Quick Outreach Actions</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => alert(`Opening email client to send sequence to ${selectedLead.email}`)}
                  className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => alert(`Calling ${selectedLead.phone}`)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => alert(`Opening calendar to schedule appointment with ${selectedLead.name}`)}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Meeting</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
