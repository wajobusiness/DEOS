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
  Wallet
} from 'lucide-react';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';
import { useWallet } from '../context/WalletContext';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

interface PartnerCenterProps {
  currentUser: Member;
}

export const PartnerCenter: React.FC<PartnerCenterProps> = ({ currentUser }) => {
  const { walletBalance, creditCommission } = useWallet();
  const { commissions } = usePlatformSettings();

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState('ai-prompts-mastery');
  const [showQRModal, setShowQRModal] = useState(false);

  // Live Affiliate State (Zero Default State)
  const [clicksCount, setClicksCount] = useState(0);
  const [conversionsCount, setConversionsCount] = useState(0);
  const [unclaimedAffiliateEarnings, setUnclaimedAffiliateEarnings] = useState(0.00);
  const [lastCreditNotice, setLastCreditNotice] = useState<string | null>(null);

  // Dynamic SuperAdmin configured rates
  const affRatePct = commissions.affiliateCommissionRatePct || 40;
  const binaryRatePct = commissions.binaryCommissionRatePct || 10;
  const uplineRatePct = commissions.uplineOverrideRatePct || 3;

  // Short EVO-ID standard for current member
  const rawId = currentUser.id || currentUser.memberCode || '';
  const memberCode = rawId ? (rawId.startsWith('EVO-ID-') ? rawId : `EVO-ID-${rawId.replace(/^EVO-?I?D?-?/i, '')}`) : 'EVO-NEW';

  const referralLink = `https://evionaecosystem.com/join?ref=${memberCode}`;
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



  const marketingSwipes = [
    {
      title: 'WhatsApp / Telegram Direct Message',
      content: `Hey! I just launched my all-in-one digital entrepreneur system with Eviona. You get a complete business website, CRM, AI marketing tools, and a ${binaryRatePct}% binary network compensation model. Check it out here: ${referralLink}`,
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
            Share Your Link. Earn {affRatePct}% Direct + {binaryRatePct}% Binary.
          </h2>
          <p className="text-xs text-indigo-200">
            Earn instant {affRatePct}% direct affiliate rewards, {uplineRatePct}% sponsor overrides, and direct referral bonuses automatically credited to your live Eviona Wallet.
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
          <span className="text-xs font-bold text-slate-400 uppercase">Affiliate Rate</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">{affRatePct}% Direct</h3>
          <p className="text-xs text-slate-400 mt-1">+{uplineRatePct}% Sponsor Override</p>
        </div>
      </div>

      {/* Main Referral Links Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Master Referral Link */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Universal Referral Link
              </span>
              <Badge variant="purple" size="sm">ID: {memberCode}</Badge>
            </div>
            <h3 className="text-base font-black text-slate-900">Your Platform Referral Link</h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct people to join the Eviona Ecosystem under your sponsorship. All signups are automatically attributed to your downline.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 flex items-center justify-between gap-2">
              <span className="truncate">{referralLink}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleCopy(referralLink, 'master')}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-indigo-600/30"
            >
              {copiedLink === 'master' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink === 'master' ? 'Copied Link!' : 'Copy Referral Link'}</span>
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Product Affiliate Link Generator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Product Affiliate Generator
              </span>
              <Badge variant="emerald" size="sm">Earn {affRatePct}% Net</Badge>
            </div>
            <h3 className="text-base font-black text-slate-900">Promote Specific Marketplace Products</h3>
            <p className="text-xs text-slate-500 mt-1">
              Generate direct affiliate links for courses, templates, and software in the marketplace.
            </p>

            <div className="mt-3 space-y-2">
              <select
                value={selectedProductSlug}
                onChange={(e) => setSelectedProductSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              >
                <option value="ai-prompts-mastery">AI Prompts Mastery Kit ($49.00)</option>
                <option value="saas-starter-boilerplate">Enterprise SaaS Boilerplate ($149.00)</option>
                <option value="ecom-automation-funnel">E-Commerce Automation Funnel ($79.00)</option>
                <option value="digital-growth-masterclass">Digital Growth Masterclass ($99.00)</option>
              </select>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 truncate">
                {productAffiliateLink}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopy(productAffiliateLink, 'product')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedLink === 'product' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink === 'product' ? 'Copied Product Link!' : 'Copy Product Affiliate Link'}</span>
          </button>
        </div>
      </div>

      {/* Affiliate & MLM Commission Settlement Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Affiliate Commission & Automated Settlement Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All commissions from your referral link are automatically calculated and credited via our double-entry ledger.
            </p>
          </div>
          <Badge variant="emerald" size="sm">Automated Double-Entry</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Direct Plan Referral Bonus</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn upfront cash bonuses on direct downline plan activations: Launch ($20), Growth ($60), and Legacy ($100).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-1">
              <Tag className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Marketplace Affiliate Share</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn up to {affRatePct}% net affiliate commission instantly when someone buys digital products or templates via your link.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Live Wallet Balance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Active Balance: <span className="font-bold text-emerald-600 font-mono">${walletBalance.toFixed(2)} EVO</span>. Withdraw anytime to USDT (TRC20) or local bank wire.
            </p>
          </div>
        </div>
      </div>

      {/* Marketing Resources & Copy Templates */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Pre-Written Promotional Copy (Swipes)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Copy and share these high-converting messages directly with your audience on WhatsApp, Telegram, or email.
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

      {/* QR Code Sharing Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Scan to Join Eviona</h3>
            <p className="text-xs text-slate-500">
              Anyone who scans this QR code will register directly under your sponsor ID <b>{memberCode}</b>.
            </p>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
              {/* Clean Canvas QR placeholder representation */}
              <div className="w-48 h-48 bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center shadow-inner">
                <QrCode className="w-32 h-32 text-slate-900" />
                <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold">{memberCode}</span>
              </div>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
