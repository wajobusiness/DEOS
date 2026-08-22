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
  RefreshCw
} from 'lucide-react';
import { ViewType } from '../types';

interface DepositFlowProps {
  onNavigate: (view: ViewType) => void;
}

export const DepositFlow: React.FC<DepositFlowProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('usdt');
  const [amountUSD, setAmountUSD] = useState<number>(300);
  const [copied, setCopied] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(899); // 14:59

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
    navigator.clipboard.writeText('TX9xZg...8dKl9mTRC20Address');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentMethods = [
    {
      id: 'usdt',
      name: 'USDT (TRC20)',
      time: 'Instant • Lowest Fees',
      rail: 'Direct Blockchain (No 3rd Party)',
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
      rail: 'Paystack & Direct Banking Rails',
      icon: Building2,
      badge: 'Local Currency',
    },
    {
      id: 'momo',
      name: 'Mobile Money (MoMo / M-Pesa)',
      time: 'Instant Settlement',
      rail: 'Paystack Regional Gateway',
      icon: Smartphone,
      badge: 'Africa Regional',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Live EVO Token Rate Top Strip */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-5 text-white shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Coins className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">EVO Token Economy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● Eviona Utility Token
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-xl font-extrabold text-white">1 EVO Token = $1.00 USD</h3>
              <span className="text-xs font-bold text-emerald-400">
                (Fixed Utility Credit)
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-indigo-200 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <Clock className="w-4 h-4 text-indigo-300" />
          <span>Locked Rate Quote: <b>{formatTimer(timerSeconds)}</b></span>
        </div>
      </div>

      {/* 6-Step Visual Stepper Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
        <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold">
          {[
            '1. Select Method',
            '2. Enter Amount',
            '3. Confirm Quote',
            '4. Send Payment',
            '5. Verifying',
            '6. Complete'
          ].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={label}
                onClick={() => isDone ? setCurrentStep(stepNum) : undefined}
                className={`py-2 px-1 rounded-xl transition-all ${
                  isDone
                    ? 'bg-emerald-50 text-emerald-700 cursor-pointer'
                    : isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 bg-slate-50'
                }`}
              >
                <p className="truncate">{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stepper Content Cards */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* Step 1: Select Method */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 1: Choose Your Deposit Method</h3>
              <p className="text-xs text-slate-500">Select how you want to fund your account and acquire EVO Token.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.time}</p>
                      <p className="text-[10px] text-indigo-600 font-medium mt-1">{m.rail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Continue to Amount</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Enter Deposit Amount</h3>
              <p className="text-xs text-slate-500">Convert USD / Fiat directly to EVO Token at the locked rate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">You Pay (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={amountUSD}
                    onChange={(e) => setAmountUSD(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[100, 300, 500, 1000].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmountUSD(val)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">You Receive (EVO Token)</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={(amountUSD / coinRate).toFixed(2)}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-50/60 border border-indigo-200 text-sm font-bold text-indigo-900 outline-none"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-indigo-600">EVO</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Exchange Rate: 1 EVO = $1.00 USD (Eviona Utility Token Rate)
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Lock Quote & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 3: Confirm Quote & Rate Lock</h3>
              <p className="text-xs text-slate-500">Your exchange rate is held for 15:00 minutes.</p>
            </div>

            <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Method</span>
                <span className="font-bold text-slate-900 uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">You Pay</span>
                <span className="font-bold text-slate-900">${amountUSD.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Locked Rate</span>
                <span className="font-bold text-indigo-600">1 EVO = $1.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Network Fee</span>
                <span className="font-bold text-emerald-600">$0.00 (Zero Fee)</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total EVO Credited</span>
                <span className="font-extrabold text-indigo-600">{(amountUSD / coinRate).toFixed(2)} EVO</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Proceed to Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Gateway Execution */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 4: Complete Payment</h3>
                <p className="text-xs text-slate-500">Send USDT to the address below or scan the QR code.</p>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Official TRC20 Deposit Address</span>
                  <div className="p-3 bg-slate-800 rounded-xl font-mono text-xs text-indigo-300 break-all flex items-center justify-between gap-2">
                    <span>TX9xZgHkM92pqWrtY8dKl9mTRC20Address</span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white shrink-0"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-400 font-medium">
                    ⚠️ Send only USDT via the TRC20 network. Any other asset will be permanently lost.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <span>I Have Transferred Funds</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Verifying Real-time */}
        {currentStep === 5 && (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Confirming Blockchain Receipt...</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Scanning TRC20 network blocks for transaction confirmation. Crediting EVO Token immediately...
            </p>
            <button
              onClick={() => setCurrentStep(6)}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              Simulate Instant Confirmation
            </button>
          </div>
        )}

        {/* Step 6: Deposit Complete */}
        {currentStep === 6 && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Deposit Confirmed & Credited!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your wallet has been credited with <b>{(amountUSD / coinRate).toFixed(2)} EVO Token</b>.
              </p>
            </div>

            <div className="max-w-xs mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono font-bold text-slate-900">TXN-9022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600">Completed (Appended)</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('wallet')}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Go to Wallet Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
