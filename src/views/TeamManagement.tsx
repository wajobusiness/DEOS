import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  MoreVertical,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { initialTeamMembers } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState(initialTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 4 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Members</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">24</h3>
          <p className="text-xs text-slate-400 mt-1">Across 4 departments</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Now</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">21</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">87.5% online today</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">RBAC Roles</span>
            <ShieldCheck className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">6</h3>
          <p className="text-xs text-slate-400 mt-1">Granular permissions</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Invites</span>
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">3</h3>
          <p className="text-xs text-slate-400 mt-1">Awaiting email accept</p>
        </div>
      </div>

      {/* Directory Table & RBAC Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Member Directory Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Team Directory</h4>
              <p className="text-xs text-slate-500">Collaborators with role-based dashboard access</p>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Team Member</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={m.role === 'Admin' ? 'purple' : m.role === 'Manager' ? 'info' : 'neutral'} size="sm">
                        {m.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">{m.department}</td>
                    <td className="py-4 px-6">
                      <Badge variant="success" size="sm">● {m.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RBAC Matrix Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Role Permission Matrix
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Admin</span>
                  <span className="text-indigo-600">Full Access</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Wallet withdrawals, settings, team management, API keys.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Manager</span>
                  <span className="text-blue-600">Operations</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">CRM pipeline, marketing campaigns, academy courses.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Editor</span>
                  <span className="text-purple-600">Content</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Website visual builder, marketplace listings, AI tools.</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-900 text-[11px] mt-4">
            <b>Security Note (Book 13):</b> Two-Factor Authentication (2FA) is enforced for all Admin roles.
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite Collaborator</h3>
            <p className="text-xs text-slate-500 mb-4">Send an email invitation with assigned access permissions.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="collaborator@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500">
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Analyst</option>
                  <option>Support</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Invitation sent successfully!');
                    setShowInviteModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

