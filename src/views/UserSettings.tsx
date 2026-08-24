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
  Smartphone,
  Wallet,
  ArrowRight,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Member, PlanTier, ViewType } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

interface UserSettingsProps {
  currentUser: Member;
  onNavigate?: (view: ViewType) => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ currentUser, onNavigate }) => {
  const { updatePlan } = useAuth();
  const { walletBalance, processPurchase } = useWallet();

  const [activeTab, setActiveTab] = useState<string>('profile');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const planBasePrices: Record<PlanTier, number> = {
    launch: 100,
    growth: 300,
    legacy: 500,
  };

  const handleExecuteUpgrade = async (targetTier: PlanTier, targetTierName: string) => {
    const currentPrice = planBasePrices[currentUser.plan] || 100;
    const targetPrice = planBasePrices[targetTier] || 300;
    const upgradeCost = Math.max(0, targetPrice - currentPrice) || targetPrice;

    if (walletBalance < upgradeCost) {
      const confirmDeposit = confirm(
        `Insufficient Eviona Wallet balance.\n\nRequired: $${upgradeCost.toFixed(2)} EVO\nAvailable: $${walletBalance.toFixed(2)} EVO\n\nWould you like to go to the Deposit screen to add funds?`
      );
      if (confirmDeposit && onNavigate) {
        onNavigate('deposit');
      }
      return;
    }

    const confirmUpgrade = confirm(
      `Upgrade to ${targetTierName.toUpperCase()} for $${upgradeCost.toFixed(2)} EVO?\n\nThis will debit $${upgradeCost.toFixed(2)} from your Eviona Wallet and record it in your ledger.`
    );
    if (!confirmUpgrade) return;

    setIsProcessingUpgrade(true);
    try {
      const res = processPurchase(
        upgradeCost,
        `Membership Tier Upgrade: ${targetTierName.toUpperCase()} (1 Year License)`,
        `UPG-${targetTier}-${Date.now()}`
      );

      if (!res.success) {
        alert(res.error || 'Upgrade failed. Please check your wallet balance.');
        setIsProcessingUpgrade(false);
        return;
      }

      await updatePlan(targetTier);
      alert(`🎉 Congratulations! Your account has been upgraded to ${targetTierName.toUpperCase()}.\n\n$${upgradeCost.toFixed(2)} EVO was deducted from your wallet and logged in your transaction ledger.`);
    } catch (err: any) {
      alert(err.message || 'Upgrade processing failed.');
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  const handleExecuteRenewal = async () => {
    const renewalFee = 50.00;

    if (walletBalance < renewalFee) {
      const confirmDeposit = confirm(
        `Insufficient Eviona Wallet balance.\n\nRequired: $${renewalFee.toFixed(2)} EVO\nAvailable: $${walletBalance.toFixed(2)} EVO\n\nWould you like to go to the Deposit screen to add funds?`
      );
      if (confirmDeposit && onNavigate) {
        onNavigate('deposit');
      }
      return;
    }

    const confirmRenewal = confirm(
      `Renew annual ${currentUser.plan.toUpperCase()} subscription for $${renewalFee.toFixed(2)} EVO?\n\nThis will extend your renewal date by 365 days.`
    );
    if (!confirmRenewal) return;

    setIsProcessingUpgrade(true);
    try {
      const res = processPurchase(
        renewalFee,
        `Annual Membership Renewal: ${currentUser.plan.toUpperCase()} Tier`,
        `REN-${currentUser.plan}-${Date.now()}`
      );

      if (!res.success) {
        alert(res.error || 'Renewal failed. Please check your wallet balance.');
        setIsProcessingUpgrade(false);
        return;
      }

      await updatePlan(currentUser.plan);
      alert(`✓ Successfully renewed your ${currentUser.plan.toUpperCase()} tier subscription for 1 additional year!\n\n$${renewalFee.toFixed(2)} EVO was deducted from your wallet and logged in your ledger.`);
    } catch (err: any) {
      alert(err.message || 'Renewal processing failed.');
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <Badge variant="purple" size="sm">{currentUser.role.toUpperCase()}</Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-indigo-300 font-semibold mt-1">
              Member ID: <span className="font-mono text-white">{currentUser.id}</span> • Tier: <span className="uppercase font-bold text-emerald-400">{currentUser.plan}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Wallet Balance</span>
            <span className="text-emerald-400 font-black text-sm">${walletBalance.toFixed(2)} EVO</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('deposit')}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-card">
          {[
            { id: 'profile', label: 'Profile & Business', icon: User },
            { id: 'billing', label: 'Billing & Subscription', icon: CreditCard, badge: 'Wallet' },
            { id: 'payouts', label: 'Payout Methods (USDT/Bank)', icon: Coins },
            { id: 'security', label: 'Security & 2FA', icon: Shield },
            { id: 'notifications', label: 'Notification Settings', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Canvas Area (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal & Business Profile</h3>
                <p className="text-xs text-slate-500">Update your account information and contact identity.</p>
              </div>

              {isSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile changes saved successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country / Territory</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Brand Entity Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* BILLING & SUBSCRIPTION TAB (Connected to Real Wallet Engine) */}
          {activeTab === 'billing' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Membership Subscription & Plan Tiers</h3>
                <p className="text-xs text-slate-500">
                  Upgrades and renewals are automatically paid from your <b>Eviona Wallet balance</b> and recorded in your transaction ledger.
                </p>
              </div>

              {/* Wallet Live Status Pill */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-900">Eviona Wallet Funds</span>
                    <h4 className="text-base font-black text-indigo-700">${walletBalance.toFixed(2)} EVO Available</h4>
                  </div>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('deposit')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Top Up Wallet</span>
                  </button>
                )}
              </div>

              {/* Current Active Plan Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white space-y-3 shadow-md">
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
                    disabled={isProcessingUpgrade}
                    onClick={handleExecuteRenewal}
                    className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold hover:bg-indigo-50 shadow-sm disabled:opacity-50"
                  >
                    {isProcessingUpgrade ? 'Processing...' : 'Renew Subscription ($50/yr from Wallet)'}
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
                      priceNum: 100,
                      features: ['1 Landing Page (3 Templates)', 'Subdomain & SSL', 'CRM (100 Leads)', '10% Binary Network Position'],
                    },
                    {
                      id: 'growth' as PlanTier,
                      name: 'Growth Tier',
                      price: '$300/yr',
                      priceNum: 300,
                      features: ['Launch Features Included', 'AI Business Center', 'CRM Automation & Email', 'Marketplace Seller Store', '10% Binary Commissions'],
                    },
                    {
                      id: 'legacy' as PlanTier,
                      name: 'Legacy Tier',
                      price: '$500/yr',
                      priceNum: 500,
                      features: ['Growth Features Included', 'Binary Matrix Priority', 'Full Academy Vault', 'VIP Mentorship & Support'],
                    },
                  ].map((tier) => {
                    const isCurrent = currentUser.plan === tier.id;
                    const currentPrice = planBasePrices[currentUser.plan] || 100;
                    const cost = Math.max(0, tier.priceNum - currentPrice) || tier.priceNum;

                    return (
                      <div
                        key={tier.id}
                        className={`p-5 rounded-2xl border flex flex-col justify-between ${
                          isCurrent
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">{tier.name}</span>
                            {isCurrent && <Badge variant="purple" size="sm">Current</Badge>}
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
                          disabled={isCurrent || isProcessingUpgrade}
                          onClick={() => handleExecuteUpgrade(tier.id, tier.name)}
                          className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50'
                          }`}
                        >
                          {isCurrent
                            ? 'Active Plan'
                            : isProcessingUpgrade
                            ? 'Processing...'
                            : `Upgrade ($${cost} EVO)`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PAYOUT METHODS TAB */}
          {activeTab === 'payouts' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Payout & Withdrawal Configuration</h3>
                <p className="text-xs text-slate-500">Configure where your affiliate and marketplace withdrawals are deposited.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span>Crypto USDT (TRC20 / ERC20) Settlement</span>
                  </h4>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your USDT (TRC20) Wallet Address</label>
                    <input
                      type="text"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Local Fiat Bank Account</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
                <p className="text-xs text-slate-500">Manage your password, login sessions, and two-factor authentication.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-slate-500 text-[11px]">Require authenticator code on all wallet transfers and withdrawals.</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
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
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Plan Allocation</h4>
              <Badge variant="purple" size="sm">{currentUser.plan.toUpperCase()}</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Cloud Storage</span>
                  <span>14.2 GB / 50 GB</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '28.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>AI Business Credits</span>
                  <span>1,840 / 5,000</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '36.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>CRM Lead Limits</span>
                  <span>36 / 1,000</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '3.6%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
