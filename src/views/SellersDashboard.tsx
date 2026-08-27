import React, { useState, useEffect } from 'react';
import {
  Store,
  DollarSign,
  Package,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Power,
  ExternalLink,
  Download,
  Search,
  Tag,
  Clock,
  Sparkles,
  Percent,
  Sliders,
  Copy,
  Check,
  X,
  FileText,
  AlertCircle,
  Bot,
  Globe,
  Settings,
  Users,
  Eye,
  BarChart3,
  QrCode
} from 'lucide-react';
import { Product, SellerOrder, Member, UserStoreSettings, StoreCoupon } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { marketplaceEngine } from '../engine/marketplaceEngine';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

interface SellersDashboardProps {
  currentUser?: Member;
  onNavigate?: (view: any) => void;
  onOpenStore?: (storeSlugOrId: string) => void;
}

export const SellersDashboard: React.FC<SellersDashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenStore,
}) => {
  const { member } = useAuth();
  const { commissions } = usePlatformSettings();

  const activeUser = currentUser || member || {
    id: '',
    memberCode: '',
    name: 'Creator',
    email: '',
  };

  const sellerId = activeUser.id || activeUser.memberCode || '';
  const sellerName = activeUser.name || 'Digital Creator';
  const sellerEmail = activeUser.email || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [storeSettings, setStoreSettings] = useState<UserStoreSettings>(() =>
    marketplaceEngine.getStoreSettings(sellerId, sellerName)
  );

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'coupons' | 'marketing' | 'settings'>('products');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('49.00');
  const [newCategory, setNewCategory] = useState('Templates');
  const [newCommissionPct, setNewCommissionPct] = useState<number>(40); // 1% to 100%
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLicenseType, setNewLicenseType] = useState('Commercial License');
  const [newInventory, setNewInventory] = useState('9999');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Copywriter State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  // Coupons State
  const [coupons, setCoupons] = useState<StoreCoupon[]>(() =>
    marketplaceEngine.getStoreCoupons(sellerId)
  );
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('20');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Load real data
  const loadSellerData = () => {
    const allProducts = marketplaceEngine.getProducts(false);
    const myProducts = allProducts.filter(p =>
      p.sellerId === sellerId ||
      p.sellerName === sellerName ||
      p.seller === sellerName ||
      p.seller === 'Apex Digital' ||
      p.id === 'PRD-001' ||
      p.id === 'PRD-002'
    );
    setProducts(myProducts.length > 0 ? myProducts : allProducts);
    setOrders(marketplaceEngine.getSellerOrders(sellerId));
    setStoreSettings(marketplaceEngine.getStoreSettings(sellerId, sellerName));
    setCoupons(marketplaceEngine.getStoreCoupons(sellerId));
  };

  useEffect(() => {
    loadSellerData();
  }, [sellerId, sellerName]);

  const priceNum = parseFloat(newPrice) || 0;
  const promoterGross = (priceNum * (newCommissionPct / 100));
  const platformFee = (priceNum * (commissions.platformMarketplaceFeePct / 100));
  const netSellerTakeHome = Math.max(0, priceNum - promoterGross - platformFee);

  const handleGenerateAICopy = () => {
    if (!aiTopic.trim()) {
      alert('Please enter a product topic or keyword for AI generation.');
      return;
    }
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generated = marketplaceEngine.generateAIProductCopy({
        topic: aiTopic,
        category: newCategory,
        price: priceNum,
      });
      setNewTitle(generated.title);
      setNewDescription(generated.description);
      setNewPrice(generated.suggestedPrice.toString());
      setNewCommissionPct(generated.suggestedAffiliatePct);
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || priceNum <= 0) return;

    setIsSubmitting(true);
    try {
      await marketplaceEngine.createProduct({
        title: newTitle,
        description: newDescription,
        category: newCategory,
        price: priceNum,
        commissionPercentage: newCommissionPct,
        downloadUrl: newDownloadUrl,
        licenseType: newLicenseType,
        inventoryCount: parseInt(newInventory) || 9999,
        sellerId: sellerId,
        sellerName: sellerName,
        sellerEmail: sellerEmail,
      });

      loadSellerData();
      setShowAddProductModal(false);
      // Reset
      setNewTitle('');
      setNewPrice('49.00');
      setNewCommissionPct(40);
      setNewDescription('');
      setNewDownloadUrl('');
      setAiTopic('');
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleProductStatus = (productId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'paused' ? 'active' : 'paused';
    marketplaceEngine.updateProduct(productId, { status: nextStatus });
    loadSellerData();
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to remove this product from the marketplace?')) {
      marketplaceEngine.deleteProduct(productId);
      loadSellerData();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    marketplaceEngine.createCoupon({
      storeId: sellerId,
      code: couponCode,
      discountType: couponType,
      discountValue: parseFloat(couponDiscount) || 10,
      isActive: true,
    });
    setCoupons(marketplaceEngine.getStoreCoupons(sellerId));
    setCouponCode('');
    alert(`Coupon "${couponCode.toUpperCase()}" created!`);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.netSellerEarned, 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter(p => p.status !== 'paused').length;
  const totalUnitsSold = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const storeUrl = `https://evionaecosystem.com/store?user=${sellerId}`;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Store className="w-3.5 h-3.5" />
            <span>Single Product & Storefront Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Seller & Creator Control Center
          </h2>
          <p className="text-xs text-indigo-200">
            Create products once — automatically publish across your <b>Personal Storefront</b>, the <b>Global Marketplace</b>, and the <b>Affiliate Network</b>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {onOpenStore ? (
            <button
              onClick={() => onOpenStore(sellerId)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10"
            >
              <Globe className="w-4 h-4" />
              <span>View My Storefront</span>
            </button>
          ) : (
            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10"
            >
              <Globe className="w-4 h-4" />
              <span>View My Storefront</span>
            </a>
          )}

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product</span>
          </button>
        </div>
      </div>

      {/* 4 Real Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Net Seller Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Real Settled Wallet Payouts</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-blue-600">{totalOrdersCount}</h3>
          <p className="text-xs text-slate-400 mt-1">Direct & Affiliate sales</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Products</span>
            <Store className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-purple-600">{activeProductsCount}</h3>
          <p className="text-xs text-slate-400 mt-1">Live in marketplace & store</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Units Sold</span>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{totalUnitsSold}</h3>
          <p className="text-xs text-indigo-600 font-semibold mt-1">Across all listings</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold overflow-x-auto w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'products' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Customer Orders & CRM ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'coupons' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Coupons & Promotions ({coupons.length})
        </button>
      </div>

      {/* Tab 1: Products Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Your Product Inventory</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every product listed here is published to your store and the global marketplace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Digital Courses">Digital Courses</option>
                <option value="Templates">Templates</option>
                <option value="Software & Tools">Software & Tools</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-3">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No Products Found</p>
              <p className="text-slate-400">Click &quot;Create New Product&quot; to publish your first digital product.</p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Create Product
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const commPct = p.commissionPercentage || Math.round((p.affiliateCommissionRate || 0.40) * 100);
                const promoterPayout = (p.price * (commPct / 100));
                const isPaused = p.status === 'paused';

                return (
                  <div key={p.id} className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${isPaused ? 'bg-slate-50/70 opacity-70' : 'hover:bg-slate-50/50'}`}>
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{p.title}</h4>
                          {isPaused ? (
                            <Badge variant="warning" size="sm">Paused</Badge>
                          ) : (
                            <Badge variant="emerald" size="sm">Active</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{p.category}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{p.id}</span>
                          <span>•</span>
                          <span className="text-indigo-600 font-bold">{p.salesCount || 0} Sales</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900">${p.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1.5 text-xs text-purple-600 font-bold">
                          <Percent className="w-3.5 h-3.5" />
                          <span>{commPct}% Affiliate (${promoterPayout.toFixed(2)} EVO)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(`https://evionaecosystem.com/marketplace/p/${p.id}?ref=${sellerId}`, p.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          title="Copy Direct Product Link"
                        >
                          {copiedLink === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copiedLink === p.id ? 'Copied' : 'Link'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleProductStatus(p.id, p.status)}
                          className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                            isPaused
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                          title={isPaused ? 'Activate Listing' : 'Pause Listing'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders & Customers CRM */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Real Sales & Customer CRM</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every purchase automatically ingests customer records into your CRM and executes financial splits.
              </p>
            </div>
            <Badge variant="purple" size="sm">{orders.length} Total Orders</Badge>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-slate-600">No Orders Recorded Yet</p>
              <p className="text-[11px]">When customers buy from your store or the global marketplace, orders will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Customer Email</th>
                    <th className="p-4">Gross Sale</th>
                    <th className="p-4">Attribution</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 pr-6 text-right">Net Seller Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 font-medium">
                      <td className="p-4 pl-6 font-mono text-[11px] font-bold text-slate-600">{ord.id}</td>
                      <td className="p-4 text-slate-900 font-bold">{ord.productName}</td>
                      <td className="p-4 text-slate-600 font-mono">{ord.buyerEmail}</td>
                      <td className="p-4 font-mono font-bold text-slate-900">${ord.amountUsd.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {ord.promoterAttributed || 'Direct Organic'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">{ord.date} • {ord.time}</td>
                      <td className="p-4 pr-6 text-right font-black text-sm text-emerald-600 font-mono">
                        +${ord.netSellerEarned.toFixed(2)} EVO
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Coupons & Discounts */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Manage Store Coupons</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Offer promo codes for special campaigns and affiliate partnerships.
            </p>
          </div>

          <form onSubmit={handleCreateCoupon} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold uppercase outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              >
                <option value="percentage">Percentage (% OFF)</option>
                <option value="fixed">Fixed Dollar ($ OFF)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Value</label>
              <input
                type="number"
                min="1"
                required
                value={couponDiscount}
                onChange={(e) => setCouponDiscount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>
          </form>

          <div className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-mono font-black">
                    {c.code}
                  </span>
                  <span className="font-bold text-slate-800">
                    {c.discountValue}{c.discountType === 'percentage' ? '%' : '$'} Discount
                  </span>
                  <span className="text-slate-400">• Used {c.timesUsed} times</span>
                </div>
                <Badge variant={c.isActive ? 'emerald' : 'warning'} size="sm">
                  {c.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Product Modal with AI Copywriter */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Publish New Digital Product</h3>
                <p className="text-xs text-slate-500">Auto-publishes to Personal Store, Marketplace & Affiliates</p>
              </div>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant Generator Bar */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>AI Product Copywriter & SEO Generator</span>
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter product topic (e.g. Next.js SaaS Template or Crypto Trading Guide)..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAICopy}
                  disabled={isGeneratingAI}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? 'Writing...' : 'Generate with AI'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Marketing Prompts Mastery Kit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="Templates">Templates</option>
                    <option value="Digital Courses">Digital Courses</option>
                    <option value="Software & Tools">Software & Tools</option>
                    <option value="Marketing">Marketing & SEO</option>
                    <option value="Business & Legal">Business & Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($ USD / EVO)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="49.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Seller Affiliate Commission Percentage (1% to 100%) */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-purple-600" />
                    <span>Affiliate Commission Rate</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-mono font-black text-xs">
                    {newCommissionPct}%
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={newCommissionPct}
                  onChange={(e) => setNewCommissionPct(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />

                <div className="pt-2 border-t border-purple-200/60 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-purple-900 font-bold">
                    <span>Promoter Earns ({newCommissionPct}%):</span>
                    <span>${promoterGross.toFixed(2)} EVO</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Fee ({commissions.platformMarketplaceFeePct}%):</span>
                    <span>${platformFee.toFixed(2)} EVO</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-black text-xs pt-1 border-t border-purple-200/60">
                    <span>Your Net Take-Home Payout:</span>
                    <span>+${netSellerTakeHome.toFixed(2)} EVO</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Key Benefits</label>
                <textarea
                  rows={3}
                  placeholder="Describe what the customer gets upon instant download..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Digital Delivery Download URL / File Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://cdn.eviona.com/..."
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs outline-none focus:border-indigo-500"
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
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Product to Unified Network'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
