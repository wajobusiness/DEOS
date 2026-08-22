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
  Mail
} from 'lucide-react';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';

interface PartnerCenterProps {
  currentUser: Member;
}

export const PartnerCenter: React.FC<PartnerCenterProps> = ({ currentUser }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const referralLink = `https://eviona.com/join?ref=${currentUser.id}`;
  const websiteEmbeddedLink = `https://johnsonagency.com/#join`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const marketingSwipes = [
    {
      title: 'WhatsApp / Telegram Direct Message',
      content: `Hey! I just launched my all-in-one digital business system with Eviona. You get a complete business website, CRM, AI marketing tools, and a 10% binary network model. Check it out here: ${referralLink}`,
    },
    {
      title: 'Email Invitation Template',
      content: `Subject: Launch your automated business with Eviona\n\nHi there,\n\nI wanted to personally invite you to explore Eviona Ecosystem—the digital entrepreneurship operating system. Whether you want to sell products, automate your client acquisition, or build a residual network, Eviona provides the complete infrastructure.\n\nLearn more and join my team here: ${referralLink}\n\nBest,\n${currentUser.name}`,
    },
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Partner Earnings & Direct Link Strip */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Affiliate & Partner Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Share Your Link. Grow Your Residual Team.
          </h2>
          <p className="text-xs text-indigo-200">
            Earn $25 to $125 direct referral bonuses + 30% / 15% generation bonuses and 10% binary volume.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
            <p className="text-2xl font-black text-white">$6,250</p>
            <p className="text-[10px] text-indigo-200">Partner Earnings</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
            <p className="text-2xl font-black text-white">256</p>
            <p className="text-[10px] text-indigo-200">Active Directs</p>
          </div>
        </div>
      </div>

      {/* Referral Links Generator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Platform Link */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Primary Affiliate Referral Link
            </h4>
            <Badge variant="purple" size="sm">Direct Signup</Badge>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
            />
            <button
              onClick={() => handleCopy(referralLink, 'primary')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink === 'primary' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Sends prospects to the official Eviona landing page with your sponsor ID pre-filled.
          </p>
        </div>

        {/* Embedded Site Join Link */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Your Personal Website Join Link
            </h4>
            <Badge variant="success" size="sm">Embedded Site Block</Badge>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="text"
              readOnly
              value={websiteEmbeddedLink}
              className="flex-1 bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
            />
            <button
              onClick={() => handleCopy(websiteEmbeddedLink, 'website')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink === 'website' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Sends visitors directly to the &quot;Join / Become a Member&quot; block on your custom website.
          </p>
        </div>
      </div>

      {/* Marketing Promotion Swipes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <h4 className="text-sm font-bold text-slate-900">Pre-Written Marketing Swipe Copy</h4>
        <p className="text-xs text-slate-500">Copy-paste high-converting invitations to your contacts and social channels</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {marketingSwipes.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900">{s.title}</h5>
                <p className="text-xs text-slate-700 mt-2 font-mono whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
                  {s.content}
                </p>
              </div>

              <button
                onClick={() => handleCopy(s.content, `swipe-${i}`)}
                className="w-full py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink === `swipe-${i}` ? 'Copied Message!' : 'Copy Swipe Text'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

