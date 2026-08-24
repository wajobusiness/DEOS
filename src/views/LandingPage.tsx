import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Globe,
  ShoppingBag,
  Users,
  Bot,
  GraduationCap,
  ChevronDown,
  Lock,
  Star,
  Check,
  Smartphone,
  Layers,
  Network,
  Menu,
  X,
  Mail,
  Building2,
  Phone,
  MessageSquare,
  Shield,
  Clock,
  TrendingUp,
  Cpu,
  Share2,
  DollarSign,
  Rocket,
  ShieldCheck,
  Compass,
  Monitor,
  Laptop,
  Briefcase,
  Sliders,
  Calculator,
  UserCheck
} from 'lucide-react';
import { ViewType, PlanTier } from '../types';
import { Badge } from '../components/common/Badge';
import { AuthModal } from '../components/auth/AuthModal';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { supabase } from '../lib/supabaseClient';

interface LandingPageProps {
  onEnterApp: (view?: ViewType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { branding, theme, homepage } = usePlatformSettings();

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

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

  // Hero Fast-Register / Lead Capture State
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [sponsorCode, setSponsorCode] = useState('EVO-ID-100245');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
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

  // Auto-detect referral code from URL query parameter or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('sponsor') || params.get('aff');
      if (ref) {
        setSponsorCode(ref);
        localStorage.setItem('eviona_sponsor_code', ref);
      } else {
        const cached = localStorage.getItem('eviona_sponsor_code');
        if (cached) {
          setSponsorCode(cached);
        }
      }
    } catch {}
  }, []);

  const handleHeroLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;

    setIsSubmittingLead(true);
    try {
      if (sponsorCode) {
        localStorage.setItem('eviona_sponsor_code', sponsorCode);
      }

      // Save lead to Supabase database
      await supabase.from('Lead').insert([
        {
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          sponsor_code: sponsorCode,
          source: 'Homepage Hero Fast Register Form',
          status: 'New',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn('Lead saving notification:', err);
    } finally {
      setIsSubmittingLead(false);
      setIsLeadCaptured(true);
      setTimeout(() => {
        setAuthModalMode('register');
        setIsAuthModalOpen(true);
      }, 300);
    }
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

  const videoEmbedUrl = () => {
    const rawUrl = homepage.heroVideoUrl || 'https://youtu.be/Td8gmK7HrS4';
    let videoId = 'Td8gmK7HrS4';
    if (rawUrl.includes('youtu.be/')) {
      videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0] || 'Td8gmK7HrS4';
    } else if (rawUrl.includes('v=')) {
      videoId = rawUrl.split('v=')[1]?.split('&')[0] || 'Td8gmK7HrS4';
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-[65%] -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293706_1px,transparent_1px),linear-gradient(to_bottom,#1f293706_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER / NAVIGATION BAR (MATCHING REFERENCE DESIGN)                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#070A12]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand Area */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {branding.logoUrl || branding.lightLogoUrl ? (
              <img
                src={branding.logoUrl || branding.lightLogoUrl}
                alt={branding.platformName}
                className="h-10 w-auto rounded-xl object-contain shadow-lg"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor || '#4F46E5'}, ${theme.secondaryColor || '#9333EA'})`,
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                  {branding.platformName}
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 tracking-wider uppercase">
                {branding.tagline || 'Digital Entrepreneur Operating System'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#hero" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#academy" className="hover:text-white transition-colors">Academy</a>
            <button
              onClick={() => onEnterApp('marketplace')}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1 uppercase font-bold text-xs"
            >
              <span>Marketplace</span>
              <span className="text-[9px] bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded font-bold">Public</span>
            </button>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#success-stories" className="hover:text-white transition-colors">Success Stories</a>
          </nav>

          {/* Desktop Action Buttons (Login + Get Started) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-xs"
            >
              Login
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => openAuth('login')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800"
            >
              Login
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-slate-950/98 border-b border-slate-800 backdrop-blur-2xl px-6 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-sm font-bold uppercase tracking-wider text-slate-300">
              <a
                href="#hero"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#academy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Academy Hub
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
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#success-stories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                Success Stories
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
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="relative z-10">
        {/* ========================================================================= */}
        {/* 2. HERO SECTION (2-COLUMN OPPORTUNITY & FAST REGISTRATION CARD)            */}
        {/* ========================================================================= */}
        <section id="hero" className="pt-12 sm:pt-16 pb-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Commercial Copy & Benefits */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider shadow-inner">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>{homepage.heroBadge || 'Digital Entrepreneur Operating System'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase">
                BUILD YOUR DIGITAL <br />
                BUSINESS. EARN MORE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                  LIVE YOUR FREEDOM.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-medium">
                {homepage.heroSubtitle ||
                  'Everything you need to launch, grow and scale your online business — all in one powerful platform.'}
              </p>

              {/* 5 Benefit Bullets */}
              <div className="space-y-3 pt-2">
                {[
                  'Launch Your Personal Business Website',
                  'Get Leads & Customers',
                  'Sell & Promote Products',
                  'Learn, Automate & Grow with AI',
                  'Earn from Referrals & Build Long-Term Income',
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-indigo-300 stroke-[3]" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => openAuth('register')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <span>START YOUR DIGITAL BUSINESS TODAY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-6 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Play className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                  <span>SEE HOW IT WORKS</span>
                </a>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-400 text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="text-white font-extrabold text-xs">10,000+</p>
                    <p className="text-[10px] text-slate-400">Entrepreneurs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-white font-extrabold text-xs">All-in-One</p>
                    <p className="text-[10px] text-slate-400">Business Platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-white font-extrabold text-xs">Secure</p>
                    <p className="text-[10px] text-slate-400">& Reliable</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-white font-extrabold text-xs">24/7</p>
                    <p className="text-[10px] text-slate-400">Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Prominent Lead Gen Card & High-Tech Visual */}
            <div className="lg:col-span-5 relative">
              {/* Floating Tech Badges on visual border */}
              <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl relative overflow-hidden space-y-6">
                <div className="space-y-1.5 text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                    CREATE YOUR FREE ACCOUNT
                  </h3>
                  <p className="text-xs text-slate-400">
                    Join thousands of entrepreneurs building income & independence.
                  </p>
                </div>

                <form onSubmit={handleHeroLeadSubmit} className="space-y-3.5">
                  <div className="space-y-1 text-left">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Referral Code (Optional)
                    </label>
                    <div className="relative">
                      <Share2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Sponsor code"
                        value={sponsorCode}
                        onChange={(e) => setSponsorCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-indigo-400 placeholder-slate-500 outline-none focus:border-indigo-500 uppercase transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isSubmittingLead ? 'Setting Up...' : isLeadCaptured ? 'Entering App...' : 'GET STARTED NOW'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Secure. No Spam. Ever.</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EXPLAINER VIDEO SECTION ("ONE PLATFORM. ENDLESS POSSIBILITIES.")        */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Video Player Frame */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl bg-slate-950 border-2 border-indigo-500/40 overflow-hidden shadow-2xl shadow-indigo-500/20 aspect-video flex flex-col justify-between p-6 group">
                {isPlaying ? (
                  <>
                    <iframe
                      className="w-full h-full absolute inset-0 rounded-3xl"
                      src={videoEmbedUrl()}
                      title="Eviona Ecosystem Master Tour"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-4 right-4 z-20 px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close Player</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Video Thumbnail Background */}
                    <img
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80"
                      alt="Eviona Ecosystem Master Tour"
                      className="w-full h-full absolute inset-0 object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

                    {/* Top Bar Overlay */}
                    <div className="relative z-10 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
                          See How It Works In 2 Minutes
                        </span>
                      </div>
                      <span className="text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-500/30 text-[11px] font-mono font-bold backdrop-blur-md">
                        Eviona 4K Tour
                      </span>
                    </div>

                    {/* Center Glowing Play Button */}
                    <div
                      onClick={() => setIsPlaying(true)}
                      className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-2xl shadow-indigo-600/60 group-hover:scale-110 transition-all border-2 border-white/30"
                    >
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>

                    {/* Bottom Indicator */}
                    <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                      <span>Eviona Ecosystem Master Tour</span>
                      <span className="text-indigo-400 font-mono">02:15</span>
                    </div>
                  </>
                )}
              </div>

              <p className="text-center text-xs text-indigo-400 font-bold tracking-wide mt-3 italic">
                Press Play & See The Magic! ➔
              </p>
            </div>

            {/* Right: Feature Highlights Copy */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                  Comprehensive Infrastructure
                </h2>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
                  ONE PLATFORM. <br />
                  ENDLESS POSSIBILITIES.
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Watch this short video to see how Eviona gives you the tools, training, and opportunities to build a successful digital business from anywhere in the world.
              </p>

              {/* 2-Column Checkmark Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Build Your Brand</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Access AI Tools</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Capture Leads</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Get Trained Daily</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Automate & Nurture</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Earn from Referrals</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Sell Products</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shrink-0">
                    <Check className="w-3 h-3 text-indigo-300 stroke-[3]" />
                  </div>
                  <span>Get Paid</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. FEATURES GRID SECTION ("EVERYTHING YOU NEED TO SUCCEED ONLINE")         */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              EVERYTHING YOU NEED TO SUCCEED ONLINE
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Unified enterprise tools designed specifically for digital entrepreneurs to launch, market, and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              {
                title: 'Website Builder',
                desc: 'Create a stunning business website in minutes',
                icon: Monitor,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10',
                border: 'hover:border-indigo-500/50',
              },
              {
                title: 'CRM & Lead Management',
                desc: 'Capture, manage & convert more leads',
                icon: Users,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'hover:border-emerald-500/50',
              },
              {
                title: 'Email Marketing Automation',
                desc: 'Automate emails & follow-ups',
                icon: Mail,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'hover:border-purple-500/50',
              },
              {
                title: 'AI Business Tools',
                desc: 'Powerful AI tools to work smarter',
                icon: Cpu,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10',
                border: 'hover:border-rose-500/50',
              },
              {
                title: 'Marketplace Access',
                desc: 'Buy & sell digital and physical products',
                icon: ShoppingBag,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'hover:border-amber-500/50',
              },
              {
                title: 'Digital Academy',
                desc: 'Learn high-income skills and grow fast',
                icon: GraduationCap,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'hover:border-blue-500/50',
              },
              {
                title: 'Referral & Income System',
                desc: 'Earn commissions & build long-term income',
                icon: Share2,
                color: 'text-pink-400',
                bg: 'bg-pink-500/10',
                border: 'hover:border-pink-500/50',
              },
            ].map((feat, i) => (
              <div
                key={i}
                onClick={() => openAuth('register')}
                className={`bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.03] ${feat.border} group`}
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white leading-snug">{feat.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. MULTIPLE WAYS TO EARN STRIP                                             */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-[#0d1226] via-[#121133] to-[#1a0f2e] p-8 sm:p-12 border border-indigo-500/30 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                MULTIPLE WAYS TO EARN
              </h3>
              <p className="text-xs text-indigo-200">
                Unlock diverse revenue streams and monetize your digital skills.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  title: 'Sell Your Own Products',
                  desc: 'Launch and sell your digital or physical products.',
                  icon: ShoppingBag,
                  color: 'bg-emerald-500 text-white',
                },
                {
                  title: 'Promote & Earn Commissions',
                  desc: 'Promote products and earn attractive commissions.',
                  icon: Users,
                  color: 'bg-purple-600 text-white',
                },
                {
                  title: 'Referral Income',
                  desc: 'Invite others, build your network and earn from their activities.',
                  icon: Share2,
                  color: 'bg-amber-500 text-white',
                },
                {
                  title: 'Offer Services',
                  desc: 'Provide services and grow your business.',
                  icon: Briefcase,
                  color: 'bg-blue-600 text-white',
                },
                {
                  title: 'Build Long-Term Residual Income',
                  desc: 'Create multiple streams and earn long-term.',
                  icon: TrendingUp,
                  color: 'bg-pink-600 text-white',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shadow-md`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-bold text-white leading-snug">{item.title}</h5>
                    <p className="text-[10px] text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SOCIAL PROOF / SUCCESS STORIES (MATCHING REFERENCE DESIGN)              */}
        {/* ========================================================================= */}
        <section id="success-stories" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Community Feedback
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              SUCCESS STORIES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Daniel O.',
                role: 'Digital Marketer',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                quote: 'Eviona changed my life! I now earn consistently from my business and referrals.',
              },
              {
                name: 'Sarah A.',
                role: 'Entrepreneur',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                quote: 'The training, tools, and support are top-notch. Best decision ever!',
              },
              {
                name: 'James K.',
                role: 'Business Coach',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                quote: 'I love the all-in-one system. Everything I need is in one place.',
              },
              {
                name: 'Mercy T.',
                role: 'Student',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                quote: 'Eviona helped me build my brand and income from scratch.',
              },
            ].map((story, i) => (
              <div
                key={i}
                className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-card hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &quot;{story.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">{story.name}</h5>
                      <p className="text-[10px] text-slate-400">{story.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, sidx) => (
                      <Star key={sidx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FINAL HIGH-IMPACT CTA STRIP (ROCKET BANNER & STATS BOX)                 */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-[#0d0926] p-8 sm:p-12 border border-indigo-500/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
            {/* Left Column: Rocket Graphic */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-indigo-600/30 to-pink-600/30 border border-indigo-500/40 flex items-center justify-center shadow-2xl relative group">
                <Rocket className="w-16 h-16 text-indigo-300 animate-bounce" />
                <div className="absolute -bottom-2 w-16 h-4 bg-pink-500/30 rounded-full blur-md" />
              </div>
            </div>

            {/* Center Column: Conversion Message & CTA */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                YOUR JOURNEY TO FINANCIAL FREEDOM STARTS NOW
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
                Join thousands of digital entrepreneurs building businesses, changing lives, and creating a better future.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => openAuth('register')}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
                >
                  GET STARTED TODAY
                </button>
                <span className="text-[11px] text-slate-400">It&apos;s Free to Join. Upgrade Anytime.</span>
              </div>
            </div>

            {/* Right Column: Stats Box */}
            <div className="lg:col-span-3 bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-white font-extrabold">10,000+</p>
                  <p className="text-[10px] text-slate-400">Active Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <p className="text-white font-extrabold">50+</p>
                  <p className="text-[10px] text-slate-400">Countries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-white font-extrabold">24/7</p>
                  <p className="text-[10px] text-slate-400">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. MEMBERSHIP TIERS PRICING & BINARY CALCULATOR                           */}
        {/* ========================================================================= */}
        <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Membership Tiers
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              ONE MEMBERSHIP. UNLIMITED BUSINESS POTENTIAL.
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
                coins: '100 EVO Token',
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
                coins: '300 EVO Token',
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
                coins: '500 EVO Token',
                desc: 'Maximum infrastructure, highest limits, and VIP support.',
                features: [
                  '1 Active Landing Page + 3 Demo Templates',
                  'Subdomain + 3 Connected Custom Domains',
                  'Unlimited CRM Contacts & Pipelines',
                  '50000 Email Sends / Month (Custom Domain)',
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
                  className={`w-full py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Activate {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Binary Earnings Simulator */}
          <div className="mt-16 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                <Calculator className="w-4 h-4" />
                <span>Pure Binary Math (Compensation Engine)</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase">Interactive Earnings Simulator</h3>
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

        {/* ========================================================================= */}
        {/* 9. FAQ ACCORDION (BACK OFFICE CONTROLLED)                                   */}
        {/* ========================================================================= */}
        <section id="faq" className="py-20 px-4 max-w-4xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Common Questions
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {(homepage.faqList && homepage.faqList.length > 0
              ? homepage.faqList
              : [
                  {
                    q: 'What is the Eviona Ecosystem?',
                    a: 'Eviona Ecosystem is the complete all-in-one infrastructure uniting multi-tenant personal websites, CRM funnels, a digital marketplace, AI business tools, academy masterclasses, and an immutable 10% binary compensation network.',
                  },
                  {
                    q: 'How does the 10% Flat Binary Commission work?',
                    a: 'Under the compensation engine, you earn a flat 10% commission on your weaker-leg Business Volume (BV) every weekly settlement cycle, with all un-matched volume carried forward indefinitely.',
                  },
                ]
            ).map((faq, index) => {
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
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                      }`}
                    />
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
      </main>

      {/* ========================================================================= */}
      {/* 10. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 py-12 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-white">{branding.platformName}</span>
          <span>{branding.copyrightText || '© 2026 Eviona Ecosystem. All Rights Reserved.'}</span>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <button onClick={() => onEnterApp('marketplace')} className="hover:text-white transition-colors">
            Marketplace
          </button>
          <button onClick={() => setIsCorporateContactOpen(true)} className="hover:text-white transition-colors">
            Enterprise Contact
          </button>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href={`mailto:${branding.supportEmail}`} className="hover:text-indigo-400 transition-colors">
            {branding.supportEmail}
          </a>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* AUTH MODAL & CORPORATE CONTACT MODAL                                      */}
      {/* ========================================================================= */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        defaultSponsorCode={sponsorCode}
        initialName={leadName}
        initialEmail={leadEmail}
        initialPhone={leadPhone}
        onSuccess={() => onEnterApp('dashboard')}
      />

      {isCorporateContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsCorporateContactOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Corporate Inquiries & Sales</h3>
              <p className="text-xs text-slate-400">
                Contact our institutional team for custom white-label solutions, corporate partnerships, and enterprise tier deployments.
              </p>
            </div>

            {corpSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-slate-300">
                  Our enterprise leadership team will reach out to <b>{corpEmail}</b> within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCorporateSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={corpName}
                    onChange={(e) => setCorpName(e.target.value)}
                    placeholder="Executive Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    value={corpEmail}
                    onChange={(e) => setCorpEmail(e.target.value)}
                    placeholder="executive@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={corpCompany}
                    onChange={(e) => setCorpCompany(e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Inquiry Type</label>
                  <select
                    value={corpInquiryType}
                    onChange={(e) => setCorpInquiryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Request a Demo">Request Enterprise Demo</option>
                    <option value="White-Label Solution">White-Label Deployment (Book 7)</option>
                    <option value="Institutional Partnership">Institutional Partnership</option>
                    <option value="Bulk Tier Licensing">Bulk Tier Licensing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Corporate Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
