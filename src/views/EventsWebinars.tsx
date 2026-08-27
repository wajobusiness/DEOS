import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Video,
  Users,
  DollarSign,
  Plus,
  Play,
  Clock,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  X,
  Ticket,
  Bot,
  Globe,
  Radio,
  Tv,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  Tag,
  AlertCircle,
  Eye,
  Send,
  MessageSquare,
  Crown,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Trash2,
  Settings,
  BarChart2,
  TrendingUp,
  ThumbsUp,
  HelpCircle,
  Heart,
  Flame,
  Rocket,
  Lightbulb,
  ShoppingBag
} from 'lucide-react';
import {
  EventItem,
  EventTicket,
  EventSpeaker,
  EventAgendaItem,
  WebinarType,
  DynamicCTA,
  WebinarChatMessage,
  WebinarPoll,
  WebinarQuestion,
  Member
} from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { eventsEngine } from '../engine/eventsEngine';
import { useWallet } from '../context/WalletContext';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { launchPaystackPopup } from '../lib/paystackHelper';

interface EventsWebinarsProps {
  currentUser?: Member;
}

export const EventsWebinars: React.FC<EventsWebinarsProps> = ({ currentUser }) => {
  const { member } = useAuth();
  const { walletBalance, processPurchase } = useWallet();
  const { gateways } = usePlatformSettings();

  const activeUser = currentUser || member || {
    id: '',
    memberCode: '',
    name: 'Member',
    email: '',
  };

  const [events, setEvents] = useState<EventItem[]>(() => eventsEngine.getEvents('All'));
  const [activeTab, setActiveTab] = useState<'explore' | 'live_room' | 'ai_creator' | 'affiliate_funnels' | 'analytics' | 'my_tickets'>('explore');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Selected States
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);
  const [activeRoomEvent, setActiveRoomEvent] = useState<EventItem | null>(() => events.find(e => e.status === 'Live') || events[0] || null);
  const [generatedTicket, setGeneratedTicket] = useState<EventTicket | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [eventPaymentMethod, setEventPaymentMethod] = useState<'wallet' | 'card' | 'usdt'>('wallet');

  // Registration Form State
  const [regName, setRegName] = useState(activeUser.name || '');
  const [regEmail, setRegEmail] = useState(activeUser.email || '');
  const [regPhone, setRegPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // My Tickets State
  const [userTickets, setUserTickets] = useState<EventTicket[]>(() =>
    eventsEngine.getUserTickets(activeUser.email)
  );

  // Live Room State
  const [chatMessages, setChatMessages] = useState<WebinarChatMessage[]>([]);
  const [currentChatInput, setCurrentChatInput] = useState('');
  const [polls, setPolls] = useState<WebinarPoll[]>([]);
  const [questions, setQuestions] = useState<WebinarQuestion[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [activeCTA, setActiveCTA] = useState<DynamicCTA | null>(null);
  const [roomViewMode, setRoomViewMode] = useState<'chat' | 'qa' | 'polls'>('chat');
  const [emojiReactions, setEmojiReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const [isHostControlActive, setIsHostControlActive] = useState(false);

  // AI Funnel Creator Form State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [creatorTopic, setCreatorTopic] = useState('AI Client Acquisition & Lead Funnels');
  const [creatorNiche, setCreatorNiche] = useState('Digital Agency & SaaS');
  const [creatorType, setCreatorType] = useState<WebinarType>('masterclass');
  const [creatorPrice, setCreatorPrice] = useState('0');
  const [creatorDate, setCreatorDate] = useState('2025-07-15');
  const [creatorTime, setCreatorTime] = useState('02:00 PM EST');
  const [creatorVideoUrl, setCreatorVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [isGeneratingSuite, setIsGeneratingSuite] = useState(false);
  const [generatedSuite, setGeneratedSuite] = useState<any>(null);

  // Affiliate Funnel Link State
  const [selectedAffiliateProduct, setSelectedAffiliateProduct] = useState({
    id: 'PRD-MKT-01',
    name: 'AI Prompts Mastery Kit & SaaS Funnel Pack',
    price: 49.00,
    commissionRate: 50,
  });
  const [affiliateFunnelGenerated, setAffiliateFunnelGenerated] = useState(false);

  const refreshEvents = () => {
    const list = eventsEngine.getEvents('All');
    setEvents(list);
    setUserTickets(eventsEngine.getUserTickets(activeUser.email));
    if (!activeRoomEvent && list.length > 0) {
      setActiveRoomEvent(list[0]);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, [activeUser.email, activeUser.id]);

  // Load Live Room Data when Active Room Event Changes
  useEffect(() => {
    if (activeRoomEvent) {
      setChatMessages(eventsEngine.getWebinarChat(activeRoomEvent.id));
      setPolls(eventsEngine.getWebinarPolls(activeRoomEvent.id));
      setQuestions(eventsEngine.getWebinarQA(activeRoomEvent.id));
      if (activeRoomEvent.dynamicCTAs && activeRoomEvent.dynamicCTAs.length > 0) {
        setActiveCTA(activeRoomEvent.dynamicCTAs[0]);
      } else {
        setActiveCTA(null);
      }
      eventsEngine.recordInteraction(activeRoomEvent.id, 'view');
    }
  }, [activeRoomEvent]);

  // Send Chat Message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim() || !activeRoomEvent) return;
    const updated = eventsEngine.sendChatMessage(
      activeRoomEvent.id,
      activeUser.name || 'Member',
      currentChatInput,
      'attendee'
    );
    setChatMessages(updated);
    setCurrentChatInput('');
  };

  // Submit Poll Vote
  const handleVotePoll = (pollId: string, optionId: string) => {
    if (!activeRoomEvent) return;
    const updated = eventsEngine.votePoll(activeRoomEvent.id, pollId, optionId);
    setPolls(updated);
  };

  // Ask Question
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim() || !activeRoomEvent) return;
    const updated = eventsEngine.askQuestion(activeRoomEvent.id, activeUser.name || 'Member', newQuestionInput);
    setQuestions(updated);
    setNewQuestionInput('');
  };

  // Upvote Question
  const handleUpvoteQuestion = (qId: string) => {
    if (!activeRoomEvent) return;
    const updated = eventsEngine.upvoteQuestion(activeRoomEvent.id, qId);
    setQuestions(updated);
  };

  // Trigger Emoji Reaction
  const handleTriggerReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: 10 + Math.random() * 80,
    };
    setEmojiReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setEmojiReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  // 1-Click Registration / Ticket Purchase Execution
  const handleCompleteRegistration = async (paymentMethod: 'wallet' | 'card' | 'usdt' | 'free') => {
    if (!selectedEventForRegister || !regName || !regEmail) return;
    setIsRegistering(true);

    try {
      const isPaid = Boolean(selectedEventForRegister.isPaid && (selectedEventForRegister.ticketPrice || 0) > 0);
      const cost = selectedEventForRegister.ticketPrice || 0;

      if (isPaid && paymentMethod === 'wallet') {
        const res = processPurchase(cost, `Ticket: ${selectedEventForRegister.title}`);
        if (!res.success) {
          alert(res.error || 'Insufficient wallet balance. Please select online card or deposit funds.');
          setIsRegistering(false);
          return;
        }
      }

      if (isPaid && paymentMethod === 'card') {
        const tktRef = `TKT-PSTK-${Date.now().toString().slice(-6)}`;
        const launched = await launchPaystackPopup({
          publicKey: gateways.paystack?.publicKey,
          email: regEmail,
          amountUSD: cost,
          ngnExchangeRate: gateways.paystack?.ngnExchangeRate || 1550,
          customerName: regName || 'Attendee',
          reference: tktRef,
          metadata: {
            eventId: selectedEventForRegister.id,
            eventTitle: selectedEventForRegister.title,
            type: 'webinar_ticket_pass',
          },
          onSuccess: async () => {
            const regResult = await eventsEngine.registerAttendee({
              eventId: selectedEventForRegister.id,
              attendeeName: regName,
              attendeeEmail: regEmail,
              attendeePhone: regPhone,
              paymentMethod: 'card',
            });
            setGeneratedTicket(regResult.ticket);
            refreshEvents();
            alert(`🎉 Payment & Registration confirmed! Your ticket pass is ready.`);
            setIsRegistering(false);
          },
          onClose: () => {
            setIsRegistering(false);
          }
        });

        if (launched) return;
      }

      const regResult = await eventsEngine.registerAttendee({
        eventId: selectedEventForRegister.id,
        attendeeName: regName,
        attendeeEmail: regEmail,
        attendeePhone: regPhone,
        paymentMethod: paymentMethod === 'usdt' ? 'card' : paymentMethod,
      });

      setGeneratedTicket(regResult.ticket);
      refreshEvents();
      alert(`🎉 Registration confirmed! Your ticket pass is ready.`);
    } catch (err: any) {
      alert(err.message || 'Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  // AI Suite Generator
  const handleGenerateAISuite = () => {
    setIsGeneratingSuite(true);
    setTimeout(() => {
      const suite = eventsEngine.generateAIWebinarSuite({
        topic: creatorTopic,
        category: 'Masterclass',
        webinarType: creatorType,
        niche: creatorNiche,
        price: parseFloat(creatorPrice) || 0,
      });
      setGeneratedSuite(suite);
      setIsGeneratingSuite(false);
    }, 900);
  };

  // Create Webinar from AI Suite
  const handlePublishWebinarFromSuite = () => {
    if (!generatedSuite) return;

    const newWebinar = eventsEngine.createEvent({
      title: generatedSuite.title,
      subtitle: generatedSuite.subtitle,
      description: generatedSuite.description,
      category: 'Masterclass & Workshop',
      webinarType: creatorType,
      format: creatorType.includes('evergreen') ? 'prerecorded_evergreen' : 'youtube_live',
      date: creatorDate,
      time: creatorTime,
      videoSource: 'youtube',
      videoEmbedUrl: creatorVideoUrl,
      organizerId: activeUser.id || activeUser.memberCode || 'EVO-ID-000001',
      organizerName: activeUser.name || 'Member',
      organizerEmail: activeUser.email || '',
      capacity: 1000,
      isPaid: parseFloat(creatorPrice) > 0,
      ticketPrice: parseFloat(creatorPrice) || 0,
      isEvergreen: creatorType.includes('evergreen'),
      speakers: [
        {
          id: `spk-${Date.now()}`,
          name: activeUser.name || 'Featured Host',
          role: 'Keynote Presenter',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          topic: creatorTopic,
        }
      ],
      agenda: generatedSuite.agenda,
      aiAssistantConfig: generatedSuite.aiAssistant,
      dynamicCTAs: [generatedSuite.dynamicCTA],
      status: 'Upcoming',
      visibility: 'public',
    });

    refreshEvents();
    setActiveRoomEvent(newWebinar);
    setActiveTab('live_room');
    alert('🚀 AI Webinar Funnel Published & Live Room Initialized!');
  };

  // Filtered Events List
  const filteredEvents = events.filter(e => {
    const matchesType = filterType === 'All' || (e.webinarType || '').toLowerCase() === filterType.toLowerCase() || (e.category || '').toLowerCase() === filterType.toLowerCase();
    const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate High-Level Platform Metrics
  const totalRegistrations = events.reduce((acc, curr) => acc + (curr.registered || 0), 0);
  const totalPlatformRevenue = events.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalAffiliateCommissions = events.reduce((acc, curr) => acc + (curr.analytics?.affiliateCommissions || 0), 0);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Top Banner: AI Webinar & Conversion Center Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>AI Webinar & Conversion Center</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">● High-Conversion Funnels</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Interactive Sales, Education & Recruitment Stage</h2>
          <p className="text-xs text-indigo-200 mt-0.5 max-w-2xl">
            Live and evergreen webinar funnels powered by autonomous AI hosts, timed dynamic CTAs, and automated CRM lead capture.
          </p>
        </div>

        {/* Global Performance Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-center px-2">
            <span className="text-[10px] text-indigo-200 block font-semibold">Webinars</span>
            <span className="text-sm font-black text-white">{events.length}</span>
          </div>
          <div className="text-center px-2 border-l border-white/10">
            <span className="text-[10px] text-indigo-200 block font-semibold">Attendees</span>
            <span className="text-sm font-black text-white">{totalRegistrations.toLocaleString()}</span>
          </div>
          <div className="text-center px-2 border-l border-white/10">
            <span className="text-[10px] text-indigo-200 block font-semibold">Revenue</span>
            <span className="text-sm font-black text-emerald-400">${totalPlatformRevenue.toLocaleString()}</span>
          </div>
          <div className="text-center px-2 border-l border-white/10">
            <span className="text-[10px] text-indigo-200 block font-semibold">Affiliate Splits</span>
            <span className="text-sm font-black text-amber-400">${totalAffiliateCommissions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-max overflow-x-auto gap-1">
        {[
          { id: 'explore', label: 'Explore & Join', icon: Globe },
          { id: 'live_room', label: 'Host Studio & Live Room', icon: Radio },
          { id: 'ai_creator', label: 'AI Funnel Creator', icon: Sparkles },
          { id: 'affiliate_funnels', label: 'Affiliate Webinars', icon: ShoppingBag },
          { id: 'analytics', label: 'Analytics & Conversions', icon: BarChart2 },
          { id: 'my_tickets', label: `My Ticket Passes (${userTickets.length})`, icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

      {/* TAB 1: EXPLORE & JOIN WEBINARS */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search masterclasses, topics, speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'Live', 'Masterclass', 'Affiliate', 'Evergreen'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterType(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filterType === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Webinars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isPaid = Boolean(event.isPaid && (event.ticketPrice || 0) > 0);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {event.status === 'Live' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg animate-pulse">
                            <Radio className="w-3 h-3" />
                            <span>LIVE NOW</span>
                          </span>
                        ) : event.isEvergreen ? (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>EVERGREEN REPLAY</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                            {event.date} • {event.time}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isPaid ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                        }`}>
                          {isPaid ? `$${event.ticketPrice?.toFixed(2)} PASS` : '100% FREE'}
                        </span>
                      </div>

                      {/* Bottom Info on Thumbnail */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={event.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={event.instructor}
                            className="w-6 h-6 rounded-full border border-white/40 object-cover"
                          />
                          <span className="font-bold text-[11px] truncate">{event.instructor || 'Host'}</span>
                        </div>
                        <span className="text-[10px] text-slate-300 font-semibold">{event.registered} Registered</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {event.subtitle || event.description}
                      </p>

                      {/* AI Assistant & Dynamic CTA Features */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {event.aiAssistantConfig?.enabled && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold flex items-center gap-1 border border-indigo-100">
                            <Bot className="w-3 h-3 text-indigo-600" />
                            <span>AI Host Active</span>
                          </span>
                        )}
                        {event.dynamicCTAs && event.dynamicCTAs.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1 border border-emerald-100">
                            <Zap className="w-3 h-3 text-emerald-600" />
                            <span>Fast-Action Offers</span>
                          </span>
                        )}
                        {event.affiliateConfig?.isAffiliateWebinar && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                            <DollarSign className="w-3 h-3 text-amber-600" />
                            <span>{event.affiliateConfig.affiliateCommissionRate}% Affiliate Split</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                    <button
                      onClick={() => {
                        setActiveRoomEvent(event);
                        setActiveTab('live_room');
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Enter Room</span>
                    </button>

                    <button
                      onClick={() => setSelectedEventForRegister(event)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{isPaid ? `Buy Pass ($${event.ticketPrice})` : 'Get Free Pass'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: HOST STUDIO & INTERACTIVE LIVE ROOM */}
      {activeTab === 'live_room' && activeRoomEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Main Stage Video Player & CTA Container */}
          <div className="lg:col-span-8 space-y-4">
            {/* Video Player Box */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video flex flex-col justify-between">
              {/* Embedded Video Player */}
              <iframe
                src={`${activeRoomEvent.videoEmbedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}?autoplay=1&mute=0&controls=1`}
                title={activeRoomEvent.title}
                className="w-full h-full absolute inset-0 object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Floating Emoji Reactions Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {emojiReactions.map((r) => (
                  <div
                    key={r.id}
                    className="absolute bottom-10 text-3xl animate-float-reaction"
                    style={{ left: `${r.left}%` }}
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Room Top Header Overlay */}
              <div className="relative z-10 p-4 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3" />
                    <span>BROADCASTING</span>
                  </span>
                  <span className="text-xs font-bold truncate max-w-sm">{activeRoomEvent.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{activeRoomEvent.analytics?.peakAttendees || 312} Live</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Timed Call-to-Action (CTA) Overlay */}
            {activeCTA && (
              <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-indigo-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slideDown">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                    ⚡ Fast-Action Webinar Offer
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">{activeCTA.title}</h4>
                  <p className="text-xs text-indigo-200">{activeCTA.description}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      eventsEngine.recordInteraction(activeRoomEvent.id, 'cta_click');
                      eventsEngine.recordInteraction(activeRoomEvent.id, 'conversion', activeCTA.price || 49);
                      alert(`🎉 Offer Claimed! You have successfully converted on '${activeCTA.title}'!`);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{activeCTA.buttonText}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Emoji Reaction Floating Bar */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-card flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 pl-2">Live Reaction Stream:</span>
              <div className="flex items-center gap-2">
                {[
                  { emoji: '🔥', label: 'Fire' },
                  { emoji: '🚀', label: 'Rocket' },
                  { emoji: '💡', label: 'Idea' },
                  { emoji: '👏', label: 'Clap' },
                  { emoji: '❤️', label: 'Love' },
                ].map((item) => (
                  <button
                    key={item.emoji}
                    onClick={() => handleTriggerReaction(item.emoji)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:scale-110 active:scale-95 text-lg flex items-center justify-center transition-all"
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Live Chat, AI Host, Q&A, and Polls */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col h-[580px] overflow-hidden">
            {/* View Switcher Tabs */}
            <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50">
              <button
                onClick={() => setRoomViewMode('chat')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  roomViewMode === 'chat' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>

              <button
                onClick={() => setRoomViewMode('qa')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  roomViewMode === 'qa' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Q&A ({questions.length})</span>
              </button>

              <button
                onClick={() => setRoomViewMode('polls')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  roomViewMode === 'polls' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Live Polls</span>
              </button>
            </div>

            {/* TAB CONTENT 1: LIVE CHAT */}
            {roomViewMode === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden p-4">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.senderRole === 'ai_assistant'
                          ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-950'
                          : msg.senderRole === 'host'
                          ? 'bg-amber-50 border border-amber-200 text-amber-950'
                          : 'bg-slate-50 border border-slate-200/70 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          {msg.senderRole === 'ai_assistant' && <Bot className="w-3.5 h-3.5 text-indigo-600" />}
                          <span className="font-bold text-[11px] text-slate-900">{msg.senderName}</span>
                          {msg.senderRole === 'ai_assistant' && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-200 text-indigo-800">AI Host</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-slate-700">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type in chat or ask AI Sophia..."
                    value={currentChatInput}
                    onChange={(e) => setCurrentChatInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT 2: Q&A QUEUE */}
            {roomViewMode === 'qa' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden p-4">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {questions.map((q) => (
                    <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{q.authorName}</span>
                        <button
                          onClick={() => handleUpvoteQuestion(q.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition-all"
                        >
                          <ThumbsUp className="w-3 h-3 text-indigo-600" />
                          <span>{q.upvotes}</span>
                        </button>
                      </div>
                      <p className="text-slate-700 font-medium">{q.question}</p>
                      {q.isAnswered && (
                        <div className="pt-1.5 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Answered Live by {q.answeredBy || 'Presenter'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskQuestion} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="Submit a question for speaker Q&A..."
                    value={newQuestionInput}
                    onChange={(e) => setNewQuestionInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                  >
                    Ask
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT 3: LIVE POLLS */}
            {roomViewMode === 'polls' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {polls.map((poll) => (
                  <div key={poll.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <h5 className="font-bold text-slate-900 leading-snug">{poll.question}</h5>
                    <div className="space-y-2">
                      {poll.options.map((opt) => {
                        const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleVotePoll(poll.id, opt.id)}
                            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 bg-white relative overflow-hidden transition-all group"
                          >
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-indigo-50 group-hover:bg-indigo-100 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                            <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-slate-800">
                              <span>{opt.text}</span>
                              <span className="text-indigo-600">{pct}% ({opt.votes})</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AI WEBINAR FUNNEL CREATOR */}
      {activeTab === 'ai_creator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              AI Conversion Suite Generator
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">Autonomous AI Webinar Funnel Builder</h3>
            <p className="text-xs text-slate-500">
              Generate full webinar titles, landing page copy, timed agendas, AI Host knowledge base, and email sequences in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1">Webinar Topic / Masterclass Subject</label>
              <input
                type="text"
                value={creatorTopic}
                onChange={(e) => setCreatorTopic(e.target.value)}
                placeholder="e.g. AI Lead Generation, Real Estate Closers, High-Ticket E-Commerce"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Niche / Audience</label>
              <input
                type="text"
                value={creatorNiche}
                onChange={(e) => setCreatorNiche(e.target.value)}
                placeholder="e.g. Digital Marketing Agencies, SaaS Founders, Realtors"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Webinar Archetype</label>
              <select
                value={creatorType}
                onChange={(e) => setCreatorType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
              >
                <option value="free_live">Free Live Webinar</option>
                <option value="paid_live">Paid Live Masterclass</option>
                <option value="free_evergreen">Free Evergreen Automated Funnel</option>
                <option value="paid_evergreen">Paid Evergreen Masterclass</option>
                <option value="product_demo">Product Demonstration & Pitch</option>
                <option value="recruitment">Team Recruitment Session</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Price ($0 = 100% Free)</label>
              <input
                type="number"
                value={creatorPrice}
                onChange={(e) => setCreatorPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Video Stream Embed URL (YouTube/Vimeo)</label>
              <input
                type="text"
                value={creatorVideoUrl}
                onChange={(e) => setCreatorVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateAISuite}
            disabled={isGeneratingSuite}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingSuite ? 'animate-spin' : ''}`} />
            <span>{isGeneratingSuite ? 'Crafting High-Converting Suite...' : 'Generate Full AI Webinar Suite'}</span>
          </button>

          {/* Generated AI Suite Preview */}
          {generatedSuite && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 text-xs animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="text-sm font-black text-slate-900">Generated Conversion Suite</h4>
                <button
                  onClick={handlePublishWebinarFromSuite}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Publish & Open Live Room</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-600">Headline & Description</span>
                  <h5 className="font-bold text-slate-900">{generatedSuite.title}</h5>
                  <p className="text-slate-600 leading-relaxed">{generatedSuite.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-600">Dynamic Call-to-Action (CTA)</span>
                  <h5 className="font-bold text-slate-900">{generatedSuite.dynamicCTA.title}</h5>
                  <p className="text-slate-600">{generatedSuite.dynamicCTA.description}</p>
                  <Badge variant="warning" size="sm">{generatedSuite.dynamicCTA.buttonText}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AFFILIATE WEBINAR FUNNELS */}
      {activeTab === 'affiliate_funnels' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Affiliate Revenue Funnels
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">Affiliate Webinar Funnel Engine</h3>
            <p className="text-xs text-slate-500">
              Attach demo and masterclass recordings to marketplace products and earn instant double-entry wallet commissions on every in-webinar sale.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-sm font-black text-slate-900">Select Marketplace Product to Promote:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'PRD-MKT-01', name: 'AI Prompts Mastery Kit', price: 49.00, split: 50 },
                { id: 'PRD-MKT-02', name: 'SaaS Agency Automation Blueprint', price: 199.00, split: 40 },
                { id: 'PRD-MKT-03', name: 'High-Ticket Funnel Vault', price: 299.00, split: 50 },
              ].map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedAffiliateProduct({ id: prod.id, name: prod.name, price: prod.price, commissionRate: prod.split })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAffiliateProduct.id === prod.id
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <h5 className="font-bold text-slate-900 text-xs">{prod.name}</h5>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="font-black text-slate-800">${prod.price}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">{prod.split}% Commission</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAffiliateFunnelGenerated(true)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
            >
              Generate Branded Affiliate Funnel Link
            </button>

            {affiliateFunnelGenerated && (
              <div className="p-4 rounded-2xl bg-white border border-indigo-200 space-y-2 animate-fadeIn">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Your Unique Affiliate Webinar Link:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://evionaecosystem.com/webinar/demo-${selectedAffiliateProduct.id.toLowerCase()}?ref=${activeUser.memberCode || activeUser.id || 'AFFILIATE'}`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://evionaecosystem.com/webinar/demo-${selectedAffiliateProduct.id.toLowerCase()}?ref=${activeUser.memberCode || activeUser.id || 'AFFILIATE'}`);
                      alert('Affiliate link copied to clipboard!');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & CONVERSIONS */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-black text-slate-900">Webinar Performance & Conversion Funnel</h3>
            <p className="text-xs text-slate-500">Track registration conversion, watch retention, dynamic CTA clicks, and sales.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Views</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">2,480</h4>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registrations</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">{totalRegistrations}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CTA Click Rate</span>
              <h4 className="text-xl font-black text-indigo-600 mt-1">28.4%</h4>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</span>
              <h4 className="text-xl font-black text-emerald-600 mt-1">${totalPlatformRevenue.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MY TICKET PASSES */}
      {activeTab === 'my_tickets' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-black text-slate-900">My Registered Ticket Passes</h3>
            <p className="text-xs text-slate-500">Your verified passes and QR codes for upcoming and live webinars.</p>
          </div>

          {userTickets.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No Tickets Yet</h4>
              <p className="text-xs text-slate-500">Explore our catalog and register for your first session!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userTickets.map((tkt) => (
                <div key={tkt.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">{tkt.ticketNumber}</span>
                    <h5 className="font-bold text-slate-900 text-xs">{tkt.eventTitle}</h5>
                    <span className="text-[10px] text-slate-400 block">{tkt.registeredAt ? new Date(tkt.registeredAt).toLocaleDateString() : 'Active Pass'}</span>
                  </div>
                  <img src={tkt.qrCodeUrl} alt="QR Code" className="w-16 h-16 rounded-xl border border-slate-200" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REGISTRATION & LANDING PAGE MODAL */}
      {selectedEventForRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600">Webinar Registration Pass</span>
                <h4 className="text-base font-black text-slate-900 mt-0.5">{selectedEventForRegister.title}</h4>
              </div>
              <button
                onClick={() => setSelectedEventForRegister(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (For SMS Reminder)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              {selectedEventForRegister.isPaid && (selectedEventForRegister.ticketPrice || 0) > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>Ticket Fee</span>
                    <span className="text-sm text-slate-900">${selectedEventForRegister.ticketPrice?.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'wallet', label: 'Wallet ($' + walletBalance.toFixed(2) + ')' },
                      { id: 'card', label: 'Online Card' },
                      { id: 'usdt', label: 'USDT Crypto' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setEventPaymentMethod(m.id as any)}
                        className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          eventPaymentMethod === m.id
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedEventForRegister(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteRegistration(
                  selectedEventForRegister.isPaid ? eventPaymentMethod : 'free'
                )}
                disabled={isRegistering}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{isRegistering ? 'Processing...' : 'Confirm Registration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
