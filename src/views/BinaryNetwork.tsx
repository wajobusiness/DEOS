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
  X
} from 'lucide-react';
import { initialBinaryTree } from '../store/mockData';
import { TreeNode } from '../types';
import { Badge } from '../components/common/Badge';

export const BinaryNetwork: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TreeNode>(initialBinaryTree);
  const [calcBv, setCalcBv] = useState<number>(11200);
  const [preferredPlacement, setPreferredPlacement] = useState<'balanced' | 'left' | 'right'>('balanced');
  const [showNodeModal, setShowNodeModal] = useState(false);

  const leftBV = 14500;
  const rightBV = 11200;
  const weakerBV = Math.min(leftBV, rightBV);
  const carryForwardBV = Math.abs(leftBV - rightBV);
  const weeklyCommission = weakerBV * 0.10;

  const calculateCommission = (bv: number) => {
    return bv * 0.10;
  };

  const handleSelectNode = (node: TreeNode) => {
    setSelectedNode(node);
    setShowNodeModal(true);
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
            Guaranteed 10% flat weaker-leg commission with indefinite carryforward and automated spillover distribution. Zero arbitrary flushing.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-white">${weeklyCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-indigo-200 uppercase font-bold">This Week Payout</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-emerald-400">+{carryForwardBV.toLocaleString()} BV</p>
            <p className="text-[10px] text-emerald-200 uppercase font-bold">Carry Forward</p>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Matrix</span>
            <Network className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">256 Nodes</h3>
          <p className="text-xs text-slate-400 mt-1">Active binary team</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Left Leg Power</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-blue-600">{leftBV.toLocaleString()} BV</h3>
          <p className="text-xs text-slate-400 mt-1">138 Active Members</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Right Leg Pay</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-purple-600">{rightBV.toLocaleString()} BV</h3>
          <p className="text-xs text-slate-400 mt-1">118 Active Members</p>
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
                onClick={() => setSelectedNode(initialBinaryTree)}
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
              onClick={() => handleSelectNode(initialBinaryTree)}
              className={`p-4 rounded-2xl bg-slate-800 border-2 cursor-pointer transition-all shadow-xl flex items-center gap-3 ${
                selectedNode.id === initialBinaryTree.id ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-950/40' : 'border-slate-700 hover:border-indigo-400'
              }`}
            >
              <img src={initialBinaryTree.avatar} alt={initialBinaryTree.name} className="w-10 h-10 rounded-full object-cover border border-indigo-400" />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white text-xs">{initialBinaryTree.name}</p>
                  <Badge variant="purple" size="sm">Root</Badge>
                </div>
                <p className="text-[10px] text-indigo-300 font-mono font-bold">{initialBinaryTree.bv.toLocaleString()} BV • {initialBinaryTree.id}</p>
              </div>
            </div>

            {/* Connecting SVG Lines */}
            <div className="w-48 h-8 border-b-2 border-l-2 border-r-2 border-indigo-500/40 my-1 rounded-b-lg" />

            {/* Level 2: Left & Right Child Nodes */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
              {initialBinaryTree.children?.map((child, idx) => (
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
                        <span className="text-[9px] text-slate-400 font-mono font-bold">• {child.bv} BV</span>
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
                  ${calculateCommission(calcBv).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-bold">EVO</span>
                </h3>
                <p className="text-[10px] text-emerald-700 font-medium">Converted at 1:1 USD standard into your wallet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
