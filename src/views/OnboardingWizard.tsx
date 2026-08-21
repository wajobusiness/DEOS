import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  Wallet,
  Shield,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  QrCode,
  Copy,
  ChevronRight,
  Globe,
  Lock,
  Zap,
  Check
} from 'lucide-react';
import { PlanTier, ViewType } from '../types';
import { Badge } from '../components/common/Badge';

interface OnboardingWizardProps {
  onComplete: (plan: PlanTier) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [country, setCountry] = useState('Nigeria');
  const [sponsorCode, setSponsorCode] = useState('DEOS100245');

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(45);

  // Wallet & Deposit states
  const [selectedMethod, setSelectedMethod] = useState('usdt');
  const [depositAmount, setDepositAmount] = useState<number>(300);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('growth');
  const [isCopied, setIsCopied] = useState(false);

  const coinRate = 1.00; // Model A: $1.00 USD = 1.00 DEOS Coin

  const handleCopy = () => {
    navigator.clipboard.writeText('TX9xZg...DedicatedTRC20DepositAddress');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const simulateDepositPayment = () => {
    setWalletBalance(depositAmount / coinRate);
    setCurrentStep(6);
  };

  const handleFinalizePlanPurchase = () => {
    onComplete(selectedPlan);
  };

  const stepTitles = [
    '1. Register',
    '2. Account Setup',
    '3. Presentation',
    '4. Activate Wallet',
    '5. Deposit Funds',
    '6. Purchase Plan',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">DEOS Onboarding Sequence</h1>
            <p className="text-xs text-slate-400">Amended Onboarding Flow (Book 2 & Book 17)</p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800"
        >
          Exit to Home
        </button>
      </div>

      {/* 6-Step Stepper Progress Bar */}
      <div className="max-w-4xl w-full mx-auto my-6">
        <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={title}
                className={`py-2 px-1 rounded-xl transition-all ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isCurrent
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <p className="truncate">{title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Content Cards */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center">
        {/* Step 1: Register Form */}
        {currentStep === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white">Create Your Entrepreneur Account</h2>
              <p className="text-xs text-slate-400">Step 1 of 6: Enter your details to join the DEOS Business OS.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentStep(2);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Sponsor Code (Affiliate Attribution)
                </label>
                <input
                  type="text"
                  value={sponsorCode}
                  onChange={(e) => setSponsorCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-indigo-400 focus:border-indigo-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Sponsor verified: <strong className="text-slate-300">John Doe (DEOS100245)</strong>
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue to Account Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Account Created Confirmation */}
        {currentStep === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Account Created Successfully!</h2>
              <p className="text-xs text-slate-400">Your member profile and multi-tenant environment are provisioned.</p>
            </div>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Member ID</span>
                <span className="font-mono font-bold text-indigo-400">DEOS100299</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Subdomain</span>
                <span className="font-mono font-bold text-slate-300">{name.toLowerCase().replace(/\s+/g, '')}.deos.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sponsor Ancestor</span>
                <span className="font-bold text-emerald-400">{sponsorCode} (Fixed & Immutable)</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 mx-auto"
            >
              <span>Watch Video Presentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Video Presentation Page (With prominent button directly below video) */}
        {currentStep === 3 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Orientation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Welcome to DEOS: Your All-in-One Platform
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Watch this short 3-minute executive presentation to understand your business tools,
                marketplace earnings, and the 10% binary network model.
              </p>
            </div>

            {/* Video Player Box */}
            <div className="relative rounded-2xl bg-black border-2 border-indigo-500/40 overflow-hidden shadow-2xl aspect-video max-w-2xl mx-auto flex flex-col justify-between p-4 group">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  DEOS MASTER PRESENTATION
                </span>
                <span>03:24</span>
              </div>

              {/* Center Play Button Overlay */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-xl shadow-indigo-600/50 group-hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </div>

              {/* Progress Scrub Bar */}
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden cursor-pointer">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            </div>

            {/* PROMINENT CONTINUE TO WALLET BUTTON DIRECTLY BELOW VIDEO PLAYER (Mandatory Requirement) */}
            <div className="pt-2 max-w-md mx-auto">
              <button
                onClick={() => setCurrentStep(4)}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <Wallet className="w-5 h-5 text-indigo-200" />
                <span>Continue to Wallet</span>
                <ArrowRight className="w-5 h-5 text-indigo-200" />
              </button>
              <p className="text-[10px] text-slate-500 mt-2">
                Click above to proceed to Wallet Activation and DEOS Coin conversion.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Activate Wallet */}
        {currentStep === 4 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Wallet className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Activate Your Multi-Currency Wallet</h2>
              <p className="text-xs text-slate-400">Generating cryptographic ledger keys and dedicated TRC20 address...</p>
            </div>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Wallet State</span>
                <Badge variant="success" size="sm">● Initialized</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Internal Unit</span>
                <span className="font-bold text-purple-400">DEOS Coin (Model A: $1.00 Conversion)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Address</span>
                <span className="font-mono text-[10px] text-slate-300 truncate max-w-[200px]">TX9xZgHkM92pqWrtY8dKl9mTRC20</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(5)}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 mx-auto"
            >
              <span>Deposit Funds & Convert Coin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 5: Deposit Funds / Convert to DEOS Coin (Model A) */}
        {currentStep === 5 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white">Deposit Funds & Convert to DEOS Coin</h2>
              <p className="text-xs text-slate-400">Select payment method to fund your membership plan.</p>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'usdt', name: 'USDT (TRC20)', icon: Coins },
                { id: 'card', name: 'Card (Visa/MC)', icon: CreditCard },
                { id: 'bank', name: 'Bank Transfer', icon: Building2 },
                { id: 'momo', name: 'Mobile Money', icon: Smartphone },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center space-y-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <p className="text-[11px] font-bold">{m.name}</p>
                  </div>
                );
              })}
            </div>

            {/* Amount input & rate display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Deposit Amount (USD)</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-transparent text-xl font-bold text-white outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <label className="block text-[11px] font-bold text-indigo-300 mb-1">Credited DEOS Coin (Model A)</label>
                <p className="text-xl font-black text-indigo-400">
                  {(depositAmount / coinRate).toFixed(2)} DEOS
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Conversion: 1 USD = 1.00 DEOS Coin</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={simulateDepositPayment}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <span>Confirm Deposit & Credit {(depositAmount / coinRate).toFixed(2)} DEOS</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Purchase Plan */}
        {currentStep === 6 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white">Select & Purchase Your Membership Plan</h2>
              <p className="text-xs text-slate-400">
                Available Wallet Balance: <strong className="text-emerald-400">{walletBalance.toFixed(2)} DEOS Coin</strong>
              </p>
            </div>

            {/* 3 Plans Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'launch' as PlanTier, name: 'LAUNCH', price: 100, features: 'Website, Marketplace, 10% Binary' },
                { id: 'growth' as PlanTier, name: 'GROWTH', price: 300, popular: true, features: 'All Launch + Advanced AI, CRM Funnels, Academy' },
                { id: 'legacy' as PlanTier, name: 'LEGACY', price: 500, features: 'All Growth + VIP Mastermind, Max Bonuses' },
              ].map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 shadow-xl'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {p.popular && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white uppercase tracking-wider mb-2 inline-block">
                          Recommended
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-2xl font-black text-white mt-1">${p.price}</p>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{p.features}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500">
                      Renewal: $50/year after 1 year
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinalizePlanPurchase}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Activate Membership & Launch Business Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[10px] text-slate-600 pt-6">
        DEOS Platform is governed by Book 0 Constitution. All compensation is calculated append-only.
      </div>
    </div>
  );
};

