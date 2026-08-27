import {
  EventItem,
  EventTicket,
  EventSpeaker,
  EventAgendaItem,
  WebinarType,
  DynamicCTA,
  AIAssistantConfig,
  WebinarChatMessage,
  WebinarPoll,
  WebinarQuestion,
  AffiliateWebinarConfig,
  WebinarAnalytics,
  Lead
} from '../types';
import { supabase } from '../lib/supabaseClient';
import { crmEngine } from './crmEngine';

const STORAGE_EVENTS_KEY = 'eviona_events_master_v5';
const STORAGE_TICKETS_KEY = 'eviona_event_tickets_v5';
const STORAGE_CHAT_PREFIX = 'eviona_webinar_chat_';
const STORAGE_POLLS_PREFIX = 'eviona_webinar_polls_';
const STORAGE_QA_PREFIX = 'eviona_webinar_qa_';

export const INITIAL_PLATFORM_EVENTS: EventItem[] = [
  {
    id: 'EVT-1001',
    slug: 'ai-lead-generation-masterclass',
    title: 'AI Lead Generation & Automated Client Acquisition Masterclass',
    subtitle: 'Extract 1,000+ targeted B2B prospects every week and convert them on autopilot using intelligent AI sequences.',
    description: 'Learn how modern agency builders and SaaS founders are using Google Maps intelligence scraping, zero-token social extraction, and hyper-personalized AI email writers to generate $10k+ in monthly recurring client contracts.',
    category: 'Masterclass & Workshop',
    webinarType: 'masterclass',
    format: 'prerecorded_evergreen',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM',
    endTime: '03:30 PM',
    timezone: 'EST',
    instructor: 'Alex Mercer',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    organizerId: 'EVO-ID-000001',
    organizerName: 'DEOS Global Masterclass Team',
    organizerEmail: 'academy@evionaecosystem.com',
    registered: 428,
    capacity: 1000,
    checkedInCount: 312,
    revenue: 0,
    isPaid: false,
    ticketPrice: 0,
    isEvergreen: true,
    videoSource: 'youtube',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    replayUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Live',
    visibility: 'public',
    bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    speakers: [
      {
        id: 'spk-1',
        name: 'Alex Mercer',
        role: 'Chief AI Architect',
        company: 'DEOS Labs',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        bio: 'Scaled multiple 7-figure automation agencies and leads the DEOS core intelligence architecture.',
      },
    ],
    agenda: [
      { id: 'ag-1', time: '00:00', title: 'Welcome & The 2025 B2B Prospecting Landscape' },
      { id: 'ag-2', time: '12:30', title: 'Live Demonstration: High-Speed Google Maps Lead Discovery' },
      { id: 'ag-3', time: '28:00', title: '0-Token Socials Scanning & Deep Email Verification' },
      { id: 'ag-4', time: '45:00', title: 'Automated CRM Pipeline Synchronization & Cold Outreach' },
      { id: 'ag-5', time: '60:00', title: 'VIP Q&A & Exclusive Growth Tier Access Offer' },
    ],
    faqs: [
      { question: 'Will a replay be provided?', answer: 'Yes, full replay access is permanently recorded and available to all registered attendees in the Replay Vault.' },
      { question: 'Do I need coding experience?', answer: 'No! The entire DEOS AI Lead Finder and CRM pipeline is 100% no-code and 1-click ready.' },
    ],
    dynamicCTAs: [
      {
        id: 'cta-1',
        title: 'Unlock DEOS Growth Tier (1,000 Leads/Mo)',
        description: 'Get instant access to AI Lead Finder, 0-Token Social Extractor, and 1-Click CRM sync at 50% discount.',
        buttonText: 'Upgrade to Growth Plan Now ($300/mo)',
        buttonUrl: '/settings',
        ctaType: 'join_membership',
        triggerType: 'timestamp',
        triggerTimestampSeconds: 30,
        price: 300,
        active: true,
      },
    ],
    aiAssistantConfig: {
      enabled: true,
      assistantName: 'Sophia AI Host',
      assistantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      welcomeMessage: '👋 Welcome to the live masterclass! I am Sophia, your AI Session Host. Feel free to ask any technical or pricing questions in the chat!',
      faqs: [
        { question: 'how much is the tool', answer: 'The Launch plan starts at $100/mo, and Growth is $300/mo with 1,000 verified leads/mo!' },
        { question: 'is there a replay', answer: 'Yes! Replays are permanently available in your dashboard.' },
      ],
      autoModerateChat: true,
    },
    analytics: {
      views: 1240,
      peakAttendees: 312,
      avgWatchTimeMinutes: 34.5,
      ctaClicks: 89,
      conversionCount: 24,
      totalRevenue: 7200,
      affiliateCommissions: 1440,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'EVT-1002',
    slug: 'affiliate-commission-acceleration-blueprint',
    title: 'Affiliate Commission Acceleration: The 2025 Multi-Tier Playbook',
    subtitle: 'How to build high-converting affiliate funnels, automated binary teams, and instant wallet commission streams.',
    description: 'A deep-dive workshop demonstrating how to pick high-ticket marketplace products, attach custom webinar funnels, and generate passive recurring commissions credited instantly to your multi-currency wallet.',
    category: 'Affiliate & Business',
    webinarType: 'product_demo',
    format: 'youtube_live',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '04:00 PM',
    endTime: '05:30 PM',
    timezone: 'EST',
    instructor: 'David Sterling',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    organizerId: 'EVO-ID-000001',
    organizerName: 'DEOS Affiliate Guild',
    registered: 615,
    capacity: 2000,
    checkedInCount: 0,
    revenue: 0,
    isPaid: false,
    ticketPrice: 0,
    isEvergreen: false,
    videoSource: 'youtube_live',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Upcoming',
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    affiliateConfig: {
      isAffiliateWebinar: true,
      affiliateProductId: 'PRD-MKT-01',
      affiliateProductName: 'AI Prompts Mastery Kit & SaaS Templates',
      affiliateProductPrice: 49.00,
      affiliateCommissionRate: 50,
      affiliateTrackingLink: 'https://evionaecosystem.com/store?ref=AFFILIATE_LEAD',
    },
    dynamicCTAs: [
      {
        id: 'cta-2',
        title: 'Claim AI Prompts Mastery Kit ($49.00)',
        description: 'Instant download with commercial license + 50% affiliate resale rights.',
        buttonText: 'Claim Your Copy ($49.00)',
        buttonUrl: '/store',
        ctaType: 'buy_now',
        triggerType: 'timestamp',
        triggerTimestampSeconds: 45,
        price: 49,
        active: true,
      },
    ],
    aiAssistantConfig: {
      enabled: true,
      assistantName: 'Aria AI Co-Pilot',
      welcomeMessage: 'Welcome everyone! We will be sharing the live affiliate commission breakdown shortly.',
      autoModerateChat: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'EVT-1003',
    slug: 'high-ticket-ecommerce-vip-summit',
    title: 'High-Ticket E-Commerce & Creator Storefront VIP Summit',
    subtitle: 'Turn digital products, paid courses, and private masterclasses into a recurring 6-figure storefront.',
    description: 'Exclusive 2-hour VIP masterclass for approved store owners. Learn direct Paystack, Kuda, and USDT crypto payment routing with instant automated buyer onboarding.',
    category: 'Conference & Summit',
    webinarType: 'paid_live',
    format: 'zoom',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '06:00 PM',
    endTime: '08:00 PM',
    timezone: 'EST',
    instructor: 'Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    organizerId: 'EVO-ID-000001',
    organizerName: 'DEOS Commerce Team',
    registered: 184,
    capacity: 250,
    checkedInCount: 0,
    revenue: 9016,
    isPaid: true,
    ticketPrice: 49.00,
    isEvergreen: false,
    meetingPlatform: 'Zoom VIP Secure',
    meetingLink: 'https://zoom.us/j/deos-vip-summit',
    status: 'Upcoming',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    dynamicCTAs: [
      {
        id: 'cta-3',
        title: 'Apply for 1-on-1 Storefront Scale Mentorship',
        description: 'Work directly with Elena to launch and scale your high-ticket storefront.',
        buttonText: 'Schedule Scale Consultation',
        buttonUrl: '#schedule',
        ctaType: 'schedule_call',
        triggerType: 'end_of_webinar',
        triggerTimestampSeconds: 7200,
        active: true,
      },
    ],
    createdAt: new Date().toISOString(),
  }
];

export const eventsEngine = {
  // 1. Get All Events / Webinars
  getEvents(filterStatus?: string): EventItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (saved) {
        const list: EventItem[] = JSON.parse(saved);
        if (Array.isArray(list) && list.length > 0) {
          if (!filterStatus || filterStatus === 'All') return list;
          return list.filter(e => e.status.toLowerCase() === filterStatus.toLowerCase());
        }
      }
    } catch (e) {
      console.warn('[EventsEngine] Error loading events:', e);
    }

    // Initialize with default platform events
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_PLATFORM_EVENTS));
    if (!filterStatus || filterStatus === 'All') return INITIAL_PLATFORM_EVENTS;
    return INITIAL_PLATFORM_EVENTS.filter(e => e.status.toLowerCase() === filterStatus.toLowerCase());
  },

  // 2. Get Event By ID or Slug
  getEventById(idOrSlug: string): EventItem | undefined {
    const list = this.getEvents('All');
    return list.find(e => e.id === idOrSlug || e.slug === idOrSlug);
  },

  // 3. Create Event / Webinar
  createEvent(eventData: Omit<EventItem, 'id' | 'registered' | 'checkedInCount' | 'revenue' | 'createdAt'>): EventItem {
    const generatedId = `EVT-${Date.now().toString().slice(-4)}`;
    const generatedSlug = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newEvent: EventItem = {
      ...eventData,
      id: generatedId,
      slug: `${generatedSlug}-${Date.now().toString().slice(-3)}`,
      registered: 0,
      checkedInCount: 0,
      revenue: 0,
      bannerImage: eventData.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      status: eventData.status || 'Upcoming',
      analytics: eventData.analytics || {
        views: 0,
        peakAttendees: 0,
        avgWatchTimeMinutes: 0,
        ctaClicks: 0,
        conversionCount: 0,
        totalRevenue: 0,
        affiliateCommissions: 0,
      },
      aiAssistantConfig: eventData.aiAssistantConfig || {
        enabled: true,
        assistantName: 'Sophia AI Host',
        welcomeMessage: '👋 Welcome to the live session! How can I help you today?',
        autoModerateChat: true,
      },
      dynamicCTAs: eventData.dynamicCTAs || [],
      createdAt: new Date().toISOString(),
    };

    const currentList = this.getEvents('All');
    const updated = [newEvent, ...currentList];
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));

    // Optional background sync to Supabase
    (async () => {
      try {
        await supabase.from('Event').insert({
          id: newEvent.id,
          title: newEvent.title,
          category: newEvent.category,
          date: newEvent.date,
          time: newEvent.time,
          organizerId: newEvent.organizerId,
          ticketPrice: newEvent.ticketPrice,
          status: newEvent.status,
          createdAt: newEvent.createdAt,
        });
      } catch {}
    })();

    return newEvent;
  },

  // 4. Update Event
  updateEvent(eventId: string, updates: Partial<EventItem>): EventItem[] {
    const all = this.getEvents('All');
    const updated = all.map(e => (e.id === eventId ? { ...e, ...updates } : e));
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // 5. Delete Event
  deleteEvent(eventId: string): EventItem[] {
    const all = this.getEvents('All');
    const updated = all.filter(e => e.id !== eventId);
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // 6. Register Attendee for Event (With Multi-Rail Wallet / Card & Automatic CRM Lead Creation)
  async registerAttendee(data: {
    eventId: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone?: string;
    paymentMethod?: 'wallet' | 'card' | 'free';
  }): Promise<{ ticket: EventTicket; event: EventItem }> {
    const { eventId, attendeeName, attendeeEmail, attendeePhone, paymentMethod = 'free' } = data;

    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found.');

    const price = event.isPaid ? (event.ticketPrice || 0) : 0;
    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
    const ticketNumber = `EVO-TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`EVENT_TICKET:${ticketNumber}:${eventId}:${attendeeEmail}`)}`;

    const newTicket: EventTicket = {
      id: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      ticketNumber: ticketNumber,
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.trim().toLowerCase(),
      attendeePhone: attendeePhone?.trim(),
      pricePaid: price,
      qrCodeUrl: qrCodeUrl,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
    };

    // 1. Save Ticket to Registry
    try {
      const savedTickets = localStorage.getItem(STORAGE_TICKETS_KEY);
      const tickets: EventTicket[] = savedTickets ? JSON.parse(savedTickets) : [];
      tickets.unshift(newTicket);
      localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
    } catch {}

    // 2. Increment Event Attendance & Revenue Counter
    const allEvents = this.getEvents('All');
    const updatedEvents = allEvents.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          registered: (e.registered || 0) + 1,
          revenue: (e.revenue || 0) + price,
          analytics: {
            views: (e.analytics?.views || 0) + 1,
            peakAttendees: Math.max((e.analytics?.peakAttendees || 0), (e.registered || 0) + 1),
            avgWatchTimeMinutes: e.analytics?.avgWatchTimeMinutes || 25,
            ctaClicks: e.analytics?.ctaClicks || 0,
            conversionCount: (e.analytics?.conversionCount || 0) + (price > 0 ? 1 : 0),
            totalRevenue: (e.analytics?.totalRevenue || 0) + price,
            affiliateCommissions: e.analytics?.affiliateCommissions || 0,
          }
        };
      }
      return e;
    });
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updatedEvents));

    // 3. Ingest Lead into Organizer CRM (Tenant Scoped - Book 7 Integration)
    try {
      crmEngine.addLead({
        ownerId: event.organizerId || 'EVO-ID-000001',
        ownerName: event.organizerName || 'Organizer',
        name: attendeeName.trim(),
        email: attendeeEmail.trim().toLowerCase(),
        phone: attendeePhone?.trim() || '',
        company: 'Webinar Attendee',
        source: `Webinar Registration: ${event.title}`,
        status: 'New',
        stage: 'Qualified',
        dealValue: price > 0 ? price : 50,
      });
    } catch {}

    return { ticket: newTicket, event: { ...event, registered: event.registered + 1, revenue: event.revenue + price } };
  },

  // 7. Get Attendees / Tickets for a specific Event
  getEventAttendees(eventId: string): EventTicket[] {
    try {
      const saved = localStorage.getItem(STORAGE_TICKETS_KEY);
      if (saved) {
        const tickets: EventTicket[] = JSON.parse(saved);
        return tickets.filter(t => t.eventId === eventId);
      }
    } catch {}
    return [];
  },

  // 8. Get User Tickets
  getUserTickets(userEmail?: string): EventTicket[] {
    try {
      const saved = localStorage.getItem(STORAGE_TICKETS_KEY);
      if (saved) {
        const tickets: EventTicket[] = JSON.parse(saved);
        if (!userEmail) return tickets;
        return tickets.filter(t => t.attendeeEmail.toLowerCase() === userEmail.toLowerCase().trim());
      }
    } catch {}
    return [];
  },

  // 9. Check In Attendee
  checkInAttendee(ticketNumber: string): { success: boolean; message: string } {
    try {
      const saved = localStorage.getItem(STORAGE_TICKETS_KEY);
      if (saved) {
        const tickets: EventTicket[] = JSON.parse(saved);
        const match = tickets.find(t => t.ticketNumber === ticketNumber);
        if (match) {
          match.status = 'checked_in';
          localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
          return { success: true, message: `Attendee ${match.attendeeName} checked in successfully!` };
        }
      }
    } catch {}
    return { success: false, message: 'Ticket not found or already checked in.' };
  },

  // 10. Live Webinar Room Chat Operations
  getWebinarChat(eventId: string): WebinarChatMessage[] {
    try {
      const saved = localStorage.getItem(`${STORAGE_CHAT_PREFIX}${eventId}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    const initialChat: WebinarChatMessage[] = [
      {
        id: 'msg-1',
        senderName: 'Sophia AI Host',
        senderRole: 'ai_assistant',
        text: '👋 Welcome to the live session! Feel free to ask questions and participate in the live polls.',
        time: 'Just now',
        isPinned: true,
      },
      {
        id: 'msg-2',
        senderName: 'Marcus T.',
        senderRole: 'attendee',
        text: 'Tuning in from London! Excited for this masterclass 🚀',
        time: '1m ago',
      },
      {
        id: 'msg-3',
        senderName: 'Sarah Jenkins',
        senderRole: 'attendee',
        text: 'Audio and video are crystal clear!',
        time: 'Just now',
      },
    ];
    localStorage.setItem(`${STORAGE_CHAT_PREFIX}${eventId}`, JSON.stringify(initialChat));
    return initialChat;
  },

  sendChatMessage(eventId: string, senderName: string, text: string, role: 'attendee' | 'host' = 'attendee'): WebinarChatMessage[] {
    const current = this.getWebinarChat(eventId);
    const newMsg: WebinarChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: senderName.trim() || 'Attendee',
      senderRole: role,
      text: text.trim(),
      time: 'Just now',
    };

    const updated = [...current, newMsg];

    // AI Assistant Auto-Responder Trigger
    if (text.includes('?') || text.toLowerCase().includes('price') || text.toLowerCase().includes('replay') || text.toLowerCase().includes('cost')) {
      let aiReply = 'Thanks for your question! All registrants receive full lifetime replay access, and the special offer will drop during the presentation.';
      if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
        aiReply = '💡 Special pricing and membership bundle bonuses will be revealed during the live CTA drop!';
      }
      updated.push({
        id: `ai-reply-${Date.now()}`,
        senderName: 'Sophia AI Host',
        senderRole: 'ai_assistant',
        text: `@${senderName}: ${aiReply}`,
        time: 'Just now',
      });
    }

    localStorage.setItem(`${STORAGE_CHAT_PREFIX}${eventId}`, JSON.stringify(updated));
    return updated;
  },

  // 11. Live Webinar Polls
  getWebinarPolls(eventId: string): WebinarPoll[] {
    try {
      const saved = localStorage.getItem(`${STORAGE_POLLS_PREFIX}${eventId}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    const initialPoll: WebinarPoll[] = [
      {
        id: 'poll-1',
        question: 'What is your primary bottleneck in scaling client revenue this quarter?',
        options: [
          { id: 'opt-1', text: 'Finding verified high-intent local business leads', votes: 48 },
          { id: 'opt-2', text: 'Automating cold outreach without spamming', votes: 31 },
          { id: 'opt-3', text: 'Closing high-ticket retainers ($3k - $10k/mo)', votes: 62 },
          { id: 'opt-4', text: 'Building affiliate and binary referral teams', votes: 24 },
        ],
        isActive: true,
        totalVotes: 165,
      },
    ];
    localStorage.setItem(`${STORAGE_POLLS_PREFIX}${eventId}`, JSON.stringify(initialPoll));
    return initialPoll;
  },

  votePoll(eventId: string, pollId: string, optionId: string): WebinarPoll[] {
    const polls = this.getWebinarPolls(eventId);
    const updated = polls.map(p => {
      if (p.id === pollId) {
        const nextOpts = p.options.map(opt => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt));
        return { ...p, options: nextOpts, totalVotes: p.totalVotes + 1 };
      }
      return p;
    });
    localStorage.setItem(`${STORAGE_POLLS_PREFIX}${eventId}`, JSON.stringify(updated));
    return updated;
  },

  // 12. Live Q&A Question Queue
  getWebinarQA(eventId: string): WebinarQuestion[] {
    try {
      const saved = localStorage.getItem(`${STORAGE_QA_PREFIX}${eventId}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    const initialQA: WebinarQuestion[] = [
      {
        id: 'qa-1',
        authorName: 'David K.',
        question: 'How do residential proxy pools prevent Google Maps IP bans during high-volume scraping?',
        upvotes: 14,
        isAnswered: true,
        answeredBy: 'Alex Mercer',
      },
      {
        id: 'qa-2',
        authorName: 'Amanda R.',
        question: 'Can we connect Paystack inline card checkout directly to our affiliate product webinar?',
        upvotes: 9,
        isAnswered: false,
      },
    ];
    localStorage.setItem(`${STORAGE_QA_PREFIX}${eventId}`, JSON.stringify(initialQA));
    return initialQA;
  },

  askQuestion(eventId: string, authorName: string, questionText: string): WebinarQuestion[] {
    const questions = this.getWebinarQA(eventId);
    const newQ: WebinarQuestion = {
      id: `qa-${Date.now()}`,
      authorName: authorName.trim() || 'Attendee',
      question: questionText.trim(),
      upvotes: 1,
      isAnswered: false,
    };
    const updated = [newQ, ...questions];
    localStorage.setItem(`${STORAGE_QA_PREFIX}${eventId}`, JSON.stringify(updated));
    return updated;
  },

  upvoteQuestion(eventId: string, qId: string): WebinarQuestion[] {
    const questions = this.getWebinarQA(eventId);
    const updated = questions.map(q => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q));
    localStorage.setItem(`${STORAGE_QA_PREFIX}${eventId}`, JSON.stringify(updated));
    return updated;
  },

  // 13. Record Webinar Interactions & Conversions
  recordInteraction(eventId: string, type: 'cta_click' | 'conversion' | 'view', amount: number = 0) {
    const all = this.getEvents('All');
    const updated = all.map(e => {
      if (e.id === eventId) {
        const current = e.analytics || {
          views: 0,
          peakAttendees: 0,
          avgWatchTimeMinutes: 0,
          ctaClicks: 0,
          conversionCount: 0,
          totalRevenue: 0,
          affiliateCommissions: 0,
        };

        if (type === 'cta_click') current.ctaClicks += 1;
        if (type === 'view') current.views += 1;
        if (type === 'conversion') {
          current.conversionCount += 1;
          current.totalRevenue += amount;
          if (e.affiliateConfig?.isAffiliateWebinar) {
            const commission = (amount * (e.affiliateConfig.affiliateCommissionRate || 50)) / 100;
            current.affiliateCommissions += commission;
          }
        }

        return { ...e, analytics: current };
      }
      return e;
    });
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
  },

  // 14. AI Webinar Funnel & Copywriter Suite
  generateAIWebinarSuite(prompt: {
    topic: string;
    category: string;
    webinarType: WebinarType;
    niche: string;
    price?: number;
  }) {
    const { topic, category, webinarType, niche, price = 0 } = prompt;
    const cleanTopic = topic.trim() || `${niche} Mastery`;

    return {
      title: `${cleanTopic}: The Automated Client & Conversion Engine`,
      subtitle: `Discover how modern entrepreneurs in ${niche} are automating client discovery, scaling conversions, and earning recurring income.`,
      description: `Join us for this high-impact session designed specifically for ${niche} practitioners. We walk step-by-step through real client acquisition systems, automated funnel deployments, and instant double-entry commission tracking.`,
      suggestedPrice: price > 0 ? price : (webinarType.includes('paid') ? 49.00 : 0.00),
      agenda: [
        { id: 'a1', time: '00:00 - 15:00', title: `Introduction & The ${niche} Growth Opportunity`, speakerName: 'Keynote Host' },
        { id: 'a2', time: '15:00 - 40:00', title: 'Live System Blueprint: Lead Extraction & AI Workflows', speakerName: 'Lead Architect' },
        { id: 'a3', time: '40:00 - 60:00', title: 'Interactive Funnel Demonstration & Dynamic CTA Drop', speakerName: 'Growth Specialist' },
        { id: 'a4', time: '60:00 - 75:00', title: 'Live Attendee Q&A & Exclusive Fast-Action Bonuses', speakerName: 'All Speakers' },
      ],
      aiAssistant: {
        enabled: true,
        assistantName: 'Sophia AI Host',
        welcomeMessage: `👋 Welcome to '${cleanTopic}'! I am Sophia, your AI Session Host. Drop any questions into the chat!`,
        faqs: [
          { question: 'Will there be a recording?', answer: 'Yes! Lifetime replay access will be unlocked in your member dashboard.' },
          { question: 'What tools are required?', answer: 'Everything demonstrated is natively integrated into your DEOS workspace.' },
        ],
        autoModerateChat: true,
      },
      dynamicCTA: {
        id: `cta-${Date.now()}`,
        title: `Claim the ${cleanTopic} VIP Acceleration Package`,
        description: `Get instant access to complete workflow templates, CRM pipelines, and fast-action bonuses.`,
        buttonText: price > 0 ? `Unlock Access ($${price || 49})` : 'Join the VIP Growth Tier Now',
        buttonUrl: '/store',
        ctaType: 'buy_now' as const,
        triggerType: 'timestamp' as const,
        triggerTimestampSeconds: 40 * 60,
        price: price > 0 ? price : 49,
        active: true,
      },
      emailSequences: {
        invitation: `Subject: [Invitation] ${cleanTopic} Live Masterclass\n\nHey there,\n\nWe are hosting a private masterclass on "${cleanTopic}" tailored for entrepreneurs scaling in ${niche}.\n\nReserve your ticket here:\n[REGISTRATION_LINK]\n\nSee you inside!`,
        reminder24h: `Subject: [24 Hours Left] Your seat for ${cleanTopic}\n\nHi {{name}},\n\nJust a reminder that our live session on "${cleanTopic}" starts in exactly 24 hours!\n\nAccess room link: [ROOM_LINK]`,
        reminder1h: `Subject: [Starting in 60 Minutes] Access link for ${cleanTopic}\n\nHi {{name}},\n\nWe are opening the room in 1 hour. Grab your notepad:\n[ROOM_LINK]`,
        followUpOffer: `Subject: [Special Replay & Bonus] ${cleanTopic}\n\nHi {{name}},\n\nThank you for registering! The replay and exclusive bonuses are now live for the next 48 hours:\n[REPLAY_LINK]`,
      },
      socialPosts: {
        twitter: `🚀 Excited to announce our upcoming masterclass: "${cleanTopic}" for ${niche}! Grab your free ticket before seats fill up: [LINK] #Growth #Automation`,
        linkedin: `Scaling client revenue in ${niche}? Join us for a deep-dive masterclass on "${cleanTopic}". We will be showing real workflows and live Q&A. Register now: [LINK]`,
      }
    };
  }
};
