import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Clock,
  QrCode,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  RefreshCw,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ViewType, WalletTransaction } from '../types';
import { paymentGateway, PaymentProviderType } from '../engine/paymentGatewayEngine';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { adminApprovalEngine } from '../engine/adminApprovalEngine';

interface DepositFlowProps {
  onNavigate: (view: ViewType) => void;
}

export const DepositFlow: React.FC<DepositFlowProps> = ({ onNavigate }) => {
  const { addDeposit } = useWallet();
  const { member } = useAuth();
  const activeUser = member || {
    id: 'EVO-ID-100245',
    name: 'Entrepreneur',
    email: 'user@evionaecosystem.com',
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('usdt');
  const [amountUSD, setAmountUSD] = useState<number>(300);
  const [copied, setCopied] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(899); // 14:59
  const [generatedRef, setGeneratedRef] = useState<string>(`TXN-${Date.now().toString().slice(-6)}`);
  const [isVerifying, setIsVerifying] = useState(false);

  const coinRate = 1.00; // 1 EVO = $1.00 USD Utility Token

  useEffect(() => {
    if (timerSeconds > 0) {
      const interval = setInterval(() => setTimerSeconds(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerSeconds]);

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('TX9xZgHkM92pqWrtY8dKl9mTRC20Address');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentMethods = [
    {
      id: 'usdt',
      name: 'USDT (TRC20)',
      time: 'Instant Verification',
      rail: 'Direct Blockchain (TRC20 Address)',
      icon: Coins,
      badge: 'Recommended',
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      time: 'Instant Payment',
      rail: 'Stripe & Paystack Multi-Rail',
      icon: CreditCard,
      badge: 'Visa / Mastercard',
    },
    {
      id: 'bank',
      name: 'Bank Transfer (Direct EFT)',
      time: '1–2 Business Hours',
      rail: 'Direct Banking Settlement Rails',
      icon: Building2,
      badge: 'Local Currency',
    },
    {
      id: 'momo',
      name: 'Mobile Money (MoMo / M-Pesa)',
      time: 'Instant Settlement',
      rail: 'Africa Regional Gateway',
      icon: Smartphone,
      badge: 'Mobile Rail',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Live EVO Token Rate Top Strip */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Coins className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">EVO Token Economy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● Eviona Utility Token
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-2xl font-black text-white">1 EVO Token = $1.00 USD</h3>
              <span className="text-xs font-bold text-emerald-400">
                (Direct 1:1 Parity)
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-indigo-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <Clock className="w-4 h-4 text-indigo-300" />
          <span>Locked Rate Quote: <b>{formatTimer(timerSeconds)}</b></span>
        </div>
      </div>

      {/* Main Deposit Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* Step 1: Select Amount */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 1: Enter Deposit Amount</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose the amount of USD to deposit into your Eviona Wallet balance.
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[100, 300, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmountUSD(amt)}
                  className={`p-4 rounded-2xl border text-center font-bold transition-all ${
                    amountUSD === amt
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:border-indigo-300 text-slate-700'
                  }`}
                >
                  <span className="text-lg font-black block">${amt}</span>
                  <span className="text-[11px] text-slate-500">{amt} EVO</span>
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom Deposit Amount ($ USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="20"
                  max="50000"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-black text-lg outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>Continue to Payment Method</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Payment Rail Selection */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 2: Choose Payment Gateway</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your preferred deposit rail for <b>${amountUSD.toFixed(2)} USD ({amountUSD} EVO)</b>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                      paymentMethod === m.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{m.rail}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Details & Proof Upload */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 3: Transfer Funds</h2>
              <p className="text-xs text-slate-500 mt-1">
                Please transfer <b>${amountUSD.toFixed(2)}</b> using the details below.
              </p>
            </div>

            {paymentMethod === 'usdt' && (
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-bold">USDT (TRC20) Deposit Address</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">TRON Network</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-emerald-400 font-bold break-all">
                    TX9xZgHkM92pqWrtY8dKl9mTRC20Address
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Eviona Corporate Bank Account</h4>
                <div className="space-y-1 text-slate-600">
                  <p>Bank: <b className="text-slate-900">Standard Chartered / Chase Global</b></p>
                  <p>Account Name: <b className="text-slate-900">Eviona Global Ecosystem Ltd</b></p>
                  <p>Account Number: <b className="text-slate-900 font-mono">0928374102</b></p>
                  <p>Payment Reference: <b className="text-indigo-600 font-mono">{generatedRef}</b></p>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Super Admin Reconciliation & Governance</span>
              </span>
              <p className="text-[11px] text-slate-600">
                For financial safety, once submitted, deposits are verified by the Super Admin Treasury before appearing in your available balance.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                disabled={isVerifying}
                onClick={async () => {
                  setIsVerifying(true);
                  try {
                    const railName = paymentMethod === 'usdt' ? 'USDT (TRC20)' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Card Rail';

                    // 1. Create Deposit Approval Request in Super Admin Engine
                    adminApprovalEngine.createDepositRequest({
                      userId: activeUser.id,
                      userName: activeUser.name,
                      userEmail: activeUser.email,
                      amount: amountUSD,
                      rail: railName,
                      reference: generatedRef,
                    });

                    // 2. Queue in user ledger
                    await addDeposit(amountUSD, railName, generatedRef, `Deposit via ${railName} (Pending Admin Approval)`);

                    setCurrentStep(4);
                  } catch (err: any) {
                    alert(err.message || 'Payment submission failed.');
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>{isVerifying ? 'Submitting...' : 'I Have Transferred the Funds'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Submission Confirmation & Status */}
        {currentStep === 4 && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Deposit Queued for Super Admin Approval!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Your payment reference has been recorded. Once verified by the Super Admin Treasury, <b>+{amountUSD.toFixed(2)} EVO</b> will be immediately unlocked in your active wallet balance.
              </p>
            </div>

            <div className="max-w-sm mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono font-bold text-slate-900">{generatedRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Amount</span>
                <span className="font-bold text-slate-900">${amountUSD.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tokens Pending</span>
                <span className="font-bold text-indigo-600">+{amountUSD.toFixed(2)} EVO</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Review Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-700 border border-amber-500/30">
                  Pending Admin Approval
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('wallet')}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Return to Wallet Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
