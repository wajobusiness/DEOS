import { EventItem, EventTicket, EventSpeaker, EventAgendaItem, Lead } from '../types';
import { supabase } from '../lib/supabaseClient';

const STORAGE_EVENTS_KEY = 'eviona_events_master_v3';
const STORAGE_TICKETS_KEY = 'eviona_event_tickets_v3';
const STORAGE_CRM_LEADS_KEY = 'eviona_crm_leads_v2';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'EVT-001',
    slug: 'global-entrepreneur-summit-2025',
    title: 'Global Entrepreneur & AI Summit 2025',
    subtitle: 'Scale your online enterprise with multi-channel automation & decentralized finance',
    description: 'Join over 1,000 top creators, agency owners, and MLM network leaders for 2 days of intensive keynote sessions, live funnel workshops, and decentralized commerce breakthroughs.',
    category: 'Conference & Summit',
    format: 'online_webinar',
    date: 'Jun 15, 2025',
    time: '02:00 PM EST',
    endTime: '06:00 PM EST',
    timezone: 'EST (New York)',
    instructor: 'Alex Rivera & Guests',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    organizerId: 'EVO-ID-100245',
    organizerName: 'Eviona Global Labs',
    organizerEmail: 'events@evionaecosystem.com',
    venue: 'Eviona Virtual Broadcast Studio (Room #1)',
    meetingLink: 'https://zoom.us/j/98127391823',
    meetingPlatform: 'Zoom / Eviona Studio',
    registered: 482,
    capacity: 1000,
    checkedInCount: 310,
    revenue: 14460,
    isPaid: true,
    ticketPrice: 29.00,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    replayUrl: 'https://evionaecosystem.com/replays/summit-2025',
    status: 'Upcoming',
    visibility: 'public',
    speakers: [
      {
        id: 'spk-1',
        name: 'Alex Rivera',
        role: 'Chief Architect, Eviona',
        company: 'Eviona Labs',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        bio: 'Pioneered decentralized affiliate networks and AI revenue architectures for over 50,000 active entrepreneurs.',
        topic: 'The Future of AI Automation & Multi-Tier Affiliate Networks',
      },
      {
        id: 'spk-2',
        name: 'Elena Rostova',
        role: 'Founder & CEO',
        company: 'Apex Scale Agency',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        bio: 'Scaled 12 DTC brands to 8-figures through high-converting evergreen funnel systems.',
        topic: 'Converting Cold Traffic into 7-Figure Repeat Customers',
      }
    ],
    agenda: [
      { id: 'ag-1', time: '02:00 PM', title: 'Opening Keynote: The 2025 AI Commerce Playbook', speakerName: 'Alex Rivera' },
      { id: 'ag-2', time: '03:15 PM', title: 'Workshop: Automated Funnels & CRM Lead Nurturing', speakerName: 'Elena Rostova' },
      { id: 'ag-3', time: '04:45 PM', title: 'Live Q&A & Box Office Networking', speakerName: 'All Speakers' },
    ],
    faqs: [
      { question: 'Will this summit be recorded?', answer: 'Yes! All registered ticket holders receive lifetime access to the HD video recordings and downloadable session slides.' },
      { question: 'How do I join the live room?', answer: 'Your digital ticket with your secure Zoom/Eviona studio access link is generated immediately upon registration.' }
    ],
    tags: ['AI', 'Affiliate Marketing', 'Scaling', 'SaaS'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'EVT-002',
    slug: 'affiliate-masterclass-live',
    title: '6-Figure Affiliate Mastery Live Workshop',
    subtitle: 'Hands-on blueprint to generating recurring monthly commissions',
    description: 'Learn step-by-step how to leverage Eviona’s 10% binary network, direct product storefronts, and automated email workflows to hit top leader ranks.',
    category: 'Training & Education',
    format: 'youtube_live',
    date: 'May 30, 2025',
    time: '07:00 PM EST',
    endTime: '08:30 PM EST',
    timezone: 'EST (New York)',
    instructor: 'Marcus Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    organizerId: 'EVO-ID-100245',
    organizerName: 'Eviona Academy',
    venue: 'YouTube Live Broadcast',
    meetingLink: 'https://youtube.com/live/demo123',
    meetingPlatform: 'YouTube Live',
    registered: 312,
    capacity: 500,
    checkedInCount: 184,
    revenue: 0,
    isPaid: false,
    ticketPrice: 0,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Live',
    visibility: 'public',
    speakers: [
      {
        id: 'spk-3',
        name: 'Marcus Vance',
        role: 'Top Affiliate Producer',
        company: 'Vance Capital',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        bio: 'Ranked Diamond Director with over $1.2M in verified team volume and promoter payouts.',
        topic: 'Mastering the 10% Binary Compensation Engine',
      }
    ],
    agenda: [
      { id: 'ag-4', time: '07:00 PM', title: 'Setting Up Your Personal Storefront & Affiliate Links', speakerName: 'Marcus Vance' },
      { id: 'ag-5', time: '07:45 PM', title: 'Live Demonstration: Launching Organic Campaigns', speakerName: 'Marcus Vance' },
    ],
    tags: ['Affiliate', 'Webinar', 'Free Training'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'EVT-003',
    slug: 'evergreen-recruitment-webinar',
    title: 'Automated Wealth: The Eviona Ecosystem Opportunity',
    subtitle: 'Evergreen on-demand presentation for prospective team members',
    description: 'Discover how ordinary professionals are building automated digital agencies and earning passive team overrides using Eviona’s decentralized infrastructure.',
    category: 'Recruitment & Opportunity',
    format: 'prerecorded_evergreen',
    date: 'On-Demand (24/7)',
    time: 'Instant Stream',
    timezone: 'Global',
    instructor: 'David Sterling',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    organizerId: 'EVO-ID-100245',
    organizerName: 'Eviona Business Center',
    venue: 'Instant Video Stream',
    meetingLink: 'https://evionaecosystem.com/webinar/evergreen-opportunity',
    meetingPlatform: 'Eviona Evergreen Player',
    registered: 890,
    capacity: 99999,
    checkedInCount: 740,
    revenue: 0,
    isPaid: false,
    ticketPrice: 0,
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Upcoming',
    visibility: 'public',
    speakers: [
      {
        id: 'spk-4',
        name: 'David Sterling',
        role: 'VP of Growth',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        bio: 'Leading global community expansion and partner enablement across 42 countries.',
        topic: 'Decentralized Ecosystem Overview & Founder Plan Breakdown',
      }
    ],
    tags: ['Recruitment', 'Evergreen', 'On Demand'],
    createdAt: new Date().toISOString(),
  }
];

export const eventsEngine = {
  // 1. Get All Events
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
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  },

  // 2. Get Event By ID or Slug
  getEventById(idOrSlug: string): EventItem | undefined {
    const list = this.getEvents('All');
    return list.find(e => e.id === idOrSlug || e.slug === idOrSlug);
  },

  // 3. Create Event
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
      image: eventData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      bannerImage: eventData.bannerImage || eventData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      status: eventData.status || 'Upcoming',
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

  // 4. Register Attendee for Event (with CRM ingestion, ticket generation & reminder workflows)
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

    // 1. Save Ticket to Tickets Registry
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
        };
      }
      return e;
    });
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updatedEvents));

    // 3. Ingest Lead into Organizer CRM
    try {
      const savedLeads = localStorage.getItem(STORAGE_CRM_LEADS_KEY);
      const leads: Lead[] = savedLeads ? JSON.parse(savedLeads) : [];
      const newLead: Lead = {
        id: `LED-${Date.now().toString().slice(-4)}`,
        name: attendeeName.trim(),
        email: attendeeEmail.trim().toLowerCase(),
        phone: attendeePhone?.trim() || '',
        company: 'Event Attendee',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        leadSource: 'member_landing_page',
        ownerType: 'member',
        ownerId: event.organizerId || 'EVO-ID-100245',
        ownerName: event.organizerName || 'Organizer',
        source: `Registered for Event: ${event.title}`,
        status: 'New',
        stage: 'Qualified',
        dealValue: price > 0 ? price : 500,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      leads.unshift(newLead);
      localStorage.setItem(STORAGE_CRM_LEADS_KEY, JSON.stringify(leads));
    } catch {}

    return { ticket: newTicket, event: { ...event, registered: event.registered + 1 } };
  },

  // 5. Get User Tickets
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

  // 6. Check In Attendee
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

  // 7. AI Event Copywriter
  generateAIEventContent(prompt: { topic: string; category: string; format: string }) {
    const { topic, category, format } = prompt;
    const cleanTopic = topic.trim() || 'Digital Business Mastery';

    return {
      title: `${cleanTopic}: The High-Performance Summit`,
      subtitle: `Master automated client acquisition, multi-tier affiliate growth, and AI workflows with top industry leaders.`,
      description: `Join us for an intensive masterclass engineered for entrepreneurs and agency builders. We break down the exact playbooks to scale your monthly revenue using decentralized tools and automated marketing funnels.`,
      suggestedPrice: category === 'Conference & Summit' ? 49.00 : 0.00,
      agenda: [
        { id: 'a1', time: '02:00 PM', title: 'Keynote: Navigating the 2025 Decentralized Economy', speakerName: 'Lead Speaker' },
        { id: 'a2', time: '03:00 PM', title: 'Live Case Study: Rapid Funnel & Storefront Deployment', speakerName: 'Guest Strategist' },
        { id: 'a3', time: '04:15 PM', title: 'Q&A, VIP Breakout Sessions & Box Office Networking', speakerName: 'All Speakers' },
      ],
      promotionalEmail: `Subject: Exclusive Invitation: ${cleanTopic} Live Event\n\nHey there,\n\nWe are hosting a private live session on "${cleanTopic}" to share our exact scaling frameworks.\n\nSeats are strictly limited to ensure direct interaction and live Q&A. Claim your ticket now:\n[EVENT_LINK]\n\nSee you inside!`,
    };
  }
};
