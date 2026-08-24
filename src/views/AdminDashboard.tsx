import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  ArrowUpRight,
  UserPlus,
  Sliders,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Filter,
  Save
} from 'lucide-react';
import { systemStatuses } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const AdminDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'staff' | 'system'>('overview');

  const topPlans = [
    { name: 'Growth Membership ($300)', count: '10,420 members', rev: '$3,126,000', growth: '+24.5%' },
    { name: 'Legacy Membership ($500)', count: '5,180 members', rev: '$2,590,000', growth: '+18.2%' },
    { name: 'Launch Membership ($100)', count: '3,242 members', rev: '$324,200', growth: '+12.0%' },
  ];

  const adminUsersList = [
    { id: 'EVO-ID-100245', name: 'John Doe', email: 'john@evionaecosystem.com', plan: 'Growth', status: 'Active', joined: 'May 12, 2024' },
    { id: 'EVO-ID-100246', name: 'Sarah Johnson', email: 'sarah@agency.com', plan: 'Legacy', status: 'Active', joined: 'May 14, 2024' },
    { id: 'EVO-ID-100247', name: 'Michael Brown', email: 'michael@bright.com', plan: 'Launch', status: 'Suspended', joined: 'May 15, 2024' },
    { id: 'EVO-ID-100248', name: 'Emily Davis', email: 'emily@consulting.com', plan: 'Growth', status: 'Active', joined: 'May 18, 2024' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Admin Top Header & Sub-View Switcher */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Eviona Ecosystem Executive Admin</h2>
              <Badge variant="purple" size="sm">SUPER ADMIN</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Single Canonical Financial Ledger & Governance Engine
            </p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex gap-1.5 bg-slate-800 p-1.5 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeAdminTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeAdminTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            User Directory
          </button>
          <button
            onClick={() => setActiveAdminTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeAdminTab === 'staff' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Staff & RBAC
          </button>
          <button
            onClick={() => setActiveAdminTab('system')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeAdminTab === 'system' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            System Settings
          </button>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* 6 Admin KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Members</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">18,842</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ 1,256 new</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Subscriptions</p>
              <h3 className="text-xl font-black text-emerald-600 mt-1">7,842</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">$50/yr renewal</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
              <h3 className="text-xl font-black text-indigo-600 mt-1">$248,725</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">This Month</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Commissions Paid</p>
              <h3 className="text-xl font-black text-purple-600 mt-1">$96,432</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">10% Binary + Direct</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Payouts</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">$18,274</h3>
              <p className="text-[9px] text-amber-600 font-semibold mt-0.5">Compliance Queue</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Sustainability Fund</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">$45,820</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Unallocated fallback</p>
            </div>
          </div>

          {/* System Health & Top Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Performing Membership Plans */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Top Performing Membership Plans
              </h4>

              <div className="space-y-3">
                {topPlans.map((plan) => (
                  <div key={plan.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{plan.name}</h5>
                      <p className="text-[10px] text-slate-500">{plan.count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">{plan.rev}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">{plan.growth} velocity</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health Quick Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Infrastructure Health
                </h4>
                <div className="space-y-2 text-xs">
                  {systemStatuses.slice(0, 4).map((s) => (
                    <div key={s.service} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-700 font-medium">{s.service}</span>
                      <Badge variant="success" size="sm">● 100%</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] mt-4">
                Zero database lock contentions detected in closure table volume ledger.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: User Management Directory */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Member Directory Management</h4>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold">Export CSV</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Member ID</th>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Plan Tier</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {adminUsersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{u.id}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-6 text-slate-500">{u.email}</td>
                    <td className="py-3.5 px-6">
                      <Badge variant="purple" size="sm">{u.plan}</Badge>
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant={u.status === 'Active' ? 'success' : 'danger'} size="sm">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Staff Management */}
      {activeAdminTab === 'staff' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Admin Staff & Multi-Tenant RBAC</h4>
          <p className="text-xs text-slate-500">Assign system privilege levels and audit access trails.</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            Admin roles require dual-admin approval for manual financial overrides.
          </div>
        </div>
      )}

      {/* Tab: System Settings */}
      {activeAdminTab === 'system' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">Global Platform Configuration</h4>
            <p className="text-xs text-slate-500">Core parameters governing Eviona Ecosystem</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Platform Name</label>
              <input type="text" defaultValue="Eviona Ecosystem" className="w-full p-2.5 rounded-xl border border-slate-200" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Binary Bonus Rate</label>
              <input type="text" defaultValue="10% Flat Comp Rule" readOnly className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-indigo-600" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">EVO Token Launch Rate (USD)</label>
              <input type="text" defaultValue="$1.00 USD" className="w-full p-2.5 rounded-xl border border-slate-200 font-bold" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Marketplace Upline Override</label>
              <input type="text" defaultValue="3% of Promoter Commission" readOnly className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-purple-600" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert('System settings saved successfully!')}
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

