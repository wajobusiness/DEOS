import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Save,
  MoveUp,
  MoveDown,
  Layers,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

interface BuilderSection {
  id: string;
  type: string;
  headline?: string;
  subhead?: string;
  cta?: string;
  stat1?: string;
  stat2?: string;
  stat3?: string;
  bg: string;
  textColor: string;
}

export const WebsiteBuilder: React.FC = () => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');

  // Editable canvas sections
  const [sections, setSections] = useState<BuilderSection[]>([
    {
      id: 'hero',
      type: 'Hero Section',
      headline: 'We Help You Build, Grow & Scale Your Online Business',
      subhead: 'Get high-converting digital solutions, marketing automation, and AI tools all under one roof.',
      cta: 'Explore Our Services',
      bg: '#0F172A',
      textColor: '#FFFFFF',
    },
    {
      id: 'stats',
      type: 'Statistics Counter',
      stat1: '10+ Years Experience',
      stat2: '500+ Clients Served',
      stat3: '99.8% Satisfaction',
      bg: '#FFFFFF',
      textColor: '#0F172A',
    },
    {
      id: 'join_block',
      type: 'Join / Become a Member (Eviona Embedded)',
      headline: 'Ready to Launch Your Own Business with Eviona Ecosystem?',
      subhead: 'Join our team directly. Get instant access to websites, CRM, marketplace, and 10% binary compensation.',
      cta: 'Register as Member under John Doe',
      bg: '#4F46E5',
      textColor: '#FFFFFF',
    },
  ]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>('hero');

  const selectedSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const updateSectionHeadline = (text: string) => {
    setSections(prev => prev.map(s => s.id === selectedSectionId ? { ...s, headline: text } : s));
  };

  const updateSectionSubhead = (text: string) => {
    setSections(prev => prev.map(s => s.id === selectedSectionId ? { ...s, subhead: text } : s));
  };

  const updateSectionCta = (text: string) => {
    setSections(prev => prev.map(s => s.id === selectedSectionId ? { ...s, cta: text } : s));
  };

  const addEmbeddedJoinBlock = () => {
    const newBlock: BuilderSection = {
      id: `join_${Date.now()}`,
      type: 'Join / Become a Member (Eviona Embedded)',
      headline: 'Partner With Us Today',
      subhead: 'Start your entrepreneurial journey with our mentorship and tools.',
      cta: 'Join My Network',
      bg: '#312E81',
      textColor: '#FFFFFF',
    };
    setSections(prev => [...prev, newBlock]);
    setSelectedSectionId(newBlock.id);
  };

  return (
    <div className="space-y-4 pb-16 animate-fadeIn">
      {/* Top Studio Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Site Info & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">johnsonagency.com</h3>
              <Badge variant="success" size="sm">● Published</Badge>
            </div>
            <p className="text-[10px] text-slate-500">
              Subdomain: <code className="text-indigo-600 font-mono">johndoe.eviona.com</code>
            </p>
          </div>
        </div>

        {/* Center: Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            title="Desktop View (1440px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Website changes published to custom domain and subdomain instantly!')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Site</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Left Structure + Canvas + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Structure Rail (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Page Sections</span>
            </h4>
            <button
              onClick={addEmbeddedJoinBlock}
              title="Add Join Member Referral Block"
              className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
              + Join Block
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedSectionId === sec.id
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{sec.type}</p>
                  <p className="text-[10px] text-slate-400">Order: #{idx + 1}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <button className="p-1 hover:text-slate-700"><MoveUp className="w-3 h-3" /></button>
                  <button className="p-1 hover:text-slate-700"><MoveDown className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
            <p className="font-bold text-slate-900 mb-1">Book 6 Standard:</p>
            <span>Member sites dynamically link all contact forms to your CRM with immutable lead attribution.</span>
          </div>
        </div>

        {/* Center Live Canvas Editor (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            className={`bg-white rounded-2xl border-4 border-slate-300 shadow-2xl overflow-hidden transition-all duration-300 ${
              viewport === 'desktop'
                ? 'w-full'
                : viewport === 'tablet'
                ? 'w-[480px]'
                : 'w-[340px]'
            }`}
          >
            {/* Simulated Browser Bar */}
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white text-xs">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-300 truncate">https://johnsonagency.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Canvas Body */}
            <div className="divide-y divide-slate-100 min-h-[460px]">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  style={{ backgroundColor: sec.bg, color: sec.textColor }}
                  className={`p-8 text-center cursor-pointer transition-all relative group ${
                    selectedSectionId === sec.id ? 'ring-4 ring-indigo-500/60 ring-inset' : ''
                  }`}
                >
                  <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold px-2 py-0.5 rounded bg-black/50 text-white">
                    Click to Edit
                  </span>

                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight max-w-md mx-auto">
                    {sec.headline}
                  </h2>
                  <p className="text-xs mt-2 max-w-sm mx-auto opacity-80">
                    {sec.subhead}
                  </p>
                  {sec.cta && (
                    <button className="mt-4 px-5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md">
                      {sec.cta}
                    </button>
                  )}

                  {sec.stat1 && (
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div className="p-2 rounded bg-slate-100"><p className="text-xs font-bold text-slate-900">{sec.stat1}</p></div>
                      <div className="p-2 rounded bg-slate-100"><p className="text-xs font-bold text-slate-900">{sec.stat2}</p></div>
                      <div className="p-2 rounded bg-slate-100"><p className="text-xs font-bold text-slate-900">{sec.stat3}</p></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Simulated Floating AI Chatbot Widget */}
            <div className="bg-slate-900/90 backdrop-blur-sm p-3 border-t border-slate-800 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-[11px]">Apex Lead Concierge (AI Active)</span>
              </div>
              <span className="text-[9px] font-mono text-indigo-300">Meta Pixel • GA4 Tracked</span>
            </div>
          </div>
        </div>

        {/* Right Property Inspector (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-card space-y-4">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'content' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'style' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
            >
              Style
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'advanced' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
            >
              SEO / Adv
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Text</label>
                <textarea
                  rows={2}
                  value={selectedSection.headline || ''}
                  onChange={(e) => updateSectionHeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Body</label>
                <textarea
                  rows={3}
                  value={selectedSection.subhead || ''}
                  onChange={(e) => updateSectionSubhead(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                />
              </div>

              {selectedSection.cta && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={selectedSection.cta}
                    onChange={(e) => updateSectionCta(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Color</label>
                <div className="flex gap-2">
                  {['#0F172A', '#4F46E5', '#312E81', '#10B981', '#FFFFFF'].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSections(prev => prev.map(s => s.id === selectedSectionId ? { ...s, bg: color, textColor: color === '#FFFFFF' ? '#0F172A' : '#FFFFFF' } : s));
                      }}
                      style={{ backgroundColor: color }}
                      className="w-8 h-8 rounded-lg border-2 border-slate-300 shadow-xs"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Custom Domain CNAME</label>
                <input
                  type="text"
                  defaultValue="johnsonagency.com"
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono text-[11px]"
                />
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-[11px]">
                SSL Certificate: <b>Active (Auto-renewing)</b>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
                <span className="font-bold text-slate-900 block">Marketing & Pixel Injection</span>
                <p className="text-slate-500">Meta Pixel (128938472910) + GA4 (G-EVIONA9821) auto-injected from Marketing Center.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

