import { Member, TreeNode, WalletTransaction, Product, Lead, Deal, Course, EventItem, TeamMember, SystemStatus } from '../types';

export const currentUser: Member = {
  id: '',
  memberCode: '',
  name: 'Entrepreneur',
  email: '',
  phone: '',
  country: 'Global',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'growth',
  role: 'member',
  status: 'active',
  memberSince: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  rank: 'Member',
  nextRank: 'Director',
  walletBalance: 0.00,
  tokenBalance: 0.00,
  availableBalance: 0.00,
  binaryVolume: 0,
  activeReferrals: 0,
  hasCompletedOnboarding: true,
};

export const initialBinaryTree: TreeNode = {
  id: '',
  name: 'Root Member',
  avatar: '',
  role: 'Root Position',
  leg: 'root',
  status: 'active',
  bv: 0,
  children: []
};

export const initialTransactions: WalletTransaction[] = [];

export const initialProducts: Product[] = [];

export const initialLeads: Lead[] = [];
export const initialDeals: Deal[] = [];

export const initialCourses: Course[] = [];
export const initialEvents: EventItem[] = [];
export const initialTeamMembers: TeamMember[] = [];

export const systemStatuses: SystemStatus[] = [
  { service: 'Eviona Platform Core', status: 'Operational', latency: '42ms' },
  { service: 'Eviona Website Builder & CDN', status: 'Operational', latency: '28ms' },
  { service: 'Eviona AI Business Center', status: 'Operational', latency: '120ms' },
  { service: 'Eviona CRM & Lead Delivery', status: 'Operational', latency: '35ms' },
  { service: 'Eviona Marketing & Relay', status: 'Operational', latency: '65ms' },
  { service: 'Eviona Payment Gateway & TRC20', status: 'Operational', latency: '88ms' },
  { service: 'Eviona Blockchain Ledger', status: 'Operational', latency: '95ms' },
];
