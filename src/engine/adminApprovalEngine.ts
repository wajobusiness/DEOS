import { WalletTransaction, Product, EventItem, Member } from '../types';
import { supabase } from '../lib/supabaseClient';
import { marketplaceEngine } from './marketplaceEngine';
import { eventsEngine } from './eventsEngine';
import { websiteBuilderEngine } from './websiteBuilderEngine';
import { userRegistryEngine } from './userRegistryEngine';

export interface DepositApprovalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  rail: string;
  reference: string;
  proofHash?: string;
  status: 'Pending_Approval' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface WithdrawalApprovalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: string;
  destinationDetails: string;
  reference: string;
  status: 'Pending_Approval' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ProductApprovalRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  productTitle: string;
  category: string;
  price: number;
  affiliateCommissionPercent: number;
  status: 'Pending_Approval' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface DomainApprovalRequest {
  id: string;
  userId: string;
  userName: string;
  domainName: string;
  targetSubdomain: string;
  dnsVerified: boolean;
  sslActive: boolean;
  status: 'Pending_Verification' | 'Active' | 'Rejected';
  createdAt: string;
}

const STORAGE_DEPOSITS_KEY = 'eviona_admin_pending_deposits_v2';
const STORAGE_WITHDRAWALS_KEY = 'eviona_admin_pending_withdrawals_v2';
const STORAGE_DOMAINS_KEY = 'eviona_admin_pending_domains_v2';

export const adminApprovalEngine = {
  // ==========================================
  // 1. DEPOSIT APPROVAL QUEUE
  // ==========================================
  getDepositRequests(): DepositApprovalRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_DEPOSITS_KEY);
      if (saved) {
        const list: DepositApprovalRequest[] = JSON.parse(saved);
        if (Array.isArray(list)) return list;
      }
    } catch {}

    const initial: DepositApprovalRequest[] = [
      {
        id: 'DEP-REQ-101',
        userId: 'EVO-ID-100246',
        userName: 'Sarah Johnson',
        userEmail: 'sarah@agency.com',
        amount: 500.00,
        rail: 'USDT (TRC20)',
        reference: 'TXN-982341',
        proofHash: '4f92bc8102a9e1d8823190ab7c12f00a89d',
        status: 'Pending_Approval',
        createdAt: 'May 24, 2025, 02:15 PM',
      },
      {
        id: 'DEP-REQ-102',
        userId: 'EVO-ID-100247',
        userName: 'Michael Brown',
        userEmail: 'michael@bright.com',
        amount: 300.00,
        rail: 'Bank Transfer (EFT)',
        reference: 'TXN-874102',
        proofHash: 'EFT-REF-NIP-998231',
        status: 'Pending_Approval',
        createdAt: 'May 24, 2025, 03:40 PM',
      }
    ];
    localStorage.setItem(STORAGE_DEPOSITS_KEY, JSON.stringify(initial));
    return initial;
  },

  createDepositRequest(data: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    rail: string;
    reference: string;
    proofHash?: string;
  }): DepositApprovalRequest {
    const newReq: DepositApprovalRequest = {
      id: `DEP-REQ-${Date.now().toString().slice(-4)}`,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      amount: data.amount,
      rail: data.rail,
      reference: data.reference,
      proofHash: data.proofHash || `HASH-${Math.random().toString(36).substring(2, 10)}`,
      status: 'Pending_Approval',
      createdAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const current = this.getDepositRequests();
    const updated = [newReq, ...current];
    localStorage.setItem(STORAGE_DEPOSITS_KEY, JSON.stringify(updated));
    return newReq;
  },

  approveDeposit(requestId: string, adminName: string = 'Super Admin'): { success: boolean; request?: DepositApprovalRequest; error?: string } {
    const list = this.getDepositRequests();
    const req = list.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Deposit request not found.' };

    req.status = 'Approved';
    req.reviewedAt = new Date().toLocaleString();
    req.reviewedBy = adminName;
    localStorage.setItem(STORAGE_DEPOSITS_KEY, JSON.stringify(list));

    // 1. Credit the user's storage balance directly
    const userBalanceKey = `eviona_user_${req.userId}_balance`;
    const userEmailBalanceKey = `eviona_user_${req.userEmail.toLowerCase()}_balance`;
    const currentBal = parseFloat(localStorage.getItem(userBalanceKey) || localStorage.getItem(userEmailBalanceKey) || '0.00');
    const newBal = currentBal + req.amount;
    localStorage.setItem(userBalanceKey, newBal.toFixed(2));
    localStorage.setItem(userEmailBalanceKey, newBal.toFixed(2));

    // Update user registry master record
    userRegistryEngine.updateUser(req.userId, {
      walletBalance: newBal,
      tokenBalance: newBal,
    });

    // 2. Append/Update transaction in user's ledger
    const userLedgerKey = `eviona_user_${req.userId}_ledger`;
    try {
      const existingLedger: WalletTransaction[] = JSON.parse(localStorage.getItem(userLedgerKey) || '[]');
      const matchTx = existingLedger.find(t => t.id === req.reference);
      if (matchTx) {
        matchTx.status = 'Completed';
        matchTx.description = `Deposit via ${req.rail.toUpperCase()} (Approved by Super Admin)`;
      } else {
        existingLedger.unshift({
          id: req.reference,
          type: 'coin_deposit',
          description: `Deposit via ${req.rail.toUpperCase()} (Approved by Super Admin)`,
          amount: req.amount,
          currency: 'EVO',
          status: 'Completed',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
      localStorage.setItem(userLedgerKey, JSON.stringify(existingLedger));
    } catch {}

    // 3. Optional Supabase Sync
    (async () => {
      try {
        await supabase.from('Transaction').insert({
          id: req.reference,
          userId: req.userId,
          type: 'coin_deposit',
          amount: req.amount,
          status: 'Completed',
          description: `Super Admin approved deposit for ${req.userName}`,
        });
      } catch {}
    })();

    return { success: true, request: req };
  },

  rejectDeposit(requestId: string, reason: string, adminName: string = 'Super Admin'): { success: boolean; request?: DepositApprovalRequest; error?: string } {
    const list = this.getDepositRequests();
    const req = list.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Deposit request not found.' };

    req.status = 'Rejected';
    req.rejectionReason = reason;
    req.reviewedAt = new Date().toLocaleString();
    req.reviewedBy = adminName;
    localStorage.setItem(STORAGE_DEPOSITS_KEY, JSON.stringify(list));

    // Mark as Rejected in user's ledger
    const userLedgerKey = `eviona_user_${req.userId}_ledger`;
    try {
      const existingLedger: WalletTransaction[] = JSON.parse(localStorage.getItem(userLedgerKey) || '[]');
      const matchTx = existingLedger.find(t => t.id === req.reference);
      if (matchTx) {
        matchTx.status = 'Rejected';
        matchTx.description = `Deposit rejected: ${reason}`;
        localStorage.setItem(userLedgerKey, JSON.stringify(existingLedger));
      }
    } catch {}

    return { success: true, request: req };
  },

  // ==========================================
  // 2. WITHDRAWAL APPROVAL QUEUE
  // ==========================================
  getWithdrawalRequests(): WithdrawalApprovalRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_WITHDRAWALS_KEY);
      if (saved) {
        const list: WithdrawalApprovalRequest[] = JSON.parse(saved);
        if (Array.isArray(list)) return list;
      }
    } catch {}

    const initial: WithdrawalApprovalRequest[] = [
      {
        id: 'WDR-REQ-201',
        userId: 'EVO-ID-100245',
        userName: 'Entrepreneur (You)',
        userEmail: 'user@evionaecosystem.com',
        amount: 250.00,
        method: 'USDT (TRC20)',
        destinationDetails: 'TX9xZgHkM92pqWrtY8dKl9mTRC20Address',
        reference: 'WDR-192840',
        status: 'Pending_Approval',
        createdAt: 'May 24, 2025, 01:00 PM',
      }
    ];
    localStorage.setItem(STORAGE_WITHDRAWALS_KEY, JSON.stringify(initial));
    return initial;
  },

  createWithdrawalRequest(data: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    method: string;
    destinationDetails: string;
    reference: string;
  }): WithdrawalApprovalRequest {
    const newReq: WithdrawalApprovalRequest = {
      id: `WDR-REQ-${Date.now().toString().slice(-4)}`,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      amount: data.amount,
      method: data.method,
      destinationDetails: data.destinationDetails,
      reference: data.reference,
      status: 'Pending_Approval',
      createdAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const current = this.getWithdrawalRequests();
    const updated = [newReq, ...current];
    localStorage.setItem(STORAGE_WITHDRAWALS_KEY, JSON.stringify(updated));
    return newReq;
  },

  approveWithdrawal(requestId: string, adminName: string = 'Super Admin'): { success: boolean; request?: WithdrawalApprovalRequest; error?: string } {
    const list = this.getWithdrawalRequests();
    const req = list.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Withdrawal request not found.' };

    req.status = 'Approved';
    req.reviewedAt = new Date().toLocaleString();
    req.reviewedBy = adminName;
    localStorage.setItem(STORAGE_WITHDRAWALS_KEY, JSON.stringify(list));

    // Update in user ledger
    const userLedgerKey = `eviona_user_${req.userId}_ledger`;
    try {
      const existingLedger: WalletTransaction[] = JSON.parse(localStorage.getItem(userLedgerKey) || '[]');
      const matchTx = existingLedger.find(t => t.id === req.reference);
      if (matchTx) {
        matchTx.status = 'Completed';
        matchTx.description = `Withdrawal to ${req.destinationDetails} (Settled & Released)`;
        localStorage.setItem(userLedgerKey, JSON.stringify(existingLedger));
      }
    } catch {}

    return { success: true, request: req };
  },

  rejectWithdrawal(requestId: string, reason: string, adminName: string = 'Super Admin'): { success: boolean; request?: WithdrawalApprovalRequest; error?: string } {
    const list = this.getWithdrawalRequests();
    const req = list.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Withdrawal request not found.' };

    req.status = 'Rejected';
    req.rejectionReason = reason;
    req.reviewedAt = new Date().toLocaleString();
    req.reviewedBy = adminName;
    localStorage.setItem(STORAGE_WITHDRAWALS_KEY, JSON.stringify(list));

    // Refund amount back to user's wallet
    const userBalanceKey = `eviona_user_${req.userId}_balance`;
    const userEmailBalanceKey = `eviona_user_${req.userEmail.toLowerCase()}_balance`;
    const currentBal = parseFloat(localStorage.getItem(userBalanceKey) || localStorage.getItem(userEmailBalanceKey) || '0.00');
    const newBal = currentBal + req.amount;
    localStorage.setItem(userBalanceKey, newBal.toFixed(2));
    localStorage.setItem(userEmailBalanceKey, newBal.toFixed(2));

    // Update user registry master record
    userRegistryEngine.updateUser(req.userId, {
      walletBalance: newBal,
      tokenBalance: newBal,
    });

    // Update in user ledger with refund note
    const userLedgerKey = `eviona_user_${req.userId}_ledger`;
    try {
      const existingLedger: WalletTransaction[] = JSON.parse(localStorage.getItem(userLedgerKey) || '[]');
      const matchTx = existingLedger.find(t => t.id === req.reference);
      if (matchTx) {
        matchTx.status = 'Rejected';
        matchTx.description = `Withdrawal Rejected (${reason}) — Refunded +$${req.amount.toFixed(2)} EVO`;
        localStorage.setItem(userLedgerKey, JSON.stringify(existingLedger));
      }
    } catch {}

    return { success: true, request: req };
  },

  // ==========================================
  // 3. DIRECT ADMIN WALLET ADJUSTMENTS (CREDIT / DEBIT)
  // ==========================================
  adminAdjustWalletBalance(data: {
    targetUserId: string;
    targetUserEmail: string;
    amount: number; // positive for credit, negative for debit
    reason: string;
    adminName?: string;
  }): { success: boolean; newBalance: number } {
    const { targetUserId, targetUserEmail, amount, reason, adminName = 'Super Admin' } = data;

    const userBalanceKey = `eviona_user_${targetUserId}_balance`;
    const userEmailBalanceKey = `eviona_user_${targetUserEmail.toLowerCase()}_balance`;
    const currentBal = parseFloat(localStorage.getItem(userBalanceKey) || localStorage.getItem(userEmailBalanceKey) || '0.00');
    const newBal = Math.max(0, currentBal + amount);

    localStorage.setItem(userBalanceKey, newBal.toFixed(2));
    localStorage.setItem(userEmailBalanceKey, newBal.toFixed(2));

    // Update master user registry
    userRegistryEngine.updateUser(targetUserId, {
      walletBalance: newBal,
      tokenBalance: newBal,
    });

    // Record in user ledger
    const userLedgerKey = `eviona_user_${targetUserId}_ledger`;
    try {
      const existingLedger: WalletTransaction[] = JSON.parse(localStorage.getItem(userLedgerKey) || '[]');
      const isCredit = amount > 0;
      existingLedger.unshift({
        id: `ADJ-${Date.now().toString().slice(-6)}`,
        type: isCredit ? 'coin_deposit' : 'platform_transaction_fee',
        description: `Admin ${isCredit ? 'Credit Adjustment' : 'Debit Adjustment'}: ${reason} (by ${adminName})`,
        amount: amount,
        currency: 'EVO',
        status: 'Completed',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      localStorage.setItem(userLedgerKey, JSON.stringify(existingLedger));
    } catch {}

    return { success: true, newBalance: newBal };
  },

  // ==========================================
  // 4. DIRECT MEMBER MANAGEMENT (TIER, ROLE, STATUS)
  // ==========================================
  async adminUpdateMember(userId: string, updates: Partial<Member>): Promise<boolean> {
    try {
      // Update in Supabase
      await supabase.from('Member').update(updates).eq('id', userId);
    } catch {}

    // Update in master user registry
    userRegistryEngine.updateUser(userId, {
      name: updates.name,
      role: updates.role,
      plan: updates.plan,
      status: updates.status,
    });

    // Update active member cache if matching
    try {
      const activeRaw = localStorage.getItem('eviona_active_member_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed.id === userId || parsed.memberCode === userId) {
          const updated = { ...parsed, ...updates };
          localStorage.setItem('eviona_active_member_profile', JSON.stringify(updated));
        }
      }
    } catch {}

    return true;
  },

  // ==========================================
  // 5. DOMAIN / DNS VERIFICATION QUEUE
  // ==========================================
  getDomainRequests(): DomainApprovalRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_DOMAINS_KEY);
      if (saved) {
        const list: DomainApprovalRequest[] = JSON.parse(saved);
        if (Array.isArray(list)) return list;
      }
    } catch {}

    const initial: DomainApprovalRequest[] = [
      {
        id: 'DOM-REQ-301',
        userId: 'EVO-ID-100245',
        userName: 'Entrepreneur',
        domainName: 'johnsonagency.com',
        targetSubdomain: 'johnson.evionaecosystem.com',
        dnsVerified: true,
        sslActive: true,
        status: 'Active',
        createdAt: 'May 20, 2025',
      },
      {
        id: 'DOM-REQ-302',
        userId: 'EVO-ID-100248',
        userName: 'Emily Davis',
        domainName: 'emilyconsulting.io',
        targetSubdomain: 'emily.evionaecosystem.com',
        dnsVerified: false,
        sslActive: false,
        status: 'Pending_Verification',
        createdAt: 'May 24, 2025',
      }
    ];
    localStorage.setItem(STORAGE_DOMAINS_KEY, JSON.stringify(initial));
    return initial;
  },

  verifyAndApproveDomain(reqId: string): boolean {
    const list = this.getDomainRequests();
    const req = list.find(d => d.id === reqId);
    if (!req) return false;

    req.status = 'Active';
    req.dnsVerified = true;
    req.sslActive = true;
    localStorage.setItem(STORAGE_DOMAINS_KEY, JSON.stringify(list));
    return true;
  }
};
