import React, { useState, useEffect } from 'react';
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
  UserCheck,
  Send,
  Sparkles,
  Clock,
  Play,
  Pause,
  Layers,
  Zap,
  Check,
  Share2
} from 'lucide-react';
import { Lead } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { crmEngine } from '../engine/crmEngine';

export const CRMDashboard: React.FC = () => {
  const { member } = useAuth();
  const activeUserId = member?.id || 'EVO-ID-100245';
  const activeUserName = member?.name || 'Entrepreneur';

  const [activeTab, setActiveTab] = useState<'pipeline' | 'sequences' | 'campaigns'>('pipeline');

  // Member CRM displays leads strictly isolated by member tenant ID
  const [memberLeads, setMemberLeads] = useState<Lead[]>(() => crmEngine.getMemberLeads(activeUserId));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('Personal Website Form');
  const [newLeadDealValue, setNewLeadDealValue] = useState('2500');

  // Reload leads when active member changes
  useEffect(() => {
    setMemberLeads(crmEngine.getMemberLeads(activeUserId));
  }, [activeUserId]);

  // Automated Email Sequences State
  const [sequences, setSequences] = useState([
    {
      id: 'SEQ-01',
      name: 'Welcome & Value Briefing (Drip)',
      trigger: 'On Lead Capture Form Submit',
      status: 'Active',
      stepsCount: 4,
      totalSent: memberLeads.length > 0 ? memberLeads.length * 2 : 0,
      openRate: memberLeads.length > 0 ? '68.4%' : '0.0%',
      clickRate: memberLeads.length > 0 ? '34.2%' : '0.0%',
      steps: [
        { delay: 'Instant', subject: 'Welcome! Here is your requested Digital Strategy Blueprint', type: 'Email' },
        { delay: 'Day 1', subject: '3 Core Systems to Automate Your Business Revenue', type: 'Email' },
        { delay: 'Day 3', subject: 'Case Study: How to Scale in 60 Days', type: 'Email' },
        { delay: 'Day 5', subject: 'Invitation: Exclusive 1-on-1 Growth Mastermind Strategy', type: 'Email' },
      ]
    },
    {
      id: 'SEQ-02',
      name: 'Product Interest & Demo Follow-Up',
      trigger: 'When Lead Status moves to Qualified',
      status: 'Active',
      stepsCount: 3,
      totalSent: memberLeads.filter(l => l.status === 'Qualified' || l.stage === 'Qualified').length,
      openRate: memberLeads.length > 0 ? '74.1%' : '0.0%',
      clickRate: memberLeads.length > 0 ? '42.8%' : '0.0%',
      steps: [
        { delay: 'Instant', subject: 'Your Custom Digital Storefront Overview & Walkthrough', type: 'Email' },
        { delay: 'Day 2', subject: 'Questions about our 10% Binary Network Structure?', type: 'Email' },
        { delay: 'Day 4', subject: 'Schedule your private 15-minute onboarding demo', type: 'Email' },
      ]
    },
  ]);

  // Email Campaigns Broadcast State
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Dynamic Pipeline Calculations from Real Isolated Leads
  const newCount = memberLeads.filter(l => l.stage === 'New' || l.status === 'New').length;
  const qualCount = memberLeads.filter(l => l.stage === 'Qualified' || l.status === 'Qualified').length;
  const propCount = memberLeads.filter(l => l.stage === 'Proposal' || l.status === 'Contacted').length;
  const negCount = memberLeads.filter(l => l.stage === 'Negotiation').length;
  const wonCount = memberLeads.filter(l => l.stage === 'Won' || l.status === 'Converted' || l.status === 'Closed').length;
  const totalPipelineVal = memberLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const activeDealsCount = memberLeads.filter(l => (l.dealValue || 0) > 0 && l.stage !== 'Won' && l.status !== 'Lost').length;
  const totalLeads = memberLeads.length;

  const funnelStages = [
    { name: 'New Leads', count: newCount, pct: totalLeads > 0 ? `${Math.round((newCount / totalLeads) * 100)}%` : '0%', color: 'bg-indigo-600' },
    { name: 'Qualified', count: qualCount, pct: totalLeads > 0 ? `${Math.round((qualCount / totalLeads) * 100)}%` : '0%', color: 'bg-blue-500' },
    { name: 'Proposal Sent', count: propCount, pct: totalLeads > 0 ? `${Math.round((propCount / totalLeads) * 100)}%` : '0%', color: 'bg-purple-500' },
    { name: 'In Negotiation', count: negCount, pct: totalLeads > 0 ? `${Math.round((negCount / totalLeads) * 100)}%` : '0%', color: 'bg-amber-500' },
    { name: 'Deals Won', count: wonCount, pct: totalLeads > 0 ? `${Math.round((wonCount / totalLeads) * 100)}%` : '0%', color: 'bg-emerald-500' },
  ];

  const filteredLeads = memberLeads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    l.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const email = newLeadEmail.trim() || 'lead@example.com';
    const addedLead = crmEngine.addLead({
      ownerId: activeUserId,
      ownerName: activeUserName,
      name: newLeadName.trim(),
      email: email,
      phone: newLeadPhone.trim() || '+1 555 000 0000',
      company: newLeadCompany.trim() || 'Independent Prospect',
      source: newLeadSource,
      status: 'New',
      stage: 'New',
      dealValue: parseFloat(newLeadDealValue) || 2500,
    });

    setMemberLeads(prev => [addedLead, ...prev]);
    setShowAddLeadModal(false);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadCompany('');
  };

  const handleStatusChange = (leadId: string, newStatus: any) => {
    const updated = crmEngine.updateLead(activeUserId, leadId, { status: newStatus });
    if (updated) {
      setMemberLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim()) return;
    alert(`Broadcast "${broadcastSubject}" successfully queued and dispatched to ${memberLeads.length} active CRM subscribers!`);
    setShowBroadcastModal(false);
    setBroadcastSubject('');
    setBroadcastBody('');
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Member Isolated CRM with Tab Navigation */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Personal CRM & Email Marketing
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">● Isolated Tenant Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Customer Relationship & Email Engine</h2>
          <p className="text-xs text-indigo-200 mt-0.5">
            Every lead captured on your personal website triggers automated follow-up sequences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
            {[
              { id: 'pipeline', label: 'Lead Pipeline' },
              { id: 'sequences', label: 'Email Automations' },
              { id: 'campaigns', label: 'Broadcasts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-950 shadow-md'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PIPELINE & LEADS TABLE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 5 KPI Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">My Total Leads</span>
                <Contact2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">{totalLeads}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 100% Owned by You</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Qualified</span>
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-blue-600">{qualCount}</h3>
              <p className="text-xs text-slate-400 mt-1">High-intent prospects</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Active Deals</span>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-purple-600">{activeDealsCount}</h3>
              <p className="text-xs text-slate-400 mt-1">In active sales funnel</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Deals Won</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-emerald-600">{wonCount}</h3>
              <p className="text-xs text-slate-400 mt-1">Converted to clients</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Pipeline Value</span>
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                ${totalPipelineVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Forecasted volume</p>
            </div>
          </div>

          {/* 5-Stage Sales Funnel & Source Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Conversion Funnel</h4>
                    <p className="text-xs text-slate-400">Step-by-step pipeline conversion velocity</p>
                  </div>
                  <Badge variant="blue" size="sm">Real-time Attribution</Badge>
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
                <span>Total Active Leads: {totalLeads}</span>
                <span className="font-bold text-indigo-600">
                  {totalLeads > 0 ? `${((wonCount / totalLeads) * 100).toFixed(1)}% Conversion Rate` : 'No Pipeline Data Yet'}
                </span>
              </div>
            </div>

            {/* Lead Sources Breakdown (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Top Lead Sources</h4>
                <div className="space-y-3">
                  {[
                    { source: 'Personal Landing Page', count: totalLeads > 0 ? `${Math.round((memberLeads.filter(l => l.source.includes('Landing') || l.source.includes('Website')).length / totalLeads) * 100)}%` : '0%', color: 'bg-indigo-600' },
                    { source: 'Event Registrations', count: totalLeads > 0 ? `${Math.round((memberLeads.filter(l => l.source.includes('Event')).length / totalLeads) * 100)}%` : '0%', color: 'bg-purple-600' },
                    { source: 'Direct Storefront', count: totalLeads > 0 ? `${Math.round((memberLeads.filter(l => l.source.includes('Store')).length / totalLeads) * 100)}%` : '0%', color: 'bg-blue-500' },
                    { source: 'Manual / Referrals', count: totalLeads > 0 ? `${Math.round((memberLeads.filter(l => !l.source.includes('Landing') && !l.source.includes('Event') && !l.source.includes('Store')).length / totalLeads) * 100)}%` : '0%', color: 'bg-emerald-500' },
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

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mt-4 text-[11px] text-slate-500">
                🔒 <b>Data Ownership Guarantee:</b> All leads belong exclusively to your entrepreneur profile.
              </div>
            </div>
          </div>

          {/* Leads Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Your Leads Directory</h3>
                <p className="text-xs text-slate-500">Filter, update status, and track email sequence progress</p>
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

            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center bg-slate-50/50">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Leads Captured Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Leads captured from your landing page, event registrations, or custom store will appear here in real time with immutable source attribution.
                </p>
                <button
                  onClick={() => setShowAddLeadModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Manual Lead</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-6">Lead Name</th>
                      <th className="py-3.5 px-6">Company</th>
                      <th className="py-3.5 px-6">Immutable Source</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Active Sequence</th>
                      <th className="py-3.5 px-6">Created Date</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{lead.name}</p>
                              <p className="text-[10px] text-slate-400">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-semibold">{lead.company || 'Direct'}</td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                            <Zap className="w-3 h-3" /> Step 1 Active
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">{lead.createdAt}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: AUTOMATED EMAIL SEQUENCES */}
      {activeTab === 'sequences' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Automated Drip Sequences</h3>
              <p className="text-xs text-slate-500">Event-driven multi-step email automations sent to captured leads.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sequences.map((seq) => (
              <div key={seq.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">{seq.id}</span>
                    <h4 className="text-sm font-black text-slate-900">{seq.name}</h4>
                  </div>
                  <Badge variant="emerald" size="sm">{seq.status}</Badge>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold">Trigger Rule:</span>
                  <p className="font-semibold text-slate-900">{seq.trigger}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-50/50">
                    <span className="text-[10px] text-slate-400 font-bold block">Sent</span>
                    <span className="font-black text-slate-900">{seq.totalSent}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50">
                    <span className="text-[10px] text-slate-400 font-bold block">Open Rate</span>
                    <span className="font-black text-emerald-600">{seq.openRate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50">
                    <span className="text-[10px] text-slate-400 font-bold block">Click Rate</span>
                    <span className="font-black text-purple-600">{seq.clickRate}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sequence Steps:</span>
                  {seq.steps.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{step.subject}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {step.delay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: BROADCASTS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">1-Click Email Broadcast Center</h3>
                <p className="text-xs text-slate-500">Send direct newsletter broadcasts to all {memberLeads.length} leads in your CRM.</p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Prospect</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@agency.com"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555 019 2831"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Agency / Brand"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Deal Value ($)</label>
                <input
                  type="number"
                  placeholder="2500"
                  value={newLeadDealValue}
                  onChange={(e) => setNewLeadDealValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Save Lead & Trigger Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={selectedLead.avatar} alt={selectedLead.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLead.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 font-bold block">Company</span>
                <span className="font-bold text-slate-800">{selectedLead.company || 'Direct'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 font-bold block">Phone</span>
                <span className="font-bold text-slate-800">{selectedLead.phone || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 font-bold block">Source Attribution</span>
                <span className="font-bold text-indigo-600">{selectedLead.source}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] text-slate-400 font-bold block">Deal Value</span>
                <span className="font-bold text-emerald-600">${selectedLead.dealValue?.toLocaleString() || '0.00'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
