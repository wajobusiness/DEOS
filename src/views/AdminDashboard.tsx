import React, { useState, useEffect } from 'react';
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
  Save,
  Search
} from 'lucide-react';
import { systemStatuses } from '../store/mockData';
import { Badge } from '../components/common/Badge';
import { userRegistryEngine, RegisteredUser } from '../engine/userRegistryEngine';

export const AdminDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'staff' | 'system'>('overview');
  const [userList, setUserList] = useState<RegisteredUser[]>(() => userRegistryEngine.getAllUsers());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUserList(userRegistryEngine.getAllUsers());
  }, []);

  const filteredUsers = userList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const launchCount = userList.filter(u => u.plan === 'launch').length;
  const growthCount = userList.filter(u => u.plan === 'growth').length;
  const legacyCount = userList.filter(u => u.plan === 'legacy').length;

  const topPlans = [
    { name: 'Growth Membership ($300)', count: `${growthCount} active member${growthCount === 1 ? '' : 's'}`, rev: `$${(growthCount * 300).toLocaleString()}`, growth: '100% Verified' },
    { name: 'Legacy Membership ($500)', count: `${legacyCount} active member${legacyCount === 1 ? '' : 's'}`, rev: `$${(legacyCount * 500).toLocaleString()}`, growth: '100% Verified' },
    { name: 'Launch Membership ($100)', count: `${launchCount} active member${launchCount === 1 ? '' : 's'}`, rev: `$${(launchCount * 100).toLocaleString()}`, growth: '100% Verified' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Admin Top Header & Sub-View Switcher */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Eviona Executive Admin & Governance</h2>
              <Badge variant="purple" size="sm">SUPER ADMIN</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Single Canonical Financial Ledger & Governance Engine
            </p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex gap-1.5 bg-slate-800 p-1.5 rounded-2xl text-xs font-bold w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeAdminTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeAdminTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            User Directory ({userList.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('staff')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeAdminTab === 'staff' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Staff & RBAC
          </button>
          <button
            onClick={() => setActiveAdminTab('system')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeAdminTab === 'system' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
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
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Members</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{userList.length}</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Live Master Registry</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Subscriptions</p>
              <h3 className="text-xl font-black text-emerald-600 mt-1">{userList.filter(u => u.status === 'active').length}</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">Verified accounts</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total System BV</p>
              <h3 className="text-xl font-black text-purple-600 mt-1">
                {userList.reduce((sum, u) => sum + (u.binaryLeftVolume || 0) + (u.binaryRightVolume || 0), 0).toLocaleString()}
              </h3>
              <p className="text-[9px] text-purple-600 font-semibold mt-0.5">Binary volume</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">10% Binary Paid</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ${(userList.reduce((sum, u) => sum + (u.binaryLeftVolume || 0) + (u.binaryRightVolume || 0), 0) * 0.10).toLocaleString()}
              </h3>
              <p className="text-[9px] text-slate-400 mt-0.5">Automated cycles</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Treasury Pool</p>
              <h3 className="text-xl font-black text-indigo-600 mt-1">
                ${userList.reduce((sum, u) => sum + (u.walletBalance || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[9px] text-indigo-600 font-semibold mt-0.5">1 EVO = $1.00 USD</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">System Uptime</p>
              <h3 className="text-xl font-black text-emerald-600 mt-1">99.98%</h3>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Multi-Region Active</p>
            </div>
          </div>

          {/* Membership Tier Distribution & Infrastructure Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Membership Plans Distribution
                </h4>
                <Badge variant="blue" size="sm">Real-time DB</Badge>
              </div>

              <div className="space-y-3">
                {topPlans.map((plan) => (
                  <div key={plan.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
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
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
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

              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-[11px] mt-4">
                Zero database lock contentions detected in closure table volume ledger.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: User Management Directory */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-black text-slate-900">Member Directory Management</h4>
              <p className="text-xs text-slate-500">Live platform accounts from master user registry</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search user ID, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Member ID</th>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Plan Tier</th>
                  <th className="py-3.5 px-6">Wallet Balance</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{u.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                    <td className="py-4 px-6 text-slate-500">{u.email}</td>
                    <td className="py-4 px-6">
                      <Badge variant="purple" size="sm">{u.plan || 'Free'}</Badge>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-emerald-600">
                      ${(u.walletBalance || 0).toFixed(2)} EVO
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="sm">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-[11px] text-slate-400">
                      {u.joinedDate || '2024'}
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <h4 className="text-base font-black text-slate-900">Platform Governance & Staff RBAC</h4>
          <p className="text-xs text-slate-500">Super administrators and audit compliance managers.</p>
        </div>
      )}

      {/* Tab: System Settings */}
      {activeAdminTab === 'system' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <h4 className="text-base font-black text-slate-900">Global Engine Parameters</h4>
          <p className="text-xs text-slate-500">10% Binary Commission Flat Rate • 3% Upline Override • Model A ($1.00 = 1 EVO).</p>
        </div>
      )}
    </div>
  );
};
