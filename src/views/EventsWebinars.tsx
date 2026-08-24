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
  Settings
} from 'lucide-react';
import { EventItem, EventTicket, EventSpeaker, EventAgendaItem, Member } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { eventsEngine } from '../engine/eventsEngine';
import { useWallet } from '../context/WalletContext';

interface EventsWebinarsProps {
  currentUser?: Member;
}

export const EventsWebinars: React.FC<EventsWebinarsProps> = ({ currentUser }) => {
  const { member } = useAuth();
  const { walletBalance, processPurchase } = useWallet();

  const activeUser = currentUser || member || {
    id: 'EVO-ID-100245',
    name: 'Entrepreneur',
    email: 'user@evionaecosystem.com',
  };

  const [events, setEvents] = useState<EventItem[]>(() => eventsEngine.getEvents('All'));
  const [activeTab, setActiveTab] = useState<'feed' | 'calendar' | 'evergreen' | 'my_tickets'>('feed');
  const [filterScope, setFilterScope] = useState<'all' | 'my_hosted' | 'live' | 'upcoming'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);
  const [selectedEventForWatch, setSelectedEventForWatch] = useState<EventItem | null>(null);
  const [selectedEventForHostStudio, setSelectedEventForHostStudio] = useState<EventItem | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<EventTicket | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Host Studio Live Controls State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isBroadcastActive, setIsBroadcastActive] = useState(true);
  const [eventAttendeesList, setEventAttendeesList] = useState<EventTicket[]>([]);

  // Registration Form State
  const [regName, setRegName] = useState(activeUser.name || '');
  const [regEmail, setRegEmail] = useState(activeUser.email || '');
  const [regPhone, setRegPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // My Tickets State
  const [userTickets, setUserTickets] = useState<EventTicket[]>(() =>
    eventsEngine.getUserTickets(activeUser.email)
  );

  // Create Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Webinar');
  const [newFormat, setNewFormat] = useState<'online_webinar' | 'zoom' | 'google_meet' | 'youtube_live' | 'physical' | 'prerecorded_evergreen'>('online_webinar');
  const [newDate, setNewDate] = useState('Jun 25, 2025');
  const [newTime, setNewTime] = useState('02:00 PM EST');
  const [newMeetingLink, setNewMeetingLink] = useState('https://zoom.us/j/12345678');
  const [newVenue, setNewVenue] = useState('');
  const [newIsPaid, setNewIsPaid] = useState(false);
  const [newPrice, setNewPrice] = useState('29.00');
  const [newCapacity, setNewCapacity] = useState('500');
  const [newSpeakerName, setNewSpeakerName] = useState(activeUser.name || 'Speaker');
  const [newSpeakerTopic, setNewSpeakerTopic] = useState('Scaling Digital Business');

  // AI Assistant State
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const refreshEvents = () => {
    setEvents(eventsEngine.getEvents('All'));
    setUserTickets(eventsEngine.getUserTickets(activeUser.email));
  };

  useEffect(() => {
    refreshEvents();
  }, [activeUser.email, activeUser.id]);

  const checkIsHost = (event: EventItem): boolean => {
    const orgId = (event.organizerId || '').toUpperCase();
    const myId = (activeUser.id || '').toUpperCase();
    const orgEmail = (event.organizerEmail || '').toLowerCase();
    const myEmail = (activeUser.email || '').toLowerCase();
    const instructor = (event.instructor || '').toLowerCase();
    const myName = (activeUser.name || '').toLowerCase();

    return (
      (orgId !== '' && orgId === myId) ||
      (orgEmail !== '' && orgEmail === myEmail) ||
      (instructor !== '' && instructor === myName)
    );
  };

  const handleCopyLink = (eventId: string) => {
    const url = `https://evionaecosystem.com/events/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAIGenerateEvent = () => {
    if (!aiTopic.trim()) {
      alert('Please enter an event topic for AI generation.');
      return;
    }
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generated = eventsEngine.generateAIEventContent({
        topic: aiTopic,
        category: newCategory,
        format: newFormat,
      });
      setNewTitle(generated.title);
      setNewSubtitle(generated.subtitle);
      setNewDescription(generated.description);
      if (generated.suggestedPrice > 0) {
        setNewIsPaid(true);
        setNewPrice(generated.suggestedPrice.toString());
      } else {
        setNewIsPaid(false);
      }
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    eventsEngine.createEvent({
      title: newTitle,
      subtitle: newSubtitle,
      description: newDescription,
      category: newCategory,
      format: newFormat,
      date: newDate,
      time: newTime,
      meetingLink: newMeetingLink,
      venue: newVenue || (newFormat === 'physical' ? 'Grand Hyatt Convention Center' : 'Eviona Virtual Studio'),
      meetingPlatform: newFormat.toUpperCase().replace('_', ' '),
      organizerId: activeUser.id || 'EVO-ID-100245',
      organizerName: activeUser.name || 'Eviona Leader',
      organizerEmail: activeUser.email || 'user@evionaecosystem.com',
      instructor: newSpeakerName || activeUser.name,
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      capacity: parseInt(newCapacity) || 500,
      isPaid: newIsPaid,
      ticketPrice: newIsPaid ? parseFloat(newPrice) || 0 : 0,
      speakers: [
        {
          id: `spk-${Date.now()}`,
          name: newSpeakerName || activeUser.name,
          role: 'Featured Keynote Host',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          topic: newSpeakerTopic,
        }
      ],
      agenda: [
        { id: 'a1', time: '02:00 PM', title: 'Opening & Keynote Session', speakerName: newSpeakerName || activeUser.name },
        { id: 'a2', time: '03:00 PM', title: 'Interactive Workshop & Strategy Q&A', speakerName: newSpeakerName || activeUser.name }
      ],
      faqs: [
        { question: 'Will this session be recorded?', answer: 'Yes, all registered attendees receive replay access automatically.' }
      ],
      status: 'Upcoming',
      visibility: 'public',
    });

    refreshEvents();
    setShowCreateModal(false);
    // Reset Form
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
    setAiTopic('');
    alert('Event created successfully! You are the verified Host.');
  };

  const handleRegisterForEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRegister || !regName || !regEmail) return;

    setIsRegistering(true);
    try {
      if (selectedEventForRegister.isPaid && (selectedEventForRegister.ticketPrice || 0) > 0) {
        const cost = selectedEventForRegister.ticketPrice || 0;
        const res = processPurchase(cost, `Event Ticket: ${selectedEventForRegister.title}`);
        if (!res.success) {
          alert(res.error || 'Insufficient wallet balance to purchase this ticket.');
          setIsRegistering(false);
          return;
        }
      }

      const res = await eventsEngine.registerAttendee({
        eventId: selectedEventForRegister.id,
        attendeeName: regName,
        attendeeEmail: regEmail,
        attendeePhone: regPhone,
        paymentMethod: selectedEventForRegister.isPaid ? 'wallet' : 'free',
      });

      setGeneratedTicket(res.ticket);
      setSelectedEventForRegister(null);
      refreshEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to register for event.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOpenHostStudio = (event: EventItem) => {
    setSelectedEventForHostStudio(event);
    setEventAttendeesList(eventsEngine.getEventAttendees(event.id));
  };

  const handleDeleteHostedEvent = (eventId: string) => {
    if (confirm('Are you sure you want to cancel and delete this event?')) {
      eventsEngine.deleteEvent(eventId);
      setSelectedEventForHostStudio(null);
      refreshEvents();
    }
  };

  const handleCheckInAttendee = (ticketNumber: string) => {
    const res = eventsEngine.checkInAttendee(ticketNumber);
    if (res.success) {
      if (selectedEventForHostStudio) {
        setEventAttendeesList(eventsEngine.getEventAttendees(selectedEventForHostStudio.id));
      }
      refreshEvents();
    }
    alert(res.message);
  };

  const filteredEvents = events.filter(e => {
    const isHost = checkIsHost(e);
    const isLive = e.status === 'Live';

    // Scope filter
    if (filterScope === 'my_hosted' && !isHost) return false;
    if (filterScope === 'live' && !isLive) return false;
    if (filterScope === 'upcoming' && (isLive || e.status === 'Past')) return false;

    // Category filter
    const matchesCategory = filterCategory === 'All' || e.category.toLowerCase().includes(filterCategory.toLowerCase());

    // Search query
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.instructor && e.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const myHostedEventsCount = events.filter(e => checkIsHost(e)).length;
  const totalEventsCount = events.length;
  const liveWebinarsCount = events.filter(e => e.status === 'Live' || e.format === 'youtube_live' || e.format === 'online_webinar').length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registered || 0), 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Eviona Live Event & Webinar Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Events & Webinar Center
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Host live Zoom/Meet sessions, automated recruitment webinars, summits, and physical conferences. Auto-connected to your CRM and email marketing pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Host New Event / Webinar</span>
          </button>
        </div>
      </div>

      {/* 4 Real Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Events</span>
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{totalEventsCount}</h3>
          <p className="text-xs text-indigo-600 font-bold mt-1">{myHostedEventsCount} Hosted by You</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Live Webinars</span>
            <Video className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-purple-600">{liveWebinarsCount}</h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">Active broadcast channels</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Registrations</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-blue-600">{totalRegistrations}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Real attendee leads</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Ticket Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-slate-400 mt-1">Settled Box Office earnings</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold overflow-x-auto w-full">
        {[
          { id: 'feed', label: 'All Events & Webinars', icon: CalendarIcon },
          { id: 'calendar', label: 'Calendar Grid View', icon: Clock },
          { id: 'evergreen', label: 'Evergreen Recruitment Funnels', icon: Tv },
          { id: 'my_tickets', label: `My Tickets (${userTickets.length})`, icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
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

      {/* TAB 1: ALL EVENTS & WEBINARS FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Scope Filters & Search Controls */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Scope Switcher: All vs Hosted by Me vs Live vs Upcoming */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterScope('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filterScope === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                onClick={() => setFilterScope('my_hosted')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 transition-all ${
                  filterScope === 'my_hosted' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Crown className="w-3 h-3 text-amber-500" />
                <span>Hosted by Me ({myHostedEventsCount})</span>
              </button>
              <button
                onClick={() => setFilterScope('live')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filterScope === 'live' ? 'bg-white text-rose-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Live Now ({events.filter(e => e.status === 'Live').length})
              </button>
              <button
                onClick={() => setFilterScope('upcoming')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filterScope === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Upcoming
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search events, speakers, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs space-y-3">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No Events Found</p>
              <p className="text-slate-400">
                {filterScope === 'my_hosted'
                  ? 'You have not created any events yet. Click "Host New Event / Webinar" to create one.'
                  : 'Try adjusting your search criteria or filter scope.'}
              </p>
              {filterScope === 'my_hosted' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Create Your First Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isHost = checkIsHost(event);
                const isLive = event.status === 'Live';
                const isPaid = event.isPaid && (event.ticketPrice || 0) > 0;
                const isRegistered = userTickets.some(t => t.eventId === event.id || t.eventTitle === event.title);
                const capacityPct = Math.min(100, Math.round(((event.registered || 0) / (event.capacity || 500)) * 100));

                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-3xl border overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                      isHost ? 'border-indigo-300 ring-2 ring-indigo-500/20' : 'border-slate-200'
                    }`}
                  >
                    {/* Event Banner */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        {isHost && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1 shadow-md">
                            <Crown className="w-3 h-3 text-amber-300" />
                            YOU ARE HOST
                          </span>
                        )}
                        {isLive && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 animate-pulse shadow-md">
                            <Radio className="w-3 h-3" />
                            LIVE NOW
                          </span>
                        )}
                        {!isLive && !isHost && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                            {event.category}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-black text-slate-900 shadow-sm">
                        {isPaid ? `$${event.ticketPrice?.toFixed(2)} USD` : 'FREE PASS'}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.date} • {event.time}</span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {event.subtitle || event.description}
                        </p>

                        {/* Instructor / Speaker Badge */}
                        <div className="flex items-center gap-2 pt-2">
                          <img
                            src={event.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={event.instructor}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <span className="text-xs font-bold text-slate-700">
                            {isHost ? `${activeUser.name} (You)` : (event.instructor || event.organizerName)}
                          </span>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Capacity</span>
                            <span>{event.registered} / {event.capacity} Registered ({capacityPct}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${capacityPct}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Action Strip: Dynamic Host vs Attendee logic */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleCopyLink(event.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          title="Share Event Link"
                        >
                          {copiedId === event.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* 1. YOU ARE THE HOST: Host Studio Access */}
                        {isHost ? (
                          <button
                            onClick={() => handleOpenHostStudio(event)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                          >
                            <Crown className="w-3.5 h-3.5 text-amber-300" />
                            <span>Host Studio & Broadcast</span>
                          </button>
                        ) : isRegistered ? (
                          /* 2. YOU ARE AN ATTENDEE & ALREADY REGISTERED: Enter Room */
                          <button
                            onClick={() => setSelectedEventForWatch(event)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enter Stream Room</span>
                          </button>
                        ) : (
                          /* 3. YOU ARE AN ATTENDEE NOT YET REGISTERED: Get Pass */
                          <button
                            onClick={() => setSelectedEventForRegister(event)}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>{isPaid ? `Register ($${event.ticketPrice?.toFixed(2)})` : 'Get Free Pass'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-900">Event Schedule Calendar</h3>
              <div className="flex gap-1 text-slate-400">
                <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-700"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-700"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-3">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isEvent = day === 15 || day === 20 || day === 25 || day === 30;
                const isToday = day === 24;

                return (
                  <div
                    key={day}
                    className={`py-4 rounded-2xl font-bold transition-all flex flex-col items-center justify-between gap-1 border ${
                      isToday
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : isEvent
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{day}</span>
                    {isEvent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <h4 className="font-black text-slate-900 text-sm">Upcoming Timeline</h4>
            <div className="space-y-3">
              {events.slice(0, 4).map((e) => (
                <div key={e.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-600">{e.date} • {e.time}</span>
                    {checkIsHost(e) && <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">You Host</span>}
                  </div>
                  <h5 className="font-bold text-slate-900 truncate">{e.title}</h5>
                  <p className="text-[11px] text-slate-400">{e.venue || e.meetingPlatform}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVERGREEN RECRUITMENT FUNNELS */}
      {activeTab === 'evergreen' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Evergreen Automated Recruitment & Sales Webinars</h3>
            <p className="text-xs text-slate-500">24/7 on-demand webinar funnels that capture leads, present value, and convert prospects into registered team members.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.filter(e => e.format === 'prerecorded_evergreen' || e.category.includes('Recruitment')).map((e) => (
              <div key={e.id} className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <Badge variant="purple" size="sm">24/7 On Demand</Badge>
                  <h4 className="text-lg font-black text-white">{e.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{e.subtitle || e.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedEventForWatch(e)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Webinar Replay</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(e.id)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                    title="Copy Funnel Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MY TICKETS */}
      {activeTab === 'my_tickets' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Your Registered Passes & Event Tickets</h3>
            <p className="text-xs text-slate-500">Display your QR ticket codes for physical check-in or access virtual broadcast links.</p>
          </div>

          {userTickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Ticket className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No Tickets Found</p>
              <p className="text-slate-400">Register for an upcoming summit or live webinar to access your digital tickets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTickets.map((t) => (
                <div key={t.id} className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center gap-5 justify-between">
                  <div className="space-y-2 text-xs">
                    <Badge variant="emerald" size="sm">Confirmed Pass</Badge>
                    <h4 className="text-base font-black text-white">{t.eventTitle}</h4>
                    <p className="font-mono text-indigo-300 font-bold">Ticket #{t.ticketNumber}</p>
                    <p className="text-slate-400 text-[11px]">Attendee: <b className="text-white">{t.attendeeName}</b></p>
                  </div>

                  <div className="p-3 bg-white rounded-2xl shrink-0">
                    <img src={t.qrCodeUrl} alt="Ticket QR" className="w-24 h-24" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: HOST LIVE BROADCAST STUDIO (For Event Host) */}
      {selectedEventForHostStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[92vh]">
            {/* Studio Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">{selectedEventForHostStudio.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                      <Radio className="w-3 h-3" />
                      Host Studio Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Host: <b className="text-white">{activeUser.name}</b> • {selectedEventForHostStudio.meetingPlatform}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteHostedEvent(selectedEventForHostStudio.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1 border border-rose-500/20"
                  title="Cancel & Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedEventForHostStudio(null)} className="text-slate-400 hover:text-white p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Studio Body: Video Stage + Controls + Attendee Roster */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
              {/* Left: Broadcast Stage (8 cols) */}
              <div className="lg:col-span-8 p-6 space-y-4 border-r border-slate-800 flex flex-col justify-between">
                <div className="aspect-video w-full bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  {isCameraOn ? (
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-indigo-600/30 border-2 border-indigo-500 text-indigo-300 flex items-center justify-center mx-auto animate-pulse">
                        <Video className="w-10 h-10" />
                      </div>
                      <p className="text-xs font-bold text-slate-300">Live Stage: {activeUser.name} is Broadcasting</p>
                      <p className="text-[11px] text-indigo-400 font-mono">1080p HD • 60 FPS • Encrypted Stream</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs space-y-1">
                      <CameraOff className="w-8 h-8 mx-auto" />
                      <p>Camera is Muted</p>
                    </div>
                  )}

                  {/* Stage Watermark */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Output</span>
                  </div>
                </div>

                {/* Studio Control Toolbar */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-3 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                        isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      <span>{isMicOn ? 'Mute Mic' : 'Unmute'}</span>
                    </button>

                    <button
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`p-3 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                        isCameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                      <span>{isCameraOn ? 'Stop Camera' : 'Start Camera'}</span>
                    </button>

                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`p-3 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                        isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>{isScreenSharing ? 'Sharing Screen' : 'Share Screen'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(selectedEventForHostStudio.id)}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Invite Link</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Attendee Roster & Check-In (4 cols) */}
              <div className="lg:col-span-4 p-6 space-y-4 bg-slate-950/50 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>Registered Attendees ({eventAttendeesList.length})</span>
                    </h4>
                  </div>

                  {eventAttendeesList.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs space-y-1">
                      <Users className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="font-bold text-slate-400">No Registrations Yet</p>
                      <p className="text-[11px]">Share your event link with your network or community.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {eventAttendeesList.map((att) => (
                        <div key={att.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <p className="font-bold text-white truncate">{att.attendeeName}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{att.attendeeEmail}</p>
                          </div>
                          {att.status === 'checked_in' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Checked In
                            </span>
                          ) : (
                            <button
                              onClick={() => handleCheckInAttendee(att.ticketNumber)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px]"
                            >
                              Check In
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-2 text-indigo-200">
                  <p className="font-bold text-white flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Automatic CRM Sync</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    All attendees are automatically saved into your CRM pipeline with tags and timestamp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ATTENDEE REGISTRATION (For Non-Host) */}
      {selectedEventForRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Event Registration</h3>
                <p className="text-xs text-slate-500">Secure your pass for {selectedEventForRegister.title}</p>
              </div>
              <button onClick={() => setSelectedEventForRegister(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Host:</span>
                <span className="font-bold text-slate-800">{selectedEventForRegister.instructor || selectedEventForRegister.organizerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-800">{selectedEventForRegister.date} • {selectedEventForRegister.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket Price:</span>
                <span className="font-black text-indigo-600">
                  {selectedEventForRegister.isPaid ? `$${selectedEventForRegister.ticketPrice?.toFixed(2)} USD` : 'FREE PASS'}
                </span>
              </div>
            </div>

            <form onSubmit={handleRegisterForEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEventForRegister(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isRegistering ? 'Generating Pass...' : selectedEventForRegister.isPaid ? `Pay $${selectedEventForRegister.ticketPrice?.toFixed(2)}` : 'Confirm Free Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GENERATED TICKET PASS */}
      {generatedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Pass Confirmed!</h3>
            <p className="text-xs text-slate-500">
              Your digital ticket has been sent to <span className="font-bold text-slate-800">{generatedTicket.attendeeEmail}</span>.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <img src={generatedTicket.qrCodeUrl} alt="QR Ticket" className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs" />
              <p className="font-mono font-bold text-sm text-indigo-600">{generatedTicket.ticketNumber}</p>
            </div>

            <button
              onClick={() => setGeneratedTicket(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: WATCH VIRTUAL STREAM / WEBINAR ROOM (For Registered Attendee) */}
      {selectedEventForWatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 space-y-4">
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-bold text-white truncate">{selectedEventForWatch.title}</h3>
              </div>
              <button onClick={() => setSelectedEventForWatch(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={selectedEventForWatch.videoEmbedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title="Broadcast"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-sm">Ready to scale your business?</h4>
                <p className="text-xs text-slate-400">Join the official Eviona Partner network or explore our marketplace tools.</p>
              </div>
              <button
                onClick={() => alert('Redirecting to partner registration')}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
              >
                Claim Membership Offer Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CREATE EVENT WIZARD (With AI Copywriter) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Host New Event or Webinar</h3>
                <p className="text-xs text-slate-500">You will be the verified Host with full broadcast and attendee controls</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Event Generator Bar */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>AI Event Copywriter & Agenda Generator</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter event topic (e.g. AI Agency Scaling Blueprint)..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAIGenerateEvent}
                  disabled={isGeneratingAI}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? 'Writing...' : 'Generate with AI'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Figure Affiliate Mastery Live Workshop"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="Webinar">Webinar</option>
                    <option value="Training & Education">Training & Education</option>
                    <option value="Conference & Summit">Conference & Summit</option>
                    <option value="Recruitment & Opportunity">Recruitment & Opportunity</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="online_webinar">Online Webinar (Eviona Studio)</option>
                    <option value="zoom">Zoom Meeting</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="youtube_live">YouTube Live</option>
                    <option value="prerecorded_evergreen">Pre-Recorded Evergreen</option>
                    <option value="physical">Physical Venue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time & Timezone</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Virtual Meeting Link / Broadcast URL</label>
                <input
                  type="url"
                  value={newMeetingLink}
                  onChange={(e) => setNewMeetingLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Key Takeaways</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Pricing & Free Pass Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Event Pricing</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsPaid}
                      onChange={(e) => setNewIsPaid(e.target.checked)}
                      className="accent-indigo-600 w-4 h-4"
                    />
                    <span className="font-bold text-slate-700">Paid Ticket Event</span>
                  </label>
                </div>

                {newIsPaid && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ticket Price ($ USD / EVO)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  Publish Event & Webinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
