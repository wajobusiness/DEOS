import { Member, TreeNode, WalletTransaction, Product, Lead, Deal, Course, EventItem, TeamMember, SystemStatus } from '../types';

export const currentUser: Member = {
  id: 'EVO100245',
  name: 'John Doe',
  email: 'john.doe@evionaecosystem.com',
  phone: '+234 801 234 5678',
  country: 'Nigeria',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'growth',
  role: 'member',
  status: 'active',
  memberSince: 'May 12, 2024',
  renewalDate: 'May 12, 2025',
  rank: 'Director',
  nextRank: 'Regional Director',
  walletBalance: 0.00,
  tokenBalance: 0.00,
  availableBalance: 0.00,
  binaryVolume: 0,
  activeReferrals: 0,
};

export const initialBinaryTree: TreeNode = {
  id: 'EVO100245',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'You (Director)',
  leg: 'root',
  status: 'active',
  bv: 24560,
  children: [
    {
      id: 'EVO-L1',
      name: 'Lisa Brown',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Left Leg (128)',
      leg: 'left',
      status: 'active',
      bv: 12280,
      children: [
        {
          id: 'EVO-L2A',
          name: 'Samuel K.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Active Member',
          leg: 'left',
          status: 'active',
          bv: 6140
        },
        {
          id: 'EVO-L2B',
          name: 'Ruth A.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
          role: 'Active Member',
          leg: 'right',
          status: 'active',
          bv: 6140
        }
      ]
    },
    {
      id: 'EVO-R1',
      name: 'Grace John',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Right Leg (128)',
      leg: 'right',
      status: 'active',
      bv: 12280,
      children: [
        {
          id: 'EVO-R2A',
          name: 'Emeka O.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          role: 'Active Member',
          leg: 'left',
          status: 'active',
          bv: 6140
        },
        {
          id: 'EVO-R2B',
          name: 'Joy C.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          role: 'Active Member',
          leg: 'right',
          status: 'active',
          bv: 6140
        }
      ]
    }
  ]
};

export const initialTransactions: WalletTransaction[] = [];

export const initialProducts: Product[] = [
  {
    id: 'PRD-01',
    title: 'AI Business Mastery & Prompt Engineering Course',
    category: 'Courses',
    price: 197.00,
    affiliateCommissionRate: 0.50,
    salesCount: 1250,
    rating: 4.9,
    reviewsCount: 324,
    sellerName: 'Marcus Vance',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-02',
    title: 'High-Converting SaaS Landing Page UI Kit (Next.js & Tailwind)',
    category: 'Templates',
    price: 97.00,
    affiliateCommissionRate: 0.40,
    salesCount: 980,
    rating: 4.8,
    reviewsCount: 215,
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-03',
    title: 'PromptEngine Pro — 5,000+ Copywriting & Marketing Prompts',
    category: 'AI Tools',
    price: 67.00,
    affiliateCommissionRate: 0.45,
    salesCount: 1420,
    rating: 4.9,
    reviewsCount: 412,
    sellerName: 'Nexus AI Labs',
    sellerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80',
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-04',
    title: 'Full-Stack Sales Funnel & Domain Integration Setup Service',
    category: 'Services',
    price: 499.00,
    affiliateCommissionRate: 0.30,
    salesCount: 310,
    rating: 5.0,
    reviewsCount: 89,
    sellerName: 'Apex Agency Group',
    sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-05',
    title: 'Multi-Tenant Micro-SaaS Boilerplate (TypeScript, Prisma, Stripe)',
    category: 'Software',
    price: 149.00,
    affiliateCommissionRate: 0.40,
    salesCount: 680,
    rating: 4.8,
    reviewsCount: 174,
    sellerName: 'DevSprint Labs',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-06',
    title: 'Viral Video Hooks & Reels Production Vault (1,200+ Assets)',
    category: 'Digital Products',
    price: 47.00,
    affiliateCommissionRate: 0.50,
    salesCount: 2150,
    rating: 4.9,
    reviewsCount: 640,
    sellerName: 'CreativeForge',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80'
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'LED-101',
    name: 'Sarah Johnson',
    email: 'sarah.j@techflow.io',
    phone: '+1 555 234 5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    company: 'TechFlow Inc.',
    leadSource: 'member_landing_page',
    ownerType: 'member',
    ownerId: 'EVO100245',
    ownerName: 'John Doe',
    source: 'Website Form (johnsonagency.com)',
    status: 'New',
    stage: 'Qualified',
    dealValue: 12500,
    createdAt: 'May 24, 2025'
  },
  {
    id: 'LED-102',
    name: 'Michael Brown',
    email: 'mbrown@brightsolutions.com',
    phone: '+1 555 876 5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    company: 'Bright Solutions',
    leadSource: 'member_landing_page',
    ownerType: 'member',
    ownerId: 'EVO100245',
    ownerName: 'John Doe',
    source: 'Facebook Ad Campaign',
    status: 'Contacted',
    stage: 'Negotiation',
    dealValue: 8200,
    createdAt: 'May 24, 2025'
  },
  {
    id: 'LED-103',
    name: 'Emily Davis',
    email: 'emily@davisconsulting.com',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    company: 'Davis Consulting',
    leadSource: 'member_landing_page',
    ownerType: 'member',
    ownerId: 'EVO100245',
    ownerName: 'John Doe',
    source: 'LinkedIn Direct',
    status: 'Qualified',
    stage: 'Proposal',
    dealValue: 6750,
    createdAt: 'May 23, 2025'
  },
  {
    id: 'LED-CORP-201',
    name: 'Alexander Wright',
    email: 'alex@enterprise-global.com',
    phone: '+1 800 555 0199',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    company: 'Enterprise Global Corp',
    leadSource: 'company_website',
    ownerType: 'company',
    ownerId: null,
    ownerName: 'Company HQ',
    assignedTo: 'Staff Sales Lead (Marcus)',
    source: 'Corporate Website (Contact Sales / Demo)',
    status: 'New',
    stage: 'Qualified',
    dealValue: 25000,
    createdAt: 'May 24, 2025'
  },
  {
    id: 'LED-CORP-202',
    name: 'Victoria Vance',
    email: 'vvance@vancemedia.co',
    phone: '+1 888 234 9876',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    company: 'Vance Media Network',
    leadSource: 'company_website',
    ownerType: 'company',
    ownerId: null,
    ownerName: 'Company HQ',
    assignedTo: 'Corporate Partnerships (Sarah)',
    source: 'Corporate Website (Partnership Request)',
    status: 'Contacted',
    stage: 'Proposal',
    dealValue: 40000,
    createdAt: 'May 23, 2025'
  }
];

export const initialDeals: Deal[] = [
  {
    id: 'DL-01',
    title: 'TechFlow CRM Deal',
    company: 'TechFlow Inc.',
    amount: 12500,
    stage: 'Proposal',
    contact: 'Sarah Johnson',
    probability: 65
  },
  {
    id: 'DL-02',
    title: 'Bright Solutions Website Build',
    company: 'Bright Solutions',
    amount: 8200,
    stage: 'Negotiation',
    contact: 'Michael Brown',
    probability: 80
  },
  {
    id: 'DL-03',
    title: 'Davis Consulting Automation',
    company: 'Davis Consulting',
    amount: 6750,
    stage: 'Qualified',
    contact: 'Emily Davis',
    probability: 40
  },
  {
    id: 'DL-04',
    title: 'Wilson Agencies Campaign',
    company: 'Wilson Agencies',
    amount: 4100,
    stage: 'New',
    contact: 'David Wilson',
    probability: 20
  }
];

export const initialCourses: Course[] = [
  {
    id: 'CRS-01',
    title: 'Digital Entrepreneurship Fundamentals',
    category: 'Foundations',
    difficulty: 'Beginner',
    lessonsCount: 20,
    completedLessons: 13,
    rating: 4.9,
    studentsCount: 3420,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress'
  },
  {
    id: 'CRS-02',
    title: 'E-commerce Business Mastery',
    category: 'E-Commerce',
    difficulty: 'Intermediate',
    lessonsCount: 25,
    completedLessons: 10,
    rating: 4.8,
    studentsCount: 2150,
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress'
  },
  {
    id: 'CRS-03',
    title: 'Social Media Marketing Blueprint',
    category: 'Marketing',
    difficulty: 'Beginner',
    lessonsCount: 18,
    completedLessons: 0,
    rating: 4.7,
    studentsCount: 1890,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
    status: 'Not Started'
  },
  {
    id: 'CRS-04',
    title: 'AI Tools for Entrepreneurs',
    category: 'AI & Automation',
    difficulty: 'Advanced',
    lessonsCount: 15,
    completedLessons: 5,
    rating: 4.9,
    studentsCount: 4120,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress'
  }
];

export const initialEvents: EventItem[] = [
  {
    id: 'EVT-01',
    title: 'Business Growth Summit 2025',
    category: 'Live Event',
    date: 'June 15, 2025',
    time: '10:00 AM - 4:00 PM (WAT)',
    instructor: 'Lagos Live Center',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    registered: 320,
    capacity: 500,
    revenue: 4320,
    status: 'Upcoming'
  },
  {
    id: 'EVT-02',
    title: 'Digital Marketing Masterclass',
    category: 'Webinar',
    date: 'May 28, 2025',
    time: '2:00 PM - 3:30 PM (WAT)',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    registered: 245,
    capacity: 300,
    revenue: 1250,
    status: 'Live'
  },
  {
    id: 'EVT-03',
    title: 'The Future of AI in Business',
    category: 'Virtual Event',
    date: 'May 10, 2025',
    time: '11:00 AM - 12:30 PM (WAT)',
    instructor: 'AI Core Labs',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    registered: 450,
    capacity: 500,
    revenue: 2890,
    status: 'Past'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'TM-01',
    name: 'John Doe (You)',
    email: 'john@digitalsolutions.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    department: 'Management',
    status: 'Active',
    joinedDate: 'May 12, 2024',
    lastActive: '2 mins ago'
  },
  {
    id: 'TM-02',
    name: 'Sarah Johnson',
    email: 'sarah@digitalsolutions.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Manager',
    department: 'Marketing',
    status: 'Active',
    joinedDate: 'May 15, 2024',
    lastActive: '15 mins ago'
  },
  {
    id: 'TM-03',
    name: 'Michael Brown',
    email: 'michael@digitalsolutions.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
    department: 'Content',
    status: 'Active',
    joinedDate: 'May 18, 2024',
    lastActive: '1 hour ago'
  },
  {
    id: 'TM-04',
    name: 'Emily Davis',
    email: 'emily@digitalsolutions.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    role: 'Analyst',
    department: 'Analytics',
    status: 'Active',
    joinedDate: 'May 20, 2024',
    lastActive: '3 hours ago'
  }
];

export const systemStatuses: SystemStatus[] = [
  { service: 'Eviona Platform Core', status: 'Operational', latency: '42ms' },
  { service: 'Eviona Website Builder & CDN', status: 'Operational', latency: '28ms' },
  { service: 'Eviona AI Business Center', status: 'Operational', latency: '120ms' },
  { service: 'Eviona CRM & Lead Delivery', status: 'Operational', latency: '35ms' },
  { service: 'Eviona Marketing & Relay', status: 'Operational', latency: '65ms' },
  { service: 'Eviona Payment Gateway & TRC20', status: 'Operational', latency: '88ms' },
  { service: 'Eviona Blockchain Ledger', status: 'Operational', latency: '95ms' },
];
