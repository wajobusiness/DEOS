import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Plus,
  Video,
  DollarSign,
  HelpCircle,
  QrCode,
  Printer
} from 'lucide-react';
import { Course } from '../types';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import {
  academyEngine,
  AcademyLesson,
  AcademyQuizQuestion,
  AcademyCertificate
} from '../engine/academyEngine';

export const AcademyHub: React.FC = () => {
  const { member } = useAuth();
  const activeUserId = member?.id || member?.memberCode || 'EVO-ID-000001';
  const activeUserName = member?.name || 'Member';

  const [activeTab, setActiveTab] = useState<string>('All');
  const [courses, setCourses] = useState<Course[]>(() => academyEngine.getCourses('All'));
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Lesson Player State
  const [courseLessons, setCourseLessons] = useState<AcademyLesson[]>([]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Quiz & Certification State
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<AcademyQuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ scorePercentage: number; passed: boolean; certificate?: AcademyCertificate } | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<AcademyCertificate | null>(null);
  const [userCertificates, setUserCertificates] = useState<AcademyCertificate[]>(() =>
    academyEngine.getUserCertificates(activeUserId)
  );

  // New Course Creator Modal State
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Marketing');
  const [courseDifficulty, setCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [courseLessonsCount, setCourseLessonsCount] = useState(6);
  const [courseInstructor, setCourseInstructor] = useState(activeUserName);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  const refreshAcademy = () => {
    setCourses(academyEngine.getCourses('All'));
    setUserCertificates(academyEngine.getUserCertificates(activeUserId));
  };

  useEffect(() => {
    refreshAcademy();
  }, [activeUserId]);

  // When a course is opened for learning
  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    const lessonsList = academyEngine.getLessonsForCourse(course.id);
    setCourseLessons(lessonsList);
    setActiveLessonIndex(0);
    const completed = academyEngine.getUserCompletedLessons(activeUserId, course.id);
    setCompletedLessonIds(completed);
    setIsTakingQuiz(false);
    setQuizResult(null);
    setQuizAnswers({});
  };

  // Toggle Lesson Completion
  const handleToggleLesson = (lessonId: string) => {
    if (!selectedCourse) return;
    const { completedLessonIds: updated, isCourseComplete } = academyEngine.toggleLessonCompletion(
      activeUserId,
      selectedCourse.id,
      lessonId
    );
    setCompletedLessonIds(updated);
    refreshAcademy();

    if (isCourseComplete) {
      alert(`🎉 Congratulations! You have completed all lessons in '${selectedCourse.title}'. Take the final assessment quiz to earn your verifiable Certificate of Completion!`);
    }
  };

  // Start Final Assessment Quiz
  const handleStartQuiz = () => {
    if (!selectedCourse) return;
    const questionsList = academyEngine.getQuizForCourse(selectedCourse.id);
    setQuizQuestions(questionsList);
    setIsTakingQuiz(true);
    setQuizAnswers({});
    setQuizResult(null);
  };

  // Submit Quiz Answers
  const handleSubmitQuiz = () => {
    if (!selectedCourse) return;
    const result = academyEngine.submitQuiz(
      activeUserId,
      activeUserName,
      selectedCourse.id,
      selectedCourse.title,
      quizAnswers
    );
    setQuizResult(result);
    if (result.passed && result.certificate) {
      setUserCertificates(prev => [result.certificate!, ...prev]);
      refreshAcademy();
    }
  };

  // Create Course Handler
  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    academyEngine.publishCourse({
      title: courseTitle,
      category: courseCategory,
      difficulty: courseDifficulty,
      lessonsCount: Number(courseLessonsCount) || 6,
      instructor: courseInstructor || activeUserName,
    });

    refreshAcademy();
    setShowCreateCourseModal(false);
    setCourseTitle('');
    alert(`🎉 Masterclass "${courseTitle}" published successfully to the Academy catalog!`);
  };

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.instructor || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeLesson = courseLessons[activeLessonIndex] || courseLessons[0];
  const progressPercent = courseLessons.length > 0 ? Math.round((completedLessonIds.length / courseLessons.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Top Banner: Continue Learning Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-500/20">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Entrepreneur Academy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Certified Masterclasses & Growth Curriculum
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Gain mastery in AI prospecting, sovereign e-commerce, automated sales pipelines, and multi-tier commission scaling.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => handleOpenCourse(courses[0])}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continue Learning</span>
            </button>
            <button
              onClick={() => setShowCreateCourseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Masterclass</span>
            </button>
          </div>
        </div>

        {/* User Academy Stats */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-auto">
          <div className="text-center px-2">
            <span className="text-[10px] text-indigo-200 block font-semibold">Courses</span>
            <span className="text-sm font-black text-white">{courses.length}</span>
          </div>
          <div className="text-center px-2 border-l border-white/10">
            <span className="text-[10px] text-indigo-200 block font-semibold">Completed</span>
            <span className="text-sm font-black text-emerald-400">
              {courses.filter(c => c.status === 'Completed').length}
            </span>
          </div>
          <div className="text-center px-2 border-l border-white/10">
            <span className="text-[10px] text-indigo-200 block font-semibold">Certificates</span>
            <span className="text-sm font-black text-amber-400">{userCertificates.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
          {['All', 'In Progress', 'Completed', 'Not Started'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search masterclasses & topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isComplete = course.status === 'Completed';
          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge variant={isComplete ? 'success' : course.status === 'In Progress' ? 'info' : 'neutral'} size="sm">
                      {course.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="text-[11px] font-semibold">{course.instructor || 'DEOS Academy'}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{course.rating} ({course.studentsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-black text-slate-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{course.lessonsCount} Modules</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.difficulty}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleOpenCourse(course)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isComplete ? 'Review Masterclass' : 'Start Course'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* VERIFIABLE CERTIFICATES VAULT */}
      {userCertificates.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>My Verifiable Certificates of Completion</span>
              </h3>
              <p className="text-xs text-slate-500">Issued and verified on the DEOS Digital Entrepreneur Ledger.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">{cert.verificationCode}</span>
                  <h5 className="font-bold text-slate-900 text-xs">{cert.courseTitle}</h5>
                  <span className="text-[11px] text-slate-500 block">Issued to {cert.studentName} on {cert.issueDate}</span>
                </div>
                <button
                  onClick={() => setViewingCertificate(cert)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>View</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE COURSE LEARNING PLAYER MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[92vh] overflow-hidden">
            {/* Player Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 truncate">
                <GraduationCap className="w-6 h-6 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <h4 className="text-sm font-black text-white truncate">{selectedCourse.title}</h4>
                  <span className="text-[10px] text-indigo-300 font-medium">Instructor: {selectedCourse.instructor} • {progressPercent}% Completed</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Main Stage & Lesson Playlist Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left Column: Video Stage / Quiz Assessment */}
              <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-4 border-r border-slate-100 flex flex-col justify-between">
                {!isTakingQuiz ? (
                  <div className="space-y-4">
                    {/* Embedded Video */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-lg border border-slate-800">
                      <iframe
                        src={`${activeLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}?autoplay=0`}
                        title={activeLesson?.title}
                        className="w-full h-full absolute inset-0 object-cover"
                        allowFullScreen
                      />
                    </div>

                    {/* Lesson Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">
                          Module {activeLessonIndex + 1} of {courseLessons.length}
                        </span>
                        <button
                          onClick={() => handleToggleLesson(activeLesson?.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            completedLessonIds.includes(activeLesson?.id)
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{completedLessonIds.includes(activeLesson?.id) ? 'Completed' : 'Mark as Complete'}</span>
                        </button>
                      </div>

                      <h3 className="text-base font-black text-slate-900">{activeLesson?.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{activeLesson?.description}</p>
                    </div>

                    {/* Summary Notes */}
                    {activeLesson?.summaryNotes && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Key Takeaways</span>
                        <ul className="list-disc pl-5 text-xs text-slate-700 font-semibold space-y-1">
                          {activeLesson.summaryNotes.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  /* QUIZ ASSESSMENT ENGINE */
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-black uppercase text-indigo-600">Final Assessment</span>
                      <h4 className="text-base font-black text-slate-900 mt-0.5">{selectedCourse.title} Certification Quiz</h4>
                      <p className="text-xs text-slate-500">Score 70% or higher to unlock your verifiable Certificate of Completion.</p>
                    </div>

                    <div className="space-y-4">
                      {quizQuestions.map((q, qIndex) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <h5 className="text-xs font-bold text-slate-900">
                            {qIndex + 1}. {q.question}
                          </h5>
                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                                  quizAnswers[q.id] === optIdx
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {quizResult && (
                      <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
                        quizResult.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}>
                        <h5 className="font-black text-sm">
                          {quizResult.passed ? '🎉 Congratulations! You Passed!' : 'Assessment Not Passed'}
                        </h5>
                        <p className="font-semibold">Final Score: {quizResult.scorePercentage}% (Threshold: 70%)</p>
                        {quizResult.passed && (
                          <p className="text-[11px] text-emerald-800">Your Certificate of Completion has been registered and verified on your profile.</p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setIsTakingQuiz(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                      >
                        Return to Lessons
                      </button>
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                      >
                        Submit Assessment
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Lesson Playlist & Progress Sidebar */}
              <div className="lg:col-span-4 p-4 sm:p-5 bg-slate-50 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-900">Course Syllabus</span>
                    <span className="text-[11px] font-bold text-indigo-600">{completedLessonIds.length} / {courseLessons.length} Done</span>
                  </div>

                  <div className="space-y-1.5">
                    {courseLessons.map((lesson, idx) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isCurrent = idx === activeLessonIndex && !isTakingQuiz;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            setActiveLessonIndex(idx);
                            setIsTakingQuiz(false);
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white border-slate-200/80 hover:border-indigo-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLesson(lesson.id);
                              }}
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                                isCompleted
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : isCurrent
                                  ? 'border-white/40 text-transparent'
                                  : 'border-slate-300 text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </button>
                            <div className="truncate">
                              <h5 className="font-bold text-xs truncate">{lesson.title}</h5>
                              <span className={`text-[10px] font-medium block ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final Exam Trigger */}
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <button
                    onClick={handleStartQuiz}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>Take Final Certification Exam</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIABLE CERTIFICATE PREVIEW & PRINT MODAL */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl border-4 border-amber-400/40 text-slate-900 space-y-6 relative overflow-hidden">
            {/* Background Decorative Seals */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-2 border-b-2 border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">DEOS Digital Entrepreneur Academy</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Certificate of Completion</h3>
            </div>

            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">This is to certify that</p>
              <h4 className="text-xl font-black text-indigo-950 font-serif">{viewingCertificate.studentName}</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                has successfully completed all prescribed coursework and passed the comprehensive assessment for
              </p>
              <h5 className="text-base font-black text-slate-900">{viewingCertificate.courseTitle}</h5>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
                <span className="font-bold text-slate-800">{viewingCertificate.issueDate}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Verification Code</span>
                <span className="font-mono font-bold text-indigo-600">{viewingCertificate.verificationCode}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MASTERCLASS MODAL */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-black text-slate-900">Publish New Academy Masterclass</h4>
              <button
                onClick={() => setShowCreateCourseModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass on AI Cold Outreach & Retainers"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Sales & Growth">Sales & Growth</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Affiliate Marketing">Affiliate Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={courseDifficulty}
                    onChange={(e) => setCourseDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Publish to Academy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
