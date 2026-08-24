import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const MarketingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pixels' | 'funnel' | 'agency' | 'ai-ads' | 'services'>('pixels');

  // Tracking Pixel Form State
  const [pixels, setPixels] = useState({
    metaPixelId: '128938472910',
    metaCapiToken: 'EAAG9283401kdlasmdklq9281...',
    ga4MeasurementId: 'G-EVIONA9821',
    gtmContainerId: 'GTM-KV9281X',
    googleAdsId: 'AW-982145678',
    tiktokPixelId: 'C892810KMS921',
    tiktokApiToken: 'tt_api_99214...',
    linkedinTagId: '982341',
    snapchatPixelId: 'snap_8829104',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState(false);
  const [simulatedEventsLog, setSimulatedEventsLog] = useState<string[]>([
    '✅ Meta CAPI: PageView dispatched for user session',
    '✅ Google Analytics 4: event "view_item" sent (Measurement ID: G-EVIONA9821)',
    '✅ CRM: Lead captured from Facebook Ad Campaign #EVO-LAUNCH-2026',
    '✅ AI Engine: Lead scored at 88% high-conversion probability',
  ]);

  // AI Marketing Generator State
  const [adNiche, setAdNiche] = useState('Digital Entrepreneurship & AI Business OS');
  const [adTargetPlatform, setAdTargetPlatform] = useState('Meta (Facebook / Instagram)');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);
  const [generatedAdCopy, setGeneratedAdCopy] = useState<string>('');

  const handleSavePixels = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFireSimulatedEvent = () => {
    setIsSimulatingEvent(true);
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      setSimulatedEventsLog(prev => [
        `[${timestamp}] 🚀 Lead Captured: "Sarah J." (Source: Meta Ads, Campaign: #scale-agency)`,
        `[${timestamp}] 📡 Meta Conversions API (CAPI): Lead event emitted with value $300.00`,
        `[${timestamp}] 📊 GA4: "generate_lead" measurement payload delivered`,
        `[${timestamp}] 🤖 AI CRM Intelligence: Scored 92/100 • Automated follow-up sequence #1 dispatched`,
        ...prev.slice(0, 5)
      ]);
      setIsSimulatingEvent(false);
    }, 1000);
  };

  const handleGenerateAdCopy = () => {
    setIsGeneratingAd(true);
    setTimeout(() => {
      setGeneratedAdCopy(`### 🎯 High-Converting Meta Ad Campaign\n\n**Primary Headline:** Stop Stitching Disconnected Software. Launch Your Digital Business Operating System Today.\n\n**Primary Text:**\nAre you tired of paying $500/month for 7 different tools just to get your business off the ground? Meet Eviona Ecosystem — your complete website, CRM, marketplace, AI assistants, and automated sales pipeline under one unified dashboard.\n\n👉 Dynamic custom domain included\n👉 1-click product marketplace & affiliate rights\n👉 24/7 AI business co-pilot\n\n**Call to Action (CTA):** Start Your Free Tour Now\n**Suggested Audience:** Ages 25-54 • Interests: Digital Marketing, Entrepreneurship, E-commerce, SaaS.`);
      setIsGeneratingAd(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white border border-indigo-500/20 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Marketing Intelligence & Advertising Integration Layer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Connect Ad Networks. Track Conversions. Scale ROI.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Native integrations with Meta Pixel, Meta CAPI, Google Analytics 4, TikTok Pixel, and LinkedIn Insight Tag. Every visitor, lead, and sale is tracked with immutable attribution.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('ai-ads')}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Ad Generator</span>
          </button>
        </div>
      </div>

      {/* Real-Time Marketing KPI Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Visitors</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">10,500</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↑ +18.4% this mo</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Leads Captured</p>
          <h3 className="text-xl font-black text-indigo-600 mt-1">850</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">All ad sources</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Conversion Rate</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">8.1%</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Industry high</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sales</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">120</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Verified checkouts</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue Generated</p>
          <h3 className="text-xl font-black text-purple-600 mt-1">5,000 EVO</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">($5,000.00 USD)</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Best Traffic Source</p>
          <h3 className="text-sm font-black text-indigo-600 mt-2 truncate">Meta Ads (64%)</h3>
          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">ROAS: 4.2x</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-card overflow-x-auto gap-1">
        {[
          { id: 'pixels', label: 'Tracking Pixels & APIs', icon: Sliders },
          { id: 'funnel', label: 'Conversion Event System', icon: Activity },
          { id: 'agency', label: 'Agency / Squad Access', icon: Users },
          { id: 'ai-ads', label: 'AI Marketing Assistant', icon: Sparkles },
          { id: 'services', label: 'Premium Marketing Services', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
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

      {/* ========================================================================= */}
      {/* 1. TRACKING PIXELS & AD CONNECTIONS TAB                                   */}
      {/* ========================================================================= */}
      {activeTab === 'pixels' && (
        <form onSubmit={handleSavePixels} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Advertising Pixels & Measurement IDs</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ids entered here are automatically injected into your landing page (<code className="text-indigo-600 font-mono">username.eviona.com</code> and custom domains).
              </p>
            </div>
            {isSaved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pixel Configurations Saved!</span>
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
                <label className="block font-bold text-slate-700 mb-1">Server-Side Conversions API (CAPI) Token</label>
                <input
                  type="password"
                  value={pixels.metaCapiToken}
                  onChange={(e) => setPixels({ ...pixels, metaCapiToken: e.target.value })}
                  placeholder="EAAG9283401..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Google Analytics & Ads Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">G</div>
                  <span className="font-bold text-slate-900 text-sm">Google Analytics 4 & Tag Manager</span>
                </div>
                <Badge variant="emerald" size="sm">Active</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GA4 Measurement ID</label>
                <input
                  type="text"
                  value={pixels.ga4MeasurementId}
                  onChange={(e) => setPixels({ ...pixels, ga4MeasurementId: e.target.value })}
                  placeholder="e.g. G-EVIONA9821"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Tag Manager Container ID</label>
                <input
                  type="text"
                  value={pixels.gtmContainerId}
                  onChange={(e) => setPixels({ ...pixels, gtmContainerId: e.target.value })}
                  placeholder="e.g. GTM-KV9281X"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* TikTok for Business */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">🎵</div>
                  <span className="font-bold text-slate-900 text-sm">TikTok Pixel & Events API</span>
                </div>
                <Badge variant="purple" size="sm">Connected</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={pixels.tiktokPixelId}
                  onChange={(e) => setPixels({ ...pixels, tiktokPixelId: e.target.value })}
                  placeholder="e.g. C892810KMS921"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* LinkedIn & Snapchat */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">in</div>
                  <span className="font-bold text-slate-900 text-sm">LinkedIn Insight Tag</span>
                </div>
                <Badge variant="blue" size="sm">Connected</Badge>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn Partner ID</label>
                <input
                  type="text"
                  value={pixels.linkedinTagId}
                  onChange={(e) => setPixels({ ...pixels, linkedinTagId: e.target.value })}
                  placeholder="e.g. 982341"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Apply Tracking Scripts</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 2. CONVERSION EVENT SYSTEM TAB                                            */}
      {/* ========================================================================= */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Standard Platform Conversion Event Pipeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every user interaction dispatches synchronized payloads to your Pixels, CAPI, CRM, and AI lead scoring engine.
                </p>
              </div>

              <button
                onClick={handleFireSimulatedEvent}
                disabled={isSimulatingEvent}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isSimulatingEvent ? 'Firing Event...' : 'Simulate Live Test Event'}</span>
              </button>
            </div>

            {/* Interactive Visual Pipeline */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3 text-center">
              {[
                { step: '1', name: 'Page View', badge: 'Client Pixel' },
                { step: '2', name: 'Lead Captured', badge: 'CRM & CAPI' },
                { step: '3', name: 'Registration Started', badge: 'Funnel Step' },
                { step: '4', name: 'Registration Done', badge: 'User Created' },
                { step: '5', name: 'Payment Done', badge: 'Ledger Credited' },
                { step: '6', name: 'Membership Active', badge: 'MLM Trigger' },
              ].map((ev, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-indigo-500 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-[10px] flex items-center justify-center mx-auto mb-1.5">
                    {ev.step}
                  </span>
                  <h4 className="text-xs font-black text-slate-900">{ev.name}</h4>
                  <span className="text-[9px] font-bold text-indigo-600 mt-1 block">{ev.badge}</span>
                </div>
              ))}
            </div>

            {/* Live Event Stream Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Event Dispatch Stream</h4>
              <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs space-y-1.5 max-h-56 overflow-y-auto">
                {simulatedEventsLog.map((log, idx) => (
                  <div key={idx} className="leading-relaxed border-b border-slate-900 pb-1">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SQUAD / AGENCY DELEGATED ACCESS TAB                                    */}
      {/* ========================================================================= */}
      {activeTab === 'agency' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Marketing Team & Agency Delegated Access</h3>
            <p className="text-xs text-slate-500">
              Grant authorized marketing personnel or growth squads permission to manage your ad campaigns and creative funnels without exposing financial balances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allowed Permissions */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm">Allowed Permissions (Campaign Manager)</h4>
              </div>
              <ul className="text-xs text-emerald-900 space-y-2 font-medium">
                <li className="flex items-center gap-2">✓ View dynamic landing page layouts & sections</li>
                <li className="flex items-center gap-2">✓ Access campaign analytics, UTM tracking & visitor metrics</li>
                <li className="flex items-center gap-2">✓ Create, test, and link advertising campaigns</li>
                <li className="flex items-center gap-2">✓ Upload ad creative assets, banners, and copy</li>
                <li className="flex items-center gap-2">✓ View inbound leads and contact form submissions</li>
              </ul>
            </div>

            {/* Restricted Permissions */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-800">
                <Lock className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-sm">Strictly Restricted Areas</h4>
              </div>
              <ul className="text-xs text-rose-900 space-y-2 font-medium">
                <li className="flex items-center gap-2">✗ No access to wallet balance or withdrawal requests</li>
                <li className="flex items-center gap-2">✗ No access to personal banking or KYC verification records</li>
                <li className="flex items-center gap-2">✗ No access to account passwords or security settings</li>
                <li className="flex items-center gap-2">✗ No access to MLM binary tree placements or commissions</li>
                <li className="flex items-center gap-2">✗ No access to internal peer-to-peer EVO token transfers</li>
              </ul>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Invite Marketing Manager / Agency Partner</h4>
              <p className="text-[11px] text-slate-500">Provide their email to issue a scoped invitation link.</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="agency@marketingpartner.com"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500 w-full sm:w-64"
              />
              <button
                type="button"
                onClick={() => alert('Scoped Agency Invitation dispatched with Campaign Manager permissions.')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 shadow-md"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AI MARKETING ASSISTANT TAB                                             */}
      {/* ========================================================================= */}
      {activeTab === 'ai-ads' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">AI Marketing & Ad Campaign Assistant</h3>
            <p className="text-xs text-slate-500">
              Generate structured ad copy, high-intent audience suggestions, and follow-up email series trained on your store catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Niche & Offer</label>
              <input
                type="text"
                value={adNiche}
                onChange={(e) => setAdNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Advertising Platform</label>
              <select
                value={adTargetPlatform}
                onChange={(e) => setAdTargetPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
              >
                <option>Meta (Facebook / Instagram)</option>
                <option>Google Ads (Search & Performance Max)</option>
                <option>TikTok Ads</option>
                <option>LinkedIn Sponsored Content</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateAdCopy}
              disabled={isGeneratingAd}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              {isGeneratingAd ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Campaign Assets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Ad Set</span>
                </>
              )}
            </button>
          </div>

          {generatedAdCopy && (
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-indigo-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="sm">Generated Campaign Creative</Badge>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedAdCopy);
                    alert('Copied to clipboard!');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Assets</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
                {generatedAdCopy}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PREMIUM MARKETING SERVICES TAB                                         */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Premium Growth & Managed Marketing Services</h3>
              <p className="text-xs text-slate-500">
                Let Eviona certified growth squads build, optimize, and scale your campaigns directly from your wallet balance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Turnkey Meta Ads Setup',
                  price: '150 EVO',
                  desc: 'Complete Pixel audit, custom audience creation, 5 creative copy variants, and CAPI configuration.',
                  badge: 'Popular',
                },
                {
                  title: 'High-Converting Funnel Audit',
                  price: '250 EVO',
                  desc: 'Comprehensive conversion rate audit of your landing page copy, mobile speed, and checkout flow.',
                  badge: 'Growth',
                },
                {
                  title: 'Dedicated Agency Squad (Monthly)',
                  price: '500 EVO / mo',
                  desc: 'Full-service ad management, daily budget pacing, weekly A/B testing, and direct lead nurturing.',
                  badge: 'Enterprise',
                },
              ].map((service, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-indigo-500 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase text-indigo-600">{service.badge}</span>
                      <span className="font-black text-slate-900 text-base">{service.price}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{service.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{service.desc}</p>
                  </div>

                  <button
                    onClick={() => alert(`Purchased ${service.title} using EVO Token balance!`)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                  >
                    Order with EVO Wallet
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
