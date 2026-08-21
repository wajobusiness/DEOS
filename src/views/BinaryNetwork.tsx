import React, { useState } from 'react';
import {
  Network,
  Users,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  Calculator,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { initialBinaryTree } from '../store/mockData';
import { TreeNode } from '../types';
import { Badge } from '../components/common/Badge';

export const BinaryNetwork: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TreeNode>(initialBinaryTree);
  const [calcBv, setCalcBv] = useState<number>(10000);

  const calculateCommission = (bv: number) => {
    // 10% Flat Binary Commission invariant
    return bv * 0.10;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Network</span>
            <Network className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">256</h3>
          <p className="text-xs text-slate-400 mt-1">Active nodes in tree</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Left Leg</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">128</h3>
          <p className="text-xs text-slate-400 mt-1">Volume: $12,280 BV</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Right Leg</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">128</h3>
          <p className="text-xs text-slate-400 mt-1">Volume: $12,280 BV</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total BV</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$24,560</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">10% Payout Rate</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Bonus Status</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <Badge variant="success" size="md">Eligible for Bonus</Badge>
            <p className="text-[10px] text-slate-400 mt-1.5">2:1 Qualification met</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Tree Canvas (8 cols) + Binary Summary & Calculator (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Binary Tree Canvas */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Binary Network Tree</h3>
              <p className="text-xs text-slate-500">Visual hierarchy with spillover placement & BV tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>

          {/* Tree Diagram SVG & Node Cards */}
          <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center relative min-h-[420px]">
            {/* Level 1: Root Node */}
            <div
              onClick={() => setSelectedNode(initialBinaryTree)}
              className={`p-3.5 rounded-2xl bg-white border-2 cursor-pointer transition-all shadow-md flex items-center gap-3 ${
                selectedNode.id === initialBinaryTree.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-400'
              }`}
            >
              <img
                src={initialBinaryTree.avatar}
                alt={initialBinaryTree.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">{initialBinaryTree.name}</p>
                <p className="text-[10px] text-indigo-600 font-semibold">{initialBinaryTree.role}</p>
                <p className="text-[10px] text-slate-400">Total BV: ${initialBinaryTree.bv.toLocaleString()}</p>
              </div>
            </div>

            {/* Connecting lines */}
            <div className="w-48 h-8 border-b-2 border-l-2 border-r-2 border-slate-300 rounded-b-xl my-1" />

            {/* Level 2: Left & Right Branches */}
            <div className="flex justify-between w-full max-w-lg mt-2 gap-8">
              {initialBinaryTree.children?.map((child) => (
                <div key={child.id} className="flex-1 flex flex-col items-center">
                  <div
                    onClick={() => setSelectedNode(child)}
                    className={`w-full p-3 rounded-xl bg-white border-2 cursor-pointer transition-all shadow-sm flex items-center gap-2.5 ${
                      selectedNode.id === child.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="text-left truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{child.name}</p>
                      <p className={`text-[10px] font-semibold ${child.leg === 'left' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {child.role}
                      </p>
                      <p className="text-[10px] text-slate-400">${child.bv.toLocaleString()} BV</p>
                    </div>
                  </div>

                  {/* Level 3 Connectors */}
                  <div className="w-24 h-6 border-b-2 border-l-2 border-r-2 border-slate-300 rounded-b-lg my-1" />

                  {/* Level 3 Children */}
                  <div className="flex justify-between w-full gap-2">
                    {child.children?.map((subChild) => (
                      <div
                        key={subChild.id}
                        onClick={() => setSelectedNode(subChild)}
                        className={`flex-1 p-2 rounded-lg bg-white border cursor-pointer text-center text-xs shadow-2xs ${
                          selectedNode.id === subChild.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        <p className="font-bold text-slate-800 text-[11px] truncate">{subChild.name}</p>
                        <p className="text-[9px] text-slate-400">${subChild.bv} BV</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tree Helper Note */}
            <div className="mt-8 text-[11px] text-slate-400 text-center flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Click on any node to inspect Business Volume, spillover status, and ancestry.</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Binary Summary & Calculator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Binary Summary Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Binary Leg Summary
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="font-semibold text-blue-900">Left Leg Volume</span>
                <span className="font-bold text-blue-700 text-sm">$12,280 BV</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="font-semibold text-purple-900">Right Leg Volume</span>
                <span className="font-bold text-purple-700 text-sm">$12,280 BV</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700">Weaker Leg</span>
                <span className="font-bold text-slate-900">None (Balanced)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700">Carry Forward BV</span>
                <span className="font-bold text-slate-900">$0 BV</span>
              </div>
            </div>

            {/* Placement Rule Callout */}
            <div className="mt-4 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900">
              <p className="font-bold mb-0.5">Binary Rule (Book 4):</p>
              <p className="text-indigo-800">
                Two qualified direct members per leg (2:1). Spillover automatically places into the next available subtree slot.
              </p>
            </div>
          </div>

          {/* Real-time 10% Flat Commission Calculator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                10% Binary Bonus Calculator
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weaker Leg Business Volume (BV)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcBv}
                    onChange={(e) => setCalcBv(Number(e.target.value))}
                    step="500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">BV</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <p className="text-[11px] text-emerald-800 font-medium">Estimated Binary Bonus (10% Flat):</p>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">
                  ${calculateCommission(calcBv).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-bold">USDT</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
