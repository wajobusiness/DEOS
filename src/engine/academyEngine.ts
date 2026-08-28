import { Course } from '../types';

export interface AcademyLesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  summaryNotes?: string[];
  resources?: Array<{ name: string; url: string }>;
}

export interface AcademyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AcademyCertificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentId: string;
  scorePercentage: number;
  issueDate: string;
  verificationCode: string;
}

const STORAGE_ACADEMY_COURSES_KEY = 'eviona_academy_courses_v2';
const STORAGE_USER_PROGRESS_PREFIX = 'eviona_user_academy_progress_';
const STORAGE_USER_CERTS_PREFIX = 'eviona_user_academy_certs_';

export const INITIAL_ACADEMY_COURSES: Course[] = [
  {
    id: 'CRS-101',
    title: 'Digital Entrepreneurship Operating System (DEOS) Core Blueprint',
    category: 'Architecture & Strategy',
    difficulty: 'Beginner',
    lessonsCount: 6,
    completedLessons: 4,
    rating: 4.9,
    studentsCount: 1420,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    instructor: 'DEOS Engineering Core',
    status: 'In Progress',
  },
  {
    id: 'CRS-102',
    title: 'AI Lead Generation & Prospect Intelligence Mastery',
    category: 'Sales & Growth',
    difficulty: 'Intermediate',
    lessonsCount: 5,
    completedLessons: 5,
    rating: 5.0,
    studentsCount: 980,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    instructor: 'Alex Mercer',
    status: 'Completed',
  },
  {
    id: 'CRS-103',
    title: 'High-Ticket Creator Storefronts & E-Commerce Scaling',
    category: 'E-Commerce',
    difficulty: 'Advanced',
    lessonsCount: 8,
    completedLessons: 0,
    rating: 4.8,
    studentsCount: 640,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    instructor: 'Elena Rostova',
    status: 'Not Started',
  },
  {
    id: 'CRS-104',
    title: 'Multi-Tier Affiliate Scaling & Binary Team Acceleration',
    category: 'Affiliate Marketing',
    difficulty: 'Intermediate',
    lessonsCount: 6,
    completedLessons: 2,
    rating: 4.9,
    studentsCount: 1120,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    instructor: 'David Sterling',
    status: 'In Progress',
  },
];

export const COURSE_LESSONS_MAP: Record<string, AcademyLesson[]> = {
  'CRS-101': [
    {
      id: 'L-101-1',
      courseId: 'CRS-101',
      title: 'Introduction to the DEOS Sovereign Entrepreneur Architecture',
      duration: '12:40',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Understand the multi-tenant isolation, shared global marketplace, and fixed utility EVO token economy.',
      summaryNotes: ['Multi-tenant data isolation boundary', 'Double-entry wallet financial ledger', 'Global marketplace and course catalog interoperability'],
    },
    {
      id: 'L-101-2',
      courseId: 'CRS-101',
      title: 'Deploying Your Custom Tenant Storefront & Landing Page',
      duration: '18:15',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Configure your custom domain mapping, hero headlines, product catalogs, and contact lead capture forms.',
      summaryNotes: ['Subdomain routing & CNAME mapping', '1-Click digital asset delivery', 'Custom color themes and brand identity'],
    },
    {
      id: 'L-101-3',
      courseId: 'CRS-101',
      title: 'CRM Lead Pipelines & Automated Contact Ingestion',
      duration: '15:20',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Master Kanban deal stages, lead scoring, activity transcripts, and 1-click lead import pipelines.',
      summaryNotes: ['Lead qualification stages', 'Automated email sequence triggers', 'Deal probability and value calculation'],
    },
    {
      id: 'L-101-4',
      courseId: 'CRS-101',
      title: 'Deploying 24/7 AI Business Chatbots & Knowledge Bases',
      duration: '22:10',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Train contextual AI bots on your business documents and embed them onto your landing page.',
      summaryNotes: ['Document vector indexing', 'Lead qualification trigger questions', 'Embeddable JavaScript snippet deployment'],
    },
    {
      id: 'L-101-5',
      courseId: 'CRS-101',
      title: 'Double-Entry Financial Ledger, Multi-Rail Payments & EVO Token',
      duration: '20:30',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Explore Paystack, USDT crypto, bank transfers, instant internal transfers, and the withdrawal queue.',
      summaryNotes: ['Immutable financial ledger', 'Real-time Paystack inline popup checkout', 'Instant peer-to-peer wallet transfers'],
    },
    {
      id: 'L-101-6',
      courseId: 'CRS-101',
      title: 'Final Certification Assessment & Growth Tier Roadmap',
      duration: '14:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Review key takeaways, pass the final assessment quiz, and generate your verifiable completion certificate.',
      summaryNotes: ['Course quiz review', 'Verifiable certificate generation', 'Next steps to scale your enterprise'],
    },
  ],
};

export const COURSE_QUIZZES_MAP: Record<string, AcademyQuizQuestion[]> = {
  'CRS-101': [
    {
      id: 'Q1',
      question: 'What is the utility value ratio of the EVO Token in the double-entry wallet ledger?',
      options: [
        '$1.00 USD = 1.00 EVO',
        '$10.00 USD = 1.00 EVO',
        'Floating market rate based on DEX liquidity',
        '0.50 USD = 1.00 EVO',
      ],
      correctAnswerIndex: 0,
      explanation: 'In strict compliance with Book 0 & Book 4, the EVO token is fixed at $1.00 USD = 1.00 EVO as a stable accounting unit.',
    },
    {
      id: 'Q2',
      question: 'Where should private tenant assets like CRM leads and email sequences be stored?',
      options: [
        'In global public tables without user scoping',
        'In tenant-isolated storage partitioned strictly by member_id',
        'In temporary browser memory only',
        'In the Super Admin master account',
      ],
      correctAnswerIndex: 1,
      explanation: 'DEOS enforces strict multi-tenancy where private assets are strictly partitioned by member_id.',
    },
    {
      id: 'Q3',
      question: 'How are affiliate commissions credited when a customer completes an in-webinar purchase?',
      options: [
        'Manually mailed via physical check at end of month',
        'Instantly credited to the member wallet via double-entry ledger',
        'Stored as pending for 90 days with no record',
        'Split evenly among all platform users',
      ],
      correctAnswerIndex: 1,
      explanation: 'All sales trigger instant double-entry wallet credits to the vendor and affiliate according to Book 4 & 19.',
    },
  ],
};

export const academyEngine = {
  // 1. Get Course Catalog
  getCourses(statusFilter?: string): Course[] {
    try {
      const saved = localStorage.getItem(STORAGE_ACADEMY_COURSES_KEY);
      if (saved) {
        const parsed: Course[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!statusFilter || statusFilter === 'All') return parsed;
          return parsed.filter(c => c.status === statusFilter);
        }
      }
    } catch {}

    localStorage.setItem(STORAGE_ACADEMY_COURSES_KEY, JSON.stringify(INITIAL_ACADEMY_COURSES));
    if (!statusFilter || statusFilter === 'All') return INITIAL_ACADEMY_COURSES;
    return INITIAL_ACADEMY_COURSES.filter(c => c.status === statusFilter);
  },

  // 2. Get Lessons for a Course
  getLessonsForCourse(courseId: string): AcademyLesson[] {
    return COURSE_LESSONS_MAP[courseId] || [
      {
        id: `L-${courseId}-1`,
        courseId,
        title: 'Module 1: Strategic Foundations & Core Workflows',
        duration: '15:00',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Comprehensive walkthrough of key systems, actionable frameworks, and tactical implementation.',
        summaryNotes: ['System architecture overview', 'Step-by-step setup guide', 'Best practice implementation checklist'],
      },
      {
        id: `L-${courseId}-2`,
        courseId,
        title: 'Module 2: Advanced Execution & Rapid Scaling Playbook',
        duration: '22:30',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Deep-dive tactical methods to scale client acquisition, optimize conversion funnels, and maximize ROI.',
        summaryNotes: ['Conversion rate optimization', 'Automated nurturing pipelines', 'Revenue acceleration frameworks'],
      },
    ];
  },

  // 3. Get Completed Lessons for User
  getUserCompletedLessons(userId: string, courseId: string): string[] {
    try {
      const key = `${STORAGE_USER_PROGRESS_PREFIX}${userId}_${courseId}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['L-101-1', 'L-101-2', 'L-101-3', 'L-101-4']; // Default progress for starter course
  },

  // 4. Mark Lesson Completed / Toggle
  toggleLessonCompletion(userId: string, courseId: string, lessonId: string): { completedLessonIds: string[]; isCourseComplete: boolean } {
    const current = this.getUserCompletedLessons(userId, courseId);
    let updated: string[];
    if (current.includes(lessonId)) {
      updated = current.filter(id => id !== lessonId);
    } else {
      updated = [...current, lessonId];
    }

    const key = `${STORAGE_USER_PROGRESS_PREFIX}${userId}_${courseId}`;
    localStorage.setItem(key, JSON.stringify(updated));

    const allLessons = this.getLessonsForCourse(courseId);
    const isCourseComplete = allLessons.length > 0 && allLessons.every(l => updated.includes(l.id));

    // Update course status in catalog
    const allCourses = this.getCourses('All');
    const updatedCourses = allCourses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          completedLessons: updated.length,
          status: isCourseComplete ? ('Completed' as const) : updated.length > 0 ? ('In Progress' as const) : ('Not Started' as const),
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_ACADEMY_COURSES_KEY, JSON.stringify(updatedCourses));

    return { completedLessonIds: updated, isCourseComplete };
  },

  // 5. Get Quiz for Course
  getQuizForCourse(courseId: string): AcademyQuizQuestion[] {
    return COURSE_QUIZZES_MAP[courseId] || [
      {
        id: 'Q1',
        question: 'What is the primary objective of automated client acquisition pipelines in DEOS?',
        options: [
          'Manual cold calling with spreadsheets',
          'Automated prospect discovery, 0-token enrichment, and CRM synchronization',
          'Relying solely on organic word of mouth',
          'Purchasing unverified third-party email lists',
        ],
        correctAnswerIndex: 1,
        explanation: 'DEOS automates discovery, data enrichment, and CRM ingestion into an orchestrated sales pipeline.',
      },
    ];
  },

  // 6. Grade Quiz & Issue Certificate
  submitQuiz(userId: string, studentName: string, courseId: string, courseTitle: string, answers: Record<string, number>): { scorePercentage: number; passed: boolean; certificate?: AcademyCertificate } {
    const quiz = this.getQuizForCourse(courseId);
    let correct = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const scorePercentage = Math.round((correct / quiz.length) * 100);
    const passed = scorePercentage >= 70;

    let cert: AcademyCertificate | undefined;
    if (passed) {
      cert = {
        id: `CERT-${Date.now().toString().slice(-6)}`,
        courseId,
        courseTitle,
        studentName: studentName || 'Certified Member',
        studentId: userId || 'EVO-ID-000001',
        scorePercentage,
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        verificationCode: `DEOS-VERIFY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      };

      const certKey = `${STORAGE_USER_CERTS_PREFIX}${userId}`;
      try {
        const savedCerts = localStorage.getItem(certKey);
        const certs: AcademyCertificate[] = savedCerts ? JSON.parse(savedCerts) : [];
        certs.unshift(cert);
        localStorage.setItem(certKey, JSON.stringify(certs));
      } catch {}
    }

    return { scorePercentage, passed, certificate: cert };
  },

  // 7. Get User Certificates
  getUserCertificates(userId: string): AcademyCertificate[] {
    try {
      const certKey = `${STORAGE_USER_CERTS_PREFIX}${userId}`;
      const saved = localStorage.getItem(certKey);
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default starter certificate
    return [
      {
        id: 'CERT-102941',
        courseId: 'CRS-102',
        courseTitle: 'AI Lead Generation & Prospect Intelligence Mastery',
        studentName: 'Certified Entrepreneur',
        studentId: userId || 'EVO-ID-000001',
        scorePercentage: 100,
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        verificationCode: 'DEOS-VERIFY-9A82KZ1',
      },
    ];
  },

  // 8. Publish New Course as Creator
  publishCourse(course: Omit<Course, 'id' | 'rating' | 'studentsCount' | 'completedLessons' | 'status'>): Course {
    const newCourse: Course = {
      ...course,
      id: `CRS-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      studentsCount: 1,
      completedLessons: 0,
      status: 'Not Started',
      image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    };

    const current = this.getCourses('All');
    const updated = [newCourse, ...current];
    localStorage.setItem(STORAGE_ACADEMY_COURSES_KEY, JSON.stringify(updated));
    return newCourse;
  },
};
