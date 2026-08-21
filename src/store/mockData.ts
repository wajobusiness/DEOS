import { Member, TreeNode, WalletTransaction, Product, Lead, Deal, Course, EventItem, TeamMember, SystemStatus } from '../types';

export const currentUser: Member = {
  id: 'DEOS100245',
  name: 'John Doe',
  email: 'john.doe@deos.com',
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
  walletBalance: 3450.00,
  tokenBalance: 2450.00,
  availableBalance: 3200.00,
  binaryVolume: 125000,
  activeReferrals: 256,
};

export const initialBinaryTree: TreeNode = {
  id: 'DEOS100245',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'You (Director)',
  leg: 'root',
  status: 'active',
  bv: 24560,
  children: [
    {
      id: 'DEOS-L1',
      name: 'Lisa Brown',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Left Leg (128)',
      leg: 'left',
      status: 'active',
      bv: 12280,
      children: [
        {
          id: 'DEOS-L2A',
          name: 'Samuel K.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Active Member',
          leg: 'left',
          status: 'active',
          bv: 6140
        },
        {
          id: 'DEOS-L2B',
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
      id: 'DEOS-R1',
      name: 'Grace John',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Right Leg (128)',
      leg: 'right',
      status: 'active',
      bv: 12280,
      children: [
        {
          id: 'DEOS-R2A',
          name: 'Emeka O.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          role: 'Active Member',
          leg: 'left',
          status: 'active',
          bv: 6140
        },
        {
          id: 'DEOS-R2B',
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

export const initialTransactions: WalletTransaction[] = [
  {
    id: 'TXN-9021',
    type: 'binary_commission',
    description: 'Binary Bonus - Balanced 10% Calculation',
    amount: 250.00,
    currency: 'USDT',
    status: 'Completed',
    date: 'May 16, 2025',
    time: '10:24 AM'
  },
  {
    id: 'TXN-9020',
    type: 'promoter_commission',
    description: 'Partner Commission - E-Commerce Blueprint',
    amount: 120.00,
    currency: 'DEOS',
    status: 'Completed',
    date: 'May 16, 2025',
    time: '09:15 AM'
  },
  {
    id: 'TXN-9019',
    type: 'seller_payout',
    description: 'Marketplace Sale - AI Business Mastery',
    amount: 80.00,
    currency: 'USDT',
    status: 'Completed',
    date: 'May 15, 2025',
    time: '08:42 PM'
  },
  {
    id: 'TXN-9018',
    type: 'wallet_withdrawal',
    description: 'Withdrawal to Bank Account (**** 5678)',
    amount: -200.00,
    currency: 'USDT',
    status: 'Completed',
    date: 'May 15, 2025',
    time: '04:30 PM'
  },
  {
    id: 'TXN-9017',
    type: 'generation_bonus',
    description: 'Generation Bonus - Level 2 Team Growth',
    amount: 150.00,
    currency: 'USDT',
    status: 'Completed',
    date: 'May 15, 2025',
    time: '02:10 PM'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'PRD-01',
    title: 'AI Business Mastery Complete Course',
    category: 'Digital Courses',
    price: 197.00,
    affiliateCommissionRate: 0.50,
    salesCount: 1250,
    rating: 4.9,
    reviewsCount: 324,
    sellerName: 'TechGuru',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-02',
    title: 'Website Builder Pro Template Kit',
    category: 'Website Templates',
    price: 97.00,
    affiliateCommissionRate: 0.40,
    salesCount: 980,
    rating: 4.8,
    reviewsCount: 215,
    sellerName: 'WebSolutions',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-03',
    title: 'Digital Marketing Mastery Kit 2025',
    category: 'Marketing & SEO',
    price: 147.00,
    affiliateCommissionRate: 0.45,
    salesCount: 750,
    rating: 4.7,
    reviewsCount: 187,
    sellerName: 'MarketPro',
    sellerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-04',
    title: 'E-commerce Blueprint to 7 Figures',
    category: 'Digital Courses',
    price: 197.00,
    affiliateCommissionRate: 0.50,
    salesCount: 1130,
    rating: 4.9,
    reviewsCount: 278,
    sellerName: 'SuccessLabs',
    sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-05',
    title: 'Social Media Growth & Reel Kit',
    category: 'Marketing & SEO',
    price: 57.00,
    affiliateCommissionRate: 0.40,
    salesCount: 620,
    rating: 4.8,
    reviewsCount: 156,
    sellerName: 'SocialBoost',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80'
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'LED-101',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    company: 'TechFlow Inc.',
    source: 'Website Form (johnsonagency.com)',
    status: 'New',
    createdAt: 'May 24, 2025'
  },
  {
    id: 'LED-102',
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    company: 'Bright Solutions',
    source: 'Facebook Ads',
    status: 'Contacted',
    createdAt: 'May 24, 2025'
  },
  {
    id: 'LED-103',
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    company: 'Davis Consulting',
    source: 'LinkedIn Direct',
    status: 'Qualified',
    createdAt: 'May 23, 2025'
  },
  {
    id: 'LED-104',
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    company: 'Wilson Agencies',
    source: 'Referral Link',
    status: 'New',
    createdAt: 'May 22, 2025'
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
  { service: 'DEOS Platform Core', status: 'Operational', latency: '42ms' },
  { service: 'Website Builder & CDN', status: 'Operational', latency: '28ms' },
  { service: 'AI Business Center', status: 'Operational', latency: '120ms' },
  { service: 'CRM & Lead Delivery', status: 'Operational', latency: '35ms' },
  { service: 'Marketing & SMS Relay', status: 'Operational', latency: '65ms' },
  { service: 'Payment Gateway & TRC20', status: 'Operational', latency: '88ms' },
  { service: 'Blockchain Ledger', status: 'Operational', latency: '95ms' },
];
