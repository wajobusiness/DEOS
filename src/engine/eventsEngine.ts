import { EventItem, EventTicket, EventSpeaker, EventAgendaItem, Lead } from '../types';
import { supabase } from '../lib/supabaseClient';
import { crmEngine } from './crmEngine';

const STORAGE_EVENTS_KEY = 'eviona_events_master_v4';
const STORAGE_TICKETS_KEY = 'eviona_event_tickets_v4';

export const INITIAL_PLATFORM_EVENTS: EventItem[] = [];

export const eventsEngine = {
  // 1. Get All Events
  getEvents(filterStatus?: string): EventItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (saved) {
        const list: EventItem[] = JSON.parse(saved);
        if (Array.isArray(list)) {
          if (!filterStatus || filterStatus === 'All') return list;
          return list.filter(e => e.status.toLowerCase() === filterStatus.toLowerCase());
        }
      }
    } catch (e) {
      console.warn('[EventsEngine] Error loading events:', e);
    }
    return [];
  },

  // 2. Get Event By ID or Slug
  getEventById(idOrSlug: string): EventItem | undefined {
    const list = this.getEvents('All');
    return list.find(e => e.id === idOrSlug || e.slug === idOrSlug);
  },

  // 3. Create Event (User becomes the verified Host)
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

  // 6. Register Attendee for Event
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

    // 3. Ingest Lead into Organizer CRM (Tenant Scoped)
    try {
      crmEngine.addLead({
        ownerId: event.organizerId || 'EVO-ID-000001',
        ownerName: event.organizerName || 'Organizer',
        name: attendeeName.trim(),
        email: attendeeEmail.trim().toLowerCase(),
        phone: attendeePhone?.trim() || '',
        company: 'Event Attendee',
        source: `Registered for Event: ${event.title}`,
        status: 'New',
        stage: 'Qualified',
        dealValue: price > 0 ? price : 50,
      });
    } catch {}

    return { ticket: newTicket, event: { ...event, registered: event.registered + 1 } };
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

  // 10. AI Event Copywriter
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
