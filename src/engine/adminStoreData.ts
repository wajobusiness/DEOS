import { marketplaceEngine } from './marketplaceEngine';
import { adminApprovalEngine } from './adminApprovalEngine';

export interface MembershipPlanConfig {
  id: 'launch' | 'growth' | 'legacy';
  name: string;
  priceUsd: number;
  annualRenewalUsd: number;
  maxLandingPages: number;
  maxCrmLeads: number;
  aiCreditsPerMonth: number;
  storageGb: number;
  binaryCommissionPercent: number;
}

const STORAGE_MEMBERSHIPS_KEY = 'eviona_membership_plans_v2';

export const adminStoreData = {
  getMembershipPlans(): MembershipPlanConfig[] {
    try {
      const saved = localStorage.getItem(STORAGE_MEMBERSHIPS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    const defaults: MembershipPlanConfig[] = [
      {
        id: 'launch',
        name: 'Launch Tier',
        priceUsd: 100,
        annualRenewalUsd: 50,
        maxLandingPages: 1,
        maxCrmLeads: 100,
        aiCreditsPerMonth: 1000,
        storageGb: 5,
        binaryCommissionPercent: 10,
      },
      {
        id: 'growth',
        name: 'Growth Tier',
        priceUsd: 300,
        annualRenewalUsd: 50,
        maxLandingPages: 3,
        maxCrmLeads: 1000,
        aiCreditsPerMonth: 5000,
        storageGb: 50,
        binaryCommissionPercent: 10,
      },
      {
        id: 'legacy',
        name: 'Legacy Tier',
        priceUsd: 500,
        annualRenewalUsd: 50,
        maxLandingPages: 10,
        maxCrmLeads: 10000,
        aiCreditsPerMonth: 25000,
        storageGb: 250,
        binaryCommissionPercent: 10,
      }
    ];

    localStorage.setItem(STORAGE_MEMBERSHIPS_KEY, JSON.stringify(defaults));
    return defaults;
  },

  saveMembershipPlans(plans: MembershipPlanConfig[]) {
    localStorage.setItem(STORAGE_MEMBERSHIPS_KEY, JSON.stringify(plans));
  }
};
