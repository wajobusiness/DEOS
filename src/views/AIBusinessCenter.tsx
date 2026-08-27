import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  BookOpen,
  Send,
  Plus,
  Globe,
  Database,
  Sliders,
  Code2,
  CheckCircle2,
  FileText,
  Trash2,
  Play,
  RotateCcw,
  MessageSquareCode,
  LayoutTemplate,
  Users2,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  Target,
  Building2,
  MapPin,
  Mail,
  Phone,
  Star,
  Download,
  Check,
  Share2,
  Copy
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { websiteBuilderEngine } from '../engine/websiteBuilderEngine';
import { leadGenerationEngine, ProspectLead } from '../engine/leadGenerationEngine';

function getUserAIKey(userId: string, suffix: string): string {
  const cleanId = (userId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `eviona_user_${cleanId}_ai_${suffix}`;
}

export const AIBusinessCenter: React.FC = () => {
  const { member } = useAuth();
  const activeUserId = member?.id || member?.memberCode || '';
  const activeUserName = member?.name || 'Member';
  const tier = (member?.plan || 'pro').toLowerCase();

  const siteConfig = websiteBuilderEngine.getWebsiteConfig(activeUserId, activeUserName);
  const activeDomain = siteConfig.customDomain || `${siteConfig.subdomain}.evionaecosystem.com`;

  const [activeTab, setActiveTab] = useState<'copilot' | 'lead-finder' | 'chatbot' | 'website' | 'knowledge' | 'crm-ai' | 'tools'>('copilot');

  // Lead Finder State (Book 20 Google Maps Scraper Kit Integration)
  const [searchCategory, setSearchCategory] = useState('Dental Clinics & Orthodontics');
  const [searchCity, setSearchCity] = useState('Austin');
  const [searchCountry, setSearchCountry] = useState('United States');
  const [isSearchingLeads, setIsSearchingLeads] = useState(false);
  const [discoveredLeads, setDiscoveredLeads] = useState<ProspectLead[]>([]);
  const [importedLeadIds, setImportedLeadIds] = useState<string[]>([]);
  const [pitchLead, setPitchLead] = useState<ProspectLead | null>(null);
  const [pitchDraft, setPitchDraft] = useState<{ subject: string; body: string } | null>(null);
  const [isCopiedPitch, setIsCopiedPitch] = useState(false);

  // Business Context State derived dynamically from active user
  const [businessProfile, setBusinessProfile] = useState({
    businessName: `${activeUserName}'s Business Hub`,
    domain: activeDomain,
    industry: 'Digital Marketing & SaaS',
    targetAudience: 'Entrepreneurs, Affiliate Marketers & Online Brands',
    primaryGoal: 'Scale monthly active customers & recurring revenue',
  });

  // Credit Usage State (Plan-Based Limit)
  const totalCredits = tier === 'enterprise' ? 50000 : tier === 'diamond' ? 35000 : tier === 'vip' ? 25000 : tier === 'pro' ? 15000 : 5000;
  const [creditsUsed, setCreditsUsed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(getUserAIKey(activeUserId, 'credits_used'));
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 0;
  });

  useEffect(() => {
    localStorage.setItem(getUserAIKey(activeUserId, 'credits_used'), creditsUsed.toString());
  }, [creditsUsed, activeUserId]);

  // 1. Co-Pilot Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${activeUserName}! I am your Eviona Business Co-Pilot. I've initialized your profile for '${businessProfile.businessName}' connected to '${activeDomain}'. How can I help you accelerate sales or automate operations today?`,
      time: '10:00 AM'
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);

  // 2. Custom Chatbot Builder State
  const [botConfig, setBotConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(getUserAIKey(activeUserId, 'bot_config'));
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      botName: `${activeUserName.split(' ')[0]} AI Assistant`,
      welcomeMessage: `Hi there! 👋 Welcome to ${activeUserName}'s Hub. How can we help you scale your business today?`,
      leadCaptureQuestion: 'May I have your name and best email so we can send you our blueprint roadmap?',
      isActive: true,
    };
  });

  const [testBotMessages, setTestBotMessages] = useState<Array<{ sender: 'bot' | 'visitor'; text: string }>>([
    { sender: 'bot', text: `Hi there! 👋 Welcome to ${activeUserName}'s Hub. How can we help you scale your business today?` }
  ]);
  const [testBotInput, setTestBotInput] = useState('');

  // 3. AI Website Builder Assistant State
  const [siteNiche, setSiteNiche] = useState('High-Ticket Business Coaching & AI Automation');
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);
  const [generatedSiteCopy, setGeneratedSiteCopy] = useState<any>(null);

  // 4. Knowledge Base State
  const [knowledgeSources, setKnowledgeSources] = useState<Array<{ id: string; title: string; type: string; status: string; items: string }>>(() => {
    try {
      const saved = localStorage.getItem(getUserAIKey(activeUserId, 'kb_sources'));
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'KB-1', title: `${activeUserName} Product & Service Catalog`, type: 'Document', status: 'Indexed & Active', items: '12 Pages' },
      { id: 'KB-2', title: `https://${activeDomain}/faq`, type: 'Live URL', status: 'Indexed & Active', items: 'Live Web' },
    ];
  });

  // Co-Pilot Chat Sender
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim()) return;

    const userMsg = currentChatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setCurrentChatInput('');
    setIsChatThinking(true);

    setTimeout(() => {
      let aiReply = `Based on your profile for ${businessProfile.businessName} and domain ${activeDomain}:\n\n1. Target High-Intent Leads: Deploy our automated email sequences to all inbound CRM leads.\n2. Funnel Optimization: Add a 24/7 AI lead capture chatbot to your hero section to boost contact conversions.\n3. Incentive: Offer a free consultation or masterclass seat to newly registered contacts.`;
      if (userMsg.toLowerCase().includes('email')) {
        aiReply = `Here is a high-converting follow-up email hook:\n\nSubject: [Complimentary Access] Your Growth Roadmap from ${activeUserName}\n\nHi {{name}},\n\nSaw you explored our platform at ${activeDomain}. We just updated our growth resources and reserved a seat for you. Let's connect!`;
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
        { sender: 'bot', text: `Got it! We have the perfect solution for "${msg}". ${botConfig.leadCaptureQuestion}` }
      ]);
    }, 800);
  };

  const handleGenerateSiteCopy = () => {
    setIsGeneratingSite(true);
    setTimeout(() => {
      setGeneratedSiteCopy({
        headline: `Automate, Scale, and Monetize Your ${siteNiche}`,
        subheadline: `The all-in-one digital operating system built for modern entrepreneurs. Managed by ${activeUserName}.`,
        cta: 'Claim Your Free Growth Blueprint Now',
        features: [
          'Instant Digital Delivery & Secure Access',
          'AI-Powered Lead Follow-Up Sequences',
          'Automated Affiliate & Binary Commissions',
        ],
        faq: [
          { q: 'How does it work?', a: 'Sign up, choose your roadmap, and launch your automated storefront in minutes.' },
          { q: 'Is there a money-back guarantee?', a: 'Yes, full 14-day satisfaction guarantee on all starter masterclasses.' }
        ]
      });
      setIsGeneratingSite(false);
      setCreditsUsed(prev => prev + 150);
    }, 1200);
  };

  // Lead Finder Handlers
  const handleSearchLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCategory || !searchCity) return;
    setIsSearchingLeads(true);
    try {
      const leads = await leadGenerationEngine.executeProspectSearch(
        { category: searchCategory, city: searchCity, country: searchCountry },
        activeUserId
      );
      setDiscoveredLeads(leads);
      setCreditsUsed(prev => prev + 25);
    } catch {
      alert('Failed to search leads.');
    } finally {
      setIsSearchingLeads(false);
    }
  };

  const handleImportLead = (lead: ProspectLead) => {
    const success = leadGenerationEngine.importToCRM(lead, activeUserId, activeUserName);
    if (success) {
      setImportedLeadIds(prev => [...prev, lead.id]);
    }
  };

  const handleImportAllLeads = () => {
    let count = 0;
    discoveredLeads.forEach(lead => {
      if (!importedLeadIds.includes(lead.id)) {
        if (leadGenerationEngine.importToCRM(lead, activeUserId, activeUserName)) {
          count++;
        }
      }
    });
    setImportedLeadIds(discoveredLeads.map(l => l.id));
    alert(`Successfully imported ${count} leads directly into your CRM!`);
  };

  const handleDraftPitch = (lead: ProspectLead) => {
    setPitchLead(lead);
    const draft = leadGenerationEngine.generatePitchEmail(lead, activeUserName);
    setPitchDraft(draft);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: AI Center Header with Navigation & Credit Usage */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI Business OS Center
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">● Multi-Tenant Isolated</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">AI Business Copilot & Agents</h2>
          <p className="text-xs text-indigo-200 mt-0.5">
            Trained specifically on <span className="font-semibold text-white">{businessProfile.businessName}</span> ({activeDomain}).
          </p>
        </div>

        {/* AI Credit Usage Bar */}
        <div className="w-full md:w-72 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-indigo-200">AI Prompt Credits</span>
            <span className="text-white font-mono">{creditsUsed.toLocaleString()} / {totalCredits.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((creditsUsed / totalCredits) * 100))}%` }}
            />
          </div>
          <p className="text-[10px] text-indigo-300 mt-1.5 text-right font-medium">
            {tier.toUpperCase()} Plan Allowance
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-max overflow-x-auto">
        {[
          { id: 'copilot', label: 'Business Co-Pilot', icon: Sparkles },
          { id: 'lead-finder', label: 'AI Lead Finder (Google Maps)', icon: Target },
          { id: 'chatbot', label: 'Lead Capture Bot', icon: Bot },
          { id: 'website', label: 'AI Copywriter', icon: LayoutTemplate },
          { id: 'knowledge', label: 'Knowledge Base', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUSINESS CO-PILOT CHAT */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Eviona Business Co-Pilot</h4>
                  <p className="text-[11px] text-emerald-600 font-semibold">● Contextual AI Trained on Your Store</p>
                </div>
              </div>
              <Badge variant="purple" size="sm">GPT-4o & Claude 3.5 Sonnet</Badge>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-lg p-4 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isChatThinking && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                  <Cpu className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Co-Pilot is formulating growth strategy...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask Co-Pilot: 'Write an ad script for Facebook' or 'How do I scale binary volume?'"
                value={currentChatInput}
                onChange={(e) => setCurrentChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Business Profile Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Context Profile</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block">Business Identity</span>
                  <p className="font-bold text-slate-800">{businessProfile.businessName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block">Active Store Domain</span>
                  <p className="font-bold text-indigo-600 font-mono">{activeDomain}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block">Target Audience</span>
                  <p className="font-semibold text-slate-700">{businessProfile.targetAudience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AI LEAD FINDER (GOOGLE MAPS PROSPECTING) */}
      {activeTab === 'lead-finder' && (
        <div className="space-y-6">
          {/* Query Formulation Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>Google Maps B2B Lead Finder & Prospect Intelligence</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Search local high-intent businesses, extract contact details & social channels, and import leads directly into your CRM.
                </p>
              </div>
              <Badge variant="emerald" size="sm">● High-Speed Extraction Ready</Badge>
            </div>

            <form onSubmit={handleSearchLeads} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry / Category</label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
                >
                  {leadGenerationEngine.popularNiches.map((niche) => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Target City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Austin, London, Miami"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States"
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isSearchingLeads}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Search className={`w-3.5 h-3.5 ${isSearchingLeads ? 'animate-spin' : ''}`} />
                  <span>{isSearchingLeads ? 'Extracting...' : 'Find Leads'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Display */}
          {discoveredLeads.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Discovered Prospects ({discoveredLeads.length} Businesses Found)
                  </h4>
                  <p className="text-xs text-slate-500">Targeting {searchCategory} in {searchCity}, {searchCountry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => leadGenerationEngine.exportCSV(discoveredLeads, `${searchCity}_${searchCategory.replace(/[^a-zA-Z0-9]/g, '_')}_leads.csv`)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleImportAllLeads}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Import All to CRM</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discoveredLeads.map((lead) => {
                  const isImported = importedLeadIds.includes(lead.id);
                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs leading-snug">{lead.businessName}</h5>
                            <span className="text-[10px] text-slate-500 font-medium">{lead.category}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[10px] font-bold shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{lead.rating} ({lead.reviewCount})</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{lead.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate font-mono">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate text-indigo-600">
                            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          {lead.website && (
                            <div className="flex items-center gap-1.5 truncate text-slate-500">
                              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate hover:underline text-[10px]"
                              >
                                {lead.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleDraftPitch(lead)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>AI Pitch</span>
                        </button>

                        <button
                          onClick={() => handleImportLead(lead)}
                          disabled={isImported}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            isImported
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          {isImported ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>In CRM</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add to CRM</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Cold Outreach Draft Modal */}
          {pitchDraft && pitchLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">AI Cold Outreach Pitch</h4>
                      <p className="text-[11px] text-slate-500">Personalized for {pitchLead.businessName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setPitchDraft(null); setPitchLead(null); }}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Line</label>
                    <input
                      type="text"
                      readOnly
                      value={pitchDraft.subject}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Body</label>
                    <textarea
                      rows={10}
                      readOnly
                      value={pitchDraft.body}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${pitchDraft.subject}\n\n${pitchDraft.body}`);
                      setIsCopiedPitch(true);
                      setTimeout(() => setIsCopiedPitch(false), 2000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                  >
                    {isCopiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedPitch ? 'Copied Pitch!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LEAD CAPTURE BOT BUILDER */}
      {activeTab === 'chatbot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <h4 className="text-base font-black text-slate-900">Custom Chatbot Configuration</h4>
            <p className="text-xs text-slate-500">Deploy this bot to your landing page to automatically capture and qualify leads 24/7.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={botConfig.botName}
                  onChange={(e) => setBotConfig({ ...botConfig, botName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Welcome Greeting</label>
                <textarea
                  rows={2}
                  value={botConfig.welcomeMessage}
                  onChange={(e) => setBotConfig({ ...botConfig, welcomeMessage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Capture Trigger Question</label>
                <textarea
                  rows={2}
                  value={botConfig.leadCaptureQuestion}
                  onChange={(e) => setBotConfig({ ...botConfig, leadCaptureQuestion: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => {
                  localStorage.setItem(getUserAIKey(activeUserId, 'bot_config'), JSON.stringify(botConfig));
                  alert('Chatbot configuration saved and deployed to your live storefront!');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Save & Deploy Bot
              </button>
            </div>
          </div>

          {/* Chatbot Live Preview */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white shadow-card flex flex-col h-[460px] justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">{botConfig.botName} (Live Preview)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">● Active Widget</span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-64 pr-2 text-xs">
                {testBotMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-xs ${
                      msg.sender === 'visitor' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendBotTest} className="flex gap-2 pt-3 border-t border-white/10">
              <input
                type="text"
                placeholder="Test reply as a website visitor..."
                value={testBotInput}
                onChange={(e) => setTestBotInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white outline-none placeholder-slate-400"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs">
                Test
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: AI COPYWRITER */}
      {activeTab === 'website' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">AI High-Converting Copywriter</h3>
            <p className="text-xs text-slate-500">Generate high-converting headlines, offers, and bullet points tailored to your niche.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={siteNiche}
              onChange={(e) => setSiteNiche(e.target.value)}
              placeholder="e.g. AI Automation Agency, Fitness Coaching, Real Estate Mastery"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateSiteCopy}
              disabled={isGeneratingSite}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingSite ? 'animate-spin' : ''}`} />
              <span>{isGeneratingSite ? 'Generating Copy...' : 'Generate Copy Pack'}</span>
            </button>
          </div>

          {generatedSiteCopy && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Recommended Hero Headline</span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">{generatedSiteCopy.headline}</h4>
                <p className="text-slate-600 mt-1">{generatedSiteCopy.subheadline}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Key Value Bullets</span>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700 font-semibold">
                  {generatedSiteCopy.features.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: KNOWLEDGE BASE */}
      {activeTab === 'knowledge' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Custom Knowledge Sources</h3>
              <p className="text-xs text-slate-500">Documents and URLs indexed into your isolated AI embedding index.</p>
            </div>
            <button
              onClick={() => alert('New document upload indexer will open.')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Knowledge Source</span>
            </button>
          </div>

          <div className="space-y-3">
            {knowledgeSources.map((kb) => (
              <div key={kb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h5 className="font-bold text-slate-900">{kb.title}</h5>
                    <span className="text-[10px] text-slate-400">{kb.type} • {kb.items}</span>
                  </div>
                </div>
                <Badge variant="emerald" size="sm">● {kb.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
