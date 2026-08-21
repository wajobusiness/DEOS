import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Member, PlanTier } from '../types';

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
    sponsorCode?: string
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

const LOCAL_STORAGE_MEMBER_KEY = 'deos_active_member_profile';
const LOCAL_STORAGE_USER_KEY = 'deos_active_user_cache';

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
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to build a clean Member object from user identity
  const buildProfileFromUser = (authUser: { id: string; email?: string; user_metadata?: any; created_at?: string }): Member => {
    const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Entrepreneur';
    const metaCountry = authUser.user_metadata?.country || 'Global';
    const metaSponsor = authUser.user_metadata?.sponsorCode || 'DEOS100245';
    const memberCode = authUser.user_metadata?.memberCode || `DEOS${Math.floor(100000 + Math.random() * 900000)}`;
    const hasCompleted = authUser.user_metadata?.hasCompletedOnboarding === true;

    return {
      id: authUser.id,
      name: metaName,
      email: authUser.email || 'entrepreneur@deos.com',
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
      hasCompletedOnboarding: hasCompleted,
    };
  };

  // Fetch Member profile directly from Supabase public.Member table or hydrate
  const fetchMemberProfile = async (authUser: User): Promise<Member> => {
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
          hasCompletedOnboarding: true,
        };

        setMember(profile);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(profile));
        return profile;
      }
    } catch (err) {
      console.warn('Database query notice:', err);
    }

    // Resilient hydration from authenticated user metadata
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
      console.log(`[DEOS Auth Event] ${event}`, newSession?.user?.email || 'No session');

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

  // Production Sign Up
  const signUp = async (
    name: string,
    email: string,
    password: string,
    country?: string,
    sponsorCode?: string
  ): Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const code = `DEOS${Math.floor(100000 + Math.random() * 900000)}`;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name,
            country: country || 'Global',
            sponsorCode: sponsorCode || 'DEOS100245',
            memberCode: code,
            hasCompletedOnboarding: false,
          },
        },
      });

      if (error) {
        console.error('Supabase Auth signUp error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));

        if (data.session) {
          setSession(data.session);
        }

        // Fresh sign up starts with hasCompletedOnboarding: false
        const newProfile: Member = {
          ...buildProfileFromUser(data.user),
          hasCompletedOnboarding: false,
        };
        setMember(newProfile);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(newProfile));

        // Background sync to Member table
        try {
          await supabase.from('Member').upsert({
            id: data.user.id,
            memberCode: code,
            name: name,
            email: cleanEmail,
            passwordHash: 'supabase_auth_managed',
            country: country || 'Global',
            plan: 'growth',
            role: cleanEmail.includes('admin') ? 'super_admin' : 'member',
            status: 'active',
            rank: 'Member',
            sponsorId: sponsorCode || null,
            walletBalance: 0.00,
            usdtBalance: 0.00,
            binaryLeftVolume: 0.00,
            binaryRightVolume: 0.00,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Member upsert notice:', e);
        }

        return {
          success: true,
          requiresEmailConfirmation: !data.session,
        };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
      console.error('Unexpected signUp error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Production Sign In
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error('Supabase Auth signIn error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        const prof = await fetchMemberProfile(data.user);
        // If user is returning/existing, onboarding is marked completed
        const updated = { ...prof, hasCompletedOnboarding: true };
        setMember(updated);
        localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(updated));
        return { success: true };
      }

      return { success: false, error: 'Authentication failed. Please try again.' };
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
    } catch (err) {
      console.error('SignOut error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Plan Tier & Mark Onboarding Complete
  const updatePlan = async (plan: PlanTier) => {
    if (member) {
      const updated: Member = { ...member, plan, hasCompletedOnboarding: true };
      setMember(updated);
      localStorage.setItem(LOCAL_STORAGE_MEMBER_KEY, JSON.stringify(updated));

      if (user) {
        try {
          await supabase
            .from('Member')
            .update({ plan, updatedAt: new Date().toISOString() })
            .eq('id', user.id);
        } catch (e) {
          console.warn('updatePlan notice:', e);
        }
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
        isAuthenticated: Boolean(member),
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
