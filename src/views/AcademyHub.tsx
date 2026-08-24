import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Award,
  BookOpen,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  X,
  FileText,
  Download,
  Check,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { initialCourses } from '../store/mockData';
import { Course } from '../types';
import { Badge } from '../components/common/Badge';

export const AcademyHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Active Course Player State
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Introduction to the Eviona Architecture & Ecosystem', duration: '12:40', completed: true },
    { id: 2, title: 'Setting Up Your Multi-Tenant Digital Storefront', duration: '18:15', completed: true },
    { id: 3, title: 'CRM Lead Capture & Form Attribution Mastery', duration: '15:20', completed: true },
    { id: 4, title: 'High-Yield Market Positioning & Brand Strategy', duration: '22:10', completed: false },
    { id: 5, title: 'Scaling Binary Volume with 10% Flat Comp Model', duration: '28:35', completed: false },
  ]);

  const toggleLessonCompleted = (idx: number) => {
    setLessons(prev => prev.map((l, i) => i === idx ? { ...l, completed: !l.completed } : l));
  };

  const completedLessonsCount = lessons.filter(l => l.completed).length;
  const progressPercent = Math.round((completedLessonsCount / lessons.length) * 100);

  const filteredCourses = courses.filter(c => {
    if (activeTab === 'All') return true;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Continue Learning Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Entrepreneur Academy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Digital Entrepreneurship Masterclass
          </h2>
          <p className="text-xs text-indigo-200">
            Current Lesson: <b>{lessons[activeLessonIndex].title}</b>
          </p>

          {/* Progress Bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-indigo-200 font-bold">
              <span>Course Progress</span>
              <span>{progressPercent}% Complete ({completedLessonsCount}/{lessons.length} Lessons)</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setSelectedCourse(courses[0])}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-indigo-950" />
            <span>Open Interactive Player</span>
          </button>
          {progressPercent >= 60 && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Claim Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Course Catalog Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-black text-slate-900">Certified Academy Curriculum</h3>
            <p className="text-xs text-slate-500">Official platform masterclasses and peer creator tutorials.</p>
          </div>

          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {['All', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className="bg-white rounded-3xl border border-slate-200 shadow-card hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                      {c.level} • {c.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-600">{c.category}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{c.rating}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-3 pt-3 text-xs">
                <span className="font-bold text-slate-700">{c.instructor}</span>
                <span className="font-bold text-indigo-600 flex items-center gap-1">
                  Start Course <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Course Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row max-h-[90vh]">
            {/* Left: Video Player Simulation (8 cols) */}
            <div className="flex-1 flex flex-col bg-black">
              {/* Simulated Video Canvas */}
              <div className="relative aspect-video bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 cursor-pointer hover:scale-110 transition-transform mb-3">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                <h4 className="text-base font-bold">{lessons[activeLessonIndex].title}</h4>
                <span className="text-xs text-slate-400 mt-1">Duration: {lessons[activeLessonIndex].duration} • 1080p Full HD</span>
              </div>

              {/* Lesson Controls & Description */}
              <div className="p-6 bg-slate-900/80 text-white flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{selectedCourse.title}</h3>
                  <button
                    onClick={() => toggleLessonCompleted(activeLessonIndex)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      lessons[activeLessonIndex].completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lessons[activeLessonIndex].completed ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In this session, you will learn the exact operational frameworks required to automate digital customer acquisition, setup custom domain DNS mapping, and leverage the 10% flat binary volume structure.
                </p>
              </div>
            </div>

            {/* Right: Lesson Playlist (4 cols) */}
            <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Syllabus</span>
                <button onClick={() => setSelectedCourse(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1 max-h-96">
                {lessons.map((l, i) => (
                  <div
                    key={l.id}
                    onClick={() => setActiveLessonIndex(i)}
                    className={`p-3.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      activeLessonIndex === i ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        l.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {l.completed ? '✓' : i + 1}
                      </div>
                      <span className="truncate max-w-[170px]">{l.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{l.duration}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-gradient-to-b from-indigo-950 to-slate-950 text-white rounded-3xl p-8 shadow-2xl border border-indigo-500/40 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-lg shadow-amber-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Eviona Certified Entrepreneur</span>
              <h3 className="text-2xl font-black">Certificate of Completion</h3>
              <p className="text-xs text-slate-300">Awarded to you for mastering the Digital Entrepreneurship Fundamentals & Operating System.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-indigo-300 space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Credential ID:</span>
                <span className="text-white font-bold">EVO-CERT-2026-9821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verification Hash:</span>
                <span className="text-emerald-400">0x8a9b...7c6d (Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issued On:</span>
                <span className="text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  alert('Certificate PDF downloaded.');
                  setShowCertificateModal(false);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
