import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  ArrowUpRight,
  UserCheck,
  Sliders,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Filter,
  Save,
  Search,
  Eye,
  FileCheck,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  Package,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Network
} from 'lucide-react';
import { initialKYCList, initialPayoutQueue, initialAuditLogs, KYCSubmission, PayoutRequest, AuditLogEntry } from '../store/useAppStore';
import { systemStatuses } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const SuperAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'corporate_leads' | 'kyc' | 'treasury' | 'binary_rules' | 'marketplace' | 'academy' | 'audit_log' | 'system'
  >('overview');

  const [kycList, setKycList] = useState<KYCSubmission[]>(initialKYCList);
  const [payoutList, setPayoutList] = useState<PayoutRequest[]>(initialPayoutQueue);
  const [selectedKyc, setSelectedKyc] = useState<KYCSubmission | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [sustainabilityFund, setSustainabilityFund] = useState(45820.00);

  // Corporate Leads State
  const [corporateLeads, setCorporateLeads] = useState<any[]>([
    {
      id: 'LED-CORP-201',
      name: 'Alexander Wright',
      email: 'alex@enterprise-global.com',
      phone: '+1 800 555 0199',
      company: 'Enterprise Global Corp',
      leadSource: 'company_website',
      source: 'Corporate Website (Contact Sales / Demo)',
      ownerType: 'company',
      assignedTo: 'Marcus (Enterprise Sales)',
      status: 'New',
      stage: 'Qualified',
      dealValue: 25000,
      createdAt: 'May 24, 2025'
    },
    {
      id: 'LED-CORP-202',
      name: 'Victoria Vance',
      email: 'vvance@vancemedia.co',
      phone: '+1 888 234 9876',
      company: 'Vance Media Network',
      leadSource: 'company_website',
      source: 'Corporate Website (Partnership Request)',
      ownerType: 'company',
      assignedTo: 'Sarah (Partnerships Lead)',
      status: 'Contacted',
      stage: 'Proposal',
      dealValue: 40000,
      createdAt: 'May 23, 2025'
    },
    {
      id: 'LED-CORP-203',
      name: 'Jonathan Sterling',
      email: 'j.sterling@apexholdings.org',
      phone: '+44 20 7123 4567',
      company: 'Apex Holdings International',
      leadSource: 'company_website',
      source: 'Corporate Website (Request Demo)',
      ownerType: 'company',
      assignedTo: 'David (Inbound Sales)',
      status: 'Qualified',
      stage: 'Negotiation',
      dealValue: 60000,
      createdAt: 'May 22, 2025'
    }
  ]);
  const [leadSearchQuery, setLeadSearchQuery] = useState('');

  // Approve / Reject KYC
  const handleApproveKYC = (id: string) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'Approved' } : k));
    setSelectedKyc(null);
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        action: 'KYC Document Approved',
        actor: 'Super Admin',
        actorRole: 'super_admin',
        timestamp: 'Just now',
        details: `Approved KYC submission ${id} for member identity verification.`,
        impactCategory: 'User Account',
      },
      ...prev,
    ]);
  };

  const handleRejectKYC = (id: string) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'Rejected' } : k));
    setSelectedKyc(null);
  };

  // Approve Payout (Finance Role)
  const handleApprovePayout = (id: string, amount: number) => {
    setPayoutList(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now()}`,
        action: 'Payout Request Approved',
        actor: 'Finance Admin',
        actorRole: 'finance',
        timestamp: 'Just now',
        details: `Approved payout ${id} for $${amount.toFixed(2)} USDT via TRC20 network.`,
        impactCategory: 'Financial',
      },
      ...prev,
    ]);
    alert(`Payout ${id} approved and sent to TRC20 settlement queue.`);
  };

  const handleAssignStaff = (leadId: string, staffName: string) => {
    setCorporateLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedTo: staffName } : l));
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Super Admin Top Header */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">DEOS Super Admin Platform</h2>
              <Badge variant="purple" size="sm">BOOK 3 SPECIFICATION</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Desktop-first central command for Treasury, Corporate Leads, KYC, Binary Engine, and Security Audit
            </p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex gap-1.5 bg-slate-800 p-1.5 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'corporate_leads', label: `Corporate Leads (${corporateLeads.length})` },
            { id: 'kyc', label: `KYC Queue (${kycList.filter(k => k.status === 'Pending').length})` },
            { id: 'treasury', label: 'Finance & Treasury' },
            { id: 'binary_rules', label: 'Binary Engine' },
            { id: 'marketplace', label: 'Marketplace' },
            { id: 'academy', label: 'Academy' },
            { id: 'audit_log', label: 'Audit Logs' },
            { id: 'system', label: 'System Config' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Corporate Lead Management System (Book 7 & Multi-Tenant Architecture) */}
      {activeTab === 'corporate_leads' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Corporate CRM
                </span>
                <span className="text-xs text-slate-500 font-semibold">Central Inbound Sales & Enterprise Inquiries</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Corporate Website Leads Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All inquiries submitted directly via the DEOS corporate website (Request a Demo, Contact Sales, Partnerships) belong to the Company.
              </p>
            </div>

            <button
              onClick={() => alert('Exporting Corporate Leads CSV...')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md self-start md:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export Leads CSV</span>
            </button>
          </div>

          {/* 4 Corporate KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Corporate Leads</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{corporateLeads.length}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">↑ Direct Corporate Submissions</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
              <span className="text-xs font-semibold text-slate-400 uppercase">New Leads (24h)</span>
              <h3 className="text-2xl font-black text-indigo-600 mt-1">2</h3>
              <p className="text-xs text-slate-400 mt-1">Pending Staff Outreach</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
              <span className="text-xs font-semibold text-slate-400 uppercase">Enterprise Pipeline</span>
              <h3 className="text-2xl font-black text-purple-600 mt-1">$125,000</h3>
              <p className="text-xs text-slate-400 mt-1">High-ticket deals in review</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
              <span className="text-xs font-semibold text-slate-400 uppercase">Conversion Velocity</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">33.3%</h3>
              <p className="text-xs text-slate-400 mt-1">Direct corporate closing rate</p>
            </div>
          </div>

          {/* Corporate Leads Management Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Inbound Corporate Inquiries</h4>
                <p className="text-xs text-slate-500">Assign leads to sales representatives and convert to platform members</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search corporate leads..."
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
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
                    <th className="p-4">Inquiry Type / Source</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Assigned Sales Staff</th>
                    <th className="p-4">Pipeline Stage</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {corporateLeads
                    .filter(
                      (l) =>
                        l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                        l.company.toLowerCase().includes(leadSearchQuery.toLowerCase())
                    )
                    .map((lead) => (
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
                        <td className="p-4 font-bold text-slate-800">{lead.company}</td>
                        <td className="p-4">
                          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                            {lead.source}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant="purple" size="sm">Company HQ</Badge>
                        </td>
                        <td className="p-4">
                          <select
                            value={lead.assignedTo}
                            onChange={(e) => handleAssignStaff(lead.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer text-slate-800"
                          >
                            <option value="Marcus (Enterprise Sales)">Marcus (Enterprise Sales)</option>
                            <option value="Sarah (Partnerships Lead)">Sarah (Partnerships Lead)</option>
                            <option value="David (Inbound Sales)">David (Inbound Sales)</option>
                            <option value="Unassigned">Unassigned</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <Badge variant={lead.stage === 'Proposal' ? 'purple' : lead.stage === 'Negotiation' ? 'warning' : 'info'} size="sm">
                            {lead.stage} (${lead.dealValue?.toLocaleString()})
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => alert(`Converting ${lead.name} into registered DEOS enterprise account...`)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                          >
                            Convert to Member
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Overview & Constitutional Metric */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 6 Admin KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Members</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">18,842</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ 1,256 new</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Renewals</p>
              <h3 className="text-xl font-black text-emerald-600 mt-1">7,842</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">$50/yr</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
              <h3 className="text-xl font-black text-indigo-600 mt-1">$248,725</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Monthly Net</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Commissions Paid</p>
              <h3 className="text-xl font-black text-purple-600 mt-1">$96,432</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">10% Binary + Direct</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Payouts</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">$18,274</h3>
              <p className="text-[9px] text-amber-600 font-semibold mt-0.5">Approval Queue</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Sustainability Fund</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">${sustainabilityFund.toLocaleString()}</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Fallback Reserves</p>
            </div>
          </div>

          {/* Constitutional Revenue Split (Book 0 §5 Compliance Monitor) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Book 0 §5 Constitutional Metric: Commerce vs. Network Revenue Ratio
                </h4>
                <p className="text-xs text-slate-500">
                  Must maintain continuous majority real-world commerce revenue over network fees.
                </p>
              </div>
              <Badge variant="success" size="md">● 100% Constitutionally Compliant</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="text-indigo-600">Marketplace & Digital Commerce: 62.4% ($155,200)</span>
                <span className="text-purple-600">Membership & Network: 37.6% ($93,525)</span>
              </div>
              <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="h-full bg-indigo-600" style={{ width: '62.4%' }} />
                <div className="h-full bg-purple-500" style={{ width: '37.6%' }} />
              </div>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Real-time Service Health (Book 3 §3)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemStatuses.map((s) => (
                <div key={s.service} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{s.service}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Latency: {s.latency}</p>
                  </div>
                  <Badge variant="success" size="sm">Operational</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: KYC Queue */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">KYC & Identity Verification Queue</h4>
              <p className="text-xs text-slate-500">Review government-issued IDs before unlocking high-volume withdrawals</p>
            </div>
            <span className="text-xs font-bold text-amber-600">
              {kycList.filter(k => k.status === 'Pending').length} Pending Reviews
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-6">Document Type</th>
                  <th className="py-3 px-6">Document #</th>
                  <th className="py-3 px-6">Submitted At</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {kycList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img src={k.photoUrl} alt={k.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300" />
                      <div>
                        <p className="font-bold text-slate-900">{k.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {k.memberId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">{k.documentType}</td>
                    <td className="py-4 px-6 font-mono font-bold">{k.documentNumber}</td>
                    <td className="py-4 px-6 text-slate-500">{k.submittedAt}</td>
                    <td className="py-4 px-6">
                      <Badge variant={k.status === 'Approved' ? 'success' : k.status === 'Pending' ? 'warning' : 'danger'} size="sm">
                        {k.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {k.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApproveKYC(k.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectKYC(k.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Finance & Treasury */}
      {activeTab === 'treasury' && (
        <div className="space-y-6">
          {/* Sustainability Fund & Treasury Liquidity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-indigo-500/30 shadow-card">
              <p className="text-xs font-bold text-indigo-300 uppercase">Platform Sustainability Fund</p>
              <h3 className="text-3xl font-black text-white mt-1">${sustainabilityFund.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              <p className="text-xs text-emerald-400 mt-2">
                Funded by Split Commission gaps, unqualified generation bonuses & inactive overrides
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <p className="text-xs font-bold text-slate-500 uppercase">Cold Treasury Reserves (TRC20)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">$1,450,000 USDT</h3>
              <p className="text-xs text-slate-400 mt-2">Multi-sig cold storage backing 100% of user balances</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <p className="text-xs font-bold text-slate-500 uppercase">Pending Payout Queue</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">$18,274.00 USDT</h3>
              <p className="text-xs text-slate-400 mt-2">Finance-role approval required before automated release</p>
            </div>
          </div>

          {/* Pending Payout Queue Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Finance Payout Approval Queue (Book 3 §10)</h4>
                <p className="text-xs text-slate-500">Requires distinct Finance Role approval per constitutional separation of duties</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6">Payout ID</th>
                    <th className="py-3 px-6">Member</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Method & Destination</th>
                    <th className="py-3 px-6">Requested</th>
                    <th className="py-3 px-6 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {payoutList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{p.memberName}</td>
                      <td className="py-4 px-6 font-black text-emerald-600">${p.amount.toFixed(2)} USDT</td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-800">{p.method}</span>
                        <p className="text-[10px] font-mono text-slate-400 truncate max-w-xs">{p.destinationAddress}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-500">{p.requestedAt}</td>
                      <td className="py-4 px-6 text-right">
                        {p.status === 'Pending' ? (
                          <button
                            onClick={() => handleApprovePayout(p.id, p.amount)}
                            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                          >
                            Approve Payout
                          </button>
                        ) : (
                          <Badge variant="success" size="sm">● Released</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Binary Engine Rules */}
      {activeTab === 'binary_rules' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">Binary Engine Rule Parameters (Book 4 v1.1 Locked)</h4>
            <p className="text-xs text-slate-500">
              Governed strictly by Book 0 Constitution. Rates cannot be edited without formal Book revision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 mb-1">Binary Bonus Rate</label>
              <p className="text-2xl font-black text-indigo-600">10% Flat</p>
              <p className="text-[10px] text-slate-400 mt-1">Calculated weekly on weaker-leg BV with carry forward.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 mb-1">Generation Bonuses</label>
              <p className="text-lg font-black text-slate-900">Gen 2: 30% | Gen 3: 15%</p>
              <p className="text-[10px] text-slate-400 mt-1">Paid on descendant direct referral commissions.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 mb-1">Direct Referral Bonuses</label>
              <p className="text-lg font-black text-slate-900">$25 / $75 / $125</p>
              <p className="text-[10px] text-slate-400 mt-1">Launch ($25), Growth ($75), Legacy ($125).</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Rate parameters are locked to Book 4 v1.1 invariant. Super Admin modifications require cryptographic dual-key governance.</span>
          </div>
        </div>
      )}

      {/* Tab 5: Marketplace Moderation */}
      {activeTab === 'marketplace' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">Marketplace Moderation & Policy Enforcer</h4>
            <Badge variant="purple" size="sm">10%–60% Rate Validator</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Review new seller listings to verify digital download security, product quality, and compliant affiliate commission splits.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            All current marketplace products meet the 10%–60% promoter commission boundary requirement.
          </div>
        </div>
      )}

      {/* Tab 6: Academy & Instructor Management */}
      {activeTab === 'academy' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <h4 className="text-base font-bold text-slate-900">Academy Content & Instructor Revenue</h4>
          <p className="text-xs text-slate-500">
            Review instructor applications, approve course syllabi, and track instructor revenue payouts.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            4 Certified Instructor courses active with 100% automated completion certificate verification.
          </div>
        </div>
      )}

      {/* Tab 7: Immutable Audit Logs (Book 13 & Book 3 §14) */}
      {activeTab === 'audit_log' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Immutable System Audit Log (Book 0 §11 & Book 13)</h4>
              <p className="text-xs text-slate-500">Append-only administrative and financial action record</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
              Export Audit Trail
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Audit ID</th>
                  <th className="py-3 px-6">Action</th>
                  <th className="py-3 px-6">Actor / Role</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{log.action}</td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900">{log.actor}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">({log.actorRole})</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant="info" size="sm">{log.impactCategory}</Badge>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">{log.timestamp}</td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-sm truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Global System Settings */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">Platform Core Configuration</h4>
            <p className="text-xs text-slate-500">Parameters governing multi-tenant routing, payments, and security</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Platform Brand Title</label>
              <input type="text" defaultValue="DEOS Business Operating System" className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Timezone</label>
              <input type="text" defaultValue="GMT+01:00 (West Africa Time)" className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert('Platform settings saved.')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

