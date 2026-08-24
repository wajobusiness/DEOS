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
  TrendingUp,
  AlertCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { initialTransactions } from '../store/mockData';
import { Member, ViewType, WalletTransaction } from '../types';
import { Badge } from '../components/common/Badge';
import { paymentGateway } from '../engine/paymentGatewayEngine';

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

  // Dynamic Ledger Transactions State
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('250.00');
  const [withdrawMethod, setWithdrawMethod] = useState<'USDT (TRC20)' | 'Bank Transfer' | 'Kuda Instant'>('USDT (TRC20)');
  const [withdrawAddress, setWithdrawAddress] = useState('TX9xZgHkM92pqWrtY8dKl9mTRC20Address');
  const [withdrawBankAcc, setWithdrawBankAcc] = useState('0928374102');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // P2P Transfer Form State
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('50.00');
  const [isTransferring, setIsTransferring] = useState(false);

  // Handle Withdrawal Request via Payment Gateway Engine
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 25) {
      alert('Minimum withdrawal is $25.00 (25 EVO)');
      return;
    }

    setIsWithdrawing(true);
    try {
      const result = await paymentGateway.requestWithdrawal({
        userId: currentUser.id,
        amountUsd: amount,
        method: withdrawMethod,
        destination: {
          cryptoAddress: withdrawMethod === 'USDT (TRC20)' ? withdrawAddress : undefined,
          accountNumber: withdrawMethod !== 'USDT (TRC20)' ? withdrawBankAcc : undefined,
        },
      });

      const newTx: WalletTransaction = {
        id: result.reference,
        type: 'withdrawal',
        description: `Withdrawal via ${withdrawMethod}`,
        amount: -amount,
        currency: 'USD',
        status: 'Processing',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTransactions(prev => [newTx, ...prev]);
      setShowWithdrawModal(false);
      alert(result.message);
    } catch (err: any) {
      alert(err.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle P2P Member Transfer
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) return;
    if (!transferRecipient.trim()) {
      alert('Please enter a recipient Member ID or Email');
      return;
    }

    setIsTransferring(true);
    setTimeout(() => {
      const newTx: WalletTransaction = {
        id: `TX-P2P-${Date.now().toString().slice(-6)}`,
        type: 'coin_transfer',
        description: `P2P Transfer to ${transferRecipient}`,
        amount: -amount,
        currency: 'EVO',
        status: 'Completed',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsTransferring(false);
      setShowTransferModal(false);
      setTransferRecipient('');
      alert(`Successfully transferred ${amount} EVO Tokens to ${transferRecipient}!`);
    }, 800);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'commissions') return t.type.includes('commission') || t.type.includes('bonus');
    if (filterType === 'transfers') return t.type.includes('transfer') || t.type.includes('withdrawal');
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 4 Balance Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 text-white shadow-card border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase">Total Wallet Balance</span>
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black tracking-tight">${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +18.4% this month</p>
          </div>
          <span className="text-[10px] text-slate-400">Fixed Model A Valuation ($1.00 = 1.00 EVO)</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">EVO Token</span>
            <Coins className="w-5 h-5 text-purple-600" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-black text-slate-900">{currentUser.tokenBalance.toLocaleString()} <span className="text-xs text-purple-600">EVO</span></h3>
            <p className="text-[10px] text-slate-400 mt-1">Internal accounting utility currency</p>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold">1:1 USD Fixed Utility Unit</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">USDT (TRC20) Ready</span>
            <Badge variant="emerald" size="sm">Instant</Badge>
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-black text-slate-900">1,250.00 <span className="text-xs text-emerald-600">USDT</span></h3>
            <p className="text-[10px] text-slate-400 mt-1">Directly withdrawable</p>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for crypto payout</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Available Balance</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-black text-slate-900">${currentUser.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Pending escrow: $250.00</p>
          </div>
          <span className="text-[10px] text-slate-400">Unlocked capital</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('deposit')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Deposit Funds</span>
        </button>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs flex items-center gap-2 transition-all"
        >
          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          <span>Request Payout</span>
        </button>

        <button
          onClick={() => setShowTransferModal(true)}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs flex items-center gap-2 transition-all"
        >
          <Send className="w-4 h-4 text-purple-600" />
          <span>P2P Transfer</span>
        </button>
      </div>

      {/* Transaction History & Filter Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Immutable Wallet Ledger Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Append-only double-entry ledger history (Book 0 Invariant §14).</p>
          </div>

          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {['all', 'commissions', 'transfers'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filterType === f
                    ? 'bg-white shadow-xs text-indigo-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{tx.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{tx.description}</td>
                  <td className="py-4 px-6 font-black text-sm">
                    <span className={tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {tx.amount >= 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} {tx.currency}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={tx.status === 'Completed' ? 'emerald' : tx.status === 'Processing' ? 'purple' : 'warning'} size="sm">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-400">{tx.date} • {tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Request Withdrawal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Request Payout / Withdrawal</h3>
                <p className="text-xs text-slate-500">Processed through the Centralized Payment Gateway Engine.</p>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Payout Method / Rail</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="USDT (TRC20)">USDT (TRC-20 Blockchain Instant)</option>
                  <option value="Bank Transfer">Bank Transfer (Paystack / EFT)</option>
                  <option value="Kuda Instant">Kuda Business API (Instant Settlement)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount ($ USD / EVO)</label>
                <input
                  type="number"
                  step="0.01"
                  min="25"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Minimum withdrawal: $25.00</span>
              </div>

              {withdrawMethod === 'USDT (TRC20)' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination TRC20 Address</label>
                  <input
                    type="text"
                    required
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Account Number</label>
                  <input
                    type="text"
                    required
                    value={withdrawBankAcc}
                    onChange={(e) => setWithdrawBankAcc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isWithdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Internal P2P Transfer */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">P2P Member Token Transfer</h3>
                <p className="text-xs text-slate-500">Send EVO Tokens instantly to any verified member code or email.</p>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Member ID or Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EVO902144 or partner@evionaecosystem.com"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount (EVO Tokens)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isTransferring ? 'Sending Tokens...' : 'Send Funds (Zero Fee)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
