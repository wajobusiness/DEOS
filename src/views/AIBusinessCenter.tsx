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
  Edit3,
  Globe,
  UploadCloud,
  Database,
  Layers,
  Sliders,
  Send,
  Plus,
  Play,
  Check
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AIBusinessCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'chatbot' | 'website' | 'knowledge' | 'crm-ai' | 'tools'>('copilot');

  // Business Context State
  const [businessProfile, setBusinessProfile] = useState({
    businessName: 'Apex Growth Digital',
    domain: 'apexgrowth.eviona.com',
    industry: 'Digital Marketing & Coaching',
    targetAudience: 'Aspiring Entrepreneurs & Agency Owners',
    primaryGoal: 'Scale monthly active clients to 50 members',
  });

  // Credit Usage State
  const [creditsUsed, setCreditsUsed] = useState(12450);
  const totalCredits = 20000;

  // 1. Co-Pilot Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your Eviona Business Co-Pilot. I've analyzed your business profile for 'Apex Growth Digital' and your domain 'apexgrowth.eviona.com'. How can I help you accelerate conversions or automate operations today?",
      time: '10:00 AM'
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);

  // 2. Custom Chatbot Builder State
  const [botConfig, setBotConfig] = useState({
    botName: 'Apex Lead Concierge',
    welcomeMessage: 'Hi there! 👋 Welcome to Apex Growth. Are you looking to launch your digital business or scale an existing agency?',
    leadCaptureQuestion: 'May I have your name and best email so we can send you our free masterclass roadmap?',
    isActive: true,
  });
  const [testBotMessages, setTestBotMessages] = useState<Array<{ sender: 'bot' | 'visitor'; text: string }>>([
    { sender: 'bot', text: 'Hi there! 👋 Welcome to Apex Growth. Are you looking to launch your digital business or scale an existing agency?' }
  ]);
  const [testBotInput, setTestBotInput] = useState('');

  // 3. AI Website Builder Assistant State
  const [siteNiche, setSiteNiche] = useState('High-Ticket Business Coaching & AI Automation');
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);
  const [generatedSiteCopy, setGeneratedSiteCopy] = useState<any>(null);

  // 4. Knowledge Base State
  const [knowledgeSources, setKnowledgeSources] = useState([
    { id: 'KB-1', title: 'Apex Growth Service Catalog & Pricing PDF', type: 'Document', status: 'Indexed & Active', items: '24 Pages' },
    { id: 'KB-2', title: 'https://apexgrowth.eviona.com/faq', type: 'Live URL', status: 'Indexed & Active', items: '18 FAQs' },
    { id: 'KB-3', title: 'Product Refund & Delivery Policy', type: 'Text Document', status: 'Indexed & Active', items: '1,200 Words' },
  ]);

  // Co-Pilot Chat Sender
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim()) return;

    const userMsg = currentChatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setCurrentChatInput('');
    setIsChatThinking(true);

    setTimeout(() => {
      let aiReply = `Based on your profile for ${businessProfile.businessName} and domain ${businessProfile.domain}:\n\n1. Target High-Intent Leads: Deploy our 5-part email nurture sequence to all inbound CRM leads tagged '#meta_ads'.\n2. Funnel Optimization: Add a 24/7 AI lead capture chatbot to your hero section to boost contact conversion from 8% to 15%.\n3. Incentive: Offer a free 15-minute consultation booking link on your Thank You page.`;
      if (userMsg.toLowerCase().includes('email')) {
        aiReply = `Here is a high-converting follow-up email hook:\n\nSubject: [Action Required] Your Growth Roadmap for ${businessProfile.businessName}\n\nHi {{name}},\n\nSaw you explored our platform at ${businessProfile.domain}. We just released our new AI automation masterclass and reserved a complimentary seat for you. Let's get you launched!`;
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsChatThinking(false);
      setCreditsUsed(prev => prev + 50);
    }, 1000);
  };

  // Chatbot Live Test Sender
  const handleSendBotTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testBotInput.trim()) return;

    const msg = testBotInput;
    setTestBotMessages(prev => [...prev, { sender: 'visitor', text: msg }]);
    setTestBotInput('');

    setTimeout(() => {
      setTestBotMessages(prev => [
        ...prev,
        { sender: 'bot', text: `Got it! We have the perfect blueprint for "${msg}". ${botConfig.leadCaptureQuestion}` }
      ]);
    }, 800);
  };

  // Generate Website Copy
  const handleGenerateSite = () => {
    setIsGeneratingSite(true);
    setTimeout(() => {
      setGeneratedSiteCopy({
        headline: 'LAUNCH YOUR DIGITAL EMPIRE. AUTOMATE YOUR FREEDOM.',
        subheadline: 'The complete digital operating system powering modern entrepreneurs with high-converting websites, automated CRM, global marketplace, and AI business intelligence.',
        bullets: [
          'Instant High-Converting Business Website & Custom Domain',
          'AI-Powered Multi-Channel Lead Generation & CRM',
          'Global Marketplace Selling & 40% Affiliate Commissions',
          '24/7 Intelligent Autonomous Chatbot & Business Co-Pilot',
          'Mathematical Binary Referral Network & Global Income',
        ],
        ctaText: 'START YOUR DIGITAL BUSINESS TODAY',
      });
      setIsGeneratingSite(false);
      setCreditsUsed(prev => prev + 150);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner with Business Context Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white border border-indigo-500/20 shadow-card flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Global AI Business Intelligence Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Cognitive Co-Pilot & Autonomous Business Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Trained on your business brand (<b className="text-white">{businessProfile.businessName}</b>), domain (<code className="text-indigo-300">{businessProfile.domain}</code>), and marketplace catalog.
          </p>
        </div>

        {/* Live Credit Meter Widget */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white shrink-0 w-full sm:w-auto flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#818CF8" strokeWidth="4" strokeDasharray={`${(creditsUsed/totalCredits)*88} 100`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black">{((creditsUsed/totalCredits)*100).toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-200">AI Compute Credits</span>
            <h4 className="text-sm font-black mt-0.5">{creditsUsed.toLocaleString()} / {totalCredits.toLocaleString()}</h4>
            <button
              onClick={() => alert('Top-up 10,000 AI Credits for 10 EVO Tokens confirmed!')}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 mt-1 block"
            >
              + Top-up Credits (10 EVO)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-card overflow-x-auto gap-1">
        {[
          { id: 'copilot', label: 'Business Co-Pilot', icon: Bot },
          { id: 'chatbot', label: 'Custom Chatbot Builder', icon: MessageSquare },
          { id: 'website', label: 'AI Website Assistant', icon: Globe },
          { id: 'knowledge', label: 'Knowledge Base Training', icon: Database },
          { id: 'crm-ai', label: 'CRM & Lead Scoring', icon: BarChart },
          { id: 'tools', label: '10 AI Creation Tools', icon: Layers },
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
      {/* 1. BUSINESS CO-PILOT CHAT TAB                                             */}
      {/* ========================================================================= */}
      {activeTab === 'copilot' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Autonomous Business Co-Pilot</h3>
              <p className="text-xs text-slate-500">Ask questions, request campaign strategies, or draft sales proposals tailored to your brand.</p>
            </div>
            <Badge variant="purple" size="sm">Context: {businessProfile.businessName}</Badge>
          </div>

          {/* Chat Stream */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[320px] max-h-[420px] overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl text-xs max-w-xl leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none font-medium'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-2 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isChatThinking && (
              <div className="flex gap-2 items-center text-xs font-bold text-indigo-600 pl-11">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Co-Pilot is analyzing your business context...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              value={currentChatInput}
              onChange={(e) => setCurrentChatInput(e.target.value)}
              placeholder="Ask your AI Co-Pilot anything (e.g. How do I optimize my Facebook ad lead funnel?)..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!currentChatInput.trim() || isChatThinking}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CUSTOM CHATBOT BUILDER TAB                                             */}
      {/* ========================================================================= */}
      {activeTab === 'chatbot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bot Configuration Panel (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Custom Landing Page Chatbot Builder</h3>
              <p className="text-xs text-slate-500">Configure and deploy an intelligent lead-generation chatbot onto your personal domain.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={botConfig.botName}
                  onChange={(e) => setBotConfig({ ...botConfig, botName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Welcome Greeting Message</label>
                <textarea
                  rows={2}
                  value={botConfig.welcomeMessage}
                  onChange={(e) => setBotConfig({ ...botConfig, welcomeMessage: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Capture Prompt Question</label>
                <textarea
                  rows={2}
                  value={botConfig.leadCaptureQuestion}
                  onChange={(e) => setBotConfig({ ...botConfig, leadCaptureQuestion: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1.5">
                <span className="font-bold text-indigo-900 text-xs block">Automatic CRM Ingestion:</span>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Every contact captured by this chatbot is instantly written to your personal CRM with source tag <code className="bg-white px-1.5 py-0.5 rounded font-mono">ai_chatbot_concierge</code>.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => alert('Chatbot settings saved and published to your landing page!')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Landing Page</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Simulator (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-xs font-bold text-slate-900">Live Simulator: {botConfig.botName}</h4>
                </div>
                <Badge variant="blue" size="sm">Test Mode</Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3 h-64 overflow-y-auto space-y-3">
                {testBotMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-xl text-xs max-w-[85%] ${
                      m.sender === 'visitor'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendBotTest} className="flex gap-2">
              <input
                type="text"
                value={testBotInput}
                onChange={(e) => setTestBotInput(e.target.value)}
                placeholder="Type response as a visitor..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AI WEBSITE ASSISTANT TAB                                               */}
      {/* ========================================================================= */}
      {activeTab === 'website' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">AI Landing Page & Funnel Copy Assistant</h3>
            <p className="text-xs text-slate-500">Synthesize high-converting headlines, bullet points, FAQs, and CTA structures ready to inject into the Website Builder.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={siteNiche}
              onChange={(e) => setSiteNiche(e.target.value)}
              placeholder="Describe your business niche & target audience..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateSite}
              disabled={isGeneratingSite}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingSite ? 'Synthesizing...' : 'Generate Site Copy'}</span>
            </button>
          </div>

          {generatedSiteCopy && (
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-indigo-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <Badge variant="purple" size="sm">Synthesized Landing Page Copy</Badge>
                <button
                  onClick={() => alert('Inserted directly into your Website Builder draft!')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Insert into Website Builder
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Headline:</span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">{generatedSiteCopy.headline}</h4>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Sub-Headline:</span>
                  <p className="text-slate-600 mt-0.5">{generatedSiteCopy.subheadline}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Value Bullets:</span>
                  <ul className="mt-1 space-y-1 text-slate-700">
                    {generatedSiteCopy.bullets.map((b: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">✓ {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. KNOWLEDGE BASE TRAINING TAB                                            */}
      {/* ========================================================================= */}
      {activeTab === 'knowledge' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Custom Knowledge Base & Context Store</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ingest URLs, FAQs, and product PDFs so your AI assistants give domain-accurate answers.</p>
            </div>
            <button
              onClick={() => alert('Add New Knowledge Source wizard opened.')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Knowledge Source</span>
            </button>
          </div>

          <div className="space-y-3">
            {knowledgeSources.map((kb) => (
              <div key={kb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{kb.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{kb.type} • {kb.items}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="emerald" size="sm">{kb.status}</Badge>
                  <button
                    onClick={() => alert(`Retraining index for ${kb.title}...`)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Re-index
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CRM INTELLIGENCE & LEAD SCORING TAB                                    */}
      {/* ========================================================================= */}
      {activeTab === 'crm-ai' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Predictive Lead Scoring & Pipeline Intelligence</h3>
            <p className="text-xs text-slate-500">AI scores inbound leads based on source, pageview velocity, and message intent to prioritize closing.</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Sarah Johnson', email: 'sarah.j@growthbrand.com', score: 94, source: 'Meta Ads', status: 'Hot Lead', action: 'Send 1-on-1 Strategy Masterclass link via email #1' },
              { name: 'Michael Brown', email: 'michael.b@techconsult.org', score: 88, source: 'Google Organic', status: 'High Intent', action: 'Schedule Discovery Call (Qualified Deal: $3,000)' },
              { name: 'Grace Adeleke', email: 'grace.a@lagosbiz.ng', score: 76, source: 'TikTok Pixel', status: 'Nurture', action: 'Trigger automated 7-day e-book drip sequence' },
            ].map((lead, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{lead.name}</h4>
                    <span className="text-[10px] text-slate-400">({lead.email})</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 mt-1 font-medium">💡 Recommended Action: {lead.action}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">AI Score</span>
                    <b className="text-base font-black text-emerald-600">{lead.score}%</b>
                  </div>
                  <Badge variant={lead.score > 90 ? 'emerald' : 'purple'} size="sm">{lead.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. 10 CORE AI TOOLS GRID TAB                                              */}
      {/* ========================================================================= */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Specialized AI Creation Suite</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
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
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  onClick={() => alert(`Opened ${t.title}`)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
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
      )}
    </div>
  );
};
