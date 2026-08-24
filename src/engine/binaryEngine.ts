// Eviona Ecosystem Binary & Financial Compensation Engine
import { PlanTier, TreeNode, LedgerEventType } from '../types';

export interface MarketplaceSplitResult {
  salePrice: number;
  isDirectSale: boolean;
  platformFee: number; // 10% (promoter sale) or 2% (direct sale)
  promoterCommissionGross: number; // e.g. 50% (promoter sale) or 0 (direct sale)
  uplineOverride: number; // 3% of promoter commission (promoter sale) or 0
  sellerUplineBonus: number; // 1% (direct sale per Book 5 §8a) or 0
  promoterCommissionNet: number; // 97% of promoter commission
  sellerPayoutNet: number; // Remainder (e.g. 97% on direct sale)
}

export interface SplitCommissionResult {
  earnedDirectBonus: number;
  unearnedDifference: number;
  uplineQualifiedShare: number; // 50% of gap
  sustainabilityFundShare: number; // 50% of gap
}

/**
 * Dynamic Binary Commission calculation on weaker-leg Business Volume (BV)
 * SuperAdmin controlled (default 10% Flat Rate)
 */
export function calculateBinaryCommission(weakerLegBV: number, ratePct: number = 10): number {
  const safePct = Math.max(0, ratePct || 10);
  return Number((weakerLegBV * (safePct / 100)).toFixed(2));
}

/**
 * Direct Referral Bonus based on purchased plan tier
 * SuperAdmin configurable: Launch ($25) | Growth ($75) | Legacy ($125)
 */
export function getDirectReferralBonus(
  plan: PlanTier,
  customBonuses?: { launchDirectBonusUsd?: number; growthDirectBonusUsd?: number; legacyDirectBonusUsd?: number }
): number {
  if (customBonuses) {
    if (plan === 'launch' && typeof customBonuses.launchDirectBonusUsd === 'number') return customBonuses.launchDirectBonusUsd;
    if (plan === 'growth' && typeof customBonuses.growthDirectBonusUsd === 'number') return customBonuses.growthDirectBonusUsd;
    if (plan === 'legacy' && typeof customBonuses.legacyDirectBonusUsd === 'number') return customBonuses.legacyDirectBonusUsd;
  }
  switch (plan) {
    case 'launch': return 25.00;
    case 'growth': return 75.00;
    case 'legacy': return 125.00;
    default: return 25.00;
  }
}

/**
 * Generation Bonus on downline direct bonuses
 * Generation 2 = 30% of Direct Bonus
 * Generation 3 = 15% of Direct Bonus
 * Governed by Book 4 §9
 */
export function calculateGenerationBonus(generation: 2 | 3, descendantDirectBonus: number): number {
  const rate = generation === 2 ? 0.30 : 0.15;
  return Number((descendantDirectBonus * rate).toFixed(2));
}

/**
 * Split Commission Engine (Book 4 §8)
 * When an under-qualified sponsor refers a higher-tier plan:
 * e.g. Launch sponsor refers Legacy ($125 total bonus).
 * Launch sponsor receives their plan cap ($25).
 * Gap ($100) splits 50% ($50) to nearest qualified upline and 50% ($50) to Platform Sustainability Fund.
 */
export function calculateSplitCommission(sponsorPlan: PlanTier, referredPlan: PlanTier): SplitCommissionResult {
  const maxPossibleBonus = getDirectReferralBonus(referredPlan);
  const sponsorEntitledCap = getDirectReferralBonus(sponsorPlan);

  if (sponsorEntitledCap >= maxPossibleBonus) {
    return {
      earnedDirectBonus: maxPossibleBonus,
      unearnedDifference: 0,
      uplineQualifiedShare: 0,
      sustainabilityFundShare: 0,
    };
  }

  const unearnedDifference = maxPossibleBonus - sponsorEntitledCap;
  const uplineQualifiedShare = Number((unearnedDifference * 0.50).toFixed(2));
  const sustainabilityFundShare = Number((unearnedDifference * 0.50).toFixed(2));

  return {
    earnedDirectBonus: sponsorEntitledCap,
    unearnedDifference,
    uplineQualifiedShare,
    sustainabilityFundShare,
  };
}

/**
 * Marketplace Split Engine (Book 5 §7, §8 & §8a - v1.3)
 * 
 * Case A: Promoter Sale (via affiliate / campaign link)
 * - Platform Fee: 10%
 * - Promoter Commission: Rate chosen by seller (10% to 60%)
 * - Upline Override: 3% of the promoter's commission pool (deducted from promoter take-home)
 * - Seller Net Payout: Remainder (SalePrice - PlatformFee - PromoterGross)
 * 
 * Case B: Direct Sale (Book 5 §8a - no promoter link used)
 * - Total Fee: 3%
 * - Platform Fee: 2%
 * - Seller's Upline Bonus: 1% (paid to seller's direct sponsor or Sustainability Fund)
 * - Seller Net Payout: 97% (SalePrice - 3%)
 */
export function calculateMarketplaceFeeSplit(
  salePrice: number,
  promoterRate?: number | null,
  customOverrides?: {
    platformMarketplaceFeePct?: number;
    directSalePlatformFeePct?: number;
    directSaleUplineBonusPct?: number;
    uplineOverrideRatePct?: number;
  }
): MarketplaceSplitResult {
  const directPlatformFeePct = (customOverrides?.directSalePlatformFeePct ?? 2) / 100;
  const directUplineBonusPct = (customOverrides?.directSaleUplineBonusPct ?? 1) / 100;
  const promoterPlatformFeePct = (customOverrides?.platformMarketplaceFeePct ?? 10) / 100;
  const uplineOverridePct = (customOverrides?.uplineOverrideRatePct ?? 3) / 100;

  // If no promoter link is used (Direct Sale, Book 5 §8a)
  if (promoterRate === undefined || promoterRate === null || promoterRate === 0) {
    const platformFee = Number((salePrice * directPlatformFeePct).toFixed(2));
    const sellerUplineBonus = Number((salePrice * directUplineBonusPct).toFixed(2));
    const sellerPayoutNet = Number((salePrice - platformFee - sellerUplineBonus).toFixed(2));

    return {
      salePrice,
      isDirectSale: true,
      platformFee,
      promoterCommissionGross: 0,
      uplineOverride: 0,
      sellerUplineBonus,
      promoterCommissionNet: 0,
      sellerPayoutNet,
    };
  }

  // Promoter Sale Case
  const boundedRate = Math.min(Math.max(promoterRate, 0.05), 0.90);
  const platformFee = Number((salePrice * promoterPlatformFeePct).toFixed(2));
  const promoterCommissionGross = Number((salePrice * boundedRate).toFixed(2));
  const uplineOverride = Number((promoterCommissionGross * uplineOverridePct).toFixed(2));
  const promoterCommissionNet = Number((promoterCommissionGross - uplineOverride).toFixed(2));
  const sellerPayoutNet = Number((salePrice - platformFee - promoterCommissionGross).toFixed(2));

  return {
    salePrice,
    isDirectSale: false,
    platformFee,
    promoterCommissionGross,
    uplineOverride,
    sellerUplineBonus: 0,
    promoterCommissionNet,
    sellerPayoutNet,
  };
}

/**
 * Auto-Spillover Binary Placement Engine (Book 4 §5)
 * Traverses breadth-first along the designated leg (left/right) to locate the first available node with < 2 children.
 */
export function findSpilloverSlot(root: TreeNode, preferredLeg: 'left' | 'right'): { parentId: string; targetLeg: 'left' | 'right' } {
  if (!root.children || root.children.length === 0) {
    return { parentId: root.id, targetLeg: preferredLeg };
  }

  // Check direct branch
  const branch = root.children.find(c => c.leg === preferredLeg);
  if (!branch) {
    return { parentId: root.id, targetLeg: preferredLeg };
  }

  // Traverse down the branch
  const queue: TreeNode[] = [branch];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!current.children || current.children.length < 2) {
      const hasLeft = current.children?.some(c => c.leg === 'left');
      return {
        parentId: current.id,
        targetLeg: hasLeft ? 'right' : 'left',
      };
    }
    for (const child of current.children) {
      queue.push(child);
    }
  }

  return { parentId: branch.id, targetLeg: preferredLeg };
}
