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
  Globe
} from 'lucide-react';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';

interface PartnerCenterProps {
  currentUser: Member;
}

export const PartnerCenter: React.FC<PartnerCenterProps> = ({ currentUser }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState('ai-prompts-mastery');
  const [showQRModal, setShowQRModal] = useState(false);

  const memberCode = currentUser.id || 'EVO100245';
  const referralLink = `https://eviona.com/join?ref=${memberCode}`;
  const websiteEmbeddedLink = `https://johnsonagency.com/#join?ref=${memberCode}`;
  const productAffiliateLink = `https://eviona.com/marketplace/${selectedProductSlug}?ref=${memberCode}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
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
            <span>Affiliate & Partner Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Share Your Link. Earn 40% Direct + 10% Binary.
          </h2>
          <p className="text-xs text-indigo-200">
            Earn instant 40% direct affiliate rewards, 3% sponsor overrides, and 10% binary network commission on all product sales.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-white">$6,250</p>
            <p className="text-[10px] text-indigo-200 uppercase font-bold">Partner Earnings</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <p className="text-2xl font-black text-white">256</p>
            <p className="text-[10px] text-indigo-200 uppercase font-bold">Direct Referrals</p>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Link Clicks</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">1,842</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +24% this week</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Conversion Rate</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">13.9%</h3>
          <p className="text-xs text-slate-400 mt-1">Above platform average</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Direct Commissions</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">$4,850.00</h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">Credited in EVO Tokens</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">3% Upline Overrides</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">$1,400.00</h3>
          <p className="text-xs text-slate-400 mt-1">Passive team sales</p>
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
            <span className="text-[10px] text-slate-400 font-mono">Cookie: 90-day duration</span>
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
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-medium">
            💰 Earn up to <b>$59.60 EVO Tokens</b> per single customer checkout through this link.
          </div>
        </div>
      </div>

      {/* Marketing Promotion Swipes */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
        <h4 className="text-sm font-black text-slate-900">Pre-Written Marketing Swipe Copy</h4>
        <p className="text-xs text-slate-500">Copy-paste high-converting invitations to your contacts and social channels</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {marketingSwipes.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-black text-slate-900">{s.title}</h5>
                <p className="text-xs text-slate-700 mt-2 font-mono whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-200">
                  {s.content}
                </p>
              </div>

              <button
                onClick={() => handleCopy(s.content, `swipe-${i}`)}
                className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink === `swipe-${i}` ? 'Copied Message!' : 'Copy Swipe Text'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Affiliate QR Code</h3>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 p-4">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>

            <p className="text-xs text-slate-500">Scan to register directly under sponsor ID: <b>{memberCode}</b></p>

            <button
              onClick={() => {
                alert('QR Code image downloaded.');
                setShowQRModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
