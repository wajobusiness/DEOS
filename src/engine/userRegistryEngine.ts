import { Member, PlanTier, UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';

export interface RegisteredUser {
  id: string; // e.g. EVO-ID-100245
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar: string;
  plan: PlanTier;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending' | 'banned';
  sponsorId: string | null; // Referrer's ID
  sponsorName: string;
  binaryPlacementLeg?: 'left' | 'right' | 'auto';
  walletBalance: number;
  tokenBalance: number;
  binaryLeftVolume: number;
  binaryRightVolume: number;
  activeReferrals: number;
  joinedDate: string;
  renewalDate: string;
  hasCompletedOnboarding: boolean;
  password?: string;
  mustChangePassword?: boolean;
  lastPasswordResetAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_MASTER_USERS_KEY = 'eviona_master_user_registry_v4';

export const userRegistryEngine = {
  // 1. Initialize default foundational users if storage is empty
  initDefaults(): RegisteredUser[] {
    const defaults: RegisteredUser[] = [
      {
        id: 'EVO-ID-000001',
        memberCode: 'EVO-ID-000001',
        name: 'Marcus Vance (Super Admin)',
        email: 'admin@evionaecosystem.com',
        phone: '+1 (555) 019-2831',
        country: 'United States',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: 'legacy',
        role: 'super_admin',
        status: 'active',
        sponsorId: null,
        sponsorName: 'System Root',
        binaryPlacementLeg: 'auto',
        walletBalance: 25480.00,
        tokenBalance: 25480.00,
        binaryLeftVolume: 48500,
        binaryRightVolume: 36200,
        activeReferrals: 14,
        joinedDate: 'Jan 01, 2024',
        renewalDate: 'Jan 01, 2027',
        hasCompletedOnboarding: true,
        createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'EVO-ID-100245',
        memberCode: 'EVO-ID-100245',
        name: 'John Doe',
        email: 'john.doe@evionaecosystem.com',
        phone: '+234 801 234 5678',
        country: 'Nigeria',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: 'growth',
        role: 'member',
        status: 'active',
        sponsorId: 'EVO-ID-000001',
        sponsorName: 'Marcus Vance',
        binaryPlacementLeg: 'left',
        walletBalance: 750.00,
        tokenBalance: 750.00,
        binaryLeftVolume: 5200,
        binaryRightVolume: 3400,
        activeReferrals: 2,
        joinedDate: 'May 12, 2024',
        renewalDate: 'May 12, 2025',
        hasCompletedOnboarding: true,
        createdAt: new Date('2024-05-12T10:00:00Z').toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    try {
      const existing = localStorage.getItem(STORAGE_MASTER_USERS_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_MASTER_USERS_KEY, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(existing);
    } catch {
      return defaults;
    }
  },

  // 2. Fetch all registered users
  getAllUsers(): RegisteredUser[] {
    try {
      const saved = localStorage.getItem(STORAGE_MASTER_USERS_KEY);
      if (saved) {
        const users = JSON.parse(saved);
        if (Array.isArray(users) && users.length > 0) {
          return users;
        }
      }
    } catch {}
    return this.initDefaults();
  },

  // 3. Save all users to registry
  saveUsers(users: RegisteredUser[]) {
    try {
      localStorage.setItem(STORAGE_MASTER_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save master user registry:', e);
    }
  },

  // 4. Find user by ID
  getUserById(userId: string): RegisteredUser | undefined {
    if (!userId) return undefined;
    const users = this.getAllUsers();
    const clean = userId.trim();
    return users.find(u => u.id === clean || u.memberCode === clean || u.email.toLowerCase() === clean.toLowerCase());
  },

  // 5. Find user by Email
  getUserByEmail(email: string): RegisteredUser | undefined {
    if (!email) return undefined;
    const users = this.getAllUsers();
    const clean = email.trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === clean);
  },

  // 6. Register a completely new independent user (NEVER overwrites existing users)
  async registerNewUser(data: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    plan?: PlanTier;
    sponsorCode?: string;
    preferredPlacementLeg?: 'left' | 'right' | 'auto';
    customId?: string;
  }): Promise<{ success: boolean; user: RegisteredUser; error?: string }> {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = this.getAllUsers();

    // Check if user already exists with this email
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (existingIndex !== -1) {
      // Return existing user record without destroying data
      return {
        success: true,
        user: users[existingIndex],
      };
    }

    // Generate unique new user ID
    let newUserId = data.customId;
    if (!newUserId) {
      let rand = Math.floor(100000 + Math.random() * 900000);
      while (users.some(u => u.id === `EVO-ID-${rand}`)) {
        rand = Math.floor(100000 + Math.random() * 900000);
      }
      newUserId = `EVO-ID-${rand}`;
    }

    // Resolve Sponsor
    let sponsorId: string | null = null;
    let sponsorName = 'Eviona Global';

    if (data.sponsorCode) {
      const sponsor = this.getUserById(data.sponsorCode);
      if (sponsor) {
        sponsorId = sponsor.id;
        sponsorName = sponsor.name;
      }
    }

    // Default to Marcus / Root if no sponsor provided
    if (!sponsorId && users.length > 0) {
      sponsorId = users[0].id;
      sponsorName = users[0].name;
    }

    const now = new Date();
    const newUser: RegisteredUser = {
      id: newUserId,
      memberCode: newUserId,
      name: data.name.trim() || 'New Entrepreneur',
      email: cleanEmail,
      phone: data.phone || '',
      country: data.country || 'Global',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: data.plan || 'launch',
      role: cleanEmail.includes('admin') ? 'super_admin' : 'member',
      status: 'active',
      sponsorId,
      sponsorName,
      binaryPlacementLeg: data.preferredPlacementLeg || 'auto',
      walletBalance: 0.00,
      tokenBalance: 0.00,
      binaryLeftVolume: 0,
      binaryRightVolume: 0,
      activeReferrals: 0,
      joinedDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      renewalDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hasCompletedOnboarding: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Append to master users list (IMMUTABLE, NO OVERWRITE)
    users.push(newUser);

    // Update sponsor's active referral count
    if (sponsorId) {
      const sponsorIdx = users.findIndex(u => u.id === sponsorId);
      if (sponsorIdx !== -1) {
        users[sponsorIdx].activeReferrals = (users[sponsorIdx].activeReferrals || 0) + 1;
      }
    }

    this.saveUsers(users);

    // Initialize user wallet storage
    const userBalanceKey = `eviona_user_${newUser.id}_balance`;
    if (!localStorage.getItem(userBalanceKey)) {
      localStorage.setItem(userBalanceKey, '0.00');
    }

    // Attempt background sync to Supabase Member table
    try {
      await supabase.from('Member').upsert({
        id: newUser.id,
        memberCode: newUser.memberCode,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country,
        plan: newUser.plan,
        role: newUser.role,
        status: newUser.status,
        sponsorId: newUser.sponsorId,
        walletBalance: newUser.walletBalance,
        binaryLeftVolume: newUser.binaryLeftVolume,
        binaryRightVolume: newUser.binaryRightVolume,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    } catch (e) {
      console.warn('Supabase Member table sync notification:', e);
    }

    return {
      success: true,
      user: newUser,
    };
  },

  // 7. Update an existing user without mutating other users
  async updateUser(userId: string, updates: Partial<RegisteredUser>): Promise<RegisteredUser | undefined> {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === userId || u.memberCode === userId || u.email === userId);
    if (idx === -1) return undefined;

    users[idx] = {
      ...users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If wallet balance was updated, sync isolated balance key
    if (typeof updates.walletBalance === 'number') {
      localStorage.setItem(`eviona_user_${users[idx].id}_balance`, Number(updates.walletBalance).toFixed(2));
      localStorage.setItem(`eviona_user_${users[idx].email.toLowerCase()}_balance`, Number(updates.walletBalance).toFixed(2));
    }

    this.saveUsers(users);

    // Synchronize active session if current logged-in user is updated
    try {
      const activeRaw = localStorage.getItem('eviona_active_member_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed.id === users[idx].id || parsed.email === users[idx].email) {
          const updatedActive = {
            ...parsed,
            ...this.toMember(users[idx]),
          };
          localStorage.setItem('eviona_active_member_profile', JSON.stringify(updatedActive));
        }
      }
    } catch {}

    try {
      await supabase.from('Member').update({
        name: users[idx].name,
        email: users[idx].email,
        phone: users[idx].phone,
        country: users[idx].country,
        avatarUrl: users[idx].avatar,
        plan: users[idx].plan,
        role: users[idx].role,
        status: users[idx].status,
        sponsorId: users[idx].sponsorId,
        walletBalance: users[idx].walletBalance,
        binaryLeftVolume: users[idx].binaryLeftVolume,
        binaryRightVolume: users[idx].binaryRightVolume,
        updatedAt: users[idx].updatedAt,
      }).eq('id', users[idx].id);
    } catch (e) {
      console.warn('Supabase updateUser note:', e);
    }

    return users[idx];
  },

  // 8. Convert RegisteredUser to frontend Member format
  toMember(user: RegisteredUser): Member {
    return {
      id: user.id,
      memberCode: user.memberCode,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      avatar: user.avatar,
      plan: user.plan,
      role: user.role,
      status: user.status,
      memberSince: user.joinedDate,
      renewalDate: user.renewalDate,
      rank: user.role === 'super_admin' ? 'Super Admin' : user.activeReferrals >= 5 ? 'Director' : 'Member',
      nextRank: 'Executive',
      walletBalance: user.walletBalance,
      tokenBalance: user.tokenBalance,
      availableBalance: user.walletBalance,
      binaryVolume: (user.binaryLeftVolume || 0) + (user.binaryRightVolume || 0),
      activeReferrals: user.activeReferrals || 0,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    };
  },

  // 9. Get direct referrals for a sponsor
  getDirectReferrals(sponsorId: string): RegisteredUser[] {
    const users = this.getAllUsers();
    return users.filter(u => u.sponsorId === sponsorId);
  },

  // 10. Direct Admin Password Reset
  async resetUserPassword(userId: string, newPassword: string, mustChangePassword: boolean = false): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updated = await this.updateUser(userId, {
      password: newPassword,
      mustChangePassword,
      lastPasswordResetAt: now,
    });

    if (!updated) {
      return { success: false, error: 'User not found.' };
    }

    return { success: true, user: updated };
  }
};
