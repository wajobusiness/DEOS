import React, { useState } from 'react';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Sliders,
  Sparkles,
  Key,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';

interface UserSettingsProps {
  currentUser: Member;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const tabs = [
    { id: 'profile', label: 'General Settings', icon: User },
    { id: 'security', label: 'Account & Security (2FA)', icon: Shield },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations & API', icon: Sliders },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 2-Column Layout: Left Nav Tabs + Right Forms & Usage Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Nav Tabs (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-card space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
            Settings Navigation
          </p>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Config Forms (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Profile & Company Information</h3>
                <p className="text-xs text-slate-500">Update your identity and business details shown across the platform.</p>
              </div>

              {/* Profile Avatar Upload */}
              <div className="flex items-center gap-4 pt-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-600/30"
                />
                <div>
                  <button className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors">
                    Upload New Avatar
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      defaultValue={currentUser.phone}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      defaultValue={currentUser.country}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    defaultValue="Johnson Digital Solutions Ltd"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                  <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500">
                    <option>GMT+01:00 West Africa Time (Lagos, Abuja)</option>
                    <option>GMT+00:00 UTC (London, Accra)</option>
                    <option>GMT-05:00 Eastern Time (New York)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => alert('Settings saved successfully!')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
                <p className="text-xs text-slate-500">Manage 2FA, session security, and access passwords.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[10px] text-slate-500">Protect withdrawals and admin mutations with Authenticator app.</p>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Active Login Sessions</h4>
                <div className="p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">MacBook Pro (Chrome 124)</p>
                    <p className="text-[10px] text-slate-400">Lagos, Nigeria • Current Session</p>
                  </div>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Membership Subscription</h3>
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-indigo-900">Growth Plan ($300 Membership)</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <p className="text-slate-600">Annual renewal: $50/year • Next billing: <b>May 12, 2025</b></p>
              </div>
            </div>
          )}
        </div>

        {/* Right Usage & Quick Shortcuts Widget (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Plan Allocation</h4>
              <Badge variant="purple" size="sm">Growth</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Cloud Storage</span>
                  <span>7.5 / 10 GB</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Team Seats</span>
                  <span>24 / 50</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[48%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>AI Credits</span>
                  <span>12.4k / 20k</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[62%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-2 text-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Shortcuts</h4>
            <button className="w-full text-left p-2 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-400" /> Manage API Keys
            </button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-400" /> Export Account Data
            </button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-rose-50 font-semibold text-rose-600 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

