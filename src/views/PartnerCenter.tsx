import React, { useState } from 'react';
import {
  Share2,
  Users,
  DollarSign,
  Copy,
  QrCode,
  Download,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Mail,
  Zap,
  Tag,
  Check,
  Globe,
  Wallet,
  Play
} from 'lucide-react';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';
import { useWallet } from '../context/WalletContext';
import { calculateMarketplaceFeeSplit, getDirectReferralBonus } from '../engine/binaryEngine';

interface PartnerCenterProps {
  currentUser: Member;
}

export const PartnerCenter: React.FC<PartnerCenterProps> = ({ currentUser }) => {
  const { walletBalance, creditCommission } = useWallet();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState('ai-prompts-mastery');
  const [showQRModal, setShowQRModal] = useState(false);

  // Live Affiliate State
  const [clicksCount, setClicksCount] = useState(148);
  const [conversionsCount, setConversionsCount] = useState(12);
  const [unclaimedAffiliateEarnings, setUnclaimedAffiliateEarnings] = useState(145.00);
  const [simType, setSimType] = useState<'plan' | 'product'>('product');
  const [selectedPlan, setSelectedPlan] = useState<'launch' | 'growth' | 'legacy'>('growth');
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastCreditNotice, setLastCreditNotice] = useState<string | null>(null);

  const memberCode = currentUser.id || 'EVO100245';
  const referralLink = `https://evionaecosystem.com/join?ref=${memberCode}`;
  const websiteEmbeddedLink = `https://johnsonagency.com/#join?ref=${memberCode}`;
  const productAffiliateLink = `https://evionaecosystem.com/marketplace/${selectedProductSlug}?ref=${memberCode}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setClicksCount(prev => prev + 1);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Claim all pending affiliate earnings directly to wallet
  const handleClaimAffiliateEarnings = () => {
    if (unclaimedAffiliateEarnings <= 0) {
      alert('You have no unclaimed affiliate earnings at this moment.');
      return;
    }

    const tx = creditCommission(
      unclaimedAffiliateEarnings,
      'promoter_commission',
      `Affiliate Earnings Settlement (${unclaimedAffiliateEarnings.toFixed(2)} EVO)`
    );

    const claimed = unclaimedAffiliateEarnings;
    setUnclaimedAffiliateEarnings(0);
    setLastCreditNotice(`Claimed $${claimed.toFixed(2)} EVO to wallet (Ref: ${tx.id})`);
    setTimeout(() => setLastCreditNotice(null), 5000);
  };

  // Simulate an affiliate conversion and credit immediately to the live wallet
  const handleSimulateConversion = () => {
    setIsSimulating(true);

    setTimeout(() => {
      let earnedAmount = 0;
      let desc = '';
      let type: any = 'promoter_commission';

      if (simType === 'plan') {
        earnedAmount = getDirectReferralBonus(selectedPlan);
        desc = `Direct Referral Bonus — ${selectedPlan.toUpperCase()} Plan Signup`;
        type = 'direct_referral_bonus';
      } else {
        const productPrices: Record<string, { title: string; price: number }> = {
          'ai-prompts-mastery': { title: 'AI Prompts Mastery Kit', price: 49.00 },
          'saas-starter-boilerplate': { title: 'Enterprise SaaS Boilerplate', price: 149.00 },
          'ecom-automation-funnel': { title: 'E-Commerce High-Converting Funnel', price: 79.00 },
          'digital-growth-masterclass': { title: 'Digital Growth Masterclass', price: 99.00 },
        };

        const prod = productPrices[selectedProductSlug] || { title: 'Marketplace Product', price: 49.00 };
        const split = calculateMarketplaceFeeSplit(prod.price, 0.40);
        earnedAmount = split.promoterCommissionNet;
        desc = `40% Affiliate Commission — ${prod.title}`;
        type = 'promoter_commission';
      }

      const tx = creditCommission(earnedAmount, type, desc);
      setConversionsCount(prev => prev + 1);
      setClicksCount(prev => prev + 4);
      setIsSimulating(false);

      setLastCreditNotice(`Success! +$${earnedAmount.toFixed(2)} EVO credited to your wallet (Ref: ${tx.id})`);
      setTimeout(() => setLastCreditNotice(null), 6000);
    }, 600);
  };

  const marketingSwipes = [
    {
      title: 'WhatsApp / Telegram Direct Message',
      content: `Hey! I just launched my all-in-one digital entrepreneur system with Eviona. You get a complete business website, CRM, AI marketing tools, and a 10% binary network compensation model. Check it out here: ${referralLink}`,
    },
    {
      title: 'Email Invitation Template',
      content: `Subject: Launch your automated business with Eviona\n\nHi there,\n\nI wanted to personally invite you to explore Eviona Ecosystem—the digital entrepreneurship operating system. Whether you want to sell digital products, automate your client acquisition, or build a residual network, Eviona provides the complete infrastructure.\n\nLearn more and join my team here: ${referralLink}\n\nBest,\n${currentUser.name}`,
    },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Partner Earnings & Direct Link Strip */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Affiliate & Partner Center Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Share Your Link. Earn 40% Direct + 10% Binary.
          </h2>
          <p className="text-xs text-indigo-200">
            Earn instant 40% direct affiliate rewards, 3% sponsor overrides, and direct referral bonuses automatically credited to your live Eviona Wallet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-emerald-400">${walletBalance.toFixed(2)}</p>
            <p className="text-[10px] text-emerald-200 uppercase font-bold">Wallet Balance (EVO)</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-white">${unclaimedAffiliateEarnings.toFixed(2)}</p>
            <p className="text-[10px] text-indigo-200 uppercase font-bold">Unclaimed Earnings</p>
            {unclaimedAffiliateEarnings > 0 && (
              <button
                onClick={handleClaimAffiliateEarnings}
                className="mt-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold shadow-sm"
              >
                Claim to Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {lastCreditNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lastCreditNotice}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800">
            Ledger Updated
          </span>
        </div>
      )}

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Link Clicks</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{clicksCount}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Real-time Telemetry</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Conversions</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">{conversionsCount}</h3>
          <p className="text-xs text-slate-400 mt-1">{((conversionsCount / Math.max(clicksCount, 1)) * 100).toFixed(1)}% Conversion Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Live Wallet Balance</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">${walletBalance.toFixed(2)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">1:1 EVO Token</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Affiliate Split Invariant</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">40% Flat</h3>
          <p className="text-xs text-slate-400 mt-1">+3% Upline Override</p>
        </div>
      </div>

      {/* Referral Links Generator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Platform Link */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Primary Platform Referral Link
              </h4>
              <Badge variant="purple" size="sm">Direct Signup</Badge>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
              />
              <button
                onClick={() => handleCopy(referralLink, 'primary')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink === 'primary' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Sends prospects to the official Eviona registration page with your sponsor ID ({memberCode}) automatically bound.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowQRModal(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR Code</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">Cookie: 90-day attribution</span>
          </div>
        </div>

        {/* Product-Specific Affiliate Link Generator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Marketplace Product Affiliate Link
              </h4>
              <Badge variant="emerald" size="sm">40% Reward</Badge>
            </div>

            <div className="space-y-2">
              <select
                value={selectedProductSlug}
                onChange={(e) => setSelectedProductSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none"
              >
                <option value="ai-prompts-mastery">AI Prompts Mastery Kit ($49.00 - 40% Comm)</option>
                <option value="saas-starter-boilerplate">Enterprise SaaS Boilerplate ($149.00 - 40% Comm)</option>
                <option value="ecom-automation-funnel">E-Commerce High-Converting Funnel ($79.00 - 40% Comm)</option>
                <option value="digital-growth-masterclass">Digital Growth Masterclass ($99.00 - 40% Comm)</option>
              </select>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={productAffiliateLink}
                  className="flex-1 bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
                />
                <button
                  onClick={() => handleCopy(productAffiliateLink, 'product')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink === 'product' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Customers purchasing through this link earn you an instant 40% direct reward credited in EVO Tokens.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-[10px] text-emerald-600 font-bold">● Multi-rail checkout active</span>
            <span className="text-[10px] text-slate-400 font-mono">Commission: 40% Direct</span>
          </div>
        </div>
      </div>

      {/* Live Affiliate & MLM Commission Trigger Engine */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Commission Trigger & Wallet Crediting Engine</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate live affiliate referrals and marketplace sales to verify instant double-entry wallet credits.
            </p>
          </div>
          <Badge variant="blue" size="sm">Real-time Connection</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Conversion Event Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimType('product')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    simType === 'product'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Marketplace Product (40%)
                </button>
                <button
                  onClick={() => setSimType('plan')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    simType === 'plan'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Plan Referral ($25–$125)
                </button>
              </div>
            </div>

            {simType === 'plan' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Referred Plan Tier</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="launch">Launch Tier ($100/yr → $25.00 Direct Bonus)</option>
                  <option value="growth">Growth Tier ($300/yr → $75.00 Direct Bonus)</option>
                  <option value="legacy">Legacy Tier ($500/yr → $125.00 Direct Bonus)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Promoted Product</label>
                <select
                  value={selectedProductSlug}
                  onChange={(e) => setSelectedProductSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="ai-prompts-mastery">AI Prompts Mastery Kit ($49.00 → $19.60 Commission)</option>
                  <option value="saas-starter-boilerplate">Enterprise SaaS Boilerplate ($149.00 → $59.60 Commission)</option>
                  <option value="ecom-automation-funnel">E-Commerce High-Converting Funnel ($79.00 → $31.60 Commission)</option>
                  <option value="digital-growth-masterclass">Digital Growth Masterclass ($99.00 → $39.60 Commission)</option>
                </select>
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Reward Rate</span>
                <span className="font-bold text-indigo-600">{simType === 'plan' ? 'Direct Tier Bonus' : '40% Flat Direct'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement Target</span>
                <span className="font-bold text-emerald-600">Eviona Wallet (Live Ledger)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credited Unit</span>
                <span className="font-bold text-slate-900">EVO Utility Token ($1.00 = 1.00 EVO)</span>
              </div>
            </div>

            <button
              onClick={handleSimulateConversion}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Processing Commission...' : 'Trigger Conversion & Credit Wallet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Marketing Swipes & Promotional Copy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Ready-To-Use Marketing Swipes</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Copy and paste these high-converting templates into WhatsApp, Telegram, or Email campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketingSwipes.map((swipe, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900">{swipe.title}</h4>
                  <Badge variant="purple" size="sm">Template</Badge>
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-200">
                  {swipe.content}
                </p>
              </div>

              <button
                onClick={() => handleCopy(swipe.content, `swipe-${idx}`)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink === `swipe-${idx}` ? 'Copied to Clipboard!' : 'Copy Script'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Your Referral QR Code</h3>
            <div className="w-48 h-48 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center p-4">
              <QrCode className="w-40 h-40 text-white" />
            </div>
            <p className="text-xs text-slate-500 font-mono break-all">{referralLink}</p>
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
