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
  Globe,
  Building2,
  Coins,
  Lock,
  Smartphone
} from 'lucide-react';
import { Member, PlanTier } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

interface UserSettingsProps {
  currentUser: Member;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ currentUser }) => {
  const { updatePlan } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+234 803 123 4567');
  const [country, setCountry] = useState(currentUser.country || 'Global');
  const [company, setCompany] = useState('Apex Digital Solutions');
  const [timezone, setTimezone] = useState('GMT+01:00 West Africa Time (Lagos, Abuja)');

  // Payout Configuration State
  const [usdtAddress, setUsdtAddress] = useState('TX9xZgHkM92pqWrtY8dKl9mTRC20Address');
  const [bankName, setBankName] = useState('Standard Chartered Bank / Kuda');
  const [accountNumber, setAccountNumber] = useState('0928374102');
  const [accountName, setAccountName] = useState(currentUser.name);

  // Security / Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const tabs = [
    { id: 'profile', label: 'General Settings', icon: User },
    { id: 'payouts', label: 'Payout Destinations', icon: Coins },
    { id: 'security', label: 'Account & Security (2FA)', icon: Shield },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('New password and confirmation do not match.');
      return;
    }
    if (newPass.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    alert('Security credentials updated successfully.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

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
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Profile & Business Information</h3>
                  <p className="text-xs text-slate-500">Update your identity and business details shown across the platform.</p>
                </div>
                {isSaved && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Saved!</span>
                  </div>
                )}
              </div>

              {/* Profile Avatar Upload */}
              <div className="flex items-center gap-4 pt-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-600/30 shadow-md"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => alert('Select a new profile image to upload.')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Upload New Avatar
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={email}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-semibold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                  >
                    <option>GMT+01:00 West Africa Time (Lagos, Abuja)</option>
                    <option>GMT+00:00 UTC (London, Accra)</option>
                    <option>GMT-05:00 Eastern Time (New York)</option>
                    <option>GMT+04:00 Gulf Standard Time (Dubai)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* PAYOUTS DESTINATION TAB */}
          {activeTab === 'payouts' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Configured Payout Destinations</h3>
                <p className="text-xs text-slate-500">Add verified accounts to receive weekly affiliate commissions and wallet withdrawals.</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* USDT TRC20 Destination */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">USDT (TRC-20 Network) Address</span>
                    </div>
                    <Badge variant="emerald" size="sm">Active</Badge>
                  </div>
                  <input
                    type="text"
                    value={usdtAddress}
                    onChange={(e) => setUsdtAddress(e.target.value)}
                    placeholder="TX9xZgHkM92pqWrtY8dKl9mTRC20Address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-mono text-slate-800 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400">Withdrawals over 25 EVO / USDT settle in &lt;15 minutes.</p>
                </div>

                {/* Local Bank Transfer Destination */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-900">Local Bank Account (Paystack / Direct EFT)</span>
                    </div>
                    <Badge variant="blue" size="sm">Verified</Badge>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-mono text-slate-900 font-bold outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Payout Details</span>
                </button>
              </div>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
                <p className="text-xs text-slate-500">Manage two-factor security, session credentials, and password rotation.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[10px] text-slate-500">Protect withdrawals and sensitive updates with Google Authenticator.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2 text-xs">
                <h4 className="font-bold text-slate-900">Change Password</h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Membership Subscription & Plan Tiers</h3>
                <p className="text-xs text-slate-500">Manage your active tier, renew annual license, or upgrade your operating limits.</p>
              </div>

              {/* Current Active Plan Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Current Membership Tier</span>
                    <h4 className="text-xl font-black">{currentUser.plan.toUpperCase()} TIER</h4>
                  </div>
                  <Badge variant="emerald" size="sm">Active & Verified</Badge>
                </div>
                <p className="text-xs text-indigo-200">
                  Annual renewal date: <b>{currentUser.renewalDate || 'In 365 Days'}</b> ($50.00/year renewal fee).
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      await updatePlan(currentUser.plan);
                      alert(`Successfully renewed ${currentUser.plan.toUpperCase()} tier subscription for 1 additional year!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold hover:bg-indigo-50 shadow-sm"
                  >
                    Renew Subscription ($50/yr)
                  </button>
                </div>
              </div>

              {/* 3 Tier Upgrade Options */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">Available Upgrade Packages</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'launch' as PlanTier,
                      name: 'Launch Tier',
                      price: '$100/yr',
                      features: ['1 Landing Page (3 Templates)', 'Subdomain & SSL', 'CRM (100 Leads)', '10% Binary Network Position'],
                    },
                    {
                      id: 'growth' as PlanTier,
                      name: 'Growth Tier',
                      price: '$300/yr',
                      features: ['Launch Features Included', 'AI Business Center', 'CRM Automation & Email', 'Marketplace Seller Store', '10% Binary Commissions'],
                    },
                    {
                      id: 'legacy' as PlanTier,
                      name: 'Legacy Tier',
                      price: '$500/yr',
                      features: ['Growth Features Included', 'Binary Matrix Priority', 'Full Academy Vault', 'VIP Mentorship & Support'],
                    },
                  ].map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between ${
                        currentUser.plan === tier.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{tier.name}</span>
                          {currentUser.plan === tier.id && <Badge variant="purple" size="sm">Current</Badge>}
                        </div>
                        <span className="text-lg font-black text-slate-900">{tier.price}</span>
                        <ul className="space-y-1.5 pt-2 text-[11px] text-slate-600">
                          {tier.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        disabled={currentUser.plan === tier.id}
                        onClick={async () => {
                          await updatePlan(tier.id);
                          alert(`Upgraded account to ${tier.name}! All associated features have been unlocked.`);
                        }}
                        className={`w-full mt-4 py-2 rounded-xl font-bold text-xs transition-all ${
                          currentUser.plan === tier.id
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        }`}
                      >
                        {currentUser.plan === tier.id ? 'Active Plan' : `Upgrade to ${tier.name}`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { title: 'New CRM Lead Alert', desc: 'Instant email and browser ping when a visitor submits a contact form' },
                  { title: 'Marketplace Sale Settlement', desc: 'Notification whenever a customer buys your product or affiliate link' },
                  { title: 'Binary Volume & Spillover Notification', desc: 'Real-time alert when volume is added to your left or right leg' },
                  { title: 'AI Business Center Digest', desc: 'Weekly AI summary of marketing performance and conversion opportunities' },
                ].map((n, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                      <p className="text-[11px] text-slate-500">{n.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 accent-indigo-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Usage & Quick Shortcuts Widget (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Plan Allocation</h4>
              <Badge variant="purple" size="sm">{currentUser.plan.toUpperCase()}</Badge>
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
            <button
              onClick={() => alert('API Key: eviona_live_sec_99a8b7c6d5e4f3a2b1')}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-slate-400" /> Manage API Keys
            </button>
            <button
              onClick={() => alert('Exporting all member data as JSON format...')}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-400" /> Export Account Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
