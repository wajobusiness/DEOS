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
  ShieldCheck,
  X
} from 'lucide-react';
import { Member, ViewType, WalletTransaction } from '../types';
import { Badge } from '../components/common/Badge';
import { useWallet } from '../context/WalletContext';

interface WalletDashboardProps {
  currentUser: Member;
  onNavigate: (view: ViewType) => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  currentUser,
  onNavigate,
}) => {
  const { walletBalance, tokenBalance, availableBalance, transactions, processWithdrawal, processP2PTransfer } = useWallet();
  const [filterType, setFilterType] = useState<string>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('25.00');
  const [withdrawMethod, setWithdrawMethod] = useState<'USDT (TRC20)' | 'Bank Transfer' | 'Kuda Instant'>('USDT (TRC20)');
  const [withdrawAddress, setWithdrawAddress] = useState('TX9xZgHkM92pqWrtY8dKl9mTRC20Address');
  const [withdrawBankAcc, setWithdrawBankAcc] = useState('0928374102');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // P2P Transfer Form State
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('25.00');
  const [isTransferring, setIsTransferring] = useState(false);

  // Handle Withdrawal Request via Wallet Engine
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 25) {
      alert('Minimum withdrawal is $25.00 (25 EVO)');
      return;
    }

    setIsWithdrawing(true);
    try {
      const destination = withdrawMethod === 'USDT (TRC20)' ? { cryptoAddress: withdrawAddress } : { accountNumber: withdrawBankAcc };
      const result = await processWithdrawal(amount, withdrawMethod, destination);
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
      const result = processP2PTransfer(amount, transferRecipient);
      setIsTransferring(false);
      if (!result.success) {
        alert(result.error || 'Transfer failed');
      } else {
        setShowTransferModal(false);
        setTransferRecipient('');
        alert(`Successfully transferred ${amount.toFixed(2)} EVO Tokens to ${transferRecipient}!`);
      }
    }, 400);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'commissions') return t.type.includes('commission') || t.type.includes('bonus') || t.type.includes('override');
    if (filterType === 'transfers') return t.type.includes('transfer') || t.type.includes('withdrawal');
    if (filterType === 'deposits') return t.type === 'coin_deposit';
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
            <h3 className="text-3xl font-black tracking-tight">${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">Live Available Funds</p>
          </div>
          <span className="text-[10px] text-slate-400">Fixed Model A Valuation ($1.00 = 1.00 EVO)</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">EVO Token</span>
            <Coins className="w-5 h-5 text-purple-600" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-black text-slate-900">{tokenBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-purple-600">EVO</span></h3>
            <p className="text-[10px] text-slate-400 mt-1">Internal utility credit</p>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold">1:1 USD Fixed Utility Unit</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">USDT (TRC20) Ready</span>
            <Badge variant="emerald" size="sm">Instant</Badge>
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-black text-slate-900">{walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-emerald-600">USDT</span></h3>
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
            <h3 className="text-2xl font-black text-slate-900">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">100% Unlocked</p>
          </div>
          <span className="text-[10px] text-slate-400">Available capital</span>
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

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'deposits', label: 'Deposits' },
                { id: 'commissions', label: 'Commissions' },
                { id: 'transfers', label: 'Withdrawals & P2P' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === f.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Transactions Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your wallet ledger is active and ready. Deposits, marketplace sales, binary commissions, and payouts will be immutably recorded here.
              </p>
              <button
                onClick={() => onNavigate('deposit')}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Make First Deposit
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Reference ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Amount (EVO)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-[11px] font-bold text-slate-900">{tx.id}</td>
                    <td className="p-4 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-900 font-semibold">{tx.description}</td>
                    <td className="p-4 text-slate-400 text-[11px]">{tx.date} • {tx.time}</td>
                    <td className="p-4">
                      <Badge
                        variant={tx.status === 'Completed' ? 'emerald' : tx.status === 'Processing' ? 'purple' : 'warning'}
                        size="sm"
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className={`p-4 pr-6 text-right font-black text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} EVO
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Request Fund Payout</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Balance</label>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-black text-sm">
                  ${availableBalance.toFixed(2)} EVO Available
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount to Withdraw (EVO / USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="25"
                  max={availableBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Minimum withdrawal: $25.00 USD (25 EVO)</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payout Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="USDT (TRC20)">USDT (TRC20) — Instant Crypto Wallet</option>
                  <option value="Bank Transfer">Direct Bank Transfer (Local EFT)</option>
                  <option value="Kuda Instant">Kuda Microfinance Bank Instant</option>
                </select>
              </div>

              {withdrawMethod === 'USDT (TRC20)' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TRC20 Wallet Address</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Bank Account Number</label>
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
                  disabled={isWithdrawing || availableBalance < 25}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  {isWithdrawing ? 'Dispatching...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* P2P Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Zero-Fee P2P Transfer</h3>
              <button onClick={() => setShowTransferModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3.5 text-xs">
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
                  min="1"
                  max={walletBalance}
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 font-medium">
                ⚡ P2P transfers between Eviona members are instant, cryptographic, and have <b>0% fees</b>.
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
                  disabled={isTransferring || walletBalance <= 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isTransferring ? 'Transferring...' : 'Send Tokens'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
