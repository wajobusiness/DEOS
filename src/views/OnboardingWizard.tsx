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
  Check,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { PlanTier, Member } from '../types';
import { Badge } from '../components/common/Badge';

interface OnboardingWizardProps {
  currentUser: Member;
  onComplete: (plan: PlanTier) => void;
  onCancel?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  onComplete,
  onCancel,
}) => {
  // 3-Stage Post-Registration Flow: 1. Plan Selection -> 2. Wallet Payment -> 3. Onboarding Video Tour -> Done!
  const [currentStep, setCurrentStep] = useState<'plan' | 'payment' | 'video'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('growth');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'usdt'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const planPrices: Record<PlanTier, number> = {
    launch: 100,
    growth: 300,
    legacy: 500,
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('TX9xZgHkM92pqWrtY8dKl9mTRC20AddressEVO');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep('video');
    }, 1500);
  };

  const handleFinishOnboarding = () => {
    onComplete(selectedPlan);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header & Step Progress Bar */}
      <div className="max-w-4xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 font-black text-lg">
              E
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Welcome to Eviona Ecosystem, {currentUser.name}! 👋
              </h1>
              <p className="text-xs text-slate-400">Step-by-step account activation & business launch</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {currentStep === 'plan' && 'Step 1 of 3: Plan Selection'}
              {currentStep === 'payment' && 'Step 2 of 3: Wallet Payment'}
              {currentStep === 'video' && 'Step 3 of 3: Quickstart Tour'}
            </span>
          </div>
        </div>

        {/* 3 Step Pill Indicators */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`h-1.5 rounded-full transition-all ${
              currentStep === 'plan' || currentStep === 'payment' || currentStep === 'video'
                ? 'bg-indigo-500'
                : 'bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              currentStep === 'payment' || currentStep === 'video' ? 'bg-indigo-500' : 'bg-slate-800'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              currentStep === 'video' ? 'bg-indigo-500' : 'bg-slate-800'
            }`}
          />
        </div>
      </div>

      {/* Main Step Canvas */}
      <div className="max-w-4xl w-full mx-auto py-8">
        {/* ========================================================================= */}
        {/* STEP 1: SELECT BUSINESS PLAN                                             */}
        {/* ========================================================================= */}
        {currentStep === 'plan' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Select Your Business Operating Tier
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose the plan that fits your growth goals. All plans include 1 active landing page with 3 curated demo templates and our 10% binary network position.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan 1: Launch Tier */}
              <div
                onClick={() => setSelectedPlan('launch')}
                className={`p-6 rounded-3xl border text-left cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedPlan === 'launch'
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Launch Tier</span>
                    {selectedPlan === 'launch' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">$100</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/ year</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Perfect for new digital entrepreneurs launching their first online venture.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1 Active Landing Page (3 Templates)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Personal Subdomain & SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>CRM Lead Database (100 Leads)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>10% Binary Network Position</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-xs transition-all ${
                    selectedPlan === 'launch'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {selectedPlan === 'launch' ? 'Selected' : 'Select Launch'}
                </button>
              </div>

              {/* Plan 2: Growth Tier (Recommended) */}
              <div
                onClick={() => setSelectedPlan('growth')}
                className={`p-6 rounded-3xl border text-left cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedPlan === 'growth'
                    ? 'bg-gradient-to-b from-indigo-950/60 to-purple-950/40 border-indigo-400 ring-2 ring-indigo-400 shadow-2xl shadow-indigo-600/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-400">Growth Tier</span>
                    {selectedPlan === 'growth' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">$300</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/ year</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    The complete business operating system with AI tools and marketplace seller store.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1 Active Landing Page (3 Templates)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>AI Business Center (Content & Copy)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>CRM Automation & Email System</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Marketplace Seller & Promoter Store</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>10% Binary Network Commissions</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-xs transition-all ${
                    selectedPlan === 'growth'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {selectedPlan === 'growth' ? 'Selected' : 'Select Growth'}
                </button>
              </div>

              {/* Plan 3: Legacy Tier */}
              <div
                onClick={() => setSelectedPlan('legacy')}
                className={`p-6 rounded-3xl border text-left cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedPlan === 'legacy'
                    ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">Legacy Tier</span>
                    {selectedPlan === 'legacy' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">$500</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/ year</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    VIP executive package with top placement and maximum compensation caps.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1 Active Landing Page (3 Templates)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Priority Placement in Binary Matrix</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Full Academy Masterclasses Vault</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Dedicated VIP Support & Mentorship</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-xs transition-all ${
                    selectedPlan === 'legacy'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {selectedPlan === 'legacy' ? 'Selected' : 'Select Legacy'}
                </button>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setCurrentStep('payment')}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Continue to Payment (${planPrices[selectedPlan]})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: WALLET PAYMENT CHECKOUT                                          */}
        {/* ========================================================================= */}
        {currentStep === 'payment' && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Activate Your {selectedPlan.toUpperCase()} Plan</h2>
              <p className="text-xs text-slate-400">
                Total Due: <b className="text-indigo-400 text-sm">${planPrices[selectedPlan]}.00 USD</b> (100% Secure Transaction)
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Select Payment Rail</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'bank', label: 'Bank / Paystack', icon: Building2 },
                    { id: 'usdt', label: 'USDT (TRC20)', icon: Coins },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === m.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      <span className="text-[11px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Rail Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 •••• •••• 4242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300">Direct Bank Checkout (Paystack / Flutterwave)</span>
                  <p className="text-[11px] text-slate-400">
                    You will be securely redirected to complete instant bank payment in your local currency.
                  </p>
                </div>
              )}

              {paymentMethod === 'usdt' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-400">Deposit Network:</span>
                    <span className="font-black text-indigo-400">TRON (TRC20)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="TX9xZgHkM92pqWrtY8dKl9mTRC20AddressEVO"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0"
                    >
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('plan')}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessPayment}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isProcessingPayment ? 'Authorizing Payment...' : `Pay $${planPrices[selectedPlan]}.00 & Activate`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: ONBOARDING QUICKSTART VIDEO TOUR                                 */}
        {/* ========================================================================= */}
        {currentStep === 'video' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Payment Successful! Your Plan is Active 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Watch this 3-minute quickstart masterclass to set up your personal landing page and start capturing leads.
              </p>
            </div>

            {/* Video Player Card */}
            <div className="relative aspect-video rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
              {isPlaying ? (
                <iframe
                  className="w-full h-full absolute inset-0 rounded-3xl"
                  src="https://www.youtube-nocookie.com/embed/Td8gmK7HrS4?autoplay=1&rel=0&modestbranding=1"
                  title="Eviona Ecosystem Quickstart Masterclass"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80"
                    alt="Quickstart Masterclass"
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                  />

                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute w-16 h-16 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 backdrop-blur-md transition-all hover:scale-110"
                  >
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Eviona Ecosystem Quickstart (3:15)</span>
                    </div>
                    <span className="text-emerald-400 font-bold">1080p HD</span>
                  </div>
                </>
              )}
            </div>

            {/* Final Launch Button */}
            <div className="pt-4">
              <button
                onClick={handleFinishOnboarding}
                className="w-full max-w-md mx-auto py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Launch My Operating System 🚀</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-slate-800 text-xs text-slate-500">
        Eviona Ecosystem • 100% Encrypted & Authenticated Architecture
      </div>
    </div>
  );
};
