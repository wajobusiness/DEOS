import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Star,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  Plus,
  Share2,
  X,
  Trash2,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  Download,
  Key,
  ShieldCheck,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Copy,
  Check,
  Tag,
  Heart,
  Zap,
  BookOpen,
  Layout,
  Cpu,
  Send,
  Palette,
  BarChart3,
  Music,
  Headphones,
  Lock,
  DollarSign,
  Store,
  Wallet,
  TrendingUp,
  Package
} from 'lucide-react';
import { Product, ViewType, Member } from '../types';
import { calculateMarketplaceFeeSplit } from '../engine/binaryEngine';
import { marketplaceEngine } from '../engine/marketplaceEngine';
import { AuthModal } from '../components/auth/AuthModal';
import { Badge } from '../components/common/Badge';
import { useWallet } from '../context/WalletContext';

interface MarketplaceHomeProps {
  onNavigate: (view: ViewType) => void;
  isPublicGuest?: boolean;
  currentUser?: Member;
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  onNavigate,
  isPublicGuest = false,
  currentUser,
}) => {
  const { walletBalance, processPurchase } = useWallet();
  // Navigation & Category Filters
  const [activeNavTab, setActiveNavTab] = useState<string>('Marketplace');
  const [activeSubTab, setActiveSubTab] = useState<'Featured' | 'Best Sellers' | 'Top Rated' | 'New Arrivals'>('Featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Popular');

  // Interactive States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth Modal State for Guest Actions
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Checkout State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState(currentUser?.name || '');
  const [checkoutEmail, setCheckoutEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'usdt' | 'bank'>('wallet');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Affiliate Promotion Modal
  const [promotingProduct, setPromotingProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStorefront, setCopiedStorefront] = useState(false);

  const rawCode = currentUser?.id || currentUser?.memberCode || '';
  const memberCode = rawCode ? (rawCode.startsWith('EVO-ID-') ? rawCode : `EVO-ID-${rawCode.replace(/^EVO-?I?D?-?/i, '')}`) : '';

  // Category Definitions
  const categoriesList = [
    { id: 'Digital Courses', label: 'Digital Courses', count: '1,250+ Products', icon: BookOpen, bg: 'bg-purple-50', text: 'text-purple-600' },
    { id: 'eBooks', label: 'eBooks & Guides', count: '2,350+ Products', icon: BookOpen, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { id: 'Templates', label: 'Templates', count: '1,890+ Products', icon: Layout, bg: 'bg-blue-50', text: 'text-blue-600' },
    { id: 'Software', label: 'Software & Tools', count: '1,670+ Products', icon: Cpu, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { id: 'Marketing', label: 'Marketing & SEO', count: '1,320+ Products', icon: Send, bg: 'bg-amber-50', text: 'text-amber-600' },
    { id: 'Graphics', label: 'Graphics & Design', count: '2,860+ Products', icon: Palette, bg: 'bg-teal-50', text: 'text-teal-600' },
    { id: 'Business', label: 'Business', count: '2,100+ Products', icon: BarChart3, bg: 'bg-violet-50', text: 'text-violet-600' },
    { id: 'Music', label: 'Music & Audio', count: '980+ Products', icon: Music, bg: 'bg-pink-50', text: 'text-pink-600' },
  ];

  // Dynamic Marketplace Catalog
  const [products, setProducts] = useState<Product[]>(() => marketplaceEngine.getProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(marketplaceEngine.getProducts());
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sellerName || p.seller || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product as Product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail || cart.length === 0) return;

    if (paymentMethod === 'wallet') {
      const orderDesc = `Marketplace Order: ${cart.map((c) => c.title).join(', ')}`;
      const result = processPurchase(cartTotal, orderDesc);
      if (!result.success) {
        alert(result.error || 'Insufficient wallet balance. Please deposit funds first.');
        return;
      }
    }

    // Record Real Seller Orders for each product purchased
    const activeRef = sessionStorage.getItem('eviona_active_ref') || undefined;
    cart.forEach((item) => {
      marketplaceEngine.recordPurchase({
        product: item,
        buyerEmail: checkoutEmail,
        buyerName: checkoutName || 'Customer',
        promoterCode: activeRef,
      });
    });

    setCompletedOrder({
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      buyerName: checkoutName || 'Entrepreneur',
      buyerEmail: checkoutEmail,
      items: cart,
      totalAmount: cartTotal,
      licenseKey: `EVO-LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    // Refresh products count
    setProducts(marketplaceEngine.getProducts());
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(false);
  };

  const handleCopyStorefront = () => {
    navigator.clipboard.writeText(`https://evionaecosystem.com/m/@${memberCode}`);
    setCopiedStorefront(true);
    setTimeout(() => setCopiedStorefront(false), 2000);
  };

  const handleCopyPromoteLink = (p: any) => {
    navigator.clipboard.writeText(`https://evionaecosystem.com/marketplace/p/${p.id}?ref=${memberCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans antialiased">
      {/* ========================================================================= */}
      {/* 1. PUBLIC NON-REGISTERED GUEST HEADER (ONLY SHOWN FOR PUBLIC VISITORS)    */}
      {/* ========================================================================= */}
      {isPublicGuest && (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs mb-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-6 shrink-0">
              <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">Eviona</span>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block -mt-0.5">Marketplace</span>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden xl:flex items-center gap-1 pl-2">
                <button
                  onClick={() => {
                    setActiveNavTab('Marketplace');
                    setSelectedCategory('All');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50/80"
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setSelectedCategory('Digital Courses')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Courses
                </button>
                <button
                  onClick={() => setSelectedCategory('Templates')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Templates
                </button>
                <button
                  onClick={() => setSelectedCategory('eBooks')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  eBooks
                </button>
                <button
                  onClick={() => setSelectedCategory('Software')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Tools
                </button>
              </nav>
            </div>

            {/* Header Search Input */}
            <div className="flex-1 max-w-md hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for products, courses, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
              <button className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Guest Action CTAs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 relative transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-bold shadow-xs hover:bg-slate-50 transition-all"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* 2. REGISTERED MEMBER PROMOTER BANNER (ONLY SHOWN FOR LOGGED-IN MEMBERS)   */}
      {/* ========================================================================= */}
      {!isPublicGuest && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-card mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Store className="w-3 h-3" />
                <span>Entrepreneur Marketplace Portal</span>
              </span>
              <span className="text-xs text-slate-400">Promoter ID: <b className="text-indigo-400 font-mono">{memberCode}</b></span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Promote Digital Products & Earn 40%–50% Commissions
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every digital asset purchased through your link earns you instant net promoter payouts, with 3% upline overrides distributed automatically through the Eviona compensation engine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCopyStorefront}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-indigo-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {copiedStorefront ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
              <span>{copiedStorefront ? 'Storefront Copied!' : 'Copy My Storefront Link'}</span>
            </button>

            <button
              onClick={() => onNavigate('sellers')}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>List My Product</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN MARKETPLACE CONTENT CANVAS                                        */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Main Marketplace Feed */}
          <div className="lg:col-span-9 space-y-8">
            {/* Hero Search Banner (For Public Guest) */}
            {isPublicGuest && (
              <div className="relative rounded-3xl bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-blue-50/80 border border-indigo-100/80 p-8 sm:p-10 overflow-hidden shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-indigo-200/80 text-indigo-700 text-[11px] font-bold shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Welcome to Eviona Marketplace</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      Buy. Discover. Succeed. <br />
                      <span className="text-indigo-600">All in One Place.</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                      Explore high-quality digital products, courses, templates, and tools from trusted creators.
                    </p>

                    <div className="pt-2 flex items-center max-w-lg relative shadow-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search for digital products, courses, templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-24 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
                      />
                      <button className="absolute right-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs">
                        Search
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                      <span className="text-slate-500 font-medium text-[11px]">Popular:</span>
                      {['Courses', 'Templates', 'eBooks', 'Software', 'Marketing'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 text-[11px] font-semibold"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 relative flex items-center justify-center">
                    <div className="relative w-full max-w-[280px] aspect-square bg-gradient-to-tr from-indigo-600/10 to-purple-600/20 rounded-3xl border border-indigo-200/50 flex flex-col items-center justify-center p-6 shadow-inner">
                      <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 mb-3 animate-pulse">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-md font-black text-xs">
                          $
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-md flex items-center gap-1.5 text-slate-900">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block leading-none">Trusted by</span>
                          <span className="text-xs font-black text-indigo-600 leading-none">50K+ Users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar (For Logged-in Members) */}
            {!isPublicGuest && (
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search catalog by title, creator, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Browse by Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Browse by Category</h3>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-2 transition-all hover:shadow-md ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedCategory === cat.id ? 'bg-white/20 text-white' : `${cat.bg} ${cat.text}`
                      }`}
                    >
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold leading-tight truncate">{cat.label}</h5>
                      <span className={`text-[9px] mt-0.5 block ${selectedCategory === cat.id ? 'text-indigo-100' : 'text-slate-400 font-medium'}`}>
                        {cat.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Products Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Featured Products</h3>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
                    {(['Featured', 'Best Sellers', 'Top Rated', 'New Arrivals'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSubTab(tab)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          activeSubTab === tab ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700">
                    <span>Sort by: <b>{sortBy}</b></span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* 5 Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {filteredProducts.map((prod) => {
                  const split = calculateMarketplaceFeeSplit(prod.price, prod.affiliateCommissionRate);
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide shadow-xs ${prod.badgeColor}`}>
                              {prod.badge}
                            </span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-3.5 space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                            {prod.title}
                          </h4>

                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <img src={prod.sellerAvatar} alt={prod.sellerName} className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-slate-200" />
                              <span className="font-semibold text-slate-600 truncate max-w-[80px]">{prod.sellerName}</span>
                            </div>

                            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{prod.rating}</span>
                              <span className="text-slate-400 font-normal">({prod.reviewsCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-3.5 pt-0 space-y-2.5 border-t border-slate-100 mt-2">
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-slate-900">${prod.price.toFixed(2)}</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {prod.discountBadge}
                            </span>
                          </div>

                          {/* Member Affiliate Badge / Promo Link */}
                          {!isPublicGuest && (
                            <button
                              onClick={() => handleCopyPromoteLink(prod)}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                              title="Copy your affiliate promo link"
                            >
                              <Share2 className="w-2.5 h-2.5" />
                              <span>Earn +${split.promoterCommissionNet.toFixed(0)}</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span>{prod.salesCount}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleFavorite(prod.id)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                favorites.includes(prod.id)
                                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                                  : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Heart className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => addToCart(prod)}
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 transition-all shadow-xs"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Trust Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-200/80">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900">Secure Payments</h6>
                  <p className="text-[10px] text-slate-500">100% safe transactions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900">Instant Access</h6>
                  <p className="text-[10px] text-slate-500">Immediate digital delivery</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900">Money Back</h6>
                  <p className="text-[10px] text-slate-500">7-day guarantee</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900">24/7 Support</h6>
                  <p className="text-[10px] text-slate-500">Always here to help</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900">Trusted Platform</h6>
                  <p className="text-[10px] text-slate-500">50K+ happy users</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Exclusive Offer Card */}
            <div className="rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden space-y-4">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                Exclusive Offer
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-white leading-tight">
                  Supercharge <br />Your Skills
                </h3>
                <p className="text-xs text-indigo-100 font-medium">
                  Get up to <b>50% off</b> on top-rated masterclasses & boilerplates.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                <Zap className="w-6 h-6 fill-amber-300" />
              </div>

              <button
                onClick={() => setSelectedCategory('All')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Explore Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Become a Seller Card (Public) or Seller Center (Member) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Store className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {isPublicGuest ? 'Become a Seller' : 'Seller Management Portal'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isPublicGuest
                    ? 'Start selling your digital products, courses, and tools to thousands of buyers.'
                    : 'List your digital products, manage orders, and track automated earnings.'}
                </p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700 text-left pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant Payouts via USDT / Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Low 10% Platform Fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Global Multi-Currency Reach</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isPublicGuest) {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  } else {
                    onNavigate('sellers');
                  }
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{isPublicGuest ? 'Start Selling Now' : 'Open Seller Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Why Choose Eviona Marketplace? */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Why Choose Eviona Marketplace?</h4>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-slate-900">High-Quality Products</h6>
                    <p className="text-[11px] text-slate-500">Handpicked and verified by our engineering team</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-slate-900">Instant Digital Delivery</h6>
                    <p className="text-[11px] text-slate-500">Get lifetime download access immediately after checkout</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-slate-900">High Affiliate Overrides</h6>
                    <p className="text-[11px] text-slate-500">Earn up to 50% on every recommendation you make</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Shopping Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Your cart is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                        <p className="text-xs font-bold text-indigo-600 mt-0.5">${item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Due:</span>
                  <span className="text-lg font-black text-indigo-600">${cartTotal.toFixed(2)} USD</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Checkout</h3>
                <p className="text-xs text-slate-500">Immediate digital license delivery</p>
              </div>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address for License Delivery</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {!isPublicGuest && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'wallet' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-indigo-600" />
                      <span className="text-[10px]">Eviona Wallet</span>
                      <span className="text-[9px] font-mono text-indigo-600">(${walletBalance.toFixed(2)})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px]">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('usdt')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'usdt' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span className="text-[10px]">USDT (TRC20)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'bank' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px]">Bank / Paystack</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Total Due:</span>
                <span className="text-base font-black text-indigo-600">${cartTotal.toFixed(2)} USD</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Purchase (${cartTotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-500">Order #{completedOrder.orderNumber} • {completedOrder.date}</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Digital License Key:</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-mono font-black text-xs text-indigo-700 select-all text-center">
                {completedOrder.licenseKey}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Files and confirmation receipt sent to <b>{completedOrder.buyerEmail}</b>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert('Downloading your digital package...')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Assets</span>
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Only for Guest mode) */}
      {isPublicGuest && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            onNavigate('dashboard');
          }}
        />
      )}
    </div>
  );
};
