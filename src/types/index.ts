// Eviona Ecosystem Unified TypeScript Contracts

export type LedgerEventType = 
  | 'direct_referral_bonus'
  | 'binary_commission'
  | 'generation_bonus'
  | 'split_commission_platform'
  | 'split_commission_upline'
  | 'platform_transaction_fee'
  | 'promoter_commission'
  | 'product_sale_upline_override'
  | 'direct_sale_upline_bonus'
  | 'seller_payout'
  | 'academy_instructor_revenue'
  | 'coin_deposit'
  | 'coin_conversion'
  | 'coin_transfer'
  | 'withdrawal'
  | 'wallet_withdrawal'
  | 'wallet_transfer_in'
  | 'wallet_transfer_out';

export type PlanTier = 'launch' | 'growth' | 'legacy';

export type PaymentProcessorType = 'stripe' | 'paystack' | 'crypto_trc20' | 'direct_bank';

export type ViewType = 
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'wallet'
  | 'deposit'
  | 'binary'
  | 'partner'
  | 'marketplace'
  | 'sellers'
  | 'academy'
  | 'builder'
  | 'domains'
  | 'crm'
  | 'ai-center'
  | 'marketing'
  | 'analytics'
  | 'events'
  | 'team'
  | 'settings'
  | 'support'
  | 'admin';

export type UserRole = 'super_admin' | 'admin' | 'support_staff' | 'member';

export interface PlatformBrandingSettings {
  platformName: string;
  shortName?: string;
  tagline: string;
  description?: string;
  logoUrl?: string;
  darkLogoUrl?: string;
  lightLogoUrl?: string;
  faviconUrl?: string;
  companyLegalName?: string;
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  contactAddress?: string;
  copyrightText?: string;
  defaultCurrency?: string;
  defaultLanguage?: string;
  timezone?: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface PlatformThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  darkModeDefault: boolean;
  buttonStyle: 'rounded' | 'pill' | 'square';
}

export interface HomepageContentSettings {
  heroBadge: string;
  heroHeadline: string;
  heroHighlightText: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroVideoUrl: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  stats: {
    activeUsers: string;
    productsCount: string;
    totalPaidCommissions: string;
    uptimePercentage: string;
  };
  faqList: {
    q: string;
    a: string;
  }[];
}

export interface DashboardConfigSettings {
  welcomeHeadline: string;
  welcomeSubtitle: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    severity: 'info' | 'warning' | 'success';
  };
}

export interface NavigationMenuConfig {
  enabledViews: Partial<Record<ViewType, boolean>>;
}

export interface SystemFeatureSettings {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  withdrawalsEnabled: boolean;
  binaryEngineActive: boolean;
  marketplaceSellingEnabled: boolean;
  aiCenterEnabled: boolean;
  defaultCoinRateUsd: number;
}

export interface CommissionSettings {
  binaryCommissionRatePct: number; // e.g. 10
  affiliateCommissionRatePct: number; // e.g. 40
  uplineOverrideRatePct: number; // e.g. 3
  launchDirectBonusUsd: number; // e.g. 25
  growthDirectBonusUsd: number; // e.g. 75
  legacyDirectBonusUsd: number; // e.g. 125
  platformMarketplaceFeePct: number; // e.g. 10
  directSalePlatformFeePct: number; // e.g. 2
  directSaleUplineBonusPct: number; // e.g. 1
}

export interface Member {
  id: string;
  memberCode?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar: string;
  plan: PlanTier;
  role: UserRole;
  status: 'active' | 'suspended' | 'banned';
  memberSince: string;
  renewalDate: string;
  rank: string;
  nextRank: string;
  walletBalance: number;
  tokenBalance: number;
  availableBalance: number;
  binaryVolume: number;
  activeReferrals: number;
  hasCompletedOnboarding?: boolean;
}

export interface TreeNode {
  id: string;
  name: string;
  avatar: string;
  role: string;
  leg: 'left' | 'right' | 'root';
  status: 'active' | 'inactive';
  bv: number;
  directBonusEarned?: number;
  children?: TreeNode[];
}

export interface WalletTransaction {
  id: string;
  type: LedgerEventType;
  description: string;
  amount: number;
  currency: 'USDT' | 'EVO' | 'DEOS' | 'USD';
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  date: string;
  time: string;
}

export interface Product {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  originalPrice?: number;
  affiliateCommissionRate?: number; // e.g. 0.40 = 40%
  salesCount: number;
  rating: number;
  reviewsCount?: number;
  seller?: string;
  sellerName?: string;
  sellerAvatar?: string;
  badge?: string;
  image: string;
  isCreatorCourse?: boolean;
  licenseType?: string;
  instantDownload?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  avatar: string;
  company?: string;
  email?: string;
  phone?: string;
  leadSource?: 'company_website' | 'member_landing_page' | 'marketplace' | 'ad_campaign' | 'direct_referral';
  ownerType?: 'company' | 'member';
  ownerId?: string | null; // null for company leads, member ID for member leads
  ownerName?: string;
  assignedTo?: string | null; // Staff / Admin ID for corporate sales follow-up
  source: string; // IMMUTABLE source string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted' | 'Closed';
  stage?: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  dealValue?: number;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won';
  contact: string;
  probability: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  level?: string;
  duration?: string;
  lessonsCount?: number;
  completedLessons?: number;
  rating: number;
  studentsCount?: number;
  image?: string;
  thumbnail?: string;
  instructor?: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Live Event' | 'Webinar' | 'Virtual Event' | 'Draft';
  date: string;
  time: string;
  instructor: string;
  instructorAvatar: string;
  registered: number;
  capacity: number;
  revenue: number;
  status: 'Upcoming' | 'Live' | 'Past' | 'Draft';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Manager' | 'Editor' | 'Analyst' | 'Support' | 'Designer' | 'Developer' | 'Viewer';
  department: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastActive: string;
}

export interface SystemStatus {
  service: string;
  status: 'Operational' | 'Degraded' | 'Outage';
  latency: string;
}
