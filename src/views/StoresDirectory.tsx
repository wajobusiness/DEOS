import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Star,
  ShieldCheck,
  Package,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { UserStoreSettings, ViewType, Member } from '../types';
import { Badge } from '../components/common/Badge';
import { marketplaceEngine } from '../engine/marketplaceEngine';

interface StoresDirectoryProps {
  onNavigate: (view: ViewType) => void;
  onOpenStore: (storeSlugOrUserId: string) => void;
  currentUser?: Member;
}

export const StoresDirectory: React.FC<StoresDirectoryProps> = ({
  onNavigate,
  onOpenStore,
  currentUser,
}) => {
  const [stores, setStores] = useState<UserStoreSettings[]>(() => marketplaceEngine.getAllStores());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setStores(marketplaceEngine.getAllStores());
  }, []);

  const handleCopyLink = (storeSlugOrId: string) => {
    const url = `https://evionaecosystem.com/store?user=${storeSlugOrId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(storeSlugOrId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredStores = stores.filter(s => {
    const matchesSearch =
      s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || (s.category && s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCat;
  });

  const featuredStores = stores.filter(s => s.isFeaturedStore);

  return (
    <div className="space-y-8 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Directory Hero Header */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-card border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Store className="w-3.5 h-3.5" />
            <span>Official Eviona Merchant & Creator Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Discover Verified Creator Storefronts
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Browse independent digital entrepreneurs, studios, and mastermind stores. Buy direct or partner with creators through the unified affiliate network.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('sellers')}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Your Storefront</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search stores by name, creator, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Software & Tools', 'Templates', 'Digital Courses', 'Marketing', 'Business & Legal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Directory Grid */}
      {filteredStores.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs space-y-3">
          <Store className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-bold text-slate-700 text-sm">No Storefronts Found</p>
          <p className="text-slate-400">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => {
            const storeProds = marketplaceEngine.getStoreProducts(store.userId);

            return (
              <div
                key={store.userId}
                className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Store Header Banner */}
                <div className="relative h-28 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
                  {store.bannerUrl && (
                    <img
                      src={store.bannerUrl}
                      alt={store.storeName}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {store.verifiedSeller && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Store Profile Info */}
                <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-end justify-between -mt-10 mb-3">
                      <img
                        src={store.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={store.storeName}
                        className="w-18 h-18 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                      />
                      <button
                        onClick={() => handleCopyLink(store.storeSlug || store.userId)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Share Store Link"
                      >
                        {copiedId === (store.storeSlug || store.userId) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                          {store.storeName}
                        </h3>
                      </div>
                      <p className="text-xs text-indigo-600 font-semibold">{store.tagline}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                        {store.bio}
                      </p>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-slate-600 font-bold">
                        <Package className="w-3.5 h-3.5 text-purple-600" />
                        <span>{storeProds.length} Products</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="text-slate-900">{store.rating || 5.0}</span>
                        <span className="text-[10px] text-slate-400">({store.reviewsCount || 12})</span>
                      </div>
                    </div>
                  </div>

                  {/* Visit Store Action Button */}
                  <div className="pt-3">
                    <button
                      onClick={() => onOpenStore(store.storeSlug || store.userId)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <span>Visit Personal Storefront</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
