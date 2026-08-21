import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { initialEvents } from '../store/mockData';
import { Badge } from '../components/common/Badge';

export const EventsWebinars: React.FC = () => {
  const [filterTab, setFilterTab] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredEvents = initialEvents.filter(e => {
    if (filterTab === 'All') return true;
    return e.status === filterTab;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 4 KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Events</span>
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">24</h3>
          <p className="text-xs text-slate-400 mt-1">Across all categories</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Live Webinars</span>
            <Video className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">16</h3>
          <p className="text-xs text-slate-400 mt-1">Virtual sessions</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Registrations</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">1,248</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">892 Attended</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Ticket Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$8,460</h3>
          <p className="text-xs text-slate-400 mt-1">Direct box office</p>
        </div>
      </div>

      {/* Main Grid: Event Feed (8 cols) + Calendar Month View (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Events Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              {['All', 'Upcoming', 'Live', 'Past'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTab(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterTab === t
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Host New Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0 text-indigo-700">
                    <CalendarIcon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                      <Badge variant={event.status === 'Live' ? 'danger' : 'info'} size="sm">
                        {event.category}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.date} • {event.time}</span>
                      <span>Instructor: <strong className="text-slate-700">{event.instructor}</strong></span>
                    </div>

                    {/* Capacity Bar */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-36 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {event.registered}/{event.capacity} Registered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {event.status === 'Live' ? (
                    <button
                      onClick={() => alert('Opening live broadcast studio')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5 animate-pulse"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Enter Live Room</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('Managing event details')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    >
                      Manage Event
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Calendar Month (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">May 2025 Calendar</h4>
              <div className="flex gap-1 text-slate-400">
                <button className="p-1 hover:text-slate-700"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 hover:text-slate-700"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isEvent = day === 10 || day === 15 || day === 28;
                const isToday = day === 24;

                return (
                  <div
                    key={day}
                    className={`py-2 rounded-lg font-semibold transition-all ${
                      isToday
                        ? 'bg-indigo-600 text-white font-bold'
                        : isEvent
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 mt-6">
            <b>DEOS Studio:</b> Integrated WebRTC streaming with automatic recording and course publishing.
          </div>
        </div>
      </div>
    </div>
  );
};

