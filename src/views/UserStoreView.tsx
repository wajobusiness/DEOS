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
  Clock
} from 'lucide-react';
import { Member, Product, UserStoreSettings, ViewType } from '../types';
import { Badge } from '../components/common/Badge';
import { storeEngine } from '../engine/storeEngine';
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

  // Determine Store Owner Identity
  const activeUserId = currentUser?.id || 'EVO-ID-100245';
  const effectiveStoreOwnerId = targetUserSlug || activeUserId;
  const isOwner = !isPublicDirect && (effectiveStoreOwnerId === activeUserId || !targetUserSlug);

  // Store Settings & Catalog State
  const [storeSettings, setStoreSettings] = useState<UserStoreSettings>(() =>
    storeEngine.getStoreSettings(effectiveStoreOwnerId, currentUser?.name)
  );

  const [activeTab, setActiveTab] = useState<'storefront' | 'customize' | 'curate'>('storefront');
  const [storeProducts, setStoreProducts] = useState<Product[]>(() =>
    storeEngine.getStoreProducts(effectiveStoreOwnerId)
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
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Store Customization Form State
  const [editName, setEditName] = useState(storeSettings.storeName);
  const [editTagline, setEditTagline] = useState(storeSettings.tagline);
  const [editBio, setEditBio] = useState(storeSettings.bio);
  const [editTheme, setEditTheme] = useState(storeSettings.themeColor || 'indigo');
  const [editAnnouncement, setEditAnnouncement] = useState(storeSettings.announcementText || '');
  const [editAnnouncementActive, setEditAnnouncementActive] = useState(storeSettings.announcementActive !== false);
  const [editSupportEmail, setEditSupportEmail] = useState(storeSettings.supportEmail || '');
  const [editWhatsapp, setEditWhatsapp] = useState(storeSettings.whatsappNumber || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Record visit on mount
  useEffect(() => {
    storeEngine.recordStoreView(effectiveStoreOwnerId);
  }, [effectiveStoreOwnerId]);

  // Sync products and settings
  const refreshStore = () => {
    const updatedSettings = storeEngine.getStoreSettings(effectiveStoreOwnerId, currentUser?.name);
    setStoreSettings(updatedSettings);
    setStoreProducts(storeEngine.getStoreProducts(effectiveStoreOwnerId));
    setAllMarketplaceProducts(marketplaceEngine.getProducts());
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
    };
    storeEngine.saveStoreSettings(updated);
    setStoreSettings(updated);
    setIsSavingSettings(false);
    setActiveTab('storefront');
    alert('Storefront customizations saved successfully!');
  };

  const handleToggleCurateProduct = (productId: string) => {
    storeEngine.toggleProductInStore(storeSettings.userId, productId);
    refreshStore();
  };

  const handleBuyProduct = (product: Product) => {
    setSelectedProductForCheckout(product);
  };

  const handleExecutePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForCheckout || !buyerEmail) return;

    setIsProcessingCheckout(true);
    try {
      if (paymentRail === 'wallet') {
        const res = processPurchase(
          selectedProductForCheckout.price,
          `Storefront Purchase: ${selectedProductForCheckout.title} (Store: ${storeSettings.storeName})`
        );
        if (!res.success) {
          alert(res.error || 'Insufficient wallet balance. Please select card or crypto.');
          setIsProcessingCheckout(false);
          return;
        }
      }

      // Record real seller order & affiliate attribution to store owner
      const order = marketplaceEngine.recordPurchase({
        product: selectedProductForCheckout,
        buyerEmail: buyerEmail,
        buyerName: buyerName || 'Storefront Customer',
        promoterCode: storeSettings.userId,
      });

      setCompletedOrder({
        orderId: order.id,
        product: selectedProductForCheckout,
        buyerEmail: buyerEmail,
        amount: selectedProductForCheckout.price,
        licenseKey: `EVO-STORE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        downloadUrl: selectedProductForCheckout.downloadUrl || 'https://evionaecosystem.com/downloads/instant-asset.zip',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });

      setSelectedProductForCheckout(null);
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
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Owner Top Navigation Bar */}
      {isOwner && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Your Isolated Storefront Hub</h4>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{storeUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveTab('storefront')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'storefront' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Storefront Preview
              </button>
              <button
                onClick={() => setActiveTab('curate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'curate' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Curate Products ({storeProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'customize' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Branding & Settings
              </button>
            </div>

            <button
              onClick={handleCopyStoreLink}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
            >
              {copiedStoreLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedStoreLink ? 'Copied Link' : 'Copy Store Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode A: Storefront View (Customer / Visitor View) */}
      {activeTab === 'storefront' && (
        <div className="space-y-6">
          {/* Store Announcement Bar */}
          {storeSettings.announcementActive && storeSettings.announcementText && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-2">
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-white/20 shadow-xl"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{storeSettings.storeName}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Store
                  </span>
                </div>
                <p className="text-sm text-indigo-200 font-medium">{storeSettings.tagline}</p>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{storeSettings.bio}</p>

                {/* Contact Pills */}
                <div className="flex items-center gap-3 pt-2 text-xs text-indigo-200">
                  {storeSettings.supportEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {storeSettings.supportEmail}
                    </span>
                  )}
                  {storeSettings.whatsappNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      WhatsApp Order Ready
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share & Action Buttons */}
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
                placeholder="Search store catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Templates', 'Digital Courses', 'Software & Tools', 'Marketing'].map((cat) => (
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

          {/* Storefront Products Grid */}
          {filteredStoreProducts.length === 0 ? (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No Products In Store</p>
              <p className="text-slate-400">Curate courses and templates from the Eviona Marketplace to showcase them here.</p>
              {isOwner && (
                <button
                  onClick={() => setActiveTab('curate')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Curate Marketplace Products</span>
                </button>
              )}
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
                          <span className="text-[10px] text-slate-400 font-bold block">Instant Download</span>
                          <span className="text-base font-black text-indigo-600">${product.price.toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => handleBuyProduct(product)}
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

      {/* Mode B: Curate Marketplace Products Tab (Owner Only) */}
      {activeTab === 'curate' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Curate Products into Your Storefront</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle any product from the Eviona Marketplace to appear directly in your personal store. When visitors purchase through your store, you earn full affiliate commission.
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
                    onClick={() => handleToggleCurateProduct(p.id)}
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

      {/* Mode C: Customize Branding & Settings Tab (Owner Only) */}
      {activeTab === 'customize' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">Storefront Branding & Visual Identity</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize how your personal isolated store appears to friends and customers.
            </p>
          </div>

          <form onSubmit={handleSaveStoreCustomization} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline / Headline</label>
              <input
                type="text"
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Bio & Welcome Message</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Theme Color Gradient</label>
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

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Top Promo Announcement Bar</span>
                <input
                  type="checkbox"
                  checked={editAnnouncementActive}
                  onChange={(e) => setEditAnnouncementActive(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>
              <input
                type="text"
                placeholder="e.g. 🚀 Special 40% discount for my community!"
                value={editAnnouncement}
                onChange={(e) => setEditAnnouncement(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                {isSavingSettings ? 'Saving...' : 'Save Storefront Settings'}
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
              Share your personal storefront link. Any purchase made through this link is tracked and credited to your wallet.
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

      {/* Checkout Modal */}
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
                <p className="text-[11px] text-indigo-600 font-bold">${selectedProductForCheckout.price.toFixed(2)} EVO / USD</p>
              </div>
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
                  {isProcessingCheckout ? 'Processing...' : `Pay $${selectedProductForCheckout.price.toFixed(2)}`}
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
