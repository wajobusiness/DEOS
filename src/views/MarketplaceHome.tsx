import React, { useState } from 'react';
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
  SlidersHorizontal,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import { initialProducts } from '../store/mockData';
import { Product, ViewType } from '../types';
import { calculateMarketplaceFeeSplit } from '../engine/binaryEngine';
import { Badge } from '../components/common/Badge';

interface MarketplaceHomeProps {
  onNavigate: (view: ViewType) => void;
  isPublicGuest?: boolean;
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  onNavigate,
  isPublicGuest = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guest Checkout & Attribution State
  const [isGuestCheckoutModalOpen, setIsGuestCheckoutModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPaymentMethod, setGuestPaymentMethod] = useState<'card' | 'usdt' | 'bank' | 'momo'>('card');
  const [referringAffiliateId, setReferringAffiliateId] = useState<string>('DEOS100245 (John Doe)');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Affiliate Promote Modal
  const [promotingProduct, setPromotingProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    'All',
    'Courses',
    'Software',
    'Templates',
    'Services',
    'AI Tools',
    'Digital Products'
  ];

  const filteredProducts = initialProducts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (p: Product) => {
    setCart(prev => [...prev, p]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Guest Checkout Submission & Split Processing
  const handleProcessGuestCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || cart.length === 0) return;

    const splits = cart.map(item => ({
      item: item.title,
      price: item.price,
      split: calculateMarketplaceFeeSplit(item.price, item.affiliateCommissionRate),
    }));

    const totalPromoterEarned = splits.reduce((acc, curr) => acc + curr.split.promoterCommissionNet, 0);
    const totalUplineOverride = splits.reduce((acc, curr) => acc + curr.split.uplineOverride, 0);

    setCompletedOrder({
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      buyerName: guestName || 'Customer',
      buyerEmail: guestEmail,
      items: cart,
      totalAmount: cartTotal,
      licenseKey: `DEOS-LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      splits,
      totalPromoterEarned,
      totalUplineOverride,
      paymentMethod: guestPaymentMethod,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    setCart([]);
    setIsCartOpen(false);
  };

  const handleCopyPromoteLink = (p: Product) => {
    const link = `https://deos.com/marketplace/p/${p.id}?ref=DEOS100245`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Top Banner: Standalone E-Commerce Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-bold backdrop-blur-md">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
            <span>DEOS Global Digital Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Discover, Buy & Sell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">
              World-Class Digital Assets
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Instant digital delivery with secure checkout. Explore top-rated masterclasses, developer boilerplates, UI kits, AI tools, and growth services.
          </p>

          {/* Search Bar in Hero */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search products, courses, templates, software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs font-medium text-white placeholder-slate-400 outline-none backdrop-blur-md focus:bg-white/15 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Floating Cart Trigger */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const split = calculateMarketplaceFeeSplit(product.price, product.affiliateCommissionRate);
          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Product Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-extrabold shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={product.sellerAvatar}
                        alt={product.sellerName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-700">{product.sellerName}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer: Pricing & Action Buttons */}
              <div className="p-5 pt-0 space-y-3 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <span className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 ml-1 font-mono">({product.price} DEOS)</span>
                  </div>

                  <button
                    onClick={() => setPromotingProduct(product)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Earn ${(split.promoterCommissionNet).toFixed(2)}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      setCart([product]);
                      setIsGuestCheckoutModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sliding Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Your Shopping Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
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
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                        <p className="text-xs font-bold text-indigo-600 mt-0.5">${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
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
                  <span>Total Amount:</span>
                  <span className="text-lg font-black text-indigo-600">${cartTotal.toFixed(2)} USD</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsGuestCheckoutModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guest Checkout Modal */}
      {isGuestCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Guest Checkout</h3>
                <p className="text-xs text-slate-500">Instant digital delivery to your email</p>
              </div>
              <button
                onClick={() => setIsGuestCheckoutModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessGuestCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email for Digital License Delivery</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card (Stripe)', icon: CreditCard },
                    { id: 'bank', label: 'Bank / Paystack', icon: Building2 },
                    { id: 'usdt', label: 'USDT (TRC20)', icon: Coins },
                    { id: 'momo', label: 'Mobile Money', icon: Smartphone },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setGuestPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        guestPaymentMethod === m.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Total Due:</span>
                <span className="text-base font-black text-indigo-600">${cartTotal.toFixed(2)} USD</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Purchase (${cartTotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Completed Order Digital Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Purchase Successful!</h3>
              <p className="text-xs text-slate-500">Order #{completedOrder.orderNumber} • {completedOrder.date}</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Your Digital License Key:</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-mono font-black text-xs text-indigo-700 select-all text-center">
                {completedOrder.licenseKey}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Digital files & receipt sent to <b>{completedOrder.buyerEmail}</b>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert('Downloading digital package zip...')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
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

      {/* Affiliate Promote Modal */}
      {promotingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Promote & Earn</h3>
              </div>
              <button
                onClick={() => setPromotingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Promote <b>{promotingProduct.title}</b> and earn a net commission on every sale made through your link:
              </p>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Product Price:</span>
                  <span>${promotingProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600 text-sm">
                  <span>Your Net Commission:</span>
                  <span>+${(calculateMarketplaceFeeSplit(promotingProduct.price, promotingProduct.affiliateCommissionRate).promoterCommissionNet).toFixed(2)} USD</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Unique Affiliate Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://deos.com/marketplace/p/${promotingProduct.id}?ref=DEOS100245`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700 outline-none"
                  />
                  <button
                    onClick={() => handleCopyPromoteLink(promotingProduct)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
