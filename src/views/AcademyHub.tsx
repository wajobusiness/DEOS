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
  Check
} from 'lucide-react';
import { initialCourses } from '../store/mockData';
import { Course } from '../types';
import { Badge } from '../components/common/Badge';

export const AcademyHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(3);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const lessons = [
    { id: 1, title: 'Introduction to the DEOS Architecture & Ecosystem', duration: '12:40', completed: true },
    { id: 2, title: 'Setting Up Your Multi-Tenant Digital Storefront', duration: '18:15', completed: true },
    { id: 3, title: 'CRM Lead Capture & Form Attribution Mastery', duration: '15:20', completed: true },
    { id: 4, title: 'High-Yield Market Positioning & Brand Strategy', duration: '22:10', completed: false },
    { id: 5, title: 'Scaling Binary Volume with 10% Flat Comp Model', duration: '28:35', completed: false },
  ];

  const filteredCourses = courses.filter(c => {
    if (activeTab === 'All') return true;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Banner: Continue Learning Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Entrepreneur Academy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Digital Entrepreneurship Fundamentals
          </h2>
          <p className="text-xs text-indigo-200">
            Current Lesson: <b>Module 4 • High-Yield Market Positioning & Brand Strategy</b>
          </p>

          {/* Progress Bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-indigo-200 font-bold">
              <span>Course Progress</span>
              <span>65% Complete (13/20 Lessons)</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 w-[65%]" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedCourse(courses[0])}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4 fill-indigo-950" />
          <span>Continue Lesson</span>
        </button>
      </div>

      {/* Overview Statistics & Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Ring & Stats (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
            <Badge variant="purple" size="sm">Certified Track</Badge>
          </div>

          <div className="flex items-center gap-4 my-auto">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EEF2FF" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#4F46E5" strokeWidth="4" strokeDasharray="72 100" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-slate-900">72%</span>
                <span className="text-[8px] text-slate-400">Completed</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Completed Courses</span>
                <span className="font-bold text-emerald-600">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">In Progress</span>
                <span className="font-bold text-indigo-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Certificates Earned</span>
                <span className="font-bold text-purple-600">6</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>View Verified Certificates</span>
          </button>
        </div>

        {/* Live Masterclasses & Workshops (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Upcoming Live Masterclasses</h4>
            <Badge variant="success" size="sm">● Live Q&A</Badge>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Scaling Your Binary Network to $50k/mo', host: 'Dr. Marcus Vance', date: 'Tomorrow, 06:00 PM GMT', attendees: '412 Registered' },
              { title: 'AI Marketing Automation Masterclass', host: 'Elena Rostova', date: 'Friday, 02:00 PM GMT', attendees: '289 Registered' },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{m.title}</h5>
                  <p className="text-[10px] text-slate-500">Instructor: {m.host} • {m.date}</p>
                </div>
                <button
                  onClick={() => alert(`Registered for ${m.title}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Course Curriculum & Masterclasses</h3>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {['All', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === tab ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2">
                    <Badge variant="purple" size="sm">{course.difficulty}</Badge>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{course.lessonsCount} Lessons</span>
                    <span>•</span>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 pt-2">
                  <span>{course.completedLessons}/{course.lessonsCount} Complete</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Lesson Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-400">Module 4: High-Yield Positioning (22:10)</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1 overflow-hidden">
              {/* Video Player Box (8 cols) */}
              <div className="lg:col-span-8 bg-black rounded-2xl aspect-video flex items-center justify-center relative border border-slate-800 overflow-hidden">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/40">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">Click to Resume Lesson</p>
                </div>
              </div>

              {/* Lesson Syllabus (4 cols) */}
              <div className="lg:col-span-4 bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-y-auto space-y-2 text-xs">
                <p className="font-bold text-[10px] uppercase text-slate-500 pb-1">Course Modules</p>
                {lessons.map((les, idx) => (
                  <div
                    key={les.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      activeLessonIndex === idx
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs leading-snug">{les.title}</p>
                      <p className="text-[10px] text-slate-500">{les.duration}</p>
                    </div>
                    {les.completed && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400">Lesson progress is automatically synced with your member certificate.</span>
              <button
                onClick={() => {
                  alert('Lesson marked complete!');
                  setSelectedCourse(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md"
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Certificate of Completion</h3>
              <p className="text-xs text-slate-500">Verified Blockchain Verification ID: <code>DEOS-CERT-99824</code></p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-slate-900 space-y-2">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Awarded To</p>
              <h4 className="text-xl font-black">John Doe</h4>
              <p className="text-xs text-slate-600">For successfully mastering the Digital Entrepreneurship Curriculum</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCertificateModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Close
              </button>
              <button onClick={() => alert('Certificate PDF downloaded.')} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
