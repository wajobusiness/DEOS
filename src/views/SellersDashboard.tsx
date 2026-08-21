import React, { useState } from 'react';
import {
  Store,
  DollarSign,
  Package,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Filter,
  MoreVertical,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { initialProducts } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const SellersDashboard: React.FC = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$24,560.00</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +14.2% this month</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Orders</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">256</h3>
          <p className="text-xs text-slate-400 mt-1">Across 48 products</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Products</span>
            <Store className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">48</h3>
          <p className="text-xs text-slate-400 mt-1">100% digital fulfillment</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Affiliate Sales</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$8,450.00</h3>
          <p className="text-xs text-slate-400 mt-1">Driven by promoters</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Payout</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">$3,250.00</h3>
          <p className="text-xs text-slate-400 mt-1">Net seller payout</p>
        </div>
      </div>

      {/* Charts & Payout Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Store Sales Overview</h4>
              <p className="text-xl font-bold text-slate-900 mt-0.5">$24,560.00 USD</p>
            </div>
            <select className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
              <option>This Month</option>
              <option>Last Quarter</option>
            </select>
          </div>

          <div className="h-48 w-full mt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full">
              <defs>
                <linearGradient id="sellerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 120 Q 120 110 240 70 T 480 30 L 500 20 L 500 150 L 0 150 Z"
                fill="url(#sellerGrad)"
              />
              <path
                d="M 0 120 Q 120 110 240 70 T 480 30 L 500 20"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Payout & Earnings Donut */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Seller Payout Status
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Available to Withdraw</span>
                <span className="font-bold text-slate-900">$3,250.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Payout Method</span>
                <span className="font-bold text-emerald-600">USDT TRC20</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Payout request sent to compliance queue.')}
            className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
          >
            Request Store Payout
          </button>
        </div>
      </div>

      {/* Product Catalog Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Your Product Catalog</h4>
            <p className="text-xs text-slate-500">Manage listings, affiliate commission incentives, and pricing</p>
          </div>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Product Title</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Affiliate Comm. %</th>
                <th className="py-3.5 px-6">Total Sales</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {initialProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-slate-900">{p.title}</span>
                  </td>
                  <td className="py-4 px-6">{p.category}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-600">{(p.affiliateCommissionRate * 100).toFixed(0)}%</span>
                  </td>
                  <td className="py-4 px-6">{p.salesCount} sold</td>
                  <td className="py-4 px-6">
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">List New Product on DEOS Marketplace</h3>
            <p className="text-xs text-slate-500 mb-4">Set your pricing and offer affiliate commission to DEOS members.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="Mastering Digital Marketing 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (USD)</label>
                <input
                  type="number"
                  placeholder="97.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Promoter Affiliate Commission (%)</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500">
                  <option value="0.30">30% Commission</option>
                  <option value="0.40">40% Commission</option>
                  <option value="0.50">50% Commission (Recommended)</option>
                  <option value="0.60">60% Commission (Maximum)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Platform takes standard 10% fee; remainder goes to seller.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Product published to DEOS Marketplace.');
                    setShowAddProductModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
