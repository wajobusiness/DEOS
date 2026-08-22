import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Briefcase,
  Mail,
  Megaphone,
  Share2,
  Code,
  BarChart,
  ArrowRight,
  Copy,
  CheckCircle2,
  AlertCircle,
  Zap,
  Edit3
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AIBusinessCenter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(12450);
  const totalCredits = 20000;

  const quickPrompts = [
    'Write a 7-day email nurture sequence for real estate leads',
    'Generate a high-converting Facebook Ad copy for digital marketing',
    'Draft a comprehensive executive summary for a SaaS business plan',
    'Create 5 engaging LinkedIn post hooks for entrepreneurship'
  ];

  const tools = [
    { title: 'AI Content Creator', desc: 'Articles, blogs, and SEO copy', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { title: 'AI Image Studio', desc: 'Product mockups and brand visuals', icon: ImageIcon, color: 'text-purple-600 bg-purple-50' },
    { title: 'AI Chat Assistant', desc: 'Strategy coaching and research', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'AI Voiceover', desc: 'Natural audio and podcasts', icon: Mic, color: 'text-amber-600 bg-amber-50' },
    { title: 'AI Business Plan', desc: 'Financial forecasts and pitch decks', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'AI Email Writer', desc: 'Sales sequences and newsletters', icon: Mail, color: 'text-rose-600 bg-rose-50' },
    { title: 'AI Ad Copy Generator', desc: 'Meta, Google, and TikTok ads', icon: Megaphone, color: 'text-orange-600 bg-orange-50' },
    { title: 'AI Social Media Post', desc: 'Viral reels and carousel copy', icon: Share2, color: 'text-pink-600 bg-pink-50' },
    { title: 'AI Code Generator', desc: 'Scripts, webhooks, and integrations', icon: Code, color: 'text-cyan-600 bg-cyan-50' },
    { title: 'AI Data Analyzer', desc: 'Predictive sales intelligence', icon: BarChart, color: 'text-teal-600 bg-teal-50' },
  ];

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setOutput(`### AI Generated Business Strategy\n\n**Campaign Objective:** High-ticket client conversion\n\n**Core Value Proposition:** Scale your agency from zero to $50k/mo using automated funnels and AI lead intelligence.\n\n**Action Steps:**\n1. Target warm leads using Eviona CRM pipeline\n2. Deploy email sequence #1 within 2 hours of form submission\n3. Offer 10% referral incentive to community partners.`);
      setIsGenerating(false);
      setCreditsUsed(prev => prev + 150);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Prompt Studio & Credits Meter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prompt Studio Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">AI Prompt & Creation Studio</h3>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                placeholder="Describe what you want to create (e.g. Write a 5-part email series for high-ticket coaching)..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(qp)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors text-left"
                >
                  + {qp}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Cost: ~150 AI Credits</span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating AI Output...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Credit Meter Widget (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Credit Balance</span>
              <Badge variant="purple" size="sm">Monthly Allocation</Badge>
            </div>

            <div className="flex items-center gap-4 my-3">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#8B5CF6" strokeWidth="4" strokeDasharray={`${(creditsUsed/totalCredits)*88} 100`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-slate-900">{((creditsUsed/totalCredits)*100).toFixed(0)}%</span>
                  <span className="text-[8px] text-slate-400">Used</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">{creditsUsed.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {totalCredits.toLocaleString()}</span></h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{(totalCredits - creditsUsed).toLocaleString()} Credits Remaining</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between"><span>Words Generated</span><span className="font-bold text-slate-900">45,200</span></div>
              <div className="flex justify-between"><span>Images Created</span><span className="font-bold text-slate-900">124</span></div>
              <div className="flex justify-between"><span>Voice Minutes</span><span className="font-bold text-slate-900">18 mins</span></div>
            </div>
          </div>

          <button
            onClick={() => alert('Credit top-up requested.')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Top-up AI Credits
          </button>
        </div>
      </div>

      {/* Output Display Card (When Generated) */}
      {output && (
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-card animate-fadeIn space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">AI Generated Output</Badge>
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Mandatory Disclosure: Review before publish
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
              <button
                onClick={() => alert('Inserted into Website Builder draft!')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Insert to Website Builder
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
            {output}
          </div>
        </div>
      )}

      {/* 10 Core AI Tools Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          AI Business Suite (10 Specialized Tools)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                onClick={() => setPrompt(`Generate a professional ${t.title.toLowerCase()} for my business...`)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${t.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t.desc}</p>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

