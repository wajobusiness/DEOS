import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  Globe,
  ShoppingBag,
  Users,
  Bot,
  GraduationCap,
  ChevronDown,
  Lock,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Award,
  Zap,
  Calculator,
  Star,
  Check,
  Smartphone,
  Layers,
  BarChart3,
  Network,
  Menu,
  X,
  Mail,
  Building2,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ViewType, PlanTier } from '../types';
import { Badge } from '../components/common/Badge';
import { AuthModal } from '../components/auth/AuthModal';

interface LandingPageProps {
  onEnterApp: (view?: ViewType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Corporate Contact Modal state
  const [isCorporateContactOpen, setIsCorporateContactOpen] = useState(false);
  const [corpName, setCorpName] = useState('');
  const [corpEmail, setCorpEmail] = useState('');
  const [corpCompany, setCorpCompany] = useState('');
  const [corpInquiryType, setCorpInquiryType] = useState('Request a Demo');
  const [corpSubmitted, setCorpSubmitted] = useState(false);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);

  // Lead capture state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [sponsorCode, setSponsorCode] = useState('DEOS100245');
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  // Interactive Compensation Simulator Sliders
  const [directReferralsCount, setDirectReferralsCount] = useState<number>(8);
  const [teamMonthlyBV, setTeamMonthlyBV] = useState<number>(35000);

  // FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Mathematical Simulator Calculation (Book 4 Compensation Engine)
  const estimatedDirectBonus = directReferralsCount * 75;
  const estimatedBinaryBonus = Number((teamMonthlyBV * 0.10).toFixed(0));
  const estimatedGenBonus = Number((estimatedDirectBonus * 0.30).toFixed(0));
  const totalProjectedMonthly = estimatedDirectBonus + estimatedBinaryBonus + estimatedGenBonus;

  const handleHeroLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setIsLeadCaptured(true);
    setTimeout(() => {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
    }, 600);
  };

  const handleCorporateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corpEmail) return;
    setCorpSubmitted(true);
    setTimeout(() => {
      setCorpSubmitted(false);
      setIsCorporateContactOpen(false);
      setCorpName('');
      setCorpEmail('');
      setCorpCompany('');
    }, 1500);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const faqs = [
    {
      q: 'What is the DEOS Platform?',
      a: 'DEOS (Digital Entrepreneurship Operating System) is the complete all-in-one infrastructure uniting multi-tenant personal websites, CRM funnels, a digital marketplace, AI business tools, academy masterclasses, and an immutable 10% binary compensation network.',
    },
    {
      q: 'How does the 10% Flat Binary Commission work?',
      a: 'Under Book 4 §7, you earn a flat 10% commission on your weaker-leg Business Volume (BV) every weekly settlement cycle, with all un-matched volume carried forward indefinitely. No arbitrary flushing or structural penalizations.',
    },
    {
      q: 'Can non-members buy from the Marketplace?',
      a: 'Yes! The DEOS Marketplace is open to public traffic. Any customer can purchase digital goods or services via guest checkout, with promoter commissions and 3% upline overrides automatically routed to referring members.',
    },
    {
      q: 'What is DEOS Coin (Model A)?',
      a: 'DEOS Coin is an internal fixed-value utility credit ($1.00 USD = 1.00 DEOS Coin) used for seamless internal platform purchases, seller settlements, and instant peer-to-peer transfers with zero gas volatility.',
    },
    {
      q: 'Do I get a website and domain when I register?',
      a: 'Yes. Upon account creation, your personalized website (username.deos.com) is provisioned instantly, along with DNS configuration tools to connect your custom domain with free automatic SSL.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden">
      {/* Auth Modal Integration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          onEnterApp('dashboard');
        }}
        defaultSponsorCode={sponsorCode}
      />

      {/* Corporate Contact Modal */}
      {isCorporateContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
            <button
              onClick={() => setIsCorporateContactOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Corporate Inquiries (Book 7)
              </span>
              <h3 className="text-xl font-bold text-white">Contact DEOS Corporate Sales</h3>
              <p className="text-xs text-slate-400">
                Inquire about enterprise partnerships, group onboarding, or request a custom executive demonstration.
              </p>
            </div>

            {corpSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400 mb-1" />
                <p className="font-bold text-sm">Thank You!</p>
                <p>Your corporate inquiry has been assigned to our enterprise sales team.</p>
              </div>
            ) : (
              <form onSubmit={handleCorporateSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Wright"
                    value={corpName}
                    onChange={(e) => setCorpName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Business Email</label>
                    <input
                      type="email"
                      required
                      placeholder="marcus@enterprise.com"
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Apex Global Group"
                      value={corpCompany}
                      onChange={(e) => setCorpCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Inquiry Type</label>
                  <select
                    value={corpInquiryType}
                    onChange={(e) => setCorpInquiryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium outline-none focus:border-indigo-500"
                  >
                    <option value="Request a Demo">Request an Executive Demo</option>
                    <option value="Enterprise Team License">Enterprise Team Licensing</option>
                    <option value="Partnership Request">Strategic Partnership Request</option>
                    <option value="General Inquiries">General Corporate Inquiry</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all mt-2"
                >
                  Submit Corporate Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Background Glows & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-[70%] -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* TOP HEADER: Modern SaaS Navigation Standard */}
      <header className="sticky top-0 z-40 bg-[#070A12]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand Area */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight">DEOS</span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                Digital Entrepreneurship OS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#hero" className="hover:text-white transition-colors">Home</a>
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <button
              onClick={() => onEnterApp('marketplace')}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <span>Marketplace</span>
              <span className="text-[9px] bg-indigo-600/30 text-indigo-300 px-1.5 py-0.2 rounded font-bold">Public</span>
            </button>
            <a href="#academy" className="hover:text-white transition-colors">Academy</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <button
              onClick={() => setIsCorporateContactOpen(true)}
              className="hover:text-white transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => openAuth('login')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800"
            >
              Login
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-2xl px-6 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
              <a
                href="#hero"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#platform"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Platform Architecture
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onEnterApp('marketplace');
                }}
                className="py-1 text-left hover:text-indigo-400 transition-colors flex items-center justify-between"
              >
                <span>Marketplace</span>
                <span className="text-[10px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded font-bold">Public Store</span>
              </button>
              <a
                href="#academy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Academy
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Membership Pricing
              </a>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                About DEOS
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCorporateContactOpen(true);
                }}
                className="py-1 text-left hover:text-white transition-colors"
              >
                Corporate Contact & Sales
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-900 flex flex-col gap-2.5">
              <button
                onClick={() => openAuth('register')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* HERO SECTION WITH LEAD CAPTURE & VIDEO EXPLAINER */}
        <section id="hero" className="pt-12 sm:pt-20 pb-16 px-4 max-w-7xl mx-auto text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>The Operating System for Modern Digital Entrepreneurs</span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Build Your Digital Empire. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Automate Income. Scale Globally.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Launch your automated business website, tap into high-yielding digital products,
              capture CRM leads, and build passive residual wealth through an immutable 10% binary network.
            </p>
          </div>

          {/* HERO LEAD CAPTURE FORM */}
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md">
            <form onSubmit={handleHeroLeadSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-1/2 flex items-center px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <span className="text-slate-500 mr-2 text-[10px]">Sponsor:</span>
                  <span className="text-indigo-400 font-bold">{sponsorCode}</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-1/2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <span>{isLeadCaptured ? 'Redirecting...' : 'Claim Free Website & OS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                ⚡ Instant access to free subdomain, CRM pipeline, and marketplace promoter dashboard.
              </p>
            </form>
          </div>

          {/* VIDEO EXPLAINER */}
          <div id="video-explainer" className="pt-6 max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-slate-950 border-2 border-indigo-500/40 overflow-hidden shadow-2xl shadow-indigo-500/10 aspect-video flex flex-col justify-between p-6 group">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                    DEOS Platform Master Tour (03:45)
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-mono">4K Ultra HD</span>
              </div>

              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-2xl shadow-indigo-600/60 group-hover:scale-110 transition-all border border-indigo-400/40"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white ml-1" />}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Chapter: 02. Personal Landing Page & Domain Automation</span>
                  <span>01:18 / 03:45</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: 6 CORE PLATFORM PILLARS */}
        <section id="platform" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">All-In-One Infrastructure</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Everything You Need to Run a Digital Business
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              No third-party plugin bloat or disconnected software. One unified SaaS architecture handles your website, CRM, marketplace, AI, and team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'Dynamic Landing Page & CNAME DNS',
                desc: '1-click deployment on your free subdomain or custom domain with automated Let\'s Encrypt SSL certificates.',
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10'
              },
              {
                icon: ShoppingBag,
                title: 'Public Digital Marketplace',
                desc: 'Earn 10%–60% promoter commissions on software, courses, and digital products with Guest Checkout.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10'
              },
              {
                icon: Users,
                title: 'Isolated Multi-Tenant CRM',
                desc: 'Capture leads with immutable source attribution and execute automated multi-step email marketing sequences.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
              },
              {
                icon: Bot,
                title: 'AI Business Center',
                desc: 'Generate viral video scripts, social calendars, sales email copy, and marketing assets in seconds.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
              },
              {
                icon: GraduationCap,
                title: 'Digital Entrepreneur Academy',
                desc: 'Structured video masterclasses, verified completion certificates, and live webinar broadcast rooms.',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10'
              },
              {
                icon: Network,
                title: '10% Flat Binary Network Engine',
                desc: 'Pure mathematical compensation: 10% on weaker-leg volume, carry-forward rollover, and 30%/15% generation bonuses.',
                color: 'text-pink-400',
                bg: 'bg-pink-500/10'
              }
            ].map((p, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-card group"
              >
                <div className={`w-12 h-12 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: COMPENSATION SIMULATOR */}
        <section id="simulator" className="py-20 px-4 max-w-5xl mx-auto border-t border-slate-800/80">
          <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                <Calculator className="w-4 h-4" />
                <span>Pure Binary Math (Book 4)</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">Interactive Earnings Simulator</h3>
              <p className="text-xs text-slate-400">Calculate projected monthly income based on direct referrals and weaker-leg volume.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Direct Active Referrals</span>
                    <span className="text-indigo-400 font-mono text-sm">{directReferralsCount} Partners</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={directReferralsCount}
                    onChange={(e) => setDirectReferralsCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>2 Partners</span>
                    <span>50 Partners</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Monthly Weaker-Leg Volume (BV)</span>
                    <span className="text-indigo-400 font-mono text-sm">{teamMonthlyBV.toLocaleString()} BV</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={teamMonthlyBV}
                    onChange={(e) => setTeamMonthlyBV(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1,000 BV</span>
                    <span>100,000 BV</span>
                  </div>
                </div>
              </div>

              {/* Earnings Result Card */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400">Projected Monthly Earnings</span>
                <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  ${totalProjectedMonthly.toLocaleString()} / mo
                </h4>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Direct Referral Bonuses:</span>
                    <span className="font-bold text-white">${estimatedDirectBonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>10% Binary Commissions:</span>
                    <span className="font-bold text-white">${estimatedBinaryBonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Generation Waterfall Bonus:</span>
                    <span className="font-bold text-white">${estimatedGenBonus.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: MEMBERSHIP PRICING */}
        <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Membership Tiers</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              One Membership. Unlimited Business Potential.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              All plans include 1 Active Business Landing Page, 3 Curated Demo Templates, CRM, and Marketplace access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Launch Tier',
                price: '$100',
                coins: '100 DEOS Coin',
                desc: 'Perfect for new entrepreneurs getting started online.',
                features: [
                  '1 Active Landing Page + 3 Demo Templates',
                  'Free Subdomain + Custom Domain DNS',
                  '500 CRM Contacts + 1 Pipeline',
                  '1,000 Email Sends / Month',
                  '50 AI Business Credits / Month',
                  '$25 Direct Bonus / $1,000 Wkly Cap',
                ],
                popular: false,
              },
              {
                name: 'Growth Tier',
                price: '$300',
                coins: '300 DEOS Coin',
                desc: 'The complete scaling system for serious business builders.',
                features: [
                  '1 Active Landing Page + 3 Demo Templates',
                  'Subdomain + 1 Free Custom Domain Voucher',
                  '5,000 CRM Contacts + 3 Pipelines',
                  '10,000 Email Sends / Month (Sequences)',
                  '250 AI Business Credits / Month',
                  '$75 Direct Bonus / $5,000 Wkly Cap',
                ],
                popular: true,
              },
              {
                name: 'Legacy Tier',
                price: '$500',
                coins: '500 DEOS Coin',
                desc: 'Maximum infrastructure, highest limits, and VIP support.',
                features: [
                  '1 Active Landing Page + 3 Demo Templates',
                  'Subdomain + 3 Connected Custom Domains',
                  'Unlimited CRM Contacts & Pipelines',
                  '50,000 Email Sends / Month (Custom Domain)',
                  '1,000 AI Business Credits / Month',
                  '$125 Direct Bonus / $25,000 Wkly Cap',
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 space-y-6 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105'
                    : 'bg-slate-900/60 border border-slate-800 shadow-card'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                    {plan.popular && (
                      <Badge variant="purple" size="sm">Most Popular</Badge>
                    )}
                  </div>
                  <div>
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400 ml-1.5 font-medium">one-time</span>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">{plan.coins}</p>
                  </div>
                  <p className="text-xs text-slate-400">{plan.desc}</p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openAuth('register')}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Activate {plan.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: TESTIMONIALS */}
        <section id="about" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Proven Results</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Trusted by 50,000+ Entrepreneurs Worldwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Digital Agency Founder',
                country: 'United Kingdom',
                earnings: '$24,560 Monthly',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                quote: 'DEOS replaced four different tool subscriptions on day one. Having the website builder automatically linked to the CRM and 10% binary network is revolutionary.',
              },
              {
                name: 'Dr. Marcus Vance',
                role: 'Academy Instructor & Top Leader',
                country: 'South Africa',
                earnings: '$48,200 Monthly',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                quote: 'The 10% flat binary calculation with carry forward is the fairest math in the industry. Our entire leadership organization migrated to DEOS with zero friction.',
              },
              {
                name: 'Elena Rostova',
                role: 'Marketplace Seller & Course Creator',
                country: 'Canada',
                earnings: '$18,900 Monthly',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                quote: 'Selling my digital templates on the DEOS public marketplace allowed promoters to drive thousands of guest checkout sales while I get paid instantly in DEOS Coin.',
              },
            ].map((t, i) => (
              <div key={i} className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-card">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40" />
                    <div>
                      <h5 className="text-xs font-bold text-white">{t.name}</h5>
                      <p className="text-[10px] text-slate-400">{t.role} • {t.country}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">{t.earnings}</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 px-4 max-w-4xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Common Questions</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-indigo-400"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA STRIP */}
        <section className="py-20 px-4 max-w-5xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-tr from-indigo-950 via-indigo-900 to-purple-950 p-8 sm:p-14 border border-indigo-500/40 shadow-2xl relative overflow-hidden space-y-6">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Launch Your Automated Business?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Join thousands of digital entrepreneurs scaling their brand, team, and income on the DEOS global operating system.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openAuth('register')}
                className="px-10 py-4 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-black text-sm shadow-2xl hover:scale-105 transition-all"
              >
                Claim Your Free System Now
              </button>
              <button
                onClick={() => setIsCorporateContactOpen(true)}
                className="px-8 py-4 rounded-2xl bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 font-bold text-sm border border-indigo-500/30 transition-all"
              >
                Contact Corporate Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-10 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-slate-400">DEOS Platform</span>
          <span>© 2026 DEOS Platform. All Rights Reserved.</span>
        </div>
        <div className="flex gap-6">
          <button onClick={() => onEnterApp('marketplace')} className="hover:text-slate-400">Marketplace</button>
          <button onClick={() => setIsCorporateContactOpen(true)} className="hover:text-slate-400">Enterprise Contact</button>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};
