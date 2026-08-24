import React, { useState } from 'react';
import {
  Network,
  Users,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  Calculator,
  RefreshCw,
  UserPlus,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  X,
  Play,
  Wallet
} from 'lucide-react';
import { initialBinaryTree } from '../store/mockData';
import { TreeNode, PlanTier } from '../types';
import { Badge } from '../components/common/Badge';
import { useWallet } from '../context/WalletContext';
import { calculateBinaryCommission, getDirectReferralBonus, findSpilloverSlot } from '../engine/binaryEngine';

export const BinaryNetwork: React.FC = () => {
  const { walletBalance, creditCommission } = useWallet();
  const [treeData, setTreeData] = useState<TreeNode>(initialBinaryTree);
  const [selectedNode, setSelectedNode] = useState<TreeNode>(initialBinaryTree);
  const [calcBv, setCalcBv] = useState<number>(5000);
  const [preferredPlacement, setPreferredPlacement] = useState<'balanced' | 'left' | 'right'>('balanced');
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  // Dynamic Binary Volume State
  const [leftBV, setLeftBV] = useState(14500);
  const [rightBV, setRightBV] = useState(11200);
  const [isSettling, setIsSettling] = useState(false);
  const [lastSettlementNotice, setLastSettlementNotice] = useState<string | null>(null);

  // Sponsor Downline Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState<PlanTier>('growth');
  const [newMemberPlacement, setNewMemberPlacement] = useState<'auto' | 'left' | 'right'>('auto');

  const weakerBV = Math.min(leftBV, rightBV);
  const carryForwardBV = Math.abs(leftBV - rightBV);
  const weeklyCommission = calculateBinaryCommission(weakerBV);

  const handleSelectNode = (node: TreeNode) => {
    setSelectedNode(node);
    setShowNodeModal(true);
  };

  // Run 10% Flat Binary Settlement & Credit to Wallet
  const handleExecuteWeeklySettlement = () => {
    if (weakerBV <= 0) {
      alert('There is currently 0 weaker-leg BV to match for settlement.');
      return;
    }

    setIsSettling(true);
    setTimeout(() => {
      const payout = calculateBinaryCommission(weakerBV);
      const matched = weakerBV;

      // Credit commission to real wallet ledger
      const tx = creditCommission(
        payout,
        'binary_commission',
        `Binary Settlement: 10% on ${matched.toLocaleString()} BV Weaker-Leg Match`
      );

      // Deduct matched volume, leaving carryforward
      setLeftBV(prev => prev - matched);
      setRightBV(prev => prev - matched);
      setIsSettling(false);

      setLastSettlementNotice(
        `Binary Settlement Complete! $${payout.toFixed(2)} EVO credited to your wallet (Ref: ${tx.id}). Carried forward: ${Math.abs(leftBV - rightBV).toLocaleString()} BV.`
      );
      setTimeout(() => setLastSettlementNotice(null), 7000);
    }, 600);
  };

  // Sponsor New Downline Member & Award Direct Bonus
  const handleSponsorMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const targetLeg: 'left' | 'right' = newMemberPlacement === 'auto'
      ? (leftBV <= rightBV ? 'left' : 'right')
      : newMemberPlacement;

    const bvAmount = newMemberPlan === 'launch' ? 100 : newMemberPlan === 'growth' ? 300 : 500;
    const directBonus = getDirectReferralBonus(newMemberPlan);

    // Credit direct referral bonus to wallet
    const tx = creditCommission(
      directBonus,
      'direct_referral_bonus',
      `Direct Referral Bonus — ${newMemberName} (${newMemberPlan.toUpperCase()} Plan)`
    );

    // Update leg volume
    if (targetLeg === 'left') {
      setLeftBV(prev => prev + bvAmount);
    } else {
      setRightBV(prev => prev + bvAmount);
    }

    // Insert node into tree visual
    const newNode: TreeNode = {
      id: `EVO${Math.floor(100000 + Math.random() * 900000)}`,
      name: newMemberName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Member',
      leg: targetLeg,
      status: 'active',
      bv: bvAmount,
      directBonusEarned: directBonus,
      children: [],
    };

    setTreeData(prev => {
      const cloned = JSON.parse(JSON.stringify(prev));
      const targetChild = cloned.children?.find((c: any) => c.leg === targetLeg);
      if (targetChild) {
        if (!targetChild.children) targetChild.children = [];
        targetChild.children.push(newNode);
      }
      return cloned;
    });

    setShowSponsorModal(false);
    setNewMemberName('');
    setLastSettlementNotice(
      `New Member ${newMemberName} placed on ${targetLeg.toUpperCase()} Leg! +$${directBonus.toFixed(2)} EVO Direct Bonus credited to your wallet (Ref: ${tx.id}).`
    );
    setTimeout(() => setLastSettlementNotice(null), 7000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Binary Model Strip */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10% Flat Binary Network Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Binary Hierarchy & Carryforward Volume
          </h2>
          <p className="text-xs text-indigo-200">
            Guaranteed 10% flat weaker-leg commission with indefinite carryforward and automated spillover distribution. Connected directly to your live Eviona Wallet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-white">${weeklyCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-indigo-200 uppercase font-bold">Matched Payout (10%)</p>
            {weakerBV > 0 && (
              <button
                onClick={handleExecuteWeeklySettlement}
                disabled={isSettling}
                className="mt-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-[10px] font-bold shadow-sm"
              >
                {isSettling ? 'Settling...' : 'Credit to Wallet'}
              </button>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-emerald-400">+{carryForwardBV.toLocaleString()} BV</p>
            <p className="text-[10px] text-emerald-200 uppercase font-bold">Carry Forward</p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {lastSettlementNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lastSettlementNotice}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800">
            Wallet Credited
          </span>
        </div>
      )}

      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Live Wallet</span>
            <Wallet className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">${walletBalance.toFixed(2)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">1:1 EVO Token</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Left Leg Power</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-blue-600">{leftBV.toLocaleString()} BV</h3>
          <p className="text-xs text-slate-400 mt-1">Volume Accumulating</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Right Leg Pay</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-purple-600">{rightBV.toLocaleString()} BV</h3>
          <p className="text-xs text-slate-400 mt-1">Volume Accumulating</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Weaker Matched</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600">{weakerBV.toLocaleString()} BV</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">10% Flat Rate Locked</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Binary Bonus Status</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <Badge variant="emerald" size="sm">Qualified (2:1 Active)</Badge>
            <p className="text-[10px] text-slate-400 mt-1.5">Direct left & right active</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Tree Canvas (8 cols) + Binary Controls & Calculator (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Binary Tree Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Interactive Binary Network Tree</h3>
              <p className="text-xs text-slate-500">Visual hierarchy with spillover placement & real-time BV calculation</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSponsorModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sponsor Member</span>
              </button>
              <button
                onClick={() => setSelectedNode(treeData)}
                className="p-2 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Center Root</span>
              </button>
            </div>
          </div>

          {/* Tree Diagram Visual Canvas */}
          <div className="p-6 sm:p-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative min-h-[460px] text-white">
            {/* Level 1: Root Node */}
            <div
              onClick={() => handleSelectNode(treeData)}
              className={`p-4 rounded-2xl bg-slate-800 border-2 cursor-pointer transition-all shadow-xl flex items-center gap-3 ${
                selectedNode.id === treeData.id ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-950/40' : 'border-slate-700 hover:border-indigo-400'
              }`}
            >
              <img src={treeData.avatar} alt={treeData.name} className="w-10 h-10 rounded-full object-cover border border-indigo-400" />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white text-xs">{treeData.name}</p>
                  <Badge variant="purple" size="sm">Root</Badge>
                </div>
                <p className="text-[10px] text-indigo-300 font-mono font-bold">{(leftBV + rightBV).toLocaleString()} BV • {treeData.id}</p>
              </div>
            </div>

            {/* Connecting SVG Lines */}
            <div className="w-48 h-8 border-b-2 border-l-2 border-r-2 border-indigo-500/40 my-1 rounded-b-lg" />

            {/* Level 2: Left & Right Child Nodes */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
              {treeData.children?.map((child, idx) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div
                    onClick={() => handleSelectNode(child)}
                    className={`w-full p-3 rounded-2xl bg-slate-800 border-2 cursor-pointer transition-all shadow-lg flex items-center gap-2.5 ${
                      selectedNode.id === child.id ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-950/40' : 'border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <img src={child.avatar} alt={child.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-[11px] truncate">{child.name}</p>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-bold uppercase ${idx === 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                          {idx === 0 ? 'Left Leg' : 'Right Leg'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold">• {idx === 0 ? leftBV : rightBV} BV</span>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Mini Lines */}
                  <div className="w-24 h-6 border-b border-l border-r border-slate-700 my-1 rounded-b" />

                  {/* Level 3: Leaf Sub-Nodes */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {child.children?.map((subChild) => (
                      <div
                        key={subChild.id}
                        onClick={() => handleSelectNode(subChild)}
                        className={`p-2 rounded-xl bg-slate-800/90 border cursor-pointer text-center text-xs transition-all ${
                          selectedNode.id === subChild.id ? 'border-indigo-500 bg-indigo-950/50 font-bold' : 'border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        <p className="font-bold text-white text-[10px] truncate">{subChild.name}</p>
                        <p className="text-[9px] text-indigo-300 font-mono">{subChild.bv} BV</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tree Helper Note */}
            <div className="mt-8 text-[11px] text-slate-400 text-center flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Click on any node in the matrix to inspect Business Volume, sponsor ancestry, and spillover status.</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Binary Settings & Calculator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preferred Placement Toggle */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Preferred Spillover Placement
            </h4>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[
                { id: 'balanced', label: 'Auto' },
                { id: 'left', label: 'Force Left' },
                { id: 'right', label: 'Force Right' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setPreferredPlacement(opt.id as any);
                    alert(`Spillover placement preference set to ${opt.label}!`);
                  }}
                  className={`py-2 rounded-xl border transition-all ${
                    preferredPlacement === opt.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-slate-600">
              Spillover automatically cascades new registrations down your preferred power leg to the first open leaf position.
            </div>
          </div>

          {/* Real-time 10% Flat Commission Calculator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                10% Binary Bonus Calculator
              </h4>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Weaker Leg Business Volume (BV)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcBv}
                    onChange={(e) => setCalcBv(Number(e.target.value))}
                    step="500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">BV</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Weekly Payout (10% Flat):</p>
                <h3 className="text-2xl font-black text-emerald-700">
                  ${calculateBinaryCommission(calcBv).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-bold">EVO</span>
                </h3>
                <p className="text-[10px] text-emerald-700 font-medium">Converted at 1:1 USD standard into your wallet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Member Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Sponsor New Downline Member</h3>
              <button onClick={() => setShowSponsorModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSponsorMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Member Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Adeleke"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Membership Plan Purchased</label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="launch">Launch Tier ($100 → 100 BV • $25 Direct Bonus)</option>
                  <option value="growth">Growth Tier ($300 → 300 BV • $75 Direct Bonus)</option>
                  <option value="legacy">Legacy Tier ($500 → 500 BV • $125 Direct Bonus)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Placement Leg</label>
                <select
                  value={newMemberPlacement}
                  onChange={(e) => setNewMemberPlacement(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="auto">Auto-Balance (Place in Weaker Leg)</option>
                  <option value="left">Left Leg (Power Branch)</option>
                  <option value="right">Right Leg (Pay Branch)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                ⚡ Sponsoring this member will instantly credit your wallet with a <b>${getDirectReferralBonus(newMemberPlan)}.00 Direct Bonus</b> in EVO Tokens.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <span>Place Member & Credit Bonus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Node Detail Drawer Modal */}
      {showNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={selectedNode.avatar} alt={selectedNode.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-500">{selectedNode.role}</p>
                </div>
              </div>
              <button onClick={() => setShowNodeModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Node ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedNode.id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Binary Leg</span>
                <span className="font-bold text-indigo-600 capitalize">{selectedNode.leg} Leg</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Contributed BV</span>
                <span className="font-black text-emerald-600">{selectedNode.bv.toLocaleString()} BV</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Direct Bonus</span>
                <span className="font-black text-purple-600">${selectedNode.directBonusEarned || 120}.00</span>
              </div>
            </div>

            <button
              onClick={() => setShowNodeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close Node Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
