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
  ChevronLeft
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

  const categories = [
    'All',
    'Digital Courses',
    'Website Templates',
    'Marketing & SEO',
    'Software & Tools',
    'Graphics & Design',
    'AI Tools'
  ];

  const filteredProducts = initialProducts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Guest Checkout Submission & MLM Binary Bridge
  const handleProcessGuestCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || cart.length === 0) return;

    // Run compensation engine calculation on cart
    const splits = cart.map(item => ({
      item: item.title,
      price: item.price,
      split: calculateMarketplaceFeeSplit(item.price, item.affiliateCommissionRate),
    }));

    const totalPromoterEarned = splits.reduce((acc, curr) => acc + curr.split.promoterCommissionNet, 0);
    const totalUplineOverride = splits.reduce((acc, curr) => acc + curr.split.uplineOverride, 0);

    setCompletedOrder({
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      buyerName: guestName || 'Guest Customer',
      buyerEmail: guestEmail,
      items: cart,
      totalAmount: cartTotal,
      affiliateAttributed: referringAffiliateId,
      promoterCommissionPaidDEOS: totalPromoterEarned,
      uplineOverridePaidDEOS: totalUplineOverride,
      digitalDownloadKey: `DEOS-LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    });

    setIsGuestCheckoutModalOpen(false);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Optional Public Guest Header Bar */}
      {isPublicGuest && (
        <div className="bg-slate-900 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 px-6 py-4 border-b border-slate-800 text-white flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to DEOS Home</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-indigo-300 hidden sm:inline">
              Earn up to 60% promoting these products
            </span>
            <button
              onClick={() => onNavigate('onboarding')}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Become an Affiliate
            </button>
          </div>
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search digital courses, templates, AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => onNavigate('sellers')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Become a Seller
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({cart.length}) • {cartTotal.toFixed(2)} DEOS</span>
          </button>
        </div>
      </div>

      {/* Hero Banner: Public Digital Commerce with DEOS Coin Utility Credit Standard */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEOS Public Commerce Engine (Book 5)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buy. Promote. Earn. <br />Powered by DEOS Coin Utility Economy.
          </h2>
          <p className="text-xs text-indigo-200">
            Fixed value: <b>1.00 DEOS = $1.00 USD</b>. Non-members can purchase via Guest Checkout with instant affiliate commission routing.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
            <p className="text-2xl font-black text-white">60%</p>
            <p className="text-[10px] text-indigo-200">Max Affiliate Comm.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
            <p className="text-2xl font-black text-white">3%</p>
            <p className="text-[10px] text-indigo-200">Upline Override</p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Image & Badge */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {product.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-medium text-slate-700">{product.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                  {product.title}
                </h3>

                {/* Affiliate Commission Tag */}
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {(product.affiliateCommissionRate * 100).toFixed(0)}% Affiliate Comm. ({(product.price * product.affiliateCommissionRate).toFixed(2)} DEOS)
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart (Enforcing DEOS Coin Model A Token Standard) */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Price</span>
                <p className="text-lg font-extrabold text-slate-900">{product.price.toFixed(2)} DEOS</p>
                <p className="text-[10px] text-slate-400 font-medium">(${product.price.toFixed(2)} USD)</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Copied Affiliate Link with sponsor ID for ${product.title}!`)}
                  title="Copy Affiliate Referral Link"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => addToCart(product)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Your Shopping Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-3 overflow-y-auto max-h-[60vh]">
                {cart.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-12">Your cart is empty.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs font-semibold text-indigo-600">{item.price.toFixed(2)} DEOS (${item.price.toFixed(2)})</p>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Bottom Checkout Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>Subtotal</span>
                <span>{cartTotal.toFixed(2)} DEOS (${cartTotal.toFixed(2)} USD)</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  disabled={cart.length === 0}
                  onClick={() => setIsGuestCheckoutModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Guest Checkout (Credit Card / USDT)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    alert('Order completed using your internal DEOS Coin Wallet balance!');
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-bold text-xs transition-colors"
                >
                  Pay with Member DEOS Coin Balance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Checkout Modal with Affiliate Attribution & MLM Split Engine Bridge */}
      {isGuestCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Marketplace Guest Checkout</h3>
                <p className="text-xs text-slate-500">Fast digital delivery with affiliate attribution</p>
              </div>
              <button onClick={() => setIsGuestCheckoutModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Referring Affiliate Attribution Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Referring Affiliate</span>
                <span className="font-bold text-indigo-900">{referringAffiliateId}</span>
              </div>
              <Badge variant="purple" size="sm">Attributed</Badge>
            </div>

            <form onSubmit={handleProcessGuestCheckout} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (Digital Download Key will be sent here)</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', name: 'Credit Card', icon: CreditCard },
                    { id: 'usdt', name: 'USDT (TRC20)', icon: Coins },
                    { id: 'bank', name: 'Bank Transfer', icon: Building2 },
                    { id: 'momo', name: 'Mobile Money', icon: Smartphone },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = guestPaymentMethod === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setGuestPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer text-center space-y-1.5 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mx-auto ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <p className="text-[10px]">{m.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary & MLM Split Breakdown Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Order Total</span>
                  <span className="text-base text-indigo-600">{cartTotal.toFixed(2)} DEOS (${cartTotal.toFixed(2)} USD)</span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Platform Fee (10%):</span>
                    <span>{(cartTotal * 0.10).toFixed(2)} DEOS</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promoter Affiliate Earns:</span>
                    <span>~{(cartTotal * 0.40 * 0.97).toFixed(2)} DEOS</span>
                  </div>
                  <div className="flex justify-between text-purple-700">
                    <span>Upline 3% Override:</span>
                    <span>~{(cartTotal * 0.40 * 0.03).toFixed(2)} DEOS</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Pay ${cartTotal.toFixed(2)} & Receive Instant Download</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Completed Order Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500">Order ID: <code className="font-mono font-bold text-slate-800">{completedOrder.orderId}</code></p>
            </div>

            {/* License & Download Key */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white text-left space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Digital Access License Key</p>
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm font-black text-emerald-400">{completedOrder.digitalDownloadKey}</code>
                <button
                  onClick={() => alert('License key copied to clipboard!')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Copy Key
                </button>
              </div>
            </div>

            {/* MLM Binary Engine Commission Attribution Card */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-left space-y-1.5 text-xs text-indigo-950">
              <p className="font-bold">MLM Binary Commission Settlement:</p>
              <p className="text-slate-600">
                • Promoter Take-Home: <b>+${completedOrder.promoterCommissionPaidDEOS.toFixed(2)} DEOS</b> credited to {completedOrder.affiliateAttributed}
              </p>
              <p className="text-slate-600">
                • Upline 3% Override: <b>+${completedOrder.uplineOverridePaidDEOS.toFixed(2)} DEOS</b> routed to upline sponsor.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
              >
                Done & Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
