import React, { useState, useEffect } from 'react';
import {
  Store,
  Share2,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Search,
  Star,
  Download,
  ShieldCheck,
  Zap,
  Mail,
  Phone,
  MessageCircle,
  Eye,
  DollarSign,
  Package,
  Plus,
  Trash2,
  Sliders,
  Palette,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  QrCode,
  Lock,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  FileText,
  HelpCircle,
  Percent,
  Bot
} from 'lucide-react';
import { Member, Product, UserStoreSettings, ViewType, StoreCoupon } from '../types';
import { Badge } from '../components/common/Badge';
import { marketplaceEngine } from '../engine/marketplaceEngine';
import { useWallet } from '../context/WalletContext';

interface UserStoreViewProps {
  currentUser?: Member;
  targetUserSlug?: string;
  onNavigate?: (view: ViewType) => void;
  isPublicDirect?: boolean;
}

export const UserStoreView: React.FC<UserStoreViewProps> = ({
  currentUser,
  targetUserSlug,
  onNavigate,
  isPublicDirect = false,
}) => {
  const { walletBalance, processPurchase } = useWallet();

  const activeUserId = currentUser?.id || 'EVO-ID-100245';
  const effectiveStoreOwnerId = targetUserSlug || activeUserId;
  const isOwner = !isPublicDirect && (effectiveStoreOwnerId === activeUserId || !targetUserSlug);

  const [storeSettings, setStoreSettings] = useState<UserStoreSettings>(() =>
    marketplaceEngine.getStoreSettings(effectiveStoreOwnerId, currentUser?.name)
  );

  const [activeTab, setActiveTab] = useState<'storefront' | 'customize' | 'curate' | 'coupons'>('storefront');
  const [storeProducts, setStoreProducts] = useState<Product[]>(() =>
    marketplaceEngine.getStoreProducts(effectiveStoreOwnerId)
  );
  const [allMarketplaceProducts, setAllMarketplaceProducts] = useState<Product[]>(() =>
    marketplaceEngine.getProducts()
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedStoreLink, setCopiedStoreLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Checkout Modal State
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [paymentRail, setPaymentRail] = useState<'wallet' | 'card' | 'paystack' | 'usdt'>('wallet');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Coupons State (Owner tab)
  const [storeCoupons, setStoreCoupons] = useState<StoreCoupon[]>(() =>
    marketplaceEngine.getStoreCoupons(storeSettings.userId)
  );
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Customization State
  const [editName, setEditName] = useState(storeSettings.storeName);
  const [editTagline, setEditTagline] = useState(storeSettings.tagline);
  const [editBio, setEditBio] = useState(storeSettings.bio);
  const [editTheme, setEditTheme] = useState(storeSettings.themeColor || 'indigo');
  const [editAnnouncement, setEditAnnouncement] = useState(storeSettings.announcementText || '');
  const [editAnnouncementActive, setEditAnnouncementActive] = useState(storeSettings.announcementActive !== false);
  const [editSupportEmail, setEditSupportEmail] = useState(storeSettings.supportEmail || '');
  const [editWhatsapp, setEditWhatsapp] = useState(storeSettings.whatsappNumber || '');
  const [editGoogleAnalytics, setEditGoogleAnalytics] = useState(storeSettings.trackingPixels?.googleAnalyticsId || '');
  const [editMetaPixel, setEditMetaPixel] = useState(storeSettings.trackingPixels?.facebookPixelId || '');
  const [editTikTokPixel, setEditTikTokPixel] = useState(storeSettings.trackingPixels?.tiktokPixelId || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const refreshStore = () => {
    const updatedSettings = marketplaceEngine.getStoreSettings(effectiveStoreOwnerId, currentUser?.name);
    setStoreSettings(updatedSettings);
    setStoreProducts(marketplaceEngine.getStoreProducts(effectiveStoreOwnerId));
    setAllMarketplaceProducts(marketplaceEngine.getProducts());
    setStoreCoupons(marketplaceEngine.getStoreCoupons(updatedSettings.userId));
  };

  const storeUrl = `https://evionaecosystem.com/store?user=${storeSettings.userId}`;

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedStoreLink(true);
    setTimeout(() => setCopiedStoreLink(false), 2500);
  };

  const handleSaveStoreCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const updated: UserStoreSettings = {
      ...storeSettings,
      storeName: editName,
      tagline: editTagline,
      bio: editBio,
      themeColor: editTheme as any,
      announcementText: editAnnouncement,
      announcementActive: editAnnouncementActive,
      supportEmail: editSupportEmail,
      whatsappNumber: editWhatsapp,
      trackingPixels: {
        googleAnalyticsId: editGoogleAnalytics,
        facebookPixelId: editMetaPixel,
        tiktokPixelId: editTikTokPixel,
      },
    };
    marketplaceEngine.saveStoreSettings(updated);
    setStoreSettings(updated);
    setIsSavingSettings(false);
    setActiveTab('storefront');
    alert('Storefront customizations saved successfully!');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForCheckout || !couponInput.trim()) return;
    const res = marketplaceEngine.validateCoupon(couponInput, storeSettings.userId, selectedProductForCheckout.price);
    if (res.valid) {
      setAppliedCoupon({ code: couponInput.toUpperCase(), discount: res.discountAmount, message: res.message });
    } else {
      alert(res.message);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    marketplaceEngine.createCoupon({
      storeId: storeSettings.userId,
      code: newCouponCode,
      discountType: newCouponType,
      discountValue: parseFloat(newCouponDiscount) || 10,
      isActive: true,
    });
    setStoreCoupons(marketplaceEngine.getStoreCoupons(storeSettings.userId));
    setNewCouponCode('');
    alert(`Coupon "${newCouponCode.toUpperCase()}" created!`);
  };

  const handleExecutePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForCheckout || !buyerEmail) return;

    setIsProcessingCheckout(true);
    try {
      const discount = appliedCoupon ? appliedCoupon.discount : 0;
      const finalPrice = Math.max(0, selectedProductForCheckout.price - discount);

      if (paymentRail === 'wallet') {
        const res = processPurchase(
          finalPrice,
          `Storefront Order: ${selectedProductForCheckout.title} (Store: ${storeSettings.storeName})`
        );
        if (!res.success) {
          alert(res.error || 'Insufficient wallet balance. Please select card or crypto.');
          setIsProcessingCheckout(false);
          return;
        }
      }

      // Record real order in unified engine
      const order = marketplaceEngine.recordPurchase({
        product: selectedProductForCheckout,
        buyerEmail: buyerEmail,
        buyerName: buyerName || 'Store Customer',
        promoterCode: storeSettings.userId,
        couponCode: appliedCoupon?.code,
        discountAmount: discount,
      });

      setCompletedOrder({
        orderId: order.id,
        product: selectedProductForCheckout,
        buyerEmail: buyerEmail,
        amount: finalPrice,
        licenseKey: `EVO-STORE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        downloadUrl: selectedProductForCheckout.downloadUrl || 'https://evionaecosystem.com/downloads/instant-asset.zip',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });

      setSelectedProductForCheckout(null);
      setAppliedCoupon(null);
      setCouponInput('');
      refreshStore();
    } catch (err: any) {
      alert(err.message || 'Purchase processing failed');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const filteredStoreProducts = storeProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const themeGradient =
    storeSettings.themeColor === 'purple'
      ? 'from-purple-950 via-slate-900 to-indigo-950 border-purple-500/20'
      : storeSettings.themeColor === 'emerald'
      ? 'from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/20'
      : storeSettings.themeColor === 'rose'
      ? 'from-rose-950 via-slate-900 to-pink-950 border-rose-500/20'
      : storeSettings.themeColor === 'amber'
      ? 'from-amber-950 via-slate-900 to-orange-950 border-amber-500/20'
      : 'from-slate-950 via-indigo-950 to-slate-900 border-indigo-500/20';

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Owner Header Control Hub */}
      {isOwner && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900">{storeSettings.storeName}</h4>
                <Badge variant="purple" size="sm">Storefront Hub</Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate max-w-xs">{storeUrl}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveTab('storefront')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'storefront' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Storefront View
              </button>
              <button
                onClick={() => setActiveTab('curate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'curate' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Catalog ({storeProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'coupons' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Coupons
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'customize' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Branding & Pixels
              </button>
            </div>

            <button
              onClick={handleCopyStoreLink}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
            >
              {copiedStoreLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedStoreLink ? 'Copied' : 'Copy Storefront Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode A: Public Storefront Display View */}
      {activeTab === 'storefront' && (
        <div className="space-y-6">
          {/* Announcement Strip */}
          {storeSettings.announcementActive && storeSettings.announcementText && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{storeSettings.announcementText}</span>
            </div>
          )}

          {/* Storefront Hero Banner */}
          <div className={`rounded-3xl p-6 sm:p-10 text-white shadow-card bg-gradient-to-br ${themeGradient} border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
              <img
                src={storeSettings.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={storeSettings.storeName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-white/20 shadow-xl bg-white"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{storeSettings.storeName}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Storefront
                  </span>
                </div>
                <p className="text-sm text-indigo-200 font-medium">{storeSettings.tagline}</p>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{storeSettings.bio}</p>

                {/* Contact & Support Pills */}
                <div className="flex items-center gap-3 pt-2 text-xs text-indigo-200 flex-wrap">
                  {storeSettings.supportEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {storeSettings.supportEmail}
                    </span>
                  )}
                  {storeSettings.whatsappNumber && (
                    <a
                      href={`https://api.whatsapp.com/send?phone=${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hello, I am contacting you regarding your store on Eviona: ${storeUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-emerald-300 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Direct WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Share & QR Code Actions */}
            <div className="flex items-center gap-2.5 z-10 w-full sm:w-auto">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md border border-white/10 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Store</span>
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                title="Store QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products in this store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Software & Tools', 'Templates', 'Digital Courses', 'Marketing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredStoreProducts.length === 0 ? (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No Products In Store</p>
              <p className="text-slate-400">Curate courses and templates from the Eviona Marketplace to showcase them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStoreProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-black text-slate-900 shadow-sm">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="text-xs font-black text-slate-900">{product.rating || 5.0}</span>
                          <span className="text-[11px] text-slate-400">({product.reviewsCount || 12} reviews)</span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2 leading-snug">
                          {product.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Instant Delivery</span>
                          <span className="text-base font-black text-indigo-600">${product.price.toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedProductForCheckout(product);
                            setAppliedCoupon(null);
                            setCouponInput('');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-transform active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
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

      {/* Mode B: Curate Marketplace Products Tab */}
      {activeTab === 'curate' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Curate Marketplace Products into Your Storefront</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle products from the global marketplace to display in your storefront. You earn full affiliate commission on every sale made through your store link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allMarketplaceProducts.map((p) => {
              const inStore = storeSettings.curatedMarketplaceProductIds?.includes(p.id);
              const commPct = p.commissionPercentage || Math.round((p.affiliateCommissionRate || 0.40) * 100);
              const promoterEarn = (p.price * (commPct / 100));

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    inStore ? 'border-purple-300 bg-purple-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-black text-slate-900">${p.price.toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-purple-700 font-bold">Earn {commPct}% (${promoterEarn.toFixed(2)} EVO)</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      let list = storeSettings.curatedMarketplaceProductIds || [];
                      if (list.includes(p.id)) {
                        list = list.filter(id => id !== p.id);
                      } else {
                        list = [...list, p.id];
                      }
                      storeSettings.curatedMarketplaceProductIds = list;
                      marketplaceEngine.saveStoreSettings(storeSettings);
                      refreshStore();
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                      inStore
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    }`}
                  >
                    {inStore ? 'Remove' : '+ Add to Store'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode C: Coupons & Discounts Tab */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Store Coupons & Discounts</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Create promotional discount codes for your customers and community.
              </p>
            </div>
          </div>

          {/* Create Coupon Form */}
          <form onSubmit={handleCreateCoupon} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. VIP20"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold uppercase outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
              <select
                value={newCouponType}
                onChange={(e) => setNewCouponType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              >
                <option value="percentage">Percentage (% OFF)</option>
                <option value="fixed">Fixed Dollar ($ OFF)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
              <input
                type="number"
                min="1"
                required
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Coupon</span>
              </button>
            </div>
          </form>

          {/* Active Coupons List */}
          <div className="divide-y divide-slate-100">
            {storeCoupons.map((c) => (
              <div key={c.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-black">
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

      {/* Mode D: Branding, SEO & Marketing Pixels Tab */}
      {activeTab === 'customize' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">Storefront Branding & Marketing Pixels</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure brand identity and connect Google Analytics, Meta Pixel, and TikTok tracking.
            </p>
          </div>

          <form onSubmit={handleSaveStoreCustomization} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Storefront Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Headline Tagline</label>
              <input
                type="text"
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Bio & Welcome Note</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Theme Gradient</label>
                <select
                  value={editTheme}
                  onChange={(e) => setEditTheme(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="indigo">Indigo Cosmic (Default)</option>
                  <option value="purple">Royal Purple Mastermind</option>
                  <option value="emerald">Emerald Growth & Wealth</option>
                  <option value="rose">Rose Luxury Elite</option>
                  <option value="amber">Amber Cyber Gold</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={editSupportEmail}
                  onChange={(e) => setEditSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Direct Support Number</label>
              <input
                type="text"
                placeholder="+1 (555) 019-2834"
                value={editWhatsapp}
                onChange={(e) => setEditWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-none focus:border-indigo-500"
              />
            </div>

            {/* Marketing Pixels Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Marketing Pixels & Conversion Tracking</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">Google Analytics (G-XXXX)</label>
                  <input
                    type="text"
                    placeholder="G-12345678"
                    value={editGoogleAnalytics}
                    onChange={(e) => setEditGoogleAnalytics(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">Meta / FB Pixel ID</label>
                  <input
                    type="text"
                    placeholder="123456789012345"
                    value={editMetaPixel}
                    onChange={(e) => setEditMetaPixel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">TikTok Pixel ID</label>
                  <input
                    type="text"
                    placeholder="C9XXXXXXXXXXXX"
                    value={editTikTokPixel}
                    onChange={(e) => setEditTikTokPixel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                {isSavingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Share Your Isolated Store</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Share your personal storefront link with friends and customers. All purchases made here are tracked and credited to your wallet.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-indigo-600 font-bold truncate">{storeUrl}</span>
              <button
                onClick={handleCopyStoreLink}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 shrink-0"
              >
                {copiedStoreLink ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my official digital store on Eviona: ${storeUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Explore my curated collection of premium tools and courses: ${storeUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Scan Storefront QR Code</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}`}
                alt="Storefront QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-xs text-slate-500 font-mono truncate">{storeUrl}</p>
          </div>
        </div>
      )}

      {/* Checkout Modal with Coupon Support */}
      {selectedProductForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Complete Store Purchase</h3>
                <p className="text-xs text-slate-500">Instant digital access delivered upon payment</p>
              </div>
              <button onClick={() => setSelectedProductForCheckout(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img src={selectedProductForCheckout.image} alt={selectedProductForCheckout.title} className="w-12 h-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate">{selectedProductForCheckout.title}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-indigo-600 font-black">
                    ${(selectedProductForCheckout.price - (appliedCoupon?.discount || 0)).toFixed(2)} EVO / USD
                  </p>
                  {appliedCoupon && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Coupon Applied (-${appliedCoupon.discount.toFixed(2)})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo / Coupon Code (e.g. LAUNCH20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>

            <form onSubmit={handleExecutePurchase} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email (for Instant Digital Delivery)</label>
                <input
                  type="email"
                  required
                  placeholder="alex@brand.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentRail}
                  onChange={(e) => setPaymentRail(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="wallet">Eviona Wallet (${walletBalance.toFixed(2)} Available)</option>
                  <option value="card">Credit / Debit Card (Stripe Instant)</option>
                  <option value="paystack">Paystack (NGN / Local Bank)</option>
                  <option value="usdt">Crypto USDT (TRC20 Instant)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProductForCheckout(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingCheckout}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isProcessingCheckout
                    ? 'Processing...'
                    : `Pay $${(selectedProductForCheckout.price - (appliedCoupon?.discount || 0)).toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completed Order Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Purchase Confirmed!</h3>
            <p className="text-xs text-slate-500">
              Your license key and digital download files have been generated and sent to <span className="font-bold text-slate-800">{completedOrder.buyerEmail}</span>.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">License Key:</span>
                <span className="font-mono font-bold text-purple-600">{completedOrder.licenseKey}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={completedOrder.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Download Assets Now</span>
              </a>

              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
