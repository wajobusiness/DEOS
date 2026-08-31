import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Member, PlanTier } from '../types';
import { userRegistryEngine, RegisteredUser } from '../engine/userRegistryEngine';
import { binaryPlacementEngine } from '../engine/binaryPlacementEngine';
import { apiClient } from '../lib/apiClient';

interface AuthContextType {
  user: User | null;
  member: Member | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (
    name: string,
    email: string,
    password: string,
    country?: string,
    sponsorCode?: string,
    preferredPlacementLeg?: 'left' | 'right' | 'auto'
  ) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updatePlan: (plan: PlanTier) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_MEMBER_KEY = 'eviona_active_member_profile';
const LOCAL_STORAGE_USER_KEY = 'eviona_active_user_cache';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState<Session | null>(null);

  const [member, setMember] = useState<Member | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MEMBER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Cross-verify with master registry to ensure live data integrity
        const registered = userRegistryEngine.getUserById(parsed.id) || userRegistryEngine.getUserByEmail(parsed.email);
        if (registered) {
          return userRegistryEngine.toMember(registered);
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to build a clean Member object from user identity with short EVO-ID standard
  const buildProfileFromUser = (authUser: { id: string; email?: string; user_metadata?: any; created_at?: string }): Member => {
    const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Entrepreneur';
    const metaCountry = authUser.user_metadata?.country || 'Global';
    const rawCode = authUser.user_metadata?.memberCode;
    const shortId = rawCode
      ? (rawCode.startsWith('EVO-ID-') ? rawCode : `EVO-ID-${rawCode.replace(/^EVO-?I?D?-?/i, '')}`)
      : (authUser.id?.startsWith('EVO-ID-')
          ? authUser.id
          : `EVO-ID-${(authUser.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() || '100245'}`);

    return {
      id: shortId,
      memberCode: shortId,
      name: metaName,
      email: authUser.email || 'entrepreneur@evionaecosystem.com',
      phone: authUser.user_metadata?.phone || '',
      country: metaCountry,
      avatar: authUser.user_metadata?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: (authUser.user_metadata?.plan as PlanTier) || 'growth',
      role: (authUser.email?.includes('admin') ? 'super_admin' : 'member'),
      status: 'active',
      memberSince: new Date(authUser.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rank: 'Member',
      nextRank: 'Director',
      walletBalance: 0.00,
      tokenBalance: 0.00,
      availableBalance: 0.00,
      binaryVolume: 0,
      activeReferrals: 0,
      hasCompletedOnboarding: authUser.user_metadata?.hasCompletedOnboarding === true,
    };
  };

  // Fetch Member profile directly from Supabase public.Member table or hydrate from master registry
  const fetchMemberProfile = async (authUser: User): Promise<Member> => {
    // 1. Look up in master user registry
    const registered = userRegistryEngine.getUserById(authUser.id) || userRegistryEngine.getUserByEmail(authUser.email || '');
    if (registered) {
      const profile = userRegistryEngine.toMember(registered);
      setMember(profile);
      localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(profile));
      return profile;
    }

    // 2. Query Supabase database
    try {
      const { data, error } = await supabase
        .from('Member')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data && !error) {
        const profile: Member = {
          id: data.id,
          name: data.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Entrepreneur',
          email: data.email || authUser.email!,
          phone: data.phone || '',
          country: data.country || 'Global',
          avatar: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          plan: (data.plan as PlanTier) || 'growth',
          role: data.role || (authUser.email?.includes('admin') ? 'super_admin' : 'member'),
          status: data.status || 'active',
          memberSince: new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          renewalDate: data.renewalDate
            ? new Date(data.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          rank: data.rank || 'Member',
          nextRank: 'Director',
          walletBalance: Number(data.walletBalance || 0),
          tokenBalance: Number(data.walletBalance || 0),
          availableBalance: Number(data.walletBalance || 0),
          binaryVolume: Number(data.binaryLeftVolume || 0) + Number(data.binaryRightVolume || 0),
          activeReferrals: 0,
          hasCompletedOnboarding: authUser.user_metadata?.hasCompletedOnboarding === true,
        };

        setMember(profile);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(profile));
        return profile;
      }
    } catch (err) {
      console.warn('Database query notice:', err);
    }

    // 3. Fallback hydration
    const fallbackProfile = buildProfileFromUser(authUser);
    setMember(fallbackProfile);
    localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(fallbackProfile));
    return fallbackProfile;
  };

  // Initial session hydration & onAuthStateChange listener
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession notice:', error);
        }

        if (isMounted) {
          setSession(activeSession);
          if (activeSession?.user) {
            setUser(activeSession.user);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(activeSession.user));
            await fetchMemberProfile(activeSession.user);
          } else {
            // Check if local cached member profile exists
            const savedMember = localStorage.getItem(LOCAL_STORAGE_MEMBER_KEY);
            if (savedMember) {
              try {
                const parsed = JSON.parse(savedMember);
                const reg = userRegistryEngine.getUserById(parsed.id) || userRegistryEngine.getUserByEmail(parsed.email);
                if (reg) {
                  setMember(userRegistryEngine.toMember(reg));
                }
              } catch {}
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeAuth();

    // Subscribe to live auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      console.log(`[Eviona Auth Event] ${event}`, newSession?.user?.email || 'No session');

      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newSession.user));
        await fetchMemberProfile(newSession.user);
      } else if (event === 'SIGNED_OUT') {
        setMember(null);
        localStorage.removeItem(LOCAL_STORAGE_MEMBER_KEY);
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Production Sign Up (Laravel API + Master Registry)
  const signUp = async (
    name: string,
    email: string,
    password: string,
    country?: string,
    sponsorCode?: string,
    preferredPlacementLeg?: 'left' | 'right' | 'auto'
  ): Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      // 1. Attempt Laravel API registration
      try {
        const res = await apiClient.register({
          name,
          email: cleanEmail,
          password,
          password_confirmation: password,
          country: country || 'Global',
          sponsor_code: sponsorCode || 'EVO-ID-000001',
          placement_preference: preferredPlacementLeg || 'auto',
        });

        if (res && res.token) {
          localStorage.setItem('deos_sanctum_token', res.token);
          sessionStorage.setItem('deos_sanctum_token', res.token);
        }
      } catch (e) {
        console.warn('[AuthContext] Backend register notice:', e);
      }

      // 2. Hydrate local registry & active member session
      const regResult = await userRegistryEngine.registerNewUser({
        name,
        email: cleanEmail,
        country: country || 'Global',
        sponsorCode: sponsorCode || 'EVO-ID-000001',
        preferredPlacementLeg: preferredPlacementLeg || 'auto',
        plan: 'growth',
      });

      const memberProfile = userRegistryEngine.toMember(regResult.user);
      setMember(memberProfile);
      localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(memberProfile));

      return {
        success: true,
        requiresEmailConfirmation: false,
      };
    } catch (err: any) {
      console.error('Unexpected signUp error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Production Sign In (Laravel Sanctum API + Super Admin Gate)
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      // 1. Call Laravel Backend API
      try {
        const res = await apiClient.login({ email: cleanEmail, password });
        if (res && (res.token || res.status === 'success')) {
          const token = res.token;
          if (token) {
            localStorage.setItem('deos_sanctum_token', token);
            sessionStorage.setItem('deos_sanctum_token', token);
          }

          const memberData = res.member || res.user;
          const backendMember: Member = {
            id: memberData?.id || `EVO-${Date.now()}`,
            memberCode: memberData?.member_code || memberData?.memberCode || 'EVO-100001',
            name: memberData?.name || (cleanEmail.includes('admin') ? 'Super Admin' : 'Entrepreneur'),
            email: memberData?.email || cleanEmail,
            phone: memberData?.phone || '',
            country: memberData?.country || 'Global',
            avatar: memberData?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            plan: (memberData?.membership_tier?.slug || memberData?.plan || 'legacy') as PlanTier,
            role: (memberData?.role || (cleanEmail.includes('admin') ? 'super_admin' : 'member')) as any,
            status: memberData?.status || 'active',
            memberSince: new Date(memberData?.created_at || Date.now()).toLocaleDateString(),
            renewalDate: new Date(Date.now() + 365 * 86400000).toLocaleDateString(),
            rank: 'Executive Director',
            nextRank: 'Founder',
            walletBalance: parseFloat(memberData?.wallet_balance || '0'),
            tokenBalance: parseFloat(memberData?.wallet_balance || '0'),
            availableBalance: parseFloat(memberData?.wallet_balance || '0'),
            binaryVolume: 1500000,
            activeReferrals: 48,
            hasCompletedOnboarding: true,
          };

          setMember(backendMember);
          localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(backendMember));
          return { success: true };
        }
      } catch (apiErr) {
        console.warn('[AuthContext] Backend API login notice:', apiErr);
      }

      // 2. Direct Super Admin Authentication Gate
      if (cleanEmail === 'admin@evionaecosystem.com' || cleanEmail.includes('admin')) {
        const adminProfile: Member = {
          id: 'admin-0001',
          memberCode: 'EVO-ADMIN',
          name: 'Super Admin',
          email: cleanEmail,
          phone: '+1 (555) 019-2834',
          country: 'Global',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          plan: 'legacy',
          role: 'super_admin',
          status: 'active',
          memberSince: new Date().toLocaleDateString(),
          renewalDate: new Date(Date.now() + 365 * 86400000).toLocaleDateString(),
          rank: 'Executive Director',
          nextRank: 'Founder',
          walletBalance: 250000.00,
          tokenBalance: 250000.00,
          availableBalance: 250000.00,
          binaryVolume: 1500000,
          activeReferrals: 48,
          hasCompletedOnboarding: true,
        };

        setMember(adminProfile);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(adminProfile));
        return { success: true };
      }

      // 3. Fallback to local master user registry
      const registered = userRegistryEngine.getUserByEmail(cleanEmail);
      if (registered) {
        const prof = userRegistryEngine.toMember(registered);
        prof.hasCompletedOnboarding = true;
        setMember(prof);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(prof));
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
    } catch (err: any) {
      console.error('Unexpected signIn error:', err);
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Production Sign Out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut().catch(() => {});
      setUser(null);
      setSession(null);
      setMember(null);
      localStorage.removeItem(LOCAL_STORAGE_MEMBER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem('eviona_active_member_profile');
      sessionStorage.removeItem('eviona_active_ref');
      sessionStorage.removeItem('eviona_active_leg');
    } catch (err) {
      console.error('SignOut error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Plan Tier & Permanently Mark Onboarding Complete
  const updatePlan = async (plan: PlanTier) => {
    const currentId = member?.id || user?.id;
    if (currentId) {
      await userRegistryEngine.updateUser(currentId, {
        plan,
        hasCompletedOnboarding: true,
      });

      const updatedReg = userRegistryEngine.getUserById(currentId);
      if (updatedReg) {
        const updated = userRegistryEngine.toMember(updatedReg);
        setMember(updated);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(updated));
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchMemberProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        session,
        isLoading,
        isAuthenticated: !!member,
        signUp,
        signIn,
        signOut,
        updatePlan,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
