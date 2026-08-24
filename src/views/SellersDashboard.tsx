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
  ChevronRight,
  Trash2,
  Power,
  ExternalLink,
  Download,
  Search,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { initialProducts } from '../store/mockData';
import { Product } from '../types';
import { Badge } from '../components/common/Badge';

export const SellersDashboard: React.FC = () => {
  const [sellerProducts, setSellerProducts] = useState<Product[]>(
    initialProducts.filter(p => p.seller === 'Apex Digital' || p.isCreatorCourse || p.id === 'PROD-001' || p.id === 'PROD-002')
  );

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('49.00');
  const [newCategory, setNewCategory] = useState('Templates');
  const [newCommission, setNewCommission] = useState('0.40');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Seller Orders State
  const [sellerOrders, setSellerOrders] = useState([
    {
      id: 'ORD-98214',
      productName: 'Ultimate SaaS Funnel Template Pack',
      buyerEmail: 'sarah.j@growthbrand.com',
      amountUsd: 49.00,
      netSellerEarned: 26.95, // 55% after 40% affiliate & 10% platform fee
      promoterAttributed: 'EVO100245 (Direct Organic)',
      date: 'Today, 10:45 AM',
      status: 'Settled',
    },
    {
      id: 'ORD-98201',
      productName: 'AI Marketing Automation Masterclass',
      buyerEmail: 'michael.b@techconsult.org',
      amountUsd: 149.00,
      netSellerEarned: 81.95,
      promoterAttributed: 'EVO902144 (Affiliate)',
      date: 'Yesterday, 04:20 PM',
      status: 'Settled',
    },
    {
      id: 'ORD-98188',
      productName: 'Ultimate SaaS Funnel Template Pack',
      buyerEmail: 'grace.a@lagosbiz.ng',
      amountUsd: 49.00,
      netSellerEarned: 26.95,
      promoterAttributed: 'Direct (Organic)',
      date: 'May 18, 2026',
      status: 'Settled',
    },
  ]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Product = {
      id: `PROD-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      description: newDescription || 'High-converting digital resource for digital entrepreneurs.',
      price: parseFloat(newPrice) || 49.00,
      originalPrice: (parseFloat(newPrice) || 49.00) * 1.5,
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      seller: 'You (Apex Digital)',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badge: 'New',
      affiliateCommissionRate: parseFloat(newCommission),
      instantDownload: true,
      licenseType: 'Commercial',
    };

    setSellerProducts(prev => [created, ...prev]);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewPrice('49.00');
    setNewDescription('');
    setNewDownloadUrl('');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to remove this product from the marketplace?')) {
      setSellerProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = sellerProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.netSellerEarned, 0) + 24560.00;
  const totalOrdersCount = sellerOrders.length + 256;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 5 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +14.2% this month</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Orders</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{totalOrdersCount}</h3>
          <p className="text-xs text-slate-400 mt-1">Across {sellerProducts.length} products</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Products</span>
            <Store className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">{sellerProducts.length}</h3>
          <p className="text-xs text-slate-400 mt-1">100% digital fulfillment</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Affiliate Sales</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$8,450.00</h3>
          <p className="text-xs text-slate-400 mt-1">Driven by promoters</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Payout</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">$3,250.00</h3>
          <p className="text-xs text-slate-400 mt-1">Settled in EVO Tokens</p>
        </div>
      </div>

      {/* Seller Product Catalog Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Marketplace Store Catalog</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage digital products, pricing, and affiliate commission rates.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500 w-48 sm:w-60"
              />
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>List New Product</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Affiliate Commission</th>
                <th className="py-3.5 px-6">Total Sales</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 block">{prod.title}</span>
                        <span className="text-[11px] text-slate-400">{prod.category} • {prod.licenseType || 'Commercial'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${prod.price.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">({prod.price} EVO)</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="purple" size="sm">
                      {((prod.affiliateCommissionRate || 0.40) * 100).toFixed(0)}% to Promoters
                    </Badge>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">{prod.salesCount || 12} sold</td>
                  <td className="py-4 px-6">
                    <Badge variant="emerald" size="sm">Active (Approved)</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Order History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Recent Customer Orders & Commission Splits</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated Book 5 revenue distribution breakdown for each customer sale.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Order Total</th>
                <th className="py-3.5 px-6">Net Seller Revenue</th>
                <th className="py-3.5 px-6">Promoter Attribution</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellerOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{ord.productName}</td>
                  <td className="py-4 px-6 text-slate-600">{ord.buyerEmail}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">${ord.amountUsd.toFixed(2)}</td>
                  <td className="py-4 px-6 font-black text-emerald-600">
                    +${ord.netSellerEarned.toFixed(2)} EVO
                  </td>
                  <td className="py-4 px-6 text-indigo-600 font-medium">{ord.promoterAttributed}</td>
                  <td className="py-4 px-6">
                    <Badge variant="emerald" size="sm">{ord.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">List New Product on Eviona Marketplace</h3>
                <p className="text-xs text-slate-500">Every product is automatically available for ecosystem affiliates to promote.</p>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Converting Agency Client Acquisition Kit"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Retail Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                  >
                    <option>Templates</option>
                    <option>Digital Courses</option>
                    <option>eBooks</option>
                    <option>Software</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Promoter Affiliate Commission Rate</label>
                <select
                  value={newCommission}
                  onChange={(e) => setNewCommission(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                >
                  <option value="0.30">30% Commission (Low Incentive)</option>
                  <option value="0.40">40% Commission (Standard Platform Default)</option>
                  <option value="0.50">50% Commission (High Incentive)</option>
                  <option value="0.60">60% Commission (Maximum Viral Reach)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Platform takes standard 10% operational fee; remaining goes to seller net payout.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Digital Asset Download / Delivery URL</label>
                <input
                  type="url"
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  placeholder="https://cdn.yourdomain.com/downloads/package.zip"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the key features and deliverables included in this digital product..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
