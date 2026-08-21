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
  Network
} from 'lucide-react';
import { ViewType, PlanTier } from '../types';
import { Badge } from '../components/common/Badge';

interface LandingPageProps {
  onEnterApp: (view?: ViewType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
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
  // Direct bonus average ($75 Growth tier assumption) = directReferralsCount * 75
  // Binary commission = 10% on weaker leg BV = teamMonthlyBV * 0.10
  // Generation bonus average = ~30% of direct bonuses = directBonus * 0.30
  const estimatedDirectBonus = directReferralsCount * 75;
  const estimatedBinaryBonus = Number((teamMonthlyBV * 0.10).toFixed(0));
  const estimatedGenBonus = Number((estimatedDirectBonus * 0.30).toFixed(0));
  const totalProjectedMonthly = estimatedDirectBonus + estimatedBinaryBonus + estimatedGenBonus;

  const handleHeroLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setIsLeadCaptured(true);
    setTimeout(() => {
      onEnterApp('onboarding');
    }, 800);
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
      {/* Dynamic Background Glows & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-[70%] -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Top Universal Navbar */}
      <header className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => onEnterApp('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight">DEOS</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Global Platform
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                Digital Entrepreneurship OS
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#video-explainer" className="hover:text-white transition-colors">Overview</a>
            <button
              onClick={() => onEnterApp('marketplace')}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Public Marketplace</span>
            </button>
            <a href="#economics" className="hover:text-white transition-colors">Compensation & BV</a>
            <a href="#simulator" className="hover:text-white transition-colors">Earnings Simulator</a>
            <a href="#social-proof" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              Member Login
            </button>
            <button
              onClick={() => onEnterApp('onboarding')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10">
        {/* HERO SECTION WITH LEAD CAPTURE & VIDEO EXPLAINER */}
        <section className="pt-12 sm:pt-20 pb-16 px-4 max-w-7xl mx-auto text-center space-y-8">
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

          {/* HERO LEAD CAPTURE FORM (Prioritizing Lead & Sponsor Attribution) */}
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

          {/* ABOVE-THE-FOLD PROMINENT PLATFORM EXPLAINER VIDEO */}
          <div id="video-explainer" className="pt-6 max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-slate-950 border-2 border-indigo-500/40 overflow-hidden shadow-2xl shadow-indigo-500/10 aspect-video flex flex-col justify-between p-6 group">
              {/* Video Header Overlay */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                    DEOS Platform Master Tour (03:45)
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-mono">4K Ultra HD</span>
              </div>

              {/* Center Play Button Overlay */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-2xl shadow-indigo-600/60 group-hover:scale-110 transition-all border border-indigo-400/40"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white ml-1" />}
              </div>

              {/* Video Bottom Scrub Bar & Chapters */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Chapter: 02. Personal Website & Domain Automation</span>
                  <span>01:18 / 03:45</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 FOUNDATIONAL PILLARS OF DEOS (Replacing generic pricing) */}
        <section className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Everything You Need in One Unified Stack</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              6 Built-In Engines. Zero Third-Party Integrations Needed.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              DEOS replaces 8 disparate software subscriptions with one cohesive operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Multi-Tenant Personal Website',
                desc: 'Auto-provisioned personal website (username.deos.com) with custom domain DNS, free TLS 1.3 SSL, and embedded recruiting forms.',
                icon: Globe,
                badge: 'Book 6 Engine',
              },
              {
                title: 'Public Digital Marketplace',
                desc: 'Earn up to 60% instant commissions promoting premium courses, templates, and software with guest checkout and 3% upline overrides.',
                icon: ShoppingBag,
                badge: 'Book 5 Engine',
              },
              {
                title: '10% Flat Binary MLM Engine',
                desc: 'Fair, transparent, mathematical compensation paying 10% on weaker leg volume with carry-forward, direct bonuses & 30%/15% generation rewards.',
                icon: Network,
                badge: 'Book 4 Engine',
              },
              {
                title: 'CRM Funnel & Lead Capture',
                desc: 'Automated 5-stage deal pipeline with permanent immutable source attribution from your website forms directly into your CRM.',
                icon: Users,
                badge: 'Book 7 Engine',
              },
              {
                title: 'AI Business Center',
                desc: 'Integrated AI studio for high-converting marketing copywriting, social media calendar scheduling, image generation, and disclosures.',
                icon: Bot,
                badge: 'Book 9 Engine',
              },
              {
                title: 'Digital Entrepreneur Academy',
                desc: 'World-class entrepreneurship masterclasses, live webinar broadcast rooms, verified blockchain certificates, and community masterminds.',
                icon: GraduationCap,
                badge: 'Book 8 Engine',
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-card group space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="purple" size="sm">{p.badge}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{p.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* LIVE FEATURED MARKETPLACE PRODUCTS (Book 5 §4a v1.3 Requirement) */}
        <section className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Public Commerce Storefront (Book 5 §4a)</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                Live Featured Marketplace Products
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Browse and buy real digital courses, templates, and AI tools with zero registration needed.
              </p>
            </div>

            <button
              onClick={() => onEnterApp('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'prod-1',
                title: 'High-Ticket Agency Funnel Blueprint',
                category: 'Marketing & Funnels',
                price: 49.00,
                rating: 4.9,
                seller: 'Marcus Vance',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
                badge: 'Best Seller',
                commRate: '40%',
              },
              {
                id: 'prod-2',
                title: 'AI Copywriting Master Prompts Studio',
                category: 'AI Tools',
                price: 29.00,
                rating: 4.8,
                seller: 'Elena Rostova',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
                badge: 'Hot',
                commRate: '50%',
              },
              {
                id: 'prod-3',
                title: 'Full-Stack SaaS Website Theme',
                category: 'Website Templates',
                price: 79.00,
                rating: 5.0,
                seller: 'David K.',
                image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80',
                badge: 'Top Rated',
                commRate: '35%',
              },
              {
                id: 'prod-4',
                title: 'Digital Entrepreneurship Masterclass',
                category: 'Digital Courses',
                price: 99.00,
                rating: 4.9,
                seller: 'Sarah Jenkins',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
                badge: 'Featured',
                commRate: '60%',
              },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => onEnterApp('marketplace')}
                className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-indigo-500/50 shadow-card overflow-hidden transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold shadow-md">
                      {p.badge}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>By {p.seller}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {p.rating}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {p.title}
                    </h4>

                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Sparkles className="w-3 h-3" />
                        {p.commRate} Affiliate Commission
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Price</span>
                    <p className="text-sm font-black text-white">{p.price.toFixed(2)} DEOS <span className="text-[10px] text-slate-400 font-normal">(${p.price.toFixed(2)})</span></p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnterApp('marketplace');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Buy Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPENSATION PLAN & VISUAL INFOGRAPHIC ECONOMICS */}
        <section id="economics" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Mathematical Transparency</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              The DEOS Compensation Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Governed strictly by Book 0 Constitution and Book 4. No arbitrary flushings. Guaranteed 10% binary payout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Infographic 1: 10% Binary Bonus */}
            <div className="bg-slate-900/80 rounded-3xl p-6 border border-indigo-500/30 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-white">10%</span>
                <h4 className="text-sm font-bold text-indigo-300 mt-1">Flat Binary Volume Commission</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn 10% of total weaker-leg Business Volume (BV) weekly. Unused stronger-leg volume carries forward forever.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-400">
                10,000 BV = $1,000.00 DEOS
              </div>
            </div>

            {/* Infographic 2: Direct Referral Bonuses */}
            <div className="bg-slate-900/80 rounded-3xl p-6 border border-purple-500/30 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-white">$25–$125</span>
                <h4 className="text-sm font-bold text-purple-300 mt-1">Instant Direct Referral Bonus</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paid immediately upon member registration: $25 for Launch, $75 for Growth, and $125 for Legacy memberships.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-purple-300">
                Credited instantly to wallet
              </div>
            </div>

            {/* Infographic 3: Generation Waterfall */}
            <div className="bg-slate-900/80 rounded-3xl p-6 border border-blue-500/30 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-white">30% / 15%</span>
                <h4 className="text-sm font-bold text-blue-300 mt-1">Generation 2 & 3 Rewards</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn 30% of direct bonuses earned by Gen 2 referrals, and 15% on Gen 3 referrals across your entire sponsorship tree.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-blue-300">
                Multi-tier residual cascade
              </div>
            </div>

            {/* Infographic 4: Marketplace Upline Override */}
            <div className="bg-slate-900/80 rounded-3xl p-6 border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-white">3%</span>
                <h4 className="text-sm font-bold text-emerald-300 mt-1">Marketplace Upline Override</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn 3% override on all promoter commission pools generated by your downline on the public marketplace.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-400">
                Commerce-backed cashflow
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE EARNINGS SIMULATOR */}
        <section id="simulator" className="py-20 px-4 max-w-5xl mx-auto border-t border-slate-800/80">
          <div className="bg-gradient-to-tr from-slate-900 via-[#0B0F19] to-indigo-950 p-8 sm:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Interactive Earnings Simulator</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Project Your Monthly Residual Cashflow
              </h3>
              <p className="text-xs text-slate-400">
                Adjust team size and Business Volume to simulate potential monthly earnings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Monthly Direct Referrals</span>
                    <span className="text-indigo-400 font-mono text-sm">{directReferralsCount} Partners</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={directReferralsCount}
                    onChange={(e) => setDirectReferralsCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1</span>
                    <span>15</span>
                    <span>30</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Monthly Weaker-Leg Business Volume (BV)</span>
                    <span className="text-emerald-400 font-mono text-sm">{teamMonthlyBV.toLocaleString()} BV</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="150000"
                    step="1000"
                    value={teamMonthlyBV}
                    onChange={(e) => setTeamMonthlyBV(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>2,000 BV</span>
                    <span>75,000 BV</span>
                    <span>150,000 BV</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Direct Bonuses ($75 avg):</span>
                    <span className="font-bold text-white">${estimatedDirectBonus.toLocaleString()} DEOS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">10% Binary Commissions:</span>
                    <span className="font-bold text-indigo-400">${estimatedBinaryBonus.toLocaleString()} DEOS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Generation 2 & 3 Cascade:</span>
                    <span className="font-bold text-purple-400">${estimatedGenBonus.toLocaleString()} DEOS</span>
                  </div>
                </div>
              </div>

              {/* Total Output Card (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950 p-6 rounded-3xl border border-indigo-500/40 text-center space-y-4">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Projected Monthly Earnings</p>
                <div className="space-y-1">
                  <h4 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300 font-mono">
                    ${totalProjectedMonthly.toLocaleString()}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">USD / DEOS Coin per Month</p>
                </div>

                <button
                  onClick={() => onEnterApp('onboarding')}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Building Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF & VERIFIED USER TESTIMONIALS */}
        <section id="social-proof" className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
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
            <div className="pt-2">
              <button
                onClick={() => onEnterApp('onboarding')}
                className="px-10 py-4 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-black text-sm shadow-2xl hover:scale-105 transition-all"
              >
                Claim Your Free System Now
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
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400">Compliance & Law</a>
        </div>
      </footer>
    </div>
  );
};
