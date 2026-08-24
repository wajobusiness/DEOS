import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Share2,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Zap,
  Globe,
  Users,
  Layers,
  BarChart3,
  Sliders,
  DollarSign,
  Activity,
  Code2,
  HelpCircle,
  Settings,
  Mail,
  UserCheck,
  Lock,
  QrCode,
  Check,
  Radio,
  ExternalLink,
  MessageCircle,
  Send,
  Eye,
  Bot
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Member } from '../types';
import { useAuth } from '../context/AuthContext';
import { marketingEngine, TrackingPixelsConfig, MarketingCampaign, INITIAL_SWIPE_FILES, PromoSwipeFile } from '../engine/marketingEngine';

interface MarketingCenterProps {
  currentUser?: Member;
}

export const MarketingCenter: React.FC<MarketingCenterProps> = ({ currentUser }) => {
  const { member } = useAuth();
  const activeUser = currentUser || member || {
    id: 'EVO-ID-100245',
    name: 'Entrepreneur',
    email: 'user@evionaecosystem.com',
  };

  const userId = activeUser.id || 'EVO-ID-100245';
  const userName = activeUser.name || 'Entrepreneur';
  const userStoreLink = `https://evionaecosystem.com/store?user=${userId}`;

  const [activeTab, setActiveTab] = useState<'pixels' | 'campaigns' | 'swipes' | 'ai-ads' | 'telemetry'>('pixels');

  // Pixels State
  const [pixels, setPixels] = useState<TrackingPixelsConfig>(() =>
    marketingEngine.getTrackingPixels(userId)
  );
  const [isSaved, setIsSaved] = useState(false);

  // Campaigns State
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() =>
    marketingEngine.getCampaigns(userId)
  );
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [campName, setCampName] = useState('');
  const [campChannel, setCampChannel] = useState<MarketingCampaign['channel']>('meta');
  const [campUtmSource, setCampUtmSource] = useState('facebook');
  const [campUtmMedium, setCampUtmMedium] = useState('cpc');
  const [campUtmName, setCampUtmName] = useState('growth-launch-2025');

  // Swipe Files State
  const [swipeFiles] = useState<PromoSwipeFile[]>(INITIAL_SWIPE_FILES);
  const [copiedSwipeId, setCopiedSwipeId] = useState<string | null>(null);
  const [copiedCampId, setCopiedCampId] = useState<string | null>(null);

  // Telemetry Log State
  const [isSimulatingEvent, setIsSimulatingEvent] = useState(false);
  const [simulatedEventsLog, setSimulatedEventsLog] = useState<string[]>([
    '✅ Meta CAPI: PageView dispatched for user session',
    '✅ Google Analytics 4: event "view_item" sent (Measurement ID: G-EVIONA9821)',
    '✅ CRM: Lead captured from Facebook Ad Campaign #EVO-LAUNCH-2026',
    '✅ AI Engine: Lead scored at 88% high-conversion probability',
  ]);

  // AI Ad Generator State
  const [adNiche, setAdNiche] = useState('Digital Entrepreneurship & AI Business OS');
  const [adPlatform, setAdPlatform] = useState('Meta (Facebook / Instagram)');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);
  const [generatedAdResult, setGeneratedAdResult] = useState<any | null>(null);

  // Live Metrics
  const metrics = marketingEngine.getMarketingMetrics(userId);

  const handleSavePixels = (e: React.FormEvent) => {
    e.preventDefault();
    marketingEngine.saveTrackingPixels(pixels);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;

    const newCamp = marketingEngine.createCampaign({
      name: campName,
      channel: campChannel,
      baseUrl: userStoreLink,
      utmSource: campUtmSource,
      utmMedium: campUtmMedium,
      utmCampaign: campUtmName,
    });

    setCampaigns(marketingEngine.getCampaigns(userId));
    setShowCreateCampaignModal(false);
    setCampName('');
    alert(`Campaign link created: ${newCamp.fullCampaignUrl}`);
  };

  const handleCopyText = (text: string, id: string, type: 'swipe' | 'camp') => {
    navigator.clipboard.writeText(text);
    if (type === 'swipe') {
      setCopiedSwipeId(id);
      setTimeout(() => setCopiedSwipeId(null), 2500);
    } else {
      setCopiedCampId(id);
      setTimeout(() => setCopiedCampId(null), 2500);
    }
  };

  const handleFireSimulatedEvent = () => {
    setIsSimulatingEvent(true);
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      setSimulatedEventsLog(prev => [
        `[${timestamp}] 🚀 Lead Captured: "David M." (Source: Meta Ads, Campaign: #scale-agency)`,
        `[${timestamp}] 📡 Meta Conversions API (CAPI): Lead event emitted with value $300.00`,
        `[${timestamp}] 📊 GA4: "generate_lead" measurement payload delivered (Measurement ID: ${pixels.ga4MeasurementId})`,
        `[${timestamp}] 🤖 AI CRM Intelligence: Scored 94/100 • Automated welcome sequence dispatched`,
        ...prev.slice(0, 4)
      ]);
      setIsSimulatingEvent(false);
    }, 800);
  };

  const handleGenerateAdCopy = () => {
    setIsGeneratingAd(true);
    setTimeout(() => {
      const res = marketingEngine.generateAdCopy({
        niche: adNiche,
        platform: adPlatform,
        offer: 'Eviona Business Center & Storefront',
      });
      setGeneratedAdResult(res);
      setIsGeneratingAd(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white border border-indigo-500/20 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Marketing Intelligence & Advertising Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Multi-Channel Traffic & Conversion Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Native integrations with Meta Pixel, Meta CAPI, Google Analytics 4, and TikTok Pixel. Track custom UTM campaigns, generate high-converting promotional swipe copy, and scale your ROI.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('ai-ads')}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Copywriter</span>
          </button>
        </div>
      </div>

      {/* Real-Time Marketing KPI Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Visitors</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">{metrics.totalVisitors.toLocaleString()}</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Tracked across campaigns</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Leads Captured</p>
          <h3 className="text-xl font-black text-indigo-600 mt-1">{metrics.leadsCaptured}</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">In CRM pipeline</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Conversion Rate</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">{metrics.conversionRate}</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Visitor to lead</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sales</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">{metrics.totalSales}</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Settled orders</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue Generated</p>
          <h3 className="text-xl font-black text-purple-600 mt-1">${metrics.revenueGenerated.toFixed(2)} EVO</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">($1.00 = 1 EVO)</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Top Traffic Source</p>
          <h3 className="text-xs font-black text-indigo-600 mt-2 truncate">{metrics.bestTrafficSource}</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Active channels</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-card overflow-x-auto gap-1 text-xs font-bold">
        {[
          { id: 'pixels', label: 'Tracking Pixels & APIs', icon: Sliders },
          { id: 'campaigns', label: `UTM Campaign Links (${campaigns.length})`, icon: Globe },
          { id: 'swipes', label: 'Promo Swipe Files (WhatsApp/Email)', icon: Share2 },
          { id: 'ai-ads', label: 'AI Ad Copy Generator', icon: Sparkles },
          { id: 'telemetry', label: 'Live Telemetry & CAPI Events', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TRACKING PIXELS & AD CONNECTIONS */}
      {activeTab === 'pixels' && (
        <form onSubmit={handleSavePixels} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Advertising Pixels & Measurement IDs</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                IDs configured here are automatically injected across your Landing Pages, Storefronts, and Domain routing.
              </p>
            </div>
            {isSaved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Saved & Active!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Meta (Facebook) Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">f</div>
                  <span className="font-bold text-slate-900 text-sm">Meta Pixel & CAPI</span>
                </div>
                <Badge variant="emerald" size="sm">Active</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meta Pixel ID</label>
                <input
                  type="text"
                  value={pixels.metaPixelId}
                  onChange={(e) => setPixels({ ...pixels, metaPixelId: e.target.value })}
                  placeholder="e.g. 128938472910"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Conversions API (CAPI) Token</label>
                <input
                  type="password"
                  value={pixels.metaCapiToken}
                  onChange={(e) => setPixels({ ...pixels, metaCapiToken: e.target.value })}
                  placeholder="EAAG9283401kdlasmdklq9281..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Google Analytics 4 & GTM */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">G</div>
                  <span className="font-bold text-slate-900 text-sm">Google Analytics 4 & GTM</span>
                </div>
                <Badge variant="emerald" size="sm">Active</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GA4 Measurement ID</label>
                <input
                  type="text"
                  value={pixels.ga4MeasurementId}
                  onChange={(e) => setPixels({ ...pixels, ga4MeasurementId: e.target.value })}
                  placeholder="G-EVIONA9821"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Tag Manager (GTM) Container ID</label>
                <input
                  type="text"
                  value={pixels.gtmContainerId}
                  onChange={(e) => setPixels({ ...pixels, gtmContainerId: e.target.value })}
                  placeholder="GTM-KV9281X"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* TikTok Pixel */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">TT</div>
                  <span className="font-bold text-slate-900 text-sm">TikTok Pixel & Events API</span>
                </div>
                <Badge variant="emerald" size="sm">Active</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={pixels.tiktokPixelId}
                  onChange={(e) => setPixels({ ...pixels, tiktokPixelId: e.target.value })}
                  placeholder="C892810KMS921"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* LinkedIn Insight Tag */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-xs">in</div>
                  <span className="font-bold text-slate-900 text-sm">LinkedIn Insight Tag</span>
                </div>
                <Badge variant="emerald" size="sm">Active</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn Partner Tag ID</label>
                <input
                  type="text"
                  value={pixels.linkedinTagId}
                  onChange={(e) => setPixels({ ...pixels, linkedinTagId: e.target.value })}
                  placeholder="982341"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Sync Tracking Pixels</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: UTM CAMPAIGN LINKS BUILDER */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Custom UTM Campaign Tracking Links</h3>
              <p className="text-xs text-slate-500">
                Generate trackable links with embedded referral IDs and custom campaign analytics.
              </p>
            </div>
            <button
              onClick={() => setShowCreateCampaignModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign Link</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {campaigns.map((camp) => (
              <div key={camp.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 max-w-xl min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{camp.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                      {camp.channel}
                    </span>
                  </div>
                  <p className="font-mono text-indigo-600 text-[11px] truncate">{camp.fullCampaignUrl}</p>
                  <p className="text-slate-400 text-[10px]">Created on {camp.createdAt}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right text-xs">
                    <p className="font-black text-slate-900">{camp.clicks} Clicks</p>
                    <p className="text-emerald-600 font-bold">{camp.leadsGenerated} Leads • {camp.salesGenerated} Sales</p>
                  </div>

                  <button
                    onClick={() => handleCopyText(camp.fullCampaignUrl, camp.id, 'camp')}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                    title="Copy Campaign Link"
                  >
                    {copiedCampId === camp.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCampId === camp.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROMOTIONAL SWIPE FILES (WhatsApp / Email / SMS) */}
      {activeTab === 'swipes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Promotional Swipe Files & Broadcast Templates</h3>
            <p className="text-xs text-slate-500">
              Your personal referral ID (<code className="font-mono text-indigo-600 font-bold">{userId}</code>) is automatically embedded into every message below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {swipeFiles.map((swipe) => {
              const personalizedContent = swipe.content
                .replace(/\{\{REF_LINK\}\}/g, userStoreLink)
                .replace(/\{\{USER_NAME\}\}/g, userName);

              return (
                <div key={swipe.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                        {swipe.category}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">{swipe.title}</h4>
                    <p className="text-xs text-slate-500">{swipe.description}</p>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs whitespace-pre-line font-sans leading-relaxed">
                      {personalizedContent}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyText(personalizedContent, swipe.id, 'swipe')}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    {copiedSwipeId === swipe.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSwipeId === swipe.id ? 'Copied with Your Link!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AI AD COPY & HOOK GENERATOR */}
      {activeTab === 'ai-ads' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">AI Advertising Copywriter</h3>
            <p className="text-xs text-slate-500">Generate high-converting headlines, primary text, and target audience recipes for Meta, Google, and TikTok ads.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Niche / Industry</label>
              <input
                type="text"
                value={adNiche}
                onChange={(e) => setAdNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ad Network</label>
              <select
                value={adPlatform}
                onChange={(e) => setAdPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              >
                <option value="Meta (Facebook / Instagram)">Meta (Facebook / Instagram)</option>
                <option value="Google Search / YouTube">Google Search & YouTube Ads</option>
                <option value="TikTok Ads">TikTok Viral Short Video Ads</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateAdCopy}
            disabled={isGeneratingAd}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingAd ? 'Generating Ad Assets...' : 'Generate High-Converting Ad Copy'}</span>
          </button>

          {generatedAdResult && (
            <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Primary Headline</span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{generatedAdResult.headline}</h4>
              </div>

              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Body Copy</span>
                <p className="text-slate-700 whitespace-pre-line mt-1 bg-white p-4 rounded-xl border border-indigo-100">
                  {generatedAdResult.bodyCopy}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-slate-400 block font-bold">Suggested Audience:</span>
                  <span className="font-bold text-slate-800">{generatedAdResult.targetAudience}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-slate-400 block font-bold">Recommended Budget:</span>
                  <span className="font-bold text-emerald-600">{generatedAdResult.suggestedBudget}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: TELEMETRY & CONVERSION EVENTS */}
      {activeTab === 'telemetry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Conversion Telemetry & Event Stream</h3>
              <p className="text-xs text-slate-500">Live feed of conversion events dispatched to Meta CAPI, Google Analytics, and TikTok.</p>
            </div>
            <button
              onClick={handleFireSimulatedEvent}
              disabled={isSimulatingEvent}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>{isSimulatingEvent ? 'Emitting...' : 'Emit Test Conversion Event'}</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs space-y-2.5">
            {simulatedEventsLog.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600">{i + 1}.</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Link Modal */}
      {showCreateCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Create UTM Campaign Tracking Link</h3>
              <button onClick={() => setShowCreateCampaignModal(false)} className="text-slate-400 hover:text-slate-700">
                <Check className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TikTok Summer Ad Campaign"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Channel Platform</label>
                <select
                  value={campChannel}
                  onChange={(e) => {
                    setCampChannel(e.target.value as any);
                    setCampUtmSource(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                >
                  <option value="meta">Meta (Facebook / Instagram)</option>
                  <option value="google">Google Ads</option>
                  <option value="tiktok">TikTok Ads</option>
                  <option value="whatsapp">WhatsApp Direct</option>
                  <option value="email">Email Broadcast</option>
                  <option value="twitter">Twitter / X</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">utm_source</label>
                  <input
                    type="text"
                    value={campUtmSource}
                    onChange={(e) => setCampUtmSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">utm_medium</label>
                  <input
                    type="text"
                    value={campUtmMedium}
                    onChange={(e) => setCampUtmMedium(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">utm_campaign</label>
                <input
                  type="text"
                  value={campUtmName}
                  onChange={(e) => setCampUtmName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCampaignModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
