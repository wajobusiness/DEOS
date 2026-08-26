import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  MoreVertical,
  CheckCircle2,
  Lock,
  UserCheck,
  Trash2,
  X
} from 'lucide-react';
import { TeamMember } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

function getUserTeamKey(userId: string): string {
  const cleanId = (userId || 'EVO-ID-100245').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `eviona_user_${cleanId}_team_members`;
}

export const TeamManagement: React.FC = () => {
  const { member } = useAuth();
  const activeUserId = member?.id || 'EVO-ID-100245';
  const activeUserName = member?.name || 'Entrepreneur';
  const activeUserEmail = member?.email || 'user@evionaecosystem.com';

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(getUserTeamKey(activeUserId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Manager');
  const [inviteDepartment, setInviteDepartment] = useState('Operations');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getUserTeamKey(activeUserId));
      if (saved) {
        setTeamMembers(JSON.parse(saved));
      } else {
        setTeamMembers([]);
      }
    } catch {}
  }, [activeUserId]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `TM-${Date.now().toString().slice(-4)}`,
      name: inviteName.trim() || inviteEmail.split('@')[0],
      email: inviteEmail.trim().toLowerCase(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
      role: inviteRole,
      department: inviteDepartment,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastActive: 'Just invited',
    };

    const updated = [newMember, ...teamMembers];
    setTeamMembers(updated);
    localStorage.setItem(getUserTeamKey(activeUserId), JSON.stringify(updated));
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleDeleteMember = (id: string) => {
    const updated = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem(getUserTeamKey(activeUserId), JSON.stringify(updated));
  };

  // Compute Real Metrics
  const totalCount = 1 + teamMembers.length;
  const activeCount = 1 + teamMembers.filter(m => m.status === 'Active').length;
  const rbacRolesCount = Array.from(new Set(['Owner / Admin', ...teamMembers.map(m => m.role)])).length;
  const inactiveCount = teamMembers.filter(m => m.status === 'Inactive').length;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 4 Dynamic KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Members</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{totalCount}</h3>
          <p className="text-xs text-slate-400 mt-1">In your business workspace</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Now</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600">{activeCount}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">100% online</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">RBAC Roles</span>
            <ShieldCheck className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-purple-600">{rbacRolesCount}</h3>
          <p className="text-xs text-slate-400 mt-1">Configured permission tiers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Collaborators</span>
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{teamMembers.length}</h3>
          <p className="text-xs text-slate-400 mt-1">Assigned staff accounts</p>
        </div>
      </div>

      {/* Directory Table & RBAC Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Member Directory Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Workspace Directory</h4>
              <p className="text-xs text-slate-500">Collaborators with role-based access to your tools</p>
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
                {/* Primary Owner Row */}
                <tr className="bg-indigo-50/30">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={member?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} alt={activeUserName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{activeUserName} (You)</p>
                      <p className="text-[10px] text-slate-400">{activeUserEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="purple" size="sm">Workspace Owner</Badge>
                  </td>
                  <td className="py-4 px-6 font-semibold">Executive</td>
                  <td className="py-4 px-6">
                    <Badge variant="success" size="sm">● Active</Badge>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-400 font-bold">
                    Primary
                  </td>
                </tr>

                {/* Additional Invited Members */}
                {teamMembers.map((m) => (
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
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
            <b>Security Note (Book 13):</b> Two-Factor Authentication (2FA) is enforced for all Workspace Admins.
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <h3 className="text-base font-bold text-slate-900">Invite Collaborator</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Send an email invitation with assigned access permissions.</p>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="collaborator@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
                  >
                    <option>Manager</option>
                    <option>Editor</option>
                    <option>Analyst</option>
                    <option>Support</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
                  >
                    <option>Operations</option>
                    <option>Marketing</option>
                    <option>Content</option>
                    <option>Sales</option>
                    <option>Support</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
