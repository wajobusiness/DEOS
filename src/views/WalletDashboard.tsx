import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Send,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { initialTransactions } from '../store/mockData';
import { Member, ViewType, WalletTransaction } from '../types';
import { Badge } from '../components/common/Badge';

interface WalletDashboardProps {
  currentUser: Member;
  onNavigate: (view: ViewType) => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const filteredTransactions = initialTransactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'commissions') return t.type.includes('commission') || t.type.includes('bonus');
    if (filterType === 'transfers') return t.type.includes('transfer') || t.type.includes('withdrawal');
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 4 Balance Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-card border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase">Total Wallet Balance</span>
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-extrabold tracking-tight">${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +8.4% this month</p>
          </div>
          <span className="text-[10px] text-slate-400">Combined USDT + DEOS Valuation</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">DEOS Token / Coin</span>
            <Coins className="w-5 h-5 text-purple-600" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold text-slate-900">{currentUser.tokenBalance.toLocaleString()} <span className="text-xs text-purple-600">DEOS</span></h3>
            <p className="text-[10px] text-slate-400 mt-1">Model A: 1.00 DEOS = $1.00 USD (Fixed Value)</p>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold">Utility Credit Unit</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">USDT Balance</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">TRC20</span>
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold text-slate-900">1,250.00 <span className="text-xs text-emerald-600">USDT</span></h3>
            <p className="text-[10px] text-slate-400 mt-1">Directly withdrawable</p>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for payout</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Available Balance</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold text-slate-900">${currentUser.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Pending escrow: $250.00</p>
          </div>
          <span className="text-[10px] text-slate-400">Unlocked capital</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('deposit')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Deposit (5 Methods)</span>
        </button>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <ArrowUpRight className="w-4 h-4 text-slate-600" />
          <span>Request Withdrawal</span>
        </button>

        <button
          onClick={() => setShowTransferModal(true)}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <Send className="w-4 h-4 text-slate-600" />
          <span>Internal Transfer</span>
        </button>

        <button
          onClick={() => onNavigate('deposit')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-purple-600" />
          <span>Convert Currency</span>
        </button>
      </div>

      {/* Chart & Allocation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Trajectory Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance Growth History</h4>
              <p className="text-lg font-bold text-slate-900 mt-0.5">$3,450.00 Total Net</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button className="px-3 py-1 text-xs font-bold bg-white text-indigo-600 rounded-lg shadow-2xs">30D</button>
              <button className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900">60D</button>
              <button className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900">90D</button>
            </div>
          </div>

          <div className="h-48 w-full mt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full">
              <defs>
                <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 Q 80 110 160 80 T 320 60 T 500 20 L 500 150 L 0 150 Z"
                fill="url(#walletGrad)"
              />
              <path
                d="M 0 130 Q 80 110 160 80 T 320 60 T 500 20"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="500" cy="20" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Wallet Allocation Donut */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Wallet Allocation
          </h4>

          <div className="flex items-center gap-4 my-auto">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="5" />
                {/* DEOS Token 70% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#8B5CF6" strokeWidth="5" strokeDasharray="62 100" strokeDashoffset="0" />
                {/* USDT 30% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="5" strokeDasharray="26 100" strokeDashoffset="-62" />
              </svg>
            </div>

            <div className="space-y-2 text-xs flex-1">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  DEOS Coin
                </span>
                <span className="font-bold text-slate-900">71.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  USDT (TRC20)
                </span>
                <span className="font-bold text-slate-900">29.0%</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            Internal P2P transfers between active members have zero transaction fees.
          </div>
        </div>
      </div>

      {/* Append-Only Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Append-Only Financial Ledger</h4>
            <p className="text-xs text-slate-500">Immutable record of all deposits, commissions, and transfers</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 font-semibold rounded-lg ${filterType === 'all' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('commissions')}
                className={`px-3 py-1 font-semibold rounded-lg ${filterType === 'commissions' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-600'}`}
              >
                Commissions
              </button>
              <button
                onClick={() => setFilterType('transfers')}
                className={`px-3 py-1 font-semibold rounded-lg ${filterType === 'transfers' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-600'}`}
              >
                Payouts
              </button>
            </div>

            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Event Type</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{t.description}</td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-[10px] text-slate-500">{t.type}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {t.date} <span className="text-[10px] text-slate-400">({t.time})</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="success" size="sm">● Completed</Badge>
                  </td>
                  <td className={`py-4 px-6 text-right font-bold ${t.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.amount > 0 ? `+${t.amount.toFixed(2)}` : t.amount.toFixed(2)} {t.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Request Withdrawal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Request USDT Withdrawal</h3>
            <p className="text-xs text-slate-500 mb-4">Payouts are processed to your confirmed TRC20 address.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (USDT)</label>
                <input
                  type="number"
                  placeholder="500.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination TRC20 Address</label>
                <input
                  type="text"
                  placeholder="T..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Withdrawal request submitted for compliance verification.');
                    setShowWithdrawModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Internal Transfer */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Internal Member Transfer</h3>
            <p className="text-xs text-slate-500 mb-4">Send DEOS Coin or USDT instantly to another active member.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Member ID / Email</label>
                <input
                  type="text"
                  placeholder="DEOS100..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="100.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Transfer completed with zero transaction fees.');
                    setShowTransferModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Send Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
