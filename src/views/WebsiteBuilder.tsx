import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Save,
  Layers,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Zap,
  Bot,
  Store,
  ShieldCheck,
  Star,
  ShoppingBag,
  Mail,
  Phone,
  Video,
  HelpCircle,
  Users,
  Copy,
  Check,
  Sliders,
  Palette,
  Search,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  FileText,
  AlertCircle,
  Eye,
  RefreshCw,
  Send,
  Lock
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Member, Product, ViewType } from '../types';
import { useAuth } from '../context/AuthContext';
import { websiteBuilderEngine, WebsiteConfig } from '../engine/websiteBuilderEngine';
import { marketplaceEngine } from '../engine/marketplaceEngine';

interface WebsiteBuilderProps {
  currentUser?: Member;
  onNavigate?: (view: ViewType) => void;
}

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({
  currentUser,
  onNavigate,
}) => {
  const { member } = useAuth();
  const activeUser = currentUser || member || {
    id: '',
    memberCode: '',
    name: 'Member',
    email: '',
  };

  const userId = activeUser.id || activeUser.memberCode || '';
  const userName = activeUser.name || 'Member';

  const [config, setConfig] = useState<WebsiteConfig>(() =>
    websiteBuilderEngine.getWebsiteConfig(userId, userName)
  );

  const [activeTab, setActiveTab] = useState<'preview' | 'landing_editor' | 'store_editor' | 'branding' | 'domain' | 'seo' | 'marketing' | 'leads'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewPage, setPreviewPage] = useState<'landing' | 'store'>('landing');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Interactive Lead Capture State (inside preview)
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitSuccess, setLeadSubmitSuccess] = useState<string | null>(null);

  // Captured Leads State
  const [capturedLeads, setCapturedLeads] = useState(() =>
    websiteBuilderEngine.getWebsiteLeads(userId)
  );

  // Store Products for this user
  const [storeProducts, setStoreProducts] = useState<Product[]>(() =>
    marketplaceEngine.getStoreProducts(userId)
  );

  // Domain verification state
  const [customDomainInput, setCustomDomainInput] = useState(config.customDomain || '');
  const [domainVerified, setDomainVerified] = useState(config.isDomainVerified !== false);

  const refreshData = () => {
    const updated = websiteBuilderEngine.getWebsiteConfig(userId, userName);
    setConfig(updated);
    setCapturedLeads(websiteBuilderEngine.getWebsiteLeads(userId));
    setStoreProducts(marketplaceEngine.getStoreProducts(userId));
  };

  useEffect(() => {
    refreshData();
  }, [userId]);

  const handleSaveConfig = () => {
    setIsSaving(true);
    websiteBuilderEngine.saveWebsiteConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccessMessage(true);
      setTimeout(() => setSaveSuccessMessage(false), 2500);
    }, 400);
  };

  const handleCopyPublicUrl = () => {
    const publicUrl = `https://${config.customDomain || config.subdomain}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    setIsSubmittingLead(true);
    try {
      const res = await websiteBuilderEngine.captureLead({
        websiteOwnerId: userId,
        websiteOwnerName: userName,
        name: formName,
        email: formEmail,
        phone: formPhone,
      });

      setLeadSubmitSuccess(res.message);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setCapturedLeads(websiteBuilderEngine.getWebsiteLeads(userId));
    } catch (err: any) {
      alert(err.message || 'Error capturing lead.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleVerifyDomain = () => {
    const res = websiteBuilderEngine.verifyCustomDomain(customDomainInput);
    setDomainVerified(res.verified);
    const updatedConfig = {
      ...config,
      customDomain: customDomainInput,
      isDomainVerified: res.verified,
      sslStatus: res.ssl,
    };
    setConfig(updatedConfig);
    websiteBuilderEngine.saveWebsiteConfig(updatedConfig);
    alert(res.verified ? 'Custom domain verified & SSL certificate active!' : 'Invalid domain syntax. Please enter a valid domain (e.g. yourbrand.com).');
  };

  // Visual Theme Colors
  const themeGradients = {
    indigo: 'from-indigo-900 via-slate-900 to-indigo-950',
    purple: 'from-purple-900 via-slate-900 to-indigo-950',
    emerald: 'from-emerald-900 via-slate-900 to-teal-950',
    rose: 'from-rose-900 via-slate-900 to-pink-950',
    amber: 'from-amber-900 via-slate-900 to-orange-950',
    blue: 'from-blue-900 via-slate-900 to-cyan-950',
  };

  const activeTheme = themeGradients[config.branding.themeColor] || themeGradients.indigo;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Studio Header Control Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Site Identity & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">{config.branding.siteTitle}</h3>
              <Badge variant="emerald" size="sm">● Published</Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
              <span>https://{config.customDomain || config.subdomain}</span>
              <button onClick={handleCopyPublicUrl} className="text-indigo-600 hover:text-indigo-800" title="Copy Website Link">
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </p>
          </div>
        </div>

        {/* Viewport & Tab Switchers */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Responsive Viewport Switcher */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                title="Desktop View (1440px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-2 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Page Preview Switcher */}
          {activeTab === 'preview' && (
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setPreviewPage('landing')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  previewPage === 'landing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Landing Page
              </button>
              <button
                onClick={() => setPreviewPage('store')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  previewPage === 'store' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Store Page ({storeProducts.length})
              </button>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : saveSuccessMessage ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold overflow-x-auto w-full">
        {[
          { id: 'preview', label: 'Live Website Preview', icon: Eye },
          { id: 'landing_editor', label: 'Landing Page Editor', icon: Edit3 },
          { id: 'store_editor', label: 'Store Page & Products', icon: Store },
          { id: 'branding', label: 'Branding & Visuals', icon: Palette },
          { id: 'domain', label: 'Domain & DNS', icon: Globe },
          { id: 'seo', label: 'SEO & Social Meta', icon: Sparkles },
          { id: 'marketing', label: 'Marketing Pixels', icon: Zap },
          { id: 'leads', label: `CRM Captured Leads (${capturedLeads.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE INTERACTIVE PREVIEW CANVAS */}
      {activeTab === 'preview' && (
        <div className="flex justify-center transition-all">
          <div
            className={`w-full transition-all duration-300 ${
              viewport === 'desktop' ? 'max-w-7xl' : viewport === 'tablet' ? 'max-w-[768px]' : 'max-w-[375px]'
            }`}
          >
            <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden text-slate-100">
              {/* Browser Mockup Top Bar */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-4 py-1 rounded-full border border-slate-800 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://{config.customDomain || config.subdomain}</span>
                </div>
                <div className="w-12" />
              </div>

              {/* LIVE PAGE: 1. LANDING PAGE VIEW */}
              {previewPage === 'landing' && (
                <div className="space-y-16 pb-16 bg-slate-950">
                  {/* Hero Section */}
                  <div className={`relative px-6 py-16 sm:py-24 text-center bg-gradient-to-b ${activeTheme} border-b border-white/10`}>
                    <div className="max-w-3xl mx-auto space-y-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold border border-white/10 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{config.hero.badge}</span>
                      </div>

                      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                        {config.hero.headline}
                      </h1>

                      <p className="text-sm sm:text-base text-indigo-200 max-w-2xl mx-auto leading-relaxed">
                        {config.hero.subheadline}
                      </p>

                      <div className="pt-2 flex flex-wrap justify-center gap-3">
                        <a
                          href="#lead-capture"
                          className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/40 flex items-center gap-2 transition-transform active:scale-95"
                        >
                          <span>{config.hero.ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setPreviewPage('store')}
                          className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/10"
                        >
                          Visit Storefront ({storeProducts.length} Assets)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Benefits & Value Proposition Section */}
                  <div className="max-w-6xl mx-auto px-6 space-y-8">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-black text-white">Why Partner With Us</h2>
                      <p className="text-xs text-slate-400">Everything you need to automate and monetize your digital business.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {config.benefits.map((b) => (
                        <div key={b.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 hover:border-indigo-500/50 transition-colors">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                            <Zap className="w-5 h-5" />
                          </div>
                          <h4 className="font-extrabold text-white text-sm">{b.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Lead Capture Form Section */}
                  {config.leadForm.enabled && (
                    <div id="lead-capture" className="max-w-xl mx-auto px-6">
                      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-5">
                        <div className="text-center space-y-1.5">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                            <Send className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-black text-white">{config.leadForm.headline}</h3>
                          <p className="text-xs text-indigo-200 leading-relaxed">{config.leadForm.subhead}</p>
                        </div>

                        {leadSubmitSuccess ? (
                          <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-center text-emerald-300 space-y-2">
                            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                            <p className="text-xs font-bold">{leadSubmitSuccess}</p>
                            <button
                              onClick={() => setLeadSubmitSuccess(null)}
                              className="text-[11px] underline text-emerald-200"
                            >
                              Submit Another Lead
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleLeadFormSubmit} className="space-y-3 text-xs">
                            {config.leadForm.fields.name && (
                              <div>
                                <label className="block font-bold text-slate-300 mb-1">Your Full Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Jordan Miller"
                                  value={formName}
                                  onChange={(e) => setFormName(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-indigo-500"
                                />
                              </div>
                            )}

                            {config.leadForm.fields.email && (
                              <div>
                                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="jordan@business.com"
                                  value={formEmail}
                                  onChange={(e) => setFormEmail(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-indigo-500"
                                />
                              </div>
                            )}

                            {config.leadForm.fields.phone && (
                              <div>
                                <label className="block font-bold text-slate-300 mb-1">Phone / WhatsApp Number</label>
                                <input
                                  type="tel"
                                  placeholder="+1 (555) 019-2834"
                                  value={formPhone}
                                  onChange={(e) => setFormPhone(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-indigo-500"
                                />
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={isSubmittingLead}
                              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2"
                            >
                              <Send className="w-4 h-4" />
                              <span>{isSubmittingLead ? 'Submitting to CRM...' : config.leadForm.buttonText}</span>
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Testimonials */}
                  <div className="max-w-4xl mx-auto px-6 space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-black text-white">Client & Partner Success</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {config.testimonials.map((t) => (
                        <div key={t.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-300 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                            <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <h5 className="font-bold text-white text-xs">{t.name}</h5>
                              <p className="text-[10px] text-slate-400">{t.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="max-w-3xl mx-auto px-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-black text-white">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-2.5">
                      {config.faqs.map((f) => (
                        <div key={f.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                          <h5 className="font-bold text-white text-xs">{f.question}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LIVE PAGE: 2. STORE PAGE VIEW */}
              {previewPage === 'store' && (
                <div className="p-6 sm:p-10 space-y-8 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white">{config.branding.siteTitle} Store</h2>
                      <p className="text-xs text-slate-400">{config.branding.tagline}</p>
                    </div>
                    <Badge variant="purple" size="sm">{storeProducts.length} Products Live</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {storeProducts.map((p) => (
                      <div key={p.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between group">
                        <div className="aspect-video relative overflow-hidden bg-slate-800">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-1 rounded-lg text-xs font-bold text-white">
                            ${p.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-white text-xs">{p.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-xs font-black text-indigo-400">${p.price.toFixed(2)} USD</span>
                            <button
                              onClick={() => alert(`Direct checkout initiated for ${p.title}`)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LANDING PAGE VISUAL EDITOR */}
      {activeTab === 'landing_editor' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-4xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">Landing Page Editor</h3>
            <p className="text-xs text-slate-500">Configure your primary lead-generation homepage sections.</p>
          </div>

          <div className="space-y-6 text-xs">
            {/* Hero Editor */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Hero Section Content</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={config.hero.badge}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, badge: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Call to Action (CTA) Button</label>
                  <input
                    type="text"
                    value={config.hero.ctaText}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, ctaText: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={config.hero.headline}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, headline: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subheadline & Value Pitch</label>
                <textarea
                  rows={2}
                  value={config.hero.subheadline}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subheadline: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Lead Form Settings */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-purple-600" />
                  <span>Lead Capture Form Settings</span>
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.leadForm.enabled}
                    onChange={(e) => setConfig({ ...config, leadForm: { ...config.leadForm, enabled: e.target.checked } })}
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span className="font-bold text-slate-700">Enable Form</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Form Headline</label>
                <input
                  type="text"
                  value={config.leadForm.headline}
                  onChange={(e) => setConfig({ ...config, leadForm: { ...config.leadForm, headline: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Form Button Text</label>
                <input
                  type="text"
                  value={config.leadForm.buttonText}
                  onChange={(e) => setConfig({ ...config, leadForm: { ...config.leadForm, buttonText: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STORE PAGE & PRODUCTS */}
      {activeTab === 'store_editor' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Your Connected Store Products</h3>
              <p className="text-xs text-slate-500">Products created in your Seller Dashboard automatically display on your website&apos;s Store page.</p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('sellers')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                + Add Product in Sellers Center
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1 text-xs">
                  <h4 className="font-bold text-slate-900 truncate">{p.title}</h4>
                  <p className="text-indigo-600 font-black">${p.price.toFixed(2)} USD</p>
                  <p className="text-slate-400 text-[10px]">{p.salesCount || 0} units sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BRANDING & VISUALS */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">Branding & Color Theme</h3>
            <p className="text-xs text-slate-500">Set your brand voice, site name, and color accents.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website Title</label>
              <input
                type="text"
                value={config.branding.siteTitle}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, siteTitle: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={config.branding.tagline}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, tagline: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Theme Color Palette</label>
              <select
                value={config.branding.themeColor}
                onChange={(e) => setConfig({ ...config, branding: { ...config.branding, themeColor: e.target.value as any } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              >
                <option value="indigo">Indigo Cosmic (Default)</option>
                <option value="purple">Royal Purple Mastermind</option>
                <option value="emerald">Emerald Growth & Wealth</option>
                <option value="rose">Rose Luxury Elite</option>
                <option value="amber">Amber Cyber Gold</option>
                <option value="blue">Deep Ocean Blue</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOMAIN CONNECTION & DNS */}
      {activeTab === 'domain' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-black text-slate-900">Custom Domain & DNS Setup</h3>
            <p className="text-xs text-slate-500">Connect your custom domain name to your Business Center website and store.</p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950">Default Free Subdomain</span>
              <Badge variant="emerald" size="sm">Active</Badge>
            </div>
            <p className="font-mono text-indigo-700 font-bold">https://{config.subdomain}</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Custom Domain (e.g. youragency.com)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="youragency.com"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold font-mono outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyDomain}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Verify Domain
                </button>
              </div>
            </div>

            {/* DNS Instructions */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">DNS Configuration Records</h4>
              <p className="text-slate-500 text-[11px]">Add these records inside your domain registrar (GoDaddy, Namecheap, Cloudflare):</p>
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200">
                    <th className="py-2">Type</th>
                    <th className="py-2">Host / Name</th>
                    <th className="py-2">Target / Value</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-indigo-600">CNAME</td>
                    <td className="py-2">@ or www</td>
                    <td className="py-2">cname.evionaecosystem.com</td>
                    <td className="py-2 text-emerald-600 font-bold">● Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SEO & SOCIAL META */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <div>
            <h3 className="text-lg font-black text-slate-900">Search Engine Optimization (SEO)</h3>
            <p className="text-slate-500">Configure search rankings, title tags, and social media previews.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Page Meta Title</label>
              <input
                type="text"
                value={config.seo.metaTitle}
                onChange={(e) => setConfig({ ...config, seo: { ...config.seo, metaTitle: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Page Meta Description</label>
              <textarea
                rows={3}
                value={config.seo.metaDescription}
                onChange={(e) => setConfig({ ...config, seo: { ...config.seo, metaDescription: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MARKETING PIXELS */}
      {activeTab === 'marketing' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <div>
            <h3 className="text-lg font-black text-slate-900">Marketing Pixels & Conversion Tracking</h3>
            <p className="text-slate-500">Inject Google Analytics, Meta Pixel, and TikTok tracking automatically into your website.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Analytics Measurement ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={config.tracking.googleAnalyticsId}
                onChange={(e) => setConfig({ ...config, tracking: { ...config.tracking, googleAnalyticsId: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta / Facebook Pixel ID</label>
              <input
                type="text"
                placeholder="109283749102938"
                value={config.tracking.facebookPixelId}
                onChange={(e) => setConfig({ ...config, tracking: { ...config.tracking, facebookPixelId: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                placeholder="C98127391823"
                value={config.tracking.tiktokPixelId}
                onChange={(e) => setConfig({ ...config, tracking: { ...config.tracking, tiktokPixelId: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: CAPTURED LEADS (CRM INTEGRATION) */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Website Captured Leads</h3>
              <p className="text-xs text-slate-500 mt-0.5">Every submission on your landing page lead form appears here and in your main CRM.</p>
            </div>
            <Badge variant="purple" size="sm">{capturedLeads.length} Total Leads</Badge>
          </div>

          {capturedLeads.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Mail className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-slate-600">No Leads Captured Yet</p>
              <p className="text-[11px]">When visitors fill out your website lead form, they will appear here instantly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6">Lead Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 pr-6 text-right">CRM Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {capturedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 font-medium">
                      <td className="p-4 pl-6 font-bold text-slate-900">{lead.name}</td>
                      <td className="p-4 font-mono text-slate-600">{lead.email}</td>
                      <td className="p-4 font-mono text-slate-600">{lead.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {lead.source}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">{lead.createdAt}</td>
                      <td className="p-4 pr-6 text-right">
                        <Badge variant="emerald" size="sm">{lead.status || 'New'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
